const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'Ticket_Nut_RemoveG',
    description: 'Nút này cho phép người dùng có ADM xóa tất cả các kênh ticket có tên bắt đầu bằng "game-".',
    async execute(interaction, client) {
    try {

            // Kiểm tra quyền của người dùng trước khi thực hiện thao tác
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const ticketChannels = interaction.guild.channels.cache.filter(channel => /^game-/i.test(channel.name));

                if (ticketChannels.size === 0) {
                    return await interaction.reply({ content: `🚫 Không có kênh ticket nào để xóa.`, ephemeral: true });
                }

                ticketChannels.forEach(channel => {
                    channel.delete().catch(err => console.error(`Không thể xóa kênh ${channel.name}:`, err));
                });

                await interaction.reply({ content: `✅ Đã xóa tất cả các kênh ticket vé game.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `🚫 Bạn không có quyền thực hiện thao tác này.`, ephemeral: true });
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};