const mongoose = require('mongoose');

const guildPrefixSchema = new mongoose.Schema({
    serverName: {       // tên máy chủ
        type: String,
        required: true
    },
    guildId: {         // id máy chủ
        type: String,
        required: true,
        unique: true
    },
    userNickname: {   // tên người dùng displayName
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: '?'
    },
    isPrefixEnabled: { type: Boolean, default: true } // Mặc định bật prefix
},
    { collection: 'thay đổi lệnh tiền tố' }
);

module.exports = mongoose.model('GuildPrefix', guildPrefixSchema);
