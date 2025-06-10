const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ChannelType, ButtonStyle, PermissionsBitField } = require('discord.js');
const KsModel = require('../../schemas/ks_Schema');
const config = require('../../config');

module.exports = {
    name: 'survey',
    description: '\`🔸 LỆNH DÀNH CHO DEV\`',
    hd: `\`🔸 Cách dùng: Không có thông tin\``,
    q: `\`🔸 Dành cho DEV\``,
    aliases: ['ksb', 'dev4'],

/*
Khảo sát toàn bộ máy chủ
*/

    async execute(msg, args) {

        if (!config.specialUsers.includes(msg.author.id)) { 
            return msg.channel.send("Bạn không có quyền sử dụng lệnh này!"); 
        }

        // Kiểm tra nếu người chơi yêu cầu hướng dẫn
        if (args[0].toLowerCase() === 'h') {
            // Tạo hướng dẫn dưới dạng Embed
            const helpEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('HƯỚNG DẪN SỬ DỤNG LỆNH SURVEY')
                .setDescription(
                    `Lệnh \`?survey\` hỗ trợ các chức năng khảo sát trong máy chủ.\n\n` +
                    `**Cú pháp sử dụng:**\n` +
                    `\`\`\`?survey <tùy chọn>\`\`\`\n` +
                    `**Các tùy chọn hiện có:**\n` +
                    `• \`list\`: Hiển thị danh sách tất cả dữ liệu khảo sát trong hệ thống.\n` +
                    `• \`h\`: Hiển thị hướng dẫn sử dụng lệnh này.\n\n` +
                    `**Ví dụ cụ thể:**\n` +
                    `- \`?survey list\`: Lấy danh sách khảo sát của tất cả người dùng trong hệ thống.\n` +
                    `- \`?survey h\`: Hiển thị hướng dẫn sử dụng (lệnh này).`
                )
                .setFooter({ text: 'Lưu ý: Lệnh này chỉ dành cho DEV và chỉ hoạt động trong máy chủ.' });

            // Gửi Embed hướng dẫn sử dụng
            return msg.channel.send({ embeds: [helpEmbed] });
        }
        
        // Kiểm tra nếu người chơi yêu cầu danh sách 
        if (args[0].toLowerCase() === 'list') {
            // Lấy tất cả dữ liệu từ MongoDB
            const results = await KsModel.find();

            // Kiểm tra nếu không có dữ liệu nào được tìm thấy
            if (results.length === 0) {
                return msg.channel.send("Không có dữ liệu nào trong hệ thống để hiển thị.");
            }

            // Tạo một đối tượng để lưu trữ kết quả theo từng máy chủ
            const guildResults = {};

            // Duyệt qua tất cả kết quả và phân loại theo máy chủ
            results.forEach(data => {
                const { guildId, guildName, userId, displayName, correctAnswers, questions } = data;

                // Tạo cấu trúc cho mỗi máy chủ
                if (!guildResults[guildId]) {
                    guildResults[guildId] = {
                        guildName: guildName,
                        users: []
                    };
                }

                // Thêm thông tin người dùng vào máy chủ tương ứng
                guildResults[guildId].users.push({
                    userId: userId,
                    displayName: displayName,
                    correctAnswers: correctAnswers,
                    questions: questions
                });
            });

            // Tạo danh sách các thông điệp
            const messages = [];

            // Duyệt qua từng máy chủ và định dạng nội dung
            for (const [guildId, data] of Object.entries(guildResults)) {
                let pageContent = `\`\`\`yml\nMáy chủ: ${data.guildName} (ID: ${guildId})\n`; 
                
                data.users.forEach(user => {
                    let userContent = `• Tên hiển thị: ${user.displayName}\n`;
                    userContent += `• ID người dùng: ${user.userId}\n`;
                    userContent += `• Tổng số câu trả lời đúng: ${user.correctAnswers}\n`;

                    user.questions.forEach(question => {
                        userContent += `\n 🍬Câu hỏi: ${question.question}\n`;
                        userContent += `        🌸 Câu trả lời: ${question.answer}\n`;
                        userContent += `        🌸 **Trạng thái:** ${question.status}\n`;
                    });

                    if ((pageContent + userContent).length > 1900) { // Nếu thêm sẽ vượt quá 2000 ký tự
                        pageContent += `\`\`\``;
                        messages.push(pageContent);
                        pageContent = `\`\`\`yml\nMáy chủ: ${data.guildName} (ID: ${guildId})\n`; 
                    }
                    pageContent += userContent;
                });

                pageContent += `\`\`\`\n\n`; 
                messages.push(pageContent);
            }

            // Kiểm tra nếu mảng messages rỗng trước khi gửi
            if (messages.length === 0) {
                return msg.channel.send("Không có dữ liệu hợp lệ để hiển thị.");
            }

            
            // Gửi thông điệp đầu tiên
            const initialMessage = await msg.channel.send(messages[0]);

            // Tạo nút để chuyển trang
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prevv')
                        .setLabel('Trang trước')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(messages.length <= 1),
                    new ButtonBuilder()
                        .setCustomId('nextr')
                        .setLabel('Trang sau')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(messages.length <= 1)
                );

            await initialMessage.edit({ components: [row] });

            let currentPageIndex = 0;

            // Tạo một collector để xử lý các nút bấm
            const filter = i => {
                return i.user.id === msg.author.id;
            };
            
            const collector = initialMessage.createMessageComponentCollector({ filter, time: 3600000 });

            collector.on('collect', async i => {
                if (i.customId === 'prevv') {
                    currentPageIndex = Math.max(0, currentPageIndex - 1); 
                } else if (i.customId === 'nextr') {
                    currentPageIndex = Math.min(messages.length - 1, currentPageIndex + 1); 
                }

                row.components[0].setDisabled(currentPageIndex === 0);
                row.components[1].setDisabled(currentPageIndex === messages.length - 1);

                await i.update({ 
                    content: `${messages[currentPageIndex]}**Trang:** ${currentPageIndex + 1}/${messages.length}`, 
                    components: [row] 
                });
            });

            collector.on('end', () => {
                row.components.forEach(button => button.setDisabled(true));
                initialMessage.edit({ components: [row] });
            });

            await initialMessage.edit({ 
                content: `${messages[0]}**Trang:** 1/${messages.length}`, 
                components: [row] 
            });
            return;
        }

        if (args[0].toLowerCase() === 'send') {
            const guilds = msg.client.guilds.cache;
            for (const guild of guilds.values()) {
                // Tìm danh mục 'Thông Báo Từ Dev'
                let devCategory = guild.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === 'Thông Báo Từ Bot');
                // Tìm kênh '888'
                let devChannel = guild.channels.cache.find(ch => ch.type === ChannelType.GuildText && ch.name === 'khảo_sát_bot');

                // Trường hợp 1: Có danh mục nhưng không có kênh '888' trong danh mục đó
                if (devCategory && (!devChannel || devChannel.parentId !== devCategory.id)) {
                    if (devChannel && devChannel.parentId !== devCategory.id) {
                        await devChannel.delete(); // Xóa kênh nếu không thuộc danh mục
                    }
                    // Tạo kênh mới '888' trong danh mục 'Thông Báo Từ Dev'
                    devChannel = await guild.channels.create({
                        name: 'khảo_sát_bot',
                        type: ChannelType.GuildText,
                        parent: devCategory,
                        permissionOverwrites: [{
                            id: guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                            deny: [PermissionsBitField.Flags.SendMessages],
                        }],
                    });
                }
                // Trường hợp 2: Nếu không có danh mục và kênh '888'
                else if (!devCategory) {
                    // Tạo danh mục 'Thông Báo Từ Dev'
                    devCategory = await guild.channels.create({
                        name: 'Thông Báo Từ Bot',
                        type: ChannelType.GuildCategory,
                    });
                    // Tạo kênh '888' trong danh mục vừa tạo
                    devChannel = await guild.channels.create({
                        name: 'khảo_sát_bot',
                        type: ChannelType.GuildText,
                        parent: devCategory,
                        permissionOverwrites: [{
                            id: guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                            deny: [PermissionsBitField.Flags.SendMessages],
                        }],
                    });
                }

                // Đặt danh mục 'Thông Báo Từ Dev' lên trên cùng trong danh sách kênh
                await devCategory.setPosition(0);

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Khảo sát câu hỏi (Kênh này sẽ tự động xóa sau 3 ngày)')
                    .setDescription('Vui lòng trả lời các câu hỏi bên dưới:')
                    .setFooter({ text: 'Khảo sát này giúp chúng tôi cải thiện bot tốt hơn trong tương tai!' })
                    .setTimestamp();

                await devChannel.send({ embeds: [embed] });

                // Tạo các nút cho các câu hỏi
                const buttonRow1 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q1_a').setLabel('Không').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q1_b').setLabel('Bình thường').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q1_c').setLabel('Rất thích').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q1_d').setLabel('Thích').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q1_e').setLabel('Đúng vậy').setStyle(ButtonStyle.Primary)
                );

                const buttonRow2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q2_a').setLabel('Đúng').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q2_b').setLabel('Rất thích').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q2_c').setLabel('Thích').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q2_d').setLabel('Không').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q2_e').setLabel('Bình thường').setStyle(ButtonStyle.Primary)
                );

                const buttonRow3 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q3_a').setLabel('Rất thích').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q3_b').setLabel('Bình thường').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q3_c').setLabel('Đúng vậy').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q3_d').setLabel('Không').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q3_e').setLabel('Thích').setStyle(ButtonStyle.Primary)
                );


                const buttonRow4 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q4_a').setLabel('Không').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q4_b').setLabel('không biết').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q4_c').setLabel('Bình thường').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q4_d').setLabel('Sao cũng được').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q4_e').setLabel('Tất nhiên là vậy rồi').setStyle(ButtonStyle.Primary) // Đúng
                );

                const buttonRow5 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q5_a').setLabel('Không hẳn').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q5_b').setLabel('Chỉ thích vài game').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q5_c').setLabel('Bình thường').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q5_d').setLabel('Vâng, điều đó là tất nhiên').setStyle(ButtonStyle.Primary), // Đúng mới sửa
                    new ButtonBuilder().setCustomId('q5_e').setLabel('chỉ thích 1 đến 2 game').setStyle(ButtonStyle.Primary)
                );

                const buttonRow6 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q6_a').setLabel('Trò chơi thách đấu IQ trong nhiều lĩnh vực').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q6_b').setLabel('Trò chơi IQ').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q6_c').setLabel('Trò chơi trí tuệ').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q6_d').setLabel('Không biết').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q6_e').setLabel('Trò chơi thách đấu trí tuệ trong nhiều lĩnh vực').setStyle(ButtonStyle.Primary)
                );

                const buttonRow7 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q7_a').setLabel('5').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q7_b').setLabel('8').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q7_c').setLabel('3').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q7_d').setLabel('6').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q7_e').setLabel('10').setStyle(ButtonStyle.Primary)
                );

                const buttonRow8 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q8_a').setLabel('Không nhớ').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q8_b').setLabel('/bot-version').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q8_c').setLabel('/updates-bot').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q8_d').setLabel('/version').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q8_e').setLabel('/version-bot').setStyle(ButtonStyle.Primary)
                );

                const buttonRow9 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q9_a').setLabel('Hộp thư lưu trữ').setStyle(ButtonStyle.Primary), // Đúng
                    new ButtonBuilder().setCustomId('q9_b').setLabel('Gửi thư cho dev').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q9_c').setLabel('Ồ có lệnh này sao?').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q9_d').setLabel('Tôi chưa thử').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q9_e').setLabel('Phản hồi về bot cho dev').setStyle(ButtonStyle.Primary) // Đúng mới sửa
                );

                const buttonRow10 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('q10_a').setLabel('2').setStyle(ButtonStyle.Primary), // Đúng Success
                    new ButtonBuilder().setCustomId('q10_b').setLabel('0').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q10_c').setLabel('3').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q10_d').setLabel('4').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('q10_e').setLabel('1').setStyle(ButtonStyle.Primary)
                );

                await devChannel.send({ content: 'Câu hỏi 1: Tôi thích các lệnh prefix', components: [buttonRow1] });
                await devChannel.send({ content: 'Câu hỏi 2: Tôi thích các lệnh trong lệnh /commands-bot', components: [buttonRow2] });
                await devChannel.send({ content: 'Câu hỏi 3: Tôi thích các lệnh trong lệnh /commands-new', components: [buttonRow3] });
                await devChannel.send({ content: 'Câu hỏi 4: Bạn đánh giá cao về /mail-box chứ?', components: [buttonRow4] });
                await devChannel.send({ content: 'Câu hỏi 5: Tôi thích các game mà bot BRB Studio có', components: [buttonRow5] });
                await devChannel.send({ content: 'Câu hỏi 6: Lệnh `/game-iq` là lệnh gì ?', components: [buttonRow6] });
                await devChannel.send({ content: 'Câu hỏi 7: Lệnh `?qr` có mấy lệnh phụ ?.', components: [buttonRow7] });
                await devChannel.send({ content: 'Câu hỏi 8: Muốn kiểm tra phiên bản của bot thì dùng lệnh gì ?', components: [buttonRow8] });
                await devChannel.send({ content: 'Câu hỏi 9: Lệnh `/mail-box` dùng để làm gì?.', components: [buttonRow9] });
                await devChannel.send({ content: 'Câu hỏi 10: Bot BRB Studio có bao nhiêu cách thiết lập lời chào mừng thành viên mới tham gia máy chủ', components: [buttonRow10] });

                const filter = interaction => interaction.customId.startsWith('q');
                const collector = devChannel.createMessageComponentCollector({ filter, time: 300000 }); // 1800000

                const userResponses = {}; // Lưu câu trả lời theo từng người dùng trong mỗi máy chủ

                collector.on('collect', async (interaction) => {
                    const guildId = guild.id;
                    const userId = interaction.user.id;
                    const displayName = interaction.member.displayName; // Lấy displayName của người dùng
                    // const questionId = interaction.customId.charAt(1); // '1', '2', '3', để phân biệt câu hỏi
                    const questionId = interaction.customId.match(/\d+/)[0]; // Lấy phần số của customId


                    // Tạo cấu trúc lưu cho từng máy chủ nếu chưa có
                    if (!userResponses[guildId]) {
                        userResponses[guildId] = {};
                    }

                    // Kiểm tra nếu người dùng đã trả lời câu hỏi này trong máy chủ hiện tại chưa
                    if (!userResponses[guildId][userId]) {
                        userResponses[guildId][userId] = { displayName: displayName, responses: [] };
                    }

                    // Kiểm tra nếu người dùng đã trả lời câu hỏi này
                    if (userResponses[guildId][userId].responses.some(res => res.questionId === questionId)) {
                        return interaction.reply({ content: 'Bạn đã trả lời câu hỏi này rồi.', ephemeral: true });
                    }

                    // Xử lý câu trả lời
                    let status = 'Sai';
                    let responseMessage = '';
                    if (interaction.customId === 'q1_c' || interaction.customId === 'q2_b' || interaction.customId === 'q3_a' || interaction.customId === 'q4_e' || interaction.customId === 'q5_d' || interaction.customId === 'q6_a' || interaction.customId === 'q7_c' || interaction.customId === 'q8_b' || interaction.customId === 'q9_e' || interaction.customId === 'q10_a') {
                        status = 'Đúng';
                    }

                    // Phân loại phản hồi riêng biệt theo câu hỏi và nút đã chọn
                    switch (interaction.customId) {
                        // Câu hỏi 1
                        case 'q1_c':
                            status = 'Đúng';
                            responseMessage = 'Cảm ơn bạn đã thích các lệnh prefix, chúng tôi sẽ có cập nhật thêm trong tương lai';
                            break;
                        case 'q1_a': case 'q1_b': case 'q1_d': case 'q1_e':
                            responseMessage = 'Cảm ơn bạn đã tham gia cuộc khảo sát các lệnh prefix, chúng tôi sẽ cải thiện trong tương lai';
                            break;

                        // Câu hỏi 2
                        case 'q2_b':
                            status = 'Đúng';
                            responseMessage = 'Cảm ơn bạn đã thích lệnh /commands-bot, chúng tôi sẽ có thêm các lệnh khác trong tương lai';
                            break;
                        case 'q2_a': case 'q2_c': case 'q2_d': case 'q2_e':
                            responseMessage = 'Cảm ơn bạn đã tham gia cuộc khảo sát lệnh /commands-bot, chúng tôi sẽ có những thay đổi trong tương lai để phù hợp hơn';
                            break;

                        // Câu hỏi 3
                        case 'q3_a':
                            status = 'Đúng';
                            responseMessage = 'Cảm ơn bạn đã thích lệnh lệnh /commands-new, chúng tôi sẽ có thêm các lệnh khác trong tương lai';
                            break;
                        case 'q3_b': case 'q3_c': case 'q3_d': case 'q3_e':
                            responseMessage = 'Cảm ơn bạn đã tham gia cuộc khảo sát lệnh lệnh /commands-new, chúng tôi sẽ có những thay đổi trong tương lai để phù hợp hơn';
                            break;
                        
                        // Câu hỏi 4
                        case 'q4_e':
                            status = 'Đúng';
                            responseMessage = 'Cảm ơn bạn đã đánh giá cao về /mail-box';
                            break;
                        case 'q4_a': case 'q4_b': case 'q4_c': case 'qd_e':
                            responseMessage = 'Cảm ơn bạn đã đánh giá cao về /mail-box, chúng tôi sẽ có xem xét kết quả của cuộc khảo sát để cải thiện tốt hơn nếu cần';
                            break;

                        // Câu hỏi 5
                        case 'q5_d':
                            status = 'Đúng';
                            responseMessage = 'Cảm ơn bạn đã thích các game mà bot BRB Studio có, nếu có game nào thú vị mà không đụng hàng có thể dùng lệnh \`\`\`/mailbox\`\`\` để gửi về cho chúng tôi';
                            break;
                        case 'q5_a': case 'q5_b': case 'q5_c': case 'q5_e':
                            responseMessage = 'Cảm ơn bạn đã tham gia cuộc khảo sát thích các game mà bot BRB Studio có, đây là những game mà mọi bot trên thị trường không có, chúng tôi sẽ tiếp tục thêm trong tương lai';
                            break;

                        // Câu hỏi 6
                        case 'q6_a':
                            status = 'Đúng';
                            responseMessage = 'Bạn đã trả lời đúng rồi, đây là cuộc khảo sát để chúng tôi cải thiện bot tốt hơn trong tương lai';
                            break;
                        case 'q6_b': case 'q6_c': case 'q6_d': case 'q6_e':
                            responseMessage = 'Lệnh `/game-iq là Trò chơi đấu trí IQ, có vẻ như bạn ít chơi game này nhỉ';
                            break;
                            
                        // Câu hỏi 7
                        case 'q7_c':
                            status = 'Đúng';
                            responseMessage = 'Đúng rồi, lệnh `?qr` có 3 lệnh phụ bao gồm lệnh \`\`\`?qr setup\`\`\`: lưu mã qr của bạn vào dữ liệu của chúng tôi, \`\`\`?qr send\`\`\`: gửi mã qr cho mọi người trong máy chủ, \`\`\`?qr delete\`\`\`: xóa dữ liệu mã qr cũ để thay mã qr mới.';
                            break;
                        case 'q7_a': case 'q7_b': case 'q7_d': case 'q7_e':
                            responseMessage = 'Sai rồi, lệnh `?qr` có 3 lệnh bao gồm lệnh \`\`\`?qr setup\`\`\`: lưu mã qr của bạn vào dữ liệu của chúng tôi, \`\`\`?qr send\`\`\`: gửi mã qr cho mọi người trong máy chủ, \`\`\`?qr delete\`\`\`: xóa dữ liệu mã qr cũ để thay mã qr mới';
                            break;

                        // Câu hỏi 8
                        case 'q8_b':
                            status = 'Đúng';
                            responseMessage = 'Đúng rồi, cuộc khảo sát này sẽ giúp bot có hướng đi tốt hơn trong tương lai';
                            break;
                        case 'q8_a': case 'q8_c': case 'q8_d': case 'q8_e':
                            responseMessage = 'Sai rồi, để kiểm tra phiên bản của bot thì dùng lệnh \`\`\`/version-bot\`\`\`';
                            break;

                        // Câu hỏi 9
                        case 'q9_e':
                            status = 'Đúng';
                            responseMessage = 'Đúng rồi, cuộc khảo sát này sẽ giúp bot có hướng đi tốt hơn trong tương lai';
                            break;
                        case 'q9_a': case 'q9_b': case 'q9_c': case 'q9_d':
                            responseMessage = 'Sai rồi, với lệnh \`\`\`/mail-box\`\`\` bạn có thể gửi phản hồi về bot như lỗi, đóng góp ý kiến...v.v, về cho chúng tôi, và chúng tôi sẽ xem xét để giải quyết vấn đề mà bạn đề cập trong thời gian sớm nhất.';
                            break;

                        // Câu hỏi 10
                        case 'q10_a':
                            status = 'Đúng';
                            responseMessage = 'Đúng rồi, cuộc khảo sát này sẽ giúp bot có hướng đi tốt hơn trong tương lai. Nếu bạn muốn đóng góp ý kiến có thể dùng lệnh \`\`\`/mailbox\`\`\`';
                            break;
                        case 'q10_b': case 'q10_c': case 'q10_d': case 'q10_e':
                            responseMessage = 'Sai rồi, bot **BRB Studio** có 3 cách thiết lập lời chào mừng thành viên mới tham gia máy chủ, bạn có thể dùng lệnh \`\`\`/welcome-default\`\`\` hoặc \`\`\`/welcome-default\`\`\`/welcome-setup\`\`\`';
                            break;

                        default:
                            responseMessage = 'Phản hồi không xác định, vui lòng thử lại!';
                    }

                    // Lưu câu trả lời của người dùng
                    userResponses[guildId][userId].responses.push({
                        questionId: questionId, // Lưu ID câu hỏi
                        question: interaction.message.content,
                        answer: interaction.customId,
                        status: status
                    });

                    await interaction.reply({ content: responseMessage, ephemeral: true }); // status === 'Đúng' ? 'Câu trả lời của bạn là chính xác!' : 'Câu trả lời của bạn không đúng!'
                });

                collector.on('end', async () => {

                    // Chuẩn bị dữ liệu để lưu vào MongoDB
                    for (const [guildId, users] of Object.entries(userResponses)) {
                        for (const [userId, userData] of Object.entries(users)) {
                            const correctCount = userData.responses.filter(r => r.status === 'Đúng').length;
                    
                            // Lưu mỗi người dùng với thông tin chi tiết về câu trả lời trong máy chủ hiện tại
                            await KsModel.create({
                                guildId: guildId,
                                guildName: guild.name,
                                userId: userId,
                                displayName: userData.displayName, // Lưu displayName
                                correctAnswers: correctCount,
                                questions: userData.responses
                            });
                        }
                    }
                    // devChannel.send(`Khảo sát đã kết thúc! Đã thu thập ${Object.keys(userResponses[guild.id] || {}).length} người tham gia trong máy chủ này.`);

                });
                
                // Chờ 2 phút trước khi xóa kênh
                setTimeout(async () => {
                    await devChannel.delete().catch(console.error); // Xóa kênh sau 2 phút
                }, 2 * 60 * 1000); // 3 ngày.... còn 2 phút = 2 * 60 * 1000 ms
            }
        }

    },
};
