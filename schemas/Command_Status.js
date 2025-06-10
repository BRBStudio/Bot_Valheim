const { model, Schema } = require("mongoose");

let commandstatusSchema = new Schema({
    command: { type: String, required: true, unique: true }, // Lưu tên lệnh
    status: { type: String, enum: ['on', 'off'], required: true } // Lưu trạng thái lệnh
}, 
    { collection: 'Trạng thái lệnh' } 
);

module.exports = model("commandstatus", commandstatusSchema);
