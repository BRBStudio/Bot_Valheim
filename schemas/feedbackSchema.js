const { Schema, model } = require('mongoose');

// Định nghĩa schema cho cấu hình kênh phản hồi
const feedbackChannelSchema = new Schema({
    guildId: String,
    channelId: String,
});

module.exports = model('FeedbackChannel', feedbackChannelSchema);