// // building + event
// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const config = require('../../config');
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('qq') // Tên lệnh chính
//         .setDescription('🔹 Các lệnh liên quan đến công trình và sự kiện.')
        
//         // Nhóm lệnh 1 - Building (từ a.js)
//         .addSubcommandGroup(group =>
//             group
//                 .setName('building')
//                 .setDescription('🔹 Công trình xây dựng tham khảo và hướng dẫn.')
//                 .addSubcommand(subcommand =>
//                     subcommand
//                         .setName('select')
//                         .setDescription('Chọn công trình bạn muốn tham khảo hoặc xem hướng dẫn.')
//                         .addStringOption(option =>
//                             option.setName('valheim')
//                                 .setDescription('Chọn công trình bạn muốn tham khảo hoặc xem hướng dẫn.')
//                                 .addChoices(
//                                     { name: `• Nhà thời trung cổ`, value: `https://www.youtube.com/watch?v=k4Zaq1Lm1QI` },
//                                     { name: `• 3 ngôi nhà dễ xây dựng`, value: `https://www.youtube.com/watch?v=zGisnSqe53U` },
//                                     { name: `• Ngôi nhà thợ rèn`, value: `https://www.youtube.com/watch?v=f4HFFcrCL3w` },
//                                     { name: `• Biệt Thự Hiện Đại (Có Hồ Bơi)`, value: `https://www.youtube.com/watch?v=GDG_-A--jGU&t=2s` },
//                                     { name: `• 10 bản dựng yêu thích nhất mọi thời đại của tôi`, value: `https://www.youtube.com/watch?v=XECVzH7tG9s` },
//                                     { name: `• Căn cứ sông tuyệt đẹp ở Valheim`, value: `https://www.youtube.com/watch?v=CzVFETBc0lM` },
//                                     { name: `• Thiết kế thông minh và thực tế`, value: `https://www.youtube.com/watch?v=Dac1oWr_9dQ` },
//                                     { name: `• Xây dựng ngôi nhà khởi đầu trong 20 phút`, value: `https://www.youtube.com/watch?v=5uItb0K1iEs` },
//                                     { name: `• Cuộc thi xây nhà trên trời`, value: `https://www.youtube.com/watch?v=WOhzWUjAdlw` },
//                                     { name: `• Cuộc hành trình của Valheim Survival`, value: `https://www.youtube.com/watch?v=mJ25X8BKP4Y&t=9795s` },
//                                     { name: `• Xây dựng nhà Hobbit dưới lòng đất`, value: `https://www.youtube.com/watch?v=Qqsz7D2gfik` },
//                                     { name: `• Căn cứ khởi đầu Homestead`, value: `https://www.youtube.com/watch?v=5Z6HUmKnE7I` },
//                                     { name: `• Cách xây dựng căn cứ tiền đồn tối thượng`, value: `https://www.youtube.com/watch?v=5eeJbXSQnDE` },
//                                     { name: `• Nhà theo phong cách Tudor (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=-lCapQm2HtI&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0` },
//                                     { name: `• Chuồng ngựa Ashwood - Lox Pen (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=zRpMuxH9WSQ&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=6` },
//                                     { name: `• Cách xây dựng lâu đài - Pháo đài Meadows (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=zg_zthS3Qy8&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=16` },
//                                     { name: `• Cách xây dựng trang trại nuôi ong - Xây dựng trại nuôi ong - (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=iB9fBygaL7g&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=19` },
//                                     { name: `• Cách xây dựng bến tàu nhỏ - Cảng Seawall - (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=HqbiOl6QITU&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=31` },
//                                     { name: `• Xây dựng một căn cứ đồng bằng treo`, value: `https://www.youtube.com/watch?v=z3R4WZ0AG8Y` },
//                                     { name: `• Xây dựng1`, value: `https://www.youtube.com/watch?v=Mn0iuUWc5cQ` },
//                                     { name: `• Làng Valheim`, value: `https://www.youtube.com/watch?v=bPzFaaWOikA` },
//                                     { name: `• Tòa nhà bên hồ tuyệt đẹp`, value: `https://www.youtube.com/watch?v=3csU1HTCNEc` }
//                                 )
//                                 .setRequired(true)
//                         )
//                 )
//         )

//         // Nhóm lệnh 2 - Event (từ b.js)
//         .addSubcommandGroup(group =>
//             group
//                 .setName('event')
//                 .setDescription('🔹 Tìm kiếm ý tưởng trò chơi bạn muốn!')
//                 .addSubcommand(subcommand =>
//                     subcommand
//                         .setName('create')
//                         .setDescription('Tạo sự kiện tìm kiếm ý tưởng.')
//                         .addIntegerOption(op =>
//                             op.setName('people')
//                                 .setDescription('Bạn cần bao nhiêu người cho ý tưởng này.')
//                                 .setRequired(true)
//                         )
//                         .addStringOption(op =>
//                             op.setName('building')
//                                 .setDescription('Đưa ra yêu cầu về ý tưởng bạn muốn?')
//                                 .setRequired(true)
//                         )
//                         .addIntegerOption(op =>
//                             op.setName('minute')
//                                 .setDescription('Bạn muốn kết thúc việc tìm ý tưởng này khi nào? Tính theo phút.')
//                                 .setRequired(true)
//                         )
//                         .addRoleOption(op =>
//                             op.setName('role')
//                                 .setDescription('Chọn vai trò bạn muốn tag để việc tìm kiếm nhanh hơn')
//                                 .setRequired(true)
//                         )
//                 )
//         ),
        

//         guildSpecific: true,
// 		guildId: `1319809040032989275`, // Máy chủ Emoji Command Bot

//     async execute(interaction, client) {
//         const subcommandGroup = interaction.options.getSubcommandGroup();
//         const subcommand = interaction.options.getSubcommand();

//         // Nhóm Building
//         if (subcommandGroup === 'building') {
//             if (subcommand === 'select') {
//                 // Kiểm tra trạng thái của lệnh
//                 const commandStatus = await CommandStatus.findOne({ command: '/building' });

//                 if (commandStatus && commandStatus.status === 'off') {
//                     return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//                 }

//                 const audioURL = await interaction.options.getString('valheim');

//                 // Định nghĩa ánh xạ giữa giá trị và tên
//                 const choicesMap = {
//                     // Map các URL đến tên
//                     'https://www.youtube.com/watch?v=k4Zaq1Lm1QI': 'Nhà thời trung cổ',
//                     'https://www.youtube.com/watch?v=zGisnSqe53U': '3 ngôi nhà dễ xây dựng',
//                     'https://www.youtube.com/watch?v=f4HFFcrCL3w': 'Ngôi nhà thợ rèn',
//                     // Add các lựa chọn khác ở đây
//                 };

//                 const selectedName = choicesMap[audioURL];

//                 // Mảng các câu chúc và emoji (giống như ở mã a.js)
//                 const greetings = ["Chúc bạn tìm được công trình mong muốn!", "Hy vọng bạn thích công trình này!"];
//                 const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
//                 const embed = new EmbedBuilder()
//                     .setColor(config.embedCyan)
//                     .setDescription(`**\`Tên công trình:\`\n\`\`\`yml\n${selectedName}\`\`\`**\n\n<a:hanyaCheer:1173363092353200158> | [**Hãy click vào đây để xem công trình**](${audioURL})\n\n**${randomGreeting}**`)
//                     .setThumbnail('https://media.tenor.com/aMRKq2mclCAAAAAM/valheim-cool.gif')
//                     .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
//                     .setTimestamp();

//                 interaction.reply({ embeds: [embed] });
//             }
//         }

//         // Nhóm Event
//         if (subcommandGroup === 'event') {
//             if (subcommand === 'create') {
//                 const numOfPeople = interaction.options.getInteger('people');
//                 const building = interaction.options.getString('building');
//                 const minute = interaction.options.getInteger('minute');
//                 const role = interaction.options.getRole('role');

//                 await interaction.deferReply();
//                 await interaction.deleteReply();

//                 const author = interaction.guild.members.cache.get(interaction.user.id)?.displayName || interaction.user.username;

//                 await interaction.channel.send(`${role} ơi! ***${author}*** đang tìm kiếm ${numOfPeople} người lên ý tưởng ***${building}*** cho ***BRB STUDIO Survival***. Bài nộp kết thúc sau ***${minute}*** phút.`);
//             }
//         }
//     }
// };
