// schemas/useAISchema.js
const mongoose = require('mongoose');

/*
	* Các mã liên quan:
		- bot_ai.js.js trong thư mục Commands dùng để setting câu hỏi, câu trả lời, cũng như link kênh
		- AI_brb.js trong thư mục Events
		- answerSchema.js trong thư mục schemas dùng để lưu trữ câu hỏi, câu trả lời của từng người dùng, và lưu trữ id kênh (nếu nó)
*/

const userProfileSchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	nickname: { type: String }, // default: null
},
  { collection: `Người dùng AI`}
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
