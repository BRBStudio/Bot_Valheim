/*
lấy nút tại ActionRowBuilder.js dùng cho lệnh:
- hi
*/
const { EmbedBuilder } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'hi_dacquyen',
    description: 'Gửi đặc quyền máy chủ cho người dùng mới sử dụng máy chủ Discord. nút ở lệnh /hi',
    async execute(interaction, client) {
    try {

        // Ưu tiên tìm kênh 'quy_tắc'
        let rulesChannel = interaction.guild.channels.cache.find(
            channel => (channel.type === ChannelType.GuildText) && channel.name === 'đặc_quyền'
        );
        
        // Nếu không tìm thấy kênh 'quy_tắc', tìm kênh 'rules'
        if (!rulesChannel) {
            rulesChannel = interaction.guild.channels.cache.find(
            channel => (channel.type === ChannelType.GuildText) && channel.name === 'privileges'
            );
        }
        
        // Nếu không tìm thấy kênh nào, thông báo lỗi
        if (!rulesChannel) {
            return interaction.reply({ content: 'Không tìm thấy kênh Đặc Quyền hoặc Privileges!', ephemeral: true });
        }
        
        const perkembed = new EmbedBuilder()
                            .setTitle('__✿ ĐẶC QUYỀN MÁY CHỦ__')
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
                            .setColor(config.embedYellow)
                            .setDescription('• Hãy xem những đặc quyền thú vị mà bạn có thể nhận được!')
                            .addFields({ name: '⁕ Đặc quyền cấp độ', value: '• Chỉ định vai trò <@&1246090413916422275> khi bạn đạt đến cấp độ <@&1246090419394314330>!'})
                            .addFields({ name: '⁕ Đặc quyền tăng cường', value: '\n• Yêu cầu tổng cộng 2 phản ứng tự động (<#1248252038429544520>)!\n^ Quyền truy cập vào Kênh riêng tư/Vai trò tùy chỉnh!\n Chỉ định <@&1246090413916422275> & <@&1246090419394314330>!!'})
                            .addFields({ name: '⁕ Đặc quyền tăng cường của tháng', value: '\n• Yêu cầu tổng cộng 2 phản ứng tự động (<#1248252038429544520>)!\n^ Quyền truy cập vào Kênh riêng tư/Vai trò tùy chỉnh!\n Chỉ định <@&1246090413916422275> và tên của bạn sẽ được hiển thị trong <#1246090384619343913>!'})
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: 'https://w.wallhaven.cc/full/v9/wallhaven-v96m6p.jpg'})
                        
                            await interaction.reply({ embeds: [perkembed], ephemeral: true});
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
