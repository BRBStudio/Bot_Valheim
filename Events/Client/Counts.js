// const { PermissionsBitField, ChannelType } = require('discord.js');
// const countSchema = require('../../schemas/countSchema');
// const EventStatus = require('../../schemas/Event_Status');

// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {

//         // Kiểm tra trạng thái của sự kiện 'channelUpdate'
//         const eventStatus = await EventStatus.findOne({ event: 'Counts' });

//         // Nếu sự kiện không được bật, thoát khỏi hàm
//         if (!eventStatus || eventStatus.status === 'off') {
//             return; // Không làm gì cả nếu sự kiện bị tắt
//         }

//         let isUpdating = false;

//         // Thiết lập hàm cập nhật để chạy lại sau mỗi 1 phút (60000ms)
//         setInterval(async () => {
//             if (isUpdating) {
//                 // console.log('Quá trình cập nhật trước chưa hoàn tất, đợi lần cập nhật tiếp theo.');
//                 return; 
//             }

//             isUpdating = true; 
//             // console.log('Bắt đầu quá trình cập nhật...');

//             try {
//                 // Lấy danh sách các máy chủ có thiết lập tính năng đếm số lượng từ MongoDB
//                 const countDataList = await countSchema.find({});

//                 // Duyệt qua danh sách các máy chủ
//                 await Promise.all(countDataList.map(async (countData) => {
//                     const guild = client.guilds.cache.get(countData.Guild);

//                     // Nếu bot đang ở trong máy chủ này
//                     if (guild) {
//                         // console.log(`Đang xử lý máy chủ: ${guild.id}`);

//                         let memberCount = 0;
//                         try {
//                             // // Lấy số lượng thành viên
//                             // memberCount = (await guild.members.fetch()).size;
                            
//                             // Sử dụng guild.memberCount để tránh lỗi timeout
//                             memberCount = guild.memberCount;
//                         } catch (error) {
//                             console.error(`Sự kiện Counts bị lỗi khi lấy danh sách thành viên cho máy chủ ${guild.id}: ${error.message}`);
//                             // Ghi lại trạng thái lỗi của máy chủ để thử lại trong lần sau
//                             countData.retryFetch = (countData.retryFetch || 0) + 1;
//                             if (countData.retryFetch < 10) {
//                                 // Nếu chưa thử đủ 10 lần, giữ nguyên dữ liệu và thoát
//                                 return; 
//                             }

//                             // Nếu đã thử 10 lần, đặt lại số lần thử và khởi động lại sự kiện
//                             console.error(`Không thể lấy thành viên cho máy chủ ${guild.id} sau 10 lần thử. Khởi động lại sự kiện.`);
//                             countData.retryFetch = 0; // Reset số lần thử
//                             setImmediate(() => execute(client)); // Khởi động lại hàm execute
//                             return; 
//                         }

//                         // Nếu không thể lấy được số lượng thành viên
//                         if (memberCount === -1) {
//                             // Ghi lại trạng thái lỗi của máy chủ
//                             console.error(`Không thể lấy thành viên cho máy chủ ${guild.id} sau 3 lần thử.`);
//                             return;
//                         }

//                         // Reset lại số lần thử khi thành công
//                         countData.retryFetch = 0;

//                         // Lấy danh sách người dùng bị cấm
//                         const bannedUsers = await guild.bans.fetch().catch((error) => {
//                             console.error(`Không thể lấy danh sách bị cấm của máy chủ ${guild.id}:`, error.message);
//                             return null; // Trả về null nếu có lỗi
//                         });
                        
//                         // Lấy số lượng bot
//                         const botCount = (await guild.members.fetch()).filter(member => member.user.bot).size;
//                         // Lấy số lượng nâng cấp
//                         const boostCount = guild.premiumSubscriptionCount;

//                         // Cập nhật vào MongoDB
//                         await countSchema.updateOne(
//                             { Guild: guild.id },
//                             {
//                                 MemberCount: memberCount,
//                                 BanCount: bannedUsers.size,
//                                 BotCount: botCount,
//                                 BoostCount: boostCount
//                             }
//                         );

//                         // console.log(`Đã cập nhật dữ liệu vào MongoDB cho máy chủ ${guild.id}`);

//                         // Cập nhật tên kênh
//                         await Promise.all(countData.Channels.map(async (channelInfo) => {
//                             const channel = await guild.channels.fetch(channelInfo.id);
//                             if (channel) {
//                                 let newName = '';

//                                 if (channel.name.startsWith("👥 Thành Viên")) {
//                                     newName = `👥 Thành Viên: ${memberCount}`;
//                                 } else if (channel.name.startsWith("🚫 Ban")) {
//                                     newName = `🚫 Ban: ${bannedUsers.size}`;
//                                 } else if (channel.name.startsWith("🤖 Bot")) {
//                                     newName = `🤖 Bot: ${botCount}`;
//                                 } else if (channel.name.startsWith("💎 Tăng Cường")) {
//                                     newName = `💎 Tăng Cường: ${boostCount}`;
//                                 }

//                                 if (newName && channel.name !== newName) {
//                                     await channel.setName(newName).catch(console.error);
//                                     // console.log(`Đã cập nhật tên kênh: ${newName}`);
//                                 }
//                             }
//                         }));
//                     }
//                 }));
//             } catch (error) {
//                 console.error('Có lỗi xảy ra trong quá trình cập nhật:', error);
//             }

//             // console.log('Hoàn tất quá trình cập nhật.');
//             isUpdating = false; 
//         }, 60000); // Cập nhật mỗi phút
//     },
// };












const { PermissionsBitField, ChannelType } = require('discord.js');
const countSchema = require('../../schemas/countSchema');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        // const eventStatus = await EventStatus.findOne({ event: 'Counts' });

        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Thoát nếu sự kiện bị tắt
        // }

        let isUpdating = false;

        setInterval(async () => {
            if (isUpdating) return;

            isUpdating = true;

            try {
                const countDataList = await countSchema.find({});
                await Promise.all(countDataList.map(async (countData) => {
                    const guild = client.guilds.cache.get(countData.Guild);

                    if (!guild) return;

                    try {
                        const memberCount = guild.memberCount; // Lấy trực tiếp số lượng thành viên

                        // const botCount = (await guild.members.fetch({ withPresences: false }))
                        //     .filter(member => member.user.bot).size;
                        const botCount = guild.members.cache.filter(member => member.user.bot).size;

                        const bannedUsers = await guild.bans.fetch().catch(() => null);
                        const boostCount = guild.premiumSubscriptionCount; // tổng số lần tăng cường (boosts) đã được thực hiện trong máy chủ

                        // // lấy số người đã tăng cường
                        // const boosterCount = guild.members.cache.filter(member => 
                        //     member.roles.cache.some(role => role.tags?.premiumSubscriber)
                        // ).size;
                        

                        await countSchema.updateOne(
                            { Guild: guild.id },
                            {
                                MemberCount: memberCount,
                                BanCount: bannedUsers ? bannedUsers.size : 0,
                                BotCount: botCount,
                                BoostCount: boostCount
                            }
                        );

                        await Promise.all(countData.Channels.map(async (channelInfo) => {
                            const channel = await guild.channels.fetch(channelInfo.id).catch(() => null);
                            if (!channel) return;

                            let newName = '';
                            if (channel.name.startsWith("👥 Thành Viên")) {
                                newName = `👥 Thành Viên: ${memberCount}`;
                            } else if (channel.name.startsWith("🚫 Ban")) {
                                newName = `🚫 Ban: ${bannedUsers ? bannedUsers.size : 0}`;
                            } else if (channel.name.startsWith("🤖 Bot")) {
                                newName = `🤖 Bot: ${botCount}`;
                            } else if (channel.name.startsWith("💎 Tăng Cường")) {
                                newName = `💎 Tăng Cường: ${boostCount}`;
                            }

                            if (newName && channel.name !== newName) {
                                await channel.setName(newName).catch(() => {});
                            }
                        }));
                    } catch (error) {
                        console.error(`Lỗi khi xử lý máy chủ ${guild.id}:`, error.message);
                    }
                }));
            } catch (error) {
                console.error('Có lỗi xảy ra trong quá trình cập nhật:', error.message);
            }

            isUpdating = false;
        }, 60000);
    },
};
