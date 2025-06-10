// const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const config = require(`../../config`)
// const CommandStatus = require('../../schemas/Command_Status');
// const { rowHi } = require("../../ButtonPlace/ActionRowBuilder");
// const { createHiEmbed } = require(`../../Embeds/embedsCreate`);

// module.exports = {
//     data: {
//         name: 'CHÀO THÀNH VIÊN',
//         type: ApplicationCommandType.User,
//     },
//     async execute(interaction, client) {
//         if (!interaction.isUserContextMenuCommand()) return;

//         // Kiểm tra trạng thái của ngữ cảnh
//         const commandStatus = await CommandStatus.findOne({ command: 'CHÀO THÀNH VIÊN' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện ngữ cảnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
//         }

//         if (interaction.commandName === 'CHÀO THÀNH VIÊN') {

//             // Đánh dấu tương tác để tránh lỗi "Ứng dụng không phản hồi"
//             await interaction.deferReply({ ephemeral: true });

//             // Kiểm tra xem bot có các quyền cần thiết hay không
//             const botMember = interaction.guild.members.cache.get(client.user.id);
//             const requiredPermissions = [
//                 PermissionsBitField.Flags.SendMessages,
//                 PermissionsBitField.Flags.EmbedLinks,
//                 PermissionsBitField.Flags.UseExternalEmojis,
//                 PermissionsBitField.Flags.SendMessagesInThreads,
//                 PermissionsBitField.Flags.CreatePublicThreads,
//                 PermissionsBitField.Flags.AddReactions
//             ];

//             if (!botMember.permissions.has(requiredPermissions)) {
//                 // Gửi thông báo vào kênh nếu bot thiếu quyền
//                 await interaction.channel.send({ content: config.BotPermissions });
//                 // Xóa phản hồi đã trì hoãn
//                 await interaction.deleteReply();
//                 return;
//             }

//             // Kiểm tra xem người dùng có các quyền cần thiết hay không
//             if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                 // Gửi thông báo vào kênh nếu người dùng không có quyền
//                 await interaction.channel.send({ content: config.OwnerPermissions });
//                 // Xóa phản hồi đã trì hoãn
//                 await interaction.deleteReply();
//                 return;
//             }

//         try {
//                 const embed = createHiEmbed(interaction);

//                 const row = rowHi(interaction);

//                 // Gửi tin nhắn với hoặc không có nút
//                 if (row) {
//                     await interaction.channel.send({ embeds: [embed], components: [row] });
//                 } else {
//                     await interaction.channel.send({ embeds: [embed] });
//                 }
//                 // Xóa phản hồi đã trì hoãn
//                 await interaction.deleteReply();
//             } catch (error) {
//                 console.error('Lỗi xử lý tương tác:', error);
//                 // Xử lý lỗi nếu xảy ra
//                 await interaction.channel.send({ content: 'Đã xảy ra lỗi khi gửi tin nhắn chúc mừng.' });
//                 // Xóa phản hồi đã trì hoãn
//                 await interaction.deleteReply();
//             }
//         }
//     },
// };



const { ApplicationCommandType, PermissionsBitField } = require('discord.js');
const config = require(`../../config`);
const CommandStatus = require('../../schemas/Command_Status');
const { rowHi } = require("../../ButtonPlace/ActionRowBuilder");
const { createHiEmbed } = require(`../../Embeds/embedsCreate`);

module.exports = {
    data: {
        name: 'CHÀO THÀNH VIÊN',
        type: ApplicationCommandType.User,
    },
    async execute(interaction, client) {
        // console.log("Lệnh CHÀO THÀNH VIÊN được gọi.");

        if (!interaction.isUserContextMenuCommand()) {
            // console.log("Tương tác không phải là UserContextMenuCommand, thoát.");
            return;
        }

        // Kiểm tra trạng thái của lệnh
        // console.log("Kiểm tra trạng thái lệnh trong database...");
        const commandStatus = await CommandStatus.findOne({ command: 'CHÀO THÀNH VIÊN' });
        // console.log("Trạng thái lệnh:", commandStatus ? commandStatus.status : "Không tìm thấy");

        if (commandStatus && commandStatus.status === 'off') {
            // console.log("Lệnh đang tắt, gửi thông báo.");
            return interaction.reply('Ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
        }

        // Kiểm tra quyền ADMIN của người dùng
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            // console.log("Người dùng không có quyền ADMINISTRATOR, dừng lệnh.");
            return await interaction.reply({ content: config.OwnerPermissions, ephemeral: true });
        }

        // Kiểm tra quyền ADMIN của bot
        const botMember = await interaction.guild.members.fetchMe();
        if (!botMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
            // console.log("Bot không có quyền ADMINISTRATOR, dừng lệnh.");
            return await interaction.reply({ content: '❌ Bot cần có quyền ADMIN để thực hiện lệnh này.', ephemeral: true });
        }

        if (interaction.commandName === 'CHÀO THÀNH VIÊN') {
            // console.log("Xác nhận lệnh CHÀO THÀNH VIÊN.");

            // Đánh dấu tương tác
            await interaction.deferReply({ ephemeral: true });
            // console.log("Tương tác đã được defer.");

            // // Kiểm tra quyền bot
            // console.log("Kiểm tra quyền của bot...");
            // const botMember = interaction.guild.members.cache.get(client.user.id);
            // const requiredPermissions = [
            //     PermissionsBitField.Flags.SendMessages,
            //     PermissionsBitField.Flags.EmbedLinks,
            //     PermissionsBitField.Flags.UseExternalEmojis,
            //     PermissionsBitField.Flags.SendMessagesInThreads,
            //     PermissionsBitField.Flags.CreatePublicThreads,
            //     PermissionsBitField.Flags.AddReactions
            // ];

            // if (!botMember.permissions.has(requiredPermissions)) {
            //     console.log("Bot thiếu quyền, gửi thông báo.");
            //     await interaction.channel.send({ content: config.BotPermissions });
            //     await interaction.deleteReply();
            //     return;
            // }
            // console.log("Bot có đầy đủ quyền.");

            // // Kiểm tra quyền người dùng
            // console.log("Kiểm tra quyền của người dùng...");
            // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            //     console.log("Người dùng không có quyền Admin, gửi thông báo.");
            //     await interaction.channel.send({ content: config.OwnerPermissions });
            //     await interaction.deleteReply();
            //     return;
            // }
            // console.log("Người dùng có quyền Admin.");

            try {
                // console.log("Tạo embed chào thành viên...");
                const embed = createHiEmbed(interaction);
                // console.log("Embed tạo thành công:", embed);

                // console.log("Tạo hàng nút...");
                const row = rowHi(interaction);
                // console.log("Hàng nút tạo thành công:", row);

                // Gửi tin nhắn
                if (row) {
                    // console.log("Gửi tin nhắn có nút...");
                    await interaction.channel.send({ embeds: [embed], components: [row] });
                } else {
                    // console.log("Gửi tin nhắn không có nút...");
                    await interaction.channel.send({ embeds: [embed] });
                }
                // console.log("Tin nhắn đã được gửi thành công.");

                await interaction.deleteReply();
            } catch (error) {
                console.error('Lỗi xử lý tương tác:', error);
                await interaction.channel.send({ content: 'Đã xảy ra lỗi khi gửi tin nhắn chúc mừng.' });
                await interaction.deleteReply();
            }
        }
    },
};

