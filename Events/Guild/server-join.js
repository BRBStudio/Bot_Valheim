const { EmbedBuilder, ChannelType } = require('discord.js');
const { button } = require('../../ButtonPlace/ActionRowBuilder');
const EventStatus = require('../../schemas/Event_Status');

/*
Gửi lời chào khi mời bot BRB vào máy chủ
*/

module.exports = {
    name: "guildCreate",
    async execute(guild) {

            // // Kiểm tra trạng thái của sự kiện này
            // const eventStatus = await EventStatus.findOne({ event: 'server-join' });

            // // Nếu sự kiện không được bật, thoát khỏi hàm
            // if (!eventStatus || eventStatus.status === 'off') {
            //     return; // Không làm gì cả nếu sự kiện bị tắt
            // }

            const owner = await guild.fetchOwner();

        async function sendMessage(channel) {

            const message = 
            `Cảm ơn đã mời bot của chúng tôi vào máy chủ của ***${guild.name}***!
                Để bot hoạt động tốt nhất, vui lòng làm theo các bước sau:
                1. Mở Discord và vào máy chủ mà bot đã được mời.\n
                2. Truy cập vào phần "Server Settings" (Cài đặt máy chủ).\n
                3. Chọn "Roles" (Vai trò).\n
                4. Tìm và chọn vai trò của bot.\n
                5. Kéo vai trò của bot lên trên cùng trong danh sách các vai trò.\n
                6. Dùng lệnh __/brb__ nhận hướng dẫn vào game valheim hoặc __/commands-bot__ để xem tất cả các lệnh của tôi.\n
                7. Bạn cũng có thể dùng lệnh __/valheim__ sau đó chọn game bạn muốn mời người chơi, để họ tham gia phòng của bạn\n\n` +

            `<a:fire:1304718051899609118> **1 SỐ TÍNH NĂNG ĐẶC BIỆT CỦA TÔI:**\n ` +
            `- **Hỗ trợ đa dạng lệnh**: Bot cung cấp nhiều lệnh tùy chỉnh để tối ưu hóa trải nghiệm chơi game Valheim.\n` +
            `- **Tạo phòng và mời người chơi**: Dễ dàng tạo phòng chơi và mời bạn bè tham gia thông qua các lệnh nhanh chóng.\n` +
            `- **Ticket**: Sử dụng hệ thống ticket để hỗ trợ thành viên nhanh chóng và chuyên nghiệp. có thể tự chỉ định vai trò người ht mà bạn mong muốn\n` +
            `- **Giveaway**: Tổ chức và quản lý các sự kiện giveaway với tính năng chọn ngẫu nhiên người thắng.\n` +
            `- **Đổi tiền Bitcoin**: Cập nhật và chuyển đổi tiền tệ nhanh chóng với công cụ tích hợp Bitcoin.\n` +
            `- **Thanh lọc thành viên**: thành viên không hoạt động hoặc không tuân thủ quy định bởi lệnh, thông tin chi tiết tại \`commands-bot\` và \`commands-new\`.\n` +
            `- **Gửi phản hồi**: Dùng lệnh **/mailbox** để gửi thông tin và góp ý trực tiếp cho chúng tôi.\n` +
            `- **Hệ thống đếm số lượng thành viên**: Cập nhật số lượng thành viên, bot, người dùng bị ban và số người boosts mỗi phút để có cái nhìn tổng quát về máy chủ.\n` +
            `- **Hệ thống kinh tế**: Tham gia vào nền kinh tế ảo của server với các hoạt động giao dịch và kiếm điểm.\n` +
            `- **Hệ thống cấp độ**: Cạnh tranh và thăng cấp dựa trên hoạt động của bạn trong server để đạt được các danh hiệu đặc biệt.\n` +
            `- **Thông báo tên khi người dùng vào/ra kênh voice**: Bot sẽ tự động thông báo và đọc tên khi thành viên tham gia hoặc rời khỏi kênh voice.\n` +
            `- **Lệnh mới**: ngoài lệnh thông thường \`?\` và \`/\` thì còn 1 số lệnh mới được NPT thêm vào.\n` +
            `- **Game mini**: Giải trí với các mini game tích hợp, thử vận may và giao lưu cùng các thành viên khác.\n` +
            `- **Thông báo thành viên rời khỏi máy chủ**: Dùng lệnh **/leave_guild** để tự động thông báo khi thành viên rời máy chủ.\n` +
            `<a:yeah:1304719818573746199> **TỔNG KẾT**: Tôi có tất cả, tất cả đều có trong tôi, tôi không kể hết ra đây được, hãy tự trải nghiệm thêm nhé.\n\n` +

            `>>> ❓ ***LƯU Ý:***
                **Nếu có bất kỳ câu hỏi nào, vui lòng dùng lệnh /mailbox gửi thông tin về cho chúng tôi hoặc liên hệ với DEV** [@Valheim Survival](https://discord.com/users/940104526285910046)!`;

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`Cảm ơn vì đã mời tôi! 😍`)
                .setImage(`https://media.tenor.com/Fn9Zb7_CDR0AAAAM/discord-hello.gif`)
                .setDescription(message)
                .addFields(
                    { name: `Tên chủ sở hữu máy chủ ***${guild.name}***`, value: `>>> \`\`\`${owner.displayName}\`\`\`` },
                    { name: `ID chủ sở hữu máy chủ ***${guild.name}***`, value: `>>> \`\`\`${guild.ownerId}\`\`\`` },
                )
                .setFooter({ text: 'Vui lòng xóa tin nhắn này bằng nút nếu nó ở kênh xấu!' });

            try {
                const msg = await channel.send({ embeds: [embed], components: [button] });

                const collect = msg.createMessageComponentCollector();
                collect.on('collect', async i => {
                    if (i.customId == 'deleteNew') {
                        await msg.delete();
                    }
                });

                return true;
            } catch (error) {
                // console.error(`Không thể gửi tin nhắn vào ${channel.name}:`, error);
                return false;
            }
        }

        const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);

        for (const channel of channels.values()) {
            const success = await sendMessage(channel);
            if (success) break;
        }
    }
}


////////// mời bot vào kênh sẽ hiện ra tin nhắn ///////////////////
//////////////////////////////////////////////////////////////////
//  ____  ____  ____    ____  _             _ _                //
// | __ )|  _ \| __ )  / ___|| |_ _   _  __| (_) ___          //
// |  _ \| |_) |  _ \  \___ \| __| | | |/ _` | |/ _ \        //
// | |_) |  _ <| |_) |  ___) | |_| |_| | (_| | | (_) |      //
// |____/|_| \_\____/  |____/ \__|\__,_|\__,_|_|\___/      //
//                                                        //
///////////////////////////////////////////////////////////