const { SlashCommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder  } = require("discord.js");
const PollCord = require("pollcord");
const pollcord = PollCord.ShockBS
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("🔹 Tạo một cuộc thăm dò cấp thấp")
        // .setDescriptionLocalizations({"en-US": 'i love'})
        .addStringOption(o => o
            .setName("question")
            .setDescription("Câu hỏi cho cuộc thăm dò ý kiến")
            .setRequired(true))
        .addStringOption(o => o
            .setName("answers")
            .setDescription("Danh sách câu trả lời được phân tách bằng dấu phẩy cho cuộc thăm dò ý kiến")
            .setRequired(true))
        .addStringOption(o => o
            .setName("duration")
            .setDescription("Thời gian của cuộc thăm dò tính bằng giờ, tối đa là 48h")
            .setRequired(false)),
  
    async execute(interaction, client) {

        try {

                // Kiểm tra trạng thái của lệnh
                const commandStatus = await CommandStatus.findOne({ command: '/poll' });

                // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
                if (commandStatus && commandStatus.status === 'off') {
                    return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
                }

                const question = interaction.options.getString("question");
                const answers = interaction.options.getString("answers").split(",");
                const duration = parseInt(interaction.options.getString("duration")) || 7;

                // Kiểm tra nếu thời gian không nằm trong khoảng từ 1 giờ đến 7 ngày
                if (duration < 1 || duration > 48) {
                    return interaction.reply(`\`\`\`yml\n🚫 BÁO LỖI 🚫\n\nThời gian của cuộc thăm dò tối thiểu là 1h và tối đa là 48h.\`\`\``);
                }

                // Xác nhận đã phản hồi nhưng không gửi bất kỳ tin nhắn nào
              await interaction.deferReply({ ephemeral: true });

              
                pollcord(interaction.client, interaction.channelId, { 
                  question: question, 
                  answers: answers.map(answer => ({ text: answer.trim(), emoji: "" })), 
                  duration: duration, 
                  multiSelect: false
                }, { 
                  content: "@everyone hãy bỏ phiếu cho cuộc thăm dò ý kiến này. Cảm ơn!", 
                  // embeds: [new EmbedBuilder().setColor("Blurple").setDescription("PollCord")], 
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder({
                        style: ButtonStyle.Link, 
                        label: "Máy chủ hỗ trợ", 
                        url: "https://discord.com/channels/1028540923249958912/1028540923761664042", 
                        emoji: `<:ech7:1234014842004705360>`
                      }),
                      
                      new ButtonBuilder({
                        style: ButtonStyle.Link, 
                        label: "Web", 
                        url: "https://www.npmjs.com/package/pollcord", 
                        emoji: `<:iunhythncht:1234012514040418305>`,
                        disabled: true
                      })
                  )
                ]
              });
                

                // pollcord(client, interaction.channelId, pollOptions);

                // return interaction.reply({ content: "Đã gửi cuộc thăm dò ý kiến!", ephemeral: true });
                // Xóa phản hồi ngay lập tức
                await interaction.deleteReply();

            } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            // Gửi tin nhắn lỗi cho người dùng
            return interaction.reply(`\`\`\`yml\nTối đa là 48 tiếng\`\`\``);
            }
    }
};