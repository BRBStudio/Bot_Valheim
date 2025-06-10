// const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const { createCanvas, loadImage } = require('canvas');
// const MessageCount = require('../../schemas/numbermess');
// const VoiceTime = require('../../schemas/numbervoice');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('toptop')
//         .setDescription('🔹 Xem thống kê hàng đầu của máy chủ.'),
//     guildSpecific: true,
//     guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`], // '1319809040032989275', '1312185401347407902'

// async execute(interaction, client) {

//     const guildName = interaction.guild.name;
//     const guildId = interaction.guild.id;

//     function formatNumberMessages(number) {
//         if (number < 1000) return `${number}`;
    
//         if (number >= 1000 && number < 1000000) {
//             let thousands = Math.floor(number / 1000);
//             let remainder = number % 1000;
//             let hundreds = Math.floor(remainder / 100);
            
//             return hundreds > 0 ? `${thousands}K${hundreds}` : `${thousands}K`;
//         }
    
//         if (number >= 1000000) {
//             let millions = Math.floor(number / 1000000);
//             let remainder = number % 1000000;
//             let thousands = Math.floor(remainder / 1000);
    
//             return thousands > 0 ? `${millions * 1000 + thousands}K` : `${millions}B`;
//         }
//     }
    

//     // Lấy dữ liệu tin nhắn từ MongoDB
//     const messagesData = await MessageCount.find({ guildId }).sort({ numberMessages: -1 }).limit(6);
//     const messagesStats = Array.from({ length: 6 }, (v, i) => {
//       const entry = messagesData[i];
//       return entry
//         ? { name: entry.displayName || `User ${i + 1}`, count: `${formatNumberMessages(entry.numberMessages)}` } // ${entry.numberMessages}
//         : { name: 'N/A', count: '0' };
//     });

//     // Lấy dữ liệu thời gian voice từ MongoDB
//     const voiceData = await VoiceTime.find({ guildId }).sort({ time: -1 }).limit(6);
//     const voiceStats = Array.from({ length: 6 }, (v, i) => {
//         const entry = voiceData[i];
//         return entry
//             ? { name: entry.displayName || `User ${i + 1}`, time: `${(entry.TimeVoice).toFixed(2)} H` }
//             : { name: 'N/A', time: '0 H' };
//     });

//     // Khởi tạo canvas
//     const canvas = createCanvas(1100, 700);
//     const ctx = canvas.getContext('2d');

//     // Hàm vẽ chữ nhật bo góc
//     function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, textColor = null, text = null) {
//         ctx.fillStyle = bgColor;
//         ctx.beginPath();
//         ctx.moveTo(x + radius, y);
//         ctx.lineTo(x + width - radius, y);
//         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//         ctx.lineTo(x + width, y + height - radius);
//         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//         ctx.lineTo(x + radius, y + height);
//         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//         ctx.lineTo(x, y + radius);
//         ctx.quadraticCurveTo(x, y, x + radius, y);
//         ctx.closePath();
//         ctx.fill();

//         if (text && textColor) {
//             ctx.fillStyle = textColor;
//             ctx.font = '25px Roboto';
//             const textWidth = ctx.measureText(text).width;
//             const textX = x + (width - textWidth) / 2;
//             const textY = y + (height + 20) / 2;
//             ctx.fillText(text, textX, textY);
//         }
//     }

//     // Hàm tính toán độ rộng khung dựa trên văn bản
//     function calculateBoxWidth(ctx, text, buffer = 15) {
//         ctx.font = '25px Roboto';
//         const textWidth = ctx.measureText(text).width;
//         return textWidth + buffer * 2;
//     }

//     // Vẽ nền canvas
//     drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 40, 'rgb(39, 39, 39)'); // #1e1e1e #33393E rgb(51, 57, 62)

//     // Vẽ tiêu đề máy chủ
//     ctx.fillStyle = 'rgb(255, 255, 255)'; // màu xanh đẹp
//     ctx.font = '40px Roboto'; //rgb(28, 43, 54)
//     ctx.fillText(`${guildName}`, 10, 50);

//     // Vẽ tên dưới máy chủ
//     ctx.fillStyle = 'rgb(255, 255, 255)'; // màu cam
//     ctx.font = '25px Roboto';
//     ctx.fillText('🔰 Thống kê hàng đầu', 10, 85);

//     // Vẽ các tiêu đề phần
//     ctx.font = '30px Arial';
//     ctx.fillStyle = 'rgb(255, 255, 255)'; 
//     ctx.fillText('💬 Top Tin Nhắn:', 10, 135);
//     ctx.fillText('🔊 Top Giọng Nói:', 10, 415);

//     // Vẽ chân trang bên trái
//     ctx.font = '25px Arial';
//     ctx.fillStyle = 'rgb(255, 255, 255)';
//     ctx.fillText('Tổng quan máy chủ', 10, 675);

//     // Vẽ chân trang bên phải
//     ctx.font = '25px Arial';
//     ctx.fillStyle = 'rgb(255, 255, 255)';
//     ctx.fillText(`${client.user.username}`, 920, 675); // 920

//     // Hàm vẽ danh sách theo cột
//     function drawStats(stats, startY) {
//         let columnX = 10;
//         let currentY = startY;
//         stats.forEach((user, index) => {
//             if (index === 3) {
//                 columnX = canvas.width / 2 + 30;
//                 currentY = startY;
//             }

//             const valueBoxWidth = calculateBoxWidth(ctx, user.count || user.time);

//             // Vẽ khung chính
//             drawRoundedRect(ctx, columnX, currentY, 500, 63, 15, 'rgb(14, 20, 20)'); // khung chính

//             // Tính toán độ rộng khung dựa trên số thứ tự //rgb(172, 185, 255)
//             const numberText = user.name !== 'N/A' ? `${index + 1}` : '';
//             const numberBoxWidth = calculateBoxWidth(ctx, numberText, 10); // buffer = 10

//             // Vẽ khung số thứ tự với độ rộng động
//             drawRoundedRect(ctx, columnX, currentY, numberBoxWidth, 65, 15, 'rgb(66, 122, 145)'); // khung số thứ tự

//             // Vẽ số thứ tự bên trong khung
//             ctx.font = '25px Roboto';
//             ctx.fillStyle = 'rgb(255, 255, 255)';
//             const numberX = columnX + (numberBoxWidth - ctx.measureText(numberText).width) / 2; // Căn giữa
//             const numberY = currentY + 40;
//             ctx.fillText(numberText, numberX, numberY);

//             // Vẽ khung giá trị
//             drawRoundedRect(
//                 ctx,
//                 columnX + 491 - valueBoxWidth, // chỉnh khung giá trị sang trái hoặc phải
//                 currentY + 8,
//                 valueBoxWidth,
//                 50,
//                 10,
//                 'rgb(66, 122, 145)', // khung giá trị
//                 'rgb(255, 255, 255)', // rgb(255, 255, 255)
//                 user.count || user.time
//             );
//             //rgb(51, 51, 51)

//             // Vẽ tên người dùng
//             ctx.fillStyle = 'rgb(255, 255, 255)';
//             ctx.font = '25px Arial';
//             ctx.fillText(user.name, columnX + 60, currentY + 40);

//             currentY += 72;
//         });
//     }

//     // Vẽ danh sách tin nhắn và voice
//     drawStats(messagesStats, 150);
//     drawStats(voiceStats, 430);

//     // Vẽ avatar bot dưới dạng hình tròn
//     const botAvatar = await loadImage(client.user.displayAvatarURL({ extension: 'png', size: 128 }));
//     const avatarX = 875; // Vị trí X (trái)
//     const avatarY = 650; // Vị trí Y (trên)
//     const avatarRadius = 17.5; // Bán kính của hình tròn
//     ctx.save();
//     ctx.beginPath();
//     ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2, true); // Tạo vòng tròn ở vị trí (avatarX, avatarY)
//     ctx.closePath();
//     ctx.clip();
//     ctx.drawImage(botAvatar, avatarX, avatarY, 35, 35); // Vẽ ảnh vào canvas (avatarX, avatarY) và kích thước 35x35
//     ctx.restore();

//     // Chuyển canvas thành tệp hình ảnh để gửi
//     const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'server-stats.png' });

//     // Tạo menu chọn loại thống kê
//     const selectMenu = new StringSelectMenuBuilder()
//         .setCustomId('top-select-menu')
//         .setPlaceholder('Chọn loại thống kê bạn muốn xem')
//         .addOptions([
//             {
//                 label: '👁‍🗨 Tổng quan',
//                 description: 'Xem tổng quan thống kê hàng đầu',
//                 value: 'Overview',
//             },
//             {
//                 label: '💬 Người dùng tin nhắn hàng đầu ',
//                 description: 'Xem thống kê tin nhắn hàng đầu',
//                 value: 'message',
//             },
//             {
//                 label: '🔊 Người dùng giọng nói hàng đầu',
//                 description: 'Xem thống kê hoạt động voice hàng đầu',
//                 value: 'voice',
//             },
//         ]);
        
//     const row = new ActionRowBuilder().addComponents(selectMenu);
    

//     // Gửi tin nhắn ban đầu với menu và hình ảnh
//     const message = await interaction.reply({
//             files: [attachment],
//             components: [row],
//         });

//     },
// };
