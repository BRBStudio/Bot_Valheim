const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadCommands } = require('../../Handlers/CommandsHandler');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload_commands')
        .setDescription('🔹 Dành cho Dev'), // Tải lại tất cả các lệnh slash mà không cần khởi động lại bot.

    guildSpecific: true,
    guildId: `1319809040032989275`, // Máy chủ Emoji Command Bot
    
    async execute(interaction) {
        const permissionEmbed = new EmbedBuilder()
            .setDescription("`❌` Bạn không có quyền sử dụng lệnh này!")
            .setColor(config.embedGreen)
            .setAuthor({ 
                name: 'BRB Studio Valheim', 
                iconURL: 'https://i.imgur.com/coUpySu.jpg', 
                url: 'https://discord.gg/Jc3QuUEnnd' 
            });
        
        // Kiểm tra quyền đặc biệt
        if (!checkPermissions(interaction)) {
            return interaction.reply({ embeds: [permissionEmbed] });
        }

        // Thực hiện tải lại các lệnh
        const commandData = loadCommands(interaction.client);

        // Kiểm tra trạng thái lệnh đã tải lại
        const successCount = commandData.filter(cmd => cmd.status === 'loaded').length;
        const errorCount = commandData.filter(cmd => cmd.status === 'error').length;

        // Gửi phản hồi về trạng thái tải lại lệnh
        await interaction.reply(`Đã tải lại lệnh! \nThành công: ${successCount} lệnh \nLỗi: ${errorCount} lệnh`);
    },
};