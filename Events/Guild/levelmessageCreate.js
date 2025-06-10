// const { EmbedBuilder } = require('discord.js');
// const levelSchema = require('../../schemas/messagelevelSchema');
// const EventStatus = require('../../schemas/Event_Status');

// module.exports = {
//     name: "messageCreate",
//     async execute(message, client) {

//         // Kiểm tra trạng thái của sự kiện
//         const eventStatus = await EventStatus.findOne({ event: 'levelmessageCreate' });

//         // Nếu sự kiện không được bật, thoát khỏi hàm
//         if (!eventStatus || eventStatus.status === 'off') {
//             return; // Không làm gì cả nếu sự kiện bị tắt
//         }

//         const { guild, author, member } = message;

//         if (!guild || author.bot) return;

//         try {
//             let data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec();

//             if (!data) {
//                 await levelSchema.create({
//                     Guild: guild.id,
//                     User: author.id,
//                     XP: 0,
//                     Level: 0,
//                     Channels: {},  // Đảm bảo có trường Channels
//                     Levels: {}     // Đảm bảo có trường Levels
//                 });
//                 data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec(); // Tìm nạp lại dữ liệu sau khi tạo
//             }

//             const channel = message.channel;
//             const give = 1;

//             const requireXP = data.Level * data.Level * 20 + 20;

//             if (data.XP + give >= requireXP) {
//                 data.XP += give;
//                 data.Level += 1;
//                 await data.save();

//                 // Lấy cấu hình kênh và cấp độ yêu cầu
//                 const rankData = await levelSchema.findOne({ Guild: guild.id });
//                 const channelLevels = {
//                     [rankData.Levels.level1]: rankData.Channels.channel1,
//                     [rankData.Levels.level2]: rankData.Channels.channel2,
//                     [rankData.Levels.level3]: rankData.Channels.channel3,
//                 };

//                 // Cấu hình quyền cho từng cấp độ
//                 const levelPermissions = {
//                     [rankData.Levels.level1]: {
//                         ViewChannel: true,
//                         SendMessages: true,
//                         AttachFiles: true,
//                         ManageRoles: true,
//                         ReadMessageHistory: true,
//                     },
//                     [rankData.Levels.level2]: {
//                         ViewChannel: true,
//                         SendMessages: true,
//                         AttachFiles: true,
//                         ManageRoles: true,
//                         ReadMessageHistory: true,
//                     },
//                     [rankData.Levels.level3]: {
//                         ViewChannel: true,
//                         SendMessages: true,
//                         AttachFiles: true,
//                         ManageRoles: true,
//                         ReadMessageHistory: true,
//                     }
//                 };

//                 // Cấp quyền truy cập vào các kênh dựa trên cấp độ
//                 for (const [level, channelID] of Object.entries(channelLevels)) {
//                     const parsedLevel = parseInt(level);
//                     const accessChannel = guild.channels.cache.get(channelID);

//                     if (accessChannel && data.Level >= parsedLevel) {
//                         const permissions = levelPermissions[parsedLevel];
//                         await accessChannel.permissionOverwrites.edit(member, permissions)
//                             .catch(console.error);
//                     }
//                 }

//                 // Gửi tin nhắn chúc mừng khi đạt level mới
//                 if (channel) {
//                     const embed = new EmbedBuilder()
//                         .setColor('Blue')
//                         .setDescription(`${author} đã đạt đến level ${data.Level}!`)
//                         .setTitle(`CHÚC MỪNG 🏆!!!`)
//                         .setTimestamp()
//                         .setThumbnail(`https://media4.giphy.com/media/yGjmoMPc31ixmSC8rQ/giphy.gif?cid=6c09b952qfmih47mkaj71yr2bvt41tvruo1472q66eivmk4n&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s`)
//                         .setImage(`https://i.pinimg.com/originals/03/31/72/033172391439095c5505c35f38a11a5b.gif`)
//                         .setFooter({ text: client.user.username });

//                     await channel.send({ embeds: [embed] }).catch(console.error);
//                 }

//             } else {
//                 data.XP += give;
//                 await data.save();
//             }
//         } catch (err) {
//             console.error("Xảy ra lỗi:", err);
//         }
//     }
// };


const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../schemas/messagelevelSchema');

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (!message.guild || message.author.bot) return;

        try {
            const { guild, author, member, channel } = message;

            // Lấy dữ liệu cấp độ của người dùng
            let data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec();
            if (!data) {
                await levelSchema.create({ Guild: guild.id, User: author.id, XP: 0, Level: 0, Rank: 0 });
                data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec();
            }

            // Kiểm tra nếu user đã đạt cấp độ 1000 (Rank 100)
            if (data.Level >= 1000) {
                data.XP = 0;
                data.Level = 0;
                data.Rank = 0;

                // Gửi thông báo về việc reset Bạn đã đạt **Level 1000** và **Rank 100**, toàn bộ dữ liệu đã được reset. Bạn cần cầy lại từ đầu!
                const resetEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle(`🚨 ${author.displayName} đã đạt cấp độ tối đa!`)
                    .setDescription(`Bạn đã đạt **Rank 100**, toàn bộ dữ liệu sẽ được reset.`)
                    .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: "Chúc bạn may mắn trong hành trình mới!" });

                await channel.send({ embeds: [resetEmbed] }).catch(console.error);

                // Lưu lại thông tin đã reset
                await data.save();
                return; // Kết thúc xử lý ở đây nếu người dùng đã reset
            }

            // Lấy cấu hình kênh và level từ MongoDB
            const rankData = await levelSchema.findOne({ Guild: guild.id }).exec();
            if (!rankData) return;

            const channelLevels = {
                [rankData.Channels.channel1]: rankData.Levels.level1,
                [rankData.Channels.channel2]: rankData.Levels.level2,
                [rankData.Channels.channel3]: rankData.Levels.level3
            };

            // Nếu kênh hiện tại yêu cầu level cao hơn level của user, chặn tin nhắn
            if (channelLevels[channel.id] && data.Level < channelLevels[channel.id]) {
                await message.delete().catch(() => { });
                return message.author.send(`🚫 Bạn cần đạt level **${channelLevels[channel.id]}** để gửi tin trong kênh **${channel.name}**!`).catch(() => { });
            }

            // Tăng XP và kiểm tra lên level
            const xpGain = Math.floor(Math.random() * 5) + 1; // XP ngẫu nhiên từ 1-5
            data.XP += xpGain;

            const requiredXP = data.Level * data.Level * 20 + 20;

            if (data.XP >= requiredXP) {
                data.Level += 1;
                data.XP = 0;

                // Cập nhật Rank nếu level đạt bội số của 10
                const newRank = Math.floor(data.Level / 10);
                let rankUpMessageSent = false; // Biến cờ để kiểm tra xem thông báo rank đã gửi chưa

                if (newRank > data.Rank) {
                    data.Rank = newRank;
                    rankUpMessageSent = true;

                    // Gửi thông báo khi tăng Rank
                    const rankUpEmbed = new EmbedBuilder()
                        .setColor('Gold')
                        .setTitle(`🏆 ${author.username} đã đạt Rank ${data.Rank}!`)
                        .setDescription(`Bạn đã đạt **Rank ${data.Rank}** sau khi lên **Level ${data.Level}**!`)
                        .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: "Hãy tiếp tục hoạt động để leo rank cao hơn!" });

                    await channel.send({ embeds: [rankUpEmbed] }).catch(console.error);
                }

                // Gửi thông báo khi lên cấp
                if (!rankUpMessageSent) { // Chỉ gửi khi không đã gửi thông báo rank
                    const levelUpEmbed = new EmbedBuilder()
                        .setColor('Blue')
                        .setTitle(`🎉 Chúc mừng, ${author.username}!`)
                        .setDescription(`Bạn đã đạt đến **Level ${data.Level}**!`)
                        .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: "Tiếp tục trò chuyện để lên cấp!" });

                    await channel.send({ embeds: [levelUpEmbed] }).catch(console.error);
                }

                // Kiểm tra nếu user có thể truy cập kênh mới
                for (const [channelID, requiredLevel] of Object.entries(channelLevels)) {
                    const levelRequirement = parseInt(requiredLevel);
                    if (levelRequirement <= data.Level) {
                        const accessChannel = guild.channels.cache.get(channelID);
                        if (accessChannel) {
                            await accessChannel.permissionOverwrites.edit(member, {
                                SendMessages: true,
                                ViewChannel: true,
                                ReadMessageHistory: true
                            }).catch(console.error);
                        }
                    }
                }
            }

            await data.save();
        } catch (error) {
            console.error("Lỗi trong hệ thống level:", error);
        }
    }
};