const { SlashCommandBuilder } = require("discord.js");
const { rowHi } = require("../../ButtonPlace/ActionRowBuilder");
const { createHiEmbed } = require(`../../Embeds/embedsCreate`);
const { checkAdministrator } = require(`../../permissionCheck`);
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hi")
        .setDescription("🔹 Đây là tin nhắn chào mừng."),
    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/hi' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        // Trì hoãn phản hồi
        await interaction.deferReply({ ephemeral: false });

        const embed = createHiEmbed(interaction);

        const row = rowHi(interaction);

        // Gửi tin nhắn với hoặc không có nút
        if (row) {
            await interaction.channel.send({ embeds: [embed], components: [row] });
        } else {
            await interaction.channel.send({ embeds: [embed] });
        }

        // Xóa phản hồi đã bị trì hoãn
        await interaction.deleteReply();
    },
};
