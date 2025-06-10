const { Schema, model } = require('mongoose');

let warningSchema = new Schema({
    GuildName: String,
    GuildID: String,
    DisplayName: String,
    UserID: String,
    UserTag: String,
    nộidung: [
        {
            ExecuterId: String,
            ExecuterTag: String,
            Reason: String,
            WarnID: String,
            Timestamp: { type: Number, default: () => Date.now() },
            Edits: [
                {
                    EditedByExecuterId: String,
                    EditedByExecuterTag: String,
                    OldReason: String,
                    NewReason: String,
                    EditTimestamp: { type: Number, default: () => Date.now() } 
                }
            ]
        }
    ]
},
    { collection: 'Cảnh báo' }
);
 
module.exports = model("warnTutorial", warningSchema);
