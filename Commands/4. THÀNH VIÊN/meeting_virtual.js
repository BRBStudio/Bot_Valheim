const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const tinycolor = require("tinycolor2");
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meeting_virtual')
		.setDescription('🔹 Tạo thông báo và nhắc nhở cho cuộc họp')
		.addStringOption(option =>
			option.setName('date')
			.setDescription('Ngày họp (định dạng DD/MM/YYYY)')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('hour')
			.setDescription('Thời gian bắt đầu cuộc họp (định dạng HH:MM)')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('duration')
			.setDescription('Ước tính thời gian họp trong bao lâu (tính bằng phút). VD: 120')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('objet')
			.setDescription('Mục đích của cuộc họp là gì?')
			.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
			.setDescription('Kênh diễn ra cuộc họp')
			.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel1')
			.setDescription('Kênh gửi thông báo nhắc nhở cho cuộc họp')
			.setRequired(true))
		.addRoleOption(option =>
			option.setName('role')
			.setDescription('Vai trò được thông báo cho cuộc họp')
			.setRequired(true))
		.addStringOption((option) =>
			option.setName("color")
			.setDescription("Chọn màu viền cho tin nhắn.")
			.setRequired(true)
			.addChoices(
				{ name: "Mầu đỏ", value: "Red" },
				{ name: "Mầu xanh dương", value: "Blue" },
				{ name: "Mầu xanh lá cây", value: "Green" },
				{ name: "Mầu tím", value: "Purple" },
				{ name: "Mầu cam", value: "Orange" },
				{ name: "Mầu vàng", value: "Yellow" },
				{ name: "Mầu đen", value: "Black" },
				{ name: "Mầu xanh lơ (rất đẹp)", value: "Cyan" },
				{ name: "Mầu hồng", value: "Pink" },
				{ name: "Mầu hoa oải hương", value: "Lavender" },
				{ name: "Mầu sẫm (Mầu đỏ sẫm, hơi tím)", value: "Maroon" },
				{ name: "Mầu ô liu", value: "Olive" },
				{ name: "Mầu xanh lam (xanh nước biển)", value: "Teal" },
				{ name: "Mầu bạc", value: "Silver" },
				{ name: "Mầu vàng đồng", value: "Gold" },
				{ name: "Mầu be", value: "Beige" },
				{ name: "Mầu hải quân (xanh dương đậm)", value: "Navy" },
				{ name: "Mầu tím đậm", value: "Indigo" },
				{ name: "Mầu hồng tím", value: "Violet" },
			)
		)
		.addAttachmentOption((option) =>
			option.setName("thumbnail")
			.setDescription("Hình thu nhỏ sẽ được hiển thị khi nhúng.")
			.setRequired(false)
		  ),

	async execute(interaction) {

		// Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/meeting_virtual' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

		const date = interaction.options.getString('date');
		const hour = interaction.options.getString('hour');
		const duration = interaction.options.getString('duration');
		const objet = interaction.options.getString('objet');
		const channel = interaction.options.getChannel('channel');
		const channel1 = interaction.options.getChannel('channel1');
		const role = interaction.options.getRole('role');
		const thumbnailUrl = interaction.options.getAttachment('thumbnail');
		// const colorCode = interaction.options.getString('color');

		// Kiểm tra và xử lý thumbnailAttachment
        const thumbnailAttachmentURL = thumbnailUrl ? thumbnailUrl.url : null;

		// Chuyển đổi tên màu thành mã HEX
        const colorObject = tinycolor(interaction.options.getString("color"));

        if (!colorObject.isValid()) {                                                 //////////////////// if (!colorCode)
          return await interaction.reply({ content: "Màu bạn nhập không hợp lệ.", ephemeral: true,});
        }
            // Chuyển đổi tên màu thành mã HEX
        const colorCode = colorObject.toHexString();

		const embed = new EmbedBuilder()
			.setTitle('Cuộc họp online')
			.setDescription(`Mục đích Cuộc Họp: **${objet}**`)
			.addFields(
			{
				name: 'Ngày bắt đầu cuộc họp',
				value: date,
				inline: true
			},

			{
				name: 'Thời gian bắt đầu cuộc họp',
				value: hour,
				inline: true
			},

			{
				name: 'Thời gian dự kiến của cuộc họp',
				value: `${duration} phút`,
				inline: true
			},

			{
				name: 'Kênh diễn ra cuộc họp',
				value: `<#${channel.id}>`,
				inline: false
			},

			{
				name: 'Kênh nhắc nhở',
				value: `<#${channel1.id}>`,
				inline: false
			},

			{
				name: `Vai trò nhận được nhắc nhở (30 phút trước khi cuộc họp bắt đầu)`,
				value: `${role}`,
				inline: false
			}
		);

		if (thumbnailAttachmentURL) {
			embed.setThumbnail(thumbnailAttachmentURL);
		}

		if (colorCode) {
			embed.setColor(`${colorCode}`);
		} else {
			embed.setColor(0x0099FF);
		}
		
		embed.setFooter({ text: `THÔNG BÁO ĐÃ ĐƯỢC GỬI`})

		await interaction.deferReply();
		await interaction.deleteReply();

		await interaction.channel.send({
			content: `${role}có thông báo:`,
			embeds: [embed]
		});

		const formattedHour = hour.replace('h', '');
		const dateTimeString = `${date.split('/').reverse().join('-')}T${formattedHour}:00`;
		const dateTime = new Date(dateTimeString);
		const meetingTime = dateTime.getTime();
		const currentTime = new Date().getTime();
		const notificationDelay = meetingTime - currentTime - (30 * 60 * 1000);

		if (!isNaN(meetingTime) && notificationDelay > 0) {
			setTimeout(() => {

				const embed1 = new EmbedBuilder()
					.setTitle(`📅 NHẮC NHỞ CUỘC HỌP TRƯỚC 30 PHÚT`)
					.setDescription(`\n> Cuộc họp này dành cho: ${role}`)
					.setFields(
						{
							name: 'Ngày bắt đầu cuộc họp',
							value: date,
							inline: true
						},

						{
							name: `Thời gian bắt đầu`,
							value: hour,
							inline: true
						},

						{
							name: 'Kênh cuộc họp diễn ra',
							value: `<#${channel.id}>`,
							inline: false
						},

						{
							name: `Nội Dung cuộc họp`,
							value: `${objet}`,
							inline: false
						},

						{
							name: 'Cuộc họp diễn ra khoảng:',
							value: `${duration} phút`,
							inline: true
						},

						{
							name: `Thời gian nhắc nhở`,
							value: `__30 phút__ phút trước khi cuộc họp diễn ra, tránh việc bạn bỏ lỡ điều gì đó.`,
							inline: false
						}
					)
				
				if (thumbnailAttachmentURL) {
					embed1.setThumbnail(thumbnailAttachmentURL);
				}

				const buttonMeeting = new ButtonBuilder()
						.setCustomId(`button_Meeting`)
						.setLabel(`Cuộc họp được tổ chức bởi: ${interaction.user.displayName}`)
                        .setDisabled(true)
						.setStyle(ButtonStyle.Danger)
				
				const row = new ActionRowBuilder()
					.addComponents(buttonMeeting)
					

				channel1.send({
					content: `${role}`,
					embeds: [embed1],
					components: [row],
				});
			}, notificationDelay);
		} else {
			// console.log('Ngày giờ không hợp lệ hoặc Cuộc họp quá gần để lên lịch thông báo hoặc đã trôi qua.');
			await interaction.followUp({ 
				content:
					`Ngày giờ không hợp lệ hoặc cuộc họp quá gần để lên lịch thông báo hoặc đã trôi qua.
					\n> __LƯU Ý__: Thời gian bắt đầu họp = thời gian bắt đầu tạo + 30 phút ( đây là thời gian tối thiếu), nếu viết sai định dạng ngày và thời gian sẽ không có nhắc nhở nào.
					\nVD: bạn muốn tổ chức cuộc họp vào lúc 08:30 vậy thì trong mục chọn ***duration*** bạn nên viết là 09:01.
					\nVì nhắc nhở sẽ được gửi trước khi diễn ra cuộc họp 30 phút!`,
				ephemeral:true
			})
		}
	},
};