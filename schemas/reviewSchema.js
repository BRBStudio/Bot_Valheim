// thiết lập đánh giá guild
const { model, Schema} = require("mongoose");
 
let revSchema = new Schema({
    Channel: String,
    Guild: String,
});
 
module.exports = model("revSchema", revSchema);