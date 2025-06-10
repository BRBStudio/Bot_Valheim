// const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
// const levelSchema = require('../../schemas/messagelevelSchema');
// const path = require('path');
// const fs = require('fs');
// const CommandStatus = require('../../schemas/Command_Status');
// const { createCanvas, loadImage } = require('canvas');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('rank_m')
//         .setDescription('🔹 Nhận thứ hạng thành viên trong máy chủ')
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('user')
//                 .setDescription('🔹 Xem thứ hạng của một thành viên cụ thể')
//                 .addUserOption(option => option.setName('user').setDescription('Thành viên có thứ hạng bạn muốn kiểm tra').setRequired(true))
//         )
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('all')
//                 .setDescription('🔹 Xem danh sách 10 người đứng đầu bảng xếp hạng')
//         )
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('setup-level')
//                 .setDescription('🔹 Thiết lập quyền truy cập kênh dựa trên cấp độ')
//                 .addChannelOption(option => option.setName('channel1').setDescription('Kênh cho người đạt level cao nhất').setRequired(true))
//                 .addIntegerOption(option => option.setName('level1').setDescription('Level cần thiết cho kênh 1').setRequired(true))
//                 .addChannelOption(option => option.setName('channel2').setDescription('Kênh cho người đạt level cao thứ 2').setRequired(true))
//                 .addIntegerOption(option => option.setName('level2').setDescription('Level cần thiết cho kênh 2').setRequired(true))
//                 .addChannelOption(option => option.setName('channel3').setDescription('Kênh cho người đạt level cao thứ 3').setRequired(true))
//                 .addIntegerOption(option => option.setName('level3').setDescription('Level cần thiết cho kênh 3').setRequired(true))
//         ),

//     guildSpecific: true,
//     guildId: ['1312185401347407902'], // máy chủ Host Vappppo

//     async execute(interaction) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/rank' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         const { options, user, guild } = interaction;
//         const subcommand = options.getSubcommand();
//         const memberOption = options.getMember('user') || user;
//         const member = guild.members.cache.get(memberOption.id);

//         // Lấy dữ liệu của 10 người dùng từ cơ sở dữ liệu
//         const topUsers = await levelSchema.find({ Guild: guild.id }).sort({ XP: -1 }).limit(10);

//         // Truy vấn trực tiếp từ cơ sở dữ liệu
//         const players = await Promise.all(topUsers.map(async (data, index) => {
//             try {
//                 const cachedMember = await guild.members.fetch(data.User);
//                 const rank = Math.floor(data.Level / 10) + 1; // Xác định rank dựa trên level
//                 return {
//                     avatar: cachedMember.user.displayAvatarURL({ forceStatic: true }),
//                     username: cachedMember.user.username,
//                     displayName: cachedMember.displayName,
//                     level: data.Level,
//                     xp: data.XP,
//                     rank: rank,
//                 };
//             } catch (error) {
//                 console.error(`👑 Không thể tìm thấy thành viên với ID ${data.User} trong máy chủ.`);
//                 return null;
//             }
//         }));

//         const validPlayers = players.filter(player => player !== null);

//         // Đường dẫn đến hình ảnh nền trong thư mục 'anh'
//         const backgroundPath = path.join(__dirname, '../../anh/leaderboard-background5.png');

//         // Kiểm tra xem tệp có tồn tại không
//         if (!fs.existsSync(backgroundPath)) {
//             console.error('Thư mục ảnh không tồn tại:', backgroundPath);
//             return await interaction.reply({ content: '👑 Đã xảy ra lỗi khi tạo bảng xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
//         }

//         if (subcommand === 'all') {
//             if (validPlayers.length === 0) {
//                 const embed = new EmbedBuilder()
//                     .setColor('Red')
//                     .setDescription(`👑 Hiện tại không có dữ liệu để hiển thị bảng xếp hạng.`);
//                 return await interaction.reply({ embeds: [embed] });
//             }
        
//             await interaction.deferReply(); // Trì hoãn phản hồi để tránh lỗi hết thời gian chờ
        
//             try {
//                 const canvas = createCanvas(1100, 830);
//                 const ctx = canvas.getContext('2d');
        
//                 // Hàm vẽ ảnh nền với góc bo tròn
//                 async function drawRoundedImage(ctx, img, x, y, width, height, radius) {
//                     ctx.save();
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
//                     ctx.clip();
//                     ctx.drawImage(img, x, y, width, height);
//                     ctx.restore();
//                 }
        
//                 try {
//                     const background = await loadImage('https://topanh.com/wp-content/uploads/2024/01/anh-background-cuc-dep_110341116.jpg');
//                     await drawRoundedImage(ctx, background, 0, 0, 1100, 830, 60); // Bo tròn 60px
        
//                     ctx.globalAlpha = 0.7;
//                     const background1 = await loadImage('https://t4.ftcdn.net/jpg/04/92/22/93/240_F_492229389_5ve1bCKgYrLRHpCj3o4FAzz60efaZgG0.jpg');
//                     await drawRoundedImage(ctx, background1, 0, 0, 1100, 830, 60); // Bo tròn 60px
        
//                     ctx.globalAlpha = 1;
//                 } catch (err) {
//                     console.error("Lỗi khi tải ảnh nền:", err);
//                 }
                
//                 // Hàm vẽ khung số thứ tự
//                 function drawRankBox(ctx, x, y, width, height, text) {
//                     ctx.fillStyle = 'rgb(25, 26, 28);';
//                     ctx.beginPath();
//                     ctx.moveTo(x + 10, y);
//                     ctx.lineTo(x + width - 10, y);
//                     ctx.quadraticCurveTo(x + width, y, x + width, y + 10);
//                     ctx.lineTo(x + width, y + height - 10);
//                     ctx.quadraticCurveTo(x + width, y + height, x + width - 10, y + height);
//                     ctx.lineTo(x + 10, y + height);
//                     ctx.quadraticCurveTo(x, y + height, x, y + height - 10);
//                     ctx.lineTo(x, y + 10);
//                     ctx.quadraticCurveTo(x, y, x + 10, y);
//                     ctx.closePath();
//                     ctx.fill();
        
//                     // Vẽ text vào khung số thứ tự
//                     ctx.fillStyle = 'rgb(255, 255, 255)';
//                     ctx.font = '20px Arial';
//                     const textWidth = ctx.measureText(text).width;
//                     const textX = x + (width - textWidth) / 2;
//                     const textY = y + (height + 20) / 2;
//                     ctx.fillText(text, textX, textY);
//                 }
        
//                 // Hàm vẽ khung thông tin người chơi
//                 function drawPlayerInfoBox(ctx, x, y, width, height, text) {
//                     ctx.fillStyle = 'rgb(48, 49, 54);';
//                     ctx.beginPath();
//                     ctx.moveTo(x + 15, y);
//                     ctx.lineTo(x + width - 15, y);
//                     ctx.quadraticCurveTo(x + width, y, x + width, y + 15);
//                     ctx.lineTo(x + width, y + height - 15);
//                     ctx.quadraticCurveTo(x + width, y + height, x + width - 15, y + height);
//                     ctx.lineTo(x + 15, y + height);
//                     ctx.quadraticCurveTo(x, y + height, x, y + height - 15);
//                     ctx.lineTo(x, y + 15);
//                     ctx.quadraticCurveTo(x, y, x + 15, y);
//                     ctx.closePath();
//                     ctx.fill();
        
//                     // Vẽ text vào khung thông tin người chơi
//                     ctx.fillStyle = 'rgb(255, 255, 255)';
//                     ctx.font = '30px Arial';
//                     const textWidth = ctx.measureText(text).width;
//                     const textX = x + (width - textWidth) / 2;
//                     const textY = y + (height + 20) / 2;
//                     ctx.fillText(text, textX, textY);
//                 }
        
//                 ctx.fillStyle = "rgb(255, 255, 255)";
//                 ctx.font = '40px Arial';

//                 // Tính toán độ dài của văn bản
//                 const text = `🏆BẢNG XẾP HẠNG MÁY CHỦ ${guild}🏆`;
//                 let textWidth = ctx.measureText(text).width;

//                 // Kiểm tra nếu độ rộng của văn bản quá lớn
//                 const maxWidth = canvas.width - 40; // Giới hạn chiều rộng của văn bản (40px dự phòng cho padding)

//                 let truncatedText = text; // Khai báo truncatedText trước khi vào vòng lặp

//                 if (textWidth > maxWidth) {
//                     // Cắt văn bản nếu quá dài và thêm "..."
//                     while (textWidth > maxWidth) {
//                         truncatedText = truncatedText.slice(0, -1); // Cắt dần ký tự cuối
//                         textWidth = ctx.measureText(truncatedText + '...').width; // Cập nhật độ dài của văn bản mỗi lần cắt
//                     }
//                     truncatedText += '...'; // Thêm dấu "..." vào cuối
//                 }

//                 // Tính toán vị trí X sao cho văn bản luôn ở giữa
//                 const textX = (canvas.width - ctx.measureText(truncatedText).width) / 2;
//                 const textY = 60; // Vị trí Y, giữ nguyên

//                 ctx.fillText(truncatedText, textX, textY);



//                 // ctx.fillText(`🏆BẢNG XẾP HẠNG ${guild}🏆`, 120, 60);
        
//                 const padding = 12;
//                 const startX = 35;
//                 const startY = 100;

//                 validPlayers.sort((a, b) => {
//                     if (b.level !== a.level) {
//                         return b.level - a.level; // Sắp xếp giảm dần theo level
//                     }
//                     return b.xp - a.xp; // Nếu level bằng nhau, sắp xếp theo xp
//                 });
        
//                 // // Duyệt qua các người chơi và vẽ các khung thông tin
//                 // validPlayers.forEach((player, index) => {
//                 //     const rankWidth = 60; // khung thứ tự
//                 //     const rankHeight = 60;
//                 //     const rankX = startX;
//                 //     const rankY = startY + (index * (rankHeight + padding)); 
        
//                 //     const playerInfoWidth = 1050;
//                 //     const playerInfoHeight = 60;
//                 //     const playerInfoX = 35; // rankX + padding; //  + rankWidth
//                 //     const playerInfoY = rankY + (rankHeight - playerInfoHeight) / 2; 

//                 //     // Vẽ khung thông tin người chơi
//                 //     drawPlayerInfoBox(
//                 //         ctx, 
//                 //         playerInfoX, 
//                 //         playerInfoY, 
//                 //         playerInfoWidth, 
//                 //         playerInfoHeight, 
//                 //         `${player.displayName}            Cấp Độ: ${player.level}            Kinh Nghiệm: ${player.xp}`); // Hạng ${player.rank} ${player.displayName}
//                 //         // ctx.fillText(`${player.displayName}`, 120, 140);
        
//                 //     // Vẽ khung số thứ tự
//                 //     drawRankBox(ctx, rankX, rankY, rankWidth, rankHeight, `${index + 1}`);
        
                    
//                 // });

//                 validPlayers.forEach((player, index) => {
//                     const rankWidth = 60; // Kích thước khung thứ tự
//                     const rankHeight = 60;
//                     const rankX = startX;
//                     const rankY = startY + (index * (rankHeight + padding));
                
//                     const playerInfoWidth = 1030;
//                     const playerInfoHeight = 60;
//                     const playerInfoX = 35;
//                     const playerInfoY = rankY + (rankHeight - playerInfoHeight) / 2;
                
//                     // Vẽ khung thông tin người chơi
//                     drawPlayerInfoBox(ctx, playerInfoX, playerInfoY, playerInfoWidth, playerInfoHeight, '');
                
//                     // Vẽ khung số thứ tự
//                     drawRankBox(ctx, rankX, rankY, rankWidth, rankHeight, `${index + 1}`);

//                     // Cố định vị trí từng đoạn text trong khung thông tin người chơi
//                     ctx.fillStyle = 'rgb(255, 255, 255)';
//                     ctx.font = '30px Arial';
//                     ctx.textAlign = "left";
                
//                     // Xác định vị trí các cột
//                     const nameX = playerInfoX + 70; // Vị trí tên người chơi
//                     const levelX = playerInfoX + 560; // Vị trí "LV"
//                     const xpX = playerInfoX + 750; // Vị trí "XP"
//                     const nameY = playerInfoY + 38; // Căn giữa chiều cao khung
                
//                     // Cắt tên nếu quá dài
//                     let playerName = player.displayName;
//                     let maxNameWidth = levelX - nameX - 140; // Khoảng cách giữa tên và "LV"
                
//                     if (ctx.measureText(playerName).width > maxNameWidth) {
//                         while (ctx.measureText(playerName + "...").width > maxNameWidth) {
//                             playerName = playerName.slice(0, -1); // Cắt dần ký tự cuối
//                         }
//                         playerName += "..."; // Thêm dấu "..." vào cuối
//                     }
                
//                     // Vẽ tên người chơi
//                     ctx.fillText(playerName, nameX, nameY);
                
//                     // Vẽ cấp độ và kinh nghiệm
//                     ctx.fillText(`LV: ${player.level}`, levelX, nameY);
//                     ctx.fillText(`XP: ${player.xp}`, xpX, nameY);
//                 });


//                 // validPlayers.forEach((player, index) => {
//                 //     const rankWidth = 60; // Kích thước khung thứ tự
//                 //     const rankHeight = 60;
//                 //     const rankX = startX;
//                 //     const rankY = startY + (index * (rankHeight + padding));
                
//                 //     const playerInfoWidth = 1030;
//                 //     const playerInfoHeight = 60;
//                 //     const playerInfoX = 35;
//                 //     const playerInfoY = rankY + (rankHeight - playerInfoHeight) / 2;
                
//                 //     // Vẽ khung thông tin người chơi
//                 //     drawPlayerInfoBox(ctx, playerInfoX, playerInfoY, playerInfoWidth, playerInfoHeight, '');
                
//                 //     // Vẽ khung số thứ tự
//                 //     drawRankBox(ctx, rankX, rankY, rankWidth, rankHeight, `${index + 1}`);
                
//                 //     // Cố định vị trí từng đoạn text trong khung thông tin người chơi
//                 //     ctx.fillStyle = 'rgb(255, 255, 255)';
//                 //     ctx.font = '30px Arial';
//                 //     ctx.textAlign = "left";
                
//                 //     // Vẽ tên người chơi ở vị trí cố định trong khung
//                 //     const nameX = playerInfoX + 70; // Cách lề trái 10px
//                 //     const nameY = playerInfoY + 38; // Căn giữa chiều cao khung
//                 //     ctx.fillText(player.displayName, nameX, nameY);
                
//                 //     // Vẽ cấp độ ở vị trí cố định
//                 //     const levelX = playerInfoX + 560; // Điều chỉnh vị trí ngang
//                 //     ctx.fillText(`LV: ${player.level}`, levelX, nameY);
                
//                 //     // Vẽ kinh nghiệm ở vị trí cố định
//                 //     const xpX = playerInfoX + 750; // Điều chỉnh vị trí ngang
//                 //     ctx.fillText(`XP: ${player.xp}`, xpX, nameY);
//                 // });
                
        
//                 const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank-card.png' });
//                 await interaction.editReply({ files: [attachment] });
//             } catch (error) {
//                 console.error("Error building leaderboard image:", error);
//                 await interaction.editReply({ content: '👑 Đã xảy ra lỗi khi tạo bảng xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
//             }
//         }
        
//          else if (subcommand === 'user') {
//             const memberRank = validPlayers.find(player => player.username === member.user.username);

//             if (validPlayers.length === 0 || !memberRank) {
//                 const embed = new EmbedBuilder()
//                     .setColor('Green')
//                     .setDescription(`👑 ${member} Chưa nhận được XP nào, hãy thử lại khi ${member} trò chuyện thêm một chút.`);
//                 return await interaction.reply({ embeds: [embed] });
//             }

//             await interaction.deferReply();

//             try {
//                 const displayName = memberRank.displayName;
//                 const username = memberRank.username;
//                 const currentXP = memberRank.xp;
//                 const requiredXP = (memberRank.level * memberRank.level * 20) + 20;
//                 const level = memberRank.level;
//                 // const rank = validPlayers.findIndex(player => player.username === username) + 1; // Đặt rank là chỉ số + 1 levelSchema

//                 const userRankData = await levelSchema.findOne({ User: member.user.id, Guild: interaction.guild.id });
//                 const rank = userRankData ? userRankData.Rank : 0; // Nếu không có dữ liệu, đặt rank mặc định là 0

//                 const canvas = createCanvas(1000, 300);
//                 const ctx = canvas.getContext('2d');

//                 // // Tải ảnh nền
//                 // const background = await loadImage('https://i.imgur.com/tNTVr9o.jpeg');
//                 // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

//                 // Vẽ nền màu #3F3E3E
//                 ctx.fillStyle = "rgb(63, 62, 62);";
//                 ctx.fillRect(0, 0, 1000, 300);

//                 // Định nghĩa đường chéo
//                 const startX = 800, startY = 300; // Điểm cuối trên canvas
//                 const endX = 600, endY = 0; // Điểm đầu trên canvas 
//                 const đường_viền_chéo = 0; // Độ dày viền đường chéo

//                 // Tô màu phần bên phải đường chéo
//                 ctx.beginPath();
//                 ctx.moveTo(startX, startY);
//                 ctx.lineTo(startX, 300);
//                 ctx.lineTo(1000, 300);
//                 ctx.lineTo(1000, endY);
//                 ctx.lineTo(endX, endY);
//                 ctx.closePath();
//                 ctx.fillStyle = "rgb(0, 255, 246);";
//                 ctx.fill();

//                 // vẽ hình máy ảnh
//                 // Tọa độ để bạn có thể thay đổi vị trí của camera
//                 const cameraX = 780;  // Vị trí ngang (điều chỉnh để sang trái/phải) 820
//                 const cameraY = 40;   // Vị trí dọc (điều chỉnh để lên/xuống) 50

//                 // Vẽ thân máy ảnh (hình chữ nhật bo góc)
//                 const cameraWidth = 120, cameraHeight = 80, cornerRadius = 15;
//                 ctx.beginPath();
//                 ctx.moveTo(cameraX + cornerRadius, cameraY);
//                 ctx.lineTo(cameraX + cameraWidth - cornerRadius, cameraY);
//                 ctx.arcTo(cameraX + cameraWidth, cameraY, cameraX + cameraWidth, cameraY + cornerRadius, cornerRadius);
//                 ctx.lineTo(cameraX + cameraWidth, cameraY + cameraHeight - cornerRadius);
//                 ctx.arcTo(cameraX + cameraWidth, cameraY + cameraHeight, cameraX + cameraWidth - cornerRadius, cameraY + cameraHeight, cornerRadius);
//                 ctx.lineTo(cameraX + cornerRadius, cameraY + cameraHeight);
//                 ctx.arcTo(cameraX, cameraY + cameraHeight, cameraX, cameraY + cameraHeight - cornerRadius, cornerRadius);
//                 ctx.lineTo(cameraX, cameraY + cornerRadius);
//                 ctx.arcTo(cameraX, cameraY, cameraX + cornerRadius, cameraY, cornerRadius);
//                 ctx.closePath();
//                 ctx.fillStyle = "rgb(20, 20, 20)"; // Màu thân máy ảnh
//                 ctx.fill();

//                 // Vẽ văn bản
//                 ctx.fillStyle = "rgb(59, 59, 59)";
//                 ctx.font = '20px Arial';
//                 ctx.fillText(`WEDDING - MAKEUP - EVENT\n   NHẬN ĐÀO TẠO HỌC VIÊN`, 710, 160);
//                 ctx.fillText(`STUDIO: BRB STUDIO`, 745, 220);
//                 ctx.fillText(`PHONE: 0818.25.04.88`, 780, 260);

//                 // Vẽ ống kính (hình tròn lớn)
//                 const lensX = cameraX + cameraWidth / 2;
//                 const lensY = cameraY + cameraHeight / 2;
//                 const lensRadius = 25;
//                 ctx.beginPath();
//                 ctx.arc(lensX, lensY, lensRadius, 0, Math.PI * 2);
//                 ctx.closePath();
//                 ctx.fillStyle = "rgb(100, 200, 255)"; // Màu xanh dương
//                 ctx.fill();

//                 // Vẽ viền ngoài của ống kính
//                 ctx.beginPath();
//                 ctx.arc(lensX, lensY, lensRadius + 5, 0, Math.PI * 2);
//                 ctx.closePath();
//                 ctx.strokeStyle = "rgb(255, 255, 255)";
//                 ctx.lineWidth = 3;
//                 ctx.stroke();

//                 // Vẽ nút chụp ảnh (hình tròn nhỏ phía trên)
//                 const buttonX = cameraX + cameraWidth - 20;
//                 const buttonY = cameraY - 10;
//                 const buttonRadius = 8;
//                 ctx.beginPath();
//                 ctx.arc(buttonX, buttonY, buttonRadius, 0, Math.PI * 2);
//                 ctx.closePath();
//                 ctx.fillStyle = "rgb(150, 150, 150)"; // Màu xám
//                 ctx.fill();

//                 // Vẽ đèn flash (hình chữ nhật nhỏ bên góc)
//                 const flashX = cameraX + 10;
//                 const flashY = cameraY + 10;
//                 const flashWidth = 20, flashHeight = 8;
//                 ctx.beginPath();
//                 ctx.rect(flashX, flashY, flashWidth, flashHeight);
//                 ctx.fillStyle = "rgb(255, 255, 0)"; // Màu vàng
//                 ctx.fill();
//                 //////////

//                 // Vẽ viền đường chéo
//                 ctx.beginPath();
//                 ctx.moveTo(startX, startY);
//                 ctx.lineTo(endX, endY);
//                 ctx.fillStyle = "#3F3E3E";
//                 ctx.lineWidth = đường_viền_chéo;
//                 ctx.strokeStyle = "rgb(0, 255, 246);"; // Màu viền đường chéo
//                 ctx.stroke();
//                 ctx.closePath();

//                 // vẽ avatar
//                 const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });
//                 const avatarImg = await loadImage(avatarURL);

//                 // Điều chỉnh vị trí và kích thước khung tròn
//                 const avatarX = 60;  // Tọa độ X của avatar
//                 const avatarY = 50;  // Tọa độ Y của avatar
//                 const avatarSize = 200; // Kích thước avatar (chiều rộng & chiều cao)
//                 const avatarRadius = avatarSize / 2; // Bán kính khung tròn
//                 const borderThickness = 4; // Độ dày của viền
//                 const borderColor = "rgb(255, 255, 255)"; // Màu viền (có thể thay đổi)

//                 // Vẽ viền tròn bên ngoài
//                 ctx.beginPath();
//                 ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius + borderThickness, 0, Math.PI * 2);
//                 ctx.fillStyle = borderColor;
//                 ctx.fill();
//                 ctx.closePath();

//                 // Tạo clip hình tròn để giới hạn avatar
//                 ctx.save();
//                 ctx.beginPath();
//                 ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2);
//                 ctx.closePath();
//                 ctx.clip();

//                 // Vẽ avatar vào trong khung tròn
//                 ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);

//                 // Khôi phục trạng thái canvas
//                 ctx.restore();

//                 // Vẽ lại viền ngoài để làm nổi bật
//                 ctx.beginPath();
//                 ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius + borderThickness, 0, Math.PI * 2);
//                 ctx.lineWidth = borderThickness;
//                 ctx.strokeStyle = borderColor;
//                 ctx.stroke();
//                 ctx.closePath();

//                 // Vẽ văn bản
//                 ctx.fillStyle = '#FFFFFF';
//                 ctx.font = '30px Arial';
//                 ctx.fillText(`${displayName}`, 280, 80);
//                 ctx.fillText(`🏆 Rank: #${rank}`, 280, 140);
//                 ctx.fillText(`📊 LV: ${level}`, 280, 180);
//                 ctx.fillText(`💡 EXP: ${currentXP}/${requiredXP}`, 280, 220);

//                 // Vẽ đường kẻ ngang dưới tên người dùng
//                 ctx.beginPath();
//                 ctx.moveTo(260, 90); // Vị trí bắt đầu của đường kẻ 1
//                 ctx.lineTo(550, 90); // Vị trí kết thúc của đường kẻ 1
//                 ctx.lineWidth = 1; // Độ dày của đường kẻ
//                 ctx.strokeStyle = 'rgb(67, 183, 183);'; // Màu sắc đường kẻ
//                 ctx.stroke(); // Vẽ đường kẻ

//                 // Vẽ thanh tiến trình
//                 const progressBarX = 240; // Vị trí X của thanh tiến trình
//                 const progressBarY = 240; // Vị trí Y của thanh tiến trình
//                 const progressBarWidth = 500; // Chiều rộng của thanh tiến trình
//                 const progressBarHeight = 30; // Chiều cao của thanh tiến trình
//                 const progressBarRadius = 15; // Bán kính bo góc
//                 const progressBarBackgroundColor = 'rgb(50, 50, 50)'; // Màu nền thanh tiến trình
//                 const progressBarFillColor = 'rgb(67, 183, 183)'; // Màu thanh tiến trình

//                 // Vẽ nền thanh tiến trình
//                 ctx.beginPath();
//                 ctx.moveTo(progressBarX + progressBarRadius, progressBarY);
//                 ctx.arcTo(progressBarX + progressBarWidth, progressBarY, progressBarX + progressBarWidth, progressBarY + progressBarHeight, progressBarRadius);
//                 ctx.arcTo(progressBarX + progressBarWidth, progressBarY + progressBarHeight, progressBarX, progressBarY + progressBarHeight, progressBarRadius);
//                 ctx.arcTo(progressBarX, progressBarY + progressBarHeight, progressBarX, progressBarY, progressBarRadius);
//                 ctx.arcTo(progressBarX, progressBarY, progressBarX + progressBarWidth, progressBarY, progressBarRadius);
//                 ctx.closePath();
//                 ctx.fillStyle = progressBarBackgroundColor;
//                 ctx.fill();

//                 // const progressWidth = Math.min((currentXP / requiredXP) * 100, progressBarWidth);

//                 // Chia thanh tiến trình thành 20 phần
// const progressStep = requiredXP / 20;

// // Xác định số bậc mà người chơi đã đạt được
// const progressLevel = Math.floor(currentXP / progressStep);

// // Tính toán chiều rộng của thanh tiến trình dựa trên số bậc đã đạt được
// const progressWidth = Math.min((progressLevel / 20) * progressBarWidth, progressBarWidth);






//                 // nếu currentXP = 598905, requiredXP = 19960040 và progressBarWidth = 500 thì px sẽ bằng 15.00260019518999
//                 // const rawProgressWidth = (currentXP / requiredXP) * progressBarWidth;
//                 // const progressWidth = rawProgressWidth >= 15.00260019518999 ? Math.min(rawProgressWidth, progressBarWidth) : 0;

// // // Vẽ thanh tiến trình (đo theo XP)
// // const minProgressWidth = 15; // Giá trị tối thiểu để thanh không bị méo
// // const progressRatio = currentXP / requiredXP;
// // const progressWidth = Math.max(minProgressWidth, Math.min(progressRatio * progressBarWidth, progressBarWidth));




//                 ctx.beginPath();
//                 ctx.moveTo(progressBarX, progressBarY + progressBarRadius);
//                 ctx.arcTo(progressBarX, progressBarY, progressBarX + progressWidth, progressBarY, progressBarRadius);
//                 ctx.arcTo(progressBarX + progressWidth, progressBarY, progressBarX + progressWidth, progressBarY + progressBarHeight, progressBarRadius);
//                 ctx.arcTo(progressBarX + progressWidth, progressBarY + progressBarHeight, progressBarX, progressBarY + progressBarHeight, progressBarRadius);
//                 ctx.arcTo(progressBarX, progressBarY + progressBarHeight, progressBarX, progressBarY, progressBarRadius);
//                 ctx.closePath();
//                 ctx.fillStyle = progressBarFillColor;
//                 ctx.fill();

//                 // Thêm chữ vào nền thanh tiến trình
//                 const text = "BRB Studio";

//                 // Chỉnh vị trí chữ bằng cách thay đổi giá trị của textX
//                 // Để chỉnh chữ sang trái hoặc phải, chỉ cần thay đổi giá trị của textX.
//                 let textX = progressBarX + progressBarWidth / 2 - ctx.measureText(text).width / 2; // Căn giữa chữ
//                 // Nếu muốn di chuyển chữ sang trái:
//                 textX += 230; // Giảm giá trị của textX để chữ lệch sang trái
//                 // Nếu muốn di chuyển chữ sang phải:
//                 // textX += 50; // Tăng giá trị của textX để chữ lệch sang phải

//                 // Chỉnh vị trí chữ theo chiều dọc (điều chỉnh lên xuống)
//                 let textY = progressBarY + progressBarHeight / 2 + 10; // Đặt chữ ở giữa chiều cao thanh tiến trình
//                 // Nếu muốn di chuyển chữ lên:
//                 textY -= 5; // Giảm giá trị của textY để chữ lên trên
//                 // Nếu muốn di chuyển chữ xuống:
//                 // textY += 10; // Tăng giá trị của textY để chữ xuống dưới

//                 ctx.fillStyle = 'rgb(255, 255, 255)'; // Màu chữ
//                 ctx.font = '15px Roboto';
//                 ctx.fillText(text, textX, textY); // Vẽ chữ
                
//                 // Xuất ảnh
//                 const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank-card.png' });

//                 await interaction.editReply({ files: [attachment] });
                
//             } catch (error) {
//                 console.error("Error building rank card:", error);
//                 await interaction.editReply({ content: '⚠️ Đã xảy ra lỗi khi tạo thẻ xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
//             }
//         } 

//         else if (subcommand === 'setup-level') {
//             const guildOwner = await interaction.guild.fetchOwner();
//             if (interaction.user.id !== guildOwner.id) {
//                 return await interaction.reply({ content: 'Lệnh này chỉ dành cho chủ sở hữu.', ephemeral: true });
//             }

//             const channel1 = options.getChannel('channel1');
//             const level1 = options.getInteger('level1');
//             const channel2 = options.getChannel('channel2');
//             const level2 = options.getInteger('level2');
//             const channel3 = options.getChannel('channel3');
//             const level3 = options.getInteger('level3');
        
//             // Kiểm tra cấp độ có đúng thứ tự hay không
//             if (!(level1 > level2 && level2 > level3)) {
//                 const embed = new EmbedBuilder()
//                     .setColor('Red')
//                     .setDescription('⚠️ Các cấp độ cần được sắp xếp theo thứ tự từ cao đến thấp.\n\nVui lòng nhập lại lệnh với cấp độ đúng thứ tự.');
//                 return await interaction.reply({ embeds: [embed], ephemeral: true });
//             }
        
//             try {
//                 // Cập nhật dữ liệu vào MongoDB
//                 await levelSchema.findOneAndUpdate(
//                     { Guild: guild.id },
//                     {
//                         $set: {
//                             "Channels": {
//                                 channel1: channel1.id,
//                                 channel2: channel2.id,
//                                 channel3: channel3.id
//                             },
//                             "Levels": {
//                                 level1: level1,
//                                 level2: level2,
//                                 level3: level3
//                             }
//                         }
//                     },
//                     { upsert: true, new: true }
//                 );
        
//                 const embed = new EmbedBuilder()
//                     .setColor('Green')
//                     .setTitle('📊 Thiết lập quyền cấp độ thành công!')
//                     .addFields(
//                         { name: '🔹 Kênh cấp độ 1', value: `${channel1} (Cần Cấp độ ${level1})`, inline: true },
//                         { name: '🔹 Kênh cấp độ 2', value: `${channel2} (Cần Cấp độ ${level2})`, inline: true },
//                         { name: '🔹 Kênh cấp độ 3', value: `${channel3} (Cần Cấp độ ${level3})`, inline: true }
//                     );
        
//                 return await interaction.reply({ embeds: [embed] });
//             } catch (error) {
//                 console.error('Lỗi khi thiết lập quyền:', error);
//                 return await interaction.reply({ content: '⚠️ Đã xảy ra lỗi khi thiết lập quyền. Vui lòng thử lại!', ephemeral: true });
//             }
//         }
//     }
// }