const { Schema, model } = require('mongoose');

const Vote_open_valheimSchema = new Schema({
    Msg: { type: String, required: true }, // ID tin nhắn bỏ phiếu
    TotalVotes: { type: Number, default: 0 }, // Số phiếu hiện tại
    Server: { type: String, required: true },
    Code: { type: String, required: true },
    Vote_request: { type: Number, default: 0 }, // số phiếu yêu cầu cần thiết
    Guild: { type: String, required: true }, // ID máy chủ để phân biệt dữ liệu
    Owner: { type: String, required: true }, // ID của người tạo bỏ phiếu
    Voters: { type: Array, default: [] }, // Danh sách ID người đã bỏ phiếu
    createdAt: { type: Date, default: Date.now, expires: 7776000 } // Tự động xóa sau 30 ngày 2592000 || 1 phút 60 || 3 tháng 7776000 || 1 năm 31536000
}, 
{ collection: 'Bỏ phiếu mở server Valheim' });

module.exports = model('Vote_open_valheim', Vote_open_valheimSchema);
