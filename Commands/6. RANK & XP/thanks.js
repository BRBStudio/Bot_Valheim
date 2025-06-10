const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const thanksSchema = require('../../schemas/thanksSchema');
const User = require('../../schemas/premiumUserSchema');
const PremiumCode = require('../../schemas/premiumSchema');
const CommandStatus = require('../../schemas/Command_Status');

let interval;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tks')
        .setDescription('🔹 Lệnh cảm ơn')
        .addSubcommand(option => option
            .setName('give')
            .setDescription('🔹 Cảm ơn một người trợ giúp đã giúp đỡ bạn!')
            .addUserOption(option => option
                .setName('user')
                .setDescription('Người dùng cảm ơn!')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('message')
                .setDescription('Gửi cho người dùng một tin nhắn nhỏ 😊')
            )
        )
        .addSubcommand(option => option
            .setName('information')
            .setDescription('🔹 Xem thông tin chi tiết về lời cảm ơn của một người dùng.')
            .addUserOption(option => option
                .setName('user')
                .setDescription('Người dùng để xem thông tin cảm ơn.')
                .setRequired(true)
            )
        )
        .addSubcommand(option => option
            .setName('refresh')
            .setDescription('🔹 Thiết lập thời gian làm mới lại thông tin lời cảm ơn')
            .addStringOption(option => option
                .setName('time')
                .setDescription('Thời gian làm mới')
                .setRequired(true)
                .addChoices(
                    { name: '5 phút', value: '5 phút' },
                    { name: '1 ngày', value: '1 ngày' },
                    { name: '1 tuần', value: '1 tuần' },
                    { name: '1 tháng', value: '1 tháng' },
                    { name: '2 tháng', value: '2 tháng' },
                    { name: '3 tháng', value: '3 tháng' },
                    { name: '4 tháng', value: '4 tháng' },
                    { name: '5 tháng', value: '5 tháng' },
                    { name: '6 tháng', value: '6 tháng' },
                    { name: '7 tháng', value: '7 tháng' },
                    { name: '8 tháng', value: '8 tháng' },
                    { name: '9 tháng', value: '9 tháng' },
                    { name: '10 tháng', value: '10 tháng' },
                    { name: '11 tháng', value: '11 tháng' },
                    { name: '12 tháng', value: '12 tháng' },
                )
            )
        )
        .addSubcommand(option => option
            .setName('delete-refresh')
            .setDescription('🔹 Xóa thiết lập thời gian làm mới lời cảm ơn')
        )        
        .addSubcommand(option => option
            .setName('leaderboard')
            .setDescription('🔹 Xem bảng xếp hạng cảm ơn!')
        )
        .addSubcommand(option => option
            .setName('setup')
            .setDescription('🔹 Thiết lập vai trò cho các mức cảm ơn 10, 20, và 30.')
            .addRoleOption(option => option
                .setName('role10')
                .setDescription('Vai trò khi đạt 10 Thanks')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('role20')
                .setDescription('Vai trò khi đạt 20 Thanks')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('role30')
                .setDescription('Vai trò khi đạt 30 Thanks')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete-setup')
                .setDescription('🔹 Xóa toàn bộ thiết lập vai trò đã cài đặt')),
    async execute(interaction) {

    try {
        
        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/tks' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const sub = interaction.options.getSubcommand();
        const guildID = interaction.guild.id;
        const responses = [
            `'Cảm ơn' là ngôn ngữ thể hiện sự biết ơn, lòng cảm kích về sự giúp đỡ mà chúng ta nhận được từ người khác.`,
            `Sự giúp đỡ có thể là hành động, vật chất hoặc tinh thần. Chúng ta cần diễn đạt lòng biết ơn với mọi điều tốt lành mà chúng ta trải nghiệm.`,
            `Có thể lời cảm ơn được nhiều người coi là sáo rỗng, nhưng nó như một nhịp cầu gắn kết con người lại với nhau. Lời cảm ơn chí ít thì cũng đã bày tỏ được tấm lòng của người được giúp đỡ với người giúp đỡ người khác.`,
            `Cảm ơn là một văn hóa đẹp của người dân Việt Nam.`,
            `Từ lâu, văn hóa ứng xử đã trở thành chuẩn mực trong việc đánh giá nhân cách con người. Cảm ơn là một trong các biểu hiện của ứng xử có văn hóa, là hành vi văn minh, lịch sự trong quan hệ xã hội`,
        ]

        const randomMessage = responses[Math.floor(Math.random() * responses.length)];
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        await thanksSchema.deleteMany({ updatedAt: { $lt: twoMonthsAgo } }); // sau 2 tháng reset lại điểm 

        const guildOwner = await interaction.guild.fetchOwner();
        
        switch (sub) {
            case 'give':
                const user = interaction.options.getUser('user'); // Người dùng nhận điểm tks
                const message = interaction.options.getString('message');

                // let thresholdMessage = null; // Giữ nguyên biến này như yêu cầu
                let thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\nBạn chưa đủ điểm cảm ơn để được gán vai trò. Hãy giúp đỡ nhiều hơn để nhận vai trò!\n\n\`\`\`${randomMessage}\`\`\`` ; // Luôn tạo thông báo mặc định

                // Lấy thông tin người dùng từ cơ sở dữ liệu
                let thanksUser = await thanksSchema.findOne({ User: user.id, Guild: guildID });

                if (!thanksUser) {
                    thanksUser = await thanksSchema.create({
                        User: user.id,
                        Thanks: 1,
                        Messages: message ? [message] : [],
                        Guild: guildID
                    });
                } else {
                    thanksUser.Thanks += 1;
                    await thanksUser.save();
                }

                // Kiểm tra quyền gán vai trò
                const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
                if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    await interaction.reply({ content: 'Hãy cấp cho tôi quyền quản lý vai trò.', ephemeral: true });
                    return;
                }

                // Lấy thông tin cấu hình RoleSetup từ cơ sở dữ liệu
                const roleSetup = await thanksSchema.findOne({ Guild: guildID });

                if (roleSetup) {
                    const member = await interaction.guild.members.fetch(user.id); // Fetch thành viên từ server

                    // Kiểm tra và gán vai trò tương ứng nếu đủ điểm tks
                    if (thanksUser.Thanks >= 30 && roleSetup.RoleSetup.role30) {
                        const role30 = interaction.guild.roles.cache.get(roleSetup.RoleSetup.role30);
                        if (role30) {
                            if (role30.position >= botMember.roles.highest.position) {
                                await interaction.reply({ content: 'Vai trò của bot không đủ cao để gán vai trò này.', ephemeral: true });
                                return;
                            }
                            if (!member.roles.cache.has(role30.id)) {
                                await member.roles.add(role30.id);
                                const roleName = role30.name;
                                thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\nBạn đã đủ 30 lời cảm ơn, bạn sẽ được gán vai trò ***${roleName}***.\nHãy giúp đỡ nhiều hơn để có vai trò cao hơn.\n\n\n\`\`\`${randomMessage}\`\`\``;
                            }
                        } else {
                            await interaction.reply({ content: `Vai trò với ID ${roleSetup.RoleSetup.role30} không tồn tại.`, ephemeral: true });
                            return;
                        }
                    } else if (thanksUser.Thanks >= 20 && roleSetup.RoleSetup.role20) {
                        const role20 = interaction.guild.roles.cache.get(roleSetup.RoleSetup.role20);
                        if (role20) {
                            if (role20.position >= botMember.roles.highest.position) {
                                await interaction.reply({ content: 'Vai trò của bot không đủ cao để gán vai trò này.', ephemeral: true });
                                return;
                            }
                            if (!member.roles.cache.has(role20.id)) {
                                await member.roles.add(role20.id);
                                const roleName = role20.name;
                                thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\nBạn đã đủ 20 lời cảm ơn, bạn sẽ được gán vai trò ***${roleName}***.\nHãy giúp đỡ nhiều hơn để có vai trò cao hơn.\n\n\n\`\`\`${randomMessage}\`\`\``;
                            }
                        } else {
                            await interaction.reply({ content: `Vai trò với ID ${roleSetup.RoleSetup.role20} không tồn tại.`, ephemeral: true });
                            return;
                        }
                    } else if (thanksUser.Thanks >= 10 && roleSetup.RoleSetup.role10) {
                        const role10 = interaction.guild.roles.cache.get(roleSetup.RoleSetup.role10);
                        if (role10) {
                            if (role10.position >= botMember.roles.highest.position) {
                                await interaction.reply({ content: 'Vai trò của bot không đủ cao để gán vai trò này.', ephemeral: true });
                                return;
                            }
                            if (!member.roles.cache.has(role10.id)) {
                                await member.roles.add(role10.id);
                                const roleName = role10.name;
                                thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\nBạn đã đủ 10 lời cảm ơn, bạn sẽ được gán vai trò ***${roleName}***.\nHãy giúp đỡ nhiều hơn để có vai trò cao hơn.\n\n\n\`\`\`${randomMessage}\`\`\``;
                            }
                        } else {
                            await interaction.reply({ content: `Vai trò với ID ${roleSetup.RoleSetup.role10} không tồn tại.`, ephemeral: true });
                            return;
                        }
                    }
                }

                const hinhanh = `https://i.imgur.com/rj0XxG1.gif`;
                const embedMessage = message ? message : 'Không có tin nhắn nào được cung cấp';

                const sendEmbed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setDescription(thresholdMessage)
                    .setImage(hinhanh)
                    .setTimestamp();

                const replyEmbed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setDescription(`> Bạn đã cảm ơn **${user.displayName}**! | Tin nhắn ➭ **${embedMessage}**\n\n\n\`\`\`${randomMessage}\`\`\``)
                    .setImage(hinhanh)
                    .setTimestamp();

                await interaction.reply({ embeds: [replyEmbed] });
                await user.send({ embeds: [sendEmbed] });

                break;

            case 'leaderboard':
                const guildIdLeaderboard = interaction.guild.id;

                const leaderboard = await thanksSchema
                    .find({ Guild: guildIdLeaderboard })
                    .sort({ Thanks: -1 })
                    .limit(10);

                if (leaderboard.length === 0) {
                // Nếu không có thông tin trong bảng xếp hạng, gửi tin nhắn embed thông báo
                const noThanksEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('Không ai có lời cảm ơn.')
                    .setTimestamp();

                await interaction.reply({ embeds: [noThanksEmbed] });
                return;
            }

                const leaderboardMessage = leaderboard.map((entry, index) => `\`${index + 1}\`. **<@${entry.User}>** ➭ **${entry.Thanks}** lời cảm ơn`).join('\n');

                const hinhanh1 = `https://seotrends.com.vn/wp-content/uploads/2021/11/thank-you-very-much.gif`
                const sendEmbed1 = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle(`Bảng Xếp Hạng Lời Cảm Ơn`)
                    .setDescription(leaderboardMessage)
                    .setImage(hinhanh1)
                    .setTimestamp()
                await interaction.reply({ embeds: [sendEmbed1] });
                break;

            case 'information':
                    const user1 = interaction.options.getUser('user');
                    const guildID1 = interaction.guild.id;

                    const UserThanks = await thanksSchema.findOne({ User: user1.id, Guild: guildID1 });
                    if (!UserThanks) {
                        await interaction.reply({ content: 'Người dùng này chưa có lời cảm ơn nào.', ephemeral: true });
                        return;
                    }

                    const Leaderboard = await thanksSchema
                        .find({ Guild: guildID1 })
                        .sort({ Thanks: -1 });

                    const userPosition = Leaderboard.findIndex(entry => entry.User === user1.id);
                    const userRank = userPosition + 1;

                    const Tnembed = `THÔNG TIN CHI TIẾT VỀ SỐ LƯỢNG LỜI CẢM ƠN & VỊ TRÍ CỦA ***${user1.displayName}***\n\n> ${user1.displayName} ➭ ${UserThanks.Thanks} lời cảm ơn\n> vị trí xếp hạng: ${userRank}`;

                    const SendEmbed = new EmbedBuilder()
                        .setColor('Blurple')
                        .setDescription(Tnembed)
                        .setTimestamp();

                    await interaction.reply({ embeds: [SendEmbed] });
                    break;
            
            case 'refresh':                
                    const refreshTime = interaction.options.getString('time');

                    // Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
                    const userrefresh = await User.findOne({ discordId: interaction.user.id });
                    if (!userrefresh || !userrefresh.isPremium) {
                    return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng đăng ký premium để sử dụng.', ephemeral: true });
                    }

                    await setResetInterval(refreshTime, interaction);

                    await interaction.reply(`Bạn đã đặt ${refreshTime} để làm cho thời gian cảm ơn.`);
                    break;

            case 'delete-refresh':
                
                    // Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
                    const userdelete = await User.findOne({ discordId: interaction.user.id });
                    if (!userdelete || !userdelete.isPremium) {
                    return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng đăng ký premium để sử dụng.', ephemeral: true });
                    }

                    // Xóa thiết lập thời gian làm mới
                    clearInterval(interval);
                    await interaction.reply('Đã xóa thiết lập thời gian làm mới lời cảm ơn.');                    
                    break;
                    
            case 'setup':

                    if (interaction.user.id !== guildOwner.id) {
                        return await interaction.reply({ content: 'Lệnh này chỉ dành cho chủ sở hữu.', ephemeral: true });
                    }
                    
                    const role10 = interaction.options.getRole('role10');
                    const role20 = interaction.options.getRole('role20');
                    const role30 = interaction.options.getRole('role30');

                    // Cập nhật cấu hình RoleSetup trong cơ sở dữ liệu
                    await thanksSchema.updateOne(
                        { Guild: guildID },
                        {
                            $set: {
                                'RoleSetup.role10': role10.id,
                                'RoleSetup.role20': role20.id,
                                'RoleSetup.role30': role30.id
                            }
                        },
                        { upsert: true }
                    );

                    await interaction.reply({
                        content: `Đã thiết lập vai trò cho các mức cảm ơn:\n- 10 Thanks: ${role10.name}\n- 20 Thanks: ${role20.name}\n- 30 Thanks: ${role30.name}`,
                        ephemeral: true
                    });
                    break;

            case 'delete-setup':

                if (interaction.user.id !== guildOwner.id) {
                    return await interaction.reply({ content: 'Lệnh này chỉ dành cho chủ sở hữu.', ephemeral: true });
                }

                await thanksSchema.updateOne(
                    { Guild: guildID },
                    {
                        $unset: {
                            'RoleSetup.role10': "",
                            'RoleSetup.role20': "",
                            'RoleSetup.role30': ""
                        }
                    }
                );

                await interaction.reply({
                    content: `Đã xóa toàn bộ thiết lập vai trò.`,
                    ephemeral: true
                });
                break;

            default:
                await interaction.reply('Lệnh không hợp lệ!');
                break;
        }
    } catch (error) {
        console.error('Lỗi trong quá trình thực thi lệnh:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi trong quá trình thực thi lệnh.', ephemeral: true });
    }
    }
};

    async function getroleNameByName(guild, roleName) {
        const role = guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
        return role ? role.name : null;
    }

    // Đặt công việc định kỳ để reset lời cảm ơn sau mỗi khoảng thời gian
// Hàm này sẽ chạy mỗi khoảng thời gian đã định để reset lại dữ liệu cảm ơn
async function setResetInterval(refreshTime, interaction) {
    // let interval;

    switch (refreshTime) {
        case '5 phút':
            interval = 5 * 60 * 1000;
            break;
        case '1 ngày':
            interval = 24 * 60 * 60 * 1000;
            break;
        case '1 tuần':
            interval = 7 * 24 * 60 * 60 * 1000;
            break;
        case '1 tháng':
            interval = 30 * 24 * 60 * 60 * 1000;
            break;
        case '2 tháng':
            interval = 60 * 24 * 60 * 60 * 1000;
            break;
        case '3 tháng':
            interval = 90 * 24 * 60 * 60 * 1000;
            break;
        case '4 tháng':
            interval = 120 * 24 * 60 * 60 * 1000;
            break;
        case '5 tháng':
            interval = 150 * 24 * 60 * 60 * 1000;
            break;
        case '6 tháng':
            interval = 180 * 24 * 60 * 60 * 1000;
            break;
        case '7 tháng':
            interval = 210 * 24 * 60 * 60 * 1000;
            break;
        case '8 tháng':
            interval = 240 * 24 * 60 * 60 * 1000;
            break;
        case '9 tháng':
            interval = 270 * 24 * 60 * 60 * 1000;
            break;
        case '10 tháng':
            interval = 300 * 24 * 60 * 60 * 1000;
            break;
        case '11 tháng':
            interval = 330 * 24 * 60 * 60 * 1000;
            break;
        case '12 tháng':
            interval = 360 * 24 * 60 * 60 * 1000;
            break;
        default:
            throw new Error('Thời gian làm mới không hợp lệ.');
    }

    const resetData = async () => {
        try {
            // Lấy vai trò từ dữ liệu hiện tại
            const leaderboard = await thanksSchema
                .find({})
                .sort({ Thanks: -1 });

            leaderboard.forEach(async (entry) => {
                const guild = interaction.guild;
                const member = await guild.members.fetch(entry.User);
                
                // Kiểm tra và xóa vai trò đã cấp cho người dùng
                if (entry.Thanks >= 30) {
                    const roleName = await getroleNameByName(interaction.guild, 'người sở hữu');
                    const role = interaction.guild.roles.cache.find(role => role.name === roleName);
                    if (role && member.roles.cache.has(role.id)) {
                        await member.roles.remove(role.id);
                    }
                    
                } else if (entry.Thanks >= 20) {
                    const roleName = await getroleNameByName(interaction.guild, 'nhân viên');
                    const role = interaction.guild.roles.cache.find(role => role.name === roleName);
                    if (role && member.roles.cache.has(role.id)) {
                        await member.roles.remove(role.id);
                    }
                    
                } else if (entry.Thanks >= 10) {
                    const roleName = await getroleNameByName(interaction.guild, '999');
                    const role = interaction.guild.roles.cache.find(role => role.name === roleName);
                    if (role && member.roles.cache.has(role.id)) {
                        await member.roles.remove(role.id);
                    }
                    
                } else if (entry.Thanks > 0) {
                    const embed = new EmbedBuilder()
                    .setAuthor({ name: 'Bot Valheim' , iconURL: 'https://i.imgur.com/njKam2g.gif', url: 'https://discord.gg/Jc3QuUEnnd' })
                    .setTitle('LÀM MỚI THÔNG TIN CẢM ƠN!')
                    .setDescription(`Bạn cần bắt đầu từ đầu để nhận lại điểm cảm ơn`)
                    .setColor(`Green`)
                    .setTimestamp()
                    .setFooter({ text: 'Bot Valheim' })
                    .setThumbnail('https://cdn.discordapp.com/attachments/100152043898273')
                    .setImage('https://cdn.discordapp.com/attachments/100152043898273')
                
                
                await member.send({ embeds: [embed] });   
                }
            });

            

            //  Xóa dữ liệu lời cảm ơn
            await thanksSchema.deleteMany({});

            
        } catch (error) {
            console.error('Lỗi khi reset lời cảm ơn:', error);
        }
    };

    setInterval(resetData, interval);
}





















// const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
// const thanksSchema = require('../../schemas/thanksSchema');
// const User = require('../../schemas/premiumUserSchema');
// const PremiumCode = require('../../schemas/premiumSchema');

// let interval;

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('tks')
//         .setDescription('Lệnh cảm ơn')
//         .addSubcommand(option => option
//             .setName('give')
//             .setDescription('Cảm ơn một người trợ giúp đã giúp đỡ bạn!')
//             .addUserOption(option => option
//                 .setName('user')
//                 .setDescription('Người dùng cảm ơn!')
//                 .setRequired(true)
//             )
//             .addStringOption(option => option
//                 .setName('message')
//                 .setDescription('Gửi cho người dùng một tin nhắn nhỏ 😊')
//             )
//         )
//         .addSubcommand(option => option
//             .setName('information')
//             .setDescription('Xem thông tin chi tiết về lời cảm ơn của một người dùng.')
//             .addUserOption(option => option
//                 .setName('user')
//                 .setDescription('Người dùng để xem thông tin cảm ơn.')
//                 .setRequired(true)
//             )
//         )
//         .addSubcommand(option => option
//             .setName('refresh')
//             .setDescription('Thiết lập thời gian làm mới lại thông tin lời cảm ơn')
//             .addStringOption(option => option
//                 .setName('time')
//                 .setDescription('Thời gian làm mới')
//                 .setRequired(true)
//                 .addChoices(
//                     { name: '5 phút', value: '5 phút' },
//                     { name: '1 ngày', value: '1 ngày' },
//                     { name: '1 tuần', value: '1 tuần' },
//                     { name: '1 tháng', value: '1 tháng' },
//                     { name: '2 tháng', value: '2 tháng' },
//                     { name: '3 tháng', value: '3 tháng' },
//                     { name: '4 tháng', value: '4 tháng' },
//                     { name: '5 tháng', value: '5 tháng' },
//                     { name: '6 tháng', value: '6 tháng' },
//                     { name: '7 tháng', value: '7 tháng' },
//                     { name: '8 tháng', value: '8 tháng' },
//                     { name: '9 tháng', value: '9 tháng' },
//                     { name: '10 tháng', value: '10 tháng' },
//                     { name: '11 tháng', value: '11 tháng' },
//                     { name: '12 tháng', value: '12 tháng' },
//                 )
//             )
//         )
//         .addSubcommand(option => option
//             .setName('delete-refresh')
//             .setDescription('Xóa thiết lập thời gian làm mới lời cảm ơn')
//         )        
//         .addSubcommand(option => option
//             .setName('leaderboard')
//             .setDescription('Xem bảng xếp hạng cảm ơn!')
//         ),
//     async execute(interaction) {

//     try {    
//         const sub = interaction.options.getSubcommand();
//         const responses = [
//             `'Cảm ơn' là ngôn ngữ thể hiện sự biết ơn, lòng cảm kích về sự giúp đỡ mà chúng ta nhận được từ người khác.`,
//             `Sự giúp đỡ có thể là hành động, vật chất hoặc tinh thần. Chúng ta cần diễn đạt lòng biết ơn với mọi điều tốt lành mà chúng ta trải nghiệm.`,
//             `Có thể lời cảm ơn được nhiều người coi là sáo rỗng, nhưng nó như một nhịp cầu gắn kết con người lại với nhau. Lời cảm ơn chí ít thì cũng đã bày tỏ được tấm lòng của người được giúp đỡ với người giúp đỡ người khác.`,
//             `Cảm ơn là một văn hóa đẹp của người dân Việt Nam.`,
//             `Từ lâu, văn hóa ứng xử đã trở thành chuẩn mực trong việc đánh giá nhân cách con người. Cảm ơn là một trong các biểu hiện của ứng xử có văn hóa, là hành vi văn minh, lịch sự trong quan hệ xã hội`,
//         ]

//         const randomMessage = responses[Math.floor(Math.random() * responses.length)];
//         const twoMonthsAgo = new Date();
//         twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

//         await thanksSchema.deleteMany({ updatedAt: { $lt: twoMonthsAgo } }); // sau 2 tháng reset lại điểm 
        
//         switch (sub) {
//             case 'give':
//                 const user = interaction.options.getUser('user');
//                 const message = interaction.options.getString('message');
//                 const guildID = interaction.guild.id;

//                 if (user.id === interaction.user.id) {
//                         await interaction.reply({ content: `Bạn không thể cảm ơn chính mình!`, ephemeral: true });
//                         return;
//                     }
                        
//                 if (user.bot) {
//                         await interaction.reply({ content: "Bạn không thể cảm ơn bot!", ephemeral: true });
//                         return;
//                     }

//                 let userThanks = await thanksSchema.findOne({ User: user.id, Guild: guildID });

//                 if (!userThanks) {
//                     userThanks = await thanksSchema.create({
//                         User: user.id,
//                         Thanks: 1,
//                         Messages: message ? [message] : [], // Tạo mảng mới chứa tin nhắn nếu có tin nhắn được cung cấp
//                         Guild: guildID
//                     });
//                 } else {
//                     userThanks.Thanks += 1;
//                         if (!Array.isArray(userThanks.Messages)) {
//                             userThanks.Messages = []; // Đảm bảo Messages luôn là một mảng
//                         }
//                         if (message) {
//                             userThanks.Messages.push(message); // Thêm tin nhắn vào mảng
//                         }
//                         await userThanks.save();
//                 }
                
//                 let roleName;
//                 let thresholdMessage = null;
//                     if (userThanks.Thanks >= 30) {
//                         roleName = await getroleNameByName(interaction.guild, 'người sở hữu');
//                         thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\nBạn đã đủ 30 lời cảm ơn, bạn sẽ được gán vai trò ***${roleName}***.\nHãy giúp đỡ nhiều hơn để có vai trò cao hơn.\n\n\n${randomMessage}`;
//                     } else if (userThanks.Thanks >= 20) {
//                         roleName = await getroleNameByName(interaction.guild, 'nhân viên');
//                         thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\nBạn đã đủ 20 lời cảm ơn, bạn sẽ được gán vai trò ***${roleName}***.\nHãy giúp đỡ nhiều hơn để có vai trò cao hơn.\n\n\n${randomMessage}`;
//                     } else if (userThanks.Thanks >= 10) {
//                         roleName = await getroleNameByName(interaction.guild, '999');
//                         thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\nBạn đã đủ 10 lời cảm ơn, bạn sẽ được gán vai trò ***${roleName}***.\nHãy giúp đỡ nhiều hơn để có vai trò cao hơn.\n\n\n${randomMessage}`;
//                     } else {
//                         thresholdMessage = `Bạn đã được cảm ơn bởi **${interaction.user.displayName}**! | Tin nhắn ➭ **${message ? message : 'Không có tin nhắn nào được cung cấp'}**\n\n\n${randomMessage}`;
//                     }

//                 const hinhanh = `https://i.imgur.com/rj0XxG1.gif`
//                 const embedMessage = message ? message : 'Không có tin nhắn nào được cung cấp';
//                 const sendEmbed = new EmbedBuilder()
//                     .setColor('Blurple')
//                     .setDescription(thresholdMessage)
//                     .setImage(hinhanh)
//                     .setTimestamp()

//                 const replyEmbed = new EmbedBuilder()
//                     .setColor('Blurple')
//                     .setDescription(`> Bạn đã cảm ơn **${user.displayName}**! | Tin nhắn ➭ **${embedMessage}**\n\n\n${randomMessage}`)
//                     .setImage(hinhanh)
//                     .setTimestamp()


//                 if (roleName) {
//                     const role = await interaction.guild.roles.fetch(roleName);
//                     // Kiểm tra quyền gán vai trò
//                     const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
//                     if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
//                         await interaction.reply({ content: 'Hãy cấp cho tôi quyền quản lý vai trò.', ephemeral: true });
//                         return;
//                     }

//                     // kiểm tra xem vai trò có tồn tại hay không
//                     if (!roleName) {
//                         // console.error(`Role ID ${roleID} không tồn tại.`);
//                         await interaction.reply({ content: `Tên vai trò ${roleName} không tồn tại.`, ephemeral: true });
//                         return;
//                     }

//                     // kiểm tra xem vai trò bot có đủ cao hơn vai trò được gán không
//                     if (roleName.position >= botMember.roles.highest.position) {
//                         // console.error(`Vai trò của bot không đủ cao để gán vai trò này.`);
//                         await interaction.reply({ content: 'Vai trò của bot không đủ cao để gán vai trò này.', ephemeral: true });
//                         return;
//                     }
//                     // Gán vai trò cho người dùng nếu đáp ứng tiêu chí
//                     // interaction.member.roles.add(roleID);
//                 // Gán vai trò cho người nhận lời cảm ơn
//                 try {
//                     const member = await interaction.guild.members.fetch(user.id);
//                     const role = interaction.guild.roles.cache.find(role => role.name === roleName);
//                     if (!role) {
//                         console.error(`ten vai trò ${roleName} không tồn tại.`);
//                         await interaction.reply({ content: `Tên vai trò ${roleName} không tồn tại.`, ephemeral: true });
//                         return;
//                     }

//                     await member.roles.add(role.id);
//                 } catch (roleError) {
//                     console.error(`Lỗi khi gán vai trò: ${roleError}`);
//                     await interaction.reply({ content: `Lỗi khi gán vai trò: ${roleError.message}`, ephemeral: true });
//                     return;
//                 }
//             }
                
//                 await interaction.reply({ embeds: [replyEmbed] }); // gửi tin nhắn thông báo cho người tương tác
//                 await user.send({ embeds: [sendEmbed] }); // gửi tin nhắn riêng tư DM cho người giúp đỡ
//                 break;

//             case 'leaderboard':
//                 const guildIdLeaderboard = interaction.guild.id;

//                 const leaderboard = await thanksSchema
//                     .find({ Guild: guildIdLeaderboard })
//                     .sort({ Thanks: -1 })
//                     .limit(10);

//                 if (leaderboard.length === 0) {
//                 // Nếu không có thông tin trong bảng xếp hạng, gửi tin nhắn embed thông báo
//                 const noThanksEmbed = new EmbedBuilder()
//                     .setColor('Red')
//                     .setDescription('Không ai có lời cảm ơn.')
//                     .setTimestamp();

//                 await interaction.reply({ embeds: [noThanksEmbed] });
//                 return;
//             }

//                 const leaderboardMessage = leaderboard.map((entry, index) => `\`${index + 1}\`. **<@${entry.User}>** ➭ **${entry.Thanks}** lời cảm ơn`).join('\n');

//                 const hinhanh1 = `https://seotrends.com.vn/wp-content/uploads/2021/11/thank-you-very-much.gif`
//                 const sendEmbed1 = new EmbedBuilder()
//                     .setColor('Gold')
//                     .setTitle(`Bảng Xếp Hạng Lời Cảm Ơn`)
//                     .setDescription(leaderboardMessage)
//                     .setImage(hinhanh1)
//                     .setTimestamp()
//                 await interaction.reply({ embeds: [sendEmbed1] });
//                 break;

//             case 'information':
//                     const user1 = interaction.options.getUser('user');
//                     const guildID1 = interaction.guild.id;

//                     const UserThanks = await thanksSchema.findOne({ User: user1.id, Guild: guildID1 });
//                     if (!UserThanks) {
//                         await interaction.reply({ content: 'Người dùng này chưa có lời cảm ơn nào.', ephemeral: true });
//                         return;
//                     }

//                     const Leaderboard = await thanksSchema
//                         .find({ Guild: guildID1 })
//                         .sort({ Thanks: -1 });

//                     const userPosition = Leaderboard.findIndex(entry => entry.User === user1.id);
//                     const userRank = userPosition + 1;

//                     const Tnembed = `THÔNG TIN CHI TIẾT VỀ SỐ LƯỢNG LỜI CẢM ƠN & VỊ TRÍ CỦA ***${user1.displayName}***\n\n> ${user1.displayName} ➭ ${UserThanks.Thanks} lời cảm ơn\n> vị trí xếp hạng: ${userRank}`;

//                     const SendEmbed = new EmbedBuilder()
//                         .setColor('Blurple')
//                         .setDescription(Tnembed)
//                         .setTimestamp();

//                     await interaction.reply({ embeds: [SendEmbed] });
//                     break;
            
//             case 'refresh':                
//                     const refreshTime = interaction.options.getString('time');

//                     // Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
//                     const userrefresh = await User.findOne({ discordId: interaction.user.id });
//                     if (!userrefresh || !userrefresh.isPremium) {
//                     return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng đăng ký premium để sử dụng.', ephemeral: true });
//                     }

//                     // Kiểm tra xem người dùng có mã premium hay không
//                     // const premiumCode = await PremiumCode.findOne({ user: interaction.user.id });
//                     // if (!premiumCode || !premiumCode.isUsed) {
//                     //   return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng nhập mã premium để sử dụng.', ephemeral: true });
//                     // }

//                     await setResetInterval(refreshTime, interaction);

//                     await interaction.reply(`Bạn đã đặt ${refreshTime} để làm cho thời gian cảm ơn.`);
//                     break;

//             case 'delete-refresh':
                
//                     // Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
//                     const userdelete = await User.findOne({ discordId: interaction.user.id });
//                     if (!userdelete || !userdelete.isPremium) {
//                     return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng đăng ký premium để sử dụng.', ephemeral: true });
//                     }

//                     // Kiểm tra xem người dùng có mã premium hay không
//                     // const premiumCode = await PremiumCode.findOne({ user: interaction.user.id });
//                     // if (!premiumCode || !premiumCode.isUsed) {
//                     //   return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng nhập mã premium để sử dụng.', ephemeral: true });
//                     // }

//                     // Xóa thiết lập thời gian làm mới
//                     clearInterval(interval);
//                     await interaction.reply('Đã xóa thiết lập thời gian làm mới lời cảm ơn.');
                    
//                     break;
                    
//             default:
//                 await interaction.reply('Lệnh không hợp lệ!');
//                 break;
//         }
//     } catch (error) {
//         console.error('Lỗi trong quá trình thực thi lệnh:', error);
//         await interaction.reply({ content: 'Đã xảy ra lỗi trong quá trình thực thi lệnh.', ephemeral: true });
//     }
//     }
// };

//     async function getroleNameByName(guild, roleName) {
//         const role = guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
//         return role ? role.name : null;
//     }

//     // // Đặt công việc định kỳ để reset lời cảm ơn sau mỗi 2 phút
//     // setInterval(async () => {
//     //     try {
//     //         // await thanksSchema.updateMany({}, { Thanks: 0, Messages: [] });
//     //         await thanksSchema.deleteMany({}); // Xóa toàn bộ dữ liệu trong bảng
//     //         // console.log('Đã reset lại lời cảm ơn về 0.');
//     //     } catch (error) {
//     //         // console.error('Lỗi khi reset lời cảm ơn:', error);
//     //     }
//     // }, 2 * 60 * 1000); // 2 phút = 2 * 60 * 1000 ms

//     // Đặt công việc định kỳ để reset lời cảm ơn sau mỗi khoảng thời gian
// // Hàm này sẽ chạy mỗi khoảng thời gian đã định để reset lại dữ liệu cảm ơn
// async function setResetInterval(refreshTime, interaction) {
//     // let interval;

//     switch (refreshTime) {
//         case '5 phút':
//             interval = 5 * 60 * 1000;
//             break;
//         case '1 ngày':
//             interval = 24 * 60 * 60 * 1000;
//             break;
//         case '1 tuần':
//             interval = 7 * 24 * 60 * 60 * 1000;
//             break;
//         case '1 tháng':
//             interval = 30 * 24 * 60 * 60 * 1000;
//             break;
//         case '2 tháng':
//             interval = 60 * 24 * 60 * 60 * 1000;
//             break;
//         case '3 tháng':
//             interval = 90 * 24 * 60 * 60 * 1000;
//             break;
//         case '4 tháng':
//             interval = 120 * 24 * 60 * 60 * 1000;
//             break;
//         case '5 tháng':
//             interval = 150 * 24 * 60 * 60 * 1000;
//             break;
//         case '6 tháng':
//             interval = 180 * 24 * 60 * 60 * 1000;
//             break;
//         case '7 tháng':
//             interval = 210 * 24 * 60 * 60 * 1000;
//             break;
//         case '8 tháng':
//             interval = 240 * 24 * 60 * 60 * 1000;
//             break;
//         case '9 tháng':
//             interval = 270 * 24 * 60 * 60 * 1000;
//             break;
//         case '10 tháng':
//             interval = 300 * 24 * 60 * 60 * 1000;
//             break;
//         case '11 tháng':
//             interval = 330 * 24 * 60 * 60 * 1000;
//             break;
//         case '12 tháng':
//             interval = 360 * 24 * 60 * 60 * 1000;
//             break;
//         default:
//             throw new Error('Thời gian làm mới không hợp lệ.');
//     }

//     const resetData = async () => {
//         try {
//             // Lấy vai trò từ dữ liệu hiện tại
//             const leaderboard = await thanksSchema
//                 .find({})
//                 .sort({ Thanks: -1 });

//             leaderboard.forEach(async (entry) => {
//                 const guild = interaction.guild;
//                 const member = await guild.members.fetch(entry.User);
                
//                 // Kiểm tra và xóa vai trò đã cấp cho người dùng
//                 if (entry.Thanks >= 30) {
//                     const roleName = await getroleNameByName(interaction.guild, 'người sở hữu');
//                     const role = interaction.guild.roles.cache.find(role => role.name === roleName);
//                     if (role && member.roles.cache.has(role.id)) {
//                         await member.roles.remove(role.id);
//                     }
                    
//                 } else if (entry.Thanks >= 20) {
//                     const roleName = await getroleNameByName(interaction.guild, 'nhân viên');
//                     const role = interaction.guild.roles.cache.find(role => role.name === roleName);
//                     if (role && member.roles.cache.has(role.id)) {
//                         await member.roles.remove(role.id);
//                     }
                    
//                 } else if (entry.Thanks >= 10) {
//                     const roleName = await getroleNameByName(interaction.guild, '999');
//                     const role = interaction.guild.roles.cache.find(role => role.name === roleName);
//                     if (role && member.roles.cache.has(role.id)) {
//                         await member.roles.remove(role.id);
//                     }
                    
//                 } else if (entry.Thanks > 0) {
//                     const embed = new EmbedBuilder()
//                     .setAuthor({ name: 'Bot Valheim' , iconURL: 'https://i.imgur.com/njKam2g.gif', url: 'https://discord.gg/Jc3QuUEnnd' })
//                     .setTitle('LÀM MỚI THÔNG TIN CẢM ƠN!')
//                     .setDescription(`Bạn cần bắt đầu từ đầu để nhận lại điểm cảm ơn`)
//                     .setColor(`Green`)
//                     .setTimestamp()
//                     .setFooter({ text: 'Bot Valheim' })
//                     .setThumbnail('https://cdn.discordapp.com/attachments/100152043898273')
//                     .setImage('https://cdn.discordapp.com/attachments/100152043898273')
                
                
//                 await member.send({ embeds: [embed] });   
//                 }
//             });

            

//             //  Xóa dữ liệu lời cảm ơn
//             await thanksSchema.deleteMany({});

            
//         } catch (error) {
//             console.error('Lỗi khi reset lời cảm ơn:', error);
//         }
//     };

//     setInterval(resetData, interval);
// }
