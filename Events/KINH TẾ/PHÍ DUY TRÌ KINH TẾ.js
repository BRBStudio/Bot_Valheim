const { EmbedBuilder } = require('discord.js');
const economySystem = require('../../schemas/economySystem');
const economyCK = require('../../schemas/economyck');
const config = require('../../config');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        // Hàm gửi phí duy trì hàng tháng
        const scheduleMonthlyTask = async (guildName, guildId, msg, amount, dayOfMonth, hour, minute) => {
            const checkTask = async () => {
                const now = new Date();

                // Kiểm tra nếu đúng ngày và giờ quy định
                if (
                    now.getDate() === dayOfMonth &&
                    now.getHours() === hour &&
                    now.getMinutes() === minute
                ) {
                    // console.log(`Đến giờ gửi phí duy trì cho máy chủ ${guildName} (${guildId})!`);
                    const users = await economySystem.find({ Guild: guildId });

                    if (!users || users.length === 0) {
                        console.error(`Không có người dùng nào trong cơ sở dữ liệu của máy chủ ${guildName} (${guildId})!`);
                    } else {
                        for (const user of users) {
                            const userId = user.User;
                            let amountToDeduct = amount;

                            if (user.Bank >= amountToDeduct) {
                                user.Bank -= amountToDeduct; // Trừ phí từ Bank
                            } else {
                                const remainingAmount = amountToDeduct - user.Bank; // Số tiền còn thiếu
                                user.Bank = 0; // Đặt Bank về 0

                                if (user.Wallet >= remainingAmount) {
                                    user.Wallet -= remainingAmount; // Trừ phần còn lại từ Wallet
                                } else {
                                    
                                    // Kiểm tra lịch sử giao dịch 30 ngày gần nhất
                                    const recentTransactions = await economyCK.find({
                                        Guild: guildId,
                                        SenderID: userId,
                                    });

                                    // console.log(`sd`, recentTransactions)

                                    if (recentTransactions.length === 0) {
                                        // Xóa tài khoản nếu không có giao dịch trong 30 ngày
                                        await economySystem.deleteOne({ Guild: guildId, User: userId });
                                        // console.log(`Đã xóa tài khoản của người dùng ID ${userId} do không có giao dịch trong 30 ngày.`);
                                    } else {
                                        // console.error(`Người dùng ID ${userId} không đủ tiền để trả phí duy trì nhưng có giao dịch gần đây.`);
                                        // Người dùng không đủ tiền nhưng có giao dịch gần đây
                                        continue;
                                    }
                                    continue; // Bỏ qua người dùng này
                                }
                            }

                            // Lưu thay đổi vào cơ sở dữ liệu
                            await user.save();

                            // Gửi tin nhắn DM đến người dùng
                            const embed = new EmbedBuilder()
                                .setTitle('PHÍ DUY TRÌ KINH TẾ')
                                .setColor(config.embedGold)
                                .setDescription(
                                    `${msg}\n` +
                                    `Phí duy trì hàng tháng của bạn là **${amountToDeduct}** <a:xu:1320563128848744548>.\n` +
                                    `Số dư hiện tại trong ngân hàng: **${user.Bank}** <a:xu:1320563128848744548>.`
                                )
                                .setFooter({ text: 'Được tạo bởi Valheim Survival', iconURL: 'https://s.wsj.net/public/resources/images/OG-DW646_202003_M_20200302171613.gif' })
                                .setTimestamp();

                            try {
                                const member = await client.users.fetch(userId);
                                if (member) {
                                    await member.send({ embeds: [embed] });
                                }
                            } catch (err) {
                                console.error(`Không thể gửi tin nhắn cho người dùng ID ${userId}:`, err);
                            }
                        }
                    }
                }

                // Lặp lại kiểm tra sau mỗi phút
                setTimeout(checkTask, 600000); // 600000ms = 10 phút
            };

            checkTask(); // Gọi hàm lần đầu tiên
        };

        // Lấy tất cả máy chủ từ cơ sở dữ liệu
        const guilds = await economySystem.distinct('Guild');
        for (const guildId of guilds) {
            // Lấy thông tin máy chủ
            const guild = client.guilds.cache.get(guildId);
            const guildName = guild ? guild.name : 'Không rõ';

            // Thiết lập lời nhắc và phí duy trì hàng tháng
            scheduleMonthlyTask(
                guildName,
                guildId,
                `Máy chủ ${guildName} (${guildId})`,
                100, // Phí duy trì
                26, // Ngày trong tháng (thay đổi nếu cần)
                17, 35 // Thời gian trong ngày: 02:55
            );
        }
    }
};















// const { EmbedBuilder } = require('discord.js');
// const economySystem = require('../../schemas/economySystem');
// const config = require('../../config');

// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {
//         // Hàm gửi phí duy trì hàng tháng
//         const scheduleMonthlyTask = async (guildName, guildId, msg, amount, dayOfMonth, hour, minute) => {
//             const checkTask = async () => {
//                 const now = new Date();
//                 // Kiểm tra nếu đúng ngày và giờ quy định
//                 if (
//                     now.getDate() === dayOfMonth &&
//                     now.getHours() === hour &&
//                     now.getMinutes() === minute
//                 ) {
//                     // console.log(`Đến giờ gửi phí duy trì cho máy chủ ${guildName} (${guildId})!`);
//                     // Lấy tất cả người dùng trong cơ sở dữ liệu của máy chủ cụ thể
//                     const users = await economySystem.find({ Guild: guildId });

//                     if (!users || users.length === 0) {
//                         console.error(`Không có người dùng nào trong cơ sở dữ liệu của máy chủ ${guildName} (${guildId})!`);
//                     } else {
//                         for (const user of users) {
//                             const userId = user.User;
//                             const amountToDeduct = amount;

//                             if (user.Bank >= amountToDeduct) {
//                                 user.Bank -= amountToDeduct; // Trừ phí từ Bank
//                             } else {
//                                 const remainingAmount = amountToDeduct - user.Bank; // Số tiền còn thiếu
//                                 user.Bank = 0; // Đặt Bank về 0
                                
//                                 if (user.Wallet >= remainingAmount) {
//                                     user.Wallet -= remainingAmount; // Trừ phần còn lại từ Wallet
//                                 } else {
//                                     // Nếu cả Bank và Wallet đều không đủ, bỏ qua
//                                     console.error(`Người dùng ID ${userId} không đủ tiền để trả phí duy trì.`);
//                                     continue;
//                                 }
//                             }

//                             // Lưu thay đổi vào cơ sở dữ liệu
//                             await user.save();

//                             // Gửi tin nhắn DM đến người dùng
//                             const embed = new EmbedBuilder()
//                                 .setTitle('PHÍ DUY TRÌ KINH TẾ')
//                                 .setColor(config.embedGold)
//                                 .setDescription(
//                                     `\`\`\`yml\n${msg}\`\`\`\n` +
//                                     `Phí duy trì hàng tháng của bạn là **${amountToDeduct}** <a:xu:1320563128848744548>.\n` +
//                                     `Số dư hiện tại trong ngân hàng: **${user.Bank}** <a:xu:1320563128848744548>.`
//                                 )
//                                 .setFooter({ text: 'Được tạo bởi Valheim Survival', iconURL: 'https://s.wsj.net/public/resources/images/OG-DW646_202003_M_20200302171613.gif' })
//                                 .setTimestamp();

//                             try {
//                                 const member = await client.users.fetch(userId);
//                                 if (member) {
//                                     await member.send({ embeds: [embed] });
//                                 }
//                             } catch (err) {
//                                 console.error(`Không thể gửi tin nhắn cho người dùng ID ${userId}:`, err);
//                             }
//                         }
//                     }
//                 }

//                 // Lặp lại kiểm tra sau mỗi phút
//                 setTimeout(checkTask, 60000); // 60000ms = 1 phút
//             };

//             checkTask(); // Gọi hàm lần đầu tiên
//         };

//         // Lấy tất cả máy chủ từ cơ sở dữ liệu
//         const guilds = await economySystem.distinct('Guild');
//         for (const guildId of guilds) {
//             // Lấy thông tin máy chủ
//             const guild = client.guilds.cache.get(guildId);
//             const guildName = guild ? guild.name : 'Không rõ';

//             // Thiết lập lời nhắc và phí duy trì hàng tháng
//             scheduleMonthlyTask(
//                 guildName,
//                 guildId,
//                 `Máy chủ ${guildName} (${guildId})`,
//                 100, // Phí duy trì
//                 26, // Ngày trong tháng (thay đổi nếu cần)
//                 2, 55 // Thời gian trong ngày: 04:00
//             );
//         }
//     }
// };