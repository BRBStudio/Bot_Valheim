/*
   dùng xóa tin nhắn
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'delete',
    description: 'Nút xóa tin nhắn',
    async execute(interaction, client) {
    try {
            if (interaction.message.deletable) {
                // Gửi phản hồi để tránh lỗi Unknown interaction
                await interaction.deferUpdate();
                
                // Xóa tin nhắn
                await interaction.message.delete();
                return;
                // // Phản hồi lại để người dùng biết tin nhắn đã được xóa
                // await interaction.reply({ content: 'Tin nhắn đã được xóa!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Không thể xóa tin nhắn này! Bạn cần cấp quyền **Manage Messages (Quản lý tin nhắn)** cho tôi', ephemeral: true });
            }
        
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
