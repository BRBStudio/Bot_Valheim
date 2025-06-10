const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadEvents } = require('../../Handlers/EventHandler');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload_events')
        .setDescription('🔹 Dành cho Dev'), // Tải lại tất cả các sự kiện mà không cần khởi động lại bot.

    guildSpecific: true,
    guildId: `1319809040032989275`, // Máy chủ Emoji Command Bot

    async execute(interaction) {
        const permissionEmbed = new EmbedBuilder()
            .setDescription("`❌` Bạn không có quyền sử dụng lệnh này!")
            .setColor(config.embedRed)
            .setAuthor({
                name: 'BRB Studio Valheim',
                iconURL: 'https://i.imgur.com/coUpySu.jpg',
                url: 'https://discord.gg/Jc3QuUEnnd'
            });

        // Kiểm tra quyền đặc biệt
        if (!checkPermissions(interaction)) {
            return interaction.reply({ embeds: [permissionEmbed] });
        }

        // Tải lại tất cả các sự kiện
        const eventData = loadEvents(interaction.client);
        console.log(interaction.client.eventNames()); // Danh sách sự kiện đang hoạt động

        // Kiểm tra trạng thái sự kiện đã tải lại
        const successCount = eventData.filter(event => event.status === 'loaded').length;
        const errorCount = eventData.filter(event => event.status === 'error').length;

        // Gửi phản hồi về trạng thái tải lại sự kiện
        await interaction.reply(`Đã tải lại sự kiện! \nThành công: ${successCount} sự kiện \nLỗi: ${errorCount} sự kiện`);
    },
};