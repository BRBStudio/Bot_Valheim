// mã này dùng cho wc.js trong events và welcome-default.js trong commands. thiết lập lời chào mừng thành viên mới
const mongoose = require("mongoose");
 
const welcomedefaultSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    defaultWelcomeActive: { type: Boolean, default: false },
    customWelcomeActive: { type: Boolean, default: false },
    imageURL: { type: String, default: null }
},
    { collection: 'Welcome_Default' }
);
 
module.exports = mongoose.model("Welcome-Default", welcomedefaultSchema);