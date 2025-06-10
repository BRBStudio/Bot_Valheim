const { SlashCommandSubcommandBuilder } = require('discord.js');
const { createStatsEmbed } = require('../../../Embeds/embedsCreate');
const CommandStatus = require('../../../schemas/Command_Status');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('info_bot')
		.setDescription('🔹 Nhận thông tin về bot'),
        gs: false,
        g: [`1319809040032989275`],

async execute(interaction, client) {

		// Kiểm tra trạng thái của lệnh
		const commandStatus = await CommandStatus.findOne({ command: '/info' });

		// Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
		if (commandStatus && commandStatus.status === 'off') {
			return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
		}

		const guildOwner = await interaction.guild.fetchOwner();

		if (interaction.user.id !== guildOwner.id) {
			return await interaction.reply({ content: 'Lệnh này chỉ dành cho chủ sở hữu.', ephemeral: true });
		}

		// Tạo embed thông tin thống kê bằng hàm createStatsEmbed
		const statsEmbed = await createStatsEmbed(client, interaction);

		// Cập nhật phản hồi với embed thông tin thống kê
		await interaction.editReply({ embeds: [statsEmbed] });

	},
};