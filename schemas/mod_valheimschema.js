const { model, Schema } = require('mongoose');

const mod_valheimSchema = new Schema({
  name: String,
  author: String,
  version: String,
  link: String,
  versionDate: String,
}, { collection: 'Mod_Valheim' });

module.exports = model("ModValheim", mod_valheimSchema);
