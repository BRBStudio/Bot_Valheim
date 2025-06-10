/*
dùng lưu thông tin cho lệnh mailbox.js
*/
const { Schema, model } = require('mongoose');

const mailboxSchema = new Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    guildId: { type: String, required: true },
    option: { type: String, required: true },
    feedback: { type: String, required: true },
    resolved: { type: Boolean, default: false },
},
    { collection: 'Mailbox' }
);

module.exports = model('Mailbox', mailboxSchema);