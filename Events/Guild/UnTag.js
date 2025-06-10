const { EmbedBuilder } = require('discord.js');
const unpingSchemas = require('../../schemas/unpingSchema');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        // // Kiểm tra trạng thái của sự kiện này
        // const eventStatus = await EventStatus.findOne({ event: 'UnTag' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (message.author.bot || !message.guild) return;

        const guildId = message.guild.id; // Lấy ID của máy chủ
        const mentionedUser = message.mentions.users.first(); // Lấy người dùng đầu tiên được tag trong tin nhắn

        if (!mentionedUser) return; // Nếu không có người dùng nào được tag, kết thúc

        // Danh sách ID người dùng mặc định không thể bị ping
        const UnTag_ids = ['933544716883079278', '1215380543815024700'];

        try {

            // Kiểm tra nếu người dùng được tag có trong danh sách mặc định hoặc trong cơ sở dữ liệu
            const UnTag_defaul = UnTag_ids.includes(mentionedUser.id);

            // Kiểm tra trong MongoDB xem người dùng bị tag có trong danh sách tránh ping không
            const result = await unpingSchemas.findOne({ Guild: guildId, User: mentionedUser.id });

            if (UnTag_defaul || result) {
                // Nếu người dùng được tìm thấy trong danh sách tránh ping, tạo tin nhắn embed
                const pingEmbed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Tránh chủ sở hữu Ping")
                    .setDescription(`\`\`\`yml\nXin chào [${message.author.displayName}]!, Vui lòng tránh ping người dùng [${mentionedUser.displayName}]. Đây là thông tin tôi nhận được từ BQT.\`\`\``)
                    .setTimestamp()
                    .setImage('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYm4xMGQ3NnoyNmY3bXV2Ymk5YnBzdHN6eWk4OWY5OWpzazZ0aGIxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yIdJwdk14j39Lm3epL/giphy.gif')
                    .setFooter({ text: `🤖 Được yêu cầu bởi ${client.user.username}                                   ⏰` });

                // Gửi tin nhắn embed
                await message.channel.send({ embeds: [pingEmbed] });
            }
        } catch (error) {
            console.error(`Lỗi khi tìm kiếm trong MongoDB: ${error.message}`);
        }
    }
};