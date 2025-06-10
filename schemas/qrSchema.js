const { model, Schema } = require("mongoose");

let qrSchema= new Schema({
    GuildName: String, // tên máy chủ
    Guild: String,   // ID của máy chủ (Guild)
    displayName: String, // tên người dùng
    User: String,    // ID của người dùng
    imageURL: String, // lưu hình ảnh
},
    { collection: 'Mã QR' } 
);

module.exports = model("qr", qrSchema);
