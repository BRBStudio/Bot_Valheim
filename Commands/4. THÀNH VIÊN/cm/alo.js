const { SlashCommandSubcommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('alo') 
        .setDescription('🔹 Định dạng lệnh mới ( không phải lệnh / và ? )'),
        gs: true,
        g: [`1319809040032989275`],
        
        async execute(interaction, client) {
            interaction.reply(`asc`)
        }
}