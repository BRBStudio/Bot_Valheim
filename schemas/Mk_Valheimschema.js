const { model, Schema } = require(`mongoose`);

// Định nghĩa schema để lưu dữ liệu mật khẩu cho lệnh /mk
const MkvalheimSchema = new Schema({
    Guild: { type: String, required: true },
    password: { type: String, required: true }
}, 
    { collection: 'Mk Valheim', } // thêm versionKey: false để loại bỏ __v trong mongoDB
);

module.exports = model("Mkvalheim", MkvalheimSchema);
