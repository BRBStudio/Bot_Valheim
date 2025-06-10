const { EmbedBuilder } = require('discord.js');
const config = require ('../../config')
const { buttonDelete } = require('../../ButtonPlace/ActionRowBuilder');

module.exports = {
    name: 'owner',
    description: 
        `🔸 Tìm kiếm và hiển thị thông tin cơ bản của máy chủ dựa trên\n` +
        `       ID máy chủ.`,

    hd: '🔸 ?owner <id máy chủ muốn tìm>',
        
    aliases: ['o',`tv6`],

    async execute(msg, args) {
        // Kiểm tra xem người dùng có cung cấp ID hay không
        if (!args[0]) {
            return msg.channel.send('Vui lòng cung cấp ID máy chủ.');
        }

        // Lấy ID máy chủ từ tham số đầu tiên của lệnh
        const guildId = args[0];

        try {
            // Tìm máy chủ theo ID
            const guild = await msg.client.guilds.fetch(guildId);

            // Lấy thông tin của máy chủ
            const guildName = guild.name; // Tên máy chủ

            // const owner = await guild.fetchOwner(); // Lấy thông tin chủ sở hữu
            let owner;
            try {
                owner = await guild.fetchOwner();
            } catch (error) {
                return message.channel.send('Không thể lấy thông tin chủ sở hữu, có thể bot thiếu quyền.');
            }

            const memberCount = guild.memberCount; // Số lượng thành viên

            // Tạo Embed để gửi thông tin rõ ràng hơn
            const embed = new EmbedBuilder()
                .setTitle('Thông Tin Máy Chủ')
                .setColor(0x00ADEF)
                .addFields(
                    { name: `TÊN MÁY CHỦ ${config.arrowDownEmoji} :`, value: `\`\`\`${guildName}\`\`\``, inline: false },
                    { name: `ID MÁY CHỦ ${config.arrowDownEmoji} :`, value: `\`\`\`${guildId}\`\`\``, inline: false },
                    { name: `TÊN ĐĂNG NHẬP CHỦ SỞ HỮU${config.arrowDownEmoji} :`, value: `\`\`\`${owner.user.displayName}\`\`\``, inline: false },
                    { name: `TÊN TRONG DISCORD CHỦ SỞ HỮU ${config.arrowDownEmoji} :`, value: `\`\`\`${owner.nickname || owner.user.username}\`\`\``},
                    { name: `ID CHỦ SỞ HỮU ${config.arrowDownEmoji} :`, value: `\`\`\`${owner.id}\`\`\``, inline: false },
                    { name: `SỐ LƯỢNG THÀNH VIÊN ${config.arrowDownEmoji} :`, value: `\`\`\`${memberCount}\`\`\``, inline: true }
                )
                .setFooter({ text: `${config.DevBy}` })
                .setTimestamp();

            // Gửi Embed chứa thông tin máy chủ
            msg.channel.send({ embeds: [embed], components: [buttonDelete] });
        } catch (error) {
            // Xử lý lỗi nếu ID máy chủ không hợp lệ hoặc không tìm thấy máy chủ
            // console.error(error);
            msg.channel.send('Không tìm thấy máy chủ với ID đã cung cấp.');
        }
    }
};
