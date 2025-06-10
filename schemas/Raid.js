// schema/bannedUsers.js 
const mongoose = require('mongoose');

const bannedUsers = new mongoose.Schema({
	guildId: { type: String, required: true, unique: true }, // unique: true, required: true,
	enabled: { type: Boolean, default: false },
	// logChannelId: { type: String, default: null },
},
    { collection: 'Raid' }
);

module.exports = mongoose.model('AntiRaidConfig', bannedUsers);