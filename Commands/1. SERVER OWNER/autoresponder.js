const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Autoresponder = require('../../schemas/autoresponderSchema');
const config = require(`../../config`);
const CommandStatus = require('../../schemas/Command_Status');
const { updateCollectors } = require('../../Handlers/autoresponderHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoresponder')
        .setDescription('🔹 Chọn nội dung bot phản hồi với tin nhắn nào')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('🔹 Thiết lập câu mà bot nghe và phản hồi')
                .addStringOption(option => option.setName('sentence').setDescription('Câu mà bot nghe.').setRequired(true))
                .addStringOption(option => option.setName('response').setDescription('Câu trả lời.').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('🔹 Hiển thị danh sách nội dung bot phản hồi')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-all')
                .setDescription('🔹 Xóa tất cả mọi thứ')
        ),

    async execute(interaction) {
        const commandStatus = await CommandStatus.findOne({ command: '/autoresponder' });

        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const guildId = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();

        // if (subcommand === 'setup') {
        //     const word = interaction.options.getString('sentence').toLowerCase();
        //     const response = interaction.options.getString('response');

        //     // Kiểm tra xem câu hỏi đã tồn tại chưa
        //     const existingResponder = await Autoresponder.findOne({ guildId, questions: word });

        //     if (existingResponder) {
        //         const embed0 = new EmbedBuilder()
        //             .setDescription(`⚠️ Câu "${word}" đã tồn tại trong hệ thống`)
        //             .setColor(`Red`)
        //         return interaction.reply({ embeds: [embed0], ephemeral: true });
        //     }

        //     const newAutoresponder = new Autoresponder({ guildId, questions: [word], answer: [response] });
        //     await newAutoresponder.save();

        //     await updateCollectors(interaction.client, guildId);

        //     const embed = new EmbedBuilder()
        //         .setTitle('Đã thiết lập trả lời tự động!')
        //         .addFields(
        //             { name: 'Câu mà bot nghe:', value: word },
        //             { name: 'Phản ứng tự động:', value: response }
        //         )
        //         .setColor(config.embedFuchsia)
        //         .setTimestamp();

        //     await interaction.reply({ embeds: [embed] });

        // } 
        if (subcommand === 'setup') {
            const word = interaction.options.getString('sentence').toLowerCase();
            const response = interaction.options.getString('response');

            let responder = await Autoresponder.findOne({ guildId });

            if (!responder) {
                responder = new Autoresponder({
                    guildId,
                    questions: [],
                    answer: [],
                });
            }

            if (responder.questions.includes(word)) {
                const embed = new EmbedBuilder()
                    .setDescription(`⚠️ Câu "${word}" đã tồn tại.`)
                    .setColor('Red');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            responder.questions.push(word);
            responder.answer.push(response);
            await responder.save();

            await updateCollectors(interaction.client, guildId);

            const embed = new EmbedBuilder()
                .setTitle('✅ Đã thiết lập trả lời tự động!')
                .addFields(
                { name: 'Câu mà bot nghe:', value: word },
                { name: 'Phản ứng tự động:', value: response }
                )
                .setColor(config.embedFuchsia)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
        // else if (subcommand === 'list') {
        //     const autoresponders = await Autoresponder.find({ guildId });

        //     if (autoresponders.length === 0) {
        //         return interaction.reply('Không có autoresponders nào được cài đặt cho máy chủ này.');
        //     }

        //     const fields = autoresponders.flatMap((autoresponder, index) => [
        //         { name: `Câu mà bot nghe ${index}:`, value: autoresponder.questions[0] },
        //         { name: `Phản ứng tự động ${index}:`, value: autoresponder.answer[0] }
        //     ]);

        //     const embed = new EmbedBuilder()
        //         .setTitle('Danh sách autoresponders')
        //         .setColor(config.embedFuchsia)
        //         .addFields(fields)
        //         .setTimestamp();

        //     await interaction.reply({ embeds: [embed] });

        // } else if (subcommand === 'remove-all') {
        //     await Autoresponder.deleteMany({ guildId });

        //     await updateCollectors(interaction.client, guildId);

        //     await interaction.reply({ content: 'Đã xóa tất cả autoresponders.', ephemeral: true });
        // }

        else if (subcommand === 'list') {
            const responder = await Autoresponder.findOne({ guildId });

            if (!responder || responder.questions.length === 0) {
                return interaction.reply('Không có autoresponder nào trong máy chủ này.');
            }

            const fields = responder.questions.map((question, index) => ({
                name: `#${index + 1} » ${question}`,
                value: responder.answer[index] || '(không có phản hồi)',
            }));


            const numberoffields = 24; // chunkSize
            const pages = Math.ceil(fields.length / numberoffields);
            let currentPage = 0;

            const getEmbed = (p) => {
                const chunk = fields.slice(p * numberoffields, (p + 1) * numberoffields);

                return new EmbedBuilder()
                    .setTitle(`📋 Danh sách autoresponders`)
                    .addFields(chunk)
                    .setColor(config.embedFuchsia)
                    .setFooter({ text: `‎                                                                           Trang ${p + 1}/${pages}` });
            };

            const prevButton = new ButtonBuilder()
                .setCustomId('t')
                .setLabel('⬅️ Trang trước')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);

            const nextButton = new ButtonBuilder()
                .setCustomId('s')
                .setLabel('➡️ Trang sau')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(pages <= 1);

            const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

            const reply = await interaction.reply({
                    embeds: [getEmbed(currentPage)],
                    components: [row],
                    fetchReply: true
                });

            const filter = i => ['t', 's'].includes(i.customId);    

            const collector = reply.createMessageComponentCollector({
                time: 5 * 60 * 1000,
                filter,
            });

            collector.on('collect', async i => {

                // Nếu người tương tác không phải là người dùng đã gọi lệnh
                if (i.user.id !== interaction.user.id) {
                    return i.reply({
                        content: '❌ Chỉ người dùng lệnh mới có thể tương tác với nút này.',
                        ephemeral: true
                    });
                }

                if (i.customId === 't') currentPage--;
                if (i.customId === 's') currentPage++;

                const updatedPrev = ButtonBuilder.from(prevButton).setDisabled(currentPage === 0);
                const updatedNext = ButtonBuilder.from(nextButton).setDisabled(currentPage >= pages - 1);
                const newRow = new ActionRowBuilder().addComponents(updatedPrev, updatedNext);

                await i.update({
                    embeds: [getEmbed(currentPage)],
                    components: [newRow]
                });
            });

            collector.on('end', async () => {
                const disabledRow = new ActionRowBuilder().addComponents(
                    ButtonBuilder.from(prevButton).setDisabled(true),
                    ButtonBuilder.from(nextButton).setDisabled(true)
                );
                await reply.edit({
                    components: [disabledRow]
                }).catch(() => {});
            });


            // const embed = new EmbedBuilder()
            //     .setTitle('📋 Danh sách autoresponders')
            //     .addFields(fields)
            //     .setColor(config.embedFuchsia)
            //     .setTimestamp();

            // await interaction.reply({ embeds: [embed] });
        }

        else if (subcommand === 'remove-all') {
            await Autoresponder.deleteOne({ guildId });

            await updateCollectors(interaction.client, guildId);

            await interaction.reply({ content: '✅ Đã xóa tất cả autoresponders.', ephemeral: true });
        }
    },
};


/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/