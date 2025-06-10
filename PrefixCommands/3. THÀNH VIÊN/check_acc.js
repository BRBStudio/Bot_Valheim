const { EmbedBuilder } = require('discord.js');
const canvafy = require("canvafy");

module.exports = {
    name: 'check_acc',
    description: '🔸 Kiểm tra xem tài khoản có an toàn (uy tín hay không).',
    hd: '🔸 ?check_acc <@tag_người_dùng>',
    aliases: ['ckeck', 'tv2'],

    async execute(message, args) {
        try {

            // // Kiểm tra xem có ID người dùng nào được cung cấp hay không
            // const memberId = args[0] || message.author.id; // Nếu không có ID, dùng ID của người gửi lệnh

            // // Lấy thông tin thành viên từ ID
            // const member = message.guild.members.cache.get(memberId);

            // // Kiểm tra xem có người dùng nào được tag hay không
            // const member = message.mentions.members.first() || message.guild.members.cache.get(message.author.id);

            // Lấy thành viên đầu tiên được tag, nếu không có thì lấy thành viên gửi tin nhắn
            const member = message.guild.members.cache.get(message.mentions.members.first()?.id || message.author.id);

            // Kiểm tra nếu không tìm thấy người dùng thì trả về thông báo
            if (!member) {
                return message.channel.send("Không tìm thấy người dùng để kiểm tra!");
            }

            // Thời gian tài khoản đã được tạo (timestamp)
            const accountCreatedTimestamp = member.user.createdTimestamp;
            const currentTimestamp = Date.now();
            const accountAge = currentTimestamp - accountCreatedTimestamp;

            // Chuyển đổi thời gian thành ngày, giờ
            const daysOld = Math.floor(accountAge / (1000 * 60 * 60 * 24)); // Tính số ngày
            const hoursOld = Math.floor((accountAge % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Tính số giờ còn lại

            

            // Kiểm tra nếu tài khoản đã tồn tại hơn 1 tuần (604800000 ms)
            // const isSuspect = accountAge < 604800000;

            const oneWeek = 5184000000; // 7 ngày  604800000 14 ngày 5184000000
            const oneMonth = 7776000000; // 30 ngày 2592000000 3 tháng 7776000000
            let isSuspect = false;

            // Tạo thông báo chi tiết
            let statusMessage = '';
            if (accountAge < oneWeek) {
                statusMessage = `Tài khoản ${member} rất mới, được tạo cách đây ${daysOld} ngày (${hoursOld} giờ). Hãy cẩn thận!`;
                isSuspect = true
            } else if (accountAge < oneMonth) {
                statusMessage = `Tài khoản ${member} đã tồn tại ${daysOld} ngày (${hoursOld} giờ), nhưng vẫn chưa đạt mốc 1 tháng. Hãy cân nhắc trước khi tin tưởng.`;
                isSuspect = true
            } else {
                statusMessage = `Tài khoản ${member} đã tồn tại được ${daysOld} ngày (${hoursOld} giờ), và đã được xác minh an toàn, nhưng cẩn thận thì vẫn tốt hơn!`;
            }

            // Tạo đối tượng security cho ảnh bảo mật
            const security = await new canvafy.Security()
                .setAvatar(member.user.displayAvatarURL({ extension: "png", forceStatic: true }))
                .setBackground("image", "https://i.imgur.com/U6dpDKR.jpeg")
                .setCreatedTimestamp(accountCreatedTimestamp)
                .setSuspectTimestamp(isSuspect ? oneMonth : oneWeek)
                .setBorder("#00FFFF")
                .setLocale("vi") // Mã quốc gia ngắn - mặc định "en"
                .setAvatarBorder("#f0f0f0")
                .setOverlayOpacity(0.9)
                .build();


            // Gửi hình ảnh vào kênh cụ thể với thông báo
            await message.channel.send({
                content: statusMessage, // Thêm trạng thái vào tin nhắn
                files: [{
                    attachment: security,
                    name: `security-${member.id}.png`
                }],
                allowedMentions: { parse: [] }
            });

        } catch (error) {
            console.error(error); // Hiển thị lỗi nếu có
            await message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh. Vui lòng thử lại!');
        }
    }
};

