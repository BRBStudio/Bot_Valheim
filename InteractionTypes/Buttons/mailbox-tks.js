const { EmbedBuilder } = require('discord.js');
const Mailbox = require('../../schemas/mailboxSchema'); // Import schema để truy cập dữ liệu
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'tks-mailbox',
    description: 'Gửi thông báo đến người dùng đã gửi phản hồi vote trong lệnh \`mailbox\` và xóa phản hồi trong cơ sở dữ liệu.',
    async execute(interaction, client) {
        try {
            // Lấy ID của người dùng đã tương tác với nút
            const adminUser = interaction.user;

            // Tìm kiếm dữ liệu phản hồi chưa được xử lý trong MongoDB
            const mailboxEntry = await Mailbox.findOne({ resolved: false }).sort({ _id: 1 }); // Lấy phản hồi chưa xử lý đầu tiên từ MongoDB

            if (!mailboxEntry) {
                return interaction.reply({ content: 'Không tìm thấy phản hồi nào để giải quyết.', ephemeral: true });
            }

            // Lấy thông tin của người đã gửi phản hồi
            const { userId, guildId, option, feedback } = mailboxEntry;

            // Lấy máy chủ (guild) và người dùng từ client
            const guild = client.guilds.cache.get(guildId); // Máy chủ nơi người dùng gửi phản hồi
            if (!guild) {
                return interaction.reply({ content: 'Không tìm thấy máy chủ của người dùng đã gửi phản hồi.', ephemeral: true });
            }

            const user = await guild.members.fetch(userId); // Tìm kiếm người dùng từ ID

            if (!user) {
                return interaction.reply({ content: 'Không tìm thấy người dùng đã gửi phản hồi.', ephemeral: true });
            }

            // Tạo nội dung tin nhắn để gửi đến người dùng đã phản hồi
            const feedbackResolvedEmbed = new EmbedBuilder()
                .setTitle('VOTE BOT')
                .setDescription('Cảm ơn sự đánh giá cao của bạn.\nMọi đóng góp của bạn là động lực giúp chúng tôi hoàn thiện hơn cho bot\nCòn vấn đề gì khác hãy dùng lại lệnh `/mailbox`')
                .setColor('Green')
                .addFields(
                    { name: 'Lựa chọn của bạn', value: option, inline: false },
                    { name: 'Nội dung bạn đưa ra', value: feedback, inline: false },
                    { name: 'Từ máy chủ', value: guildId, inline: false }
                )
                .setTimestamp();

            // Gửi tin nhắn đến người dùng đã phản hồi
            await user.send({ embeds: [feedbackResolvedEmbed] });

            // Xóa phản hồi đã xử lý trong MongoDB
            await Mailbox.deleteOne({ _id: mailboxEntry._id }); // Xóa mục vừa xử lý

            // Xóa tin nhắn mà người dùng đã tương tác với nút comple-mailbox
            await interaction.message.delete(); // Xóa tin nhắn tương tác với nút

            // Phản hồi đến người đã nhấn nút để cho họ biết hành động đã được thực hiện
            interaction.reply({ content: 'Bạn đã xử lý xong phản hồi và đã gửi thông báo đến người dùng.', ephemeral: true });
        } catch (error) {
            console.log('Lỗi xảy ra:', error); // In ra lỗi nếu có
            interactionError.execute(interaction, error, client);
        }
    },
};
