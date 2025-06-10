const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('discord.js');
const { scheduleEvent } = require('../../../utils/sự_kiện');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('great')
        .setDescription('Tạo sự kiện Valheim')
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
                content: '❌ Định dạng không hợp lệ. VD: `15:00 cuộc thi bơi` (trong đó 15:00 là định dạng giờ, cuộc thi bơi là nội dung sự kiện)', 
                ephemeral: true });
        }

        const [, hourStr, minuteStr, eventName] = match;
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        // Kiểm tra hợp lệ
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return interaction.reply({ content: '❌ Giờ hoặc phút không hợp lệ.', ephemeral: true });
        }

        // Tạo lịch
        scheduleEvent(interaction.guild, hour, minute, eventName);
        await interaction.reply({ content:`✅ Sự kiện **${eventName}** đã được đặt vào lúc **${hour}:${minute.toString().padStart(2, '0')}**.`, ephemeral: [true] });
    }
};
