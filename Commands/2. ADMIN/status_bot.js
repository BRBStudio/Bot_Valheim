const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { createStatusBotEmbed } = require(`../../Embeds/embedsCreate`);
const { getPreferredLanguage } = require('../../languageUtils');
const CommandStatus = require('../../schemas/Command_Status');
const config = require(`../../config`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status_bot')
        .setDescription(
            `🔹 Kiểm tra trạng thái online hoặc offline của các bot trong\n` +
            `       máy chủ`),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/status_bot' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Lấy ID của người dùng hiện tại
        const userId = interaction.user.id;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && !config.specialUsers.includes(userId)) {
            const language = await getPreferredLanguage(interaction.guild.id, interaction.user.id); // Lấy ngôn ngữ của máy chủ
            // Kiểm tra ngôn ngữ để trả về thông báo tương ứng
            const replyMessage = language === 'en' 
                ? "You must be an **Administrator** or have the **Administrator** permission to perform this action." 
                : "Bạn phải là **Quản trị viên** hoặc vai trò của bạn phải có quyền **Quản trị viên** để thực hiện hành động này.";
            return await interaction.reply({ content: replyMessage, ephemeral: true });
        }

        const embed = await createStatusBotEmbed(interaction);

        await interaction.reply({ embeds: [embed] });
    }
};
