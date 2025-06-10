/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho lệnh:
    - recruitment
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');
const recruitmentSchema = require('../../schemas/recruitmentSchema');

module.exports = {
    id: 'discord_no',
    description: 'Thông báo từ chối đơn đăng ký vai trò trong discord',
    async execute(interaction, client) {
    try {

        const botUser = client.user; // Nhận người dùng bot
                const botIcon = botUser.displayAvatarURL(); 
                const botTag = botUser.username; // Lấy tên người dùng của bot

                // Lấy thông tin của người dùng từ MongoDB dựa trên messageId
                const data = await recruitmentSchema.findOne({ messageId: interaction.message.id });

                // Kiểm tra vai trò và từ chối
                let roleDiscordNo;
                if (data.discordPosition) {
                    roleDiscordNo = data.discordPosition;
                } else {
                    return await interaction.reply({
                        content: 'Không tìm thấy thông tin vị trí ứng tuyển.',
                        ephemeral: true,
                    });
                }
                            
                if (!data) {
                    return await interaction.reply({
                        content: 'Không tìm thấy dữ liệu đăng ký tuyển dụng cho tin nhắn này.',
                        ephemeral: true,
                    });
                }
                
                // Lấy thông tin thành viên
                const member = await interaction.guild.members.fetch(data.userId);
                if (!member) {
                    return await interaction.reply({
                        content: 'Không tìm thấy thành viên tương ứng với đơn đăng ký này.',
                        ephemeral: true,
                    });
                }

                // tin nhắn từ chối đơn được gửi đến cho người dùng
                const denyDiscord_User = new EmbedBuilder()
                    .setAuthor({ name: botTag, iconURL: botIcon })
                    .setThumbnail(botIcon)
                    .setTitle(`THÔNG BÁO VỀ ĐƠN ĐĂNG KÝ DISCORD CỦA BẠN`)
                    .setDescription(`Xin chào ***${member.displayName}***, rất tiếc phải nói điều này nhưng đơn ứng tuyển của bạn vào vị trí ***${roleDiscordNo}*** Discord của máy chủ ***${interaction.guild.name}*** đã bị từ chối vì vị trí đã đủ hoặc bạn không đủ điều kiện.\n\nHãy thoải mái nộp lại đơn bất cứ lúc nào!`)
                    .setTimestamp()

                // Gửi tin nhắn riêng tư cho người dùng
                await member.send({ embeds: [denyDiscord_User] })

                // Xóa tin nhắn gốc của người dùng
                await interaction.message.delete();

                // Defer update để xác nhận sự tương tác
                await interaction.deferUpdate();
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
