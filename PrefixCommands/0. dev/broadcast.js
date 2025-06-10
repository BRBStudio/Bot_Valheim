const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const config = require('../../config');

/*
?sms <nhập nội dung>
*/
module.exports = {
    name: 'broadcast',
    description: '\`🔸 LỆNH DÀNH CHO DEV\`', //Gửi tin nhắn cho tất cả máy chủ
    hd: `\`🔸 Cách dùng: Không có thông tin\``,
    q: `\`🔸 Dành cho DEV\``,
    aliases: ['sms', 'dev1'],
    async execute(msg, args) {

        if (!config.specialUsers.includes(msg.author.id)) { 
            return msg.channel.send("Bạn không có quyền sử dụng lệnh này!"); 
        }

        // Kiểm tra xem người dùng có nhập thêm nội dung sau lệnh không
        if (!args.length) {
            return msg.channel.send('Vui lòng cung cấp nội dung thông báo.');
        }

        // Tạo nội dung của tin nhắn từ các tham số sau lệnh `?broadcast`
        const messageContent = args.join(' ');

        // Tạo embed với nội dung được tùy chỉnh
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('ĐÂY LÀ TIN NHẮN TỪ DEV')
            .setDescription(messageContent)
            .setTimestamp();

        // Duyệt qua tất cả các máy chủ bot đang tham gia
        msg.client.guilds.cache.forEach(async guild => {
            try {
                // Tìm danh mục `Thông Báo Từ Dev`
                let category = guild.channels.cache.find(
                    ch => ch.type === ChannelType.GuildCategory && ch.name === 'Thông Báo Từ Dev'
                );

                // Tìm kênh `dev-thông-báo`
                let devChannel = guild.channels.cache.find(
                    ch => ch.type === ChannelType.GuildText && ch.name === 'dev-thông-báo'
                );

                // Xử lý từng trường hợp
                if (category) {
                    // Nếu có danh mục `Thông Báo Từ Dev` nhưng không có kênh `dev-thông-báo` trong danh mục
                    if (!devChannel) {
                        devChannel = await guild.channels.create({
                            name: 'dev-thông-báo',
                            type: ChannelType.GuildText,
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone.id,
                                    deny: [PermissionsBitField.Flags.SendMessages],
                                },
                            ],
                        });
                    } else if (devChannel.parentId !== category.id) {
                        // Nếu kênh `dev-thông-báo` không thuộc danh mục `Thông Báo Từ Dev`, xóa kênh và tạo lại trong danh mục
                        await devChannel.delete();
                        devChannel = await guild.channels.create({
                            name: 'dev-thông-báo',
                            type: ChannelType.GuildText,
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone.id,
                                    deny: [PermissionsBitField.Flags.SendMessages],
                                },
                            ],
                        });
                    }

                    // Đặt vị trí danh mục `Thông Báo Từ Dev` lên trên cùng
                    await category.setPosition(0);
                } else {
                    // Nếu không có danh mục `Thông Báo Từ Dev`, tạo danh mục và kênh văn bản `dev-thông-báo` trong danh mục
                    category = await guild.channels.create({
                        name: 'Thông Báo Từ Dev',
                        type: ChannelType.GuildCategory,
                    });
                    await category.setPosition(0); // Đặt vị trí danh mục mới lên trên cùng

                    devChannel = await guild.channels.create({
                        name: 'dev-thông-báo',
                        type: ChannelType.GuildText,
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    });
                }

                // Gửi tin nhắn vào kênh `dev-thông-báo` đã xác định
                devChannel.send({ content: '@everyone', embeds: [embed] }).catch(console.error);

                // Chờ 2 phút trước khi xóa kênh
                setTimeout(async () => {
                    await devChannel.delete().catch(console.error); // Xóa kênh sau 2 phút
                }, 2 * 60 * 1000); // 3 ngày.... còn 2 phút = 2 * 60 * 1000 ms

            } catch (error) {
                console.error(`Không thể gửi tin nhắn trong máy chủ: ${guild.name} do lỗi: ${error}`);
            }
        });

        // Phản hồi lại người dùng để xác nhận rằng tin nhắn đã được gửi đi
        msg.channel.send('Tin nhắn đã được gửi đến tất cả các máy chủ!');
    },
};
