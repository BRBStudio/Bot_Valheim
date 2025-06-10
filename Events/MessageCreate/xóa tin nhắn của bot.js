// module.exports = {
//     name: 'messageCreate',
//     async execute(message) {
//         // Kiểm tra nếu tin nhắn không phải do bot gửi thì bỏ qua
//         if (!message.author.bot || !message.guild) return;

//         // Danh sách ID các bot không muốn xóa tin nhắn
//         const IDBot = [
//             '1268569140466028649', // Bot BRB STUDIO
//             '1174576448829411328', // Bot Youtube
//             '1254906517954625678', // Bot kênh thoại brb
//             '1225688454835474483'  // Bot kể truyện 24/7
//         ];

//         // Nếu bot nằm trong danh sách ngoại lệ, không xóa tin nhắn
//         if (IDBot.includes(message.author.id)) return;

//         // Xóa tin nhắn nếu bot không nằm trong danh sách ngoại lệ
//         await message.delete().catch(err => console.error('Lỗi khi xóa tin nhắn:', err));
//     },
// };
