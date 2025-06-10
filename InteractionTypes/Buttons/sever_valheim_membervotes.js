const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const votes = require('../../schemas/Vote_open_valheim');

module.exports = {
    id: 'sever_valheim_membervotes',
    description: 'Nút này hiển thị danh sách phiếu mở server Valheim.',
    async execute(interaction) {
        const { guild } = interaction;

        // Lấy dữ liệu bỏ phiếu của đúng server
        const voteData = await votes.findOne({ Guild: guild.id });
        if (!voteData || voteData.Voters.length === 0) {
            return await interaction.reply({ content: `__**Valheim Roleplay**__\n❌ Hiện tại không có ai tham gia bỏ phiếu cho server **${voteData.Server}**!`, ephemeral: true });
        }

        const voters = voteData.Voters;
        const pageSize = 10; // Số người bỏ phiếu mỗi trang
        let currentPage = 0;

        // Hàm tạo Embed
        const generateEmbed = (page) => {
            const start = page * pageSize;
            const end = start + pageSize;
            const list = voters.slice(start, end)
                .map((id, index) => `**${start + index + 1}.** <@${id}>`)
                .join('\n');

            return new EmbedBuilder()
                .setColor('Gold')
                .setAuthor({ name: 'Valheim Roleplay' })
                .setTitle(`📜 Danh sách phiếu bầu server **${voteData.Server}** (Mã tham gia: ${voteData.Code})`)
                .setDescription(list || 'Không có dữ liệu')
                .addFields(
                    { name: '⏱️ Thời gian bỏ phiếu:', value: `**3 tháng**` }
                )
                .setFooter({ 
                    text: 
                    `Số phiếu yêu cầu: ${voteData.Vote_request}` +
                    `                                                                                                       ${page + 1} / ${Math.ceil(voters.length / pageSize)}`
                });
        };

        // Tạo nút phân trang
        const createButtons = (page) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev_valheim')
                    .setLabel('⬅️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),

                new ButtonBuilder()
                    .setCustomId('next_valheim')
                    .setLabel('➡️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled((page + 1) * pageSize >= voters.length)
            );
        };

        await interaction.deferReply({ ephemeral: true });

        // Gửi tin nhắn với trang đầu tiên
        const message = await interaction.editReply({ embeds: [generateEmbed(0)], components: [createButtons(0)] });

        // Tạo bộ thu thập tương tác để xử lý nút bấm
        const collector = message.createMessageComponentCollector(); // { time: 60000 }

        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.user.id !== interaction.user.id) {
                return btnInteraction.reply({ content: `⚠️ Bạn không thể điều khiển danh sách server **${voteData.Server}** này!`, ephemeral: true });
            }

            if (btnInteraction.customId === 'prev_valheim') currentPage--;
            if (btnInteraction.customId === 'next_valheim') currentPage++;

            await btnInteraction.update({ embeds: [generateEmbed(currentPage)], components: [createButtons(currentPage)] });
        });

        // collector.on('end', async () => {
        //     try {
        //         await interaction.editReply({ components: [] });
        //     } catch (err) {
        //         console.error('Lỗi khi xóa nút sau khi hết thời gian:', err);
        //     }
        // });
    }
};
