// dùng với lệnh /blacklist
const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    guildName: { type: String, required: true },
    guildId: { type: String, required: true },
    userName: { type: String, required: true },
    userId: { type: String, required: true }, 
    addedBy: String,
    reason: String,
},
    { collection: `Blacklist Owner` }
);

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;