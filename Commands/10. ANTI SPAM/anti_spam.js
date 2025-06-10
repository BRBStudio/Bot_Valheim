const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const AutoMod = require('../../schemas/autoModSchema');
const { getPreferredLanguage } = require('../../languageUtils');
const CommandStatus = require('../../schemas/Command_Status');
const { checkAdministrator } = require('../../permissionCheck');

// Hàm để chuyển đổi thời gian từ định dạng chuỗi thành giây
const parseTime = (timeStr) => {
    const timeFormat = timeStr.toLowerCase();
    const value = parseInt(timeFormat.slice(0, -1));
    const unit = timeFormat.slice(-1);

    if (isNaN(value)) return NaN;

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 60 * 60 * 24;
        default: return NaN;
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anti_spam")
        .setDescription("🔹 Quản lý hệ thống ngăn spam tin nhắn")
        .addSubcommand(subcommand =>
            subcommand
                .setName("set_channel")
                .setDescription("🔹 Cài đặt hệ thống ngăn spam tin nhắn cho server")
                .addIntegerOption(option =>
                    option.setName("limit")
                        .setDescription("Giới hạn tin nhắn spam")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("mute_time")
                        .setDescription("Thời gian mute (ví dụ: 10s, 5m, 1h)")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("difference")
                        .setDescription("Khoảng thời gian giữa các tin nhắn (ví dụ: 2s, 1m)")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("🔹 Xóa dữ liệu hệ thống chống spam tin nhắn và kênh log-spam-tin-nhắn")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("set_log")
                .setDescription("🔹 Thiết lập kênh log spam cho server của bạn")
        ),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: `/anti_spam_mess` });
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Kiểm tra quyền Administrator
        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        if (subcommand === "set_log") {
            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/setup_anti_channel' });
            
            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }
                        
            const start = Date.now(); // Lưu lại thời điểm bắt đầu để tính thời gian thiết lập
            
            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;
            
            // Gửi tin nhắn khởi tạo thiết lập
            await interaction.reply({ content: 'Đang khởi tạo dữ liệu thiết lập nhanh!', ephemeral: true });
            
            // Kiểm tra quyền của bot
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                !interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.editReply(':ca_reject: Bot không có quyền cần thiết để tiếp tục (Quản lý Vai trò, Quản lý Kênh).');
            }
            await interaction.followUp({ content: 'Đang kiểm tra quyền hạn...', ephemeral: true });
            
            // Kiểm tra vị trí vai trò của bot
            const botRole = interaction.guild.members.me.roles.highest;
            if (!botRole) {
                return interaction.editReply({ content: 'Không thể tìm thấy vai trò của bot để kiểm tra.', ephemeral: true });
            }
            await interaction.followUp({ content:'Đang kiểm tra vị trí vai trò...', ephemeral: true });
            
            // Tạo mute role nếu chưa tồn tại
            let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
            if (!muteRole) {
                muteRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    color: '#818386',
                    permissions: [],
                    reason: 'Tạo role Muted cho hệ thống ngăn spam tin nhắn',
                });
            
            // Cập nhật các kênh để role "Muted" không có quyền gửi tin nhắn
            interaction.guild.channels.cache.forEach(async (channel) => {
                await channel.permissionOverwrites.create(muteRole, {
                        SendMessages: false,
                        Speak: false,
                        Connect: false,
                    });
                });
            }
            await interaction.followUp({ content: 'Đang tạo mute role...', ephemeral: true });
            
            // Tạo kênh log nếu chưa tồn tại
            let logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'log-spam-tin-nhắn');
            if (!logChannel) {
                logChannel = await interaction.guild.channels.create({
                    name: 'log-spam-tin-nhắn',
                    type: 0, // Loại là text channel
                    reason: 'Tạo kênh log cho hệ thống ngăn spam tin nhắn',
                });
            }
            await interaction.followUp({ content: 'Đang tạo kênh log...', ephemeral: true });
            
            // Lưu thông tin vào cơ sở dữ liệu
            let guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
            if (!guildConfig) {
                guildConfig = new AutoMod({
                    guildId: interaction.guild.id,
                    logChannelId: logChannel.id,
                    heatSettings: {
                        limit: 5,
                        muteTime: 300,
                        difference: 10,
                    },
                    antiLinkChannels: [logChannel.id], // Thêm kênh chống liên kết
                });
            } else {
                guildConfig.logChannelId = logChannel.id;
            }
            
            await guildConfig.save();
            await interaction.followUp({ content: 'Đang lưu cài đặt...', ephemeral: true });
            
            // Tính toán thời gian thực hiện
            const end = Date.now();
            const timeTaken = end - start;
            
            // Phản hồi hoàn thành thiết lập
            return interaction.followUp(`Setup Thành Công!\nQuá trình thiết lập kết thúc thành công trong ${timeTaken}ms. Bây giờ bạn có thể tiếp tục dùng lệnh \`/anti-spam-mess\` để cài đặt khác theo yêu cầu của riêng bạn.\nNếu bạn không dùng lệnh \`/anti-spam-mess\` để cài đặt theo yêu cầu cảu bạn thì mặc định sẽ là \`\`\`Limit: 5, muteTime: 300, difference: 10\`\`\``);
        }

        if (subcommand === 'set_channel') {
            const language = await getPreferredLanguage(interaction.guild.id, interaction.user.id);

            // Lấy tham số từ lệnh
            const limit = interaction.options.getInteger("limit");
            const muteTimeInput = interaction.options.getString("mute_time");
            const differenceInput = interaction.options.getString("difference");

            const muteTime = parseTime(muteTimeInput);
            const difference = parseTime(differenceInput);

            if (isNaN(limit) || isNaN(muteTime) || isNaN(difference)) {
                return interaction.reply(language === 'en'
                    ? `**${interaction.user.displayName}**, please provide valid parameters.\n\nExample:\n\`limit: 10\`\n\`mute_time: 10s\`\n\`difference: 10s\``
                    : `**${interaction.user.displayName}** vui lòng cung cấp đúng tham số.\n\nVí dụ:\n\`limit: 10\`\n\`mute_time: 10s\`\n\`difference: 10s\``);
            }

            let guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
            if (!guildConfig) {
                guildConfig = new AutoMod({ guildId: interaction.guild.id });
            }

            if (!guildConfig.logChannelId) {
                return interaction.reply(language === 'en'
                    ? `**${interaction.user.displayName}** need to choose **\`set_log\`** command before setting up the system.`
                    : `**${interaction.user.displayName}** cần lựa chọn **\`set_log\`** trước khi setup hệ thống.`);
            }

            guildConfig.heatSettings.limit = limit;
            guildConfig.heatSettings.muteTime = muteTime;
            guildConfig.heatSettings.difference = difference;
            await guildConfig.save();

            const successEmbed = new EmbedBuilder()
                .setTitle(language === 'en' ? 'AUTO MESSAGE SPAM SYSTEM SETTINGS UPDATED' : 'CÀI ĐẶT CHỐNG SPAM ĐÃ CẬP NHẬT')
                .setDescription(
                    language === 'en'
                        ? `**Maximum messages before mute**: ${limit}\n**Mute duration**: ${muteTimeInput} (${muteTime} seconds)\n**Message interval**: ${differenceInput} (${difference} seconds)`
                        : `**Số tin nhắn tối đa bị mute**: ${limit}\n**Thời gian mute**: ${muteTimeInput} (${muteTime} giây)\n**Khoảng cách tin nhắn**: ${differenceInput} (${difference} giây)`
                )
                .setColor('Gold');

            return interaction.reply({ embeds: [successEmbed] });
        }

        if (subcommand === 'remove') {
            const guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
            if (!guildConfig) {
                return interaction.reply('Không tìm thấy dữ liệu hệ thống chống spam tin nhắn cho server này.');
            }

            await AutoMod.deleteOne({ guildId: interaction.guild.id });
            await interaction.reply('Đã xóa dữ liệu hệ thống chống spam tin nhắn.');

            const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'log-spam-tin-nhắn');
            if (logChannel) {
                await logChannel.delete('Xóa kênh log khi xóa hệ thống chống spam tin nhắn.');
            } else {
                await interaction.followUp('Không tìm thấy kênh log-spam-tin-nhắn.');
            }
        }
    },
};





// const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
// const AutoMod = require('../../schemas/autoModSchema');
// const { getPreferredLanguage } = require('../../languageUtils');
// const CommandStatus = require('../../schemas/Command_Status');

// // Hàm để chuyển đổi thời gian từ định dạng chuỗi thành giây
// const parseTime = (timeStr) => {
//     const timeFormat = timeStr.toLowerCase();
//     const value = parseInt(timeFormat.slice(0, -1));
//     const unit = timeFormat.slice(-1);

//     if (isNaN(value)) return NaN;

//     switch (unit) {
//         case 's': return value;
//         case 'm': return value * 60;
//         case 'h': return value * 60 * 60;
//         case 'd': return value * 60 * 60 * 24;
//         default: return NaN;
//     }
// };

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("anti_spam_mess")
//         .setDescription("Cài đặt hệ thống ngăn spam tin nhắn cho server")
//         .setDMPermission(false) // Không cho phép dùng trong DM
//         .addIntegerOption(option => 
//             option.setName("limit")
//                 .setDescription("Giới hạn tin nhắn spam")
//                 .setRequired(true)
//         )
//         .addStringOption(option => 
//             option.setName("mute_time")
//                 .setDescription("Thời gian mute (ví dụ: 10s, 5m, 1h)")
//                 .setRequired(true)
//         )
//         .addStringOption(option => 
//             option.setName("difference")
//                 .setDescription("Khoảng thời gian giữa các tin nhắn (ví dụ: 2s, 1m)")
//                 .setRequired(true)
//         ),
    
//     async execute(interaction, client) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/anti_spam_mess' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         if (!interaction.guild) {
//             return;
//         }

//         // Lấy ngôn ngữ đã lưu của người dùng
//         const language = await getPreferredLanguage(interaction.guild.id, interaction.user.id);

//         // Kiểm tra quyền Administrator
//         if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//             return interaction.reply(language === 'en' 
//                 ? `**${interaction.user.displayName}** needs **\`Administrator\`** permission to use this command.` 
//                 : `**${interaction.user.displayName}** cần quyền **\`Administrator\`** để sử dụng lệnh.`);
//         }

//         // Lấy cài đặt từ MongoDB
//         let guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
//         if (!guildConfig) {
//             guildConfig = new AutoMod({ guildId: interaction.guild.id });
//         }

//         // Nếu chưa thiết lập kênh log
//         if (!guildConfig.logChannelId) {
//             return interaction.reply(language === 'en' 
//                 ? `**${interaction.user.displayName}** needs to use the **\`setup-anti-channel\`** command before setting up the **\`Auto Message Spam Detection System\`**.`
//                 : `**${interaction.user.displayName}** cần sử dụng lệnh **\`setup-anti-channel\`** trước khi setup **\`Hệ thống ngăn spam tin nhắn tự động\`**.`);
//         }

//         // Lấy các tham số từ lệnh
//         const limit = interaction.options.getInteger("limit");
//         const muteTimeInput = interaction.options.getString("mute_time");
//         const differenceInput = interaction.options.getString("difference");

//         const muteTime = parseTime(muteTimeInput); // Chuyển đổi muteTime từ chuỗi thành giây
//         const difference = parseTime(differenceInput); // Chuyển đổi difference từ chuỗi thành giây

//         if (isNaN(limit) || isNaN(muteTime) || isNaN(difference)) {
//             return interaction.reply(language === 'en'
//                 ? `**${interaction.user.displayName}**, please provide valid parameters.\n\nExample:\n\`limit: 10\`                  (up to 10 messages before mute)\n\`mute_time: 10s\`      (mute duration is 10 seconds)\n\`mute_time: 10m\`      (mute duration is 10 minutes)\n\`mute_time: 10h\`      (mute duration is 10 hours)\n\`mute_time: 10d\`         (mute duration is 10 days)\n\`difference: 10s\`         (message interval of 10 seconds will be considered spam)\n\`difference: 10m\`      (message interval of 10 minutes will be considered spam).`
//                 : `**${interaction.user.displayName}** vui lòng cung cấp đúng tham số.\n\nVí dụ:\n\`limit: 10\`                  (tối đa 10 tin nhắn sẽ bị mute)\n\`mute_time: 10s\`      (tức là thời gian mute là 10 giây)\n\`mute_time: 10m\`      (tức là thời gian mute là 10 phút)\n\`mute_time: 10h\`      (tức là thời gian mute là 10 tiếng)\n\`mute_time: 10d\`         (tức là thời gian mute là 10 ngày)\n\`difference: 10s\`         (tức là khoảng cách giữa các tin nhắn là 10 giây sẽ coi là spam)\n\`difference: 10m\`      (tức là khoảng cách giữa các tin nhắn là 10 phút sẽ coi là spam).`);
//         }

//         // Cập nhật cài đặt Heat
//         guildConfig.heatSettings.limit = limit;
//         guildConfig.heatSettings.muteTime = muteTime;
//         guildConfig.heatSettings.difference = difference;
//         await guildConfig.save();

//         // Tạo và gửi thông báo thành công
//         const successEmbed = new EmbedBuilder()
//             .setTitle(language === 'en' ? 'AUTO MESSAGE SPAM SYSTEM SETTINGS UPDATED' : 'CÀI ĐẶT HỆ THỐNG CHỐNG SPAM TIN NHẮN ĐÃ ĐƯỢC CẬP NHẬT')
//             .setDescription(
//                 language === 'en'
//                 ? `**Maximum number of messages before mute**: ${limit} actions\n` +
//                   `**Mute duration**: ${muteTimeInput} [${muteTime} seconds]\n` +
//                   `**Message interval considered as spam**: ${differenceInput} [${difference}s/action]\n` +
//                   `**Penalty**: Mute`
//                 : `**Số lượng tin nhắn tối đa sẽ bị mute**: ${limit} hành động\n` +
//                   `**Thời gian mute**: ${muteTimeInput} [${muteTime} giây]\n` +
//                   `**Khoảng cách giữa các tin nhắn sẽ coi là spam**: ${differenceInput} [${difference}s/hành động]\n` +
//                   `**Hình phạt**: Mute`
//             )
//             .setColor(`Gold`);

//         return interaction.reply({ embeds: [successEmbed] });
//     }
// };
