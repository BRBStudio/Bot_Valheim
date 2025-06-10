// dùng trong lệnh /confess
const mongoose = require('mongoose');

const confessSchema = new mongoose.Schema({
  guild: { type: String, required: true }, // ID của máy chủ
  user: { type: String, required: true },  // ID của người dùng
  username: { type: String, required: true }, // Tên người dùng
  messageID: { type: String, required: true }, // ID tin nhắn
  message: { type: String, required: true }, // Nội dung tin nhắn
  timestamp: { type: Date, default: Date.now }, // Thời gian tạo
});

const Confess = mongoose.model('Confess', confessSchema);

module.exports = Confess;
