const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("AI TIẾNG VIỆT")
        .setType(ApplicationCommandType.Message),
    
    description: 
        `🔹 Nhấn chuột phải vào tin nhắn, chọn app (ứng dụng)\n` +
        `       sau đó chọn 'AI TIẾNG VIỆT' từ menu, tôi sẽ dịch giúp bạn\n` +
        `       từ tiếng anh --> tiếng việt.`,
    async execute(interaction) {
        }
    }