const { EmbedBuilder } = require('discord.js');
const joingameModel = require('../../schemas/joingameSchema');
const interactionError = require('../../Events/WebhookError/interactionError');

// của lệnh join_game
module.exports = {
    id: 'list',

    async execute(interaction, client) {
        try {
            const customId = interaction.customId; // Lấy customId từ interaction
            const gameChoice = customId.split('_').slice(1); // Trích xuất tên trò chơi từ customId .join('_')
            const creatorId = customId.split('_')[2];

            const guildId = interaction.guild.id;

            // Tìm kiếm tài liệu trong MongoDB dựa trên guildId và gameChoice
            const gameData = await joingameModel.findOne({ guildId, title: gameChoice, userId: creatorId });

            if (!gameData) {
                return interaction.reply({ content: `Không tìm thấy trò chơi "${gameChoice}" trong máy chủ này.`, ephemeral: true });
            }

            // Hiển thị danh sách người tham gia
            const participants = gameData.Listjoin.map((user, index) =>
                `#${index + 1}: ${user.displayName} (Tham gia lúc: ${user.formattedTime})`
            ).join('\n') || 'Chưa có ai tham gia.';

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`Danh sách tham gia - ${gameData.title}\n\nĐội trưởng ${gameData.displayName}`)
                .setDescription(participants)
                .setFooter({ text: `Tổng số người tham gia: ${gameData.totalUsers}` });

            // Cập nhật lại thông tin danh sách người tham gia
            await interaction.update({ embeds: [embed] });

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};

