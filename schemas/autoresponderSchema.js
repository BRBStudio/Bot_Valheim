// autoresponderSchema.js  thiết lâp bot sẽ trả lời câu hỏi của người dùng
const { model, Schema } = require('mongoose')

const autoresponderSchema = new Schema({
    guildId: String,
    questions: [String],
    answer: [String],

})

module.exports = model('autoresponder', autoresponderSchema)

/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
====================================================================*/