const { model, Schema } = require("mongoose");

let lsntSchema = new Schema({
    UserId: { type: String, required: true }, // ID người dùng được nạp tiền
    GuildId: { type: String, required: true }, // ID máy chủ
    GuildName: { type: String, required: true }, // Tên máy chủ
    displayName: { type: String, required: true }, // Tên hiển thị người dùng
    amount: { type: Number, required: true }, // Số tiền được nạp
    date: { type: Date, default: Date.now } // Thời gian nạp tiền
}, { collection: 'Lịch sử nạp tiền' });

module.exports = model("lsnt", lsntSchema);
