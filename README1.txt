** cách sử dụng git mục này làm theo thứ tự:
        git init
        git remote add origin <link github>
        git add . [lưu thay đổi]
        git commit -m "Initial commit" [để tạo tên commit]
        git push -u origin (master) hoặc (main) [để đẩy lên github mới]



** cách chuyển đổi từ master qua main hoặc người lại
        git branch -m master main [Lệnh này sẽ đổi tên nhánh master hiện tại thành main trong repository cục bộ.]
        git push origin --delete master [sau đó dụng cái này để xóa master/main]
        git push -u origin main [dùng để đẩy nhánh main/marter]
        git pull origin main --rebase [để hợp nhất nhánh main]
        git push -u origin main [Đẩy các thay đổi lên remote]
        git rebase --continue [dùng để Tiếp tục quá trình rebase]
        git status [kiểm tra trạng thái hiện tại]
        git branch --unset-upstream [dùng để xóa upstream cũ]
        git branch -u origin/main [dùng để Thiết lập upstream mới]



** Nếu bạn chưa đẩy nhánh main lên remote trước đó, bạn có thể sử dụng lệnh sau để đẩy nhánh main lên và thiết lập upstream:
        git push -u origin main
        git
        [các để đẩy thay đổi lên github]
        git add . [để lưu thay đổi]
        git commit -m "Mô tả ngắn gọn về thay đổi"
        git push hoặc git <push tên nhánh>
        git pull [để bạn hoặc người thú 2 update code mới được up lên]

        git remote set-url origin https://github.com/BRBStudio/Valheim.git  || cập nhật URL remote repository trong Git để phù hợp với tên mới BRB-Studio.git
        git remote -v                                                       || Sau khi cập nhật, kiểm tra xem remote đã được thay đổi đúng chưa:



** distinct là một phương thức của MongoDB, dùng để truy vấn và trả về các giá trị duy nhất của một trường cụ thể trong cơ sở dữ liệu, ví dụ economySystem.distinct('Guild');


** // Tạo liên kết mời quay lại máy chủ
                                const invite = await i.guild.invites.create(i.channelId, {
                                    maxAge: 0, // Không giới hạn thời gian
                                    maxUses: 1, // Chỉ sử dụng một lần
                                    reason: `Tạo bởi ${i.user.tag} để mời lại ${target.tag}`
                                }); 

                                // Tạo nút quay lại máy chủ
                                const returnButton = new ButtonBuilder()
                                    .setLabel("Quay lại máy chủ")
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(invite.url);

                                const actionRow = new ActionRowBuilder().addComponents(returnButton); nên có mongoDB lưu id người dùng


// const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('ti')
//         .setDescription('Quản lý cấp độ xác minh cho bang hội')
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('level')
//                 .setDescription('Thiết lập cấp độ xác minh cho bang hội')
//                 .addIntegerOption(option =>
//                     option.setName('value')
//                         .setDescription('Chọn mức độ xác minh')
//                         .setRequired(true)
//                         .addChoices(
//                             { name: 'Không có', value: 0 },
//                             { name: 'Thấp', value: 1 },
//                             { name: 'Trung bình', value: 2 },
//                             { name: 'Cao', value: 3 },
//                             { name: 'Rất cao', value: 4 }
//                         ))),

//     async execute(interaction) {
//         const guild = interaction.guild;

//         // Xác định lệnh phụ được gọi
//         const subcommand = interaction.options.getSubcommand();

//         try {
//             // Lấy đối tượng thành viên của bot trong bang hội
//             const botMember = await guild.members.fetch(interaction.client.user.id);

//             // Kiểm tra quyền của bot
//             if (!botMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
//                 await interaction.reply({ content: 'Bot không có quyền Quản lý máy chủ.', ephemeral: true });
//                 return;
//             }

//             if (subcommand === 'level') {
//                 const level = interaction.options.getInteger('value'); // Lấy mức độ xác minh

//                 // Kiểm tra cấp độ xác minh hiện tại của máy chủ
//                 const currentVerificationLevel = guild.verificationLevel;
//                 if (level < currentVerificationLevel) {
//                     await interaction.reply({ content: `Không thể giảm cấp độ xác minh từ mức ${currentVerificationLevel} xuống ${level}.`, ephemeral: true });
//                     return;
//                 }

//                 // Thiết lập cấp độ xác minh cho bang hội theo lựa chọn của người dùng
//                 await guild.setVerificationLevel(level);
//                 await interaction.reply({ content: `Cấp độ xác minh của bang hội đã được đặt lên mức ${level}.`, ephemeral: true });

//             }
//         } catch (error) {
//             console.error('Lỗi khi thực hiện lệnh /ti:', error);

//             // Xử lý lỗi cụ thể về cấp độ xác minh không đủ điều kiện
//             if (error.message.includes('verification_level[GUILD_VERIFICATION_LEVEL_INSUFFICIENT]')) {
//                 await interaction.reply({
//                     content: 'Không thể thiết lập cấp độ xác minh. Máy chủ của bạn không đủ điều kiện để thay đổi cấp độ xác minh này. Vui lòng kiểm tra lại điều kiện của máy chủ.',
//                     ephemeral: true
//                 });
//             } else {
//                 await interaction.reply({ content: 'Đã xảy ra lỗi khi thiết lập cấp độ xác minh.', ephemeral: true });
//             }
//         }
//     },
// };
















// dùng kết hợp với nút veri_kk và dữ liệu mongoDB test_xác_minh_voice

// const {
//     SlashCommandBuilder,
//     EmbedBuilder,
//     ChannelType,
//     ActionRowBuilder,
//     ButtonBuilder,
//     ButtonStyle,
//   } = require("discord.js");
//   const guildsettings = require("../../schemas/test_xác_minh_voice");
  
//   module.exports = {
//     data: new SlashCommandBuilder()
//       .setName("verisay")
//       .setDescription("Đặt hệ thống xác minh")
//       .addChannelOption((channel) => {
//         return channel
//           .setName("channel")
//           .setDescription(`Kênh kích hoạt hệ thống xác minh`)
//           .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
//           .setRequired(true);
//       })
//       .addRoleOption((option) => {
//         return option
//           .setName("role")
//           .setDescription(`vai trò để đưa ra sau khi xác minh`)
//           .setRequired(true);
//       })
//       .addChannelOption((channel) => {
//         return channel
//           .setName("voice-channel")
//           .setDescription(`kênh thoại để xác minh giọng nói`)
//           .addChannelTypes(ChannelType.GuildVoice)
//           .setRequired(true);
//       })
//       .addStringOption((option) => {
//         return option
//           .setName("message")
//           .setDescription(`Thông báo tùy chỉnh để nhúng xác minh`)
//           .setRequired(true);
//       }),
//     async execute(interaction, client) {
//       const data = await guildsettings.findOne({
//         guildid: interaction.guild.id,
//       });
//       let ds = data;
//       if (!data) {
//         ds = await guildsettings.create({
//           guildid: interaction.guild.id,
//           auto: {
//             verify: {
//               channel: interaction.options.getChannel("channel").id,
//               role: interaction.options.getRole("role").id,
//               voice: interaction.options.getChannel("voice-channel").id,
//               message: interaction.options.getString("message"),
//             },
//           },
//         });
//       } else {
//         ds.auto.verify.channel = interaction.options.getChannel("channel").id;
//         ds.auto.verify.role = interaction.options.getRole("role").id;
//         ds.auto.verify.voice = interaction.options.getChannel("voice-channel").id;
//         ds.auto.verify.message = interaction.options.getString("message");
//         await ds.save();
//       }
//       setverify(interaction, client, ds);
//     },
//   };
  
//   async function setverify(interaction, client, data) {
//     await interaction.deferReply();
//     const channel = interaction.options.getChannel("channel");
//     const role = interaction.options.getRole("role");
//     const voice = interaction.options.getChannel("voice-channel");
//     const message =
//       interaction.options.getString("message") || "Bấm vào nút để xác minh";
//     const row = new ActionRowBuilder().addComponents(
//       new ButtonBuilder()
//         .setCustomId("verify-kk")
//         .setStyle(ButtonStyle.Primary)
//         .setLabel(`Bấm để xác minh`)
//     );
//     data.auto.verify.channel = channel.id;
//     data.auto.verify.role = role.id;
//     data.auto.verify.voice = voice.id;
//     data.auto.verify.message = message;
//     await data.save();
//     const embed = new EmbedBuilder()
//       .setDescription(
        
//   `### Nhấp vào nút để bắt đầu xác minh.
  
//   __**Cách xác minh**___
//   1. Tham gia kênh voice ${voice}
//   2. Nhấp vào nút
//   3. Đợi một lát rồi nói từ **${message}** để xác minh.
//   4. Bạn sẽ được giao vai trò ${role}
//   5. Bot sẽ thông báo bạn đã được xác minh.
//   5. Bây giờ bạn có thể rời khỏi kênh thoại.`
          
//       )
//       .setColor(`Red`);
//     channel.send({
//       embeds: [embed],
//       components: [row],
//     });
//     interaction.editReply({
//       content: `Xác minh bằng giọng nói đã được đặt trong ${interaction.guild.name} với kênh thoại ${voice}`,
//       fetchReply: true,
//     });
//   }

