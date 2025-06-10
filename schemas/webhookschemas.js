const mongoose = require('mongoose');

/*
    DÙNG VỚI LỆNH WH (wh.js trong thư mục 0. DEV)
    VÀ SỰ KIỆN mod_valheim1.js
*/

const webhookSchema = new mongoose.Schema({
    guildId: { type: String, unique: true },
    url: { type: String, required: true, unique: true },
    addedAt: { type: Date, default: Date.now }
},
    { collection: 'Webhook' }
);

module.exports = mongoose.model('ValheimWebhook', webhookSchema);
