const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!bot' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;

        if(msg.content === '!bot') {
            msg.reply({content: `\`\`\`yml\nNày! hãy dùng lệnh /translate để dịch ngôn ngữ ( chỉ hỗ trợ tiếng anh và tiếng việt),\`\`\`` +
                `\`\`\`hoặc dùng lệnh /bot-commands để nhận thông tin các lệnh có từ bot\`\`\``, ephemeral: true})
        }
    }
};
