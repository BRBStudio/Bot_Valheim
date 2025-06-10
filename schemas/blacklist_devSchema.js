// dùng với lệnh /blacklist_dev
const mongoose = require('mongoose');

const blacklist_devSchema = new mongoose.Schema({
    guildName: { type: String, required: true },
    guildId: { type: String, required: true },
    userName: { type: String, required: true },
    userId: { type: String, required: true }, 
    addedBy: String,
    reason: String,
},
    { collection: `Blacklist Dev` }
);

const Blacklist = mongoose.model('Blacklist_dev', blacklist_devSchema);

module.exports = Blacklist;