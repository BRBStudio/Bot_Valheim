const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("AI TIẾNG ANH")
        .setType(ApplicationCommandType.Message),
    
    description: 
        `🔹 Nhấn chuột phải vào tin nhắn, chọn app (ứng dụng)\n` +
        `       sau đó chọn 'AI TIẾNG ANH' từ menu, tôi sẽ dịch giúp bạn\n` +
        `       từ tiếng việt --> tiếng anh.`,
    async execute(interaction) {
        }
    }