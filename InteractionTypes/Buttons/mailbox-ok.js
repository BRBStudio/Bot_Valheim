const { EmbedBuilder } = require('discord.js');
const Mailbox = require('../../schemas/mailboxSchema');
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'comple-mailbox',
    description: 'Gửi thông báo đến người dùng về việc phản hồi của họ đã được phê duyệt và xóa phản hồi trong cơ sở dữ liệu.',
    async execute(interaction, client) {
        try {
            // Lấy thông tin từ embed của tin nhắn mà bạn tương tác
            const embed = interaction.message.embeds[0];
            if (!embed) {
                return interaction.reply({ content: 'Không thể lấy thông tin phản hồi từ tin nhắn.', ephemeral: true });
            }

            // Lấy nội dung phản hồi và guildId từ embed
            const feedback = embed.description.replace(/```/g, '').trim(); // Lấy nội dung phản hồi từ embed
            const guildName = embed.fields.find(field => field.name === 'Được gửi từ máy chủ:').value.trim();

            // Tìm guildId từ tên máy chủ
            const guild = client.guilds.cache.find(g => g.name === guildName);
            if (!guild) {
                return interaction.reply({ content: 'Không tìm thấy máy chủ của người dùng đã gửi phản hồi.', ephemeral: true });
            }

            // Tìm mục phản hồi trong MongoDB theo nội dung và máy chủ
            const mailboxEntry = await Mailbox.findOne({ feedback, guildId: guild.id, resolved: false });
            if (!mailboxEntry) {
                return interaction.reply({ content: 'Không tìm thấy phản hồi nào để giải quyết.', ephemeral: true });
            }

            // Lấy thông tin của người dùng đã gửi phản hồi
            const user = await guild.members.fetch(mailboxEntry.userId);
            if (!user) {
                return interaction.reply({ content: 'Không tìm thấy người dùng đã gửi phản hồi, hoặc người dùng này đã rời khỏi máy chủ.', ephemeral: true });
            }

            // Tạo nội dung tin nhắn để gửi đến người dùng đã phản hồi
            const feedbackResolvedEmbed = new EmbedBuilder()
                .setTitle('Vấn đề của bạn đã được giải quyết.')
                .setDescription('Cảm ơn sự đóng góp từ bạn.\nCòn vấn đề gì khác hãy dùng lại lệnh `/mailbox`, chúng tôi sẽ xem xét.')
                .setColor('Green')
                .addFields(
                    { name: 'Lựa chọn của bạn', value: mailboxEntry.option, inline: false },
                    { name: 'Nội dung bạn đưa ra', value: mailboxEntry.feedback, inline: false },
                    { name: 'Từ máy chủ', value: guild.name, inline: false }
                )
                .setTimestamp();

            // Gửi tin nhắn đến người dùng đã phản hồi
            await user.send({ embeds: [feedbackResolvedEmbed] });

            // // Cập nhật trạng thái đã xử lý trong MongoDB
            // mailboxEntry.resolved = true;
            // await mailboxEntry.save();
            await Mailbox.deleteOne({ _id: mailboxEntry._id });

            // Xóa tin nhắn mà người dùng đã tương tác với nút `comple-mailbox`
            await interaction.message.delete(); // Xóa tin nhắn tương tác với nút

            // Phản hồi đến người đã nhấn nút để cho họ biết hành động đã được thực hiện
            interaction.reply({ content: 'Bạn đã xử lý xong phản hồi và đã gửi thông báo đến người dùng.', ephemeral: true });
        } catch (error) {
            console.error('Lỗi xảy ra:', error); // In ra lỗi nếu có
            interactionError.execute(interaction, error, client);
        }
    },
};







// const { EmbedBuilder } = require('discord.js');
// const Mailbox = require('../../schemas/mailboxSchema'); // Import schema để truy cập dữ liệu
// const interactionError = require('../../Events/WebhookError/interactionError');

// module.exports = {
//     id: 'comple-mailbox',
//     description: 'Gửi thông báo đến người dùng về việc phản hồi của họ đã được phê quyệt và xóa phản hồi trong cơ sở dữ liệu.',
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
//                 return interaction.reply({ content: 'Không tìm thấy người dùng đã gửi phản hồi, hoặc người dùng này đã rời khỏi máy chủ', ephemeral: true });
//             }

//             // Tạo nội dung tin nhắn để gửi đến người dùng đã phản hồi
//             const feedbackResolvedEmbed = new EmbedBuilder()
//                 .setTitle('Vấn đề của bạn đã được giải quyết.')
//                 .setDescription('Cảm ơn sự đóng góp từ bạn.\nCòn vấn đề gì khác hãy dùng lại lệnh `/mailbox`, chúng tôi sẽ xem xét')
//                 .setColor('Green')
//                 .addFields(
//                     { name: 'Lựa chọn của bạn', value: option, inline: false },  // Lấy từ MongoDB
//                     { name: 'Nội dung bạn đưa ra', value: feedback, inline: false },  // Lấy từ MongoDB
//                     { name: 'Từ máy chủ', value: `${guild}`, inline: false } // Lấy từ MongoDB
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