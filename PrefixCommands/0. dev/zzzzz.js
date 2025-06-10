// const { BooleanQuestion, MultipleChoiceQuestion } = require('../../utils/questions');
// const KhaoSatBRB_Studio = require('../../utils/collect information');
// const { EmbedBuilder, ChannelType } = require (`discord.js`)
// const ks = new KhaoSatBRB_Studio();
// const ksModel = require(`../../schemas/ksSchema`);
// const config = require('../../config');

// module.exports = {
//     name: 'actual_survey',
//     description: '\`🔸 LỆNH DÀNH CHO DEV\`',
//     aliases: ['kss', 'test'],
    
//     async execute(msg, args) {

//         if (!config.specialUsers.includes(msg.author.id)) { 
//             return msg.channel.send("Bạn không có quyền sử dụng lệnh này!"); 
//         }

//         if (args[0].toLowerCase() === 'list') {
//             // Xác định ID máy chủ để truy vấn
//             const guildId = args[1] || msg.guild.id; // Nếu không có guildId trong args, sử dụng guildId hiện tại

//             // Lấy tất cả thông tin người dùng từ cơ sở dữ liệu MongoDB
//             try {
//                 const surveyData = await ksModel.find({ Guild: guildId }); // Truy vấn dữ liệu từ MongoDB

//                 // Kiểm tra xem có dữ liệu hay không
//                 if (surveyData.length === 0) {
//                     msg.channel.send("Không có thông tin khảo sát nào cho máy chủ này.");
//                     return;
//                 }

//                 // Tạo tin nhắn để gửi
//                 surveyData.forEach((user) => {
//                     // Tạo một embed cho từng người dùng
//                     const embed = new EmbedBuilder()
//                         .setTitle(`Thông tin khảo sát cho: ${user.displayName}`)
//                         .addFields(
//                             { name: 'Tên máy chủ', value: user.GuildName },
//                             { name: 'ID người dùng', value: user.User },
//                             { name: 'Điểm', value: user.score.toString() },
//                             { name: 'Số câu trả lời đúng', value: user.correctAnswers.toString() },
//                             { name: '\u200b', value: `\u200b` }
//                         );

//                     // Thêm câu hỏi và câu trả lời vào embed
//                     user.questions.forEach((q) => {
//                         embed.addFields({ name: `Câu hỏi: ${q.question}`, value: `Trả lời: ${q.answer} (${q.status})` });
//                     });

//                     // Gửi embed cho người dùng
//                     msg.channel.send({ embeds: [embed] }); // Sử dụng embeds để gửi
//                 });
//             } catch (error) {
//                 console.error("Lỗi khi truy vấn dữ liệu:", error);
//                 msg.channel.send("Đã xảy ra lỗi trong quá trình lấy dữ liệu khảo sát.");
//             }
//             return; // Kết thúc thực thi lệnh nếu là lệnh list
//         }


//         const customQuestions = [
//             // Câu hỏi 1: Câu hỏi Đúng/Sai về Bot BRB Studio
//             new BooleanQuestion()
//                 .setValue("Tôi rất thích cách trải nghiệm mà bot BRB Studio mang lại")
//                 .setCategory("Khảo sát người dùng")
//                 .setDifficulty('Dễ')
//                 .setCorrectAnswer('Đúng'),
            
//             // Câu hỏi 2: Câu hỏi Đúng/Sai về lệnh prefix
//             new BooleanQuestion()
//                 .setValue("Tôi thích các lệnh prefix")
//                 .setCategory("Trải nghiệm người dùng")
//                 .setDifficulty('Dễ')
//                 .setCorrectAnswer('đúng'),

//             // Câu hỏi 3: Câu hỏi Đúng/Sai về
//             new BooleanQuestion()
//                 .setValue("Tôi thích các lệnh trong lệnh /commands-bot")
//                 .setCategory("Trải nghiệm người dùng")
//                 .setDifficulty('Dễ')
//                 .setCorrectAnswer('đúng'),
            
//             // Câu hỏi 7: Câu hỏi Đúng/Sai về
//             new BooleanQuestion()
//                 .setValue("Tôi thích các lệnh trong lệnh /commands-new")
//                 .setCategory("Trải nghiệm người dùng")
//                 .setDifficulty('Dễ')
//                 .setCorrectAnswer('đúng'),
            
//             // Câu hỏi 9: Câu hỏi Đúng/Sai về CSS
//             new BooleanQuestion()
//                 .setValue("Tôi đánh giá cao về /mail-box")
//                 .setCategory("Trải nghiệm người dùng")
//                 .setDifficulty('Dễ')
//                 .setCorrectAnswer('đúng'),
            
//             // Câu hỏi 9: Câu hỏi Đúng/Sai về CSS
//             new BooleanQuestion()
//                 .setValue("Tôi thích các game của bot BRB Studio")
//                 .setCategory("Trải nghiệm người dùng")
//                 .setDifficulty('Dễ')
//                 .setCorrectAnswer('đúng'),


//             // Câu hỏi 2: Câu hỏi trắc nghiệm về Valheim
//             new MultipleChoiceQuestion()
//                 .setValue("Lệnh `/mail-box` dùng để làm gì?")
//                 .setCategory("")
//                 .setDifficulty('Bình thường')
//                 .setCorrectAnswer("Phản hồi về bot cho dev")
//                 .setIncorrectAnswers(["gửi thư", "không biết", "tôi không nhớ"]),

//             // Câu hỏi 4: Câu hỏi trắc nghiệm về Node.js
//             new MultipleChoiceQuestion()
//                 .setValue("Lệnh `/game-iq` là trò chơi gì ?")
//                 .setCategory("Khảo sát lệnh bot")
//                 .setDifficulty('Bình thường')
//                 .setCorrectAnswer("Trò chơi IQ")
//                 .setIncorrectAnswers(["Game bình thường", "Game iq", "Trò chơi trí tuệ"]),

            
//             // Câu hỏi 6: Câu hỏi trắc nghiệm về Python
//             new MultipleChoiceQuestion()
//                 .setValue("Lệnh `?qr` có mấy lệnh phụ ?")
//                 .setCategory("")
//                 .setDifficulty('Khảo sát lệnh bot')
//                 .setCorrectAnswer("3")
//                 .setIncorrectAnswers(["1", "9", "8"]),

            

//             // Câu hỏi 8: Câu hỏi trắc nghiệm về HTML
//             new MultipleChoiceQuestion()
//                 .setValue("Muốn kiểm tra phiên bản của bot thì dùng lệnh gì ?")
//                 .setCategory("Khảo sát lệnh bot")
//                 .setDifficulty('Khó')
//                 .setCorrectAnswer("bot-version")
//                 .setIncorrectAnswers(["không nhớ", "version-bot", "version-new"]),

            

//             // Câu hỏi 10: Câu hỏi trắc nghiệm về Git
//             new MultipleChoiceQuestion()
//                 .setValue("Bot BRB Studio có bao nhiêu cách thiết lập lời chào mừng thành viên mới tham gia máy chủ")
//                 .setCategory("Khảo sát lệnh bot")
//                 .setDifficulty('Khó')
//                 .setCorrectAnswer("2")
//                 .setIncorrectAnswers(["4", "1", "0"])
//         ];

//         ks.config.customQuestions = customQuestions; // Cấu hình câu hỏi tùy chỉnh
//         ks.startQueue(msg); // Bắt đầu khảo sát

//         // const sendSurvey = async (guild) => {
//         //     const surveyChannel = guild.channels.cache.find(
//         //         ch => ch.type === ChannelType.GuildText && ch.name === 'dev-thông-báo'
//         //     );
//         //     const targetChannel = surveyChannel || msg.channel;
//         //     await ks.startQueue({ ...msg, channel: targetChannel, guild });
//         // };

//         // msg.client.guilds.cache.forEach(guild => {
//         //     if (guild.available) {
//         //         sendSurvey(guild).catch(console.error);
//         //     }
//         // });
//     },
// };