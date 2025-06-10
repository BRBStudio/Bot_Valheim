const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { Font, RankCardBuilder } = require('canvacord');
const { permissionMap } = require("../../permissionMap");
const path = require('path');
const fs = require('fs');
const levelSchema = require('../../schemas/messagelevelSchema');
const CommandStatus = require('../../schemas/Command_Status');
  
module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("🔹 Hiển thị thông tin về một người dùng.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Chọn người dùng để nhận thông tin")
                .setRequired(true)
        ),
    
    async execute(interaction, client) {

        try {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/userinfo' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            const { guild } = interaction;

            // Trì hoãn phản hồi
           await interaction.deferReply();

            // Đường dẫn đến hình ảnh nền trong thư mục 'anh'
            const backgroundPath = path.join(__dirname, '../../anh/leaderboard-background5.png');

            // Kiểm tra xem tệp có tồn tại không
            if (!fs.existsSync(backgroundPath)) {
                console.error('Thư mục ảnh không tồn tại:', backgroundPath);
                return await interaction.reply({ content: '👑 Đã xảy ra lỗi khi tạo bảng xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
            }

            // Lấy dữ liệu của 10 người dùng từ cơ sở dữ liệu
            const topUsers = await levelSchema.find({ Guild: guild.id }).sort({ XP: -1 }).limit(10);

            // Truy vấn trực tiếp từ cơ sở dữ liệu
            const players = await Promise.all(topUsers.map(async (data, index) => {
                try {
                    const cachedMember = await guild.members.fetch(data.User);
                    const rank = Math.floor(data.Level / 10) + 1; // Xác định rank dựa trên level
                    return {
                        avatar: cachedMember.user.displayAvatarURL({ forceStatic: true }),
                        username: cachedMember.user.username,
                        displayName: cachedMember.displayName,
                        level: data.Level,
                        xp: data.XP,
                        rank: rank,
                    };
                } catch (error) {
                    console.error(`👑 Không thể tìm thấy thành viên với ID ${data.User} trong máy chủ.`);
                    return null;
                }
            }));
    
            const validPlayers = players.filter(player => player !== null);
 
            const User = interaction.options.getUser("user");

            // Kiểm tra nếu người dùng là bot
            if (User.bot) { 
                await interaction.deleteReply()               
                return interaction.channel.send({
                    content: "Tôi không phải là người dùng, bạn có thể xem thông tin của tôi bằng lệnh \`\`\`/cm info_bot\`\`\`",
                    ephemeral: true,
                });     
                         
            }

            const TargetedUser = await interaction.guild.members.fetch(
                User.id || interaction.member.id
            );
            await TargetedUser.fetch();
    
            function joinedSuff(number) {
                // Xác định đuôi số
                if (number % 100 >= 11 && number % 100 <= 13) return number + "th";
        
                switch (number % 10) {
                    case 1:
                    return number + "st";
                    case 2:
                    return number + "nd";
                    case 3:
                    return number + "rd";
                }

                return number + "th";
            }
    
            const fetchMembers = await interaction.guild.members.fetch();
            const JoinPos =
            Array.from(
                fetchMembers
                    .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                    .keys()
            ).indexOf(TargetedUser.id) + 1;
    
            const Accent = TargetedUser.user.accentColor
            ? TargetedUser.user.accentColor
            : "Random";
    
            let index = 1;
            let Perm;

            if (TargetedUser.id === interaction.guild.ownerId) {
                Perm = `Chủ sở hữu máy chủ`;
            } else if (TargetedUser.permissions.has(PermissionsBitField.Flags.Administrator)) {
                Perm = `Administrator`;
            } else {
                // Lấy vai trò chính và quyền của nó
                const primaryRole = TargetedUser.roles.highest;
                Perm = primaryRole.permissions
                    .toArray()
                    .map((P) => `${index++}. ${permissionMap[P] || P}.`)
                    .join("\n");
            }
    
            const roles = TargetedUser.roles.cache
                .filter((role) => role.name !== "@everyone")
                .sort((a, b) => b.position - a.position)
                .map((role) => `• ${role.name}`)
                .slice(0, 3);
    
            const member = await interaction.guild.members.fetch(User.id);

            // Thay đổi để lấy avatar từ user
            const displayName = member.displayName; // Tên hiển thị
            const username = member.user.username; // Tên người dùng
            const avatar = member.user.displayAvatarURL({ forceStatic: true }); // Lấy avatar
            const currentXPData = await levelSchema.findOne({ User: User.id, Guild: guild.id });
            const currentXP = currentXPData ? currentXPData.XP : 0; // Điểm kinh nghiệm hiện tại
            const requiredXP = (currentXPData.Level * currentXPData.Level * 20) + 20; // Điểm kinh nghiệm yêu cầu
            const level = currentXPData ? currentXPData.Level : 0; // Cấp độ
            const rank = validPlayers.findIndex(player => player.username === username) + 1; // Xác định rank

            Font.loadDefault();

                const profileBuffer = new RankCardBuilder()
                    .setDisplayName(displayName)
                    .setUsername(username)
                    .setAvatar(avatar)
                    .setCurrentXP(currentXP)
                    .setRequiredXP(requiredXP)
                    .setLevel(level)
                    .setRank(rank)
                    .setOverlay(90)
                    .setBackground(fs.readFileSync(backgroundPath)) // Sử dụng ảnh nền từ thư mục anh
                    .setStatus('online')
                    .setTextStyles({
                        level: "LEVEL: ", // Văn bản tùy chỉnh cho cấp độ
                        xp: "EXP: ", // Văn bản tùy chỉnh cho điểm kinh nghiệm
                        rank: "RANK: ", // Văn bản tùy chỉnh cho thứ hạng
                    })
                    .setProgressCalculator((currentXP, requiredXP) => {
                        const percentage = Math.floor((currentXP / requiredXP) * 100);
                        return Math.max(percentage, 0); // Đảm bảo giá trị không âm
                    });

                profileBuffer.setStyles({
                    progressbar: {
                        thumb: {
                            style: {
                                backgroundColor: "cyan",
                            },
                        },
                    },
                });

                const card = await profileBuffer.build({ format: 'png' });
                const attachment = new AttachmentBuilder(card, { name: 'rank.png' });
    
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${TargetedUser.user.displayName}`,
                    iconURL:
                    "https://cdn.discordapp.com/attachments/1064929361213530122/1066648072211410964/6879-member.png",
                })
                .setThumbnail(TargetedUser.user.avatarURL({ dynamic: true, size: 1024 }))
                .setColor("Green")
                .setFooter({ text: `Ⓒ Mọi quyền được bảo lưu cho ${client.user.displayName}` })
                .setTimestamp()
                .setDescription(
                    `**Thông tin người dùng:** ${displayName}
                    
                    **${displayName}** Đã tham gia với tư cách là
                    thành viên thứ **${joinedSuff(
                    JoinPos
                    )}** của Hội (\`${interaction.guild.name}\`).
                    `
                )
                .setImage("attachment://rank.png")
                .addFields(
                    {
                        name: `Đã tham gia bất hòa`,
                        value: `<t:${parseInt(TargetedUser.user.createdTimestamp / 1000)}:R>`,
                        inline: true,
                    },
                    
                    {
                        name: `Đã tham gia Máy chủ`,
                        value: `<t:${parseInt(TargetedUser.joinedTimestamp / 1000)}:R>`,
                        inline: true,
                    },

                    {
                        name: `\u200B`,
                        value: `\u200B`,
                        inline: true,
                    },

                    {
                        name: `ID`,
                        value: `\`\`\`${TargetedUser.id}\`\`\``,
                        inline: true,
                    },

                    {
                        name: `Màu sắc`,
                        value: `\`\`\`${
                                TargetedUser.user.accentColor
                                ? `#${TargetedUser.user.accentColor.toString(16)}`
                                : "Không có"
                            }\`\`\``,
                        inline: true,
                    },

                    {
                        name: `Là ?`,
                        value: `\`\`\`${TargetedUser.user.bot ? "Bot" : "Người dùng"} \`\`\``,
                        inline: true,
                    },

                    {
                        name: `(1) Tên nick`,
                        value: `\`\`\`${TargetedUser.nickname || "Không có"} \`\`\``,
                    },

                    {
                        name: `${
                                roles.length === 0 ? "(2) Quyền cơ bản discord" : "(2) Quyền vai trò"
                            }`,
                        value: `\`\`\`yml\n${Perm}\`\`\``,
                    },

                    {
                        name: `(3) Vai trò hàng đầu`,
                        value: `\`\`\`yml\n${roles.join("\n") || `Chưa có vai trò nào`}\`\`\``,
                    }
                );

            const xóa = new ButtonBuilder()
                .setCustomId(`delete`)
                .setLabel(`🗑️`)
                .setStyle(ButtonStyle.Danger)

            const nút = new ActionRowBuilder().addComponents(xóa)
    
            interaction.editReply({ embeds: [embed], files: [attachment], components: [nút] });
        } catch (error) {
            console.error("Lỗi khi thực thi lệnh userinfo:", error);

            interaction.editReply({
                content: "Có lỗi xảy ra khi xử lý lệnh, vui lòng thử lại sau.",
                ephemeral: true,
            });

            interaction.client.emit('interactionError', interaction.client, interaction, error);
        }
    },
};