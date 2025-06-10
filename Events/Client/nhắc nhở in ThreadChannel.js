const { ActivityType, TextChannel, ActionRowBuilder, NewsChannel, WebhookClient, Interaction, EmbedBuilder, GuildChannel, ButtonBuilder, ThreadChannel } = require('discord.js');
const config = require('../../config');
const EventStatus = require('../../schemas/Event_Status');


// Hàm gửi tin nhắn sau 1 tiếng cho bài đăng chủ đề
const sendHelpMessage = async (channel) => {
    // Đợi 1 tiếng (3600,000 ms)
    await new Promise(resolve => setTimeout(resolve, 5000)); // sau 30 phút
  
    // Kiểm tra xem kênh có phải là ThreadChannel không
    // if (!(channel instanceof ThreadChannel)) {
    //     console.error('Kênh không tồn tại hoặc không phải là ThreadChannel.');
    //     return;
    // }
    // Kiểm tra xem kênh có tồn tại không
    const updatedChannel = await channel.client.channels.fetch(channel.id).catch(() => null);
    if (!updatedChannel || !(updatedChannel instanceof ThreadChannel)) {
      // console.error('Kênh không tồn tại hoặc không phải là ThreadChannel.');
      return;
    }
  
    try {
      const tagButton = new ButtonBuilder()
              .setCustomId('tag_user')
              .setLabel('Bạn cần sự giúp đỡ ?')
              .setEmoji(`<:1_:1247599827143888916>`) // https://media.giphy.com/media/K9svE9i7P3Ox2/giphy.gif
              .setStyle('Primary');
  
      const khoachudeButton = new ButtonBuilder()
              .setCustomId('khoa_chude')
              .setLabel('Khóa bài viết')
              .setEmoji(`<:khoa:1247600800889442334>`)
              .setStyle('Success');
      
      const actionRow = new ActionRowBuilder().addComponents(tagButton, khoachudeButton);
  
      const embed = new EmbedBuilder()
            .setColor(config.embedGold)
            .setDescription(`Chủ đề này đã không hoạt động trong 1 giờ. Nếu bạn cần trợ giúp gì đó, hãy nhấp vào nút bên dưới.\n\n Bạn cũng có thể sử dụng lệnh /get-help để thông báo cho người trợ giúp của chúng tôi!`)
            .setTitle(`BẠN CẦN SỰ GIÚP ĐỠ?`)
            .setTimestamp()
  
        // Gửi tin nhắn vào kênh
        await updatedChannel.send({ embeds: [embed], components: [actionRow] });
        
    } catch (error) {
        console.error('Đã xảy ra lỗi khi gửi tin nhắn:', error);
        // Gửi thông báo lỗi đến webhook
        // webhookClient.send(`Lỗi khi gửi tin nhắn: ${error.stack}`)
        //   .then(() => console.log('Thông báo lỗi được gửi tới webhook'))
        //   .catch(err => console.error('Lỗi gửi tin nhắn tới webhook:', err));
    }
    
};

// Hàm kiểm tra xem ThreadChannel có bị khóa chưa
const isThreadLocked = async (channel) => {
    // Kiểm tra xem kênh có phải là ThreadChannel và có thuộc tính 'locked' không
    return channel.locked || false;
};


// Hàm gửi tin nhắn sau  tiếng khi nhận tin nhắn BẠN CẦN SỰ GIÚP ĐỠ?
const sendnhacnhoxoa = async (channel) => {
    // Đợi 2 tiếng (7200,000 ms)
    await new Promise(resolve => setTimeout(resolve, 10000)); // sau 1 tiếng
  
    // // Kiểm tra xem kênh có phải là ThreadChannel không
    // if (!(channel instanceof ThreadChannel)) {
    //     console.error('Kênh không tồn tại hoặc không phải là ThreadChannel.');
    //     return;
    // }
    // Kiểm tra xem kênh có tồn tại không
    const updatedChannel = await channel.client.channels.fetch(channel.id).catch(() => null);
    if (!updatedChannel || !(updatedChannel instanceof ThreadChannel)) {
      // console.error('Kênh không tồn tại hoặc không phải là ThreadChannel.');
      return;
    }
  
    try {

        // Kiểm tra xem kênh có bị khóa không
      if (await isThreadLocked(updatedChannel)) {
            // Nếu đã khóa, không gửi tin nhắn nữa
            return;
        }
  
      const embed = new EmbedBuilder()
            .setColor(config.embedGreen)
            .setDescription(`Nếu vấn đề của bạn đã được giải quyết, vui lòng dùng lệnh /solve để khóa chủ đề này. Cảm ơn sự hợp tác của bạn!`)
            .setTitle(`VẤN ĐỀ CỦA BẠN ĐÃ ĐƯỢC GIẢI QUYẾT?`)
            .setTimestamp()
  
        // Gửi tin nhắn vào kênh
        await updatedChannel.send({ embeds: [embed] }); // channel.send({ embeds: [embed] });
        
    } catch (error) {
        console.error('Đã xảy ra lỗi khi gửi tin nhắn:', error);
        // Gửi thông báo lỗi đến webhook
        // webhookClient.send(`Lỗi khi gửi tin nhắn: ${error.stack}`)
        //   .then(() => console.log('Thông báo lỗi được gửi tới webhook'))
        //   .catch(err => console.error('Lỗi gửi tin nhắn tới webhook:', err));
    }
};

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'nhắc_nhở_trong_chủ_đề' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Đặt thời gian chờ sau khi tạo chủ đề là 1 tiếng
        client.on('threadCreate', async (thread) => {

        // Lấy ID của kênh thread
        const threadID = thread.id;
  
        // Lấy kênh từ ID
        const channel = await client.channels.fetch(threadID);
  
        // Gửi tin nhắn sau 1 tiếng
        sendHelpMessage(channel);
        // Gửi tin nhắn sau 1 phút
        sendnhacnhoxoa(channel);
    });
  
  
        // Đặt thời gian chờ sau khi tạo bài viết mới trong thread là 1 tiếng
        client.on('messageCreate', async (message) => {

        // Kiểm tra xem bài viết có phải là trong một thread không
        if (message.channel instanceof GuildChannel && message.channel.isThread()) {
            // Gửi tin nhắn sau 1 tiếng
            sendHelpMessage(message.channel);
            // Gửi tin nhắn sau 1 phút
            sendnhacnhoxoa(message.channel);
        }
    });

    }
}