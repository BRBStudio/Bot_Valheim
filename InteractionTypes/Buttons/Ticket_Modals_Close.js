/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho lệnh:
    - hi
*/
const { EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'Ticket_Modals_Close', // closeTicket
    description: 'Nút sẽ hiển thị modal để người dùng nhập lý do đóng vé.',
    async execute(interaction, client) {
    try {

        const channelTopic = interaction.channel.topic;
        const ticketOwnerId = channelTopic?.match(/Người Sử dụng vé: (\d+)/)?.[1];

        if (!ticketOwnerId || interaction.user.id !== ticketOwnerId) {
            return await interaction.reply({ content: `🚫 Bạn không có quyền sử dụng nút này trong kênh vé này.`, ephemeral: true });
        }

           // Hiển thị modal để đóng vé
        const closeModal = new ModalBuilder()
           .setTitle(`Đóng vé`)
           .setCustomId('closeTicketModal');

        const reason = new TextInputBuilder()
           .setCustomId('closeReasonTicket')
           .setRequired(true)
           .setPlaceholder(`Lý do đóng vé này là gì?\nBạn có thể bỏ qua điều này.`)
           .setLabel('Đưa ra lý do đóng vé')
           .setStyle(TextInputStyle.Paragraph);

        const one = new ActionRowBuilder().addComponents(reason);

        closeModal.addComponents(one);
        await interaction.showModal(closeModal);

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
