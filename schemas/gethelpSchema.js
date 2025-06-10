const { Schema, model } = require('mongoose');

const gethelpSchema = new Schema({
    serverId: String,
    userIds: [String] // Mảng lưu nhiều userId
});

module.exports = model('gethelpSchema', gethelpSchema);