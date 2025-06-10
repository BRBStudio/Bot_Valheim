const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const Blacklist = require('../../schemas/blacklistSchema');
const config = require(`../../config`)
const { createEmojiEmbed } = require(`../../Embeds/embedsCreate`)
const interactionError = require('../../Events/WebhookError/interactionError');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("🔹 Danh sách ID emoji"),

    async execute(interaction, client) {

        try{    

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/emoji' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            const userId = interaction.user.id;
            const guildEmojis = await interaction.guild.emojis.fetch();
            const blacklistedUser = await Blacklist.findOne({ userId });

            const embedbl = await createEmojiEmbed(interaction);

            if (blacklistedUser) {
                return await interaction.reply({ embeds: [embedbl], ephemeral: false });
            }

            const animatedEmojis = guildEmojis.filter(emoji => emoji.animated).map(emoji => ({
                name: `${emoji} • \`\`\`${emoji.name}\`\`\``,
                value: `<a:${emoji.name}:${emoji.id}>`,
                inline: false
            }));

            const staticEmojis = guildEmojis.filter(emoji => !emoji.animated).map(emoji => ({
                name: `${emoji} • \`\`\`${emoji.name}\`\`\``,
                value: `<:${emoji.name}:${emoji.id}>`,
                inline: false
            }));

            const emojiList = [...animatedEmojis, ...staticEmojis];

            const button1 = new ButtonBuilder()
                .setLabel("https://emoji.gg/")
                .setStyle(ButtonStyle.Link)
                .setURL("https://emoji.gg/")
                .setEmoji("<:hanyaCheer:1173363092353200158>");

            const button2 = new ButtonBuilder()
                .setLabel("https://emojidb.org/")
                .setStyle(ButtonStyle.Link)
                .setURL("https://emojidb.org/")
                .setEmoji("<:ech7:1234014842004705360>");

            const actionRow = new ActionRowBuilder()
                .addComponents(button1, button2);

            if (guildEmojis.size === 0) {
                return await interaction.reply({
                    content: `\`\`\`yml\nMáy chủ của bạn không có emoji để lấy ID. Hãy thêm emoji vào máy chủ rồi dùng lại lệnh\n\n» Nếu bạn có nitro, hãy kiểm tra cài đặt người dùng > Nitro để biết chi tiết\n\n» Nếu bạn không có nitro, vậy hãy thêm chúng bằng thủ công:\n-----------------------------------------------------------------------------------------------\n    ⚙️ Cài đặt máy chủ\n\n    👉 Sau đó vào mục emoji rồi nhấp vào tải lên emoji\n-----------------------------------------------------------------------------------------------\n👇 Dưới đây là 1 số trang hỗ trợ lấy emoji. nhấp vào chúng\`\`\``,
                    components: [actionRow]
                });
            }

            await interaction.deferReply({ ephemeral: true });

            const totalPages = Math.ceil(emojiList.length / 25);

            function chunkArray(myArray, chunk_size) {
                let index = 0;
                let arrayLength = myArray.length;
                let tempArray = [];

                for (index = 0; index < arrayLength; index += chunk_size) {
                    let myChunk = myArray.slice(index, index + chunk_size);
                    tempArray.push(myChunk);
                }

                return tempArray;
            }

            const emojiChunks = chunkArray(emojiList, 25);

            let currentPage = 0;

            const embeds = emojiChunks.map((chunk, index) => {
                const embed = new EmbedBuilder()
                    .setTitle(`Danh sách ID emoji - Trang ${index + 1}`)
                    .setColor(config.embedBlue)
                    .setImage(`https://i.pinimg.com/originals/d6/31/2a/d6312a4610c17a6a0fa43c882502305a.gif`)
                    .setFooter({ text: `Trang ${index + 1} / ${totalPages}` });

                chunk.forEach(emoji => {
                    embed.addFields({ name: emoji.name, value: `\`\`\`yml\n${emoji.value}\`\`\``, inline: false }); // hiển thị trong trường khi dùng lệnh /emoji
                });

                return embed;
            });

            function createActionRow() {
                const previousButton = new ButtonBuilder()
                    .setCustomId("a_page")
                    .setLabel("Trang trước")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0);

                const nextButton = new ButtonBuilder()
                    .setCustomId("b_page")
                    .setLabel("Trang tiếp theo")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages - 1);

                return new ActionRowBuilder().addComponents(previousButton, nextButton);
            }

            async function sendCurrentPage() {
                    await interaction.editReply({
                        embeds: [embeds[currentPage]],
                        components: [createActionRow()],
                    });
            }

            await sendCurrentPage();

            const collector = interaction.channel.createMessageComponentCollector();

            collector.on('collect', async (i) => {
                // try {
                    if (i.customId === 'a_page' && currentPage > 0) {
                        currentPage--;
                    } else if (i.customId === 'b_page' && currentPage < totalPages - 1) {
                        currentPage++;
                    }

                    await i.update({ embeds: [embeds[currentPage]], components: [createActionRow()], ephemeral: true });
                // } catch (error) {
                //     if (error.code && error.code === 10062) {
                //         // Ignore "Unknown interaction" error
                //         return;
                //     }
            
                //     console.error("Error collecting interaction:", error);
                // }
            });

            collector.on('end', () => {
                // try {
                    interaction.editReply({ components: [] });
                // } catch (error) {
                //     if (error.code !== 10008) {
                //         console.error("Error ending collector:", error);
                //     }
                // }
            });
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    }
};
