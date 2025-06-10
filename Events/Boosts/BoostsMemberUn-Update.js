const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: "guildMemberPremiumUpdate",
    
    async execute(oldMember, newMember) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'BoostsMemberUn-Update' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        if (newMember.guild === null) return;

        if (oldMember.premiumSince && !newMember.premiumSince) {

            let nickname = newMember.nickname || newMember.user.username;

            const boostRole = newMember.guild.roles.cache.find(role => role.name === "Booster");

            if (boostRole) {
                try {
                    await newMember.roles.remove(boostRole);
                    // console.log(`Đã xóa role Booster khỏi ${newMember.user.tag}`);
                } catch (err) {
                    console.log("Có lỗi khi xóa role cho người dùng:", err);
                }

                let avatarURL = newMember.user.displayAvatarURL({ format: 'webp', dynamic: true, size: 1024 });
                avatarURL = avatarURL.replace('.webp', '.png');

                let embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle("Hệ thống tăng cường máy chủ!")
                    .setDescription(`${newMember.user.toString()} ( ${nickname} ) đã ngừng tăng cường máy chủ!`)
                    .setThumbnail(newMember.user.displayAvatarURL({ format: "png", dynamic: true }))
                    .setImage(`https://api.aggelos-007.xyz/boostcard?avatar=${avatarURL}&username=${newMember.user.username}`)
                    .setTimestamp();
                
                const embed1 = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Hệ thống tăng tường máy chủ')
                    .setDescription(
                        `${newMember.user.toString()} ( ${nickname} ), bạn đã ngừng tăng cường máy chủ của chúng tôi!\n\n` +
                        `Vai trò ***Booster*** không còn phù hợp với bạn nữa, hãy tăng cường máy chủ để có vai trò ***Booster***`
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

                let logChannel = newMember.guild.channels.cache.find(channel => channel.name === "log-boosts" && channel.type === ChannelType.GuildText);

                if (logChannel) {
                    return logChannel.send({ embeds: [embed] });
                } else {
                    console.log("Không tìm thấy kênh log-boosts.");
                }
            }
        }
    }
}
