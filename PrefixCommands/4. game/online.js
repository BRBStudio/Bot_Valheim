const { EmbedBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    name: 'online',
    description: 
        `🔸 Khởi động một trò chơi Discord Together trong kênh\n` +
        `       thoại, khi vào kênh thoại thì hãy dùng ?online <id game>\n` +
        `       trong kênh thoại để chơi game`,
    aliases: ['onl', 'g5'],
    async execute(msg) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?online' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Kiểm tra xem người gửi lệnh có ở trong kênh thoại không
        const channel = msg.member.voice.channel;

        if (!channel) {
            return msg.channel.send('Bạn cần tham gia vào một kênh thoại để khởi động trò chơi!');
        }

        // Tạo một Embed để hướng dẫn cách sử dụng
        const embed = new EmbedBuilder()
            .setTitle('Hướng dẫn khởi động trò chơi Discord Together')
            .addFields({ name : `Trò chơi Roll20(KGH)`, value: `?online 1199271093882589195`})
            .addFields({ name : `Trò chơi Blazing 8s(1-8)`, value: `?online 832025144389533716`})
            .addFields({ name : `Trò chơi Letter League(1-8)`, value: `?online 879863686565621790`})
            .addFields({ name : `Trò chơi Poker Night(1-7)`, value: `?online 755827207812677713`})

            .addFields({ name : `Trò chơi Magic Circle(1-9)`, value: `?online 1227719606223765687`})
            .addFields({ name : `Trò chơi Murder Mystery(1-8)`, value: `?online 1291414617943179305`})
            .addFields({ name : `Trò chơi Krunker Royale(1-48)`, value: `?online 1227546263558422601`})
            .addFields({ name : `Trò chơi Bloxd.io(1-40)`, value: `?online 1219647973806571553`})

            .addFields({ name : `Trò chơi Bobble Bash(1-8)`, value: `?online 1107689944685748377`})
            .addFields({ name : `Trò chơi Smash Karts(1-24)`, value: `?online 1217877285923979415`})
            .addFields({ name : `Trò chơi Krunker Strike FRVR(1-12)`, value: `?online 1011683823555199066`})
            .addFields({ name : `Trò chơi Idle Mafia(KGH)`, value: `?online 1245937701136633866`})

            .addFields({ name : `Trò chơi Goober Dash(1-32)`, value: `?online 1186785228182798556`})
            .addFields({ name : `Trò chơi SquadBlash(1-10)`, value: `?online 1247866565723160596`})
            .addFields({ name : `Trò chơi BattleTabs(1-20)`, value: `?online 1222462865345351760`})
            .addFields({ name : `Trò chơi Soulbound(1-15)`, value: `?online 1043607583119917136`})
            .addFields({ name : `Trò chơi Exoracer(1-8)`, value: `?online 1220052815590723654`})

        // Tách lệnh và lấy game ID từ tin nhắn
        const args = msg.content.split(' ').slice(1);
        const gameID = args[0];

        // Kiểm tra xem game ID đã được cung cấp chưa
        if (!gameID) {
            return msg.channel.send({ embeds: [embed] });
        }

        // Tạo một invite cho trò chơi
        try {
            const invite = await channel.createInvite({
                maxUses: 0,
                maxAge: 86400, // Thời gian hết hạn là 1 ngày
                targetApplication: gameID, // ID trò chơi
                targetType: 2, // 2 là loại trò chơi (Discord Together)
                temporary: false
            });

            // Gửi liên kết mời đến kênh văn bản
            return msg.channel.send(`Nhấp vào liên kết để chơi trò chơi: ${invite.url}`);
        } catch (error) {
            // console.error('Có lỗi xảy ra khi tạo invite:', error);
            return msg.channel.send('Có lỗi xảy ra khi khởi động trò chơi. Vui lòng thử ?online.');
        }
    },
};








// const { EmbedBuilder } = require('discord.js');

// module.exports = {
//     name: 'games',
//     description: 'Khởi động một trò chơi Discord Together trong kênh thoại, khi vào kênh thoại thì hãy dùng ?games <id game> trong kênh thoại để chơi game',
//     aliases: ['dt', 'g'],
//     async execute(msg) {
//         // Kiểm tra xem người gửi lệnh có ở trong kênh thoại không
//         const channel = msg.member.voice.channel;

//         if (!channel) {
//             return msg.channel.send('Bạn cần tham gia vào một kênh thoại để khởi động trò chơi!');
//         }

//         // Tạo một Embed để hướng dẫn cách sử dụng
//         const embed = new EmbedBuilder()
//             .setTitle('Khởi động trò chơi Discord Together')
//             .addFields({ name : `Trò chơi Chess in the park`, value: `?games 832012774040141894`})
//             .addFields({ name : `Trò chơi Blazing 8s`, value: `?games 761133272312456481`})
//             .addFields({ name : `Trò chơi Letter League`, value: `?games 940113202356042474`})
//             .addFields({ name : `Trò chơi Poker Night`, value: `?games 755600276941176913`});

//         // Tách lệnh và lấy game ID từ tin nhắn
//         const args = msg.content.split(' ').slice(1);
//         const gameID = args[0];

//         // Kiểm tra xem game ID đã được cung cấp chưa
//         if (!gameID) {
//             return msg.channel.send({ embeds: [embed] });
//         }

//         // Danh sách các ID trò chơi hợp lệ
//         const validGameIDs = [
//             '832012774040141894', // Chess in the Park
//             '761133272312456481', // Blazing 8s
//             '940113202356042474', // Letter League
//             '755600276941176913'  // Poker Night
//         ];

//         // Kiểm tra xem game ID có hợp lệ không
//         if (!validGameIDs.includes(gameID)) {
//             return msg.channel.send('ID trò chơi không hợp lệ. Vui lòng kiểm tra lại ID và thử lại.');
//         }

//         // Kiểm tra xem có người dùng nào đang phát trực tiếp trong kênh hay không
//         const voiceMembers = channel.members.filter(member => member.voice.streaming);
//         if (voiceMembers.size === 0) {
//             return msg.channel.send('Cần có người phát trực tiếp trong kênh này để khởi động trò chơi Discord Together.');
//         }

//         // Lấy ID của người dùng đầu tiên đang phát trực tiếp
//         const streamer = voiceMembers.first();

//         // Tạo một invite cho trò chơi
//         try {
//             const invite = await channel.createInvite({
//                 maxUses: 0,
//                 maxAge: 86400, // Thời gian hết hạn là 1 ngày
//                 targetApplication: gameID, // ID trò chơi
//                 targetType: 1, // 1 là loại trò chơi (Discord Together)
//                 temporary: false,
//                 targetUser: streamer.id // Đặt ID của người phát trực tiếp
//             });

//             // Gửi liên kết mời đến kênh văn bản
//             return msg.channel.send(`Nhấp vào liên kết để chơi trò chơi: ${invite.url}`);
//         } catch (error) {
//             console.error('Có lỗi xảy ra khi tạo invite:', error);
//             return msg.channel.send('Có lỗi xảy ra khi khởi động trò chơi. Vui lòng thử lại sau.');
//         }
//     },
// };

