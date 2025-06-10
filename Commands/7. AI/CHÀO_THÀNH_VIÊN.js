const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("CHÀO THÀNH VIÊN")
        .setType(ApplicationCommandType.User),

    description: 
        `🔹 Nhấn chuột phải vào một thành viên và chọn app (ứng dụng)\n` +
        `       'CHÀO THÀNH VIÊN' để gửi lời chào thân thiện đến họ.`,
    async execute(interaction) {
        }
    }