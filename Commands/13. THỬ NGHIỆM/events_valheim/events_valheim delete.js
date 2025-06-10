const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('discord.js');
const { cancelEvent } = require('../../../utils/sự_kiện');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('delete')
        .setDescription('Hủy sự kiện đã lên lịch')
        .addStringOption(option =>
            option.setName('thoigian_sukien')
                .setDescription('Nhập thời gian và tên sự kiện. VD: 15:00 cuộc thi bơi')
                .setRequired(true)),

    guildSpecific: true,
    guildId: ['1319809040032989275'],
    
    async execute(interaction) {
        const input = interaction.options.getString('thoigian_sukien');
        const match = input.match(/^(\d{1,2}):(\d{2})\s+(.+)/);

        if (!match) {
            return interaction.reply({
                content: '❌ Định dạng không hợp lệ. VD: `15:00 cuộc thi bơi`',
                ephemeral: true
            });
        }

        const [, hourStr, minuteStr, eventName] = match;
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return interaction.reply({ content: '❌ Giờ hoặc phút không hợp lệ.', ephemeral: true });
        }

        const cancelResult = cancelEvent(interaction.guild, hour, minute, eventName);

        if (cancelResult === false) {
            return interaction.reply({ content: '❌ Không tìm thấy sự kiện cần hủy.', ephemeral: true });
        }

        // Nếu có messageId và channelId, cố gắng xóa tin nhắn
        if (typeof cancelResult === 'object') {
            try {
                const channel = await interaction.guild.channels.fetch(cancelResult.channelId);
                const message = await channel.messages.fetch(cancelResult.messageId);
                if (message) await message.delete();
            } catch (err) {
                console.warn('Không thể xóa tin nhắn sự kiện:', err);
            }
        }

        return interaction.reply({ content: `✅ Đã hủy sự kiện **${eventName}** lúc **${hour}:${minute.toString().padStart(2, '0')}**`, ephemeral: true });
    }
};
