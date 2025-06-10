const { EmbedBuilder } = require('discord.js');
const interactionError = require('../../Events/WebhookError/interactionError');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'banggia' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (msg.author.bot || !msg.guild) return;

        try {

            // Kiểm tra xem tin nhắn có tag bot không và có chứa từ khóa "Bảng Giá"
            if (msg.mentions.has(msg.client.user) && msg.content.toLowerCase().includes('bảng giá')) {
                
                const guildOwner = msg.guild.ownerId;

                if (msg.author.id !== guildOwner) {
                    return msg.channel.send('Bạn không có quyền sử dụng lệnh này, lệnh này dành cho chủ sở hữu máy chủ.');
                }

                const contentArray = msg.content.toLowerCase().split('bảng giá');
                const content = contentArray[1] ? contentArray[1].trim() : '';

                // // Kiểm tra nếu content không tồn tại hoặc không đúng định dạng
                // if (!content) {
                //     return msg.channel.send('Hãy dùng lệnh /commands-new để xem định dạng.');
                // }

                // Tách các gói giá trị bằng dấu phẩy
                const packages = content.split(',').map(pkg => pkg.trim());

                // Kiểm tra xem có ít nhất 4 gói (để đảm bảo định dạng đúng)
                if (packages.length < 4) {
                    // Gửi tin nhắn phản hồi nếu định dạng không đúng
                    return msg.channel.send('Hãy dùng lệnh /commands-new để xem định dạng.');
                }

                // Gán giá trị cho từng gói, đảm bảo đúng thứ tự
                const tanBinh = packages[0] || 'N/A';
                const chienBinh = packages[1] || 'N/A';
                const sieuCapThuong = packages[2] || 'N/A';
                const sieuCapViking = packages[3] || 'N/A';

                // Kiểm tra định dạng cuối cùng
                let titleFormat = 'VÀNG VALHEIM'; // Giá trị mặc định cho tiêu đề

                // Nếu có ít nhất 5 gói, kiểm tra gói cuối cùng để xác định định dạng
                if (packages.length >= 5) {
                    titleFormat = packages[packages.length - 1].trim(); // Lấy định dạng cuối cùng
                    packages.pop(); // Xóa định dạng cuối cùng ra khỏi gói
                }

                titleFormat = titleFormat.toUpperCase();

                // Tạo embed với thông tin các gói đã được truyền
                const bg = new EmbedBuilder()
                    .setTitle(`BẢNG GIÁ QUY ĐỔI ${titleFormat} HÔM NAY`)
                    .setDescription(
                        `**• Gói Tân Binh:**            \n${tanBinh}\n\n` +
                        `**• Gói Chiến Binh:**          \n${chienBinh}\n\n` +
                        `**• Gói Siêu Cấp (thường):**   \n${sieuCapThuong}\n\n` +
                        `**• Gói Siêu Cấp Viking:**     \n${sieuCapViking}`
                    )
                    .setColor('Green')
                    .setFooter({ text: `Bảng giá được quy định bởi: ${msg.author.displayName}` })
                    .setTimestamp();

                // Gửi tin nhắn chứa embed
                msg.channel.send({ embeds: [bg] });
            }
        } catch (error) {
            interactionError.execute(msg, error, msg.client);
        }
    }
};