// const { model, Schema } = require('mongoose');

// // Định nghĩa schema cho thống kê người dùng
// const userStatsSchema = new Schema({
//     guildId: { type: String, required: true }, // ID máy chủ
//     userId: { type: String, required: true },  // ID thành viên
//     username: { type: String, required: true }, // Tên người dùng
//     messageCount: { type: Number, default: 0 }, // Số lượng tin nhắn
//     voiceTime: { type: Number, default: 0 },    // Thời gian voice (đơn vị: phút)
// }, { collection: 'user_stats' }); // Tên collection trong MongoDB

// module.exports = model('UserStats', userStatsSchema);
