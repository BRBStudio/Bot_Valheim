// commands/kk_test.js
const { SlashCommandBuilder } = require('discord.js');
const Answer = require('../../schemas/answerSchema');

/*
	* Các mã liên quan:
        - AI_brb.js trong thư mục Events
        - useAISchema.js trong thư mục schemas dùng để lưu tên người dùng
        - answerSchema.js trong thư mục schemas dùng để lưu trữ câu hỏi, câu trả lời của từng người dùng, và lưu trữ id kênh (nếu nó)
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot_ai')
        .setDescription('Thêm cặp câu hỏi–trả lời vào bot')
        .addStringOption(o => o
            .setName('question').setDescription('Câu hỏi').setRequired(true))
        .addStringOption(o => o
            .setName('answer').setDescription('Câu trả lời').setRequired(true))
        .addStringOption(o => o
            .setName('channel_id')
            .setDescription('ID kênh (trong máy chủ 1028540923249958912)')
            .setRequired(false)),

    guildSpecific: true,
    guildId: '1319809040032989275',

    async execute(interaction) {
        await interaction.deferReply();
        const question = interaction.options.getString('question').toLowerCase().trim();
        const answer = interaction.options.getString('answer').trim();
        const channelId = interaction.options.getString('channel_id');

        let targetChannel = null;

        if (channelId) {
            try {
                const guildB = await interaction.client.guilds.fetch('1028540923249958912');
                targetChannel = await guildB.channels.fetch(channelId);
                if (!targetChannel) {
                    return await interaction.editReply({ content: '❌ Không tìm thấy kênh trong Guild B.', ephemeral: true });
                }
            } catch (err) {
                console.error('Lỗi khi lấy kênh từ Guild B:', err);
                return await interaction.editReply({ content: '⚠️ Có lỗi khi tìm kênh trong Guild B.', ephemeral: true });
            }
        }

        // Tìm hoặc tạo mới
        let qa = await Answer.findOne({ question });
        if (!qa) qa = new Answer({ question });

        qa.answer = answer;
        qa.channelId = targetChannel ? targetChannel.id : null;
        await qa.save();

        await interaction.editReply(`✅ Đã lưu câu hỏi: **${question}** → **${answer}**${targetChannel ? `\n📌 Kênh: ${targetChannel.name}` : ''}`);
    }
};

