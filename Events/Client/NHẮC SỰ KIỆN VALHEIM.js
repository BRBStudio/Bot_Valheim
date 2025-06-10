const { ActivityType, TextChannel, ActionRowBuilder, NewsChannel, WebhookClient, Interaction, EmbedBuilder, GuildChannel, ButtonBuilder, ThreadChannel } = require('discord.js');
const config = require('../../config');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'nhắc_sự_kiện_valheim' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        const sendReminderMessage = (message, channelId, day, hour, minute) => {
            const now = new Date();
            const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
            if (now > targetTime) {
              targetTime.setDate(targetTime.getDate() + 1);
            }
            const delay = targetTime - now;
            setTimeout(() => {
                const channel = client.channels.cache.get(channelId);
                if (channel instanceof NewsChannel) {
      
                const embed = new EmbedBuilder()
                    .setTitle('LỜI NHẮC SỰ KIỆN VALHEIM HẰNG NGÀY & HẰNG TUẦN')
                    .setColor(config.embedGold)
                    .setDescription(`\`\`\`yml\n${message}\`\`\``)
                    .setFooter({ text: 'Lời nhắc nhở sự kiện được tạo bởi Valheim Suvival', iconURL: 'https://s.wsj.net/public/resources/images/OG-DW646_202003_M_20200302171613.gif' })
                    .setTimestamp();
      
                channel.send({ embeds: [embed] });
                
                } else {
                    console.error('Kênh không tồn tại hoặc không phải là TextChannel.');
                }
                // Lên lịch cho lần xuất hiện tiếp theo
                sendReminderMessage(message, channelId, day, hour, minute);
            }, delay);
        };

        // Gửi tin nhắn nhắc nhở (1139719596820152461 là ID kênh muốn đặt lời nhắc nhở. hiện tại là ID kênh 📅┊event-sự-kiện của máy chủ chính), nếu muốn viết 09:09 (9h 9p sáng) thì viết 9, 9
        sendReminderMessage('30 phút nữa sự kiện sẽ được diễn ra, hãy chuẩn bị tinh thần đi nào các chiến binh của ta', '1139719596820152461', undefined, 19, 31); // Mỗi ngày tại 19:31 giờ tối, 
        sendReminderMessage('sắp đến sự kiện solo rồi, chuẩn bị mọi thứ cho tốt vào', '1139719596820152461', 2, 17, 30); // Thứ 3 hàng tuần lúc 17:30
        sendReminderMessage('chuẩn bị có cuộc thi xây nhà, hãy đăng kí ngay với ad nhé+', '1139719596820152461', 3, 18, 10,); // Thứ 4 hàng tuần lúc 18:10 nếu là 00 giờ 09 phút thì ghi là 0,9
        sendReminderMessage('chuẩn bị có cuộc thi xây nhà, hãy đăng kí ngay với ad nhé', '1139719596820152461', [3, 4], 20, 20); // Thứ 4 và Thứ 5 hàng tuần lúc 19:20
        sendReminderMessage('sắp đến cuộc sự kiện mở boss rồi, nhanh chân nào', '1139719596820152461', [5, 6], 17, 30); // Thứ sáu và thứ 7 hàng tuần lúc 17:30
        sendReminderMessage('cuộc thi bơi đã bắt đầu', '1139719596820152461', [5, 7], 19, 35); // Thứ 6 và chủ nhật hàng tuần lúc 19:30
        sendReminderMessage('máy chủ sắp mở cuộc họp thảo luận', '1139719596820152461', [6, 7], 17, 30); // Thứ 7 và chủ nhật hàng tuần tại 17:30


    }
}