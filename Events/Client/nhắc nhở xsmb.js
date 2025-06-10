const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const Lottery = require('../../schemas/LotterySchema');
const economySystem = require('../../schemas/economySystem');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        let lastSentDate = null;

        const calculateDelay = () => {
            const now = new Date();
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30, 0);
            if (now > target) target.setDate(target.getDate() + 1);
            return target - now;
        };

        const scheduleStats = async () => {
            setTimeout(async () => {
                const today = new Date().toLocaleDateString('vi-VN');
                if (lastSentDate === today) {
                    scheduleStats();
                    return;
                }
                lastSentDate = today;

                // giải đặc biệt
                const giải_đặc_biệt = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
                // const giải_đặc_biệt = `56556`

                // giải nhất
                const giải1 = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

                // giải nhì
                const giải2 = String(Math.floor(Math.random() * 100000)).padStart(5, '0'); // snnSecond
                const giải21 = String(Math.floor(Math.random() * 100000)).padStart(5, '0'); // snnThird

                // giải ba
                const giải3 = Array.from({ length: 6 }, () => String(Math.floor(Math.random() * 100000)).padStart(5, '0')); // snnFourth

                // giải tư
                const giải4 = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')); // snnFifth

                // giải năm
                const giải5 = Array.from({ length: 8 }, () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')); // snnFiX

                // giải sáu
                const giải6 = Array.from({ length: 6 }, () => String(Math.floor(Math.random() * 1000)).padStart(3, '0'));

                // giải bảy
                const giải7 = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 100)).padStart(2, '0'));

                client.guilds.cache.forEach(async (guild) => {
                    // if (guild.id !== '1312185401347407902') return;

                    let category = guild.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === 'Vận Mệnh Kim Cương');
                    let resultChannel;
                    const existingChannel = guild.channels.cache.find(ch => ch.type === ChannelType.GuildText && ch.name === 'kết_quả_vận_mệnh');

                    if (category) {
                        if (existingChannel && existingChannel.parentId !== category.id) {
                            await existingChannel.delete();
                        }
                        resultChannel = category.children.cache.find(ch => ch.type === ChannelType.GuildText && ch.name === 'kết_quả_vận_mệnh');
                        if (!resultChannel) {
                            resultChannel = await guild.channels.create({
                                name: 'kết_quả_vận_mệnh',
                                type: ChannelType.GuildText,
                                parent: category.id,
                                permissionOverwrites: [{ id: guild.id, allow: [PermissionsBitField.Flags.ViewChannel] }],
                            });
                        }
                    } else {
                        category = await guild.channels.create({
                            name: 'Vận Mệnh Kim Cương',
                            type: ChannelType.GuildCategory,
                            position: 0
                        });

                        resultChannel = await guild.channels.create({
                            name: 'kết_quả_vận_mệnh',
                            type: ChannelType.GuildText,
                            parent: category.id,
                            permissionOverwrites: [{ id: guild.id, allow: [PermissionsBitField.Flags.ViewChannel] }],
                        });
                    }

                    if (!resultChannel) return;

                    const canvas = createCanvas(1100, 830);
                    const ctx = canvas.getContext('2d');

                    // Hàm vẽ ảnh nền với góc bo tròn
                    async function drawRoundedImage(ctx, img, x, y, width, height, radius) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x + radius, y);
                        ctx.lineTo(x + width - radius, y);
                        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                        ctx.lineTo(x + width, y + height - radius);
                        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                        ctx.lineTo(x + radius, y + height);
                        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                        ctx.lineTo(x, y + radius);
                        ctx.quadraticCurveTo(x, y, x + radius, y);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(img, x, y, width, height);
                        ctx.restore();
                    }

                    try {
                        const background = await loadImage('https://tecwoodoutdoorfloor.com/upload/images/Blog/background-san-go6.jpg'); // Thay thế bằng link ảnh nền hoặc đường dẫn file cục bộ
                        await drawRoundedImage(ctx, background, 0, 0, 1100, 830, 60); // Bo tròn 60px

                        ctx.globalAlpha = 0.7;
                        const background1 = await loadImage('https://t4.ftcdn.net/jpg/04/92/22/93/240_F_492229389_5ve1bCKgYrLRHpCj3o4FAzz60efaZgG0.jpg'); // Thay thế bằng link ảnh nền hoặc đường dẫn file cục bộ
                        await drawRoundedImage(ctx, background1, 0, 0, 1100, 830, 60); // Bo tròn 60px

                        ctx.globalAlpha = 1;
                    } catch (err) {
                        console.error("Lỗi khi tải ảnh nền:", err);
                    }

                    function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, textColor = null, text = null) {
                        ctx.fillStyle = bgColor;
                        ctx.beginPath();
                        ctx.moveTo(x + radius, y);
                        ctx.lineTo(x + width - radius, y);
                        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                        ctx.lineTo(x + width, y + height - radius);
                        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                        ctx.lineTo(x + radius, y + height);
                        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                        ctx.lineTo(x, y + radius);
                        ctx.quadraticCurveTo(x, y, x + radius, y);
                        ctx.closePath();
                        ctx.fill();

                        if (text && textColor) {
                            ctx.fillStyle = textColor;
                            ctx.font = '25px Roboto';
                            const textWidth = ctx.measureText(text).width;
                            const textX = x + (width - textWidth) / 2;
                            const textY = y + (height + 20) / 2;
                            ctx.fillText(text, textX, textY);
                        }
                    }

                    // khung giải đặc biệt
                    drawRoundedRect(ctx, 450, 100, 200, 50, 10, 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', giải_đặc_biệt);

                    // khung giải nhất
                    drawRoundedRect(ctx, 450, 169, 200, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải1);
                    
                    // khung giải nhì
                    drawRoundedRect(ctx, 348, 240, 200, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải2);
                    drawRoundedRect(ctx, 552, 240, 200, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải21);

                    const guildName = guild.name;

                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.font = '40px Roboto';
                    ctx.fillText(`🌸 BẢNG VÀNG VẬN MỆNH (${`Ngày ${today}`}) 🌸`, 120, 50); // <a:tui1:1336400196610822248>

                    // Vẽ đường kẻ ngang dưới chữ "GIẢI ĐẶC BIỆT"
                    ctx.beginPath();
                    ctx.moveTo(0, 90); // Vị trí bắt đầu của đường kẻ 1
                    ctx.lineTo(1100, 90); // Vị trí kết thúc của đường kẻ 1
                    ctx.moveTo(0, 159); // Vị trí bắt đầu của đường kẻ 2
                    ctx.lineTo(1100, 159); // Vị trí kết thúc của đường kẻ 2
                    ctx.moveTo(0, 230); // Vị trí bắt đầu của đường kẻ 3
                    ctx.lineTo(1100, 230); // Vị trí kết thúc của đường kẻ 3
                    ctx.moveTo(0, 300); // Vị trí bắt đầu của đường kẻ 4
                    ctx.lineTo(1100, 300); // Vị trí kết thúc của đường kẻ 4
                    ctx.moveTo(0, 425); // Vị trí bắt đầu của đường kẻ 5
                    ctx.lineTo(1100, 425); // Vị trí kết thúc của đường kẻ 5
                    ctx.moveTo(0, 495); // Vị trí bắt đầu của đường kẻ 6
                    ctx.lineTo(1100, 495); // Vị trí kết thúc của đường kẻ 6
                    ctx.moveTo(0, 620); // Vị trí bắt đầu của đường kẻ 7
                    ctx.lineTo(1100, 620); // Vị trí kết thúc của đường kẻ 7
                    ctx.moveTo(0, 690); // Vị trí bắt đầu của đường kẻ 8
                    ctx.lineTo(1100, 690); // Vị trí kết thúc của đường kẻ 8
                    ctx.moveTo(0, 760); // Vị trí bắt đầu của đường kẻ 9
                    ctx.lineTo(1100, 760); // Vị trí kết thúc của đường kẻ 9
                    ctx.lineWidth = 3; // Độ dày của đường kẻ
                    ctx.strokeStyle = 'rgb(0, 0, 0)'; // Màu sắc đường kẻ
                    ctx.stroke(); // Vẽ đường kẻ

                    // // Vẽ các đường kẻ dọc
                    // ctx.beginPath();
                    // ctx.moveTo(180, 90); // Cột dọc 1
                    // ctx.lineTo(180, 760);
                    // ctx.moveTo(980, 90); // Cột dọc 2
                    // ctx.lineTo(980, 760);
                    // ctx.lineWidth = 3; // Độ dày của đường kẻ
                    // ctx.strokeStyle = 'rgb(255, 0, 0)'; // Màu sắc đường kẻ
                    // ctx.stroke(); // Vẽ đường kẻ

                    ctx.font = '30px Roboto';
                    ctx.fillText('G.ĐB:', 35, 140);
                    ctx.fillText('G.1:', 35, 205);
                    ctx.fillText('G.2:', 35, 275);
                    ctx.fillText('G.3:', 35, 370);
                    ctx.fillText('G.4:', 35, 470);
                    ctx.fillText('G.5:', 35, 565);
                    ctx.fillText('G.6:', 35, 665);
                    ctx.fillText('G.7:', 35, 735);


                    // ctx.font = '25px Roboto';
                    // ctx.fillText('CƠN GIÓ LẠ', 45, 820);
                    // ctx.fillText(`${client.user.username}`, 920, 820);
                    // ctx.font = '35px Roboto';
                    // ctx.fillText(`${guildName}`, 350, 820);

                    // Đặt font trước khi đo kích thước chữ
                    ctx.font = '25px Roboto';
                    const conGioLaWidth = ctx.measureText('CƠN GIÓ LẠ').width;
                    // const usernameWidth = ctx.measureText(client.user.username).width;

                    ctx.font = '35px Roboto';
                    const guildNameWidth = ctx.measureText(guildName).width;

                    // Vị trí cố định
                    const startX = 45;  // Vị trí bắt đầu của 'CƠN GIÓ LẠ'
                    const endX = 920;   // Vị trí bắt đầu của '${client.user.username}'

                    // Tổng khoảng cách có thể sử dụng
                    const totalWidth = endX - (startX + conGioLaWidth);

                    // Tính khoảng cách hai bên sao cho tên máy chủ luôn ở giữa
                    const guildNameX = startX + conGioLaWidth + (totalWidth - guildNameWidth) / 2;

                    // Vẽ chữ lên canvas
                    ctx.font = '25px Roboto';
                    ctx.fillText('CƠN GIÓ LẠ', startX, 820);
                    ctx.fillText(client.user.username, endX, 820);

                    ctx.font = '35px Roboto';
                    ctx.fillText(guildName, guildNameX, 820);

                    // Vẽ avatar bot dưới dạng hình tròn
                    const botAvatar = await loadImage(client.user.displayAvatarURL({ extension: 'png', size: 128 }));
                    const avatarX = 880; // Vị trí X (trái)
                    const avatarY = 790; // Vị trí Y (trên)
                    const avatarRadius = 17.5; // Bán kính của hình tròn
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2, true); // Tạo vòng tròn ở vị trí (avatarX, avatarY)
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(botAvatar, avatarX, avatarY, 35, 35); // Vẽ ảnh vào canvas (avatarX, avatarY) và kích thước 35x35
                    ctx.restore();

                    for (let i = 0; i < 3; i++) {
                        drawRoundedRect(ctx, 250 + i * 205, 310, 200, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải3[i]); // khung giải ba
                    }

                    for (let i = 0; i < 3; i++) {
                        drawRoundedRect(ctx, 250 + i * 205, 365, 200, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải3[i + 3]); // khung giải ba
                        drawRoundedRect(ctx, 250 + i * 205, 630, 200, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải6[i + 3]); // khung giải sáu
                    }

                    for (let i = 0; i < 4; i++) {
                        drawRoundedRect(ctx, 200 + i * 185, 435, 180, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải4[i]); // khung giải tư
                        drawRoundedRect(ctx, 200 + i * 185, 505, 180, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải5[i]); // khung giải năm
                        drawRoundedRect(ctx, 200 + i * 185, 700, 180, 50, 10, 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', giải7[i]); // khung giải bảy
                    }

                    for (let i = 0; i < 4; i++) {
                        drawRoundedRect(ctx, 200 + i * 185, 560, 180, 50, 10, 'rgb(255, 255, 255)', 'rgb(0, 0, 0)', giải5[i + 4]); // khung giải năm
                    }

                    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'server-stats.png' });
                    await resultChannel.send({ files: [attachment] });

                
                    const lotteryEntriesLg1 = await Lottery.find({ Guild: guild.id, chosenType: "lg1" });
                    const lotteryEntriesLg2 = await Lottery.find({ Guild: guild.id, chosenType: "lg2" });
                    const lotteryEntriesLg3 = await Lottery.find({ Guild: guild.id, chosenType: "tt" });

                    for (const entry of lotteryEntriesLg1) {
                        const user = await client.users.fetch(entry.User);
                        let winnings = 0;

                        if (entry.chosenNumber.length === 2 && giải_đặc_biệt.slice(-2) === entry.chosenNumber) {
                            winnings = entry.betAmount * 60000; // Đánh đề 2 số
                        }

                        if (winnings > 0) {
                            await user.send(
                                `🎉 Xin chúc mừng! Bạn đã thắng trải nghiệm lộc trời **${winnings.toLocaleString()}** <a:xu:1320563128848744548> cho cược **${entry.chosenNumber}**.`
                            );

                            const userData = await economySystem.findOne({ Guild: guild.id, User: entry.User });
                            if (userData) {
                                userData.Bank += winnings;
                                await userData.save();
                            }
                        }
                    }

                    for (const entry of lotteryEntriesLg2) {
                        const user = await client.users.fetch(entry.User);
                        let winnings = 0;

                        if (entry.chosenNumber.length === 3 && giải_đặc_biệt.slice(-2) === entry.chosenNumber) {
                            winnings = entry.betAmount * 350000; // Đánh đề 3 số
                        }

                        if (winnings > 0) {
                            await user.send(
                                `🎉 Xin chúc mừng! Bạn đã thắng thử vận kim cương **${winnings.toLocaleString()}** <a:xu:1320563128848744548> cho cược **${entry.chosenNumber}**.`
                            );

                            const userData = await economySystem.findOne({ Guild: guild.id, User: entry.User });
                            if (userData) {
                                userData.Bank += winnings;
                                await userData.save();
                            }
                        }
                    }

                    for (const entry of lotteryEntriesLg3) {
                        const user = await client.users.fetch(entry.User);
                        let winnings = 0;
                        const chosenLastTwo = entry.chosenNumber.slice(-2); // Lấy 2 số cuối
                        let matchCount = 0;
                        let prizeGroups = new Set();
                    
                        // Danh sách tất cả các giải xổ số với nhãn
                        const allResults = [
                            { name: "g.ĐB", value: [giải_đặc_biệt] },
                            { name: "g.1", value: [giải1] },
                            { name: "g.2", value: [giải2, giải21] },
                            { name: "g.3", value: giải3 },
                            { name: "g.4", value: giải4 },
                            { name: "g.5", value: giải5 },
                            { name: "g.6", value: giải6 },
                            { name: "g.7", value: giải7 }
                        ];
                    
                        // Kiểm tra trúng giải
                        for (const result of allResults) {
                            if (result.value.some(number => number.slice(-2) === chosenLastTwo)) {
                                matchCount += result.value.filter(number => number.slice(-2) === chosenLastTwo).length;
                                prizeGroups.add(result.name);
                            }
                        }
                    
                        if (matchCount > 0) {
                            // Tính số điểm cược
                            const betPoints = Math.floor(entry.betAmount / 24000); // 24k = 1 điểm
                            winnings = betPoints * 70000 * matchCount; // Tính tiền thắng cược
                    
                            await user.send(
                                `🎉 Xin chúc mừng! Bạn đã thắng với số dự đoán **${entry.chosenNumber}** cho săn song số phú quý. ` +
                                `Song số phú quý có **${matchCount}** giải số có đuôi **${entry.chosenNumber}**, ` +
                                `gồm các giải: ${[...prizeGroups].join(", ")}. ` +
                                `Vì vậy bạn sẽ nhận được số tiền là **${winnings.toLocaleString()} <a:xu:1320563128848744548>**`
                            );
                    
                            // Cộng tiền vào ngân hàng của người chơi
                            const userData = await economySystem.findOne({ Guild: guild.id, User: entry.User });
                            if (userData) {
                                userData.Bank += winnings;
                                await userData.save();
                            }
                        }
                    }
                    
                    
                    
                    await Lottery.deleteMany({ Guild: guild.id });
                });

                scheduleStats();
            }, calculateDelay());
        };
        scheduleStats();
    }
};



// const { TextChannel, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
// const Lottery = require('../../schemas/LotterySchema');
// const economySystem = require('../../schemas/economySystem');
// const { createCanvas, loadImage } = require('canvas');

// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {

//         // Biến trạng thái để lưu ngày cuối cùng gửi tin nhắn
//         let lastSentDate = null;

//         const calculateDelay = () => {
//             const now = new Date();
//             const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30, 0);

//             if (now > target) target.setDate(target.getDate() + 1);
//             return target - now;
//         };

//         const scheduleLottery = () => {
//             setTimeout(async () => {
//                 const today = new Date().toLocaleDateString('vi-VN');

//                 // Kiểm tra nếu tin nhắn đã được gửi trong ngày hôm nay
//                 if (lastSentDate === today) {
//                     // Nếu đã gửi thì lập lịch lại cho ngày kế tiếp mà không thực hiện gì cả
//                     scheduleLottery();
//                     return;
//                 }
                
//                 lastSentDate = today; // Cập nhật ngày gửi tin nhắn thành hôm nay

//                 const snn = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
//                 // const snn = "34";

//                 client.guilds.cache.forEach(async (guild) => {
//                     let category = guild.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === 'Vận Mệnh Kim Cương');
//                     let resultChannel;
//                     const existingChannel = guild.channels.cache.find(ch => ch.type === ChannelType.GuildText && ch.name === 'kết_quả_vận_mệnh');

//                     if (category) {
//                         if (existingChannel && existingChannel.parentId !== category.id) {
//                             await existingChannel.delete();
//                         }

//                         resultChannel = category.children.cache.find(ch => ch.type === ChannelType.GuildText && ch.name === 'kết_quả_vận_mệnh');
//                         if (!resultChannel) {
//                             resultChannel = await guild.channels.create({
//                                 name: 'kết_quả_vận_mệnh',
//                                 type: ChannelType.GuildText,
//                                 parent: category.id,
//                                 permissionOverwrites: [{
//                                     id: guild.id,
//                                     allow: [PermissionsBitField.Flags.ViewChannel],
//                                 }],
//                             });
//                         }
//                     } else {
//                         category = await guild.channels.create({
//                             name: 'Vận Mệnh Kim Cương',
//                             type: ChannelType.GuildCategory,
//                             position: 0
//                         });

//                         resultChannel = await guild.channels.create({
//                             name: 'kết_quả_vận_mệnh',
//                             type: ChannelType.GuildText,
//                             parent: category.id,
//                             permissionOverwrites: [{
//                                 id: guild.id,
//                                 allow: [PermissionsBitField.Flags.ViewChannel],
//                             }],
//                         });
//                     }

//                     if (resultChannel) {
//                         await resultChannel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
//                         const embedResult = new EmbedBuilder()
//                             .setTitle(`🎉 Kết Quả Vận Mệnh Kim Cương Hôm Nay 🎉`)
//                             .setDescription(`Số may mắn hôm nay là **${snn}**`)
//                             .setColor('Green')
//                             .setFooter({ text: `Ngày ${today}` });

//                         try {
//                             await resultChannel.send({ embeds: [embedResult] });
//                         } catch (error) {
//                             console.error(`Gửi tin nhắn lỗi tại máy chủ ${guild.name}: ${error}`);
//                         }

//                         // Tìm các cược trong Lottery của guild hiện tại
//                         const lotteryEntries = await Lottery.find({ Guild: guild.id });
//                         for (const entry of lotteryEntries) {
//                             const user = await client.users.fetch(entry.User);
//                             let winnings = 0; // Khởi tạo số tiền thắng là 0

//                             // Kiểm tra nếu trúng thưởng
//                             if (entry.chosenNumber.length === 2 && snn.slice(-2) === entry.chosenNumber) {
//                                 winnings = entry.betAmount * 60; // Đánh đề 2 số
//                             } else if (entry.chosenNumber.length === 3 && snn.slice(-3) === entry.chosenNumber) {
//                                 winnings = entry.betAmount * 350; // Đánh đề 3 số
//                             }

//                             if (winnings > 0) {
//                                 await user.send(
//                                     `🎉 Xin chúc mừng! Số **${entry.chosenNumber}** đã mang đến cho bạn chiến thắng, và bạn sẽ thấy **${winnings.toLocaleString()}**  +
//                                     được ghi vào ngân hàng của bạn.`);

//                                 // Cập nhật số dư ngân hàng trong economySystem
//                                 const userData = await economySystem.findOne({ Guild: guild.id, User: entry.User });
//                                 if (userData) {
//                                     userData.Bank += winnings; // Cộng tiền thắng vào ngân hàng
//                                     await userData.save(); // Lưu lại
//                                 }
//                             }
//                         }
                        

//                         await Lottery.deleteMany({ Guild: guild.id });
//                     }
//                 });

//                 scheduleLottery();
//             }, calculateDelay());
//         };
//         scheduleLottery();
//     }
// };