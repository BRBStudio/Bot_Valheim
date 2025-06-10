const { model, Schema } = require("mongoose");

//  Được sử dụng để lưu trữ thông tin về người dùng đã xác thực trong một máy chủ nhất định.
let verifyusersSchema = new Schema({
    Guild: String,  // ID của máy chủ (Guild)
    GuildName: String,
    Key: String,    // Mã CAPTCHA
    User: String,   // ID của người dùng
    displayName: String
},
    { collection: 'Captcha tùy chỉnh đã hoàn thành' }
);

// Được sử dụng để lưu trữ thông tin về CAPTCHA.
let captchaSchema = new Schema({
    Guild: String,   // ID của máy chủ (Guild)
    GuildName: String, // tên máy chủ 
    Key: String,     // Mã CAPTCHA
    User: String,    // ID của người dùng
    displayName: String, // tên người dùng
    Verified: Array,  // Danh sách người dùng đã được xác thực
    attempts: { type: Number, default: 0 }, // Số lần thử
    completed: { type: Boolean, default: false }, // Trạng thái hoàn thành
},
    { collection: 'Captcha tùy chỉnh chưa hoàn thành' }
);

// Tạo model từ các schema
const VerifyUsers = model("verifyusers_ct", verifyusersSchema); // Model cho danh sách người dùng đã xác thực
const Captcha = model("Captcha_ct", captchaSchema); // Model cho CAPTCHA

// Xuất cả các model để sử dụng ở nơi khác
module.exports = {
    VerifyUsers,
    Captcha
};