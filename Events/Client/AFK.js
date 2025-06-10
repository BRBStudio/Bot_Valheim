/*  
Hệ thống tự động kiểm tra người dùng AFK trong kênh thoại và di chuyển họ vào kênh AFK nếu cần ( dùng lệnh /brb_studio để bật tắt sự kiện này).
  
    🔹 Cách hoạt động:
    - Kiểm tra tất cả các kênh thoại trong máy chủ mỗi phút.
    - Nếu chưa có kênh AFK, bot sẽ tự động tạo một kênh mới.
    - Nếu người dùng không hoạt động, họ sẽ bị di chuyển vào kênh AFK.
    
    🔹 Tiêu chí xác định người dùng AFK:
    - Tắt mic (`selfMute`) hoặc bị máy chủ tắt mic (`serverMute`).
    - Tắt tai nghe (`selfDeaf`).
    - Có trạng thái Idle (`presence?.status === 'idle'`).
    - Có trạng thái Do Not Disturb (DND) (`presence?.status === 'dnd'`).
    - Không có trạng thái hoạt động (`!presence`, trường hợp người dùng ẩn hoặc không có trạng thái cập nhật).

    🔹 Các lưu ý khác:
    - Không di chuyển bot.
    - Người dùng chỉ bị di chuyển nếu họ đang trong kênh thoại.
    - Quá trình kiểm tra lặp lại mỗi phút (`AFK_TIMEOUT`).
*/


// const GuildUpdateStatus = require('../../schemas/brb_studio');
const { PermissionsBitField } = require('discord.js'); // Import PermissionsBitField để quản lý quyền hạn trong kênh
const AFKStatus = require('../../schemas/AfkSchemas'); // Import mô hình dữ liệu AFK từ database


const AFK_TIMEOUT = 60 * 1000; // Khoảng thời gian kiểm tra AFK (1 phút)
const AFK_CHANNEL_NAME = 'AFK'; // Tên kênh AFK mặc định

module.exports = {
    name: "ready", // Sự kiện này sẽ chạy khi bot sẵn sàng
    once: true, // Chỉ chạy một lần khi bot khởi động
    async execute(client) {
        // console.log(`${client.user.tag} đã khởi động! Bắt đầu kiểm tra AFK...`);

        // Định kỳ kiểm tra người dùng có cần bị chuyển vào kênh AFK không
        setInterval(async () => {
            for (const guild of client.guilds.cache.values()) { // Lặp qua tất cả các máy chủ mà bot tham gia
                try {
                    let status = await AFKStatus.findOneAndUpdate(
                        { guildId: guild.id, event: 'Ready' }, // Tìm dữ liệu trạng thái AFK của máy chủ
                        { $setOnInsert: { Ghi_chú: 'Tự động kiểm tra người dùng AFK trong kênh thoại', isEnabled: true } }, // Nếu chưa có thì tạo mới
                        { upsert: true, new: true } // Nếu có thì cập nhật, nếu chưa có thì tạo
                    );

                    if (!status.isEnabled) continue; // Nếu trạng thái AFK bị tắt trong database, bỏ qua máy chủ này

                    const afkChannel = await findOrCreateAFKChannel(guild); // Tìm hoặc tạo kênh AFK
                    if (!afkChannel) continue;

                    // Duyệt qua tất cả các kênh thoại trong máy chủ
                    for (const channel of guild.channels.cache.filter(ch => ch.type === 2).values()) {
                        for (const member of channel.members.values()) { // Duyệt qua tất cả thành viên trong kênh
                            if (shouldMoveToAFK(member, afkChannel)) { // Kiểm tra nếu thành viên cần chuyển vào AFK
                                console.log(`Di chuyển ${member.user.username} vào kênh AFK`);
                                await moveToAFK(member, afkChannel);
                            } else if (isReturningFromAFK(member, afkChannel)) { // Kiểm tra nếu thành viên quay lại từ AFK
                                console.log(`${member.user.username} đã thoát kênh AFK, kiểm tra lại...`);
                                await returnFromAFK(member);
                            }
                        }
                    }
                } catch (err) {
                    console.error(`Lỗi xử lý AFK trong guild ${guild.id}: ${err}`);
                }
            }
        }, AFK_TIMEOUT);
    },
};

// Hàm tìm hoặc tạo kênh AFK nếu chưa có
async function findOrCreateAFKChannel(guild) {
    let afkChannel = guild.channels.cache.find(ch => ch.name === AFK_CHANNEL_NAME && ch.type === 2);

    if (!afkChannel) {
        console.log(`Tạo kênh AFK cho máy chủ: ${guild.name}`);
        afkChannel = await guild.channels.create({
            name: AFK_CHANNEL_NAME,
            type: 2, // Loại kênh là voice
            reason: 'Tự động AFK',
            permissionOverwrites: [{
                id: guild.roles.everyone.id,
                deny: [
                    PermissionsBitField.Flags.Connect, // Chặn người dùng kết nối lại
                    PermissionsBitField.Flags.Speak, // Chặn nói trong kênh AFK
                    PermissionsBitField.Flags.Stream, // Chặn livestream
                    PermissionsBitField.Flags.UseEmbeddedActivities, // Chặn các hoạt động trong kênh
                ],
            }],
        }).catch(err => {
            console.error(`Không thể tạo kênh AFK: ${err}`);
            return null;
        });
    }

    return afkChannel;
}

// Hàm di chuyển người dùng vào kênh AFK
async function moveToAFK(member, afkChannel) {
    if (!member.voice.channel || member.voice.channelId === afkChannel.id) return; // Kiểm tra nếu người dùng không ở kênh voice hoặc đã ở kênh AFK

    const previousChannelId = member.voice.channelId; // Lưu kênh cũ của người dùng
    await member.voice.setChannel(afkChannel).catch(err => console.error(`Lỗi khi di chuyển: ${err}`)); // Di chuyển người dùng vào kênh AFK

    // Cập nhật trạng thái AFK vào database
    await AFKStatus.findOneAndUpdate(
        { guildId: member.guild.id }, // userId: member.id,
        { isAFK: true, previousChannelId },
        { upsert: true }
    );
}

// Kiểm tra xem có nên di chuyển thành viên vào kênh AFK không
function shouldMoveToAFK(member, afkChannel) {
    if (member.user.bot || !member.voice.channel) return false; // Bỏ qua bot hoặc người dùng không ở kênh thoại
    if (member.voice.channelId === afkChannel.id) return false; // Nếu đã ở kênh AFK thì không làm gì cả

    return (
        member.voice.selfMute || // Người dùng tự mute mic
        member.voice.serverMute || // Server mute người dùng
        member.voice.selfDeaf || // Người dùng tự deaf
        member.presence?.status === 'idle' || // Trạng thái idle (không hoạt động)
        member.presence?.status === 'dnd' || // Trạng thái Do Not Disturb (Không làm phiền)
        !member.presence // Không có trạng thái (có thể là offline)
    );
}

// Kiểm tra xem người dùng có quay lại từ AFK không
function isReturningFromAFK(member, afkChannel) {
    return member.voice.channel && member.voice.channelId !== afkChannel.id;
}

// Hàm đưa người dùng quay lại kênh trước đó nếu họ rời kênh AFK
async function returnFromAFK(member) {
    const afkData = await AFKStatus.findOne({ guildId: member.guild.id }); // Lấy dữ liệu AFK từ database userId: member.id,

    if (!afkData || !afkData.previousChannelId) return; // Nếu không có dữ liệu kênh trước đó, không làm gì

    const previousChannel = member.guild.channels.cache.get(afkData.previousChannelId); // Lấy kênh trước đó
    if (previousChannel) {
        await member.voice.setChannel(previousChannel).catch(err => console.error(`Lỗi khi đưa về kênh cũ: ${err}`)); // Chuyển người dùng về kênh cũ
    }

    // Xóa trạng thái AFK khỏi database
    await AFKStatus.findOneAndUpdate(
        { guildId: member.guild.id }, // userId: member.id,
        { isAFK: false, previousChannelId: null }
    );
}

