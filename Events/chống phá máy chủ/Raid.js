const { Collection, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const BannedUser = require('../../schemas/Raid');
const raidUsers = new Collection();
const suspiciousReasons = new Map();

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const guildId = member.guild.id;
        const userId = member.id;

        if (member.user.bot) return;

        // Lấy config từ MongoDB
        const config = await BannedUser.findOne({ guildId });
        if (!config || !config.enabled) return; // Nếu chưa bật hoặc không tồn tại thì không làm gì

        if (!raidUsers.has(guildId)) {
            raidUsers.set(guildId, new Collection());
        }

        const guildRaids = raidUsers.get(guildId);
        guildRaids.set(userId, Date.now());

        // Điều kiện đáng ngờ bổ sung
        const user = member.user;
        const suspicious = [];

        if (!user.avatar) suspicious.push("Không có hình đại diện");
        const accountAgeMs = Date.now() - user.createdAt.getTime();
        if (accountAgeMs < 1000 * 60 * 60 * 24) suspicious.push("Tài khoản mới tạo dưới 1 ngày");

        if (suspicious.length > 0) {
            suspiciousReasons.set(userId, suspicious);
            triggerRaidProtection(member.guild); // Kích hoạt ngay nếu có dấu hiệu đáng ngờ
            return;
        }

        // Nếu không có nghi vấn, chỉ theo dõi trong 10 giây
        setTimeout(() => {
            raidUsers.delete(userId);
            suspiciousReasons.delete(userId); // Dọn dẹp lý do nghi ngờ (nếu có)
        }, 10000); // Xóa người dùng khỏi danh sách sau 10 giây

        if (guildRaids.size >= 10) {
            triggerRaidProtection(member.guild);
        }
    }
};

// ⚙️ Helper functions
const formatDate = (date) => {
    return date.toLocaleString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
        timeZoneName: 'short'
    });
};

async function getOrCreateRaidChannel(guild) {
    const categoryName = "Phát hiện và ngăn chặn người dùng phá server";
    const channelName = "raid";

    // Tìm category đã tồn tại
    let category = guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name === categoryName
    );

    // Nếu chưa có category, tạo mới
    if (!category) {
        category = await guild.channels.create({
            name: categoryName,
            type: ChannelType.GuildCategory,
            position: 0
        });
    }

    // Tìm kênh tên "raid" trong category
    let raidChannel = guild.channels.cache.find(
        c => c.name === channelName && c.parentId === category.id
    );

    // Nếu chưa có kênh "raid", tạo mới trong category
    if (!raidChannel) {
        raidChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.SendMessages]
                }
            ]
        });
    }

    return raidChannel;
}

async function triggerRaidProtection(guild) {
    const guildRaids = raidUsers.get(guild.id);
    const logChannel = await getOrCreateRaidChannel(guild);

    if (!logChannel) return;

    let bannedUsersInfo = [];

    for (const [userId] of guildRaids) {
        const member = await guild.members.fetch(userId).catch(() => null);

        if (member && !member.user.bot) {
            await member.ban({ reason: '🚨 Bảo vệ Raid: Phát hiện hoạt động đáng ngờ!' });

            const username = member.user.tag;
            const createdAtFormatted = formatDate(member.user.createdAt);
            const joinedAtFormatted = member.joinedAt ? formatDate(member.joinedAt) : "Không xác định";
            const banDateFormatted = formatDate(new Date());
            const avatarURL = member.user.displayAvatarURL({ dynamic: true, size: 1024 }) || "Không có hình đại diện.";
            const banner = (await member.user.fetch())?.bannerURL({ dynamic: true, size: 1024 }) || "Không có biểu ngữ.";
            const roles = member.roles.cache.filter(r => r.id !== guild.id).map(r => `<@&${r.id}>`).join(', ') || "Không có vai trò.";
            const reasons = suspiciousReasons.get(userId)?.join(', ') || "Không xác định.";

            // ✅ Chỉ lưu nếu chưa có hoặc cập nhật nếu đã có
            await BannedUser.updateOne(
                { guildId: guild.id },
                {
                $setOnInsert: {
                    enabled: true,
                    // logChannelId: null
                }
                },
                { upsert: true }
            );

            bannedUsersInfo.push({
                mention: `<@${userId}>`,
                username,
                userId,
                createdAtFormatted,
                joinedAtFormatted,
                banDateFormatted,
                avatarURL,
                banner,
                roles,
                reasons
            });
            suspiciousReasons.delete(userId); // Xóa lý do nghi ngờ
        }
    }

    const embed = new EmbedBuilder()
        .setTitle('🚨 Đã kích hoạt bảo vệ Raid!')
        .setColor('#ff0000')
        .setDescription('📌 **Những người dùng sau đây đã bị cấm do có hoạt động đáng ngờ:**');

    bannedUsersInfo.forEach(user => {
        embed.addFields([
            { name: "👤 người dùng:", value: `${user.mention} (${user.displayName})`, inline: true },
            { name: "🆔 ID:", value: user.userId, inline: true },
            { name: "📅 Thời gian tạo tài khoản:", value: user.createdAtFormatted, inline: false },
            { name: "📥 Thời gian đã tham gia server:", value: user.joinedAtFormatted, inline: false },
            { name: "⛔ Ngày giờ hệ thống ban người dùng này:", value: user.banDateFormatted, inline: false },
            { name: "🎭 Vai trò:", value: user.roles, inline: false },
            { name: "🖼️ Avatar:", value: user.avatarURL, inline: false },
            { name: "🎨 hồ sơ banner:", value: user.banner.startsWith('http') ? `[Xem banner](${user.banner})` : user.banner, inline: false }, // value: user.banner
            { name: "🚩 Lý do nghi ngờ:", value: user.reasons, inline: false }
        ]);
    });

    logChannel.send({ embeds: [embed] });
    raidUsers.delete(guild.id);
}




// const { Collection, EmbedBuilder } = require('discord.js');
// const BannedUser = require('../../schemas/Raid');
// const AntiRaidConfig = require('../../schemas/AntiRaidConfig');
// const raidUsers = new Collection();
// const logChannelId = '1343948968731738185';

// module.exports = {
//     name: 'guildMemberAdd',
//     async execute(member) {
//         const guildId = member.guild.id;
//         const userId = member.id;

//         if (member.user.bot) return;

//         // Lấy config từ MongoDB
//         const config = await AntiRaidConfig.findOne({ guildId });
//         if (!config || !config.enabled) return; // Nếu chưa bật hoặc không tồn tại thì không làm gì

//         if (!raidUsers.has(guildId)) {
//             raidUsers.set(guildId, new Collection());
//         }

//         const guildRaids = raidUsers.get(guildId);
//         guildRaids.set(userId, Date.now());

//         setTimeout(() => {
//             raidUsers.delete(userId);
//         }, 10000);

//         if (guildRaids.size >= 1) {
//             triggerRaidProtection(member.guild);
//         }
//     }
// };

// // ⚙️ Helper functions
// const formatDate = (date) => {
//     return date.toLocaleString('vi-VN', {
//         weekday: 'long',
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         timeZone: 'Asia/Ho_Chi_Minh',
//         timeZoneName: 'short'
//     });
// };

// async function triggerRaidProtection(guild) {
//     const guildRaids = raidUsers.get(guild.id);
//     const logChannel = await guild.channels.fetch(logChannelId).catch(() => null);

//     if (!logChannel) return;

//     let bannedUsersInfo = [];

//     for (const [userId] of guildRaids) {
//         const member = await guild.members.fetch(userId).catch(() => null);

//         if (member && !member.user.bot) {
//             await member.ban({ reason: '🚨 Bảo vệ Raid: Phát hiện hoạt động đáng ngờ!' });

//             const username = member.user.tag;
//             const createdAtFormatted = formatDate(member.user.createdAt);
//             const joinedAtFormatted = member.joinedAt ? formatDate(member.joinedAt) : "Không xác định";
//             const banDateFormatted = formatDate(new Date());
//             const avatarURL = member.user.displayAvatarURL({ dynamic: true, size: 1024 }) || "Không có hình đại diện.";
//             const banner = (await member.user.fetch())?.bannerURL({ dynamic: true, size: 1024 }) || "Không có biểu ngữ.";
//             const roles = member.roles.cache.filter(r => r.id !== guild.id).map(r => `<@&${r.id}>`).join(', ') || "Không có vai trò.";

//             await BannedUser.create({
//                 userId,
//                 username,
//                 guildId: guild.id
//             });

//             bannedUsersInfo.push({
//                 mention: `<@${userId}>`,
//                 username,
//                 userId,
//                 createdAtFormatted,
//                 joinedAtFormatted,
//                 banDateFormatted,
//                 avatarURL,
//                 banner,
//                 roles
//             });
//         }
//     }

//     const embed = new EmbedBuilder()
//         .setTitle('🚨 Đã kích hoạt bảo vệ Raid!')
//         .setColor('#ff0000')
//         .setDescription('📌 **Những người dùng sau đây đã bị cấm do có hoạt động đáng ngờ:**');

//     bannedUsersInfo.forEach(user => {
//         embed.addFields([
//             { name: "👤 người dùng:", value: `${user.mention} (${user.displayName})`, inline: true },
//             { name: "🆔 ID:", value: user.userId, inline: true },
//             { name: "📅 Thời gian tạo tài khoản:", value: user.createdAtFormatted, inline: false },
//             { name: "📥 Thời gian đã tham gia server:", value: user.joinedAtFormatted, inline: false },
//             { name: "⛔ Ngày giờ hệ thống ban người dùng này:", value: user.banDateFormatted, inline: false },
//             { name: "🎭 Vai trò:", value: user.roles, inline: false },
//             { name: "🖼️ Avatar:", value: user.avatarURL, inline: false },
//             { name: "🎨 hồ sơ banner:", value: user.banner.startsWith('http') ? `[Xem banner](${user.banner})` : user.banner, inline: false } // value: user.banner
//         ]);
//     });

//     logChannel.send({ embeds: [embed] });
//     raidUsers.delete(guild.id);
// }