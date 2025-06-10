const { ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder } = require('discord.js');
// const CustomCaptcha = require('../../schemas/customCaptchaSchema');
const { VerifyUsers, Captcha } = require('../../schemas/defaultCaptchaSchema');

module.exports = {
    id: 'opencode',
    description: 'Nút này mở một modal để người dùng nhập mã CAPTCHA của họ & hiển thị mã CAPTCHA nếu còn hiệu lực.',
    async execute(interaction) {

    // const captchaRecord = await CustomCaptcha.findOne({ userId: interaction.user.id });

    const serverId = interaction.guild.id;
        const userId = interaction.user.id;

    // Tìm bản ghi CAPTCHA cho người dùng và máy chủ hiện tại
    const captchaRecord = await Captcha.findOne({
        Guild: serverId, // Lấy ID máy chủ
        User: userId,     // Lấy ID người dùng
        completed: false,
    });

        // Kiểm tra xem có bản ghi CAPTCHA không
        if (!captchaRecord) {
            // Nếu không tìm thấy, phản hồi tin nhắn cho người dùng
            return interaction.reply({
                content: 'Mã này không tồn tại hoặc đã bị xóa khỏi dữ liệu.',
                ephemeral: true // Tin nhắn chỉ hiển thị cho người dùng đã tương tác
            });
        }

    // Khi người dùng nhấn nút 'opencode', mở modal
    const vermodal = new ModalBuilder()
        .setTitle(`MÃ CAPTCHA CỦA BẠN: ${captchaRecord.Key}`) // Key captcha
        .setCustomId('vermodal');

    const captchaInput = new TextInputBuilder()
        .setCustomId('captchaInput')
        .setLabel(`Nhập mã CAPTCHA:`)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(captchaInput);

    vermodal.addComponents(actionRow);

    await interaction.showModal(vermodal);
    }
};
