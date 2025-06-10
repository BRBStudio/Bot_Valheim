const { createBasicEmbed } = require('../../Embeds/embedsCreate');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!basic' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;

        if(msg.content === '!basic') {
            try {
                            // Tạo embed sử dụng hàm từ embedsCreate.js
                            const embed = createBasicEmbed(msg);
                            
                            // Gửi tin nhắn phản hồi với nội dung và embed
                            await msg.reply({ 
                                content: "Giải đáp thắc mắc cơ bản.",
                                embeds: [embed], 
                                ephemeral: true // Chỉ gửi tin nhắn cho người gửi lệnh
                            });
                        } catch (err) {
                            // In lỗi ra console và gửi thông báo lỗi tới người dùng
                            console.error("Lỗi khi xử lý lệnh:", err);
                            await msg.reply({ 
                                content: "Đã xảy ra lỗi khi xử lý lệnh.",
                                ephemeral: true 
                            });
                        }
        }
    }
};