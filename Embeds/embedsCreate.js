const { EmbedBuilder, ChannelType, version } = require(`discord.js`)
const config = require(`../config`)
const os = require('node:os');
const osu = require('node-os-utils');
require(`loadavg-windows`);
const cpuStat = require(`cpu-stat`);
const tinycolor = require('tinycolor2');
const gethelpSchema = require(`../schemas/gethelpSchema`);
const { getPreferredLanguage } = require('../languageUtils');
const { text } = require('figlet');

const createEmojiEmbed = async (interaction) => {
    const guildOwner = await interaction.guild.fetchOwner();

    return new EmbedBuilder()
        .setTitle(`THÔNG BÁO`)
        .setColor(config.embedGreen)
        .setDescription(`Bạn bị liệt vào danh sách đen và không thể sử dụng lệnh. Liên hệ ***${guildOwner.user.displayName}*** nếu điều này là sai`) // Liên hệ [Valheim Survival](https://discord.com/users/940104526285910046)
}

const createHiEmbed = (interaction) => {

    return new EmbedBuilder()
        .setTitle(`TÔI LÀ ${interaction.client.user.username}!`)
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setDescription(
            `Chào mừng đến với máy chủ **${interaction.guild.name}** của chúng tôi! Chúng tôi đã biến nơi đây thành sân chơi đúng nghĩa, ` +
            `nhưng chúng ta có thể vui chơi và được là chính mình! Bạn có thể trò chuyện, chơi hoặc làm bất cứ điều gì bạn muốn ở đây. ` +
            `Tôi hy vọng chúng ta có thể kết bạn lâu dài và vui vẻ cùng nhau!\n\n` +
            `Nếu bạn cần bất kỳ trợ giúp nào, hãy liên hệ với một trong các Admin để được hỗ trợ bằng cách sử dụng lệnh này: </admin:1172947009410437142> ` +
            `hoặc bạn có thể dùng tag vai trò như @ADMIN, nhưng việc tag người dùng có ID là '1215380543815024700' sẽ bị loại bỏ vì đây là acc clone của Dev.`
        )
        .setColor(config.embedYellow);
};

// Hàm tạo Embed cho lời mời
const createInviteEmbedPage = (invites, page, pageSize) => {
    const pageStart = page * pageSize;
    const pageEnd = pageStart + pageSize;
    const currentPageInvites = invites.slice(pageStart, pageEnd);

    const pageEmbed = new EmbedBuilder()
        .setTitle('📨・TIN NHẮN NÀY SẼ XÓA SAU 1 PHÚT')
        .setDescription('Dưới đây là những lời mời hiện tại cho máy chủ này:')
        .setColor(config.embedGreen);

    currentPageInvites.forEach(invite => {
        pageEmbed.addFields(
            { name: 'Mã số', value: `\`\`\`https://discord.gg/${invite.code}\`\`\``, inline: true },
            { name: 'Người mời', value: invite.inviter, inline: true },
            { name: 'Thời gian', value: invite.timestamp, inline: true }
        );
    });

    return pageEmbed;
};

const createStatsEmbed = async (client, interaction) => {
        const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏓 | Đang tìm nạp số liệu thống kê...').setColor('Red')] });

        const meminfo = await osu.mem.info();
        const usedPercent = meminfo.usedMemPercentage;
        const freePercent = meminfo.freeMemPercentage;
        const usedMem = os.totalmem() - os.freemem();

    // Hàm tính toán bộ nhớ đệm
    function calculateCachedMemoryGB() {
        const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024); // Tổng bộ nhớ hệ thống tính bằng GB
        const freeMemoryGB = os.freemem() / (1024 * 1024 * 1024); // Bộ nhớ còn trống tính bằng GB
        const usedMemoryGB = totalMemoryGB - freeMemoryGB; // Bộ nhớ đã sử dụng tính bằng GB

        // Tính toán bộ nhớ đệm
        const cachedMemoryGB = usedMemoryGB - (process.memoryUsage().heapUsed / (1024 * 1024 * 1024));
        return cachedMemoryGB.toFixed(0);
    }

    // Hàm tính toán tỷ lệ sử dụng CPU
    function calculateCpuUsage() {
        const cpus = os.cpus();
        const adjustedTotalCores = cpus.length / 2;

        // Tính toán tổng sử dụng CPU
        const totalUsage = cpus.reduce((acc, core) => acc + core.times.user + core.times.nice + core.times.sys + core.times.idle, 0);

        // Tính toán tỷ lệ sử dụng CPU dựa trên tổng số lõi đã điều chỉnh
        const cpuPercentage = ((1 - cpus[0].times.idle / totalUsage) * adjustedTotalCores) / 10;
        return cpuPercentage.toFixed(2);
    }

    // Hàm định dạng thời gian hoạt động
    function formatUptime(uptime) {
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));

        return `d ${days}・h ${hours}・m ${minutes}・s ${seconds}`;
    }

    // Hàm định dạng kích thước bytes
    function formatBytes(bytes) {
        let size;
        if (bytes < 1000) size = `${bytes} B`;
        else if (bytes < 1000000) size = `${(bytes / 1000).toFixed(2)} KB`;
        else if (bytes < 1000000000) size = `${(bytes / 1000000).toFixed(2)} MB`;
        else if (bytes < 1000000000000) size = `${(bytes / 1000000000).toFixed(2)} GB`;
        else if (bytes < 1000000000000000) size = `${(bytes / 1000000000000).toFixed(2)} TB`;
        return size;
    }

    // Tạo embed số liệu thống kê
    return new EmbedBuilder()
        .setTitle(`:chart_with_upwards_trend: Số liệu thống kê của ${client.user.username}`)
        .setColor('Random')
        .setDescription(`\`\`\`yml\nTên: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nĐộ trễ API: ${client.ws.ping}ms\nĐộ trễ người dùng: ${Math.floor(msg.createdAt - interaction.createdAt)}ms\nThời gian hoạt động: ${formatUptime(client.uptime)}\`\`\``)
        .addFields([
            {
                name: ':bar_chart: Thống kê chung',
                value: `\`\`\`yml\nTổng số máy chủ: ${client.guilds.cache.size}\nNgười dùng: ${client.guilds.cache.map((e) => e.memberCount).reduce((a, b) => a + b, 0).toLocaleString()}\nDiscordJS: v${version}\nNodeJS: ${process.version}\`\`\``,
                inline: false,
            },
            {
                name: ':gear: Thống kê hệ thống',
                value: `\`\`\`yml\nHệ điều hành: ${os.type().replace('Windows_NT', 'Windows').replace('Darwin', 'macOS')}\nPhiên bản của hệ điều hành: ${os.platform() + ' ' + os.release()}\nThời gian hoạt động: ${formatUptime(os.uptime())}\nCPU: ${os.arch()}\`\`\``,
                inline: false,
            },
            {
                name: ':file_cabinet: Thống kê CPU',
                value: `\`\`\`yml\nChip ${cpuStat.avgClockMHz().toFixed(0)} MHz\nLõi: ${osu.cpu.count()}\nSử dụng CPU: ${calculateCpuUsage()}% / 50%\`\`\``,
                inline: true,
            },
            {
                name: ':straight_ruler: Thống kê RAM',
                value: `\`\`\`yml\nTổng bộ nhớ: ${formatBytes(os.totalmem())}\nBộ nhớ còn trống: ${formatBytes(os.freemem())} (${freePercent}%)\nBộ nhớ đã sử dụng: ${formatBytes(usedMem)} (${usedPercent.toFixed(1)}%)\nBộ nhớ đệm: ${calculateCachedMemoryGB()} GB\`\`\``,
                inline: false,
            },
            {
                name: ':man_technologist_tone1: Thống kê khác', // ${client.channels.cache.size.toLocaleString()} tổng các máy chủ, ${interaction.guild.channels.cache.size.toLocaleString()} máy chủ tương tác lệnh
                value: `\`\`\`yml\nSố lượng lệnh: ${client.commands.size}\nSố lượng kênh: ${client.channels.cache.size.toLocaleString()}\nEmojis: ${client.emojis.cache.size.toLocaleString()}\`\`\``,
                inline: false,
            },
            { name: '`⚙️`** | Nhà phát triển:**', value: `\`\`\`yml\n¹⁹⁸⁸Valheim Survival¹⁹⁸⁸\`\`\``, inline: true },
        ])
        .setThumbnail(`https://i.imgur.com/9bQGPQM.gif`) //https://i.imgur.com/9bQGPQM.gif
        .setImage('https://i.imgur.com/mBvxp6R.gif')
        .setFooter({ text: `Phiên bản: ${config.botVersion}` });
};

const createServerDetailsEmbed = (biggestServer) => {
    return new EmbedBuilder()
        .setColor("Green")
        .setTitle("Chi tiết máy chủ")
        .setImage(`https://i.imgur.com/e36VjTp.gif`)
        .setDescription("Dưới đây là chi tiết về máy chủ lớn nhất")
        .addFields([
            { name: 'Tên máy chủ', value: biggestServer.name },
            { name: 'ID Máy chủ', value: biggestServer.id },
            { name: 'Số lượng thành viên', value: `${biggestServer.memberCount}` },
            { name: 'Ngày thành lập', value: biggestServer.createdAt },
            { name: 'Nhấp link bên dưới để vào máy chủ', value: biggestServer.invite },
            { name: 'Người sở hữu', value: biggestServer.owner }
        ]);
};

const createMissingPermissionsEmbed = (missingPermissionsGuilds) => {
    return new EmbedBuilder()
        .setColor("Red")
        .setTitle("Thiếu quyền hạn")
        .setDescription("Các máy chủ sau không có đủ quyền hạn để bot lấy thông tin chi tiết:")
        .addFields(
            missingPermissionsGuilds.map(guild => ({
                name: 'Tên máy chủ',
                value: guild.name,
                inline: true
            }),
            {
                name: 'ID Máy chủ',
                value: guild.id,
                inline: true
            },
            {
                name: 'Thiếu quyền hạn',
                value: guild.missingPermissions.join(', '),
                inline: true
            }
        ))
        
};

const createBasicEmbed = (msg) => {
    const { guild } = msg; // Lấy guild từ msg
    const { members, stickers } = guild;
    const { name, ownerId, createdTimestamp, memberCount } = guild;
    const icon = guild.iconURL();
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    const id = guild.id;
    const channels = guild.channels.cache.size; // Tổng số kênh hiện có trong một máy chủ
    const category = guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size; // Danh mục
    const text = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size; // Kênh văn bản
    const voice = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size; // Kênh thoại
    const username1 = "Valheim Survival";
    const username2 = "Test15";

    // Tìm kiếm người dùng trong guild
    const user1 = guild.members.cache.find((member) => member.user.username === username1);
    const user2 = guild.members.cache.find((member) => member.user.username === username2);
    
    // Kết hợp thông tin cho cả hai người dùng trong một giá trị
    const combinedValue = `\`\`\`diff\n+ ${user1?.displayName || `${username1}`} \n+ ${user2?.displayName || `${username2}`} \`\`\``; 
    
    const coloredNameField = { 
        name: `\`\`\`\u200b ✨✿ **Người điều hành** ✿✨ \`\`\``,
        value: '\u200b' // Thêm giá trị để tránh lỗi thiếu giá trị
    };

    /////////////////////// Đếm số lượng kênh thông báo
    const announcementChannels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement); // kênh thông báo
    const announcementCount = announcementChannels.size;

    const stage = guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size; // Kênh sân khấu
    const forum = guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size; // Tổng kênh chủ đề bất kể công khai hay riêng tư.

    // Bộ đếm kênh chát
    const threadChannels = guild.channels.cache.filter((c) => c.type === ChannelType.PublicThread); // Kênh chủ đề riêng tư
    const threadCount = threadChannels.size;

    // Danh sách vai trò
    const rolelist = guild.roles.cache.toJSON().join(' ') || "Không có vai trò"; // Thay đổi ở đây để lấy tên vai trò
    const botCount = members.cache.filter(member => member.user.bot).size;
    const vanity = guild.vanityURLCode || '[Facebook](https://www.facebook.com/profile.php?id=100092393403399)';
    const sticker = stickers.cache.size;
    const highestrole = guild.roles.highest;
    const animated = guild.emojis.cache.filter(emoji => emoji.animated).size;
    const description = guild.description || 'No description';
    
    const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);

        const toPascalCase = (string, separator = false) => {
        const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
          return separator ? splitPascal(pascal, separator) : pascal;
        };

    // Tính năng của guild
    const features = guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None";

    let baseVerification = guild.verificationLevel;

    // Cấp độ xác minh
    if (baseVerification == 0) baseVerification = "Không có";
    if (baseVerification == 1) baseVerification = "Thấp";
    if (baseVerification == 2) baseVerification = "Trung bình";
    if (baseVerification == 3) baseVerification = "Cao";
    if (baseVerification == 4) baseVerification = "Rất cao";

    return new EmbedBuilder()
        .setAuthor({ name: name, iconURL: icon })
        .setURL("https://discord.com/channels/1028540923249958912/1173537274542174218")
        .setDescription("Chào mừng đến kỷ nguyên mới\n\nđây là FB của tôi nếu bạn cần sự hỗ trợ từ FB\n***[Facebook](https://www.facebook.com/profile.php?id=100092393403399)***\n\n> Lệnh hỗ trợ\n```/help```\n*Bot của ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★*\n`Bot Valheim` or ``Khi nào có sẽ cho vào``\n\n[Link Youtube](https://www.youtube.com/channel/UCg1k7_fu9RnEWO5t6p630bA)\n\n``@ADMIN``, ``@BRB STUDIO``, ``#channel``, ``@Thành Viên``, @here, @everyone đề cập đến\n\n|| Các lệnh của bot||\n\n**Đang chỉnh, chưa dùng được. Để không ảnh hưởng đến bot hoạt động, đề nghị không dùng cho đến khi có thông báo mới **\n~~/menu~~\n\n> ||Lệnh của admin||\n__/ban__\n__/unban__\n__/kick__\n__/poll__\n__/verification__\n\n> ||Lệnh của người dùng||\n**/basic(giải đáp thắc mắc cơ bản)**\n**/user-info**\n**/help**\n**/event**\n**/giverole**\n**/hi**\n**/ping**")
        .addFields(
            {
                name: "» Thế giới có thường xuyên cập nhật không? có thông báo khi server cập nhật không?",
                value: "Tất nhiên rồi, nó được công khai mà :))",
                inline: false
            },
            {
                name: "» Vào đâu để biết khi nào có sự kiện",
                value: "[🏇┊🦋event-sự-kiện🦋](https://discord.com/channels/1028540923249958912/1139719596820152461)",
                inline: false
            },
            { name: `» Vai trò cao nhất`,
                value: `${highestrole}`,
                inline: true
            },
            { 
                name: "» Ngày tạo",
                value: `<t:${parseInt(createdTimestamp / 1000)}:R>`,
                inline: true
            },
            { 
                name: "» Chủ sở hữu máy chủ",
                value: `<@${ownerId}>`,
                inline: true
            },
            { 
                name: "» URL độc quyền",
                value: `${vanity}`,
                inline: true
            },
            { 
                name: "» Số lượng thành viên",
                value: `${memberCount - botCount}`,
                inline: true
            },
            { 
                name: "» Số lượng bot",
                value: `${botCount}`,
                inline: true
            },
            { 
                name: "» Số lượng emoji",
                value: `${emojis}`,
                inline: true
            },
            { 
                name: "» Biểu tượng cảm xúc hoạt hình",
                value: `${animated}`,
                inline: true
            },
            { 
                name: "» Số lượng nhãn dán",
                value: `${sticker}`,
                inline: true
            },
            { 
                name: `» Số lượng vai trò`,
                value: `${roles}`,
                inline: true
            },
            { 
                name: "» Cấp độ xác minh",
                value: `${baseVerification}`,
                inline: true
            },
            { 
                name: "» Tăng số lượng",
                value: `${guild.premiumSubscriptionCount}`,
                inline: true
            },
            {
                name: "» Số kênh",
                value: `${channels}`,
                inline: true
            },
            {
                name: "» Kênh văn bản",
                value: `${text}`,
                inline: true
            },
            {
                name: "» Kênh thoại",
                value: `${voice}`,
                inline: true
            },
            {
                name: "» Kênh sân khấu",
                value: `${stage}`,
                inline: true
            },
            {
                name: "» Kênh diễn đàn",
                value: `${forum}`,
                inline: true
            },
            {
                name: "» Kênh thông báo",
                value: `${announcementCount}`,
                inline: true
            },
            {
                name: "» Số kênh chủ đề",
                value: `${threadCount}`,
                inline: true
            },
            coloredNameField,
            { name: "» Các vai trò:",
                value: `${rolelist}`,
                inline: false
            },
            {
                name: "» Thành viên online",
                value: combinedValue, // Sử dụng combinedValue đã thiết lập ở trên
                inline: true
            },
            {
                name: "» Tính năng của server:",
                value: `${features}`,
                inline: false
            }
        )
        .setColor("Blurple")
        .setTimestamp()
        .setFooter({ text: "©️ Thông tin server" });
};



const createStealEmojiEmbed = (emoji, name) => {

    return new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`Thêm ${emoji}, với cái tên ${name}`);
};

const createStatusBotEmbed = async (interaction) => {
    const language = await getPreferredLanguage(interaction.guild.id, interaction.user.id);

    const guild = interaction.guild;
    const members = await guild.members.fetch();
    const bots = members.filter(member => member.user.bot);

    const onlineBots = [];
    const offlineBots = [];

    bots.forEach(bot => {
        if (bot.presence?.status === 'online') {
            onlineBots.push(bot.user);
        } else {
            offlineBots.push(bot.user);
        }
    });

    const onlineBotsField = onlineBots.length ? onlineBots.map(bot => `- ${bot}`).join('\n') : (language === 'en' ? 'No bots are online' : 'Không có bot nào online');
    const offlineBotsField = offlineBots.length ? offlineBots.map(bot => `- ${bot}`).join('\n') : (language === 'en' ? 'No bots are offline' : 'Không có bot nào offline');

    const title = language === 'en' ? `Status of bots in the server ***${guild.name}***` : `Trạng thái của các bot trong máy chủ ***${guild.name}***`;

    return new EmbedBuilder()
        .setTitle(title)
        .addFields(
            { name: language === 'en' ? 'Online Bots' : 'Bot Online', value: onlineBotsField, inline: true },
            { name: '\u200B', value: Array(Math.max(onlineBots.length, offlineBots.length)).fill('│').join('\n'), inline: true },
            { name: language === 'en' ? 'Offline Bots' : 'Bot Offline', value: offlineBotsField, inline: true }
        )
        .setColor('Green')
        .setTimestamp();
};

// Hàm tạo embed cho tin nhắn bí mật
const createSecretMessageEmbed = (message) => {
    return new EmbedBuilder()
        .setColor('Blue')
        .setDescription(message);
};

// Hàm tạo embed cảnh báo
const createSnoopingWarningEmbed = (member) => {
    return new EmbedBuilder()
        .setColor('Yellow')
        .setDescription(`⚠️ Tin nhắn này dành cho ${member} dừng việc soi mói đi nhé :))`);
};

// 
const createBadWordsEmbed = (message) => {
    return new EmbedBuilder()
        .setTitle(`Hệ thống kiểm duyệt tự động`)
        .setColor(config.embedRed)
        .setTimestamp()
        .setThumbnail('https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTHsK1ZoItA_jI8Qsh_g-KScUGYtHjh5MqFuQGjFQAXyKD8UYneQToPyqYOgGzQWnbl')
        .setDescription(`${message.author}, tin nhắn của bạn đã bị hệ thống kiểm duyệt tự động của chúng tôi phát hiện vì vi phạm các quy tắc máy chủ của chúng tôi. Tình trạng này sẽ được điều tra thêm.`)
        .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`);
};

// Hàm mới tạo logEmbed
const createLogEmbed = (message) => {
    const now = new Date();
    const dayOfWeek = now.toLocaleString('vi-VN', { weekday: 'long' });
    const month = now.toLocaleString('vi-VN', { month: 'long' });
    const day = now.toLocaleString('vi-VN', { day: 'numeric' });
    const year = now.getUTCFullYear();

    return new EmbedBuilder()
        .setTitle(`Hệ thống kiểm duyệt tự động`)
        .setColor(config.embedWhite)
        .setThumbnail('https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTHsK1ZoItA_jI8Qsh_g-KScUGYtHjh5MqFuQGjFQAXyKD8UYneQToPyqYOgGzQWnbl')
        .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
        .setTimestamp()
        .addFields(
            {
                name: '🙋‍♂️ **Từ**',
                value: `${message.author}`,
                inline: false,
            },
            {
                name: '📜 **Tin nhắn**',
                value: `${message.content}`,
                inline: true,
            },
            {
                name: '🕓 Ngày',
                value: `${dayOfWeek} ngày ${day} ${month} Năm ${year}`,
                inline: true,
            }
        );
};

const createInviteEmbed = (client) => {
    const clientId = client.user.id;

    return new EmbedBuilder()
        .setTitle(config.TitleInviteBot)
        .setDescription(config.DescriptionInviteBot(clientId)) // Gọi hàm với clientId
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ 
            text:
                `‎                                                                                                                                                     \n` + 
                `‎                                                                                                                                 © BẢN QUYỀN THUỘC VỀ\n` +
                `‎                                                                                                                                       ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`
            });
};

const createReportEmbed = (client) => {
    return new EmbedBuilder()
        .setTitle(config.TitleReportBot)
        .setDescription(config.DescriptionReportBot)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ 
            text:
                `‎                                                                                                                                                     \n` + 
                `‎                                                                                                                                 © BẢN QUYỀN THUỘC VỀ\n` +
                `‎                                                                                                                                       ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`
            });
};

const createEmptyCategoryEmbed = (client) => {
    return new EmbedBuilder()
        .setTitle(config.TitleEmptyCategory)
        .setDescription(config.DescriptionEmptyCategory)
        .setColor(config.embedGreen)
        .setThumbnail(client.user.displayAvatarURL());
};

const createEmbedEmbed = (client) => {
    return new EmbedBuilder()
        .setTitle(config.TitleCommandsHelp)
        .setDescription(config.DescriptionCommandsHelp)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ 
            text:
                `‎                                                                                                                                                     \n` + 
                `‎                                                                                                                                 © BẢN QUYỀN THUỘC VỀ\n` +
                `‎                                                                                                                                       ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`
            });
};

const createChannelNotFoundEmbed = (nameChannel) => {
    return new EmbedBuilder()
        .setColor('Green')
        .setTitle(`❗ KHÔNG TÌM THẤY KÊNH ${nameChannel}`)
        .setDescription(`Máy chủ cần có kênh văn bản ***${nameChannel}*** để nhận đơn ứng tuyển của thành viên`);
};

// Hàm tạo embed cho Discord
function createDiscordEmbed(tag, icon, botIcon, reason, age, position, experience, user, guild, joinedAtFormatted) {
    return new EmbedBuilder()
        .setTitle('ĐƠN ĐĂNG KÝ TUYỂN DỤNG DISCORD')
        .setAuthor({ name: tag, iconURL: icon })
        .setThumbnail(botIcon)
        .setImage('https://www.shrm.org/content/dam/en/shrm/topics-tools/news/talent-acquisition/202101-Talent-Trends-1_bi4qgd.gif')
        .setDescription(`**Người nộp đơn:** ${user.displayName} \n\n**Lý do:** ${reason} \n\n **Tuổi:** ${age} \n\n **Vị trí ứng tuyển:**\n - ${position} \n\n **Kinh nghiệm:** ${experience}`)
        .addFields({ name: `Đã tham gia ${guild.name}`, value: joinedAtFormatted, inline: false })
        .setTimestamp();
}

// Hàm tạo embed cho Valheim
function createValheimEmbed(tag, icon, botIcon, reason, age, position, experience, user, guild, joinedAtFormatted) {
    return new EmbedBuilder()
        .setTitle('ĐƠN ĐĂNG KÝ TUYỂN DỤNG VALHEIM')
        .setAuthor({ name: tag, iconURL: icon })
        .setThumbnail(botIcon)
        .setImage('https://www.shrm.org/content/dam/en/shrm/topics-tools/news/talent-acquisition/202101-Talent-Trends-1_bi4qgd.gif')
        .setDescription(`**Người nộp đơn:** ${user.displayName} \n\n**Lý do:** ${reason} \n\n **Tuổi:** ${age} \n\n **Vị trí ứng tuyển:**\n - ${position} \n\n **Kinh nghiệm:** ${experience}`)
        .addFields({ name: `Đã tham gia ${guild.name}`, value: joinedAtFormatted, inline: false })
        .setTimestamp();
}

const createGetHelpListEmbed = async (interaction) => {
    const serverId = interaction.guild.id;

    let data = await gethelpSchema.findOne({ serverId });

    if (!data || data.userIds.length === 0) {
        // await interaction.reply('Chưa có người dùng nào được thiết lập để nhận yêu cầu trợ giúp.');
        return;
    }

    // Tạo danh sách người dùng để hiển thị
    const userTags = data.userIds.map((id, index) => 
        `\n> \`${index + 1}.\`\u2003<@${id}>`).join(' ');

    return new EmbedBuilder()
        .setTitle('DANH SÁCH NGƯỜI GIÚP ĐỠ')
        .setDescription(`Danh sách người dùng hiện tại sẽ giúp đỡ thành viên trong bài viết diễn đàn:\n${userTags}`)
        .setColor('Random')
        .setTimestamp();
};

const createGetHelpDMEmbed = async (interaction) => {

    // Lấy thông tin kênh chủ đề
    const threadChannel = interaction.channel;

    return new EmbedBuilder()
        .setTitle(`YÊU CẦU TRỢ GIÚP`)
        .setDescription(`Hãy cố gắng hết sức để hỗ trợ <@${interaction.user.id}>!\nHọ đang cần sự giúp đỡ trong kênh chủ đề: [${threadChannel.name}](${threadChannel.url})`)
        .setColor('Random')
        .setImage('https://cdn.dribbble.com/users/66340/screenshots/3089041/spinner2.gif')
        .setTimestamp();
};

const createGetHelpTagEmbed = async (interaction) => {
    const serverId = interaction.guild.id;
    const userName = interaction.user.displayName; // Lấy tên hiển thị trên server

    const data = await gethelpSchema.findOne({ serverId });

            if (!data || data.userIds.length === 0) {
                // await interaction.reply('Chưa có người dùng nào được thiết lập để nhận yêu cầu trợ giúp.');
                return;
            }

            // Tạo danh sách người dùng để tag trong description
            const userTags = data.userIds.map(id => `> <@${id}>`).join('\n');

    return new EmbedBuilder()
        .setTitle(`TRỢ GIÚP`)
        .setDescription(
            `Yêu cầu trợ giúp của bạn đã được gửi thành công, người trợ giúp của chúng tôi đã được thông báo. Hãy kiên nhẫn chờ đợi!!!\n\n` +
            `Người trợ giúp có sẵn:\n${userTags}`)
        .setColor('Random')
        .setImage('https://cdn.dribbble.com/users/66340/screenshots/3089041/spinner2.gif')
        .setFooter({ text: `Người yêu cầu: ${userName}`})
        .setTimestamp();
};


function createRefreshPingEmbed(wsEmoji, ws, msgEmoji, msgEdit, days, hours, minutes, seconds, interaction) {
    return new EmbedBuilder()
        .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
        .setColor(config.embedGreen)
        .setTimestamp()
        .setFooter({ text: `Đã ping vào` })
        .addFields(
            { name: 'Độ trễ của Websocket', value: `${wsEmoji} \`${ws}ms\`` },
            { name: 'Độ trễ API', value: `${msgEmoji} \`${msgEdit}ms\`` },
            { name: `Thời gian ${interaction.client.user.username} hoạt động`, value: `ghi giờ \`${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây\`` }
        );
}

function createIdEmbed(user) {
    return new EmbedBuilder()
        .setTitle(`THÔNG TIN ĐẦY ĐỦ`)
        .setColor(config.embedGreen)
        .addFields({ name: `Tên hiển thị trong máy chủ:`, value: `\`\`\`${user.displayName}\`\`\``, inline: false })
        .addFields({ name: `Tên đăng nhập:`, value: `\`\`\`${user.username}\`\`\``, inline: false })
        .addFields({ name: `ID người dùng:`, value: `\`\`\`yml\n${user.id}\`\`\``, inline: false }) // `\`${user.id}\``
}

// Embed sử dụng trong mailbox
const mailboxUserEmbed = (feedback, optionName, vote = null) => {
    const embed = new EmbedBuilder()
        .setTitle(optionName)
        .setDescription(`\`\`\`${feedback}\`\`\``)
        .setColor('Random')
        .setImage('https://i.gifer.com/origin/bc/bc77626a04355c8c12cf05a09f87c61a_w200.gif')
        .addFields({ 
            name: 'CHÚ Ý:', 
            value: 'Phản hồi của bạn sẽ được gửi tới DEV.\n\n***Nếu bạn đang ở máy chủ khác và cần giúp đỡ?***\nHãy thêm tên Discord của bạn kèm lời mời (mời vào máy chủ của bạn) vào phản hồi. Tốt nhất là lời mời vĩnh viễn vì tôi còn phải giúp đỡ nhiều người khác nữa. Nếu là lời mời ngắn hạn, có thể tôi sẽ bỏ lỡ điều gì đó từ bạn.', 
            inline: true 
        })
        .setTimestamp();

    if (vote) {
        embed.addFields({ name: 'Đánh giá của bạn:', value: vote });
    }

    return embed;
};

const mailboxAdminEmbed = (feedback, optionName, username, guildName, vote = null) => {
    const embed = new EmbedBuilder()
        .setTitle(optionName)
        .setDescription(`\`\`\`${feedback}\`\`\``)
        .setColor('Green')
        .setImage('https://i.gifer.com/origin/bc/bc77626a04355c8c12cf05a09f87c61a_w200.gif')
        .addFields(
            { name: 'Người dùng đã gửi yêu cầu:', value: username, inline: false },
            { name: 'Được gửi từ máy chủ:', value: guildName, inline: false }
        )
        .setTimestamp();

    if (vote) {
        embed.addFields({ name: 'Đánh giá:', value: vote });
    }

    return embed;
};

// LỆNH HELP_VALHEIM
const createThanhVienEmbed = (Mc) => new EmbedBuilder()
    .setColor(config.embedRandom)
    .setDescription(
        Mc 
        ? '**Bạn vào **[📌┊🦋rules🦋](https://discord.com/channels/1028540923249958912/1173537274542174218)** để kích hoạt tài khoản lên thành viên.**' 
        : '**Bạn vào **[<a:muiten1:1321530226983043072> THAM GIA MÁY CHỦ ĐỂ THẤY LINK NÀY](https://discord.gg/s2ec8Y2uPa)** để kích hoạt tài khoản lên thành viên.**'
    )
    .setThumbnail('https://images-ext-2.discordapp.net/external/_T0Cb2tVMjPrszLCx-7Do1A5lRZrPliSVzbno44v6kU/https/i.ibb.co/S54HQLJ/standard-2.gif')
    .setTitle('★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★')
    .setImage('https://i.imgur.com/9bQGPQM.gif');

const createLinkModEmbed = (Mc) => new EmbedBuilder()
    .setColor(config.embedRandom)
    .setDescription(
        Mc
        ? '**Khi trở thành thành viên bạn sẽ thấy [📂┊🦋𝑳𝒊𝒏𝒌-𝑴𝒐𝒅🦋](https://discord.com/channels/1028540923249958912/1111674941557985400), vào đó để lấy link mod nhé.**'
        : '**Khi trở thành thành viên bạn sẽ thấy **[<a:muiten1:1321530226983043072> THAM GIA MÁY CHỦ ĐỂ THẤY LINK NÀY](https://discord.gg/s2ec8Y2uPa)** vào đó để lấy link mod nhé.**'
    )
    .setThumbnail('https://images-ext-2.discordapp.net/external/_T0Cb2tVMjPrszLCx-7Do1A5lRZrPliSVzbno44v6kU/https/i.ibb.co/S54HQLJ/standard-2.gif')
    .setTitle('★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★')
    .setImage('https://i.imgur.com/9bQGPQM.gif');

module.exports = {
    createHiEmbed,                              // lệnh hi.js và biểu ngữ app chào thành viên
    createStatsEmbed,                           // lệnh info-bot.js
    createServerDetailsEmbed,                   // lệnh server.js
    createMissingPermissionsEmbed,              // lệnh server.js
    createBasicEmbed,                           // lệnh basic.js
    createEmojiEmbed,                           // lệnh emoji.js
    createStealEmojiEmbed,                      // lệnh steal-emoji.js
    createStatusBotEmbed,                       // lệnh status-bot.js
    createSecretMessageEmbed,                   // lệnh message-secret.js
    createSnoopingWarningEmbed,                 // lệnh message-secret.js
    createBadWordsEmbed,                        // dùng cho badwords.js trong thư mục Events
    createLogEmbed,                             // dùng cho badwords.js trong thư mục Events
    createInviteEmbed,                          // lệnh bot-commands.js
    createReportEmbed,                          // lệnh bot-commands.js
    createEmptyCategoryEmbed,                   // lệnh bot-commands.js
    createEmbedEmbed,                           // lệnh bot-commands.js
    createChannelNotFoundEmbed,                 // lệnh recruitment.js
    createDiscordEmbed,                         // lệnh recruitment.js
    createValheimEmbed,                         // lệnh recruitment.js
    createGetHelpListEmbed,                     // lệnh get-help.js
    createGetHelpDMEmbed,                       // lệnh get-help.js
    createGetHelpTagEmbed,                      // lệnh get-help.js
    createRefreshPingEmbed,                     // dùng tại xủ lý nút refreshping.js và lệnh ping-api.js
    createIdEmbed,                              // lệnh id.js
    createInviteEmbedPage,                      // lệnh cho invites_code.js
    mailboxUserEmbed,                           // lệnh cho mailbox.js
    mailboxAdminEmbed,                          // lệnh cho mailbox.js
    createThanhVienEmbed,                       // lệnh help_valheim.js
    createLinkModEmbed,                         // lệnh help_valheim.js
}