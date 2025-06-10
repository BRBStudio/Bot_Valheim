/*
Người chơi có thể chỉ định một đối thủ bằng cách đề cập đến họ (mention) trong tin nhắn.
*/

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');
const economySystem = require('../../schemas/economySystem');

// Tạo danh sách emoji thủ công để tránh lỗi từ thư viện bên ngoài
const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊'];
const emojiList1 = ['😙', '🤔', '🙄', '😏', '😣', '🥱', '🙂', '😁', '😑'];
const emojiList2 = ['😐', '😶', '🤐', '😌', '🤗', '😣', '😴', '😚', '😪'];
const emojiList3 = [
    '<a:quyen:1298851164212826133>', // Thay đổi ID này thành ID thực tế của bạn
    '<a:emojis:1298847346947264632>',
    '<a:giphy5:1277016601820135567>',
    '<a:Veft_MyLsk:1248523040980205632>',
    '<a:GcOaQ0Bcfh:1248522769335975988>',
    '<a:9CsV6kHu65:1248522384579760128>',
    '<a:XpCTvfoAzX:1248522890026942464>',
    '<a:YAktQsxmKQ:1248522623017812082>',
    '<a:bJqTRsQYla:1248523276939034696>'
];
const emojiList4 = [
    '<a:ech7:1234014842004705360>', // Thay đổi ID này thành ID thực tế của bạn
    '<a:7297girlshooting:1173366037627031682>',
    '<a:hanyaCheer:1173363092353200158>',
    '<a:bonkdoge:1173362925990322271>',
    '<a:Spooky_poggers:1173362773015679117>',
    '<a:troll_dance:1173362886920372285>',
    '<a:level:1249383009874874520>',
    '<a:fire:1249463238312329267>',
    '<a:likebutton:1250095157076824128>'
];
const emojiList5 = [
    '<a:l9Fjcs476E:1248523349139652699>', // Thay đổi ID này thành ID thực tế của bạn
    '<a:padlock:1298854788674359356>',
    '<a:brb:1298847994778619985>',
    '<a:clapclape:1299159696787116093>',
    '<a:PUBG67:1250385786600296459>',
    '<a:animatedloading3:1250198875931676846>',
    '<a:AUkwDK7cDn:1248524080022294589>',
    '<a:G3kKtOuYJ3:1248593845868822609>',
    '<a:yes:1253444746291183679>'
];


module.exports = {
    name: 'findemoji',
    description: 
        `🔸 Game tìm emoji!\n\n` +
        `🔸 Để xem hướng dẫn dùng \`\`\`?findemoji h\`\`\``,
    aliases: ['timemoji', 'g2'],

    async execute(msg, args) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?findemoji' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        try {

            // Kiểm tra nếu người dùng yêu cầu trợ giúp
            if (args[0] && args[0].toLowerCase() === 'h') {
                const helpEmbed = new EmbedBuilder()
                    .setTitle('Hướng dẫn chơi Game Tìm Emoji')
                    .setDescription('Dưới đây là cách chơi game tìm emoji:\n')
                    .addFields(
                        { name: 'Bước 1:', value: 'Ghi nhớ các emoji hiển thị trong 5 giây.' },
                        { name: 'Bước 2:', value: 'Sau khi thời gian hết, bạn sẽ được yêu cầu tìm một emoji cụ thể.' },
                        { name: 'Bước 3:', value: 'Nhấn vào emoji mà bạn nghĩ là đúng trong số các emoji đã ẩn.' },
                        { name: 'Bước 4:', value: 'Nếu bạn chọn đúng, bạn sẽ nhận được thông báo chúc mừng! Nếu không, bạn sẽ được thông báo rằng bạn đã chọn sai.' }
                    )
                    .setColor('Blue')
                    .setTimestamp();

                return msg.channel.send({ embeds: [helpEmbed] });
            }

            // Chọn ngẫu nhiên một trong 5 danh sách emoji
            const allEmojiLists = [emojiList, emojiList1, emojiList2, emojiList3, emojiList4, emojiList5];
            const randomList = allEmojiLists[Math.floor(Math.random() * allEmojiLists.length)];

            // // Tạo bảng với 9 nút, mỗi nút chứa một emoji ngẫu nhiên từ danh sách đã chọn
            // let emojis = Array.from({ length: 9 }, () => randomList[Math.floor(Math.random() * randomList.length)]);

            // Chọn ngẫu nhiên 9 emoji khác nhau từ danh sách đã chọn
            let emojis = [];
            while (emojis.length < 9) {
                const emoji = randomList[Math.floor(Math.random() * randomList.length)];
                if (!emojis.includes(emoji)) { // Kiểm tra nếu emoji đã được thêm vào danh sách chưa
                    emojis.push(emoji);
                }
            }

            // In ra các emoji đang được sử dụng
            // console.log('Emoji xuất hiện trên nút:', emojis);
            
            // Tạo hàng các nút từ danh sách emoji .setLabel(emoji)
            const rows = [
                new ActionRowBuilder().addComponents(
                    emojis.slice(0, 3).map((emoji, i) => (
                        new ButtonBuilder()
                            .setCustomId(i.toString())
                            .setEmoji(emoji)
                            .setStyle(ButtonStyle.Primary)
                    ))
                ),
                new ActionRowBuilder().addComponents(
                    emojis.slice(3, 6).map((emoji, i) => (
                        new ButtonBuilder()
                            .setCustomId((i + 3).toString())
                            .setEmoji(emoji)
                            .setStyle(ButtonStyle.Primary)
                    ))
                ),
                new ActionRowBuilder().addComponents(
                    emojis.slice(6).map((emoji, i) => (
                        new ButtonBuilder()
                            .setCustomId((i + 6).toString())
                            .setEmoji(emoji)
                            .setStyle(ButtonStyle.Primary)
                    ))
                )
            ];

            // Gửi bảng chứa các nút emoji
            const gameMessage = await msg.channel.send({
                content: 'Bạn có 5 giây để ghi nhớ các emoji!',
                components: rows
            });

            // // Đợi 5 giây để người chơi quan sát
            // await new Promise(resolve => setTimeout(resolve, 5000));

            // Đợi 5 giây để người chơi quan sát
            await new Promise(resolve => {
                const checkInteraction = (interaction) => {
                    if (interaction.user.id === msg.author.id) {
                        interaction.reply({ content: 'Sau 5 giây trò chơi mới bắt đầu, hãy ghi nhớ chúng trước đi', ephemeral: true });
                    }
                };
                const filter = i => i.user.id === msg.author.id;
                const collector = gameMessage.createMessageComponentCollector({ filter, time: 5000 });

                collector.on('collect', checkInteraction);
                collector.on('end', () => resolve());
            });

            // Chọn ngẫu nhiên một emoji để người chơi tìm
            const targetIndex = Math.floor(Math.random() * emojis.length);
            const targetEmoji = emojis[targetIndex]; // Lưu emoji cần tìm

            // console.log(`Emoji cần tìm là: ${targetEmoji}`); // In ra emoji để kiểm tra

            // Ẩn tất cả emoji và thay thế bằng ký tự "BRB" .setLabel(emoji)
            const hiddenEmojis = emojis.map(() => "<a:brb1:1299603167180361800>"); // Giữ danh sách emoji gốc để kiểm tra
            const hiddenRows = [
                new ActionRowBuilder().addComponents(
                    hiddenEmojis.slice(0, 3).map((emoji, i) => (
                        new ButtonBuilder()
                            .setCustomId(i.toString())
                            .setEmoji(emoji)
                            .setStyle(ButtonStyle.Primary)
                    ))
                ),
                new ActionRowBuilder().addComponents(
                    hiddenEmojis.slice(3, 6).map((emoji, i) => (
                        new ButtonBuilder()
                            .setCustomId((i + 3).toString())
                            .setEmoji(emoji)
                            .setStyle(ButtonStyle.Primary)
                    ))
                ),
                new ActionRowBuilder().addComponents(
                    hiddenEmojis.slice(6).map((emoji, i) => (
                        new ButtonBuilder()
                            .setCustomId((i + 6).toString())
                            .setEmoji(emoji)
                            .setStyle(ButtonStyle.Primary)
                    ))
                )
            ]; // Tạo hàng các nút ẩn

            await gameMessage.edit({
                content: `Hãy tìm emoji: ${targetEmoji}`,
                components: hiddenRows,
                ephemeral: true
            });

            // Tạo bộ lọc chỉ cho phép người gửi tin nhắn (msg.author.id) tương tác với các nút trong trò chơi
            const filter = interaction => interaction.isButton() && interaction.user.id === msg.author.id;

            // Chờ người chơi chọn trong vòng 10 giây
            const collector = gameMessage.createMessageComponentCollector({ filter, time: 10000 });

            collector.on('collect', async interaction => {
                try {

                    // Mở lại tất cả emoji trước khi gửi phản hồi
                    const revealRows = [
                        new ActionRowBuilder().addComponents(
                            emojis.slice(0, 3).map((emoji, i) => (
                                new ButtonBuilder()
                                    .setCustomId(i.toString())
                                    .setEmoji(emoji)
                                    .setStyle(ButtonStyle.Primary)
                            ))
                        ),
                        new ActionRowBuilder().addComponents(
                            emojis.slice(3, 6).map((emoji, i) => (
                                new ButtonBuilder()
                                    .setCustomId((i + 3).toString())
                                    .setEmoji(emoji)
                                    .setStyle(ButtonStyle.Primary)
                            ))
                        ),
                        new ActionRowBuilder().addComponents(
                            emojis.slice(6).map((emoji, i) => (
                                new ButtonBuilder()
                                    .setCustomId((i + 6).toString())
                                    .setEmoji(emoji)
                                    .setStyle(ButtonStyle.Primary)
                            ))
                        )
                    ]; // Tạo hàng các nút với emoji hiển thị

                    await gameMessage.edit({
                        content: `Hãy tìm emoji: ${targetEmoji}`,
                        components: revealRows // Mở lại tất cả emoji
                    });

                    // Kiểm tra xem người chơi có chọn đúng emoji hay không
                    const chosenIndex = parseInt(interaction.customId, 10);
                    // So sánh emoji đã chọn với emoji gốc
                    if (targetEmoji === emojis[chosenIndex]) {
                        await interaction.reply('Chúc mừng, bạn đã chọn đúng emoji!');
                    } else {
                        await interaction.reply('Rất tiếc, bạn đã chọn sai emoji.');
                    }
                    collector.stop(); // Kết thúc trò chơi sau khi người chơi chọn
                } catch (error) {
                    console.error('Lỗi trong quá trình xử lý nút:', error);
                    await interaction.reply('Đã xảy ra lỗi khi xử lý lựa chọn của bạn.');
                }
            });

            collector.on('end', async collected => {
                if (collected.size === 0) {
                    await msg.channel.send('Hết giờ! Bạn đã không chọn emoji nào.');
                }
            });
        } catch (error) {
            console.error('Lỗi trong quá trình chạy game:', error);
            await msg.channel.send('Đã xảy ra lỗi khi khởi động trò chơi.');
        }
    },
};











// /*
// 2 người chơi
// */

// const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// // Tạo danh sách emoji thủ công
// const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊'];
// const emojiList1 = ['😙', '🤔', '🙄', '😏', '😣', '🥱', '🙂', '😁', '😑'];
// const emojiList2 = ['😐', '😶', '🤐', '😌', '🤗', '😣', '😴', '😚', '😪'];
// const emojiList3 = [
//     '<a:quyen:1298851164212826133>',
//     '<a:emojis:1298847346947264632>',
//     '<a:giphy5:1277016601820135567>',
//     '<a:Veft_MyLsk:1248523040980205632>',
//     '<a:GcOaQ0Bcfh:1248522769335975988>',
//     '<a:9CsV6kHu65:1248522384579760128>',
//     '<a:XpCTvfoAzX:1248522890026942464>',
//     '<a:YAktQsxmKQ:1248522623017812082>',
//     '<a:bJqTRsQYla:1248523276939034696>'
// ];
// const emojiList4 = [
//     '<a:ech7:1234014842004705360>',
//     '<a:7297girlshooting:1173366037627031682>',
//     '<a:hanyaCheer:1173363092353200158>',
//     '<a:bonkdoge:1173362925990322271>',
//     '<a:Spooky_poggers:1173362773015679117>',
//     '<a:troll_dance:1173362886920372285>',
//     '<a:level:1249383009874874520>',
//     '<a:fire:1249463238312329267>',
//     '<a:likebutton:1250095157076824128>'
// ];
// const emojiList5 = [
//     '<a:l9Fjcs476E:1248523349139652699>',
//     '<a:padlock:1298854788674359356>',
//     '<a:brb:1298847994778619985>',
//     '<a:clapclape:1299159696787116093>',
//     '<a:PUBG67:1250385786600296459>',
//     '<a:animatedloading3:1250198875931676846>',
//     '<a:AUkwDK7cDn:1248524080022294589>',
//     '<a:G3kKtOuYJ3:1248593845868822609>',
//     '<a:yes:1253444746291183679>'
// ];

// module.exports = {
//     name: 'findemoji',
//     description: 'Game tìm emoji cho 2 người chơi!',
//     aliases: ['fi', 'fe'],
//     async execute(msg) {
//         try {
//             // Kiểm tra xem người chơi đã chỉ định đối thủ chưa
//             const mention = msg.mentions.users.first();
//             if (!mention || mention.id === msg.author.id) {
//                 return msg.channel.send('Vui lòng đề cập đến một người chơi khác để tham gia trò chơi.');
//             }

//             // Chọn ngẫu nhiên một trong ba danh sách emoji
//             const allEmojiLists = [emojiList, emojiList1, emojiList2, emojiList3, emojiList4, emojiList5];
//             const randomList = allEmojiLists[Math.floor(Math.random() * allEmojiLists.length)];

//             // Chọn ngẫu nhiên 9 emoji khác nhau từ danh sách đã chọn
//             let emojis = [];
//             while (emojis.length < 9) {
//                 const emoji = randomList[Math.floor(Math.random() * randomList.length)];
//                 if (!emojis.includes(emoji)) {
//                     emojis.push(emoji);
//                 }
//             }

//             console.log('Emoji xuất hiện trên nút:', emojis);

//             // Tạo hàng các nút từ danh sách emoji
//             const rows = [
//                 new ActionRowBuilder().addComponents(
//                     emojis.slice(0, 3).map((emoji, i) => (
//                         new ButtonBuilder()
//                             .setCustomId(i.toString())
//                             .setEmoji(emoji)
//                             .setStyle(ButtonStyle.Primary)
//                     ))
//                 ),
//                 new ActionRowBuilder().addComponents(
//                     emojis.slice(3, 6).map((emoji, i) => (
//                         new ButtonBuilder()
//                             .setCustomId((i + 3).toString())
//                             .setEmoji(emoji)
//                             .setStyle(ButtonStyle.Primary)
//                     ))
//                 ),
//                 new ActionRowBuilder().addComponents(
//                     emojis.slice(6).map((emoji, i) => (
//                         new ButtonBuilder()
//                             .setCustomId((i + 6).toString())
//                             .setEmoji(emoji)
//                             .setStyle(ButtonStyle.Primary)
//                     ))
//                 )
//             ];

//             // Gửi bảng chứa các nút emoji
//             const gameMessage = await msg.channel.send({
//                 content: 'Bạn có 5 giây để ghi nhớ các emoji!',
//                 components: rows
//             });

//             // Đợi 5 giây để người chơi quan sát
//             await new Promise(resolve => setTimeout(resolve, 5000));

//             // Chọn ngẫu nhiên một emoji để người chơi tìm
//             const targetIndex = Math.floor(Math.random() * emojis.length);
//             const targetEmoji = emojis[targetIndex];

//             // Ẩn tất cả emoji và thay thế bằng ký tự "BRB"
//             const hiddenEmojis = emojis.map(() => "BRB");
//             const hiddenRows = [
//                 new ActionRowBuilder().addComponents(
//                     hiddenEmojis.slice(0, 3).map((emoji, i) => (
//                         new ButtonBuilder()
//                             .setCustomId(i.toString())
//                             .setLabel(emoji)
//                             .setStyle(ButtonStyle.Primary)
//                     ))
//                 ),
//                 new ActionRowBuilder().addComponents(
//                     hiddenEmojis.slice(3, 6).map((emoji, i) => (
//                         new ButtonBuilder()
//                             .setCustomId((i + 3).toString())
//                             .setLabel(emoji)
//                             .setStyle(ButtonStyle.Primary)
//                     ))
//                 ),
//                 new ActionRowBuilder().addComponents(
//                     hiddenEmojis.slice(6).map((emoji, i) => (
//                         new ButtonBuilder()
//                             .setCustomId((i + 6).toString())
//                             .setLabel(emoji)
//                             .setStyle(ButtonStyle.Primary)
//                     ))
//                 )
//             ];

//             await gameMessage.edit({
//                 content: `Hãy tìm emoji: ${targetEmoji}`,
//                 components: hiddenRows
//             });

//             // Tạo bộ lọc cho phép người chơi tương tác
//             const filter = interaction => interaction.isButton() && 
//                                           (interaction.user.id === msg.author.id || interaction.user.id === mention.id);

//             // Chờ người chơi chọn trong vòng 10 giây
//             const collector = gameMessage.createMessageComponentCollector({ filter, time: 10000 });

//             collector.on('collect', async interaction => {
//                 try {
//                     // Mở lại tất cả emoji
//                     const revealRows = [
//                         new ActionRowBuilder().addComponents(
//                             emojis.slice(0, 3).map((emoji, i) => (
//                                 new ButtonBuilder()
//                                     .setCustomId(i.toString())
//                                     .setEmoji(emoji)
//                                     .setStyle(ButtonStyle.Primary)
//                             ))
//                         ),
//                         new ActionRowBuilder().addComponents(
//                             emojis.slice(3, 6).map((emoji, i) => (
//                                 new ButtonBuilder()
//                                     .setCustomId((i + 3).toString())
//                                     .setEmoji(emoji)
//                                     .setStyle(ButtonStyle.Primary)
//                             ))
//                         ),
//                         new ActionRowBuilder().addComponents(
//                             emojis.slice(6).map((emoji, i) => (
//                                 new ButtonBuilder()
//                                     .setCustomId((i + 6).toString())
//                                     .setEmoji(emoji)
//                                     .setStyle(ButtonStyle.Primary)
//                             ))
//                         )
//                     ];

//                     await gameMessage.edit({
//                         content: `Hãy tìm emoji: ${targetEmoji}`,
//                         components: revealRows // Mở lại tất cả emoji
//                     });

//                     const chosenIndex = parseInt(interaction.customId, 10);
//                     if (targetEmoji === emojis[chosenIndex]) {
//                         await interaction.reply({ content: `${interaction.user.username} đã chọn đúng emoji!`, ephemeral: true });
//                     } else {
//                         await interaction.reply({ content: `${interaction.user.username} đã chọn sai emoji.`, ephemeral: true });
//                     }
//                     collector.stop(); // Kết thúc trò chơi sau khi có người chơi chọn
//                 } catch (error) {
//                     console.error('Lỗi trong quá trình xử lý nút:', error);
//                     await interaction.reply('Đã xảy ra lỗi khi xử lý lựa chọn của bạn.');
//                 }
//             });

//             collector.on('end', async collected => {
//                 if (collected.size === 0) {
//                     await msg.channel.send('Hết giờ! Không có ai đã chọn emoji nào.');
//                 }
//             });
//         } catch (error) {
//             console.error('Lỗi trong quá trình chạy game:', error);
//             await msg.channel.send('Đã xảy ra lỗi khi khởi động trò chơi.');
//         }
//     },
// };
