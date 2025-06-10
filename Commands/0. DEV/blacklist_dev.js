/*
lệnh này để thêm người dùng vào danh sách đen
khi bị vào danh sách đen người dùng sẽ không dùng được lệnh
có dữ liệu Schemas/blacklistModel.js ví dụ như lệnh /emoji
*/

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Blacklist_dev = require('../../schemas/blacklist_devSchema');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist_dev')
		.setDescription(
			`🔹 Danh sách đen hoặc xóa người dùng khỏi danh sách đen của\n` +
			`       bot`
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('🔹 Đưa người dùng vào danh sách đen')
				.addUserOption(option => option.setName('user').setDescription('Người dùng bị đưa vào danh sách đen').setRequired(true))
				.addStringOption(option => option.setName('reason').setDescription('Lý do đưa vào danh sách đen'))
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('🔹 Xóa người dùng khỏi danh sách đen')
				.addUserOption(option => option.setName('user').setDescription('Người dùng sẽ bị xóa khỏi danh sách đen').setRequired(true))
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('🔹 Hiển thị danh sách người dùng bị đưa vào danh sách đen')
			),

		guildSpecific: true,
		guildId: `1319809040032989275`, // Máy chủ Emoji Command Bot

  	async execute(interaction) {

		const subcommand = interaction.options.getSubcommand();

		// Kiểm tra quyền cho lệnh 'add' và 'remove'
		if (subcommand === 'add' || subcommand === 'remove') {
			if (!checkPermissions(interaction)) {
				return interaction.reply('Dành cho Dev, bạn không thể sử dụng điều này.');
			}
		}

		// return await interaction.reply('Bạn không có quyền sử dụng lệnh này.')
		if (subcommand === 'add') {
			const user = interaction.options.getUser('user');
			const reason = interaction.options.getString('reason');
			const userName = user.displayName
			const guildName = interaction.guild.name;
			const guildId = interaction.guild.id;

			try {
				const existingEntry = await Blacklist_dev.findOne({ userId: user.id });

				if (existingEntry) {
				await interaction.reply(`${user.displayName} đã bị đưa vào danh sách đen rồi.`);
				} else {
				const newEntry = new Blacklist_dev({ userId: user.id, reason, userName, guildName, guildId });
				await newEntry.save();

				await interaction.reply(`${user.displayName} đã bị đưa vào danh sách đen. Lý do: ${reason}`);
				}
			} catch (error) {
				console.error('Đã xảy ra lỗi khi thêm người dùng vào danh sách đen:', error);
				await interaction.reply('Đã xảy ra lỗi khi thêm người dùng vào danh sách đen.');
			}
		} else if (subcommand === 'remove') {
			const user = interaction.options.getUser('user');

			try {
				const removedEntry = await Blacklist_dev.findOneAndDelete({ userId: user.id });

				if (removedEntry) {
				await interaction.reply(`${user.displayName} đã bị xóa khỏi danh sách đen.`);
				} else {
				await interaction.reply(`${user.displayName} không nằm trong danh sách đen.`);
				}
			} catch (error) {
				console.error('Đã xảy ra lỗi khi xóa người dùng khỏi danh sách đen:', error);
				await interaction.reply('Đã xảy ra lỗi khi xóa người dùng khỏi danh sách đen.');
			}
		} else if (subcommand === 'list') {
			try {
				const blacklist = await Blacklist_dev.find({});
				if (blacklist.length === 0) {
				return await interaction.reply('Danh sách đen trống.');
				}

				const embed = new EmbedBuilder()
				.setTitle('Danh sách người dùng bị đưa vào danh sách đen')
				.setColor(0xff0000);

				for (const entry of blacklist) {
					const user = await interaction.client.users.fetch(entry.userId);
					embed.addFields({ name: `${user.displayName} (ID: ${entry.userId})`, value: `Lý do: ${entry.reason || 'Không có lý do'}` });
				}

				await interaction.reply({ embeds: [embed] });
			} catch (error) {
				console.error('Đã xảy ra lỗi khi lấy danh sách đen:', error);
				await interaction.reply('Đã xảy ra lỗi khi lấy danh sách đen.');
			}
		}
	},
};