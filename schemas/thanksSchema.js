// thiết lập /tks người dùng
const { model, Schema } = require ('mongoose');

let thanksSchema = new Schema({
    User: String,
    Thanks: Number,
    Messages: [String],
    Guild: String,
    // Thêm các trường mới để lưu thông tin cấu hình vai trò
    RoleSetup: {
        role10: String, // ID của vai trò khi đạt 10 Thanks
        role20: String, // ID của vai trò khi đạt 20 Thanks
        role30: String  // ID của vai trò khi đạt 30 Thanks
    }
})

module.exports = model('thanksSchema', thanksSchema);