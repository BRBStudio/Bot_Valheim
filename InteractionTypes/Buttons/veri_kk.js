const { joinVoiceChannel } = require("@discordjs/voice");
const guildsettings = require("../../schemas/test_xác_minh_voice");

// dùng kết hợp với lệnh /verisay và dữ liệu mongoDB test_xác_minh_voice
module.exports = {
    id: "verify-kk",
    description: `Nút này được sử dụng nói sẽ cáp vai trò cho người dùng`,
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const data = await guildsettings.findOne({ guildid: interaction.guild.id });
        if (!data) {
        return interaction.editReply("Không tìm thấy dữ liệu cấu hình xác minh.");
        }

        const voiceChannelId = data.auto.verify.voice;
        const requiredMessage = data.auto.verify.message;
        const roleId = data.auto.verify.role;
        const member = interaction.member;

        // Kiểm tra xem người dùng có đang ở trong đúng kênh thoại không
        if (!member.voice.channel || member.voice.channel.id !== voiceChannelId) {
        return interaction.editReply("Bạn cần tham gia đúng kênh thoại để xác minh.");
        }

        // Gửi hướng dẫn cho người dùng về từ hoặc câu họ cần nói
        await interaction.editReply(`Đang chờ bạn nói từ xác minh... Vui lòng nói: **"${requiredMessage}"**`);

        try {
        // Kết nối vào kênh thoại
        const connection = joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        // Tạo một bộ nhận audio từ kết nối
        const receiver = connection.receiver;

        receiver.speaking.on("start", async (userId) => {
            if (userId === member.id) {
            // Giả sử bạn có cơ chế để xử lý giọng nói và khớp với requiredMessage
            await member.roles.add(roleId);
            interaction.followUp(`Bạn đã được xác minh thành công và được gán vai trò <@&${roleId}>.`);
            connection.destroy(); // Ngắt kết nối sau khi hoàn thành
            }
        });
        
        } catch (error) {
        console.error(error);
        interaction.editReply("Đã xảy ra lỗi khi kết nối với kênh thoại.");
        }
    },
};