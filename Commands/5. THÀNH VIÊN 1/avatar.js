const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Xem hình đại diện của thành viên")
        .addUserOption(option => 
            option.setName('member')
                .setDescription('Thành viên bạn muốn xem')
                .setRequired(false)
        ),

    async execute(interaction) {
        const member = interaction.options.getUser('member') || interaction.user;
        const avatarUrl = member.displayAvatarURL({ extension: 'webp', size: 1024 });

        try {
            // Tải ảnh về
            const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
            const webpBuffer = Buffer.from(response.data);

            // Chuyển đổi sang JPG
            const jpgBuffer = await sharp(webpBuffer).jpeg().toBuffer();

            // Lưu tạm file JPG
            const filePath = path.join(__dirname, `avatar_${member.id}.jpg`);
            fs.writeFileSync(filePath, jpgBuffer);

            // Tạo attachment
            const attachment = new AttachmentBuilder(filePath, { name: 'avatar.jpg' });

            const embed = new EmbedBuilder()
                .setTitle(`Ảnh đại diện của @${member.username}`)
                .setImage('attachment://avatar.jpg')
                .setColor('#2f82ee')
                .setFooter({ text: "Nhấn vào ảnh để tải xuống." });

            await interaction.reply({ embeds: [embed], files: [attachment] });

            // Xóa file sau khi gửi (tránh đầy bộ nhớ)
            setTimeout(() => {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }, 5000);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Không thể tải ảnh đại diện.', ephemeral: true });
        }
    },
};

