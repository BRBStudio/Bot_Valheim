const { EmbedBuilder } = require(`discord.js`)
const CommandStatus = require('../../schemas/Command_Status');

/*
?rep <nhập nội dung>
*/

module.exports = {
	name: 'auto-reply',
	description: '🔸 Trả lời tự động ngẫu nhiên những câu hỏi bạn',
	hd: '🔸 ?auto-reply <nhập câu bạn muốn hỏi>',
    aliases: ['rep', 'tv1'],
	
	async execute(message, args) {

		// Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?auto-reply' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

		if (!args[0]) {
			return message.channel.send('Hãy hỏi tôi một câu hỏi bằng cách \`\`\`?auto-reply <nhập câu bạn muốn hỏi>\`\`\`');
		} else {
			message.channel.sendTyping();
			let eightball = [
				'Bạn có thể dùng lệnh \`\`\`mail-box\`\`\`',
				'Để xem về lệnh thông thường dùng lệnh \`\`\`/commmands-bot\`\`\`\nĐể xem thêm về lệnh mới thì dùng lệnh \`\`\`/commands-new\`\`\` ',
				'Tôi không chắc lắm, hãy thử xem',
				'Có, chắc chắn rồi.',
				'Ngày hôm nay rất đẹp để tham gia cuộc đi săn của các chiến binh Viking đấy.',
				'Theo tôi thấy thì đúng vậy.',
				'Rất có thể.',
				'Valhiem Survival vẫn đang trong quá trình phát triển.',
				'Đúng.',
                `Tôi tên BRB STUDIO`,
				'Các dấu hiệu cho thấy có.',
				'Hãy hỏi người quản lý máy chủ hoặc hỏi người chơi, sẽ tốt hơn',
				'Hãy đặt một câu hỏi rõ ràng hơn',
				'Tốt hơn hết là đừng nói gì bây giờ. mọi người cần yên tĩnh và tôi cũng vậy -_-',
				'Không thể dự đoán bây giờ.',
				'Tập trung và hỏi lại.',
				'Đừng tin vào điều đó.',
				'Câu trả lời của tôi là không.',
				'Nguồn tin của tôi nói không.',
				'Bạn muốn tìm nguyên liệu? nó khá rộng, bạn nên trải nghiệm nhiều hơn',
				'Có thể bạn chưa biết, đồ săn được chưa hẳn đã khỏe, bạn cần biết cách vận dụng nó trong thế giới Valheim Survival đầy rẫy hiểm nguy này',
				'Vâng, trả lời tự động này chỉ mang ý kiếm kham thảo.',
				'Tôi chưa được cập nhật, vẫn đang trong quá trình phát triển, hãy thông cảm cho những thông tin ít ỏi',
				'Câu trả lời đang ẩn giấu bên trong bạn',
				'KHÔNG!KHÔNG!KHÔNG! tôi nhắc lại lần nữa là KHÔNG!',
				'Phụ thuộc vào tâm trạng của Boss',
				'\`\`\`Ai biết được\`\`\`',
				'\`\`\`Bạn có chắc bạn muốn hỏi câu hỏi này\`\`\`',
				'Đợi đã',
				'Có khá nhiểu trick trong game, hãy tận dụng nó, hoặc hỏi người chơi để tăng khả năng sống sót của bạn',
				'Mọi chuyện chỉ là sự khởi đầu',
				'Chúc may mắn, hãy tự lo lấy bạn thân của mình đi',
			];
			let index = (Math.floor(Math.random() * Math.floor(eightball.length)));
			setTimeout(() => {
                const e = new EmbedBuilder()
                    .setColor(`Green`)
                    .setDescription(eightball[index])
                    
				message.channel.send({
					embeds: [e]
				});
			}, 750);
		}
	},
};