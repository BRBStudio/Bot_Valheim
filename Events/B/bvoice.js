const { ChannelType } = require('discord.js');
const interactionError = require('../../Events/WebhookError/interactionError');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'bvoice' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (msg.author.bot || !msg.guild) return;
        
        try {

            // Kiểm tra nếu tin nhắn được gửi trong kênh văn bản của máy chủ
            if (msg.channel.type === ChannelType.GuildText) {

                // Biểu thức chính quy để kiểm tra tên kênh và danh mục (category)
                const voiceRegex = /^Bvoice\s+(.+?)\s*-\s*(.+)$/i;
                const match = msg.content.match(voiceRegex);

                // Nếu tin nhắn phù hợp với định dạng
                if (match) {

                    const guildOwner = msg.guild.ownerId;
            
                    if (msg.author.id !== guildOwner) {
                        return msg.channel.send('Bạn không có quyền sử dụng lệnh này, lệnh này dành cho chủ sở hữu máy chủ.');
                    }

                    const voiceChannelName = match[1].trim(); // Lấy tên kênh từ tin nhắn
                    const categoryName = match[2].trim(); // Lấy tên danh mục từ tin nhắn

                    // Tìm danh mục (category) dựa trên tên
                    const category = msg.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === categoryName.toLowerCase());

                    if (!category) {
                        return msg.reply(`Không tìm thấy danh mục với tên: ${categoryName}`);
                    }

                    // Tạo kênh voice trong danh mục được chỉ định
                    msg.guild.channels.create({
                        name: voiceChannelName,
                        type: ChannelType.GuildVoice,
                        parent: category.id // Đặt kênh trong danh mục tìm thấy
                    })
                    .then(channel => {
                        msg.reply(`Đã tạo kênh thoại: ${channel.name} trong danh mục ${category.name}`);
                    })
                    .catch(error => {
                        // Gửi lỗi nếu không tạo được kênh
                        interactionError.execute(msg, error, msg.client);
                    });
                }
            }
        } catch (error) {
            interactionError.execute(msg, error, msg.client);
        }
    }
};
