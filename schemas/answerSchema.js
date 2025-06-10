const mongoose = require('mongoose');

/*
	* Các mã liên quan:
        - AI_brb.js trong thư mục Events
        - bot_ai.js.js trong thư mục Commands dùng để setting câu hỏi, câu trả lời, cũng như link kênh
        - useAISchema.js trong thư mục schemas dùng để lưu tên người dùng
*/

const answerSchema = new mongoose.Schema({
    question: { type: String, required: true, lowercase: true, trim: true },
    answer: { type: String, required: true },
    channelId: { type: String }
},
    { collection: `Setup AI`}
);

module.exports = mongoose.model('Answer', answerSchema);
