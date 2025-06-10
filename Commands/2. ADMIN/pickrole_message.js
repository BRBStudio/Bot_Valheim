const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder, ChannelType } = require(`discord.js`);
const roleSchema = require("../../schemas/roleSchema");
const { COOLDOWN } = require('../../config');
const config = require(`../../config`);
const { checkAdministrator } = require(`../../permissionCheck`);
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    cooldown: COOLDOWN,
    data: new SlashCommandBuilder()
        .setName("pickrole_message")
        .setDescription("🔹 Quản lý tin nhắn chọn vai trò.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("🔹 set tin nhắn để dùng cho pickrole_message.")
                .addStringOption(option =>
                    option.setName("title")
                        .setDescription("Tiêu đề của tin nhắn.")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("description")
                        .setDescription("Chú thích của tin nhắn.")
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Gửi đến kênh nào?")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription("Ảnh to đính kèm (sử dụng link png).")
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('thumbnail')
                        .setDescription("Hình nhỏ của tin nhắn (sử dụng link png).")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("🔹 Xóa tin nhắn theo ID.")
                .addStringOption(option =>
                    option.setName("messageid")
                        .setDescription("ID của tin nhắn.")
                        .setRequired(true))),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: `/pickrole_message_${subcommand}` });
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        if (subcommand === "create") {
            const { options } = interaction;
            const channel = options.getChannel("channel");
            const title = options.getString("title");
            const description = options.getString("description");
            const image = options.getString('image') || 'null';
            const thumbnail = options.getString('thumbnail') || 'null';

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor(config.embedCyan)
                .setDescription(`${description}`)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            if (image && !image.startsWith('http') && image !== 'null') {
                return interaction.reply({ content: '**Ảnh to không hợp lệ!**', ephemeral: true });
            }
            if (thumbnail && !thumbnail.startsWith('http') && thumbnail !== 'null') {
                return interaction.reply({ content: '**Ảnh nhỏ không hợp lệ!**', ephemeral: true });
            }

            if (image !== 'null') embed.setImage(image);
            if (thumbnail !== 'null') embed.setThumbnail(thumbnail);

            const mess = await channel.send({ embeds: [embed] });
            const messid = mess.id;

            const data = await roleSchema.create({
                Guild: interaction.guild.id,
                ChannelID: channel.id,
                MessageID: messid,
                Title: title,
                Description: description,
                Image: image !== 'null' ? image : undefined,
                Thumbnail: thumbnail !== 'null' ? thumbnail : undefined,
            });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.embedCyan)
                        .setTitle(`**Đã thiết lập thành công Thông báo chọn vai trò!**`)
                        .addFields({ name: 'ID Tin nhắn', value: `\`\`\`yml\n${data.MessageID}\`\`\`` })
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }

        if (subcommand === "delete") {
            const messageid = interaction.options.getString("messageid");

            const data = await roleSchema.findOne({ MessageID: messageid });
            if (!data) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(config.embedCyan)
                            .setDescription(`**Không có tin nhắn nào tương ứng với ID đã cung cấp. Chỉ áp dụng với ID tin nhắn từ lệnh /pickrole_message create!**`)
                    ],
                    ephemeral: true
                });
            }

            const channel = await client.channels.fetch(data.ChannelID);
            const message = await channel.messages.fetch(messageid);
            await message.delete();

            await roleSchema.findOneAndDelete({ MessageID: messageid });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.embedCyan)
                        .setDescription(`**Đã xóa tin nhắn tương ứng!**\nĐể thiết lập lại Thông báo chọn vai trò sử dụng \`/pickrole_message create\``)
                ],
                ephemeral: true
            });
        }
    },
};




// const {PermissionsBitField,
//     EmbedBuilder,
//     SlashCommandBuilder,
//     ButtonBuilder,
//     ActionRowBuilder,
//     ButtonStyle,
//     ChannelType
// } = require(`discord.js`);
// const roleSchema = require("../../schemas/roleSchema");
// const { COOLDOWN } = require('../../config');
// const config = require(`../../config`)
// const { checkAdministrator } = require(`../../permissionCheck`)
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     cooldown: COOLDOWN,
//     data: new SlashCommandBuilder()
//         .setName("pickrole_message_create")
//         .setDescription("🔹 Cài đặt vai trò chọn tin nhắn.")
//         .addStringOption(option =>
//             option.setName("title")
//                 .setDescription("Tiêu đề của tin nhắn.")
//                 .setRequired(true))
//         .addStringOption(option =>
//             option.setName("description")
//                 .setDescription("Chú thích của tin nhắn.")
//                 .setRequired(true))
//         .addChannelOption(option =>
//             option.setName("channel")
//                 .setDescription("Gửi đến kênh nào?")
//                 .setRequired(true)
//                 .addChannelTypes(ChannelType.GuildText))
    
//         .addStringOption(option => 
//             option.setName('image')
//             .setDescription(`Ảnh to đính kèm (sử dụng link png).`)
//             .setRequired(false))
    
//         .addStringOption(option => 
//             option.setName('thumbnail')
//             .setDescription(`Hình nhỏ của tin nhắn (sử dụng link png).`)
//             .setRequired(false)),
    
//     async execute(interaction, client) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/pickrole_message_create' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         const { options } = interaction;

//         const hasPermission = await checkAdministrator(interaction);
//         if (!hasPermission) return;

//         const channel = options.getChannel("channel");
//         const title = options.getString("title");
//         const description = options.getString("description");
//         const image = options.getString('image') || 'null';
//         const thumbnail = interaction.options.getString('thumbnail') || 'null';
    

//         const embed = new EmbedBuilder()
//                 .setTitle(title)
//                 .setColor(config.embedCyan)
//                 .setDescription(`${description}`)
//                 .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
//                 .setTimestamp();

//         if (image) {
//                     if (!image.startsWith('http') && image !== 'null') return await interaction.reply({ content: '**Ảnh to không hợp lệ!**', ephemeral: true})
//                 }
//         if (thumbnail) {
//                     if (!thumbnail.startsWith('http') && thumbnail !== 'null') return await interaction.reply({ content: '**Ảnh nhỏ không hợp lệ!**', ephemeral: true})
//                 }
        
//         if (image !== 'null') {
//                     embed.setImage(image)
//                 }
        
//         if (thumbnail !== 'null') {
//                     embed.setThumbnail(thumbnail)
//                 }


//         const mess = await channel.send({ embeds: [embed]});
//         const messid = mess.id;

//         const data = await roleSchema.create({
//             Guild: interaction.guild.id,
//             ChannelID: channel.id,
//             MessageID: messid,
//             Title: title,
//             Description: description,
//         });

//         if (image !== 'null') {
//             await roleSchema.findOneAndUpdate(
//                 {MessageID: messid}, {Image: image}, {new: true}
//             );
//         }
        
//         if (thumbnail !== 'null') {
//         await roleSchema.findOneAndUpdate(
//             {MessageID: messid}, {Thumbnail: thumbnail}, {new: true});
//         }
        
//         await interaction.reply({
//             embeds: [
//                 new EmbedBuilder()
//                     .setColor(config.embedCyan)
//                     .setTitle(`**Đã thiết lập thành công Thông báo chọn vai trò!**`)
//                     .addFields({name:'ID Tin nhắn', value: `\`\`\`yml\n${data.MessageID}\`\`\``})
//                     .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
//                     .setTimestamp()
//             ], 
//             ephemeral:true
//         });
//     },
// };
