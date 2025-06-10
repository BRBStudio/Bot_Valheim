const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const config = require(`../../config`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: {
        name: 'AI TIẾNG VIỆT',
        type: ApplicationCommandType.Message,
    },
    async execute(interaction, msg) {
        if (!interaction.isMessageContextMenuCommand()) return;

        // Kiểm tra trạng thái của ngữ cảnh
        const commandStatus = await CommandStatus.findOne({ command: 'AI TIẾNG VIỆT' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện ngữ cảnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
        }

        if (interaction.commandName === 'AI TIẾNG VIỆT') { // Sửa điều kiện lệnh đúng
            const targetMessage = interaction.targetMessage;

            // Kiểm tra xem targetMessage có tồn tại và có nội dung không \\ if (!targetMessage || !targetMessage.content || !/\w/.test(targetMessage.content))
            if (!targetMessage || !targetMessage.content.trim()) {
                return interaction.reply({ content: `🆘 Đây không phải chữ hoặc tin nhắn không có nội dung, vui lòng chọn nội dung có tin nhắn bằng chữ để sử dụng AI.`, ephemeral: true });
            }

            // Trì hoãn phản hồi để tránh lỗi timeout
            await interaction.deferReply({ ephemeral: true });

            // Lấy nội dung tin nhắn gốc
            const content = targetMessage.content;

            try {
                // Xác định ngôn ngữ của tin nhắn
                const detectedTranslation = await translate(content, { to: 'en' });
                const detectedLang = detectedTranslation.from.language.iso;

                // Nếu tin nhắn đã là tiếng Việt thì không dịch
                if (detectedLang === 'vi') {
                    return interaction.editReply({ content: `Tin nhắn đã là tiếng Việt. Không cần dịch.` });
                }

                // Nếu không phải tiếng Việt, dịch tin nhắn sang tiếng Việt
                const translated = await translate(content, { to: 'vi' });

                // Giới hạn chặt chẽ hơn để đảm bảo tổng không vượt quá 6000 ký tự
                const maxTotal = 6000;
                const titleAndExtras = 500; // Ước tính phần title, footer, thumbnail...
                const available = maxTotal - titleAndExtras;

                // Cắt nội dung sao cho tổng không vượt giới hạn
                const half = Math.floor(available / 2);
                const originalContent = content.length > half
                    ? content.slice(0, half - 3) + '...'
                    : content;

                const translatedContent = translated.text.length > half
                    ? translated.text.slice(0, half - 3) + '...'
                    : translated.text;

                const embedGocTV = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nTin nhắn gốc:`)
                    .setColor(config.embedDarkOrange)
                    .setDescription(`\`\`\`yml\n${originalContent}\`\`\``) // ${targetMessage.content}
                    .setFooter({ text: `⏰` })
                    .setThumbnail('https://i.imgur.com/dZsQfqP.gif')
                    .setTimestamp();

                const embedDichTV = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nDịch tin nhắn:`)
                    .setColor(config.embedDarkGreen)
                    .setDescription(`\`\`\`yml\n${translatedContent}\`\`\``) // ${translated.text}
                    .setFooter({ text: `⏰` })
                    .setThumbnail('https://i.imgur.com/dZsQfqP.gif')
                    .setTimestamp();

                // Hiển thị tin nhắn gốc và tin nhắn dịch
                interaction.editReply({ embeds: [embedGocTV, embedDichTV] });
            } catch (err) {
                console.error('Lỗi:', err);
                interaction.editReply({ content: `Đã xảy ra lỗi khi dịch tin nhắn.` });
            }
        }
    }
};
