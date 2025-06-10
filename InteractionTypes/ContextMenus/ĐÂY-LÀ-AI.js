const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require(`../../config`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: {
        name: 'ĐÂY LÀ AI?',
        type: ApplicationCommandType.User,
    },
    async execute(interaction, client) {
        if (!interaction.isUserContextMenuCommand()) return;

        // Kiểm tra trạng thái của ngữ cảnh
        const commandStatus = await CommandStatus.findOne({ command: 'ĐÂY LÀ AI?' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện ngữ cảnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
        }

        if (interaction.commandName === 'ĐÂY LÀ AI?') {

            const user = interaction.targetUser;

            interaction.guild.members.fetch(user.id).then(member => {
                const icon = user.displayAvatarURL();
                const tag = user.tag;
                const botStatus = user.bot ? 'Có' : 'Không';
                const badges = user.flags.toArray().join(', ');

                interaction.guild.invites.fetch().then(invites => {
                    let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id);

                    let i = 0;
                    userInv.forEach(inv => i += inv.uses);

                    const embed = new EmbedBuilder()
                        .setColor(config.embedRandom)
                        .setAuthor({ name: tag, iconURL: icon })
                        .setThumbnail(icon)
                        .addFields({ name: "Thành viên", value: `${user}`, inline: false })
                        .addFields({ name: "Vai trò máy chủ", value: `${member.roles.cache.map(r => r).join(' ')}`, inline: false })
                        .addFields({ name: "Đã tham gia Máy chủ", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: false })
                        .addFields({ name: "Đã tham gia Discord", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: false })
                        .addFields({ name: "ID người dùng", value: `${user.id}`, inline: false })
                        .addFields({ name: "Biểu tượng", value: `${icon}`, inline: false })
                        .addFields({ name: "Máy chủ tăng cường?", value: member.premiumSince ? 'Có' : 'Không', inline: false })
                        .addFields({ name: "Bot?", value: botStatus, inline: false })
                        .addFields({ name: "Danh hiệu", value: badges || 'Không có', inline: false })
                        .addFields({ name: "Lời mời máy chủ", value: `${i}`, inline: false })
                        .setFooter({ text: `Lệnh được yêu cầu bởi: ${interaction.user.username}` })
                        .setImage(`https://i.imgur.com/9Ynp6ey.gif`)
                        .setTimestamp();

                    interaction.reply({ embeds: [embed] });
                }).catch(error => {
                    console.error('Error fetching invites:', error);
                    interaction.reply({ content: 'Không thể lấy lời mời của người dùng này.', ephemeral: true });
                });
            }).catch(error => {
                console.error('Error fetching member:', error);
                interaction.reply({ content: 'Không thể lấy thông tin thành viên.', ephemeral: true });
            });
        }
    },
};




