const { SlashCommandBuilder } = require('discord.js'); 
const GuildPrefix = require('../../schemas/GuildPrefix');
const config = require('../../config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('change_prefix')
		.setDescription('🔹 Quản lý tiền tố của bot trong máy chủ')
		.addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setDescription('🔹 Đặt tiền tố mới')
				.addStringOption(option => 
					option.setName('prefix')
						.setDescription('Tiền tố mới cho bot')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('🔹 Xem tiền tố hiện tại')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('regime')
				.setDescription('🔹 Bật hoặc tắt lệnh tiền tố')
				.addStringOption(option => 
					option.setName('state')
						.setDescription('Chọn bật hoặc tắt')
						.setRequired(true)
						.addChoices(
							{ name: 'Bật', value: 'on' },
							{ name: 'Tắt', value: 'off' }
						)
				)
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const guildId = interaction.guild.id;
		const guildName = interaction.guild.name;
		const userId = interaction.user.id;
		const member = interaction.guild.members.cache.get(userId);
		const isOwner = interaction.user.id === interaction.guild.ownerId;
		const isSpecialUser = config.specialUsers.includes(userId);

		

		if (subcommand === 'set') {

			if (!isOwner && !isSpecialUser) {
				return interaction.reply({
					content: '🚫 Bạn không có quyền sử dụng lệnh này! Chỉ chủ sở hữu máy chủ mới có quyền.', // hoặc người đặc biệt
					ephemeral: true
				});
			}

			const newPrefix = interaction.options.getString('prefix');

			if (newPrefix === '/') {
				return interaction.reply({
					content: '⚠️ **Lưu ý:** Không nên đặt tiền tố là `/` vì nó trùng với lệnh slash!',
					ephemeral: true
				});
			}

			try {
				await GuildPrefix.findOneAndUpdate(
					{ guildId }, // serverName: guildName, userNickname: member.nickname || interaction.user.displayName
					{ prefix: newPrefix },
					{ upsert: true, new: true }
				);

				return interaction.reply(`✅ Tiền tố mới cho **${guildName}** là **${newPrefix}**`);
			} catch (error) {
				console.error('Lỗi khi cập nhật tiền tố:', error);
				return interaction.reply('❌ Đã xảy ra lỗi khi cập nhật tiền tố.');
			}
		}

		if (subcommand === 'list') {
			try {
				const guildData = await GuildPrefix.findOne({ guildId });
				const currentPrefix = guildData ? guildData.prefix : '?';

				return interaction.reply(`🔍 Tiền tố hiện tại của **${guildName}** là **${currentPrefix}**`);
			} catch (error) {
				console.error('Lỗi khi lấy tiền tố:', error);
				return interaction.reply('❌ Đã xảy ra lỗi khi lấy tiền tố hiện tại.');
			}
		}

		if (subcommand === 'regime') {

			if (!isOwner && !isSpecialUser) {
				return interaction.reply({
					content: '🚫 Bạn không có quyền sử dụng lệnh này! Chỉ chủ sở hữu máy chủ mới có quyền.', // hoặc người đặc biệt
					ephemeral: true
				});
			}

            const state = interaction.options.getString('state') === 'on';
        
            try {
                // Lấy dữ liệu hiện tại của máy chủ trước khi cập nhật
                let guildData = await GuildPrefix.findOne({ guildId });
        
                // Cập nhật trạng thái prefix
                guildData = await GuildPrefix.findOneAndUpdate(
                    { guildId },
                    { serverName: guildName, userNickname: interaction.user.displayName || member.nickname, isPrefixEnabled: state },
                    { upsert: true, new: true }
                );
        
                // Lấy prefix hiện tại sau khi cập nhật
                const currentPrefix = guildData?.prefix || '?';
                const statusText = state ? '**BẬT**' : '**TẮT**';
        
                return interaction.reply(`<a:cun1:1343938871892775003> Chế độ lệnh \`${currentPrefix}\` đã được ${statusText} trong máy chủ.`);
            } catch (error) {
                // Nếu có lỗi, đảm bảo vẫn có giá trị cho currentPrefix
                const fallbackGuildData = await GuildPrefix.findOne({ guildId });
                const currentPrefix = fallbackGuildData?.prefix || '?';
        
                console.error('Lỗi khi thay đổi trạng thái prefix:', error);
                return interaction.reply(`❌ Đã xảy ra lỗi khi thay đổi trạng thái lệnh ${currentPrefix}.`);
            }
        }        
	}
};