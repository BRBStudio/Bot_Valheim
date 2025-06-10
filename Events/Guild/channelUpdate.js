// // const { EmbedBuilder, ChannelType, AuditLogEvent } = require('discord.js');

// // /*
// // Sự kiện channelUpdate khi tên kênh được thay đổi, sẽ nhận được thông báo trong kênh chỉ định
// // */

// // module.exports = {
// //     name: "channelUpdate",
// //     async execute(oldChannel, newChannel) {
// //         const nameChannel = 'NK-THAY-ĐỔI-TÊN'; // Tên kênh cần tìm, kênh này sẽ nhận thông báo khi có sự thay đổi tên kênh trong máy chủ
// //         const logChannelName1 = `1224218729701838889`; // ID kênh 👥-thành-viên-138
// //         const logChannelName2 = `1224219197043773461`; // ID kênh 🚫-ds-thành-viên-bị-cấm-1
// //         const logChannelName3 = `1224219609906020406`; // ID kênh 🤖-bots-4
// //         const logChannelName4 = `1224219685663277056`; // ID kênh 💎-boosts-0

// //         // Log thông tin kênh cũ và mới để debug (nếu cần)
// //         // console.log(`Old Channel Type: ${oldChannel.type}, Old Channel Name: ${oldChannel.name}`);
// //         // console.log(`New Channel Type: ${newChannel.type}, New Channel Name: ${newChannel.name}`);

// //         // Tên kênh cần loại trừ để không gửi thông báo khi chúng bị đổi tên
// //         const excludedChannelNames = ['👥 Thành Viên', '🚫 Ban', '🤖 Bot', '💎 Tăng Cường'];
        
// //         // Kiểm tra xem tên kênh có thay đổi không
// //         if (oldChannel.name !== newChannel.name) {
// //             try {
// //                 // Tìm nạp tất cả các kênh trong guild và tìm kênh có tên là 'THAY-ĐỔI-TÊN'
// //                 const fetchedChannels = await newChannel.guild.channels.fetch();
// //                 const logChannel = fetchedChannels.find(channel => channel.name.toLowerCase() === nameChannel.toLowerCase()); // Thêm toLowerCase() để không phân biệt chữ hoa và chữ thường

// //                 // Kiểm tra xem logChannel có phải là logChannelName1, logChannelName2, logChannelName3 hoặc logChannelName4 không
// //                 if ([logChannelName1, logChannelName2, logChannelName3, logChannelName4].includes(newChannel.id)) {
// //                     return; // Không gửi tin nhắn nếu kênh là một trong những kênh không nhận thông báo
// //                 }

// //                 if (logChannel && logChannel.type === ChannelType.GuildText) {
// //                     try {
// //                         // Tìm nạp nhật ký kiểm tra để lấy user đã thay đổi tên kênh
// //                         const fetchedLogs = await newChannel.guild.fetchAuditLogs({
// //                             limit: 1,
// //                             type: AuditLogEvent.ChannelUpdate,
// //                         });
                        
// //                         const auditLogEntry = fetchedLogs.entries.first();
// //                         const user = auditLogEntry ? auditLogEntry.executor : null;
// //                         const userName = user ? user.tag : 'Người dùng không xác định';
                        
// //                         const oldChannelName = oldChannel.name;
// //                         const newChannelName = newChannel.name;

// //                         // Xác định loại kênh và gửi thông báo tương ứng
// //                         let channelTypeMessage = '';
// //                         if (oldChannel.type === ChannelType.GuildText) {
// //                             channelTypeMessage = 'VĂN BẢN';
// //                         } else if (oldChannel.type === ChannelType.GuildVoice) {
// //                             channelTypeMessage = 'THOẠI';
// //                         }
// //                         const sendtochannel = new EmbedBuilder()
// //                             .setTitle(`THÔNG BÁO ĐỔI TÊN KÊNH ${channelTypeMessage}`)
// //                             .setDescription(`Kênh __${oldChannelName}__ đã đổi tên thành __${newChannelName}__`)
// //                             .setColor('Blue')
// //                             .setFooter({ text: `Được đổi tên bởi ${userName}` })
// //                             .setTimestamp();

// //                         logChannel.send({ content: `@everyone`, embeds: [sendtochannel] });
// //                     } catch (error) {
// //                         console.error('Error fetching audit logs:', error);
// //                     }
// //                 } else {
// //                     // Gửi tin nhắn DM cho người dùng khi không tìm thấy kênh 'THAY-ĐỔI-TÊN'
// //                     const owner = await newChannel.guild.members.fetch(newChannel.guild.ownerId);
// //                     if (owner && owner.user) {
// //                         const embedChannel = new EmbedBuilder()
// //                             .setTitle('KHÔNG TÌM THẤY KÊNH')
// //                             .setDescription(`Bạn cần có kênh văn bản ***${nameChannel}*** để mỗi khi bạn đổi tên kênh thoại hoặc kênh văn bản thì thông báo sẽ gửi vào ***${nameChannel}*** và không phải nhận tin nhắn này nữa. Đôi khi thời gian phản hồi sẽ bị trễ đó là do đường truyền mạng nên bạn không cần phải lo lắng về điều đó.`)
// //                             .setColor('Red')
// //                             .setFooter({ text: 'Được tạo bởi Valheim Survival' })
// //                             .setTimestamp();
                            
// //                         owner.user.send({ embeds: [embedChannel] });
// //                     } else {
// //                         console.error('Could not find the guild owner.');
// //                     }
// //                 }
// //             } catch (error) {
// //                 console.error('Error fetching channels:', error);
// //             }
// //         }
// //     }
// // };



// const { EmbedBuilder, ChannelType, AuditLogEvent } = require('discord.js');

// /*
// Sự kiện channelUpdate khi tên kênh được thay đổi, sẽ nhận được thông báo trong kênh chỉ định
// */

// module.exports = {
//     name: "channelUpdate",
//     async execute(oldChannel, newChannel) {
//         const nameChannel = 'NK-THAY-ĐỔI-TÊN'; // Tên kênh cần tìm, kênh này sẽ nhận thông báo khi có sự thay đổi tên kênh trong máy chủ

//         // Tên kênh cần loại trừ để không gửi thông báo khi chúng bị đổi tên
//         const excludedChannelNames = ['👥 Thành Viên', '🚫 Ban', '🤖 Bot', '💎 Tăng Cường'];
        
//         // Kiểm tra xem tên kênh có thay đổi và kênh không nằm trong danh sách loại trừ
//         if (oldChannel.name !== newChannel.name && !excludedChannelNames.includes(oldChannel.name)) {
//             try {
//                 // Tìm nạp tất cả các kênh trong guild và tìm kênh có tên là 'NK-THAY-ĐỔI-TÊN'
//                 const fetchedChannels = await newChannel.guild.channels.fetch();
//                 const logChannel = fetchedChannels.find(channel => channel.name.toLowerCase() === nameChannel.toLowerCase()); // Thêm toLowerCase() để không phân biệt chữ hoa và chữ thường

//                 if (logChannel && logChannel.type === ChannelType.GuildText) {
//                     try {
//                         // Tìm nạp nhật ký kiểm tra để lấy user đã thay đổi tên kênh
//                         const fetchedLogs = await newChannel.guild.fetchAuditLogs({
//                             limit: 1,
//                             type: AuditLogEvent.ChannelUpdate,
//                         });
                        
//                         const auditLogEntry = fetchedLogs.entries.first();
//                         const user = auditLogEntry ? auditLogEntry.executor : null;
//                         const userName = user ? user.tag : 'Người dùng không xác định';
                        
//                         const oldChannelName = oldChannel.name;
//                         const newChannelName = newChannel.name;

//                         // Xác định loại kênh và gửi thông báo tương ứng
//                         let channelTypeMessage = '';
//                         if (oldChannel.type === ChannelType.GuildText) {
//                             channelTypeMessage = 'VĂN BẢN';
//                         } else if (oldChannel.type === ChannelType.GuildVoice) {
//                             channelTypeMessage = 'THOẠI';
//                         }
//                         const sendtochannel = new EmbedBuilder()
//                             .setTitle(`THÔNG BÁO ĐỔI TÊN KÊNH ${channelTypeMessage}`)
//                             .setDescription(`Kênh __${oldChannelName}__ đã đổi tên thành __${newChannelName}__`)
//                             .setColor('Blue')
//                             .setFooter({ text: `Được đổi tên bởi ${userName}` })
//                             .setTimestamp();

//                         logChannel.send({ content: `@everyone`, embeds: [sendtochannel] });
//                     } catch (error) {
//                         console.error('Error fetching audit logs:', error);
//                     }
//                 } else {
//                     // Gửi tin nhắn DM cho người dùng khi không tìm thấy kênh 'NK-THAY-ĐỔI-TÊN'
//                     const owner = await newChannel.guild.members.fetch(newChannel.guild.ownerId);
//                     if (owner && owner.user) {
//                         const embedChannel = new EmbedBuilder()
//                             .setTitle('KHÔNG TÌM THẤY KÊNH')
//                             .setDescription(`Bạn cần có kênh văn bản ***${nameChannel}*** để mỗi khi bạn đổi tên kênh thoại hoặc kênh văn bản thì thông báo sẽ gửi vào ***${nameChannel}*** và không phải nhận tin nhắn này nữa. Đôi khi thời gian phản hồi sẽ bị trễ đó là do đường truyền mạng nên bạn không cần phải lo lắng về điều đó.`)
//                             .setColor('Red')
//                             .setFooter({ text: 'Được tạo bởi Valheim Survival' })
//                             .setTimestamp();
                            
//                         owner.user.send({ embeds: [embedChannel] });
//                     } else {
//                         console.error('Could not find the guild owner.');
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching channels:', error);
//             }
//         }
//     }
// };


const { EmbedBuilder, ChannelType, AuditLogEvent } = require('discord.js');
const config = require(`../../config`)
const EventStatus = require('../../schemas/Event_Status');

/*
Sự kiện channelUpdate khi tên kênh được thay đổi, sẽ nhận được thông báo trong kênh chỉ định
*/

module.exports = {
    name: "channelUpdate",

    async execute(oldChannel, newChannel) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'channelUpdate' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        const nameChannel = 'NK-THAY-ĐỔI-TÊN'; // Tên kênh cần tìm, kênh này sẽ nhận thông báo khi có sự thay đổi tên kênh trong máy chủ

        // Các từ khóa để loại trừ kênh khi tên bị đổi
        const excludedChannelKeywords = ['👥 Thành Viên', '🚫 Ban', '🤖 Bot', '💎 Tăng Cường'];

        // Kiểm tra xem tên kênh có thay đổi và kênh không nằm trong danh sách loại trừ
        if (oldChannel.name !== newChannel.name && !excludedChannelKeywords.some(keyword => oldChannel.name.includes(keyword))) {
            try {
                // Tìm nạp tất cả các kênh trong guild và tìm kênh có tên là 'NK-THAY-ĐỔI-TÊN'
                const fetchedChannels = await newChannel.guild.channels.fetch();
                const logChannel = fetchedChannels.find(channel => channel.name.toLowerCase() === nameChannel.toLowerCase()); // Thêm toLowerCase() để không phân biệt chữ hoa và chữ thường

                if (logChannel && logChannel.type === ChannelType.GuildText) {
                    try {
                        // Tìm nạp nhật ký kiểm tra để lấy user đã thay đổi tên kênh
                        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                            limit: 1,
                            type: AuditLogEvent.ChannelUpdate,
                        });

                        const auditLogEntry = fetchedLogs.entries.first();
                        const user = auditLogEntry ? auditLogEntry.executor : null;
                        const userName = user ? user.tag : 'Người dùng không xác định';

                        const oldChannelName = oldChannel.name;
                        const newChannelName = newChannel.name;

                        // Xác định loại kênh và gửi thông báo tương ứng
                        let channelTypeMessage = '';
                        if (oldChannel.type === ChannelType.GuildText) {
                            channelTypeMessage = 'VĂN BẢN';
                        } else if (oldChannel.type === ChannelType.GuildVoice) {
                            channelTypeMessage = 'THOẠI';
                        }
                        const sendtochannel = new EmbedBuilder()
                            .setTitle(`THÔNG BÁO ĐỔI TÊN KÊNH ${channelTypeMessage}`)
                            .setDescription(`Kênh __${oldChannelName}__ đã đổi tên thành __${newChannelName}__`)
                            .setColor(config.embedFuchsia)
                            .setFooter({ text: `Được đổi tên bởi ${userName}` })
                            .setTimestamp();

                        logChannel.send({ content: `@everyone`, embeds: [sendtochannel] });
                    } catch (error) {
                        console.error('Error fetching audit logs:', error);
                    }
                } else {
                    // Gửi tin nhắn DM cho người dùng khi không tìm thấy kênh 'NK-THAY-ĐỔI-TÊN'
                    const owner = await newChannel.guild.members.fetch(newChannel.guild.ownerId);
                    if (owner && owner.user) {
                        const embedChannel = new EmbedBuilder()
                            .setTitle('KHÔNG TÌM THẤY KÊNH')
                            .setDescription(`Bạn cần có kênh văn bản ***${nameChannel}*** để mỗi khi bạn đổi tên kênh hoặc tên máy chủ thì thông báo sẽ gửi vào ***${nameChannel}*** và không phải nhận tin nhắn này nữa. Đôi khi thời gian phản hồi sẽ bị trễ đó là do đường truyền mạng nên bạn không cần phải lo lắng về điều đó.`)
                            .setColor('Red')
                            .setFooter({ text: 'Được tạo bởi Valheim Survival' })
                            .setTimestamp();

                        owner.user.send({ embeds: [embedChannel] });
                    } else {
                        console.error('Không thể tìm thấy chủ bang hội.');
                    }
                }
            } catch (error) {
                console.error('Lỗi tìm nạp kênh:', error);
            }
        }
    }
};

