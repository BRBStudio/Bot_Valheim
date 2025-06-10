const { model, Schema } = require('mongoose');

const GuildUpdateStatusSchema = new Schema({
    guildId: { type: String, required: true },
    event: { type: String, required: true }, // Tên sự kiện, ví dụ: voiceStateUpdate, guildMemberAdd
    Ghi_chú: { type: String, default: '' }, // ghi chú để phân biệt rõ chức năng, ví dụ: đọc tên bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại hoặc sự kiện khi người dùng afk trong kênh thoại voice
    isEnabled: { type: Boolean, default: true }, // Trạng thái bật/tắt
},
    { collection: `Trạng Thái Đọc` }
);

module.exports = model('GuildUpdateStatus', GuildUpdateStatusSchema);


