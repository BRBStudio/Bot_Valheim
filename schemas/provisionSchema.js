const mongoose = require('mongoose');

// Định nghĩa schema cho người từ chối điều khoản dịch vụ
const provisionSchema = new mongoose.Schema({
    guildName: { type: String, required: true },
    guildId: { type: String, required: true },
    userName: { type: String, required: true },
    userId: { type: String, required: true }, 
    addedBy: String,
    reason: String,
},
    { collection: 'TC Điều Khoản' }
);

const Provision = mongoose.model('provision', provisionSchema);

module.exports = Provision;