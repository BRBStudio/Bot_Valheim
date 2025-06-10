const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const AutoMod = require('../../schemas/autoModSchema');
// const logger = require('silly-logger');
const EventStatus = require('../../schemas/Event_Status');

const userActions = new Map();
//event chặn link
module.exports = {
    name: 'messageCreate',

    async execute(message) {

        // // Kiểm tra trạng thái của sự kiện này
        // const eventStatus = await EventStatus.findOne({ event: 'event-anti-spam-mess' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (message.author.bot || !message.guild) return;

        const guildConfig = await AutoMod.findOne({ guildId: message.guild.id });
        if (!guildConfig) return;

        const heatSettings = guildConfig.heatSettings;
        if (!heatSettings) return;

        const logChannel = guildConfig.logChannelId ? message.guild.channels.cache.get(guildConfig.logChannelId) : null;
        const userId = message.author.id;

        if (!userActions.has(userId)) {
            userActions.set(userId, []);
        }

        const userLogs = userActions.get(userId);
        const currentTime = Date.now();

        while (userLogs.length && currentTime - userLogs[0] > heatSettings.difference * 1000) {
            userLogs.shift();
        }

        userLogs.push(currentTime);

        if (userLogs.length > heatSettings.limit) {
            const member = message.guild.members.cache.get(userId);
            if (member && !member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                try {
                    await member.timeout(heatSettings.muteTime * 1000, 'Vi phạm giới hạn spam tin nhắn - gửi tin nhắn quá nhiều.');

                    const userMessages = await message.channel.messages.fetch({ limit: 100 });
                    const userSpamMessages = userMessages.filter(m => m.author.id === userId);
                    await message.channel.bulkDelete(userSpamMessages, true);

                    if (logChannel && !userLogs.muted) {
                        userLogs.muted = true; 
                        const embed = new EmbedBuilder()
                            .setTitle('HỆ THỐNG CHỐNG SPAM TIN NHẮN')
                            .setDescription(`Người dùng **\`${member.user.displayName}\`** đã bị mute **\`${heatSettings.muteTime} giây\`** do vi phạm spam tin nhắn.`)
                            .addFields(
                                { name: 'Máy chủ', value: message.guild.name, inline: true },
                                { name: 'Người kiểm duyệt', value: `<@${message.client.user.id}>`, inline: true },
                                { name: 'Người dùng bị mute', value: `<@${member.user.id}>`, inline: true },
                                { name: 'Lý do', value: '`Vi phạm giới hạn spam tin nhắn - gửi tin nhắn quá nhiều`', inline: true },
                                { name: 'Hình phạt', value: 'Mute người dùng', inline: true }
                            )
                            .setColor(`Green`)
                            .setTimestamp();

                        logChannel.send({ embeds: [embed] });
                    }
                } catch (error) {
                    logger.error('Lỗi khi mute người dùng và xóa tin nhắn:', error);
                }

                userActions.delete(userId);
            }
        }
    }
};