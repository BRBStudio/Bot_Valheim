const { EmbedBuilder } = require('discord.js');
const Mailbox = require('../../schemas/mailboxSchema'); // Import schema để truy cập dữ liệu
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'tc-mailbox',
    description: 'Gửi thông báo đến người dùng về việc phản hồi của họ đã bị từ chối.',
    async execute(interaction, client) {
        try {
            // Lấy thông tin từ embed của tin nhắn đang tương tác
            const embed = interaction.message.embeds[0]; // Lấy embed đầu tiên trong tin nhắn
            if (!embed) {
                return interaction.reply({ content: 'Không tìm thấy thông tin phản hồi.', ephemeral: true });
            }

            // Trích xuất thông tin từ embed
            const userNameField = embed.fields.find(field => field.name === 'Người dùng đã gửi yêu cầu:');
            const guildNameField = embed.fields.find(field => field.name === 'Được gửi từ máy chủ:');
            const feedbackField = embed.description;

            if (!userNameField || !guildNameField || !feedbackField) {
                return interaction.reply({ content: 'Không đủ thông tin để xử lý phản hồi.', ephemeral: true });
            }

            const userName = userNameField.value;
            const guildName = guildNameField.value;
            const feedback = feedbackField.replace(/```/g, ''); // Loại bỏ định dạng code block

            // Tìm người dùng trong cơ sở dữ liệu theo feedback
            const mailboxEntry = await Mailbox.findOne({ feedback, resolved: false });

            if (!mailboxEntry) {
                return interaction.reply({ content: 'Không tìm thấy phản hồi trong cơ sở dữ liệu.', ephemeral: true });
            }

            const { userId, guildId, option } = mailboxEntry;

            // Lấy máy chủ và người dùng
            const guild = client.guilds.cache.get(guildId);
            if (!guild) {
                return interaction.reply({ content: 'Không tìm thấy máy chủ của người dùng đã gửi phản hồi.', ephemeral: true });
            }

            const user = await guild.members.fetch(userId);
            if (!user) {
                return interaction.reply({ content: 'Không tìm thấy người dùng đã gửi phản hồi.', ephemeral: true });
            }

            // Tạo nội dung tin nhắn từ chối
            const feedbackResolvedEmbed = new EmbedBuilder()
                .setTitle('Phản hồi của bạn đã bị từ chối.')
                .setDescription('Cảm ơn bạn đã gửi phản hồi. Nếu bạn có vấn đề gì khác, hãy gửi lại qua lệnh `/mailbox`.')
                .setColor('Red')
                .addFields(
                    { name: 'Lựa chọn của bạn', value: option, inline: false },
                    { name: 'Nội dung phản hồi', value: feedback, inline: false },
                    { name: 'Từ máy chủ', value: guildName, inline: false }
                )
                .setTimestamp();

            // Gửi tin nhắn DM cho người dùng
            await user.send({ embeds: [feedbackResolvedEmbed] });

            // Cập nhật trạng thái phản hồi thành đã xử lý
            // await Mailbox.findByIdAndUpdate(mailboxEntry._id, { resolved: true });
            await Mailbox.deleteOne({ _id: mailboxEntry._id });

            // Xóa tin nhắn trong kênh
            await interaction.message.delete();

            // Phản hồi lại người nhấn nút
            interaction.reply({ content: 'Đã từ chối phản hồi và gửi thông báo đến người dùng.', ephemeral: true });
        } catch (error) {
            console.error('Lỗi xảy ra:', error);
            interactionError.execute(interaction, error, client);
        }
    },
};







// const { EmbedBuilder } = require('discord.js');
// const Mailbox = require('../../schemas/mailboxSchema'); // Import schema để truy cập dữ liệu
// const interactionError = require('../../Events/WebhookError/interactionError');

// module.exports = {
//     id: 'tc-mailbox',
//     description: 'Gửi thông báo đến người dùng về việc phản hồi của họ đã bị từ chối và xóa phản hồi trong cơ sở dữ liệu.',
//     async execute(interaction, client) {
//         try {
//             // Lấy ID của người dùng đã tương tác với nút
//             const adminUser = interaction.user;

//             // Tìm kiếm dữ liệu phản hồi chưa được xử lý trong MongoDB
//             const mailboxEntry = await Mailbox.findOne({ resolved: false }).sort({ _id: 1 }); // Lấy phản hồi chưa xử lý đầu tiên từ MongoDB

//             if (!mailboxEntry) {
//                 return interaction.reply({ content: 'Không tìm thấy phản hồi nào để giải quyết.', ephemeral: true });
//             }

//             // Lấy thông tin của người đã gửi phản hồi
//             const { userId, guildId, option, feedback } = mailboxEntry;

//             // Lấy máy chủ (guild) và người dùng từ client
//             const guild = client.guilds.cache.get(guildId); // Máy chủ nơi người dùng gửi phản hồi
//             if (!guild) {
//                 return interaction.reply({ content: 'Không tìm thấy máy chủ của người dùng đã gửi phản hồi.', ephemeral: true });
//             }

//             const user = await guild.members.fetch(userId); // Tìm kiếm người dùng từ ID

//             if (!user) {
//                 return interaction.reply({ content: 'Không tìm thấy người dùng đã gửi phản hồi.', ephemeral: true });
//             }

//             // Tạo nội dung tin nhắn để gửi đến người dùng đã phản hồi
//             const feedbackResolvedEmbed = new EmbedBuilder()
//                 .setTitle('Vấn đề của bạn đã bị từ chối.')
//                 .setDescription('Cảm ơn sự đóng góp từ bạn.\nCòn vấn đề gì khác hãy dùng lại lệnh `/mailbox`, chúng tôi sẽ xem xét')
//                 .setColor('Green')
//                 .addFields(
//                     { name: 'Lựa chọn của bạn', value: option, inline: false },
//                     { name: 'Nội dung bạn đưa ra', value: feedback, inline: false },
//                     { name: 'Từ máy chủ', value: `${guild}`, inline: false }
//                 )
//                 .setTimestamp();

//             // Gửi tin nhắn đến người dùng đã phản hồi
//             await user.send({ embeds: [feedbackResolvedEmbed] });

//             // Xóa phản hồi đã xử lý trong MongoDB
//             await Mailbox.deleteOne({ _id: mailboxEntry._id }); // Xóa mục vừa xử lý

//             // Xóa tin nhắn mà người dùng đã tương tác với nút comple-mailbox
//             await interaction.message.delete(); // Xóa tin nhắn tương tác với nút

//             // Phản hồi đến người đã nhấn nút để cho họ biết hành động đã được thực hiện
//             interaction.reply({ content: 'Bạn đã xử lý xong phản hồi và đã gửi thông báo đến người dùng.', ephemeral: true });
//         } catch (error) {
//             console.log('Lỗi xảy ra:', error); // In ra lỗi nếu có
//             interactionError.execute(interaction, error, client);
//         }
//     },
// };
