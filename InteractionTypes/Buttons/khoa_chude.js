/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho khóa chủ đề
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'khoa_chude',
    description: 'Khóa một chủ đề trên diễn đàn, chỉ tác giả mới có thể thực hiện thao tác này.',
    async execute(interaction, client) {
    try {

                // Lấy ID kênh của interaction
                const threadID = interaction.channelId;
            try {
                // Lấy kênh từ ID và khóa kênh
                const channel = await interaction.guild.channels.fetch(threadID);
                // await channel.delete();

                // Kiểm tra xem ID thread có phải là do người dùng viết hay không
                if (channel.isThread() && channel.ownerId !== interaction.user.id) {
                    return interaction.reply(`\`\`\`yml\nChỉ tác giả mới có thể khóa bài viết của họ.\`\`\``);
                }

                // await channel.setLocked(true);
                // // console.log("Kênh đã được khóa thành công.");
                        
                await interaction.reply(
                    `\`\`\`yml\n
Chủ đề này đã được đánh dấu là đã giải quyết.

Hãy chắc chắn gửi lời cảm ơn đến người giúp đỡ của chúng tôi! /tks

Bài viết này sẽ bị đóng lại sau vài phút nữa...
Vẫn cần giúp đỡ? Mở một bài viết mới!
                    \`\`\``
                );

                // Đặt thời gian chờ 1 phút
                setTimeout(async () => {
                    try {
                        // Khóa thread sau 5 phút
                        await channel.setLocked(true);
                        await channel.setArchived(true);
                    } catch (error) {
                        console.error('Đã xảy ra lỗi khi khóa kênh:', error);
                    }
                }, 60000); // 1 phút
                

            } catch (error) {
                // console.error('Đã xảy ra lỗi khi khóa chủ đề:', error);
                await interaction.reply(`\`\`\`yml\n/solve chỉ dùng được trên bài viết diễn đàn\`\`\``);
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
