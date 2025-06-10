const { EmbedBuilder } = require(`discord.js`);
const config = require(`../../config`);
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    id: 'say',
    async execute(interaction) {

        // Kiểm tra trạng thái Modal
        const commandStatus = await CommandStatus.findOne({ command: 'say' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện Modal
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Modal này đã bị tắt, vui lòng thử lại sau.');
        }

        // Lấy giá trị từ các input của modal
        const message = interaction.fields.getTextInputValue('say'); // Lấy giá trị từ ô 'say'
        const embedSay = interaction.fields.getTextInputValue('embed'); // Lấy giá trị từ ô 'embed'

        // Lấy ID kênh từ customId
        const channelId = interaction.customId.split(':')[1]; // CustomId có dạng `say:<channelId>`

        // Lấy kênh từ ID
        const channel = await interaction.client.channels.fetch(channelId);

        // Tạo embed để gửi nếu người dùng chọn 'bật' chế độ nhúng
        const embed = new EmbedBuilder()
            .setDescription(message)
            .setColor(config.embedCyan);

        // Kiểm tra chế độ nhúng và gửi tin nhắn
        if (embedSay === "ok" || embedSay === "OK") {
            await channel.send({ embeds: [embed] });
        } else {
            await channel.send(message);
        }

        await interaction.deferUpdate(); // Đảm bảo interaction được xử lý đúng cách
    }
};






// const { EmbedBuilder } = require(`discord.js`);
// const config = require(`../../config`);
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     id: 'say',
//     async execute(interaction) {

//         // Kiểm tra trạng thái Modal
//         const commandStatus = await CommandStatus.findOne({ command: 'say' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện Modal
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Modal này đã bị tắt, vui lòng thử lại sau.');
//         }

//         // Lấy giá trị từ các input của modal
//         const message = interaction.fields.getTextInputValue('say'); // Lấy giá trị từ ô 'say'
//         const embedSay = interaction.fields.getTextInputValue('embed'); // Lấy giá trị từ ô 'embed'
//         const channelId = interaction.fields.getTextInputValue('channel'); // Lấy ID kênh từ modal

//         // Lấy kênh từ ID
//         const channel = await interaction.client.channels.fetch(channelId);

//         // Tạo embed để gửi nếu người dùng chọn 'bật' chế độ nhúng
//         const embed = new EmbedBuilder()
//             .setDescription(message)
//             .setColor(config.embedCyan);

//         // Kiểm tra chế độ nhúng và gửi tin nhắn
//         if (embedSay === "ok" || embedSay === "OK") {
//             await channel.send({ embeds: [embed] });
//         } else {
//             await channel.send(message);
//         }

//         await interaction.deferUpdate(); // Đảm bảo interaction được xử lý đúng cách
//     }
// };