const { SlashCommandBuilder } = require('discord.js');
const { createInviteEmbedPage } = require('../../Embeds/embedsCreate');
// const { checkAdministrator } = require('../../permissionCheck');
const CommandStatus = require('../../schemas/Command_Status');
const { rowInviteNavigation } = require('../../ButtonPlace/ActionRowBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites_code')
        .setDescription('🔹 Tìm nạp và hiển thị tất cả lời mời cho máy chủ.'),
    async execute(interaction) {
        const commandStatus = await CommandStatus.findOne({ command: '/invites_code' });

        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // const hasPermission = await checkAdministrator(interaction);
        // if (!hasPermission) return;

        await interaction.deferReply({ ephemeral: true });

        try {
            const invites = await interaction.guild.invites.fetch();

            if (!invites.size) {
                return interaction.editReply({
                    content: 'Không tìm thấy lời mời nào cho máy chủ này.',
                    ephemeral: true
                });
            }

            const inviteList = invites.map(invite => ({
                code: invite.code,
                inviter: `${invite.inviter.tag} (${invite.inviter.id})`,
                timestamp: `<t:${Math.floor(invite.createdTimestamp / 1000)}:R>`
            }));

            const pageSize = 8;
            const totalPages = Math.ceil(inviteList.length / pageSize);
            let currentPage = 0;

            const message = await interaction.editReply({
                embeds: [createInviteEmbedPage(inviteList, currentPage, pageSize)],
                components: [rowInviteNavigation(currentPage, totalPages)],
            });

            const filter = i => i.user.id === interaction.user.id;
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'next_page') currentPage++;
                if (i.customId === 'prev_page') currentPage--;

                await i.update({
                    embeds: [createInviteEmbedPage(inviteList, currentPage, pageSize)],
                    components: [rowInviteNavigation(currentPage, totalPages)]
                });
            });

        } catch (error) {
            console.error('Error fetching invites:', error);
            await interaction.editReply({
                content: 'Đã xảy ra lỗi khi tìm nạp lời mời.',
                ephemeral: true
            });
        }
    },
};
