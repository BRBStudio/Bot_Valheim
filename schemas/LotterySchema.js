// Import các module cần thiết
const { model, Schema } = require("mongoose");

// Định nghĩa schema cho xổ số
let LotterySchema = new Schema({
    Guild: String, // ID máy chủ
    User: String, // ID người dùng
    displayName: String, // Tên biệt danh người dùng
    betAmount: Number, // Số tiền đặt cược
    chosenNumber: String, // Số người dùng chọn
    chosenType: String,       // Loại cược: 'lg1' cho 2 số, 'lg2' cho 3 số
    betTime: String, // Thời gian đặt cược định dạng giờ Việt Nam
},
    { collection: 'Xổ số kiến thiết' }
);

module.exports = model("Lottery", LotterySchema);
