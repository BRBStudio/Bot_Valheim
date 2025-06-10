const { SlashCommandBuilder } = require('discord.js');
const { row } = require('../../ButtonPlace/StringSelectMenuBuilder');
const { createThanhVienEmbed, createLinkModEmbed } = require('../../Embeds/embedsCreate');
const { SetupMod } = require(`../../Embeds/embedsDEV`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help_valheim')
        .setDescription('🔹 Hỗ trợ vào game Valheim dành riêng cho máy chủ BRB STUDIO!'),

    async execute(interaction) {
        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/help_valheim' });
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const Mc = interaction.guild.id === '1028540923249958912';
        const message = await interaction.reply({
            content: 'Tôi ở đây để hỗ trợ bạn. Hãy làm theo từng bước ❤!',
            components: [row],
            ephemeral: false,
        });

        const collector = message.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            if (i.customId === 'select') {
                const value = i.values[0];

                if (i.user.id !== interaction.user.id) {
                    return await i.reply({
                        content: `Chỉ ${interaction.user.displayName} mới có thể tương tác với menu này!`,
                        ephemeral: true,
                    });
                }

                if (value === 'thành viên') {
                    await i.update({
                        content: 'Bước <a:so1:1321471027280216126>',
                        embeds: [createThanhVienEmbed(Mc)],
                    });
                }

                if (value === 'link mod') {
                    await i.update({
                        content: 'Bước <a:so2:1321471601295753318>',
                        embeds: [createLinkModEmbed(Mc)],
                    });
                }

                if (value === 'cài mod') {
                    await i.update({
                        content: 'Bước <a:so3:1321471621579669534>',
                        embeds: [SetupMod],
                    });
                }
            }
        });
    },
};