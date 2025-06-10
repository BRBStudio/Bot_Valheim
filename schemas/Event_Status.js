// EventStatus.js
const { model, Schema } = require("mongoose");

let eventStatusSchema = new Schema({
    event: { type: String, required: true, unique: true }, // Lưu tên sự kiện
    status: { type: String, enum: ['on', 'off'], required: true } // Lưu trạng thái sự kiện
}, 
    { collection: 'Trạng thái sự kiện' } 
);

module.exports = model("EventStatus", eventStatusSchema);
