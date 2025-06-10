const { model, Schema } = require("mongoose");

// Schema lưu trữ dữ liệu người chơi
const caucaSchema = new Schema({
    guildId: { type: String, required: true }, // ID của máy chủ
    userId: { type: String, required: true }, // ID người chơi
    fishes: {
        rac: { type: Number, default: 0 }, // Số cá rác
        cute: { type: Number, default: 0 }, // Số cá thông thường
        condo: { type: Number, default: 0 }, // Số cá không phổ biến
        vip: { type: Number, default: 0 }, // Số cá hiếm
    },
}, 
    { collection: 'Game câu cá' }
);

module.exports = model("FishyGame", caucaSchema);

//balance: { type: Number, default: 50 }, // Số dư
