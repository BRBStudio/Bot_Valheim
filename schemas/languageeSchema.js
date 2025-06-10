const { model, Schema } = require("mongoose");

// Schema để lưu ngôn ngữ cho các lệnh
let languageSchema = new Schema({
    commandName: { type: String, required: true, unique: true }, // Tên lệnh
    language: { type: String, required: true }, // Ngôn ngữ
}, 
{ collection: 'Chuyển đổi' } // Tên collection trong MongoDB
);

module.exports = model("Language", languageSchema); 
