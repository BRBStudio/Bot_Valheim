const { model, Schema } = require("mongoose");

// Định nghĩa schema cho khảo sát
let ks = new Schema({
    guildId: String,              // ID của máy chủ (Guild)
    guildName: String,            // Tên máy chủ
    displayName: String,          // Tên hiển thị của người dùng
    userId: String,               // ID của người dùng
    correctAnswers: Number,       // Tổng số câu trả lời đúng
    questions: [{                 // Mỗi đối tượng chứa câu hỏi và câu trả lời
        question: String,         // Câu hỏi
        answer: String,           // Câu trả lời
        status: String            // Trạng thái (Đúng/Sai)
    }],
}, { collection: 'Khảo Sát Đang Dùng' });

module.exports = model("Khảo Sát Đang Dùng", ks);


