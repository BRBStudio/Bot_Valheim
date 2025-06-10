const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('abc')
        .setDescription('Kiểm tra danh sách các lệnh đã đăng ký (toàn cục và theo máy chủ)'),

        guildSpecific: true,
        guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`],

    async execute(interaction) {
        const client = interaction.client;

        try {
            // Lấy danh sách các lệnh toàn cục
            const globalCommands = await client.application.commands.fetch();
            
            // Lấy danh sách các lệnh theo guild
            const guildCommands = await interaction.guild.commands.fetch();
            
            // Xử lý danh sách lệnh toàn cục
            const globalCommandList = globalCommands.map(cmd => `- ${cmd.name}`).join('\n') || 'Không có lệnh toàn cục nào.';

            // Xử lý danh sách lệnh theo guild
            const guildCommandList = guildCommands.map(cmd => `- ${cmd.name}`).join('\n') || 'Không có lệnh nào trong guild.';
            // Gửi phản hồi về cho người dùng
            await interaction.reply({
                content: `**Danh sách các lệnh đã đăng ký:**\n\n**Máy chủ:**\n${guildCommandList}`,
                ephemeral: true, // Chỉ bạn nhìn thấy
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách lệnh:', error);
            await interaction.reply({
                content: 'Đã xảy ra lỗi khi kiểm tra danh sách các lệnh.',
                ephemeral: true,
            });
        }
    },
};
