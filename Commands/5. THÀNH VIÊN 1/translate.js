const { SlashCommandBuilder, ActionRowBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { translate_tiengviet, translate_tienganh, translate_cancel } = require('../../ButtonPlace/ButtonBuilder');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('🔹 Dịch ngôn ngữ.'),
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/translate' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const actionRow = new ActionRowBuilder().addComponents(translate_tiengviet, translate_tienganh, translate_cancel);

        const time = new EmbedBuilder()
                        .setColor(`Green`)
                        .setTitle("<a:translate:1335358840790581280> Chọn ngôn ngữ bạn muốn dịch!")
                        .setTimestamp()
                        .setFooter({ text: `Chúc bạn 1 ngày tốt lành tại ***${interaction.guild.name}***` });

        if (!interaction.deferred && !interaction.replied) {
            await interaction.reply({
                // content: '🌐 Chọn ngôn ngữ bạn muốn dịch!',
                components: [actionRow],
                embeds: [time],
                ephemeral: true
            });
        }
    },
};