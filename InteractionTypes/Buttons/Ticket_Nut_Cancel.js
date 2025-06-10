const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'Ticket_Nut_Cancel',
    description: 'Xóa tin nhắn chứa embed và các nút ticket nếu người dùng có quyền ADM.',
    async execute(interaction, client) {
    try {

            // Kiểm tra quyền của người dùng trước khi xóa tin nhắn chứa embed và các nút
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                // Xóa tin nhắn chứa embed và các nút
                await interaction.message.delete();
                await interaction.deferUpdate();
            } else {
                await interaction.reply({ content: `🚫 Bạn không có quyền thực hiện thao tác này.`, ephemeral: true });
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};