const { SlashCommandBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('🔹 Tìm kiếm ý tưởng trò chơi bạn muốn!')
		.addIntegerOption( op =>
			op.setName('people')
				.setDescription('Bạn cần bao nhiêu người cho ý tưởng này.')
				.setRequired(true)
			)
		.addStringOption( op =>
			op.setName('building')
				.setDescription('Đưa ra yêu cầu về ý tưởng bạn muốn?')
				.setRequired(true)
			)
		.addIntegerOption( op =>
			op.setName('minute')
				.setDescription('Bạn muốn kết thúc việc tìm ý tưởng này khi nào? Tính theo phút.')
				.setRequired(true)
			)
		.addRoleOption( op =>
			op.setName("role")
				.setDescription("Chọn vai trò bạn muốn tag để việc tìm kiếm nhanh hơn")
				.setRequired(true)         
			),

	async execute(interaction) {

		// Kiểm tra trạng thái của lệnh
		const commandStatus = await CommandStatus.findOne({ command: '/event' });

		// Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
		if (commandStatus && commandStatus.status === 'off') {
			return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
		}

		const numOfPeople = interaction.options.getInteger('people')
		const building = interaction.options.getString('building')
		const minute = interaction.options.getInteger('minute')
		const vaitro = interaction.options.getRole('role');

		await interaction.deferReply(); // Xác nhận sự tương tác và gửi tin nhắn kết hợp với 
		await interaction.deleteReply();

		const author = interaction.guild.members.cache.get(interaction.user.id)?.displayName || interaction.user.username; // interaction.member.user.displayName

		await interaction.channel.send(`${vaitro} ơi! ***${author}*** đang tìm kiếm ${numOfPeople} người lên ý tưởng ***${building} *** cho ***BRB STUDIO Survival***. Bài nộp kết thúc sau ***${minute}*** phút.`)
    }
}