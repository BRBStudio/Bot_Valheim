const { EmbedBuilder, ChannelType } = require('discord.js');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: "guildBoostLevelUp",
    
    async execute(oldLevel, newLevel, guild) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'guildBoostLevelUp' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra xem guild có tồn tại không
        if (!guild) return;

        // Tạo thông điệp embed để thông báo về sự kiện nâng cấp
        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle("Hệ thống tăng cường máy chủ!")
            .setDescription(`🎉 **Máy chủ ${guild.name} đã nâng cấp!**`)
            .addFields(
                { name: "Mức độ cũ", value: `${oldLevel}`, inline: true },
                { name: "Mức độ mới", value: `${newLevel}`, inline: true }
            )
            .setTimestamp();

        // Tìm kênh log để gửi thông báo
        const logChannel = guild.channels.cache.find(channel => channel.name === "log-boosts" && channel.type === ChannelType.GuildText);

        if (logChannel) {
            await logChannel.send({ embeds: [embed] });
            // console.log(`Đã gửi thông báo nâng cấp đến kênh log-boosts.`);
        } else {
            console.log("Không tìm thấy kênh log-boosts.");
        }
    }
}
