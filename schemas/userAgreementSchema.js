const { Schema, model } = require('mongoose');

// Định nghĩa schema cho người dùng đã đồng ý với điều khoản dịch vụ
const userAgreementSchema = new Schema({
    userId: {
        type: String,
        required: true, // Bắt buộc phải có
        unique: true, // Phải là duy nhất
    },
    displayName: {
        type: String,
        required: true, // Bắt buộc phải có biệt danh của người dùng
    },
    guildId: {
        type: String,
        required: true, // ID máy chủ bắt buộc
    },
    guildName: {
        type: String,
        required: true, // Tên máy chủ bắt buộc
    },
    acceptedAt: {
        type: Date,
        default: Date.now, // Thời gian đồng ý, mặc định là thời điểm hiện tại
    }
},
    { collection: `Điều Khoản Bot`}
);

// Tạo mô hình từ schema
module.exports = model('UserAgreement', userAgreementSchema);
