const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");
const interactionError = require('../../../Events/WebhookError/interactionError');
const { Bvoice, helpValheim, bsetupforum, BảngGiá, BCreatThread } = require('../../../ButtonPlace/format');
const CommandStatus = require('../../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('new') 
        .setDescription('🔹 Định dạng lệnh mới ( không phải lệnh / và ? )'),
    
    async execute(interaction, client) {
        
        try {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/commands_new' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            // Tạo embed để phản hồi cho người dùng
            const embed = new EmbedBuilder()
                .setColor(`Red`) // Màu sắc của embed
                .setTitle('Định dạng lệnh mới') // Tiêu đề của embed
                .setDescription(
                    `<a:VpQX0uNFuk:1249329135118057544> **Cách sử dụng lệnh tạo bảng giá**\n${BảngGiá}\n\n` +
                    `<a:VpQX0uNFuk:1249329135118057544> **Cách sử dụng lệnh giúp đỡ**\n${helpValheim}\n\n` +
                    `<a:VpQX0uNFuk:1249329135118057544> **Cách sử dụng lệnh tạo kênh voice**\n${Bvoice}\n\n` +
                    `<a:VpQX0uNFuk:1249329135118057544> **Cách sử dụng lệnh tạo kênh chủ đề**\n${BCreatThread}\n\n` +                  
                    `<a:VpQX0uNFuk:1249329135118057544> **Cách sử dụng lệnh setup kênh chủ đề**\n${bsetupforum}\n\n`                    
                )
                // .addFields(
                //     { name: `<a:VpQX0uNFuk:1249329135118057544> Cách sử dụng lệnh tạo kênh voice`, value: Bvoice },
                //     { name: `\u200b`, value: `\u200b` },
                //     { name: `<a:VpQX0uNFuk:1249329135118057544> Cách sử dụng lệnh giúp đỡ`, value: helpValheim },
                //     { name: `\u200b`, value: `\u200b` },
                //     { name: `<a:VpQX0uNFuk:1249329135118057544> Cách sử dụng lệnh setup kênh chủ đề`, value: bforum },
                //     { name: `\u200b`, value: `\u200b` },
                //     { name: `<a:VpQX0uNFuk:1249329135118057544> Cách sử dụng lệnh tạo bảng giá`, value: BảngGiá }
                // );
                
            await interaction.deferReply();

            await interaction.deleteReply();
            // Gửi phản hồi cho người dùng
            await interaction.channel.send({ embeds: [embed] });
        } catch (error) {
            // Xử lý lỗi và gọi hàm xử lý lỗi
            interactionError.execute(interaction, error, client);
        }
    }
};
