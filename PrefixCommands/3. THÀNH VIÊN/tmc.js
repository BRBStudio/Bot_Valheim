const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { buttonDelete } = require('../../ButtonPlace/ActionRowBuilder');

module.exports = {
    name: 'tmc',
    description: '🔸 Hiển thị thông tin về chủ sở hữu của máy chủ này.',
    hd: '🔸 ?tmc @người_dùng',
    aliases: ['tìm-máy-chủ', 'findserver', 'tv10'],

    async execute(msg) {
        try {
            // Kiểm tra xem người dùng có tag ai không
            const user = msg.mentions.users.first();
            if (!user) {
                return msg.channel.send('⚠️ Vui lòng tag một người dùng để lấy thông tin.');
            }

            // Kiểm tra nếu user là bot
            if (user.bot) {
                return msg.channel.send('🤖 Bạn đang tag bot đấy! Hãy tag một người dùng, sau đó tôi sẽ giúp bạn.');
            }

            // Lấy thông tin máy chủ (guild)
            const guild = msg.guild;
            if (!guild) {
                return msg.channel.send('⚠️ Không thể lấy thông tin máy chủ.');
            }

            // Lấy nickname của người gửi trong server
            const requesterNickname = msg.member ? msg.member.displayName : msg.author.username;

            // Tạo Embed chứa thông tin
            const embed = new EmbedBuilder()
                .setColor(config.embedCyan)
                .setTitle('🔍 Thông tin người dùng')
                .addFields(
                    { name: `Tên người dùng ${config.arrowDownEmoji}`, value: `\`\`\`${user.displayName}\`\`\``, inline: false },
                    { name: `ID Người dùng ${config.arrowDownEmoji}`, value: `\`\`\`${user.id}\`\`\``, inline: false },
                    { name: `Tên Máy chủ ${config.arrowDownEmoji}`, value: `\`\`\`${guild.name}\`\`\``, inline: false },
                    { name: `ID Máy chủ ${config.arrowDownEmoji}`, value: `\`\`\`${guild.id}\`\`\``, inline: false },
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Yêu cầu bởi ${requesterNickname}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) });

            // Gửi tin nhắn với Embed và nút xoá (nếu có)
            await msg.channel.send({ embeds: [embed], components: [buttonDelete] });

        } catch (error) {
            console.error(error);
            await msg.channel.send('❌ Đã xảy ra lỗi khi thực hiện lệnh. Vui lòng thử lại!');
        }
    }
};
