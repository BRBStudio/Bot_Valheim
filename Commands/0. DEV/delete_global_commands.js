const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_global_commands')
        .setDescription('🔹 Xóa một lệnh toàn cục')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Tên lệnh toàn cục cần xóa')
                .setRequired(true)
        ),

    guildSpecific: true,
    guildId: ['1319809040032989275'], // máy chủ Emoji Command Bot

    async execute(interaction) {
        const commandName = interaction.options.getString('name'); // Lấy tên lệnh cần xóa từ người dùng

        try {
            // Lấy danh sách tất cả các lệnh toàn cục của bot
            const globalCommands = await interaction.client.application.commands.fetch();
            
            // Tìm lệnh cần xóa theo tên
            const commandToDelete = globalCommands.find(cmd => cmd.name === commandName);

            if (!commandToDelete) {
                return interaction.reply({
                    content: `⚠ Không tìm thấy lệnh toàn cục **/${commandName}**.`,
                    ephemeral: true // Trả lời tin nhắn chỉ hiển thị cho người gọi lệnh
                });
            }

            // Xóa lệnh toàn cục khỏi Discord
            await interaction.client.application.commands.delete(commandToDelete.id);
            console.log(`✅ Đã xóa lệnh toàn cục /${commandName}`);

            // Gửi phản hồi xác nhận thành công
            await interaction.reply({
                content: `✅ Đã xóa lệnh toàn cục **/${commandName}**!`,
                ephemeral: true
            });
        } catch (error) {
            // Xử lý lỗi nếu có vấn đề xảy ra khi xóa lệnh
            console.error(`❌ Lỗi khi xóa lệnh toàn cục ${commandName}:`, error);
            await interaction.reply({
                content: `❌ Đã xảy ra lỗi khi xóa lệnh toàn cục **/${commandName}**.`,
                ephemeral: true
            });
        }
    }
};