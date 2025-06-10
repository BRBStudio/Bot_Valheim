const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    guildId: { type: String, required: true },  // ID của máy chủ
    userId: { type: String, required: true },   // ID của người dùng
    preferredLanguage: { type: String, default: 'vi' }  // Mặc định là tiếng Việt
});

module.exports = mongoose.model('Language', languageSchema);
