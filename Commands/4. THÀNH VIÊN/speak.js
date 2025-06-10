const { SlashCommandBuilder } = require('discord.js');
const voiceQueue = require('../../queue');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('🔹 Chuyển đổi văn bản thành giọng nói')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Tin nhắn cần chuyển đổi văn bản thành giọng nói')
                .setRequired(true)),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/speak' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const text = interaction.options.getString('text');
        const user = interaction.user.displayName
        const channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply('Bạn cần tham gia một kênh thoại để sử dụng lệnh này!');
            return;
        }

        await interaction.deferReply();

        // Đưa yêu cầu đọc vào hàng đợi
        voiceQueue.addToQueue({ text: `${user} đã nói ${text}`, channel: channel, type: 'speak' });

        await interaction.editReply(`${text}`);
        // await interaction.deleteReply();
    },
};
