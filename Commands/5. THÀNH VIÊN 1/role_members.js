const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js");
const { finalEmbed } = require(`../../Embeds/embedsDEV`)
const CommandStatus = require('../../schemas/Command_Status');
  
module.exports = {
    data: new SlashCommandBuilder()
      .setName("role_members")
      .setDescription("🔹 Xem tất cả người dùng có vai trò"),
  
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/role_members' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const row1 = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
            .setCustomId("roles")
            .setPlaceholder("Chọn 1 - 10 vai trò...")
            .setMinValues(1)
            .setMaxValues(10)
        );

        interaction.reply({
            embeds: [finalEmbed],
            components: [row1],
            ephemeral: true,
        });
    },
};