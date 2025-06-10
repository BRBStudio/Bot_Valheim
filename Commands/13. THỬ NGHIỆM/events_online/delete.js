const { SlashCommandSubcommandBuilder } = require('discord.js');
const User = require('../../../schemas/premiumUserSchema');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('delete')
		.setDescription('🗑️ Xóa tất cả các sự kiện đã lên lịch trong máy chủ'),

	async execute(interaction) {

		// Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
		const user = await User.findOne({ discordId: interaction.user.id });
		if (!user || !user.isPremium) {
			return interaction.reply({ content: 'Bạn không có quyền sử dụng gói cao cấp premium. Vui lòng đăng ký premium để sử dụng.\n\n', ephemeral: true });
		}
		
		// Kiểm tra xem người dùng có mã premium và mã đó còn hạn hay không
		const currentTime = new Date();
		if (user.premiumUntil && user.premiumUntil < currentTime) {
			return interaction.reply({ content: 'Mã premium của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng gói cao cấp premium.', ephemeral: true });
		}

		await interaction.deferReply({ ephemeral: true });

		const events = await interaction.guild.scheduledEvents.fetch();

		if (events.size === 0) {
			return interaction.editReply({
				content: '✅ Không có sự kiện nào để xóa.',
			});
		}

		let deletedCount = 0;
		const failed = [];

		for (const [, event] of events) {
			try {
				await event.delete(`Xóa bởi ${interaction.user.tag}`);
				deletedCount++;
			} catch (err) {
				console.error(`Lỗi khi xóa sự kiện ${event.name}:`, err);
				failed.push(event.name);
			}
		}

		let reply = `🗑️ Đã xóa **${deletedCount}** sự kiện.`;

		if (failed.length > 0) {
			reply += `\n⚠️ Không thể xóa các sự kiện sau: ${failed.join(', ')}`;
		}

		await interaction.editReply({ content: reply });
	},
};
