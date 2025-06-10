const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const config = require(`../../config`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: {
        name: 'AI TIẾNG ANH',
        type: ApplicationCommandType.Message,
    },
    async execute(interaction, msg) {
        if (!interaction.isMessageContextMenuCommand()) return;

        
        // Kiểm tra trạng thái của ngữ cảnh
        const commandStatus = await CommandStatus.findOne({ command: 'AI TIẾNG ANH' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện ngữ cảnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
        }

        if (interaction.commandName === 'AI TIẾNG ANH') { // Sửa điều kiện lệnh đúng
            
            //sử dụng để lấy nội dung tin nhắn mà người dùng đã chọn để dịch.
            const targetMessage = interaction.targetMessage;

            // Kiểm tra xem targetMessage có tồn tại và có nội dung không \\ if (!targetMessage || !targetMessage.content || !/\w/.test(targetMessage.content))
            if (!targetMessage || !targetMessage.content.trim()) {
                return interaction.reply({ content: `🆘 Đây không phải chữ hoặc tin nhắn không có nội dung, vui lòng chọn nội dung có tin nhắn bằng chữ để sử dụng AI.`, ephemeral: true });
            }

            // Lấy nội dung tin nhắn gốc
            const content = targetMessage.content;

            try {
                // Phát hiện ngôn ngữ gốc của tin nhắn
                const detection = await translate(content, { to: 'en' });
                const lang = detection.from.language.iso

                // Nếu ngôn ngữ gốc là tiếng Anh, không cần dịch
                if (lang === 'en') {
                    return interaction.reply({ content: `Tin nhắn đã là tiếng Anh, không cần dịch.`, ephemeral: true });
                }

                // Nếu ngôn ngữ không phải tiếng Anh, tiến hành dịch
                const translation = await translate(content, { to: 'en' });

                // Tính toán giới hạn an toàn cho cả hai embed
                const maxTotal = 6000;
                const titleAndExtras = 500; // Phần tiêu đề, thumbnail, footer
                const available = maxTotal - titleAndExtras;
                const half = Math.floor(available / 2);

                const originalContent = content.length > half
                    ? content.slice(0, half - 3) + '...'
                    : content;

                const translatedContent = translation.text.length > half
                    ? translation.text.slice(0, half - 3) + '...'
                    : translation.text;

                const embedGocTA = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nTin nhắn gốc:`)
                    .setColor(config.embedDarkOrange)
                    .setDescription(`\`\`\`yml\n${originalContent}\`\`\``) // ${content}
                    .setThumbnail(`https://i.imgur.com/dZsQfqP.gif`)
                    .setFooter({ text: `⏰` })
                    .setTimestamp();

                const embedDichTA = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nDịch tin nhắn:`)
                    .setColor(config.embedDarkGreen)
                    .setDescription(`\`\`\`yml\n${translatedContent}\`\`\``) // ${translation.text}
                    .setThumbnail(`https://i.imgur.com/dZsQfqP.gif`)
                    .setFooter({ text: `⏰` })
                    .setTimestamp();

                // Hiển thị tin nhắn gốc và tin nhắn dịch
                interaction.reply({ embeds: [embedGocTA, embedDichTA], ephemeral: true });

            } catch (err) {
                console.error('Lỗi khi dịch:', err);
                interaction.reply({ content: `Đã xảy ra lỗi khi dịch tin nhắn.`, ephemeral: true });
            }
        }
    }
};