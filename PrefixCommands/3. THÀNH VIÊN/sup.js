const { EmbedBuilder } = require(`discord.js`)
const CommandStatus = require('../../schemas/Command_Status');

/*
?tam <nhập nội dung>
*/

module.exports = {
	name: 'sup',
	description: '🔸 Máy chủ hỗ trợ bot cũng như game Valheim',
    hd: '🔸 ?sup',
    aliases: ['htbot', 'htvalheim', `tv9`],
	
	async execute(message, args) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?auto-reply' });
        
        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
        return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        return message.channel.send(`<a:vip:1320072970340925470> [__Máy chủ hỗ trợ bot cũng như game Valheim__](https://discord.gg/s2ec8Y2uPa) <a:vip:1320072970340925470>`);

    }
}