const { ChannelType, PermissionsBitField } = require('discord.js');
const interactionError = require('../WebhookError/interactionError');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    execute: async (msg) => {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'bsetupforum' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (msg.author.bot || !msg.guild) return;

        try {

            // Kiểm tra nếu tin nhắn được gửi trong kênh văn bản của máy chủ
            if (msg.channel.type === ChannelType.GuildText) {
                const content = msg.content;

                // Kiểm tra định dạng lệnh `bsetupforum` không phân biệt chữ hoa hay thường nhé
                if (content.toLowerCase().startsWith('bsetupforum')) {

                    const guildOwner = msg.guild.ownerId;
            
                    if (msg.author.id !== guildOwner) {
                        return msg.channel.send('Bạn không có quyền sử dụng lệnh này, lệnh này dành cho chủ sở hữu máy chủ.');
                    }

                    const parts = content.split('-');
                    
                    const forumName = parts[1]?.trim(); // thê  kênh chủ đề
                    const categoryName = parts[2]?.trim(); // tên danhmmci
                    let postGuide = parts[3]?.trim(); // Nhấp vào nút để đăng bài\nmỗi bài có 25 kí tự
                    const tags = parts[4]?.trim().split('+').map(tag => tag.trim()); // ten thte
                    const postTitle = parts[5]?.trim(); // tiêu đề bào viết
                    const postContent = parts[6]?.trim(); // nooijk dung bài viết
                    const defaultEmoji = parts[7]?.trim(); // chọn emoji tùy ý

                    // Thay thế \n trong hướng dẫn bài viết bằng xuống dòng thực tế
                    postGuide = postGuide.replace(/\\n/g, '\n');

                    // Kiểm tra nếu không đủ thông tin, chỉ cần trả về thông báo
                    if (!forumName || !postGuide || !tags || !postTitle || !postContent || !defaultEmoji) {
                        return msg.reply(
                            `Bạn cần cung cấp đủ các thông tin theo định dạng yêu cầu. Ví dụ cách viết đúng: \n` +
                            `\`bsetupforum-rồng vàng-COUNTER-Nhấp vào nút để đăng bài\\nmỗi bài có 25 kí tự-thẻ 1 + thẻ 2 + thẻ kim cương-chơi game-game valheim không mọi người?-🎉\`\n\n` +
                            `Trong đó: \n` +
                            `- \`rồng vàng\`: Tên diễn đàn.\n` +
                            `- \`COUNTER\`: Tên danh mục (tùy chọn).\n` +
                            `- \`Nhấp vào nút để đăng bài\\nmỗi bài có 25 kí tự\`: Hướng dẫn bài viết. Ký tự \\n sẽ được thay thế bằng xuống dòng thực tế.\n` +
                            `- \`thẻ 1 + thẻ 2 + thẻ kim cương\`: Các thẻ của diễn đàn (ngăn cách bằng dấu cộng '+').\n` +
                            `- \`chơi game\`: Tiêu đề bài viết.\n` +
                            `- \`game valheim không mọi người?\`: Nội dung bài viết.\n` +
                            `- \`🎉\`: chọn Emoji mặc định là 🎉.` 
                        );
                    }

                    // Tìm danh mục có tên là `categoryName`
                    let category = null;
                    if (categoryName) {
                        category = msg.guild.channels.cache.find(c => c.name === categoryName && c.type === ChannelType.GuildCategory);
                        if (!category) {
                            // Nếu không tìm thấy danh mục thì thông báo cho người dùng
                            msg.reply(`Không tìm thấy danh mục với tên: ${categoryName}. Kênh diễn đàn sẽ được tạo không có danh mục.`);
                        }
                    }

                    // Kiểm tra quyền của bot
                    if (!msg.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                        return msg.reply('Bot cần quyền quản lý kênh để thực hiện thao tác này.');
                    }

                    // Tạo kênh diễn đàn
                    const forumChannel = await msg.guild.channels.create({
                        name: forumName,
                        type: ChannelType.GuildForum,
                        parent: category ? category.id : null, // Nếu có category, gán id, nếu không thì null
                        topic: postGuide, // Thêm hướng dẫn bài đăng tại đây
                        reason: 'Tạo kênh diễn đàn theo yêu cầu',
                        defaultReactionEmoji: { // Thiết lập emoji mặc định
                            name: defaultEmoji
                        }
                    });

                    // Thêm thẻ vào kênh diễn đàn
                    const availableTags = tags.map(tag => ({ name: tag }));
                    await forumChannel.setAvailableTags(availableTags);

                    // Đăng bài viết đầu tiên trong kênh diễn đàn bằng cách tạo chủ đề (thread)
                    const thread = await forumChannel.threads.create({
                        name: postTitle,
                        message: {
                            content: postContent,
                        },
                        reason: 'Tự động đăng bài viết đầu tiên trong kênh diễn đàn'
                    });

                    return msg.channel.send({ content: `Kênh diễn đàn '${forumName}' đã được tạo thành công với bài viết '${postTitle}' và emoji mặc định '${defaultEmoji}'.`, ephemeral: true });
                }
            }
        } catch (error) {
            console.error('Error creating forum channel or post:', error);
            interactionError.handle(error, msg);
        }
    }
};