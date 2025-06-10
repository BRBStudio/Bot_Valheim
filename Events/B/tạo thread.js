const { ChannelType } = require('discord.js');
const interactionError = require('../../Events/WebhookError/interactionError');
const EventStatus = require('../../schemas/Event_Status');
/*
thread Tên chủ đề - Nội dung của chủ đề. @ (tag vai trò hoặc người dùng)
*/
module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

            // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
            // const eventStatus = await EventStatus.findOne({ event: 'tạo_thread' });

            // // Nếu sự kiện không được bật, thoát khỏi hàm
            // if (!eventStatus || eventStatus.status === 'off') {
            //     return; // Không làm gì cả nếu sự kiện bị tắt
            // }


            // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
            if (msg.author.bot || !msg.guild) return;

        try {
            
            // Kiểm tra nếu tin nhắn được gửi trong kênh văn bản của máy chủ
            if (msg.channel.type === ChannelType.GuildText) {
                // Điều chỉnh biểu thức chính quy nếu cần
                const regex = /^Bthread\s+(.+?)\s*-\s*(.+?)(\s*<@&\d+>)?$/i;
                const match = msg.content.match(regex);

                // Kiểm tra định dạng tin nhắn có khớp với biểu thức chính quy
                if (match && match[1] && match[2]) {
                    const threadName = match[1].trim(); // Lấy tên chủ đề
                    const threadContent = match[2].trim(); // Lấy nội dung
                    const roleTag = match[3] ? match[3].trim() : ''; // Lấy vai trò nếu có, nếu không thì để trống

                    // Tạo kênh chủ đề mới với tên chủ đề
                    msg.channel.threads.create({
                        name: threadName,
                        autoArchiveDuration: 60, // Thay đổi thời gian tự động lưu trữ (1 phút)
                        reason: `Chủ đề được tạo từ tin nhắn của ${msg.author.tag}`
                    }).then(thread => {
                
                        const message = roleTag 
                            ? `${roleTag} có thể thảo luận về đề xuất "${threadName}" với nội dung: "${threadContent}".` 
                            : `Người dùng có thể thảo luận về đề xuất "${threadName}" với nội dung: "${threadContent}".`;

                        thread.send(message);

                        // Xóa chủ đề sau 10 phút
                        setTimeout(() => {
                            thread.delete();
                        }, 10 * 60 * 1000); // 10 phút
                    });
                }
            }
        } catch (error) {
            interactionError.execute(msg, error, msg.client);
        }        
    }
};

