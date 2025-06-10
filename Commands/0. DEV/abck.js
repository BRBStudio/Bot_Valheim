// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('abck')
//         .setDescription(
//             `🔹 Xem danh sách các lệnh đã đăng ký toàn cục và trên máy\n` +
//             `       chủ này`
//         ),
//     async execute(interaction) {
//         try {
//             // // Lấy danh sách lệnh toàn cục
//             // const globalCommands = await interaction.client.application.commands.fetch();
//             // const globalCommandList = globalCommands.map(cmd => `${cmd.name} (ID: ${cmd.id})`);

//             // Lấy danh sách lệnh của máy chủ hiện tại
//             const guildCommands = await interaction.guild.commands.fetch();
//             const guildCommandList = guildCommands.map(cmd => `${cmd.name} (ID: ${cmd.id})`);

//             // Tạo nội dung phản hồi
//             const response = [

//                 '**Lệnh trên máy chủ này:**',
//                 guildCommandList.length ? guildCommandList.join('\n') : 'Không có lệnh nào'
//             ].join('\n');

//             await interaction.reply({ content: response, ephemeral: true });
//         } catch (error) {
//             console.error(error);
//             await interaction.reply({ content: 'Đã xảy ra lỗi khi lấy danh sách lệnh.', ephemeral: true });
//         }
//     }
// };


