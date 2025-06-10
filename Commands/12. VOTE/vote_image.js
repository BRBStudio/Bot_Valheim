const { SlashCommandBuilder } = require('discord.js');
const { voteButtons } = require('../../ButtonPlace/ActionRowBuilder');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote_image')
        .setDescription('🔹 Voted cho hình ảnh hoặc bài viết.')
        .addSubcommand(subcommand =>
          subcommand
            .setName('image')
            .setDescription('Vote hình ảnh.')
            .addAttachmentOption(option => option.setName('image').setDescription('🔹 Hình ảnh cần đánh giá.').setRequired(true)) // image-attachment
        ),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/vote_image' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Kiểm tra xem interaction có tồn tại không
        if (!interaction || interaction.replied || interaction.deferred) {
            console.error("Interaction không tồn tại hoặc đã được xử lý.");
            return;
        }

        const { options } = interaction;

            if (options.getSubcommand() === 'image') {
                const imageAttachment = options.getAttachment('image'); // image-attachment

                if (!imageAttachment) {
                    return await interaction.reply('Không có hình ảnh được đính kèm!');
                }

        const imageAttachmentURL = imageAttachment.url;
      
            try {
                await interaction.deferReply();
                
                    const m = await interaction.editReply({
                        content: 'Hãy bình chọn cho hình ảnh bên dưới:',
                        files: [imageAttachmentURL],
                        components: [voteButtons],
                    });
          
            // Thêm xử lý đếm phiếu ở đây nếu cần
            } catch (err) {
                console.error('Lỗi gửi thông báo từ chối chưa được xử lý tới hội nhà phát triển', err);
            }
        }
    },
};

// // .addFields(
//     { name: `Đây là mã QR`, value: imageAttachmentURL, inline: true }
// )