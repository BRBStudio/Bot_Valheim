const { EmbedBuilder } = require('discord.js');
const EventStatus = require('../../schemas/Event_Status');

/*
Sự kiện guildUpdate khi tên máy chủ được thay đổi
*/

module.exports = {
    name: "guildUpdate",

    async execute(oldGuild, newGuild) {

        // // Kiểm tra trạng thái của sự kiện
        // const eventStatus = await EventStatus.findOne({ event: 'guildUpdate' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Khai báo biến để lưu tên máy chủ cũ dùng cho sự kiện guildUpdate khi tên máy chủ được thay đổi
        let oldGuildName = '';

        const logChannelName = 'NK-THAY-ĐỔI-TÊN'; // Tên kênh để gửi thông báo

        // Kiểm tra xem tên máy chủ có thay đổi không
        if (oldGuild.name !== newGuild.name) {
            try {
                // Lưu tên máy chủ cũ
                oldGuildName = oldGuild.name;

                // Tìm kênh để gửi thông báo
                const logChannel = newGuild.channels.cache.find(channel => channel.name.toLowerCase() === logChannelName.toLowerCase());

                if (logChannel) {
                    const guildOwner = await newGuild.fetchOwner();
                    const guildOwnerTag = guildOwner ? guildOwner.user.displayName : 'Không tìm thấy chủ server'; // tên người sở hữu máy chủ

                    const newName = newGuild.name;

                    const editNameServer = new EmbedBuilder()
                        .setTitle('THÔNG BÁO ĐỔI TÊN MÁY CHỦ')
                        .setDescription(`Máy chủ **${oldGuildName}** đã được đổi tên thành **${newName}**`)
                        .setColor('Blue')
                        .setFooter({ text: `Được đổi tên bởi ${guildOwnerTag}` })
                        .setTimestamp();

                    // Gửi thông báo tới tên kênh được chỉ định
                    logChannel.send({ content: `@everyone`, embeds: [editNameServer] });
                } else {
                    // Gửi tin nhắn DM cho chủ sở hữu khi không tìm thấy kênh 'NK-THAY-ĐỔI-TÊN'
                    const owner = await newGuild.members.fetch(newGuild.ownerId);
                    if (owner && owner.user) {
                        const embedChannel = new EmbedBuilder()
                            .setTitle('KHÔNG TÌM THẤY KÊNH')
                            .setDescription(`Bạn cần có kênh văn bản ***${logChannelName}*** để mỗi khi bạn đổi tên máy chủ thì thông báo sẽ gửi vào kênh ***${logChannelName}*** và không phải nhận tin nhắn này nữa. Đôi khi thời gian phản hồi sẽ bị trễ đó là do đường truyền mạng nên bạn không cần phải lo lắng về điều đó.`)
                            .setColor('Red')
                            .setFooter({ text: 'Được tạo bởi Valheim Survival' })
                            .setTimestamp();

                        owner.user.send({ embeds: [embedChannel] });
                    } else {
                        console.error('Không thể tìm thấy chủ sở hữu máy chủ.');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi xử lý sự kiện guildUpdate:', error);
            }
        }
    }
};
