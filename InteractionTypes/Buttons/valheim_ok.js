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
    id: 'valheim_ok',
    description: 'Thông báo duyệt đơn đăng ký vai trò trong valheim',
    async execute(interaction, client) {
    try {

        // const channel1 = client.channels.cache.get('1253572129165938708')
        const guild = interaction.guild;
        const nameChannel = 'Thông-Báo-Đơn-Ứng-Tuyển';
        const channel = guild.channels.cache.find(ch => ch.name.toLowerCase() === nameChannel.toLowerCase());
        const botUser = client.user; // Nhận người dùng bot
        const botIcon = botUser.displayAvatarURL(); 
        const botTag = botUser.username; // Lấy tên người dùng của bot\

        if (!channel) {

            const embed = new EmbedBuilder()
                    .setColor(`Green`)
                    .setTitle(`❗ KHÔNG TÌM THẤY KÊNH ${nameChannel}`)
                    .setDescription(`Máy chủ cần có kênh văn bản ***${nameChannel}*** để thông báo cho thành viên biết về việc duyệt và từ chối đơn ứng tuyển`)
                    
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }


        try {
            // Lấy thông tin của người dùng từ MongoDB dựa trên messageId
            const data = await recruitmentSchema.findOne({ messageId: interaction.message.id });
            
            if (!data) {
                return await interaction.reply({
                    content: 'Không tìm thấy dữ liệu đăng ký tuyển dụng cho tin nhắn này.',
                    ephemeral: true,
                });
            }

            // Kiểm tra và gán vai trò tương ứng
            let roleToAdd;
            if (data.valheimPosition) {
                roleToAdd = data.valheimPosition;
            } else {
                return await interaction.reply({
                    content: 'Không tìm thấy thông tin vị trí ứng tuyển.',
                    ephemeral: true,
                });
            }

            // Chuyển đổi vai trò thành chữ hoa, không phân biệt chữ hoa thường
            const roleToSearch = roleToAdd.toLowerCase();

            // Tìm vai trò trong máy chủ Discord
            const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleToSearch);
            if (!role) {
                return await interaction.reply({
                    content: `Không tìm thấy vai trò ***${roleToAdd}*** trong máy chủ. Hãy tạo chúng trước khi duyệt đơn ứng tuyển`,
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

            // Gán vai trò cho thành viên
            await member.roles.add(role);

            // tin nhắn duyệt đơn valheim được gửi trong kênh channel1
            const duyetValheim = new EmbedBuilder()
                .setAuthor({ name: botTag, iconURL: botIcon })
                .setThumbnail(botIcon)
                .setTitle(":white_check_mark: THÔNG BÁO DUYỆT ĐƠN ĐĂNG KÝ VALHEIM")
                .setDescription(`Đơn đăng ký của ***${member.displayName}*** đã được chấp nhận và giờ đây họ là ***${roleToAdd}*** trong máy chủ ***${interaction.guild.name}*** của chúng ta.\n\nHãy gửi lời chào chúc mừng họ đến với máy chủ ***${interaction.guild.name}*** của chúng ta!`)
                .setTimestamp()

            // tin nhắn duyệt đơn valheim được gửi cho người dùng      
            const embedValheim_User = new EmbedBuilder()
                .setAuthor({ name: botTag, iconURL: botIcon })
                .setThumbnail(botIcon)
                .setTitle(`THÔNG BÁO VỀ ĐƠN ĐĂNG KÝ VALHEIM CỦA BẠN`)
                .setDescription(`Xin chào ***${member.displayName}***, sau khi hội họp, chúng tôi đưa ra xét duyệt với đơn của bạn.\nXin Chúc mừng, Bây giờ bạn là ***${roleToAdd}*** trong máy chủ ***${interaction.guild.name}*** của chúng tôi`)
                .setTimestamp()

            // Gửi tin nhắn riêng tư cho người dùng
            await member.send({ embeds: [embedValheim_User] })
            await channel.send({ embeds: [duyetValheim] });

            // Xóa tin nhắn gốc của người dùng
            await interaction.message.delete();
    
            // Phản hồi thành công
            // await interaction.reply({
            //     content: `Đã gán vai trò ${role.name} cho thành viên ${member.user.username}.`,
            //     ephemeral: true,
            // });
            // Defer update để xác nhận sự tương tác
            await interaction.deferUpdate();

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.',
                ephemeral: true,
            });
        }
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
