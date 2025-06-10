const { Schema, model } = require('mongoose');

// Định nghĩa schema cho giveaways
const giveaways = new Schema({
    Guild: String,  // ID máy chủ
    Host: String,   // ID người tổ chức
    Channel: String, // ID kênh
    MessageID: String, // ID tin nhắn giveaway
    Title: String,   // Phần thưởng của giveaway
    Color: String,   // Màu embed
    Bcolor: String,  // Màu viền embed
    Reaction: String, // Phản ứng cho giveaway
    Winners: Number, // Số người chiến thắng
    Time: String,    // Thời gian tặng quà
    Date: Date,      // Ngày kết thúc
    EndTime: Number, // Thời gian kết thúc gốc (dạng timestamp)
    PausedAt: Number, // Thời gian khi tạm dừng (dạng timestamp)
    Users: [String], // Người dùng tham gia giveaway
    Ended: Boolean,   // Trạng thái kết thúc hay chưa
    WinnerCount: Number, // Số người chiến thắng
    TimeStamps: [Number], // Mảng để lưu các timestamp của mỗi giveaway
    Paused: { type: Boolean, default: false }, // Trạng thái tạm dừng
    RemainingTime: { type: Number, default: 0 }, // Thời gian còn lại
},
    { collection: `GiveAways`}
);

// Xuất mô hình giveaway
module.exports = model('giveaways', giveaways);
