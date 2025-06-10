const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    id: 'closeTicketModal',
    async execute(interaction) {

    // Kiểm tra trạng thái Modal
    const commandStatus = await CommandStatus.findOne({ command: 'closeTicketModal' });

    // Nếu lệnh đang tắt, gửi thông báo và không thực hiện Modal
    if (commandStatus && commandStatus.status === 'off') {
        return interaction.reply('Modal này đã bị tắt, vui lòng thử lại sau.');
    }

    // Xử lý khi người dùng gửi modal để đóng vé
    const channel = interaction.channel;
    // console.log(`Chủ đề của kênh: ${channel.topic}`);
    const reason = interaction.fields.getTextInputValue('closeReasonTicket') || `Người đóng vé lười như heo` ;
    await interaction.reply({ content: `🔐 Vé này sẽ được đóng lại sau 5s...` });

    setTimeout(async () => {
            // Tìm kiếm người sử dụng vé từ topic của kênh
    const match = channel.topic.match(/Người Sử dụng vé: (\d+)/);
    if (match) {
        const userId = match[1];
        try {
            const member = await interaction.guild.members.fetch(userId);

            // Kiểm tra nếu tìm được thành viên
            if (member && member.user) {
                const closer = interaction.user.displayName; // Người đóng vé
                let messageContent;

                if (interaction.user.id === userId) {
                    // Nếu người đóng vé là chính mình
                    messageContent = `📢 Bạn đã đóng vé của chính mình trong máy chủ ***${interaction.guild.name}*** vì: \`${reason}\``;
                } else {
                    // Nếu người khác đóng vé của mình
                    messageContent = `📢 Bạn nhận được thông báo này vì vé của bạn trong máy chủ ***${interaction.guild.name}*** đã bị đóng bởi ***${closer}*** vì: \`${reason}\``;
                }

                await member.send(messageContent).catch(err => { console.error(err); });
            } else {
                console.error('Không tìm thấy thông tin người sử dụng vé trong chủ đề kênh.');
            }
        } catch (err) {
            console.error('Lỗi khi tìm thành viên:', err);
        }
    } else {
        console.error('Không tìm thấy userId trong chủ đề kênh.');
    }

    await channel.delete().catch(err => { console.error(err); });
}, 5000);
    }
};
