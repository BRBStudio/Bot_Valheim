const { SlashCommandSubcommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('cancel')
		.setDescription('Huỷ một sự kiện đã tạo')
		.addStringOption(o => o
			.setName('tensukien')
			.setDescription('Tên sự kiện cần huỷ')
			.setRequired(true))
		.addStringOption(o => o
			.setName('thoigian')
			.setDescription('Thời gian sự kiện, ghi rõ giờ và ngày theo đúng định dạng (vd: 01:24 16-05-2025 hoặc 1:24 16-5-2025)')
			.setRequired(true)),

	async execute(interaction) {

		// if (!interaction.guild.features.includes('COMMUNITY')) {
		// 	return interaction.reply({
		// 		content: '❌ Máy chủ này chưa bật tính năng **Cộng đồng** nên không thể tạo sự kiện. Bạn có thể bật tại: **Server Settings > Enable Community** ( cài đặt máy chủ > Kích hoạt cộng đồng ).',
		// 		ephemeral: true,
		// 	});
		// }

		const name = interaction.options.getString('tensukien');
		const timeStr = interaction.options.getString('thoigian');

		const timeRegex = /^(\d{1,2}):(\d{1,2}) (\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/;
		const match = timeStr.match(timeRegex);

		if (!match) {
			return interaction.reply({
				content: '❌ Định dạng thời gian không hợp lệ. Dùng định dạng: `00:24 16-05-2025`',
				ephemeral: true,
			});
		}

		const [, hour, minute, day, month, year] = match.map(Number);
		const targetTime = new Date(year, month - 1, day, hour, minute);

		await interaction.deferReply({ ephemeral: true }); // 👈 GIỮ phiên interaction

		try {
			const events = await interaction.guild.scheduledEvents.fetch();

			const eventToCancel = events.find(ev =>
				ev.name === name &&
				ev.scheduledStartAt?.getTime() === targetTime.getTime()
			);

			if (!eventToCancel) {
				return interaction.editReply({
				content: '❌ Không tìm thấy sự kiện khớp với tên và thời gian bạn cung cấp.',
				});
			}

			await eventToCancel.delete(`Huỷ bởi /cancel_brb của ${interaction.user.tag}`);

			await interaction.editReply(`✅ Đã huỷ sự kiện **${eventToCancel.name}** bắt đầu lúc <t:${Math.floor(targetTime.getTime() / 1000)}:F>`);
		} catch (err) {
			console.error('Lỗi khi huỷ sự kiện:', err);
			await interaction.editReply({
				content: '❌ Có lỗi xảy ra khi huỷ sự kiện. Hãy kiểm tra lại quyền bot và đầu vào.',
			});
		}
	},
};
