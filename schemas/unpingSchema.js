const { model, Schema } = require('mongoose');

let unpingSchemas = new Schema({
    Guild: String, // Lưu ID của máy chủ
    User: String   // Lưu ID của người dùng
});

module.exports = model("unpingSchemas", unpingSchemas);
