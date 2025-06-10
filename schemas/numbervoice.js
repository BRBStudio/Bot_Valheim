const { model, Schema } = require('mongoose');

// Định nghĩa schema cho thời gian tham gia kênh thoại dùng cho lệnh top.js
const voiceSchema = new Schema({
    guildId: { type: String, required: true }, // ID của máy chủ
    userId: { type: String, required: true }, // ID của người dùng
    displayName: { type: String, required: true }, // Tên hiển thị của người dùng
    TimeVoice: { type: Number, default: 0 }, // Tổng thời gian tham gia (tính bằng giây)
}, 
    { collection: 'Thời gian voice' } // Tên collection trong MongoDB
);

module.exports = model('VoiceTime', voiceSchema);
