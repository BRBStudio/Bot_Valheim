const { PermissionsBitField } = require(`discord.js`)
const messageCounts = new Map(); // Khai báo biến để đếm số tin nhắn
const EventStatus = require('../../schemas/Event_Status');

/*
Ngăn Spam tin nhắn 
*/

module.exports = {
    name: "messageCreate",
    async execute(message) {

        // // Kiểm tra trạng thái của sự kiện này
        // const eventStatus = await EventStatus.findOne({ event: 'spamMessage' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (message.author.bot || !message.guild) return;

        // Lấy prefix từ biến môi trường
        const prefix = process.env.PREFIX;

        // Kiểm tra xem tin nhắn có bắt đầu bằng tiền tố hay không
        if (message.content.startsWith(prefix)) return; // Nếu tin nhắn có tiền tố, không xử lý tiếp

        // Lấy ID của người gửi tin nhắn và ID của máy chủ
        const userId = message.author.id;
        const guildId = message.guild.id; // Lấy ID của máy chủ

        // Lấy thời gian hiện tại
        const now = Date.now();

        // Kiểm tra và khởi tạo cấu trúc dữ liệu cho guild nếu chưa tồn tại
        if (!messageCounts.has(guildId)) {
            messageCounts.set(guildId, new Map());
        }
        const guildMessageCounts = messageCounts.get(guildId);
        const userMessageCount = guildMessageCounts.get(userId) || { count: 0, firstMessageTimestamp: now };

        // Thời gian gửi tin nhắn gần nhất của người dùng
        const lastMessageTimestamp = userMessageCount.firstMessageTimestamp;

        // Tăng số lượng tin nhắn
        userMessageCount.count = (userMessageCount.count || 0) + 1;

        // Kiểm tra khoảng thời gian giữa các tin nhắn
        const cooldownAmount = 5 * 1000; // 30 giây
        const timeDifference = now - lastMessageTimestamp;

        if (timeDifference < cooldownAmount) {
            if (userMessageCount.count > 20) { // Kiểm tra nếu số lượng tin nhắn đã vượt quá 20

                


                // Tính thời gian còn lại
                const timeLeft = ((lastMessageTimestamp + cooldownAmount) - now) / 1000;

                // Nếu thời gian gửi tin nhắn quá gần, xóa tin nhắn hoặc thực hiện một hành động nào đó
                try {
                    await message.delete(); // Xóa tin nhắn
                    // Gửi tin nhắn cảnh báo vào kênh
                    try {
                        await message.channel.send(`${message.author}, Bạn đã gửi tin nhắn quá nhanh, điều này sẽ dẫn đến discord hiểu lầm bạn đang spam tin nhắn. Vui lòng chờ ít nhất **${timeLeft.toFixed(1)}** giây giữa các tin nhắn.\n\n⚠️ Khi chủ sở hữu máy chủ nhắc nhở rồi mà bạn vẫn cố tình spam thì bạn có thể bị trừng phạt do chủ sở hữu đưa ra quyết định mà không cần lý do.`);
                    } catch (error) {
                        console.error('Không thể gửi tin nhắn cảnh báo:', error);
                    }
                } catch (error) {
                    console.error('Không thể xóa tin nhắn:', error);
                }
            }
        } else {
            // Reset đếm số tin nhắn nếu khoảng thời gian giữa các tin nhắn đã quá lâu
            userMessageCount.count = 1;
            userMessageCount.firstMessageTimestamp = now; // Cập nhật thời gian tin nhắn đầu tiên
        }

        // Cập nhật lại số lượng tin nhắn và thời gian
        guildMessageCounts.set(userId, userMessageCount);
        messageCounts.set(guildId, guildMessageCounts);
    }
};

