const { ActivityType } = require('discord.js');
const ms = require('ms');
const config = require(`../../config`);
const { loadCommands } = require('../../Handlers/CommandsHandler');
const GuildPrefix = require('../../schemas/GuildPrefix'); 

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const { user, ws } = client;

        // Lấy số lệnh toàn cục và lệnh guild
        const { totalGlobal, totalGuild } = await loadCommands(client);
        const totalCommands = totalGlobal + totalGuild;

        // Danh sách trạng thái theo thứ tự
        const activities = [
            { type: ActivityType.Watching, name: () => `${totalGlobal} lệnh / cho toàn bộ các máy chủ` },
            { type: ActivityType.Watching, name: () => `${totalGuild} lệnh / trong máy chủ cố định` },
            { type: ActivityType.Watching, name: () => `Bot có tổng ${totalCommands} lệnh /` }, // ${client.commands.size}
            { type: ActivityType.Watching, name: () => `${client.prefixCommands.size} lệnh ${process.env.PREFIX}` },
            { type: ActivityType.Watching, name: () => `${client.guilds.cache.size} máy chủ!` },
            { type: ActivityType.Watching, name: () => `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} thành viên!` },
            { type: ActivityType.Playing, name: () => `/commands_bot | @${client.user.username}` },
            { type: ActivityType.Watching, name: () => `Ping: ${ws.ping} ms` },
            {
                type: ActivityType.Streaming,
                name: () => '🔞 Status onl!',
                url: 'https://www.youtube.com/watch?v=kp7pXzjXStw',
                details: 'Đây là một thông điệp mô tả hoạt động',
                state: '/commands-bot | Valheim Studio',
            },
        ];

        // Vị trí trạng thái hiện tại
        let currentIndex = 0;

        // Hàm cập nhật trạng thái theo thứ tự
        function updateActivity() {
            const activity = activities[currentIndex];

            if (activity.type === ActivityType.Streaming) {
                user.setActivity({
                    name: activity.name() || activity.name(guildId),
                    type: activity.type,
                    url: activity.url,
                    details: activity.details,
                    state: activity.state,
                    assets: {
                        largeImageKey: 'emoji_soi', // Tên key của hình lớn
                        largeImageText: 'Valheim', // Chú thích cho hình lớn
                    },
                });
            } else {
                user.setActivity({
                    name: activity.name(),
                    type: activity.type,
                });
            }

            // Chuyển sang trạng thái tiếp theo, quay lại đầu nếu đã hết
            currentIndex = (currentIndex + 1) % activities.length;
        }

        // Cập nhật trạng thái mỗi 7.5 giây
        setInterval(updateActivity, ms("7500"));


    },
};







// const { ActivityType } = require('discord.js');
// const ms = require('ms');
// const config = require(`../../config`);
// const { loadCommands } = require('../../Handlers/CommandsHandler');
// const GuildPrefix = require('../../schemas/GuildPrefix');

// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {
//         const { user, ws } = client;

//         // Lấy số lệnh toàn cục và lệnh guild
//         const { totalGlobal, totalGuild } = await loadCommands(client);
//         const totalCommands = totalGlobal + totalGuild;

//         // Lấy danh sách prefix từ MongoDB
//         const guildPrefixes = await GuildPrefix.find();

//         // Tạo một map để tra cứu prefix theo guildId
//         const prefixMap = new Map();
//         guildPrefixes.forEach(({ guildId, prefix }) => {
//             prefixMap.set(guildId, prefix);
//         });

//         // Hàm lấy prefix cho từng guild
//         function getGuildPrefix(guildId) {
//             return prefixMap.get(guildId) || process.env.PREFIX;
//         }

//         // Danh sách trạng thái theo thứ tự
//         const activities = [
//             { type: ActivityType.Watching, name: () => `${totalGlobal} lệnh / cho toàn bộ các máy chủ` },
//             { type: ActivityType.Watching, name: () => `${totalGuild} lệnh / trong máy chủ cố định` },
//             { type: ActivityType.Watching, name: () => `Bot có tổng ${totalCommands} lệnh /` },
//             { type: ActivityType.Watching, name: (guildId) => `${client.prefixCommands.size} lệnh ${getGuildPrefix(guildId)}` },
//             { type: ActivityType.Watching, name: () => `${client.guilds.cache.size} máy chủ!` },
//             { type: ActivityType.Watching, name: () => `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} thành viên!` },
//             { type: ActivityType.Playing, name: () => `/commands_bot | @${client.user.username}` },
//             { type: ActivityType.Watching, name: () => `Ping: ${ws.ping} ms` },
//             {
//                 type: ActivityType.Streaming,
//                 name: () => '🔞 Status onl!',
//                 url: 'https://www.youtube.com/watch?v=kp7pXzjXStw',
//                 details: 'Đây là một thông điệp mô tả hoạt động',
//                 state: '/commands-bot | Valheim Studio',
//             },
//         ];

//         let currentIndex = 0;

//         async function updateActivity() {
//             const activity = activities[currentIndex];

//             // Lấy danh sách các guild mà bot đang tham gia
//             const guilds = [...client.guilds.cache.values()];

//             // Duyệt từng guild và cập nhật trạng thái riêng biệt
//             for (const guild of guilds) {
//                 const guildId = guild.id;
//                 if (activity.type === ActivityType.Streaming) {
//                     user.setActivity({
//                         name: activity.name(),
//                         type: activity.type,
//                         url: activity.url,
//                         details: activity.details,
//                         state: activity.state,
//                         assets: {
//                             largeImageKey: 'emoji_soi',
//                             largeImageText: 'Valheim',
//                         },
//                     });
//                 } else {
//                     user.setActivity({
//                         name: activity.name.length > 0 ? activity.name(guildId) : activity.name(), // activity.name(guildId),
//                         type: activity.type,
//                     });
//                 }
//                 // Chờ một chút trước khi cập nhật trạng thái tiếp theo (tránh spam API)
//                 await new Promise(resolve => setTimeout(resolve, 2000));
//             }

//             currentIndex = (currentIndex + 1) % activities.length;
//         }

//         setInterval(updateActivity, ms("7500"));
//     },
// };