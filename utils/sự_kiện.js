const schedule = require('node-schedule');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

// events_valheim delete
// events_valheim great

const scheduledEvents = new Map(); // key: `${guild.id}_${hour}:${minute}_${eventName}`

function scheduleEvent(guild, hour, minute, eventName) {
    const now = new Date();
    const timeVN = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const targetTime = new Date(timeVN);

    targetTime.setHours(hour);
    targetTime.setMinutes(minute);
    targetTime.setSeconds(0);

    if (targetTime < timeVN) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const jobKey = `${guild.id}_${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}_${eventName.toLowerCase()}`;

    const job = schedule.scheduleJob(targetTime, async () => {
        try {
            const categoryName = "SỰ KIỆN DO AD TỔ CHỨC";
            const channelName = "sự_kiện";

            let category = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === categoryName);
            if (!category) {
                category = await guild.channels.create({
                    name: categoryName,
                    type: ChannelType.GuildCategory,
                    position: 0,
                });
            }

            let eventChannel = guild.channels.cache.find(c => c.name === channelName && c.parentId === category.id);
            if (!eventChannel) {
                eventChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [{
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.SendMessages]
                    }]
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('📢 Sự kiện Valheim')
                .setDescription(`🕒 **${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}** - ${eventName}`)
                .setColor('Green')
                .setTimestamp();

            const button1 = new ButtonBuilder()
                .setCustomId('event_accept')
                .setLabel('Tham gia')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(button1);

            const sentMessage = await eventChannel.send({ embeds: [embed], components: [row] });

            // Lưu messageId vào Map để xóa sau
            scheduledEvents.set(jobKey, { job, messageId: sentMessage.id, channelId: eventChannel.id });

            // console.log(`[+] Sự kiện đã được lên lịch và gửi: ${jobKey}`);
            // console.log('--- Danh sách sự kiện hiện tại:');
            // console.log([...scheduledEvents.keys()]);

        } catch (err) {
            console.error('Lỗi khi gửi sự kiện:', err);
        }
    });

    scheduledEvents.set(jobKey, { job }); // Lưu job ngay cả khi chưa gửi message
    // console.log(`[+] Sự kiện đã được lên lịch (chưa gửi message): ${jobKey}`);
    // console.log('--- Danh sách sự kiện hiện tại:');
    // console.log([...scheduledEvents.keys()]);
}

function cancelEvent(guild, hour, minute, eventName) {
    const key = `${guild.id}_${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}_${eventName.toLowerCase()}`;
    const eventData = scheduledEvents.get(key);
    if (!eventData) {
        // console.log(`[!] Không tìm thấy sự kiện để hủy: ${key}`);
        return false};

    if (eventData.job) eventData.job.cancel();

    if (eventData.channelId && eventData.messageId) {
        // console.log(`[-] Sự kiện đã được hủy (có message): ${key}`);
        // console.log('--- Danh sách sự kiện hiện tại:');
        scheduledEvents.delete(key);
        // console.log([...scheduledEvents.keys()]);
        // Trả về thông tin để xóa message
        return { channelId: eventData.channelId, messageId: eventData.messageId };
    }

    scheduledEvents.delete(key);
    // console.log(`[-] Sự kiện đã được hủy (không có message): ${key}`);
    // console.log('--- Danh sách sự kiện hiện tại:');
    // console.log([...scheduledEvents.keys()]);
    return true;
}

function removeEvent(guild, hour, minute, eventName) {
    const key = `${guild.id}_${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}_${eventName.toLowerCase()}`;
    const eventData = scheduledEvents.get(key);
    if (!eventData) {
        // console.log(`[!] Không tìm thấy sự kiện để xóa: ${key}`);
        return false};

    if (eventData.job) eventData.job.cancel();
    scheduledEvents.delete(key);
    // console.log(`[-] Sự kiện đã được xóa hoàn toàn: ${key}`);
    // console.log('--- Danh sách sự kiện hiện tại:');
    // console.log([...scheduledEvents.keys()]);
    return true;
}

module.exports = {
    scheduleEvent,
    cancelEvent,
    removeEvent,
};