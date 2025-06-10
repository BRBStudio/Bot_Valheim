const { model, Schema } = require('mongoose');

const AFKSchema = new Schema({
    guildId: { type: String, required: true }, // userId: { type: String, required: true },
    previousChannelId: { type: String, default: null }, // ID kênh thoại trước khi bị di chuyển vào AFK
    isAFK: { type: Boolean, default: false }, // Trạng thái người dùng có AFK hay không
    event: { type: String, required: true }, // Tên sự kiện, ví dụ: voiceStateUpdate
    Ghi_chú: { type: String, default: '' }, // Mô tả trạng thái
    isEnabled: { type: Boolean, default: true }, // Bật/tắt tính năng
}, {
    collection: 'Trạng Thái AFK'
});

module.exports = model('AFKStatus', AFKSchema);

