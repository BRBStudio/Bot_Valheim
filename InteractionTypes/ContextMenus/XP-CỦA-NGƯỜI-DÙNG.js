const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require(`../../config`)
const levelSchema = require(`../../schemas/messagelevelSchema`);
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: {
        name: 'XP CỦA NGƯỜI DÙNG',
        type: ApplicationCommandType.User,
    },
    async execute(interaction, client) {

        if (!interaction.isUserContextMenuCommand()) return;

        // Kiểm tra trạng thái của ngữ cảnh
        const commandStatus = await CommandStatus.findOne({ command: 'XP CỦA NGƯỜI DÙNG' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện ngữ cảnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('ứng dụng (apps) này đã bị tắt, vui lòng thử lại sau.');
        }

        if (interaction.commandName === 'XP CỦA NGƯỜI DÙNG') {

                const user = interaction.targetUser;
                const { guild, client } = interaction;

                const embed = new EmbedBuilder()
                    .setColor(config.embedBlue)
                    .setImage(`https://i.imgur.com/W3KNxrO.gif`)
                    .setDescription(`🎏 ${user.displayName} chưa có điểm XP nào...`);

                // kiểm tra xem người dùng có bất kỳ dữ liệu cấp độ hoặc XP nào không
                levelSchema.findOne({ Guild: guild.id, User: user.id }).then((userData) => {
                    if (!userData) {
                        return interaction.reply({ embeds: [embed] });
                    }

                const embed1 = new EmbedBuilder()
                                    .setColor(config.embedBlue)
                                    .setTitle(`🎏 Thông tin XP của ${user.displayName}:`)
                                    .setDescription(`\`\`\`${user.displayName} CHƯA CÓ TRÊN BẢNG XẾP HẠNG...\n\nXP: ${userData.XP}\nLevel: ${userData.Level}\`\`\``)
                                    .setTimestamp()
                                    .setImage(`https://i.imgur.com/W3KNxrO.gif`)
                                    .setFooter({ text: 'Thông tin XP của người dùng' });

                // Nếu người dùng có dữ liệu, thì kiểm tra xem họ có nằm trong top 10 không
                levelSchema.find({ Guild: guild.id })
                    .sort({
                        XP: -1,
                        Level: -1,
                    })
                    .limit(10)
                    .then((Data) => {
                        if (!Data || Data.length === 0) {
                            return interaction.reply({ embeds: [embed] });
                        }

                        const topUserData = Data.find((data) => data.User === user.id);

                        if (!topUserData) {
                            return interaction.reply({ embeds: [embed1] });
                        }

                        // Nếu userData tồn tại và nằm trong top 10, tiếp tục logic hơn
                        interaction.deferReply().then(() => {
                            client.users.fetch(user.id).then((value) => {
                                const member = value.displayName; // Sử dụng biệt danh của người dùng

                                const text = `${member} | XP: ${userData.XP} | Level: ${userData.Level}\n`;

                                const embed2 = new EmbedBuilder()
                                    .setColor(config.embedBlue)
                                    .setTitle(`Thông tin XP của ${member}:`)
                                    .setDescription(`\`\`\`${text}\`\`\``)
                                    .setTimestamp()
                                    .setImage(`https://i.imgur.com/W3KNxrO.gif`)
                                    .setFooter({ text: 'Thông tin XP của người dùng trên bảng xếp hạng' });

                                interaction.editReply({ embeds: [embed2] });
                            }).catch((err) => {
                                console.error(err);
                                interaction.editReply({ content: 'Đã xảy ra lỗi khi tìm người dùng.' });
                            });
                        }).catch((err) => {
                            console.error(err);
                            interaction.reply({ content: 'Đã xảy ra lỗi khi hoãn trả lời.' });
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        interaction.reply({ content: 'Đã xảy ra lỗi khi tìm dữ liệu.' });
                    });
            }).catch((err) => {
                console.error(err);
                interaction.reply({ content: 'Đã xảy ra lỗi khi tìm dữ liệu người dùng.' });
            });
        }
    },
};




