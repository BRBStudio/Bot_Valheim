// schemas/Version.js
const { Schema, model } = require('mongoose');

const versionSchema = new Schema({
    botVersion: String,
},
    { collection: 'Version' }
);

module.exports = model('Version', versionSchema);
