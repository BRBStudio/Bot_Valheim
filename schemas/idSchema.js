const { model, Schema } = require('mongoose');

const IDSchema = new Schema({ 
    guildId: { type: String, required: true },
    
},
    { collection: `id máy chủ` } 
);

module.exports = model('id', IDSchema);