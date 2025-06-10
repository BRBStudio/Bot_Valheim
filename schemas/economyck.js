// lưu thông tin chuyển khoản
const { model, Schema } = require("mongoose");

let economyckSchema = new Schema({
    GuildName: String,       // Tên máy chủ
    Guild: String,           // ID của máy chủ (Guild)
    SenderName: String,      // Tên người gửi
    SenderID: String,        // ID của người gửi
    ReceiverName: String,    // Tên người nhận
    ReceiverID: String,      // ID của người nhận
    Amount: Number,          // Số tiền chuyển
    Content: String,         // Nội dung chuyển khoản
    Description: String,    // 
    TransferTime: String    // Thời gian chuyển khoản
}, 
    { collection: 'economyck' }
);

module.exports = model("economyck", economyckSchema);
