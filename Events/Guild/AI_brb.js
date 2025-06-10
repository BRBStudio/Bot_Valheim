// // events/AI_brb.js
// const { Events } = require('discord.js');
// const Answer = require('../../schemas/answerSchema');
// const UserProfile = require('../../schemas/useAISchema');

// /*
// 	các mã liên quan:
// 	- bot_ai.js.js trong thư mục Commands dùng để setting câu hỏi, câu trả lời, cũng như link kênh
// 	- useAISchema.js trong thư mục schemas dùng để lưu tên người dùng
// 	- answerSchema.js trong thư mục schemas dùng để lưu trữ câu hỏi, câu trả lời của từng người dùng, và lưu trữ id kênh (nếu nó)
// */

// module.exports = {
//     name: Events.MessageCreate,
//     async execute(message, client) {

//         const recentlyGreeted = new Map(); // Dùng Map để theo dõi từng người trong kênh

//         if (
//             message.author.bot ||
//             !message.guild ||
//             message.channel.id !== '1374533510341070889'
//         ) return;

//         const userId = message.author.id;
//         const content = message.content.toLowerCase().trim();


//         // Gửi lời chào nếu chưa chào gần đây
//                 if (!recentlyGreeted.has(userId)) {
//             recentlyGreeted.add(userId);
//             setTimeout(() => recentlyGreeted.delete(userId), 5 * 60 * 1000); // Xoá sau 5 phút
//             message.channel.send({ content: `👋 Xin chào <@${userId}>, tôi có thể giúp gì cho bạn?`, allowedMentions: { repliedUser: false } });
//         }


//         // --- Gán tên người dùng ---
//         const setNamePatterns = [
//             /^hãy gọi tôi là (.+)/,
//             /^gọi tôi là (.+)/,
//             /^tôi tên là (.+)/,
//             /^hãy lưu tên tôi là (.+)/,
//             /^lưu tên tôi là (.+)/,
//             /^từ giờ hãy gọi tôi là (.+)/,
//         ];

//         for (const pattern of setNamePatterns) {
//             const match = content.match(pattern);
//             if (match) {
//                 const nickname = match[1].trim();
//                 let profile = await UserProfile.findOne({ userId });
//                 if (!profile) profile = new UserProfile({ userId });

//                 profile.nickname = nickname;
//                 await profile.save();

//                 return message.channel.send({ content: `✅ Nhớ rồi! Tôi sẽ gọi bạn là **${nickname}** từ giờ nhé  \:heart:`, allowedMentions: { repliedUser: false } });
//             }
//         }

//         // --- Hỏi lại tên ---
//         const askNamePatterns = [
//             /^tôi là ai[\?]?$/,
//             /^tôi tên gì[\?]?$/,
//             /^tôi tên là gì[\?]?$/,
//             /^bạn gọi tôi là gì[\?]?$/,
//             /^bạn nhớ tên tôi không[\?]?$/,
//             /^bạn gọi tôi với cái tên nào[\?]?$/,
//             /^bạn biết tôi là ai không[\?]?$/,
//             /^bạn còn nhớ tôi là ai không[\?]?$/,
//             /^bạn còn nhớ tôi không[\?]?$/,
//             /^bạn nhớ tôi là ai không[\?]?$/,
//             /^bạn có nhớ tôi không[\?]?$/,
//         ];

//         if (askNamePatterns.some(p => content.match(p))) {
//             const profile = await UserProfile.findOne({ userId });
//             if (profile?.nickname) {
//                 const name = profile.nickname.toLowerCase();

//                 if (name === 'sếp') {
//                     return message.channel.send({ content: `**${profile.nickname}** thân yêu của tôi ơi, hỏi gì khó hơn được không hehehe.`, allowedMentions: { repliedUser: false } });
//                 } else if (name === 'bot') {
//                     return message.channel.send({ content: `U là trời, cái tên **${profile.nickname}** sao quên được mà bạn lo, giống với chức năng của tôi mà kakaka.`, allowedMentions: { repliedUser: false } });
//                 } else {
//                     return message.channel.send({ content: `Bạn là **${profile.nickname}** đó!`, allowedMentions: { repliedUser: false } });
//                 }
//             } else {
//                 return message.channel.send({ content: `❗ Tôi chưa biết tên bạn. Hãy nói "hãy gọi tôi là [tên]" để tôi ghi nhớ nhé.`, allowedMentions: { repliedUser: false } });
//             }
//         }

//         // --- Tra MongoDB ---
//         const qa = await Answer.findOne({ question: content });
//         if (qa) {
//             let reply = qa.answer;
//             if (qa.channelId) {
//                 try {
//                 // Fetch từ Guild B
//                 const guildB = await client.guilds.fetch('1028540923249958912');
//                 const channel = await guildB.channels.fetch(qa.channelId);

//                 if (channel) {
//                     reply += ` https://discord.com/channels/${channel.guild.id}/${channel.id} nhé`;
//                 } else {
//                     reply += `\n⚠️ Kênh đính kèm không tồn tại nữa.`;
//                 }
//                 } catch (err) {
//                 reply += `\n⚠️ Không thể lấy thông tin kênh (${qa.channelId}).`;
//                 }
//             }
//             return message.channel.send(reply);
//         }
//     }
// };



// events/AI_brb.js
const { Events } = require('discord.js');
const Answer = require('../../schemas/answerSchema');
const UserProfile = require('../../schemas/useAISchema');

const recentlyGreeted = new Map(); // Dùng Map để theo dõi từng người trong kênh

/*
    * Các mã liên quan:
        - bot_ai.js.js trong thư mục Commands dùng để setting câu hỏi, câu trả lời, cũng như link kênh
        - useAISchema.js trong thư mục schemas dùng để lưu tên người dùng
        - answerSchema.js trong thư mục schemas dùng để lưu trữ câu hỏi, câu trả lời của từng người dùng, và lưu trữ id kênh (nếu nó)
*/

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const userId = message.author.id;
        const content = message.content.toLowerCase().trim();
        const channelId = message.channel.id;

        // --- Kênh được định nghĩa ---
        const TEXT_CHANNEL_ID = '1374533510341070889';

        // --- Gửi lời chào ngay khi người dùng gửi tin nhắn trong kênh đó ---
        if (channelId === TEXT_CHANNEL_ID) {
            const lastSeen = recentlyGreeted.get(userId);
            const now = Date.now();

            // Nếu chưa chào hoặc đã quá 1 tiếng (3600) , 1 ngày (86400)
            if (!lastSeen || now - lastSeen > 86400 * 1000) {
                recentlyGreeted.set(userId, now);
                message.channel.send({
                    content: `👋 Xin chào <@${userId}>, tôi có thể giúp gì cho bạn?`,
                    allowedMentions: { repliedUser: false }
                });
            }
        }

        // --- Gán tên người dùng ---
        const setNamePatterns = [
            /^hãy gọi tôi là (.+)/,
            /^gọi tôi là (.+)/,
            /^tôi tên là (.+)/,
            /^hãy lưu tên tôi là (.+)/,
            /^lưu tên tôi là (.+)/,
            /^từ giờ hãy gọi tôi là (.+)/,
        ];

        for (const pattern of setNamePatterns) {
            const match = content.match(pattern);
            if (match) {
                const nickname = match[1].trim();
                let profile = await UserProfile.findOne({ userId });
                if (!profile) profile = new UserProfile({ userId });

                profile.nickname = nickname;
                await profile.save();

                return message.channel.send({
                    content: `✅ Nhớ rồi! Tôi sẽ gọi bạn là **${nickname}** từ giờ nhé  \:heart:`,
                    allowedMentions: { repliedUser: false }
                });
            }
        }

        // --- Hỏi lại tên ---
        const askNamePatterns = [
            /^tôi là ai[\?]?$/,
            /^tôi tên gì[\?]?$/,
            /^tôi tên là gì[\?]?$/,
            /^bạn gọi tôi là gì[\?]?$/,
            /^bạn nhớ tên tôi không[\?]?$/,
            /^bạn gọi tôi với cái tên nào[\?]?$/,
            /^bạn biết tôi là ai không[\?]?$/,
            /^bạn còn nhớ tôi là ai không[\?]?$/,
            /^bạn còn nhớ tôi không[\?]?$/,
            /^bạn nhớ tôi là ai không[\?]?$/,
            /^bạn có nhớ tôi không[\?]?$/,
        ];

        if (askNamePatterns.some(p => content.match(p))) {
            const profile = await UserProfile.findOne({ userId });
            if (profile?.nickname) {
                const name = profile.nickname.toLowerCase();

                if (name === 'sếp') {
                    return message.channel.send({
                        content: `**${profile.nickname}** thân yêu của tôi ơi, hỏi gì khó hơn được không hehehe.`,
                        allowedMentions: { repliedUser: false }
                    });
                } else if (name === 'bot') {
                    return message.channel.send({
                        content: `U là trời, cái tên **${profile.nickname}** sao quên được mà bạn lo, giống với chức năng của tôi mà kakaka.`,
                        allowedMentions: { repliedUser: false }
                    });
                } else {
                    return message.channel.send({
                        content: `Bạn là **${profile.nickname}** đó!`,
                        allowedMentions: { repliedUser: false }
                    });
                }
            } else {
                return message.channel.send({
                    content: `❗ Tôi chưa biết tên bạn. Hãy nói "hãy gọi tôi là [tên]" để tôi ghi nhớ nhé.`,
                    allowedMentions: { repliedUser: false }
                });
            }
        }

        // --- Trả lời câu hỏi ---
        const qa = await Answer.findOne({ question: content });
        if (qa) {
            let reply = qa.answer;
            if (qa.channelId) {
                try {
                    const guildB = await client.guilds.fetch('1028540923249958912');
                    const channel = await guildB.channels.fetch(qa.channelId);

                    if (channel) {
                        reply += ` https://discord.com/channels/${channel.guild.id}/${channel.id} nhé`;
                    } else {
                        reply += `\n⚠️ Kênh đính kèm không tồn tại nữa.`;
                    }
                } catch (err) {
                    reply += `\n⚠️ Không thể lấy thông tin kênh (${qa.channelId}).`;
                }
            }
            return message.channel.send(reply);
        }
    }
};
