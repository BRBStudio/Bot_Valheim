// const { ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const { createCanvas, loadImage } = require('canvas');
// const MessageCount = require('../../schemas/numbermess');
// const VoiceTime = require('../../schemas/numbervoice');
// const interactionError = require('../../Events/WebhookError/interactionError');

// module.exports = {
//     id: 'topselectmenu',
//     async execute(interaction, client) {

//         try {

//             const guildName = interaction.guild.name;
//             const guildId = interaction.guild.id;

//             // Lấy lựa chọn người dùng
//             const selectedValue = interaction.values[0];
            
//             // Hàm tạo hình ảnh thống kê
//             async function createStatsImage(page, selectedValue) {
//                 const canvas = createCanvas(1100, 700);
//                 const ctx = canvas.getContext('2d');

//                 function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, textColor = null, text = null) {
//                     ctx.fillStyle = bgColor;
//                     ctx.beginPath();
//                     ctx.moveTo(x + radius, y);
//                     ctx.lineTo(x + width - radius, y);
//                     ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//                     ctx.lineTo(x + width, y + height - radius);
//                     ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//                     ctx.lineTo(x + radius, y + height);
//                     ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//                     ctx.lineTo(x, y + radius);
//                     ctx.quadraticCurveTo(x, y, x + radius, y);
//                     ctx.closePath();
//                     ctx.fill();

//                     if (text && textColor) {
//                         ctx.fillStyle = textColor;
//                         ctx.font = '25px Roboto';
//                         const textWidth = ctx.measureText(text).width;
//                         const textX = x + (width - textWidth) / 2;
//                         const textY = y + (height + 20) / 2;
//                         ctx.fillText(text, textX, textY);
//                     }
//                 }

//                 function calculateBoxWidth(ctx, text, buffer = 15) {
//                     ctx.font = '25px Roboto';
//                     const textWidth = ctx.measureText(text).width;
//                     return textWidth + buffer * 2;
//                 }

//                 drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 40, '#1e1e1e');

//                 ctx.fillStyle = '#FFFFFF';
//                 ctx.font = '40px Roboto';
//                 ctx.fillText(`${guildName}`, 10, 50);
//                 ctx.fillStyle = '#FFFFFF';
//                 ctx.font = '25px Roboto';
//                 ctx.fillText('🔰 Thống kê hàng đầu', 10, 85);
//                 ctx.font = '30px Arial';
//                 ctx.fillStyle = '#00FFFF';

//                 if (selectedValue === 'message') {
//                     ctx.fillText('💬 Top Tin Nhắn:', 10, 135);
//                 } else if (selectedValue === 'voice') {
//                     ctx.fillText('🔊 Top Giọng Nói:', 10, 135);
//                 }

//                 ctx.font = '25px Arial';
//                 ctx.fillStyle = '#ffffff';
//                 ctx.fillText('Tổng quan máy chủ', 10, 675);
//                 ctx.fillText(`${client.user.username}`, 920, 675);

//                 const botAvatar = await loadImage(client.user.displayAvatarURL({ extension: 'png', size: 128 }));
//                 const avatarX = 875;
//                 const avatarY = 650;
//                 const avatarRadius = 17.5;
//                 ctx.save();
//                 ctx.beginPath();
//                 ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2, true);
//                 ctx.closePath();
//                 ctx.clip();
//                 ctx.drawImage(botAvatar, avatarX, avatarY, 35, 35);
//                 ctx.restore();

//                 let stats = [];
//                 const limit = 14;
//                 const skip = (page - 1) * limit;

//                 if (selectedValue === 'message') {
//                     const messagesData = await MessageCount.find({ guildId }).sort({ numberMessages: -1 }).skip(skip).limit(limit);
//                     stats = Array.from({ length: limit }, (v, i) => {
//                         const entry = messagesData[i];
//                         return entry
//                             ? { name: entry.displayName || `User ${skip + i + 1}`, count: `${entry.numberMessages} M` }
//                             : { name: 'N/A', count: '0 M' };
//                     });
//                 } else if (selectedValue === 'voice') {
//                     const voiceData = await VoiceTime.find({ guildId }).sort({ time: -1 }).skip(skip).limit(limit);
//                     stats = Array.from({ length: limit }, (v, i) => {
//                         const entry = voiceData[i];
//                         return entry
//                             ? { name: entry.displayName || `User ${skip + i + 1}`, time: `${entry.TimeVoice} H` }
//                             : { name: 'N/A', time: '0 H' };
//                     });
//                 }

//                 function drawStats(stats, startY) {
//                     let columnX = 10;
//                     let currentY = startY;
//                     stats.forEach((user, index) => {
//                         if (index === 7) {
//                             columnX = canvas.width / 2 + 30;
//                             currentY = startY;
//                         }

//                         const valueBoxWidth = calculateBoxWidth(ctx, user.count || user.time);

//                         drawRoundedRect(ctx, columnX, currentY, 500, 63, 15, '#2c2f33');

//                         const numberText = user.name !== 'N/A' ? `${skip + index + 1}` : '';
//                         const numberBoxWidth = calculateBoxWidth(ctx, numberText, 10);

//                         drawRoundedRect(ctx, columnX, currentY, numberBoxWidth, 65, 15, '#000000');

//                         ctx.font = '25px Roboto';
//                         ctx.fillStyle = '#ffffff';
//                         const numberX = columnX + (numberBoxWidth - ctx.measureText(numberText).width) / 2;
//                         const numberY = currentY + 40;
//                         ctx.fillText(numberText, numberX, numberY);

//                         drawRoundedRect(
//                             ctx,
//                             columnX + 491 - valueBoxWidth,
//                             currentY + 8,
//                             valueBoxWidth,
//                             50,
//                             10,
//                             '#2196f3',
//                             '#ffffff',
//                             user.count || user.time
//                         );

//                         ctx.fillStyle = '#ffffff';
//                         ctx.font = '25px Arial';
//                         ctx.fillText(user.name, columnX + 60, currentY + 40);

//                         currentY += 72;
//                     });
//                 }

//                 drawStats(stats, 150);
//                 return new AttachmentBuilder(canvas.toBuffer(), { name: 'server-stats.png' });
//             }

//             let currentPage = 1;
//             const attachment = await createStatsImage(currentPage, selectedValue);

//             const button1 = new ButtonBuilder()
//                 .setCustomId(`${selectedValue}-first`)
//                 .setStyle(ButtonStyle.Primary)
//                 .setLabel('Trang đầu');
//             const button2 = new ButtonBuilder()
//                 .setCustomId(`${selectedValue}-prev`)
//                 .setStyle(ButtonStyle.Primary)
//                 .setLabel('Trang trước');
//             const button3 = new ButtonBuilder()
//                 .setCustomId(`${selectedValue}-page`)
//                 .setStyle(ButtonStyle.Secondary)
//                 .setLabel(`Trang: ${currentPage}`)
//                 .setDisabled(true);
//             const button4 = new ButtonBuilder()
//                 .setCustomId(`${selectedValue}-next`)
//                 .setStyle(ButtonStyle.Primary)
//                 .setLabel('Trang sau');
//             const button5 = new ButtonBuilder()
//                 .setCustomId(`${selectedValue}-last`)
//                 .setStyle(ButtonStyle.Primary)
//                 .setLabel('Trang cuối');

//             const selectMenu = new StringSelectMenuBuilder()
//                 .setCustomId('top-select-menu')
//                 .setPlaceholder('Chọn loại thống kê bạn muốn xem')
//                 .addOptions([
//                     {
//                         label: '💬 Tin nhắn',
//                         description: 'Xem thống kê tin nhắn hàng đầu',
//                         value: 'message',
//                     },
//                     {
//                         label: '🔊 Voice',
//                         description: 'Xem thống kê hoạt động voice hàng đầu',
//                         value: 'voice',
//                     },
//                 ]);

//             const row = new ActionRowBuilder().addComponents(button1, button2, button3, button4, button5);
//             const row1 = new ActionRowBuilder().addComponents(selectMenu);

//             await interaction.update({ files: [attachment], components: [row, row1] });

//             const filter = (i) => i.user.id === interaction.user.id;

//             const collector = interaction.channel.createMessageComponentCollector({ filter });

//             collector.on('collect', async (i) => {
//                 if (i.user.id !== interaction.user.id) {
//                     return i.reply({ content: 'Bạn không thể sử dụng nút này.', ephemeral: true });
//                 }

//                 if (i.customId === `${selectedValue}-next`) {
//                     currentPage++;
//                 } else if (i.customId === `${selectedValue}-prev`) {
//                     currentPage = Math.max(1, currentPage - 1);
//                 } else if (i.customId === `${selectedValue}-first`) {
//                     currentPage = 1;

//                 } else if (i.customId === `${selectedValue}-last`) { 
//                     let totalEntries = 0;

//     // Xử lý từng trường hợp của selectedValue
//     if (selectedValue === 'message') {
//         totalEntries = await MessageCount.countDocuments({ guildId });
//     } else if (selectedValue === 'voice') {
//         totalEntries = await VoiceTime.countDocuments({ guildId });
//     } else {
//         // Xử lý trường hợp selectedValue không hợp lệ
//         return i.editReply({ content: 'Lựa chọn không hợp lệ!', ephemeral: true });
//     }

//     // Tính số trang cuối cùng
//     currentPage = Math.ceil(totalEntries / 14);
//                 }

//                 const newAttachment = await createStatsImage(currentPage, selectedValue);
//                 const newRow = new ActionRowBuilder()
//                     .addComponents(
//                         button1,
//                         button2,
//                         new ButtonBuilder().setCustomId(`${selectedValue}-page`).setStyle(ButtonStyle.Secondary).setLabel(`Trang: ${currentPage}`).setDisabled(true),
//                         button4,
//                         button5
//                     );

//                 await i.update({ files: [newAttachment], components: [newRow, row1] });
//             });
//         } catch (error) {
//             interactionError.execute(interaction, error, client);
//         }
//     },
// };


