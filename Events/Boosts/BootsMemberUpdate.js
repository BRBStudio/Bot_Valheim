const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: "guildMemberUpdate",
    
    async execute(oldMember, newMember) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'BootsMemberUpdate' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu máy chủ là hợp lệ
        if (newMember.guild === null) return;

        // Kiểm tra nếu có sự thay đổi trong trạng thái tăng cường
        if (!oldMember.premiumSince && newMember.premiumSince) {
            // URL ảnh avatar để đưa vào boost card
            let avatarURL = newMember.user.displayAvatarURL({ format: 'webp', dynamic: true, size: 1024 });
            avatarURL = avatarURL.replace('.webp', '.png');

            let nickname = newMember.nickname || newMember.user.username;

            let embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle("Hệ thống tăng cường máy chủ!")
                .setDescription(`${newMember.user.toString()} ( ${nickname} ) đã tăng cường máy chủ!`)
                .setThumbnail(newMember.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setImage(`https://api.aggelos-007.xyz/boostcard?avatar=${avatarURL}&username=${newMember.user.username}`)
                .setTimestamp();

            const embed1 = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Hệ thống tăng tường máy chủ')
                .setDescription(
                    `Cảm ơn ${newMember.user.toString()} ( ${nickname} ) đã tăng cường máy chủ của chúng tôi! Sự hỗ trợ của bạn có ý nghĩa rất lớn đối với chúng tôi.\n\n` +
                    `Để cảm ơn điều đó, chúng tôi sẽ tặng bạn vai trò ***Booster*** với các đặc quyền riêng. Một lần nữa cảm ơn sự đóng góp của bạn trong máy chủ`
                )
                .setThumbnail(newMember.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setImage(`https://api.aggelos-007.xyz/boostcard?avatar=${avatarURL}&username=${newMember.user.username}`)
                .setTimestamp();

            // Gửi tin nhắn embed đến người dùng đã tăng cường
            try {
                await newMember.send({ embeds: [embed1] });
                // console.log(`Đã gửi tin nhắn đến ${newMember.user.tag} về việc tăng cường.`);
            } catch (err) {
                console.log("Có lỗi khi gửi tin nhắn đến người dùng:", err);
            }

            // Kiểm tra xem kênh log-boosts đã tồn tại chưa
            let logChannel = newMember.guild.channels.cache.find(channel => channel.name === "log-boosts" && channel.type === ChannelType.GuildText);

            // Nếu chưa tồn tại kênh log-boosts, tạo kênh mới
            if (!logChannel) {
                try {
                    logChannel = await newMember.guild.channels.create({
                        name: "log-boosts",
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: newMember.guild.id, // Mặc định cho mọi thành viên
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            }
                        ],
                    });

                    // console.log(`Kênh 'log-boosts' đã được tạo trong máy chủ: ${newMember.guild.name}`);
                } catch (err) {
                    console.log("Có lỗi khi tạo kênh log-boosts:", err);
                    return;
                }
            }

            // Tìm role "Booster" trong máy chủ
            let boostRole = newMember.guild.roles.cache.find(role => role.name === "Booster");

            // Nếu role không tồn tại, tạo mới
            if (!boostRole) {
                try {
                    // Tạo role "Booster"
                    boostRole = await newMember.guild.roles.create({
                        name: "Booster",
                        color: "Yellow",
                        hoist: true, // Hiển thị role riêng biệt
                        mentionable: true, // Cho phép đề cập
                        permissions: [
                            PermissionsBitField.Flags.ViewChannel,              // Xem kênh
                            PermissionsBitField.Flags.SendMessages,            // Gửi tin nhắn
                            PermissionsBitField.Flags.AttachFiles,             // Đính kèm tập tin
                            PermissionsBitField.Flags.UseExternalEmojis,       // Dùng emoji bên ngoài
                            PermissionsBitField.Flags.Connect,                // Quyền video
                            PermissionsBitField.Flags.Speak,                  // Gửi tin nhắn thoại
                            PermissionsBitField.Flags.UseVAD,                 // Sử dụng chế độ tự động nhận diện giọng nói
                            PermissionsBitField.Flags.CreateInstantInvite,    // Tạo lời mời
                            PermissionsBitField.Flags.UseApplicationCommands, // Sử dụng câu lệnh ứng dụng
                            PermissionsBitField.Flags.UseExternalStickers,    // Dùng sticker mở rộng
                            PermissionsBitField.Flags.ManageMessages,         // Quản lý tin nhắn
                            PermissionsBitField.Flags.UseSoundboard,          // Dùng âm thanh bên ngoài
                            PermissionsBitField.Flags.MuteMembers,            // Tắt tiếng thành viên
                            PermissionsBitField.Flags.DeafenMembers,          // Tắt nghe thành viên
                            PermissionsBitField.Flags.ViewAuditLog,           // Xem nhật ký chỉnh sửa
                            PermissionsBitField.Flags.UseEmbeddedActivities,  // Sử dụng hoạt động
                            PermissionsBitField.Flags.RequestToSpeak          // Quyền yêu cầu nói trong sân khấu
                        ],
                    });

                    // console.log(`Đã tạo role Booster với quyền hạn đầy đủ cho máy chủ: ${newMember.guild.name}`);
                } catch (err) {
                    console.log("Có lỗi khi tạo role Booster:", err);
                    return;
                }
            } else {
                // Nếu role đã tồn tại, cập nhật các thuộc tính của role
                try {
                    await boostRole.edit({
                        color: "Yellow",
                        hoist: true, // Hiển thị role riêng biệt
                        mentionable: true, // Cho phép đề cập
                        permissions: [
                            PermissionsBitField.Flags.ViewChannel,              // Xem kênh
                            PermissionsBitField.Flags.SendMessages,            // Gửi tin nhắn
                            PermissionsBitField.Flags.AttachFiles,             // Đính kèm tập tin
                            PermissionsBitField.Flags.UseExternalEmojis,       // Dùng emoji bên ngoài
                            PermissionsBitField.Flags.Connect,                // Quyền video
                            PermissionsBitField.Flags.Speak,                  // Gửi tin nhắn thoại
                            PermissionsBitField.Flags.UseVAD,                 // Sử dụng chế độ tự động nhận diện giọng nói
                            PermissionsBitField.Flags.CreateInstantInvite,    // Tạo lời mời
                            PermissionsBitField.Flags.UseApplicationCommands, // Sử dụng câu lệnh ứng dụng
                            PermissionsBitField.Flags.UseExternalStickers,    // Dùng sticker mở rộng
                            PermissionsBitField.Flags.ManageMessages,         // Quản lý tin nhắn
                            PermissionsBitField.Flags.UseSoundboard,          // Dùng âm thanh bên ngoài
                            PermissionsBitField.Flags.MuteMembers,            // Tắt tiếng thành viên
                            PermissionsBitField.Flags.DeafenMembers,          // Tắt nghe thành viên
                            PermissionsBitField.Flags.ViewAuditLog,           // Xem nhật ký chỉnh sửa
                            PermissionsBitField.Flags.UseEmbeddedActivities,  // Sử dụng hoạt động
                            PermissionsBitField.Flags.RequestToSpeak          // Quyền yêu cầu nói trong sân khấu
                        ],
                    });

                    // console.log(`Đã cập nhật role Booster cho máy chủ: ${newMember.guild.name}`);
                } catch (err) {
                    console.log("Có lỗi khi cập nhật role Booster:", err);
                    return;
                }
            }

            // Thêm role cho người dùng
            try {
                await newMember.roles.add(boostRole);
                // console.log(`Đã tặng role Booster cho ${newMember.user.tag}`);
            } catch (err) {
                console.log("Có lỗi khi tặng role cho người dùng:", err);
            }

            // Gửi thông báo boost vào kênh log-boosts
            if (logChannel) {
                return logChannel.send({ embeds: [embed] });
            } else {
                console.log("Không tìm thấy hoặc không thể tạo kênh log-boosts.");
            }
        }
    }
}
