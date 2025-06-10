// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {
//         console.log(`${client.user.tag} đã sẵn sàng!`);

//         // Xóa lệnh trong các guild cụ thể
//         const guildIds = [
//             '1319809040032989275',
//             '1312185401347407902',
//             '1319947820991774753',
//             '1262054487040720927',
//             '1028540923249958912'
//         ];

//         for (const guildId of guildIds) {
//             try {
//                 const guild = client.guilds.cache.get(guildId);
//                 if (guild) {
//                     const guildCommands = await guild.commands.fetch();
//                     const commandToDelete = guildCommands.find(cmd => cmd.name === 'rank_m');
//                     if (commandToDelete) {
//                         await guild.commands.delete(commandToDelete.id);
//                         console.log(`Đã xóa lệnh /rank_m trong guild ${guildId}`);
//                     } else {
//                         console.log(`Không tìm thấy lệnh /rank_m trong guild ${guildId}`);
//                     }
//                 } else {
//                     console.log(`Bot không có trong guild ${guildId}`);
//                 }
//             } catch (error) {
//                 console.error(`Lỗi khi xóa lệnh trong guild ${guildId}:`, error);
//             }
//         }

//         client.destroy(); // Đóng bot sau khi hoàn thành
//     }
// };
