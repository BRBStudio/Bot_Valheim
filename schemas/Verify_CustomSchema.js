// dùng với lệnh /verification-custom và trong interactionCreate.js
const { model, Schema } = require('mongoose');

const createbuttonSchema = new Schema({
    guildId: String,
    buttonLabel: String, // tên nút
    namerolek: String, // ID vai trò
},
    { collection: 'Captcha nút' }
);

module.exports = model('CreateButton', createbuttonSchema);
