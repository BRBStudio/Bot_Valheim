const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check_role')
		.setDescription('Xem các thành viên theo vai trò, không có vai trò và offline'),

	async execute(interaction) {
		const guild = interaction.guild;
		await guild.members.fetch(); // đảm bảo có đầy đủ thông tin member
		const members = guild.members.cache.filter(m => !m.user.bot);

		const roleMap = new Map();
		const noRoleMembers = [];
		const offlineMembers = [];

		for (const member of members.values()) {
			const roles = member.roles.cache.filter(r => r.id !== guild.id);

			if (member.presence?.status === 'offline') {
				offlineMembers.push(member.user.displayName);
			}

			if (roles.size === 0) {
				noRoleMembers.push(member.user.displayName);
			} else {
				for (const role of roles.values()) {
					if (!roleMap.has(role.id)) roleMap.set(role.id, []);
					roleMap.get(role.id).push(member.user.displayName);
				}
			}
		}

		// Sắp xếp vai trò theo vị trí hiển thị (từ cao xuống thấp)
		const sortedRoles = guild.roles.cache
		.filter(r => roleMap.has(r.id))
		.sort((a, b) => b.position - a.position);

		let description = '';

		for (const role of sortedRoles.values()) {
			const users = roleMap.get(role.id);
			if (users && users.length) {
				description += `**<@&${role.id}> (${users.length})**\n${users.slice(0, 10).join('\n')}\n\n`;
				if (users.length > 10) description += `...và ${users.length - 10} thành viên khác\n\n`;
			}
		}

		if (noRoleMembers.length) {
			description += `**Không có vai trò (${noRoleMembers.length})**\n${noRoleMembers.slice(0, 10).join('\n')}\n\n`;
			if (noRoleMembers.length > 10) description += `...và ${noRoleMembers.length - 10} thành viên khác\n\n`;
		}

		if (offlineMembers.length) {
			description += `**Thành viên offline (${offlineMembers.length})**\n${offlineMembers.slice(0, 10).join('\n')}\n\n`;
			if (offlineMembers.length > 10) description += `...và ${offlineMembers.length - 10} thành viên khác\n\n`;
		}

		// Cắt nếu vượt quá 2000 ký tự
		if (description.length > 2000) {
			description = description.slice(0, 1997) + '...';
		}

		const embed = new EmbedBuilder()
			.setTitle(`Thống kê thành viên trong máy chủ`)
			.setDescription(description)
			.setColor(0x00AE86);

		await interaction.reply({ embeds: [embed] });
	},
};
