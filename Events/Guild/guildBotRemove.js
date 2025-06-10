const { ChannelType } = require(`discord.js`)
const EventStatus = require('../../schemas/Event_Status');

/*
khi có bất kì bot nào đó rời khỏi máy chủ sẽ có tin nhắn thống báo tới kênh
*/

module.exports = {
            name: "guildMemberRemove",

            async execute(member) {

                // // Kiểm tra trạng thái của sự kiện khi có bất kì bot nào đó rời khỏi máy chủ sẽ có tin nhắn thống báo tới kênh
                // const eventStatus = await EventStatus.findOne({ event: 'guildBotRemove' });

                // // Nếu sự kiện không được bật, thoát khỏi hàm
                // if (!eventStatus || eventStatus.status === 'off') {
                //     return; // Không làm gì cả nếu sự kiện bị tắt
                // }

                const guild = member.guild;
    
                // Kiểm tra nếu người rời khỏi là một bot
                if (member.user.bot) {
                    const channelName = "bot-bot"; // Thay tên kênh cụ thể vào đây
                    const channel = guild.channels.cache.find(channel => channel.name === channelName && channel.type === ChannelType.GuildText);

                    if (channel) {
                        // channel.send(`Bot ${member.user.tag} đã rời khỏi máy chủ.`);
                        // Kiểm tra xem bot có bị kick bởi một thành viên nào không
                const auditLogs = await guild.fetchAuditLogs({
                    type: 20,
                    limit: 1
                });

                const kickLog = auditLogs.entries.first();

                if (kickLog && kickLog.target.id === member.id) {
                    // Lấy tên người đã kick bot
                    const kicker = kickLog.executor;

                    // Gửi thông báo với tên người đã kick bot
                    channel.send(`**${kicker.displayName}** đã đá bot **${member.user.tag}** ra khỏi máy chủ.`);
                } else {
                    // Nếu không tìm thấy log "kick" hoặc bot không bị kick, chỉ đơn giản thông báo
                    channel.send(`Bot **${member.user.tag}** đã rời khỏi máy chủ.`);
                }
                    } else {

                    const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText); // Lọc ra chỉ các kênh văn bản
                    const randomChannel = channels.random(); // Chọn ngẫu nhiên một kênh từ danh sách các kênh văn bản

                    // khi không tìm thấy kênh channel sẽ nhắc nhở người dùng
                    if (randomChannel) {
                        randomChannel.send(`Hãy tạo kênh văn bản có tên "${channelName}" để nhận tin nhắn khi có bất kì bot nào rời khỏi máy chủ của bạn.`);
                    } else {
                    // console.log('Không tìm thấy kênh văn bản!');
                    return;           
                }
                // console.log('Không tìm thấy kênh văn bản có tên:', channelName);
            }
        }
    }
}