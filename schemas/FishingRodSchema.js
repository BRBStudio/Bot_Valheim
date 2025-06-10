const { model, Schema } = require("mongoose");

// Định nghĩa schema cho cần câu
const cancauSchema = new Schema({
    guildName: String,       // Tên máy chủ
    guildId: String,         // ID máy chủ
    userDisplayName: String, // Tên hiển thị người dùng
    userId: String,          // ID người dùng
    rodName: String,         // Tên cần câu
    quantity: Number,        // Số lượng cần câu
    purchaseDate: String,    // Thời gian mua (định dạng dd/mm/yyyy hh:mm:ss)
    unitPrice: Number,       // Giá mỗi cần câu
    totalPrice: Number       // Tổng giá tiền
}, 
    { collection: 'Cần câu cá' } // Tên bộ sưu tập
);

module.exports = model("FishingRod", cancauSchema);