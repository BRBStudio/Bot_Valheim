const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',

    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!hi' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;
        
        if(msg.content === '!hi') {
            // Lấy tên guild từ đối tượng msg.guild
          const guildName = msg.guild ? msg.guild.name : 'Máy chủ không xác định';

          msg.reply({content: `\`\`\`yml\nChào mừng bạn đến với máy chủ ***${guildName}*** !!!\n\nNếu bạn có vấn đề gì muốn biết, bạn có thể hỏi mọi người hoặc dùng các lệnh / của bot ***Valheim Survival*** để được hỗ trợ nhé. Hi vọng bạn sẽ có những trải nghiệm vui vẻ...\`\`\``, ephemeral: true})
        }
    }
};
