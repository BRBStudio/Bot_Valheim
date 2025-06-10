const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createIdEmbed } = require(`../../Embeds/embedsCreate`);

const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription('🔹 ID người dùng')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Chọn người dùng để lấy ID của họ')),
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/id' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }


        // Lấy người dùng được chọn từ tùy chọn (nếu có), nếu không thì lấy người gửi lệnh
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = createIdEmbed(user)
        
        await interaction.deferReply();
        await interaction.deleteReply();

        await interaction.channel.send({ embeds: [embed] });
    },
};