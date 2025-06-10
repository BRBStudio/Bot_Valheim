const { model, Schema } = require('mongoose');

// Định nghĩa schema cho ticket
const ticketSchema = new Schema({
    Guild: { 
        type: String, 
        required: true 
    },
    Category: { 
        type: String, 
        required: true 
    },
    currentTicketNumber: {
        type: Number,
        default: 0
    },
    currentGameTicketNumber: { // Thêm trường mới cho số thứ tự vé game
        type: Number,
        default: 0
    },
    currentDiscordTicketNumber: { // Thêm trường mới cho số thứ tự vé discord
        type: Number,
        default: 0
    },
    roles: { // Thêm trường để lưu thông tin vai trò
        discord: [{
            id: String,
            name: String
        }],
        game: [{
            id: String,
            name: String
        }]
    }
},
    { collection: 'Ticket' }
);

module.exports = model('ticketschema', ticketSchema);
