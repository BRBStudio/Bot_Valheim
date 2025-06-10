const { handleVoteInteraction } = require(`../../ButtonPlace/ActionRowBuilder`)

module.exports = {
    id: 'vote_good',
    description: 'Nút này ghi nhận phiếu bình chọn ⭐⭐⭐⭐ của người dùng.',
    async execute(interaction) {
        if (interaction.customId && interaction.customId.startsWith('vote_')) {
            handleVoteInteraction(interaction);
        }
    }
}