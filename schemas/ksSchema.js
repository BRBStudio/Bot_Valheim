const { model, Schema } = require("mongoose");

// Định nghĩa schema cho khảo sát
let ksSchema = new Schema({
    GuildName: String,          // Tên máy chủ
    Guild: String,              // ID của máy chủ (Guild)
    displayName: String,        // Tên người dùng
    User: String,               // ID của người dùng
    questions: [{               // Mỗi đối tượng chứa câu hỏi và câu trả lời
        question: String,       // Câu hỏi
        answer: String,          // Câu trả lời
        status: String      // trạng thái (Đúng/Sai)
    }],
    score: Number,              // Điểm
    correctAnswers: Number       // Số câu trả lời đúng
}, { collection: 'Khảo Sát' });

module.exports = model("Khảo Sát", ksSchema);
