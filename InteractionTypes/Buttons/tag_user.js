/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho kêu gọi sự giúp đỡ trong bài viết chủ đề
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');
const gethelpSchema = require(`../../schemas/gethelpSchema`);

module.exports = {
    id: 'tag_user',
    description: `Nút này được sử dụng để gửi yêu cầu trợ giúp từ người dùng đến các người hỗ trợ đã được cấu hình bằng lệnh \`/setup id\` trong máy chủ.`,
    async execute(interaction, client) {
        try {

            // Lấy thông tin kênh chủ đề
            const threadChannel = interaction.channel;

            // Kiểm tra xem người thực hiện lệnh có phải là người tạo thread không
            const threadAuthorId = interaction.channel.ownerId;  // Lấy ID của người tạo thread
            const userId = interaction.user.id;  // ID của người đang thực hiện lệnh

            if (threadAuthorId !== userId) {
                // Nếu người thực hiện không phải là người tạo thread, trả về thông báo
                return interaction.reply({
                    content: "Bạn không thể yêu cầu trợ giúp vì đây không phải là bài viết của bạn.",
                    ephemeral: true,
                });
            }

            // Lấy thông tin ID từ MongoDB
            const setupData = await gethelpSchema.findOne({ serverId: interaction.guild.id });
            if (!setupData || !setupData.userIds.length) {
                return interaction.reply({ content: 'Cấu hình người dùng chưa được thiết lập. Yêu cầu chủ sở hữu máy chủ hoặc người dùng có quyền ADM sử dụng lệnh `/get_help setup` để cấu hình.', ephemeral: true });
            }

            const mentionUsers = setupData.userIds.map(id => `> <@${id}>`).join("\n");

            // Tạo embed message
            const embed = new EmbedBuilder()
                .setTitle(`TRỢ GIÚP <@${interaction.user.id}>`)
                .setDescription(`Tôi cần sự giúp đỡ!\n\n ${mentionUsers}`)
                .setImage('https://data.textstudio.com/output/sample/animated/2/4/3/5/help-3-5342.gif')
                .setColor(config.embedRandom);

            // Gửi tin nhắn embed
            await interaction.reply({ embeds: [embed], ephemeral: false });

            // Tạo tin nhắn DM embed cho các người dùng
            const dmEmbed = new EmbedBuilder()
                .setTitle('YÊU CẦU TRỢ GIÚP')
                .setDescription(`Bạn nhận được yêu cầu trợ giúp từ <@${interaction.user.id}>.\nHãy cố gắng hết sức để hỗ trợ họ\n\n\n> Kênh chủ đề: [${threadChannel.name}](${threadChannel.url})!`)
                .setColor(config.embedRandom)
                .setImage('https://cdn.dribbble.com/users/66340/screenshots/3089041/spinner2.gif')
                .setTimestamp();
                
            for (const userId of setupData.userIds) {
                const user = await client.users.fetch(userId);
                try {
                    await user.send({ embeds: [dmEmbed] });
                } catch (error) {
                    console.error(`Không thể gửi DM cho ${user.username}:`, error);
                }
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};