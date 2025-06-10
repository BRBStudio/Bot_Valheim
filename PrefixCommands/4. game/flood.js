const { EmbedBuilder } = require(`discord.js`);
const BRB_Studio = require('../../utils/BRB_Studio');
const CommandStatus = require('../../schemas/Command_Status');
const economySystem = require('../../schemas/economySystem');

module.exports = {
    name: 'flood',
    description: 
        `🔸 Chơi trò chơi ĐỔI MÀU, có thể chọn cấp độ chơi.\n\n` +
        `🔸 Để xem hướng dẫn dùng \`\`\`?flood h\`\`\``,
    aliases: ['đm', 'g4'],
    async execute(msg, args) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?flood' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }
        // .toLowerCase() args[0] && args[0].toLowerCase()
        if (args[0] && args[0].toLowerCase() === 'h') {
            
            const helpEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Hướng Dẫn Chơi TRÒ CHƠI ĐỔI MÀU')
                .setDescription(
                    `**Cách Chơi:**\n` +
                    `- Mục tiêu của trò chơi là thay đổi màu sắc của tất cả các ô trên bảng thành cùng một màu.\n` +
                    `- Bạn sẽ chọn một màu từ các nút màu có sẵn.\n` +
                    `- Mới bắt đầu game, khi chọn mầu hãy chú ý tới ô đầu tiên.\n` +
                    `- Nếu tất cả các ô có cùng một màu sau khi bạn chọn, bạn sẽ thắng.\n` +
                    `- Nếu bạn hết lượt mà vẫn chưa thắng, bạn sẽ thua.\n\n` +
                    `**Giải Thích Số Lượt:**\n` +
                    `- Mỗi lần bạn chọn một màu, số lượt sẽ tăng lên 1.\n` +
                    `- Mục tiêu là làm cho tất cả các ô có cùng một màu trong số lượt cho phép.\n` +
                    `- Nếu bạn thắng, tin nhắn sẽ cho biết bạn đã thực hiện bao nhiêu lượt.\n` +
                    `- Nếu bạn thua, tin nhắn cũng sẽ cho biết số lượt bạn đã thực hiện.\n\n` +
                    `**Lưu Ý:**\n` +
                    `- Chỉ người chơi đã khởi động trò chơi mới có thể chọn màu.\n` +
                    `- Thời gian cho mỗi trò chơi là 60 giây (60.000 ms).`
                );

            return msg.channel.send({ embeds: [helpEmbed] });
        }

        // Kiểm tra tham số đầu vào để xác định cấp độ chơi
        let difficulty, timeoutTime, embedTitle, embedColor;

        // Lấy cấp độ chơi từ tham số
        const level = parseInt(args[0], 10);
        
        // Xác định độ khó, thời gian hết hạn và thông tin embed dựa trên cấp độ người dùng chọn
        if (level === 1) {
            difficulty = 5; // Độ khó cấp độ 1
            timeoutTime = 600000; // Thời gian 10 phút
            embedTitle = 'Cấp Độ 1: dễ'; // Tiêu đề cho cấp độ 1
            embedColor = 'Blue'; // Màu embed cho cấp độ 1 (xanh lá)
        } else if (level === 2) {
            difficulty = 10; // Độ khó cấp độ 2
            timeoutTime = 120000; // Thời gian 2 phút
            embedTitle = 'Cấp Độ 2: Khó'; // Tiêu đề cho cấp độ 2
            embedColor = 'Orange'; // Màu embed cho cấp độ 2 (cam)
        } else if (level === 3) {
            difficulty = 13; // Độ khó cấp độ 3
            timeoutTime = 60000; // Thời gian 1 phút
            embedTitle = 'Cấp Độ 3: Siêu khó'; // Tiêu đề cho cấp độ 3
            embedColor = 'Red'; // Màu embed cho cấp độ 3 (đỏ cam)
        } else {
            // Nếu không có cấp độ hợp lệ, gửi thông báo lỗi
            return msg.channel.send('Vui lòng chọn cấp độ chơi hợp lệ: `1`, `2`, hoặc `3`.');
        }

        // Tạo một đối tượng floodGame từ class BRB_Studio với các tùy chọn trò chơi
        const floodGame = new BRB_Studio({
            isSlashGame: false, // Đặt false nếu không dùng lệnh slash
            message: msg, // Tin nhắn từ người dùng
            embed: {
                title: embedTitle, // Tiêu đề hiển thị theo cấp độ
                color: embedColor // Màu của embed theo cấp độ
            },
            difficulty: difficulty, // Mức độ khó của trò chơi
            timeoutTime: timeoutTime, // Thời gian hết hạn (ms)
            buttonStyle: 'Primary', // Kiểu nút
            winMessage: 'Bạn đã thắng! Bạn đã thực hiện **{turns}** lượt.', // Tin nhắn khi thắng
            loseMessage: 'Bạn đã thua! Bạn đã thực hiện **{turns}** lượt.', // Tin nhắn khi thua
            playerOnlyMessage: 'Chỉ có {player} mới có thể chơi trò chơi này.' // Thông báo chỉ dành cho người chơi
        });

        // Bắt đầu trò chơi
        return floodGame.startGame(); // Gọi phương thức để bắt đầu trò chơi
    }
};






































































// const { EmbedBuilder } = require(`discord.js`);
// const BRB_Studio = require('../../ButtonPlace/BRB_Studio');

// module.exports = {
//     name: 'flood', // flood doi mau
//     description: 'Chơi trò chơi ĐỔI MẦU',
//     aliases: ['fl', 'fd'],
//     async execute(msg, args) {

//         // console.log('Bắt đầu thực thi lệnh flood'); // Log để kiểm tra lệnh bắt đầu

//         if (args[0] === 'help') {
//             // Tạo embed hướng dẫn
//             const helpEmbed = new EmbedBuilder()
//                 .setColor('#5865F2') // Màu của embed
//                 .setTitle('Hướng Dẫn Chơi TRÒ CHƠI ĐỔI MÀU')
//                 .setDescription(
//                     `**Cách Chơi:**\n` +
//                     `- Mục tiêu của trò chơi là thay đổi màu sắc của tất cả các ô trên bảng thành cùng một màu.\n` +
//                     `- Bạn sẽ chọn một màu từ các nút màu có sẵn.\n` +
//                     `- Mới bắt đầu game, khi chọn mầu hãy chú ý tới ô đầu tiên.\n` +
//                     `- Nếu tất cả các ô có cùng một màu sau khi bạn chọn, bạn sẽ thắng.\n` +
//                     `- Nếu bạn hết lượt mà vẫn chưa thắng, bạn sẽ thua.\n\n` +

//                     `**Giải Thích Số Lượt:**\n` +
//                     `- Mỗi lần bạn chọn một màu, số lượt sẽ tăng lên 1.\n` +
//                     `- Mục tiêu là làm cho tất cả các ô có cùng một màu trong số lượt cho phép.\n` +
//                     `- Nếu bạn thắng, tin nhắn sẽ cho biết bạn đã thực hiện bao nhiêu lượt.\n` +
//                     `- Nếu bạn thua, tin nhắn cũng sẽ cho biết số lượt bạn đã thực hiện.\n\n` +

//                     `**Lưu Ý:**\n` +
//                     `- Chỉ người chơi đã khởi động trò chơi mới có thể chọn màu.\n` +
//                     `- Thời gian cho mỗi trò chơi là 60 giây (60.000 ms).`
//                 );

//             // Gửi embed hướng dẫn
//             // console.log('Gửi embed hướng dẫn'); // Log để kiểm tra gửi embed
//             return msg.channel.send({ embeds: [helpEmbed] });
//         }

//         // Tạo một đối tượng floodGame từ class Flood với các tùy chọn trò chơi
//         // console.log('Tạo đối tượng floodGame'); // Log để kiểm tra tạo floodGame
//         const floodGame = new BRB_Studio({
//             isSlashGame: false, // Đặt false nếu không dùng lệnh slash
//             message: msg, // Tin nhắn từ người dùng
//             embed: {
//                 title: 'TRÒ CHƠI ĐỔI MẦU', // Tiêu đề hiển thị
//                 color: '#5865F2' // Màu của embed
//             },
//             difficulty: 13, // Mức độ khó của trò chơi (kích thước bảng)
//             timeoutTime: 60000, // Thời gian hết hạn (ms)
//             buttonStyle: 'Primary', // Kiểu nút
//             winMessage: 'Bạn đã thắng! Bạn đã thực hiện **{turns}** lượt.', // Tin nhắn khi thắng
//             loseMessage: 'Bạn đã thua! Bạn đã thực hiện **{turns}** lượt.', // Tin nhắn khi thua
//             playerOnlyMessage: 'Chỉ có {player} mới có thể chơi trò chơi này.' // Thông báo chỉ dành cho người chơi
//         });

//         // Bắt đầu trò chơi
//         // console.log('Bắt đầu trò chơi'); // Log để kiểm tra bắt đầu trò chơi
//         await floodGame.startGame();
//         // console.log('Trò chơi đã bắt đầu'); // Log để kiểm tra khi trò chơi bắt đầu
//     },
// };







