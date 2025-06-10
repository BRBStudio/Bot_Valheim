const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require(`../../config`)
// 🔒

module.exports = {
		name: 'lock', // Tên lệnh
		description: '🔸 Khóa kênh cho một vai trò cụ thể',
		q: `🔸 Cần có quyền ADM`,
		aliases: ['lk', 'ad1'], // Các biệt danh cho lệnh này

	/*
    isPremium: true,                     Chỉ dành cho người dùng trả phí (premium)
    hidden: true,                        Xác định lệnh có ẩn khỏi danh sách lệnh (/commands_bot) không
    devOnly: true,                       Chỉ cho phép nhà phát triển hoặc một số người dùng đặc biệt sử dụng lệnh.
    enabled: false,                      Xác định lệnh có đang bật hay không, dễ dàng vô hiệu hóa lệnh nếu cần.
    usageCount: 0,                       Theo dõi số lần lệnh được sử dụng (nếu muốn lưu log).
    */

	async execute(msg, args) {

		// Kiểm tra xem người gửi có quyền quản lý kênh không
		if (!msg.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
			const errEmbed = new EmbedBuilder()
				.setTitle('LỖI')
				.setColor(0xDC143C)
				.setDescription('Thiếu quyền: Quản lý kênh');
			return msg.channel.send({ embeds: [errEmbed] });
		}

		// Nếu người dùng chỉ gõ lệnh mà không có tham số (kênh và vai trò)
		if (args.length === 0) {
		const usageEmbed = new EmbedBuilder()
			.setTitle('HƯỚNG DẪN SỬ DỤNG LỆNH')
			.setColor(0xFF9900)
			.setDescription('Cách sử dụng lệnh **?lock**:\n\n**Cú pháp:** `?lock <#kênh> <@vai trò>`\n\nVí dụ: `?lock #general @Member`')
			.addFields(
			{ 
				name: '<a:kl:1247611343394312336> Đầu vào:', 
				value: 'Bạn cần đề cập đến kênh và vai trò khi sử dụng lệnh. Kênh phải là một kênh văn bản và vai trò phải là một vai trò hợp lệ.', 
				inline: false 
			},
			{ 
				name: '<a:kl:1247611343394312336> Lỗi thường gặp:', 
				value: 'Không đề cập đúng kênh hoặc vai trò.\nLệnh thiếu tham số.\nQuyền hạn không đủ để thực thi lệnh.', 
				inline: false 
			},
			)
			.setTimestamp()
			.setFooter({ text: `Bot được tạo bởi ${config.Dev}`});
		return msg.channel.send({ embeds: [usageEmbed] });
		}

		// Tìm kênh và vai trò từ tham số và đảm bảo thứ tự đúng
        const channelMention = args[0]; // Tham số đầu tiên
        const roleMention = args[1];    // Tham số thứ hai

		// Kiểm tra xem người dùng có đưa ra đủ các tham số (kênh và vai trò) hay không
		const channel = msg.mentions.channels.first(); // Lấy kênh được đề cập
		const role = msg.mentions.roles.first(); // Lấy vai trò được đề cập

		if (!channel || !role || channelMention !== channel.toString() || roleMention !== role.toString()) {
		const errEmbed = new EmbedBuilder()
			.setTitle('LỖI')
			.setColor(0xDC143C)
			.setDescription('Bạn phải đề cập đến cả kênh và vai trò, hoặc đúng cú pháp: `?lock <#kênh> <@vai trò>`.');
		return msg.channel.send({ embeds: [errEmbed] });
		}

		// Thực hiện việc khóa kênh cho vai trò
		channel.permissionOverwrites.create(role, { SendMessages: false });

		// Tạo embed thông báo kênh đã bị khóa
		const embed = new EmbedBuilder()
		.setTitle('<a:kl:1247611343394312336> ・ Kênh đã bị khóa')
		.setDescription(`:white_check_mark: ${channel} đã bị khóa.`)
		.addFields(
			{ name: '<a:kl:1247611343394312336> Đã khóa vai trò:', value: `${role}`, inline: false },
			{ name: `\u200b`, value: `\u200b` },
			{ name: '⏲️ Thời gian:', value: `${new Date().toLocaleString()}`, inline: false },
			{ name: `\u200b`, value: `\u200b` },
			{ name: '<a:kl:1247611343394312336> Bị khóa bởi:', value: `<@${msg.author.id}>`, inline: false },
		)
		.setColor(0x27D128)
		.setFooter({ text: `Bot được tạo bởi ${config.Dev}` });

		// Gửi thông báo vào kênh
		await msg.channel.send({ embeds: [embed] });
	},
};
