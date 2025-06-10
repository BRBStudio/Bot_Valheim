const { model, Schema } = require('mongoose');

// Định nghĩa schema cho tham gia trò chơi
const joingameSchema = new Schema({
    guildId: { type: String, required: true }, // ID của guild (máy chủ)
    guildName: { type: String, required: true }, // Tên của guild (máy chủ)
    userId: { type: String, required: true }, // ID của người dùng đã tạo
    displayName: { type: String, required: true }, // Tên hiển thị của người dùng
    title: { type: String, required: true }, // Tiêu đề của trò chơi
    Listjoin: { type: Array, default: [] }, // Danh sách người dùng đã tham gia
    time: { type: String, required: true }, // Thời gian đăng kí
    totalUsers: { type: Number, default: 0 }, // Tổng số người đã đăng kí
    maxUsers: { type: Number, default: 20 }, // Số lượng tối đa người tham gia
    createdAt: { type: Date, default: Date.now, expires: 31536000 } // Tự động xóa sau 30 ngày 2592000 || 1 phút 60 || 3 tháng 7776000 || 1 năm 31536000
},
    { collection: 'Join Game' } // Tên collection trong MongoDB  
);

module.exports = model('joingame', joingameSchema);