/*
Dùng với lệnh recruitment.js
*/
const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    tag: { type: String, required: true },
    icon: { type: String, required: true },
    reason: { type: String, required: true },
    age: { type: Number, required: true },
    valheimPosition: { type: String, default: null },
    discordPosition: { type: String, default: null },
    experience: { type: String, required: true },
    guildId: { type: String, required: true },
    guildName: { type: String, required: true },
    joinedAt: { type: Date, required: true },
    messageId: { type: String, required: true }
});

module.exports = mongoose.model('Recruitment', recruitmentSchema);
