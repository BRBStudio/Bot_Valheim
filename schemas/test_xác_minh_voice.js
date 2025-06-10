const { Schema, model } = require('mongoose');

// dùng kết hợp với lệnh /verisay và nút veri_kk
const verifySchema = new Schema(
{
    guildid: {
        type: String,
        required: true,
    },
    auto: {
        verify: {
            channel: String,
            role: String,
            voice: String,
            message: String,
        },
    },
},
    { collection: 'test xác minh voice' }
);

// Tạo và xuất model
const guildsettings = model('GuildSettings', verifySchema);
module.exports = guildsettings;
