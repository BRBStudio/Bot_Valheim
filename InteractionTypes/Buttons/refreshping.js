/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho lệnh:
    - pingg
*/
const interactionError = require('../../Events/WebhookError/interactionError');
const { createRefreshPingEmbed } = require('../../Embeds/embedsCreate.js');

module.exports = {
    id: 'refreshping',
    description: 'Nút này được sử dụng để làm mới và hiển thị độ trễ của websocket và API, cũng như thời gian hoạt động của bot.',
    async execute(interaction, client) {
    try {
        const circles = {
            good: 'High 🟢',
            okay: 'Mid: 🟡',
            bad: 'Low: 🔴',
        };

        const startTimestamp = Date.now();
        const msgEdit = Date.now() - startTimestamp;
        const ws = interaction.client.ws.ping;
        const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
        const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

        let days = Math.floor(interaction.client.uptime / 86400000);
        let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        let seconds = Math.floor(interaction.client.uptime / 1000) % 60;
        

        
        const pingEmbed = createRefreshPingEmbed(wsEmoji, ws, msgEmoji, msgEdit, days, hours, minutes, seconds, interaction)

        const newWs = interaction.client.ws.ping;
                    const newMsgEdit = Date.now() - startTimestamp;

                    pingEmbed.setFields(
                        { name: 'Độ trễ của Websocket', value: `${wsEmoji} \`${newWs}ms\`` },
                        { name: 'Độ trễ API', value: `${msgEmoji} \`${newMsgEdit}ms\`` },
                        { name: `${interaction.client.user.username} Thời gian hoạt động`, value: `ghi giờ \`${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây\`` }
                    );

                    await interaction.update({ embeds: [pingEmbed] });
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};