const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("AI LẤY TRỘM EMOJI")
        .setType(ApplicationCommandType.Message),

    description: 
        `🔹 Nhấn chuột phải vào tin nhắn chứa emoji, chọn app\n` +
        `       (ứng dụng),sau đó chọn 'AI LẤY TRỘM EMOJI' từ menu để\n` +
        `       sử dụng lệnh.`,
    async execute(interaction) {
        }
    }