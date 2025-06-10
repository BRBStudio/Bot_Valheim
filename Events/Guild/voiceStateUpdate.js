// /*
// bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại và đếm thời gian thoại
// */

// Bot đọc tên người dùng và ghi nhận thời gian tham gia kênh thoại
const voiceQueue = require('../../queue');
const GuildUpdateStatus = require('../../schemas/brb_studio');
const VoiceTime = require('../../schemas/numbervoice');

const activeVoiceSessions = new Map(); // Lưu trữ phiên làm việc của người dùng

module.exports = {
    name: 'voiceStateUpdate',

    async execute(oldState, newState) {
        try {
            const guildId = newState.guild.id;

            // Kiểm tra trạng thái sự kiện "voiceStateUpdate" với category "readName"
            let status = await GuildUpdateStatus.findOne({
                guildId,
                event: 'voiceStateUpdate',
                Ghi_chú: 'bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại',
            });

            if (!status) {
                status = await GuildUpdateStatus.create({
                    guildId,
                    event: 'voiceStateUpdate',
                    Ghi_chú: 'bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại',
                    isEnabled: true,
                });
            }

            if (!status.isEnabled) return;

            const oldVoiceChannel = oldState.channel;
            const newVoiceChannel = newState.channel;

            // Xử lý sự kiện rời kênh thoại
            if (oldVoiceChannel && oldVoiceChannel.id !== newVoiceChannel?.id) {
                if (oldState.member.user.bot) return;

                const userId = oldState.id;
                const displayName = oldState.member.displayName;
                const sessionKey = `${guildId}-${userId}`;

                if (activeVoiceSessions.has(sessionKey)) {
                    const startTime = activeVoiceSessions.get(sessionKey);
                    const endTime = Date.now();
                    const durationInSeconds = (endTime - startTime) / 1000; // Tính thời gian tham gia (giây)
                    const durationInHours = (durationInSeconds / 3600).toFixed(2); // Quy đổi giây sang giờ và làm tròn 2 chữ số thập phân

                    activeVoiceSessions.delete(sessionKey);

                    await VoiceTime.findOneAndUpdate(
                        { guildId, userId },
                        { $inc: { TimeVoice: parseFloat(durationInHours) }, $set: { displayName } },
                        { upsert: true }
                    );
                }

                const textToSpeak = `${displayName} đã rời khỏi kênh thoại ${oldVoiceChannel.name}.`;
                voiceQueue.addToQueue({ text: textToSpeak, channel: oldVoiceChannel, type: 'voice' });
            }

            // Xử lý sự kiện tham gia kênh thoại
            if (newVoiceChannel && oldVoiceChannel?.id !== newVoiceChannel.id) {
                if (newState.member.user.bot) return;

                const userId = newState.id;
                const displayName = newState.member.displayName;
                const sessionKey = `${guildId}-${userId}`;

                activeVoiceSessions.set(sessionKey, Date.now()); // Ghi nhận thời gian bắt đầu

                const textToSpeak = `${displayName} đã vào kênh thoại ${newVoiceChannel.name}.`;
                voiceQueue.addToQueue({ text: textToSpeak, channel: newVoiceChannel, type: 'voice' });
            }
        } catch (error) {
            console.error('Lỗi xử lý voiceStateUpdate:', error);
        }
    },
};































// mã này đang dùng hiện tại, mã trên cùng đang thay đổi, nếu lỗi thì dùng tạm mã này
// const voiceQueue = require('../../queue');
// const GuildUpdateStatus = require('../../schemas/brb_studio');

// module.exports = {
//     name: 'voiceStateUpdate',

//     async execute(oldState, newState) {
//         try {
//             const guildId = newState.guild.id;

//             // Kiểm tra trạng thái sự kiện "voiceStateUpdate" với category "readName"
//             let status = await GuildUpdateStatus.findOne({ guildId, event: 'voiceStateUpdate', Ghi_chú: 'bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại' });

//             // Nếu chưa có bản ghi, tạo mặc định là bật (isEnabled = true)
//             if (!status) {
//                 status = await GuildUpdateStatus.create({
//                     guildId,
//                     event: 'voiceStateUpdate',
//                     Ghi_chú: 'bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại',
//                     isEnabled: true, // Mặc định bật
//                 });
//             }

//             // Nếu trạng thái bị tắt, thoát hàm
//             if (!status.isEnabled) return;

//             const oldVoiceChannel = oldState.channel;
//             const newVoiceChannel = newState.channel;

//             // Xử lý sự kiện rời kênh thoại
//             if (oldVoiceChannel && oldVoiceChannel.id !== newVoiceChannel?.id) {
//                 if (oldState.member.user.bot) return;

//                 const displayName = oldState.member.displayName;
//                 const textToSpeak = `${displayName} đã rời khỏi kênh thoại ${oldVoiceChannel.name}.`;

//                 voiceQueue.addToQueue({ text: textToSpeak, channel: oldVoiceChannel, type: 'voice' });
//             }

//             // Xử lý sự kiện tham gia kênh thoại
//             if (newVoiceChannel && oldVoiceChannel?.id !== newVoiceChannel.id) {
//                 if (newState.member.user.bot) return;

//                 const displayName = newState.member.displayName;
//                 const textToSpeak = `${displayName} đã vào kênh thoại ${newVoiceChannel.name}.`;

//                 voiceQueue.addToQueue({ text: textToSpeak, channel: newVoiceChannel, type: 'voice' });
//             }
//         } catch (error) {
//             console.error('Lỗi xử lý voiceStateUpdate:', error);
//         }
//     },
// };







































// mã này nếu các mã trên lỗi thì dùng lại mã ban đầu này
// const voiceQueue = require('../../queue');
// const EventStatus = require('../../schemas/Event_Status');

// module.exports = {
//     name: "voiceStateUpdate",

//     async execute(oldState, newState) {

//             // Kiểm tra trạng thái của sự kiện này
//             const eventStatus = await EventStatus.findOne({ event: 'voiceStateUpdate' });

//             // Nếu sự kiện không được bật, thoát khỏi hàm
//             if (!eventStatus || eventStatus.status === 'off') {
//                 return; // Không làm gì cả nếu sự kiện bị tắt
//             }

//         try {

//             const oldVoiceChannel = oldState.channel; // Lấy kênh thoại cũ của người dùng
//             const newVoiceChannel = newState.channel; // Lấy kênh thoại mới của người dùng

//             // Kiểm tra nếu người dùng rời khỏi kênh thoại
//             if (oldVoiceChannel && !newVoiceChannel) {
//                 // Kiểm tra xem người dùng có phải là bot hay không
//                 if (oldState.member.user.bot) return; // Nếu là bot thì thoát hàm

//                 const displayName = oldState.member.displayName; // Lấy tên hiển thị của người dùng
//                 const textToSpeak = `${displayName} đã rời khỏi kênh thoại ${oldVoiceChannel.name}.`; // Tạo văn bản cần phát

//                 // Thêm yêu cầu vào hàng đợi
//                 voiceQueue.addToQueue({ text: textToSpeak, channel: oldVoiceChannel, type: 'voice' });
//             }

//             // Kiểm tra nếu người dùng tham gia kênh thoại
//             if ((oldState.channelId !== newState.channelId) && newVoiceChannel) {
//                 // Kiểm tra xem người dùng có phải là bot hay không
//                 if (newState.member.user.bot) return; // Nếu là bot thì thoát hàm

//                 const displayName = newState.member.displayName; // Lấy tên hiển thị của người dùng
//                 const textToSpeak = `${displayName} đã vào kênh thoại ${newVoiceChannel.name}.`; // Tạo văn bản cần phát

//                 // Thêm yêu cầu vào hàng đợi
//                 voiceQueue.addToQueue({ text: textToSpeak, channel: newVoiceChannel, type: 'voice' });
//             }
//         } catch (error) {
//             console.error('Lỗi xử lý voiceStateUpdate:', error);
//         }
//     }
// };