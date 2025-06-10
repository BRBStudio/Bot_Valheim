const { PermissionsBitField } = require('discord.js');
const votes = require('../../schemas/Vote_open_valheim');

module.exports = {
    id: 'sever_valheim_end',
    description: 'Nút này kết thúc cuộc bỏ phiếu mở server Valheim.',
    async execute(interaction) {
        const { user, guild, channel } = interaction;

        // Lấy dữ liệu bỏ phiếu của server hiện tại
        const voteData = await votes.findOne({ Guild: guild.id });
        if (!voteData) {
            return await interaction.reply({ content: '❌ Không tìm thấy cuộc bỏ phiếu nào đang diễn ra trong máy chủ này!', ephemeral: true });
        }

        // Kiểm tra nếu người dùng là chủ cuộc bỏ phiếu hoặc có quyền ADMIN
        const isOwner = voteData.Owner === user.id;
        const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
        
        // && !isAdmin
        if (!isOwner) {
            return await interaction.reply({ content: `❌ Bạn không có quyền kết thúc cuộc bỏ phiếu server **${voteData.Server}** này!`, ephemeral: true });
        }

        // Xóa tin nhắn bỏ phiếu
        try {
            const voteMessage = await channel.messages.fetch(voteData.Msg);
            await voteMessage.delete();
        } catch (error) {
            console.error('❌ Không thể xóa tin nhắn bỏ phiếu:', error);
        }

        // Xóa dữ liệu trong MongoDB
        await votes.deleteOne({ Guild: guild.id });

        // Thông báo kết thúc bỏ phiếu
        await interaction.reply({ content: `__**Valheim Roleplay**__\n✅ Cuộc bỏ phiếu server **${voteData.Server}** đã được **kết thúc** và **xóa khỏi hệ thống**.`, ephemeral: true });
    }
};
