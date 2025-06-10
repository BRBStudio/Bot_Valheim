const { model, Schema } = require('mongoose');

// Định nghĩa schema cho AutoMod
const autoModSchema = new Schema({
    guildId: { type: String, required: true }, // ID của guild (server)
    logChannelId: { type: String, default: null }, // ID của kênh nhật ký
    antiLinkChannels: { type: [String], default: [] }, // Thêm trường cho các kênh chống liên kết
    heatSettings: {
        limit: { type: Number, default: 5 }, // Giới hạn số hành động
        muteTime: { type: Number, default: 300 }, // Thời gian mute (s)
        difference: { type: Number, default: 10 }, // Sự khác biệt giữa các hành động (s)
    },
});

module.exports = model('AutoMod', autoModSchema);
