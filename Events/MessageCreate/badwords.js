/*
***
    Events/MessageCreate/badwords.js
    Mã này kiểm tra các tin nhắn mới để tìm các từ xấu và gửi cảnh báo nếu cần. Nó cũng gửi thông báo cho người dùng nếu tin nhắn của họ chứa từ xấu.
***
*/
// badwords.js
const { EmbedBuilder } = require('discord.js');
const AntiwordConfig = require('../../schemas/antiwordSchema.js');
const config = require(`../../config`);
const { createBadWordsEmbed, createLogEmbed } = require(`../../Embeds/embedsCreate`);
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(message) {

        // // Kiểm tra trạng thái của sự kiện này
        // const eventStatus = await EventStatus.findOne({ event: 'badwords' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        if (!message.guild || message.author.bot) return;

        try {
            const guildConfig = await AntiwordConfig.findOne({ guildId: message.guild.id });

            // Kiểm tra trạng thái isActive
            if (guildConfig && guildConfig.isActive && guildConfig.badWords.length > 0) {
                const messageContent = message.content.toLowerCase();
                const foundInText = guildConfig.badWords.some(word => messageContent.includes(word));

                if (foundInText) {
                    const logEmbed = createLogEmbed(message);
                    const logChannelId = guildConfig.selectedChannelId;
                    const logChannel = message.guild.channels.cache.get(logChannelId);

                    if (logChannel) {
                        logChannel.send({ embeds: [logEmbed] });
                    }

                    const embed = createBadWordsEmbed(message);
                    message.author.send({ embeds: [embed] }).catch(error => {
                        console.error('Lỗi khi gửi tin nhắn DM:', error);
                    });

                    message.delete().catch(error => {
                        console.error('Lỗi khi xóa tin nhắn:', error);
                    });
                }
            }
        } catch (error) {
            console.error('Lỗi khi xử lý tin nhắn:', error);
        }
    },
};
