const { model, Schema } = require('mongoose');

// Định nghĩa schema cho số lượng tin nhắn dùng cho lệnh top.js
const messageSchema = new Schema({
    guildId: { type: String, required: true }, // ID của guild (máy chủ)
    guildName: { type: String, required: true }, // Tên của guild (máy chủ)
    userId: { type: String, required: true }, // ID của người dùng
    displayName: { type: String, required: true }, // Tên hiển thị của người dùng
    numberMessages: { type: Number, required: true, default: 0 }, // Số lượng tin nhắn
}, 
    { collection: 'Số lượng tin nhắn' } // Tên collection trong MongoDB
);

module.exports = model('MessageCount', messageSchema);
