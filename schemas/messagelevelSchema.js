// // thiết lập tăng lv khi chát
// const { model, Schema } = require(`mongoose`);

// let levelSchema = new Schema({
//     Guild: String,
//     User: String,
//     XP: Number,
//     Level: Number,
//     Roles: { // Thêm trường Roles để lưu các vai trò theo thứ hạng
//         roles1: String,
//         roles2: String,
//         roles3: String,
//     },
// })

// module.exports = model("level", levelSchema)


// thiết lập tăng lv khi chát
const { model, Schema } = require(`mongoose`);

let levelSchema = new Schema({
    Guild: String,
    User: String,
    XP: Number,
    Level: Number,
    Rank: { type: Number, default: 0 }, // Thêm trường Rank, mặc định là 0
    Channels: { // Thêm trường Channels để lưu các kênh theo cấp độ
        channel1: String,
        channel2: String,
        channel3: String,
    },
    Levels: { // Thêm trường Levels để lưu cấp độ yêu cầu cho từng kênh
        level1: Number,
        level2: Number,
        level3: Number,
    },
})

module.exports = model("level", levelSchema)