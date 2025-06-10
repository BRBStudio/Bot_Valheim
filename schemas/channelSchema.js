/*

mã này hoạt động với guildMemberRemove.js trong event và leave-guild trong commands khi thành viên rời khỏi guild

*/
const { model, Schema } = require(`mongoose`);

let channelSchema = new Schema({
    Guild: String,
    Channel: String,
})

module.exports = model("channel", channelSchema)