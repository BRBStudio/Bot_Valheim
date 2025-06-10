const { Schema, model } = require("mongoose");

let todoSchema = new Schema({
    GuildID: String,
    UserID: String,
    Content: Array
});

module.exports = model("todoSchema", todoSchema);