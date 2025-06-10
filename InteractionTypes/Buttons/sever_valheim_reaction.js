const { EmbedBuilder } = require('discord.js');
const votes = require('../../schemas/Vote_open_valheim');

module.exports = {
    id: 'sever_valheim_reaction',
    description: 'Nút này ghi nhận phiếu bình chọn ⭐ của người dùng.',
    async execute(interaction) {
        const { user, guild } = interaction;

        // Lấy dữ liệu bỏ phiếu của đúng server
        const voteData = await votes.findOne({ Guild: guild.id });
        if (!voteData) {
            return await interaction.reply({ content: '❌ Không tìm thấy cuộc bỏ phiếu cho server đang diễn ra trong máy chủ này!', ephemeral: true });
        }

        // Kiểm tra nếu người dùng đã bỏ phiếu trước đó
        const hasVoted = voteData.Voters.includes(user.id);
        if (hasVoted) {
            // Xóa phiếu bầu nếu người dùng đã bỏ phiếu trước đó
            voteData.Voters = voteData.Voters.filter(id => id !== user.id);
            voteData.TotalVotes -= 1;
            await voteData.save();

            await interaction.reply({ content: `✅ Bạn đã **hủy phiếu** của mình cho server **${voteData.Server}**.`, ephemeral: true });
        } else {
            // Thêm phiếu bầu mới
            voteData.Voters.push(user.id);
            voteData.TotalVotes += 1;
            await voteData.save();

            await interaction.reply({ content: `✅ Bạn đã **bỏ phiếu** thành công cho server **${voteData.Server}**!`, ephemeral: true });
        }


        // Cập nhật lại nội dung Embed
        const updatedEmbed = new EmbedBuilder()
            .setColor('Gold')
            .setAuthor({ name: 'Valheim Roleplay' })
            .setTitle(`🚀 Bỏ phiếu mở Server!`)
            .setDescription(`Một cuộc bỏ phiếu để mở server **Valheim Roleplay** vừa được khởi động! Nếu bạn bỏ phiếu, bạn có thể tham gia sever beta của chúng tôi!`)
            .addFields(
                { name: '> 🏰 Thông tin Server:', value: `**🔹 Tên server:** ${voteData.Server}\n**🔹 Mã tham gia:** ${voteData.Code}\n**🔹 Chủ Server:** <@${voteData.Owner}>\n\n**⚠️ ${voteData.Vote_request} PHIẾU BẦU CẦN THIẾT!**` },
                { name: '> 📊 Số phiếu bầu:', value: `🔘 **${voteData.TotalVotes} phiếu bầu**` },
                { name: '> ⏱️ Thời gian bỏ phiếu:', value: `⏳ **3 tháng**` }

            )
            .setTimestamp();

        // Cập nhật tin nhắn
        await interaction.message.edit({ embeds: [updatedEmbed] });
    }
};
