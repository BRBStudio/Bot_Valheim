const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomquestionembed } = require(`../../Embeds/embedsDEV`)
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');
const config = require(`../../config`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('random_question')
    .setDescription('🔹 Gửi một câu hỏi ngẫu nhiên trong kênh hiện tại')
    .addRoleOption(option => option.setName('ping-role').setDescription('chọn vai trò cần ping')),
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/random_question' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const removeSetting = interaction.options.getBoolean("remove");

        const QBD = config.specialUsers.includes(interaction.user.id);
        
        // Nếu không phải người dùng đặc biệt thì kiểm tra quyền admin
        if (!QBD) {
            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;
        }
        
        const pingrole = interaction.options.getRole('ping-role') || `Gửi lời chúc tới mn nha`;

        await interaction.deferReply();
        await interaction.deleteReply()

        const msg = await interaction.channel.send({ content: `${pingrole}`, embeds: [randomquestionembed] })
        msg.react('✅')
        msg.react('❌')
    }
}