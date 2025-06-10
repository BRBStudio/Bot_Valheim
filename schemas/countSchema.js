// const { model, Schema } = require('mongoose');

// let countSchema = new Schema({
//     Guild: String,
//     CategoryId: String,
//     Channels: [
//         {
//             name: String,
//             id: String,
//         }
//     ],
// });

// module.exports = model('countSchema', countSchema);



const { model, Schema } = require('mongoose');

let countSchema = new Schema({
    Guild: String,
    CategoryId: String,
    Channels: [
        {
            name: String,
            id: String,
        }
    ],
    MemberCount: { type: Number, default: 0 },
    BanCount: { type: Number, default: 0 },
    BotCount: { type: Number, default: 0 },
    BoostCount: { type: Number, default: 0 }
});

module.exports = model('countSchema', countSchema);
