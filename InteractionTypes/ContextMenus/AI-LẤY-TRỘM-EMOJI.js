const { ApplicationCommandType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const sharp = require('sharp');
const config = require(`../../config`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: {
        name: 'AI LẤY TRỘM EMOJI',
        type: ApplicationCommandType.Message,
    },
    async execute(interaction, msg) {
        if (!interaction.isMessageContextMenuCommand()) return;

        // Kiểm tra trạng thái của ngữ cảnh
        const commandStatus = await CommandStatus.findOne({ command: 'AI LẤY TRỘM EMOJI' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện ngữ cảnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
        }

        if (interaction.commandName === 'AI LẤY TRỘM EMOJI') { // Sửa điều kiện lệnh đúng
            
            // Kiểm tra quyền của thành viên
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                // console.log('Quyền truy cập bị từ chối');
                return interaction.reply({ content: 'Bạn phải là Quản trị viên và vai trò của bạn phải có quyền **Quản trị viên** để thực hiện hành động này.', ephemeral: true });
            }

            const targetMessage = interaction.targetMessage;
            // console.log('Đang xử lý tin nhắn:', targetMessage);

            try {
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const attachmentUrl = targetMessage.attachments.size > 0 ? targetMessage.attachments.first().url : targetMessage.content.match(urlRegex);

                if (!targetMessage || (!attachmentUrl && !targetMessage.content.match(/<:[^:]+:(\d+)>|<a:[^:]+:(\d+)>/))) {
                    // console.log('Tin nhắn không chứa hình ảnh hoặc emoji');
                    return interaction.reply({ content: '🆘 Tin nhắn này không chứa hình ảnh hoặc biểu tượng cảm xúc, emoji mặc định sẽ không được lấy.', ephemeral: true });
                }

                if (attachmentUrl) {
                    const imageUrl = Array.isArray(attachmentUrl) ? attachmentUrl[0] : attachmentUrl;
                    // console.log('URL hình ảnh từ đính kèm:', imageUrl);
                    return createEmoji(interaction, imageUrl);
                } else {
                    const content = targetMessage.content;
                    const emojiMatch = content.match(/<:[^:]+:(\d+)>|<a:[^:]+:(\d+)>/);

                    if (emojiMatch) {
                        const id = emojiMatch[1] || emojiMatch[2]; // Lấy ID emoji
                        const isAnimated = content.includes('<a:'); // Kiểm tra nếu là emoji động
                        let type = isAnimated ? 'gif' : 'png';

                        const emojiUrl = `https://cdn.discordapp.com/emojis/${id}.${type}?v=1`;
                        // console.log('URL emoji:', emojiUrl);

                        return createEmoji(interaction, emojiUrl, isAnimated);
                    } else {
                        return interaction.reply({ content: '🆘 Tin nhắn này không chứa biểu tượng cảm xúc hợp lệ.', ephemeral: true });
                    }
                }
            } catch (err) {
                console.error(err);
                if (interaction) {
                    return interaction.reply({ content: 'Đã xảy ra lỗi khi xử lý lệnh.', ephemeral: true });
                }
            }
        }

        async function createEmoji(interaction, imageUrl, isAnimated) {
            try {
                // console.log('Tạo emoji với URL:', imageUrl, 'và loại:', isAnimated ? 'animated' : 'static');
                const guild = interaction.guild;
        
                if (!guild) {
                    // console.log('Không thể xác định máy chủ.');
                    return interaction.reply({ content: 'Không thể xác định máy chủ.', ephemeral: true });
                }
        
                // Đăng nhập thông tin bang hội để gỡ lỗi
                // console.log(`Guild ID: ${guild.id}, Name: ${guild.name}`);
        
                // Lấy số lượng biểu tượng cảm xúc hiện tại và giới hạn biểu tượng cảm xúc của bang hội
                const emojiCount = interaction.guild.emojis.cache.size;
                const animatedEmojiCount = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size;
                const staticEmojiCount = emojiCount - animatedEmojiCount;
        
                const emojiLimit = interaction.guild.premiumTier * 25 + 50; // Tính giới hạn biểu tượng cảm xúc dựa trên mức tăng của bang hội
                const animatedEmojiLimit = interaction.guild.premiumTier * 25 + 50; // Giới hạn cho emoji động
        
                // console.log('Số lượng emoji hiện tại:', emojiCount, 'Animated:', animatedEmojiCount, 'Static:', staticEmojiCount);
                // console.log('Giới hạn emoji:', emojiLimit, 'Animated limit:', animatedEmojiLimit);


                // Kiểm tra xem bang hội đã đạt đến giới hạn biểu tượng cảm xúc chưa
                if (isAnimated && animatedEmojiCount >= animatedEmojiLimit) {
                    // console.log('Đã đạt đến giới hạn emoji động.');
                    return interaction.reply({ content: '🆘 Emoji động của bạn đã full, bạn không thể thêm emoji động vào nữa.', ephemeral: true });
                }
        
                if (!isAnimated && staticEmojiCount >= emojiLimit) {
                    // console.log('Đã đạt đến giới hạn emoji tĩnh.');
                    return interaction.reply({ content: '🆘 Emoji tĩnh của bạn đã full, bạn không thể thêm emoji tĩnh vào nữa.', ephemeral: true });
                }
        
                // Lấy hình ảnh từ URL
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' }); // Lấy hình ảnh dưới dạng ArrayBuffer
        
                if (!response || !response.data) {
                    throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
                }
        
                const imageBuffer = Buffer.from(response.data); // Chuyển ArrayBuffer thành Buffer
        
                // Kiểm tra xem hình ảnh có vượt quá giới hạn 256KB của Discord dành cho biểu tượng cảm xúc hay không
                if (imageBuffer.byteLength > 256 * 1024) { // Discord giới hạn 256KB cho emoji
                    // console.log("Kích thước hình ảnh vượt quá giới hạn. Đang nén...");
                    const compressedImageBuffer = await sharp(imageBuffer).resize(128, 128).toBuffer(); // Sử dụng sharp để nén ảnh
                    return uploadEmoji(interaction, compressedImageBuffer);
                } else {
                    return uploadEmoji(interaction, imageBuffer);
                }
            } catch (err) {
                console.error('Lỗi khi tạo emoji:', err);
                if (interaction) {
                    return interaction.reply({ content: 'Đã xảy ra lỗi khi tạo biểu tượng cảm xúc.', ephemeral: true });
                }
            }
        }
        
        async function uploadEmoji(interaction, imageBuffer) {
            try {
                if (!interaction.guild) {
                    throw new Error('Interaction does not contain guild information.');
                }
        
                const emojiName = generateRandomName(); // Tạo tên emoji ngẫu nhiên
                const createdEmoji = await interaction.guild.emojis.create({ attachment: imageBuffer, name: emojiName });
        
                const embed = new EmbedBuilder()
                    .setColor(config.embedBlue)
                    .setDescription(`Đã thêm ${createdEmoji}, được đặt tên là ${createdEmoji.name}`);
        
                return interaction.reply({ embeds: [embed] });
            } catch (err) {
                // Bắt và xử lý lỗi một cách nhẹ nhàng, không in ra console
                if (err.code === 30018) {
                    return interaction.reply({ content: '🆘 Emoji động của bạn đã full, bạn không thể thêm emoji động vào nữa.', ephemeral: true });
                } else if (err.code === 30008) {
                    return interaction.reply({ content: '🆘 Emoji tĩnh của bạn đã full, bạn không thể thêm emoji tĩnh vào nữa.', ephemeral: true });
                } else {
                    console.error('Lỗi khi tải lên emoji:', err); // Bắt lỗi không mong muốn khác
                    return interaction.reply({ content: 'Đã xảy ra lỗi khi tải lên biểu tượng cảm xúc.', ephemeral: true });
                }
            }
        }
        
        function generateRandomName() {
            // Tạo một chuỗi ngẫu nhiên để sử dụng làm tên emoji
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
            const length = 10;
            let randomName = '';
            for (let i = 0; i < length; i++) {
                randomName += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return randomName;
        }
    }
};