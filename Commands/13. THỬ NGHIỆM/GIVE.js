// const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
// const ms = require('ms');
// const { checkAdministrator } = require(`../../permissionCheck`)
// const giveawaySchema = require('../../schemas/giveawaySchema');
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('giveawayrr')
//         .setDescription('Tất cả các tiện ích tặng quà bạn cần')
//         .setDMPermission(false)
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('start')
//                 .setDescription('Bắt đầu tặng quà')
//                 .addStringOption(option => option.setName('reward').setDescription('Phần thưởng của chương trình tặng quà').setRequired(true))
//                 .addStringOption(option => option.setName('duration').setDescription('Thời gian tặng quà [định dạng: s(giây), m(phút), h(giờ), d(ngày)]').setRequired(true))
//                 .addIntegerOption(option => option.setName('winners').setDescription('Số lượng người chiến thắng.').setRequired(true).setMinValue(1))
//                 .addUserOption(option => option.setName('host').setDescription('Người dùng đang tổ chức tặng quà'))
//                 .addAttachmentOption(option => option.setName('thumbnail').setDescription('Thêm hình thu nhỏ mô tả tặng thưởng.')))// Thêm hình thu nhỏ vào phần nhúng tặng thưởng.
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('reroll')
//                 .setDescription('Chọn người chiến thắng mới.')
//                 .addStringOption(option => option.setName('message-id').setDescription('ID tin nhắn của phần quà tặng bạn muốn lấy lại.').setRequired(true)))
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('pause')
//                 .setDescription('Tạm dừng một chương trình tặng quà đang diễn ra.')
//                 .addStringOption(option => option.setName('message-id').setDescription('ID tin nhắn của chương trình tặng quà mà bạn muốn tạm dừng.').setRequired(true)))
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('resume')
//                 .setDescription('Tiếp tục tặng quà đã tạm dừng.')
//                 .addStringOption(option => option.setName('message-id').setDescription('ID tin nhắn của chương trình tặng quà mà bạn muốn tiếp tục.').setRequired(true)))
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('end')
//                 .setDescription('Kết thúc một cuộc tặng quà.')
//                 .addStringOption(option => option.setName('message-id').setDescription('ID tin nhắn của chương trình tặng quà mà bạn muốn kết thúc.').setRequired(true)))
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('cancel')
//                 .setDescription('Dừng tặng quà.')
//                 .addStringOption(option => option.setName('message-id').setDescription('ID tin nhắn của phần quà tặng mà bạn muốn hủy.').setRequired(true)))
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('remove-data')
//                 .setDescription('Xóa tất cả dữ liệu quà tặng.')), // Thêm subcommand 'kk'

    
//     async execute(interaction, client) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/giveaway' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         const hasPermission = await checkAdministrator(interaction);
//         if (!hasPermission) return;

//         const subcommand = interaction.options.getSubcommand();

//         // Xử lý lệnh /giveaway start
//         if (subcommand === 'start') {

//             // Sử dụng deferReply để xác nhận tương tác
//             await interaction.deferReply({ ephemeral: true });

//             const reward = interaction.options.getString('reward');
//             const duration = interaction.options.getString('duration');
//             const winners = interaction.options.getInteger('winners');
//             const host = interaction.options.getUser('host') || interaction.user; // Nếu không có host, mặc định là người dùng gọi lệnh
//             const thumbnail = interaction.options.getAttachment('thumbnail');
//             const channelId = interaction.channel.id; // Lấy ID của kênh hiện tại
//             const giveawayEndDate = Date.now() + ms(duration); // Tính thời gian kết thúc dựa trên duration

//             // Kiểm tra định dạng của duration
//             const durationRegex = /^\d+[smhd]$/; // Biểu thức chính quy cho các định dạng hợp lệ
//             if (!durationRegex.test(duration)) {
//                 return interaction.editReply({ content: 'Bạn cần viết đúng định dạng cho trường `duration`.\n\nVí dụ:\n`10s`( tức là 10 giây )\n`1m` ( tức là 1 phút )\n`1h` ( tức là 1 giờ )\n`1d` ( tức là 1 ngày ).', ephemeral: true });
//             }

//             // Hàm định dạng thời gian thành tiếng Việt
//             const formatVietnameseDate = (date) => {
//                 const options = {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     second: '2-digit',
//                     timeZone: 'Asia/Ho_Chi_Minh',
//                 };
//                 const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(date);
//                 const formattedDateWithNam = formattedDate.replace(/, (\d{4})/, ' năm $1');
//                 return `vào ${formattedDateWithNam}`;
//             };

//             // Thời gian kết thúc đã được định dạng thành tiếng Việt
//             const formattedEndTime = formatVietnameseDate(new Date(giveawayEndDate))

//             // Chuyển chuỗi phần thưởng thành danh sách xuống dòng
//             const rewardList = reward.split(',').map(item => item.trim()).join('\n');

//             // Tạo embed cho giveaway
//             const embed = new EmbedBuilder()
//                 .setTitle(`**PHẦN THƯỞNG🎉**\n${rewardList}`)
//                 .setDescription(`Tổ chức bởi: ${host}\n\nNhấp vào phản ứng 🎉 bên dưới tin nhắn để tham gia\n\nThời gian kết thúc: <t:${Math.floor(giveawayEndDate / 1000)}:R>`)
//                 .setColor('Random')
//                 .setThumbnail(thumbnail ? thumbnail.url : null)
//                 .setFooter({ text: `Số lượng quà: ${winners}` })
//                 .setTimestamp();

//             // Gửi tin nhắn giveaway
//             const giveawayMessage = await interaction.channel.send({ content: `@everyone Một chương trình tặng quà mới đã bắt đầu! 🎉`, embeds: [embed] });

//             // Thêm phản ứng 🎉 vào tin nhắn giveaway
//             await giveawayMessage.react('🎉'); // Thêm phản ứng cho người dùng tương tác

//             // Tạo một collector để theo dõi các phản ứng
//             const filter = (reaction, user) => {
//                 return user.id !== client.user.id; // Lọc bỏ phản ứng của bot
//             };

//             const collector = giveawayMessage.createReactionCollector({ filter, dispose: true });

//             // Xử lý khi một phản ứng mới được thêm vào
//             collector.on('collect', async (reaction, user) => {
//                 if (reaction.emoji.name !== '🎉') {
//                     await reaction.users.remove(user.id); // Xóa phản ứng nếu không phải là 🎉
//                 }
//             });
            
            

//             // Lưu hoặc cập nhật dữ liệu vào MongoDB
//             const existingGiveaway = await giveawaySchema.findOne({ Guild: interaction.guild.id }); // Kiểm tra nếu đã tồn tại dữ liệu của máy chủ
//             if (existingGiveaway) {
//                 // Cập nhật dữ liệu cũ
//                 await giveawaySchema.updateOne(
//                     { Guild: interaction.guild.id },
//                     {
//                         $set: {
//                             Host: host.id,
//                             Channel: channelId,
//                             MessageID: giveawayMessage.id,
//                             Title: reward,
//                             Color: 'Random',
//                             Bcolor: thumbnail ? thumbnail.url : null,
//                             Reaction: '🎉',
//                             Winners: winners,
//                             Time: duration,
//                             Date: giveawayEndDate,
//                             Users: [],
//                             Ended: false,
//                             WinnerCount: winners,
//                             EndTime: giveawayEndDate,
//                             Paused: false,
//                         },
//                     }
//                 );
//             } else {
//                 // Tạo dữ liệu mới nếu chưa có
//                 const newGiveaway = new giveawaySchema({
//                     Guild: interaction.guild.id, // lưu máy chủ riêng biệt
//                     Host: host.id,
//                     Channel: channelId,
//                     MessageID: giveawayMessage.id,
//                     Title: reward,
//                     Color: 'Random',
//                     Bcolor: thumbnail ? thumbnail.url : null,
//                     Reaction: '🎉', // Reaction mặc định
//                     Winners: winners,
//                     Time: duration,
//                     Date: giveawayEndDate, // Ngày kết thúc
//                     Users: [],
//                     Ended: false,
//                     WinnerCount: winners, // Lưu số lượng người chiến thắng
//                     EndTime: giveawayEndDate, // Lưu thời gian kết thúc
//                     Paused: false, // Thêm trạng thái Paused ban đầu là false
//                 });

//                 await newGiveaway.save(); // Lưu vào MongoDB
//             }

//             // Tạo khoảng thời gian chờ đến khi giveaway kết thúc
//             setTimeout(async () => {

//                 const giveaway = await giveawaySchema.findOne({ MessageID: giveawayMessage.id });

//                 // Kiểm tra nếu không tìm thấy dữ liệu trong MongoDB, thoát
//                 if (!giveaway) {
//                     // console.log(`Không tìm thấy dữ liệu giveaway cho MessageID: ${giveawayMessage.id}`);
//                     return;
//                 }

//                 // Kiểm tra nếu giveaway đã bị tạm dừng, thì không thực hiện tiếp
//                 if (giveaway.Paused || giveaway.Ended) return;

//                 // Lấy danh sách người dùng đã tham gia bằng cách phản ứng với 🎉
//                 const fetchedMessage = await giveawayMessage.fetch();
//                 const reactions = fetchedMessage.reactions.cache.get('🎉');

//                 if (!reactions) return; // Nếu không có phản ứng nào, thoát

//                 const users = await reactions.users.fetch();
//                 const validUsers = users.filter(user => !user.bot && user.id !== host.id && user.id !== interaction.user.id); // Loại bỏ bot và người tổ chức

//                 if (validUsers.size === 0) {
//                     // Nếu không có người dùng tham gia hợp lệ
//                     const noParticipantsEmbed = new EmbedBuilder()
//                         .setTitle(`Chương trình tặng quà đã kết thúc`)
//                         .setDescription(`Thời gian nhận quà đã hết, không có sự tham gia hợp lệ\nNgười tổ chức: ${host}\nKết thúc ${formattedEndTime}`)
//                         .setColor('Red')
//                         .setTimestamp();

//                     await interaction.channel.send({ embeds: [noParticipantsEmbed] });
//                     // await giveawayMessage.delete(); // Xóa tin nhắn giveaway
//                 } else {
//                     // Nếu có người dùng tham gia hợp lệ
//                     const winnerArray = validUsers.random(winners); // Chọn ngẫu nhiên người chiến thắng
//                     const winnerMentions = winnerArray.map(winner => `<@${winner.id}>`).join(', ');

//                     const winnersEmbed = new EmbedBuilder()
//                         .setTitle(`🎉 Chúc mừng người chiến thắng 🎉`)
//                         .setDescription(`Phần thưởng:\n**${rewardList}**\n\nNgười tổ chức: ${host}\n\nNgười chiến thắng: ${winnerMentions}`)
//                         .setColor('Green')
//                         .setTimestamp();

//                     await interaction.channel.send({ embeds: [winnersEmbed] });
//                     // await giveawayMessage.delete(); // Xóa tin nhắn giveaway sau khi có người chiến thắng
//                 }
//             }, ms(duration)); // Chờ đến khi thời gian giveaway kết thúc

//             // Xóa phản hồi xác nhận tương tác
//             await interaction.deleteReply();

//         }

//         // Xử lý lệnh /giveaway pause
//         if (subcommand === 'pause') {
//             const messageId = interaction.options.getString('message-id');

//             const giveaway = await giveawaySchema.findOne({ MessageID: messageId });
//             if (!giveaway || giveaway.Ended === true) {
//                 return interaction.reply({ content: 'Không tìm thấy tặng quà này hoặc nó đã kết thúc.', ephemeral: true });
//             }

//             const currentTime = Date.now();
//             const remainingTime = giveaway.EndTime - currentTime; // Thời gian còn lại cho đến khi kết thúc

//             // Cập nhật thời gian tạm dừng và lưu vào MongoDB
//             giveaway.Paused = true;
//             giveaway.RemainingTime = remainingTime; // Lưu thời gian còn lại
//             giveaway.PausedAt = currentTime; // Lưu thời điểm tạm dừng
//             await giveaway.save();

//             const giveawayMessage = await interaction.channel.messages.fetch(messageId);

//             // Chuyển đổi phần thưởng thành danh sách xuống dòng
//             const formattedTitle = giveaway.Title.split(',').map(item => item.trim()).join('\n');

//             const pausedEmbed = new EmbedBuilder()
//                 .setTitle(`**PHẦN THƯỞNG🎉**\n${formattedTitle}`)
//                 .setDescription(`Tổ chức bởi: <@${giveaway.Host}>\n\n⏸️ **QUÀ TẶNG NÀY ĐÃ TẠM DỪNG!** ⏸️\n\nThời gian còn lại khi tạm dừng: **${ms(remainingTime, { long: true })}**`)
//                 .setColor('Yellow')
//                 .setThumbnail(giveaway.Bcolor)
//                 .setFooter({ text: `Số lượng quà: ${giveaway.WinnerCount}` })
//                 .setTimestamp();

//             await giveawayMessage.edit({ embeds: [pausedEmbed] });
//             await interaction.reply({ content: `Chương trình tặng quà đã bị tạm dừng.`, ephemeral: true });
//         }

//         // Xử lý lệnh /giveaway resume
//         if (subcommand === 'resume') {
//             await interaction.deferReply({ ephemeral: true });

//             const messageId = interaction.options.getString('message-id');
//             const giveawayData = await giveawaySchema.findOne({ MessageID: messageId });

//             if (!giveawayData || giveawayData.Ended) {
//                 return interaction.editReply({ content: `Tặng quà không hợp lệ hoặc đã kết thúc.`, ephemeral: true });
//             }

//             // Kiểm tra nếu tặng quà không phải đang tạm dừng
//             if (!giveawayData.Paused) {
//                 return interaction.editReply({ content: `Tặng quà này hiện đang là tạm dừng.`, ephemeral: true });
//             }

//             // Cập nhật trạng thái tặng quà thành tiếp tục
//             giveawayData.Paused = false;
//             // await giveawayData.updateOne({ Paused: false});

//             // Cập nhật thời gian kết thúc dựa trên thời gian còn lại
//             const newEndTime = Date.now() + giveawayData.RemainingTime;
//             giveawayData.EndTime = newEndTime; // Lưu thời gian kết thúc mới
//             await giveawayData.save();

//             // Cập nhật lại tin nhắn tặng quà để hiển thị rằng chương trình đã được tiếp tục
//             const giveawayMessage = await interaction.channel.messages.fetch(messageId);

//             // Chuyển đổi phần thưởng thành danh sách xuống dòng
//             const formattedTitle = giveawayData.Title.split(',').map(item => item.trim()).join('\n');

//             // Tạo embed mới với thời gian kết thúc đã được cập nhật
//             const resumeEmbed = new EmbedBuilder()
//                 .setTitle(`**PHẦN THƯỞNG🎉**\n${formattedTitle}`)
//                 .setDescription(`Tổ chức bởi: <@${giveawayData.Host}>\n\nNhấp vào phản ứng 🎉 bên dưới tin nhắn để tham gia\n\nThời gian kết thúc: <t:${Math.floor(newEndTime / 1000)}:R>`)
//                 .setColor('Green')
//                 .setThumbnail(giveawayData.Bcolor)
//                 .setFooter({ text: `Số lượng quà: ${giveawayData.WinnerCount}` })
//                 .setTimestamp();

//             // Cập nhật tin nhắn của chương trình tặng quà
//             await giveawayMessage.edit({ embeds: [resumeEmbed] });

//             // Phản hồi lại cho người dùng
//             await interaction.editReply({ content: `Tặng quà đã được tiếp tục và thời gian kết thúc đã được cập nhật.`, ephemeral: true });
//         }
//     }
// }