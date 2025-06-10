const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const interactionError = require('../../Events/WebhookError/interactionError');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    id: 'ticketCreateSelect',
    async execute(interaction, client) {
        try {

            // Kiểm tra trạng thái của lựa chọn
            const commandStatus = await CommandStatus.findOne({ command: 'ticketCreateSelect' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lựa chọn
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
            }

            // Lấy giá trị được chọn từ menu
            const selectedValue = interaction.values[0];

            // Tạo modal để tạo vé mới
            const modal = new ModalBuilder()
                .setTitle(`TẠO VÉ CỦA BẠN`)
                .setCustomId('ticketModal')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('whyTicket')
                            .setRequired(true)
                            .setPlaceholder('Lý do tạo vé này là gì? bạn nên viết rõ để được hỗ trợ tốt nhất')
                            .setLabel('Tại sao bạn tạo vé này? ( Bắt buộc )')
                            .setStyle(TextInputStyle.Paragraph)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('infoTicket')
                            .setRequired(false)
                            .setPlaceholder('Nếu không có thông tin nào cần bổ sung, vui lòng để trống phần này!')
                            .setLabel('Cung cấp cho tôi bất kỳ tt bổ sung nào')
                            .setStyle(TextInputStyle.Paragraph)
                    )
                );

            // Lưu trữ giá trị được chọn vào một customId mới để xử lý sau
            modal.setCustomId(`ticketModal-${selectedValue}`);
            await interaction.showModal(modal);

        } catch (error) {
            interactionError.execute(interaction, error, client); // Sử dụng phương thức xử lý lỗi của bạn
        }
    },
};



// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
// const ticket = require('../../schemas/ticketSchema'); // Đảm bảo đường dẫn chính xác đến schema ticket
// const pingStaff = require('../../schemas/pingstaffSchema');

// module.exports = {
//     id: 'ticketCreateSelect', // Đặt id giống như id bạn đã sử dụng trong menu lựa chọn

//     async execute(interaction) {
//         const selectedValue = interaction.values[0]; // Lấy giá trị đã chọn từ tương tác

//         try {
//             const user = interaction.user;
//             const data = await ticket.findOne({ Guild: interaction.guild.id });

//             if (!data) {
//                 return await interaction.reply({ content: `Lấy làm tiếc! Có vẻ như bạn đã tìm thấy thông báo này nhưng hệ thống vé vẫn chưa được thiết lập ở đây.`, ephemeral: true });
//             } else {
//                 const why = "Lý do mẫu"; // Chỉnh sửa lại logic để lấy lý do
//                 const info = "Thông tin mẫu"; // Chỉnh sửa lại logic để lấy thông tin bổ sung
//                 const category = await interaction.guild.channels.cache.get(data.Category);

//                 // Tăng số vé hiện tại dựa trên loại vé đã chọn
//                 data.currentTicketNumber += 1;
//                 if (selectedValue === 'discordTicket') {
//                     data.currentDiscordTicketNumber += 1;
//                 } else if (selectedValue === 'gameTicket') {
//                     data.currentGameTicketNumber += 1;
//                 }
//                 await data.save();

//                 const ticketNumber = selectedValue === 'discordTicket'
//                     ? data.currentDiscordTicketNumber.toString().padStart(5, '0')
//                     : data.currentGameTicketNumber.toString().padStart(5, '0');

//                 let channelName = `ticket-${ticketNumber}`;
//                 if (selectedValue === 'discordTicket') {
//                     channelName = `discord-${ticketNumber}`;
//                 } else if (selectedValue === 'gameTicket') {
//                     channelName = `game-${ticketNumber}`;
//                 }

//                 const pingStaffData = await pingStaff.findOne({ Guild: interaction.guild.id });
//                 if (!pingStaffData) return await interaction.reply({ content: `🚫 Không tìm thấy thông tin vai trò trong hệ thống. Vui lòng dùng lệnh /ping-staff manage để thêm vai trò hỗ trợ cho kênh`, ephemeral: true });

//                  // Kiểm tra sự tồn tại của các vai trò trong server
//                 const validRoles = pingStaffData.Roles.filter(role => interaction.guild.roles.cache.has(role.RoleID));
//                 if (validRoles.length === 0) {
//                     return await interaction.reply({ content: `Không có vai trò nào hợp lệ để thêm vào kênh. Hãy chắc chắn rằng các vai trò được thiết lập không bị xóa khỏi máy chủ.`, ephemeral: true });
//                 }

//                 const roleOverwrites = validRoles.map(role => ({
//                     id: role.RoleID,
//                     allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
//                 }));

//                 const channel = await interaction.guild.channels.create({
//                     name: channelName,
//                     type: ChannelType.GuildText,
//                     topic: `Người Sử dụng vé: ${user.id}\nLý do tạo vé: ${why}`,
//                     parent: category,
//                     permissionOverwrites: [
//                         {
//                             id: interaction.guild.id,
//                             deny: [PermissionsBitField.Flags.ViewChannel]
//                         },
//                         {
//                             id: interaction.user.id,
//                             allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
//                         },
//                         ...roleOverwrites
//                     ]
//                 });

//                 const embed = new EmbedBuilder()
//                     .setColor("Blurple")
//                     .setTitle(`Vé từ ${user.username} 🎫`)
//                     .setDescription(`Lý do mở đầu: ${why}\n\nThông tin bổ sung: ${info}`)
//                     .setTimestamp();

//                 const buttonRow = new ActionRowBuilder()
//                     .addComponents(
//                         new ButtonBuilder()
//                             .setCustomId('closeTicket')
//                             .setLabel(`🔐 Đóng vé`)
//                             .setStyle(ButtonStyle.Danger),
//                         new ButtonBuilder()
//                             .setCustomId('ticketTranscript')
//                             .setLabel('📜 Nhật ký trò chuyện')
//                             .setStyle(ButtonStyle.Primary)
//                     );

//                 await channel.send({ embeds: [embed], components: [buttonRow] });
//                 await interaction.reply({ content: `✨ Vé của bạn đã được mở trong ${channel}`, ephemeral: true });
//             }
//         } catch (error) {
//             console.error('Lỗi khi xử lý lựa chọn vé:', error);
//             await interaction.reply({ content: "Đã xảy ra lỗi khi xử lý vé. Vui lòng thử lại sau.", ephemeral: true });
//         }
//     }
// };



































// // const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');
// // const ticket = require('../../schemas/ticketSchema'); // Đảm bảo đường dẫn chính xác đến schema ticket
// // const pingStaff = require('../../schemas/pingstaffSchema');

// // module.exports = {
// //     id: 'ticketCreateSelect', // Đặt id giống như id bạn đã sử dụng trong menu lựa chọn

// //     async execute(interaction) {
// //         const selectedValue = interaction.values[0]; // Lấy giá trị đã chọn từ tương tác

// //         try {
// //             const user = interaction.user;
// //             const data = await ticket.findOne({ Guild: interaction.guild.id });

// //             if (!data) {
// //                 return await interaction.reply({ content: `Lấy làm tiếc! Có vẻ như bạn đã tìm thấy thông báo này nhưng hệ thống vé vẫn chưa được thiết lập ở đây.`, ephemeral: true });
// //             } else {
// //                 const why = "Lý do mẫu"; // Chỉnh sửa lại logic để lấy lý do
// //                 const info = "Thông tin mẫu"; // Chỉnh sửa lại logic để lấy thông tin bổ sung
// //                 const category = await interaction.guild.channels.cache.get(data.Category);

// //                 // Tăng số vé hiện tại dựa trên loại vé đã chọn
// //                 data.currentTicketNumber += 1;
// //                 if (selectedValue === 'discordTicket') {
// //                     data.currentDiscordTicketNumber += 1;
// //                 } else if (selectedValue === 'gameTicket') {
// //                     data.currentGameTicketNumber += 1;
// //                 }
// //                 await data.save();

// //                 const ticketNumber = selectedValue === 'discordTicket'
// //                     ? data.currentDiscordTicketNumber.toString().padStart(5, '0')
// //                     : data.currentGameTicketNumber.toString().padStart(5, '0');

// //                 let channelName = `ticket-${ticketNumber}`;
// //                 if (selectedValue === 'discordTicket') {
// //                     channelName = `discord-${ticketNumber}`;
// //                 } else if (selectedValue === 'gameTicket') {
// //                     channelName = `game-${ticketNumber}`;
// //                 }

// //                 const pingStaffData = await pingStaff.findOne({ Guild: interaction.guild.id });
// //                 if (!pingStaffData) return await interaction.reply({ content: `🚫 Không tìm thấy thông tin vai trò trong hệ thống. Vui lòng dùng lệnh /ping-staff manage để thêm vai trò hỗ trợ cho kênh`, ephemeral: true });

// //                  // Kiểm tra sự tồn tại của các vai trò trong server
// //                 // const validRoles = pingStaffData.Roles.filter(role => interaction.guild.roles.cache.has(role.RoleID));
// //                 const validRoles = pingStaffData.Roles.filter(role => interaction.guild.roles.cache.has(role.RoleID) && role.ChannelType === (selectedValue === 'discordTicket' ? 'discord-' : 'game-'));
// //                 if (validRoles.length === 0) {
// //                     return await interaction.reply({ content: `Không có vai trò nào hợp lệ để thêm vào kênh. Hãy chắc chắn rằng các vai trò được thiết lập không bị xóa khỏi máy chủ.`, ephemeral: true });
// //                 }

// //                 const roleOverwrites = validRoles.map(role => ({
// //                     id: role.RoleID,
// //                     allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
// //                 }));

// //                 const channel = await interaction.guild.channels.create({
// //                     name: channelName,
// //                     type: ChannelType.GuildText,
// //                     topic: `Người Sử dụng vé: ${user.id}\nLý do tạo vé: ${why}`,
// //                     parent: category,
// //                     permissionOverwrites: [
// //                         {
// //                             id: interaction.guild.id,
// //                             deny: [PermissionsBitField.Flags.ViewChannel]
// //                         },
// //                         {
// //                             id: interaction.user.id,
// //                             allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
// //                         },
// //                         ...roleOverwrites
// //                     ]
// //                 });

// //                 const embed = new EmbedBuilder()
// //                     .setColor("Blurple")
// //                     .setTitle(`Vé từ ${user.username} 🎫`)
// //                     .setDescription(`Lý do mở đầu: ${why}\n\nThông tin bổ sung: ${info}`)
// //                     .setTimestamp();

// //                 const buttonRow = new ActionRowBuilder()
// //                     .addComponents(
// //                         new ButtonBuilder()
// //                             .setCustomId('closeTicket')
// //                             .setLabel(`🔐 Đóng vé`)
// //                             .setStyle(ButtonStyle.Danger),
// //                         new ButtonBuilder()
// //                             .setCustomId('ticketTranscript')
// //                             .setLabel('📜 Nhật ký trò chuyện')
// //                             .setStyle(ButtonStyle.Primary)
// //                     );

// //                 await channel.send({ embeds: [embed], components: [buttonRow] });
// //                 await interaction.reply({ content: `✨ Vé của bạn đã được mở trong ${channel}`, ephemeral: true });
// //             }
// //         } catch (error) {
// //             console.error('Lỗi khi xử lý lựa chọn vé:', error);
// //             await interaction.reply({ content: "Đã xảy ra lỗi khi xử lý vé. Vui lòng thử lại sau.", ephemeral: true });
// //         }
// //     }
// // };



