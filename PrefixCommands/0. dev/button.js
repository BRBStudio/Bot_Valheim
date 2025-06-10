const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

/*
liệt kê danh sách các nút
*/

module.exports = {
    name: 'button',
    description: '\`🔸 LỆNH DÀNH CHO DEV\`',
    hd: `\`🔸 Cách dùng: Không có thông tin\``,
    q: `\`🔸 Dành cho DEV\``,
    aliases: ['bt', 'dev2'],

    async execute(msg) {
        
        if (!config.specialUsers.includes(msg.author.id)) { 
            return msg.channel.send("Bạn không có quyền sử dụng lệnh này!"); 
        }

        try {
            const buttonsDir = path.join(__dirname, '../../InteractionTypes/Buttons');
            const buttonFiles = fs.readdirSync(buttonsDir).filter(file => file.endsWith('.js'));

            let descriptions = [];
            let maxIdLength = 0;

            // Đếm tổng số nút
            const totalButtons = buttonFiles.length;

            // Xác định độ dài lớn nhất của ID
            for (const file of buttonFiles) {
                const button = require(path.join(buttonsDir, file));
                if (button.id && button.description) {
                    maxIdLength = Math.max(maxIdLength, button.id.length);
                }
            }

            const header = `        ID${' '.repeat(maxIdLength - 2)}    Mô tả`;
            
            // Thêm dòng tiêu đề vào descriptions
            for (const file of buttonFiles) {
                const button = require(path.join(buttonsDir, file));
                if (button.id && button.description) {
                    const idPadded = `• ${button.id.padEnd(maxIdLength, ' ')}  • `;
                    const descriptionWrapped = wrapText(button.description, 130 - idPadded.length, ' '.repeat(idPadded.length));
                    descriptions.push(idPadded + descriptionWrapped);
                }
            }

            // Chia các đoạn thành các trang, kèm theo tiêu đề ở mỗi trang
            const chunks = splitIntoChunksWithHeader(descriptions.join('\n'), 1800, header);
            let currentPage = 0;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('◀️ Trước')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('▶️ Tiếp')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(currentPage === chunks.length - 1)
                );

            // Đếm số nút trong trang hiện tại
            const currentChunkLines = chunks[currentPage].split('\n').slice(1); // Bỏ qua dòng tiêu đề
            const buttonCountOnPage = currentChunkLines.filter(line => line.startsWith('•')).length; // Đếm các dòng bắt đầu bằng '•'

            const message = await msg.channel.send({
                content: 
                `**Xử lý nút - Trang ${currentPage + 1}/${chunks.length}**\n\`\`\`${chunks[currentPage]}\n` +
                `                                                   🧮 Số nút trong trang ${currentPage + 1}: ${buttonCountOnPage}\n` +
                `                                                   🧮 Tổng số nút: ${totalButtons}\`\`\``,
                components: [row] 
            });

            // Kiểm tra nếu tin nhắn bị xóa
            msg.channel.messages.fetch(message.id).catch(() => {
                collector.stop(); // Dừng collector nếu tin nhắn bị xóa
            });

            const collector = message.createMessageComponentCollector({ time: 18000000 });

            collector.on('collect', async interaction => {
                if (interaction.user.id !== msg.author.id) return;

                if (interaction.customId === 'prev' && currentPage > 0) currentPage--;
                else if (interaction.customId === 'next' && currentPage < chunks.length - 1) currentPage++;

                // Đếm lại số nút trên trang mới
                const updatedChunkLines = chunks[currentPage].split('\n').slice(1);
                const updatedButtonCountOnPage = updatedChunkLines.filter(line => line.startsWith('•')).length;

                msg.channel.messages.fetch(message.id).then(() => {
                    interaction.update({
                        content: 
                        `**Xử lý nút - Trang ${currentPage + 1}/${chunks.length}**\n\`\`\`${chunks[currentPage]}\n` +
                        `                                                   🧮 Số nút trong trang ${currentPage + 1}: ${updatedButtonCountOnPage}\n` +
                        `                                                   🧮 Tổng số nút: ${totalButtons}\`\`\``,   
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('prev')
                                        .setLabel('◀️ Trước')
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(currentPage === 0),
                                    new ButtonBuilder()
                                        .setCustomId('next')
                                        .setLabel('▶️ Tiếp')
                                        .setStyle(ButtonStyle.Danger)
                                        .setDisabled(currentPage === chunks.length - 1)
                                )
                        ]
                    });
                }).catch(() => {
                    collector.stop();
                });
            });

            collector.on('end', () => {
                message.edit({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.error(error);
            await msg.channel.send('Đã xảy ra lỗi khi thực hiện lệnh. Vui lòng thử lại!');
        }
    }
};

// Hàm định dạng và ngắt dòng
function wrapText(text, lineLength, indent = '') {
    const words = text.split(' ');
    let currentLine = '';
    let result = '';
    
    words.forEach(word => {
        if ((currentLine + word).length > lineLength) {
            result += currentLine.trim() + '\n' + indent;
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });
    
    result += currentLine.trim();
    return result;
}

// Hàm chia nội dung thành các đoạn nhỏ kèm tiêu đề để tránh lỗi vượt quá 2000 ký tự
function splitIntoChunksWithHeader(text, maxLength, header) {
    const chunks = [];
    let chunk = header + '\n'; // Thêm tiêu đề vào mỗi trang

    text.split('\n').forEach(line => {
        if ((chunk + line).length > maxLength) {
            chunks.push(chunk);
            chunk = header + '\n'; // Khởi tạo lại trang mới với tiêu đề
        }
        chunk += line + '\n';
    });

    if (chunk) chunks.push(chunk);
    return chunks;
}

