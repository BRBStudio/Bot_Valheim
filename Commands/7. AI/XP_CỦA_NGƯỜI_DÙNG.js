const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("XP CỦA NGƯỜI DÙNG")
        .setType(ApplicationCommandType.User),

    description: 
        `🔹 Nhấn chuột phải vào một thành viên và chọn app (ứng dụng)\n` +
        `       sau đó chọn 'XP CỦA NGƯỜI DÙNG' để xem thông tin xp của\n` +
        `       người dùng.`,
    async execute(interaction) {
        }
    }