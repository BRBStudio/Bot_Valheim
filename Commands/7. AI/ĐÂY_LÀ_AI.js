const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("ĐÂY LÀ AI?")
        .setType(ApplicationCommandType.User),

    description: 
        `🔹 Nhấn chuột phải vào một thành viên và chọn app (ứng dụng)\n` +
        `       sau đó chọn 'ĐÂY LÀ AI?' để xem thông tin của người dùng.`,
    async execute(interaction) {
        }
    }