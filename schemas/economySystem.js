// mã này đã dùng trong lệnh `/economy` và lệnh `/game-iq`

// DisplayName: String, // Tên người dùng mới thêm, nếu lỗi thì bỏ
// GuildName: String, // Tên máy chủ mới thêm, nếu lỗi thì bỏ

const { model, Schema } = require("mongoose");

let economySystemSchema = new Schema({
    Guild: String,    
    User: String,
    Bank: Number,
    Wallet: Number,
    Worked: Number,
    Gambled: Number,
    Begged: Number,
    HoursWorked: Number,
    CommandsRan: Number,
    Moderated: Number,
    LastBegged: { type: Date, default: null },
    Debt: { type: Number, default: 0 }, // Thêm trường để lưu số tiền còn nợ
    DebtCount: { type: Number, default: 0 }, // Số lần nợ
    DisplayName: { type: String, default: '' }, // Biệt danh người dùng
    GuildName: { type: String, default: '' }, // Tên máy chủ
},
    { collection: 'economySystem' }
);

module.exports = model("economySystem", economySystemSchema);