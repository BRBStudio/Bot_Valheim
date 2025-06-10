        /*
        hoạt động với lệnh /leave-guild mới có, khi thành viên rời máy chủ
        */
        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
        const channelSchema = require('../../schemas/channelSchema.js');
        const { createRow1 } = require('../../ButtonPlace/ActionRowBuilder');
        const EventStatus = require('../../schemas/Event_Status.js');

        module.exports = {
            name: "guildMemberRemove",

            async execute(member) {

                // // Kiểm tra trạng thái của sự kiện này
                // const eventStatus = await EventStatus.findOne({ event: 'guildMemberRemove' });

                // // Nếu sự kiện không được bật, thoát khỏi hàm
                // if (!eventStatus || eventStatus.status === 'off') {
                //     return; // Không làm gì cả nếu sự kiện bị tắt
                // }

                const { user, guild } = member;

                // console.log(`Xử lý thành viên rời khỏi: ${user.tag} từ guild: ${guild.id}`);

                // Lấy ID của kênh từ database
                const channelData = await channelSchema.findOne({ Guild: guild.id });

                if (!channelData) {
                    // console.log(`Không tìm thấy kênh để gửi thông báo cho guild: ${guild.id}`);
                    return;
                }

                const channelId = channelData.Channel;
                const channel = guild.channels.cache.get(channelId);

                if (channel) {
                    if (member.bannable) {
                        channel.send(`Thành viên ${user.displayName} vi phạm nội quy server, và đã bị cấm khỏi máy chủ.`);
                    }

                    const invite = await guild.invites.create(channelId, { // Tạo liên kết mời
                        maxAge: 0, // Liên kết sẽ không hết hạn
                        unique: true // Đảm bảo liên kết mời là duy nhất
                    }).catch(error => {
                        console.error(`Không thể tạo liên kết mời cho guild ${guild.name}:`, error);
                        return null;
                    });
        
                    const inviteLink = invite ? invite.url : 'Không thể tạo liên kết mời.';


                    // Tạo nút quay lại máy chủ
                    const row1 = createRow1(inviteLink);  // Tạo nút với URL động

                    const goodbyeMessage = `\`\`\`yml\nChúng ta đã cùng nhau trải qua quãng thời gian vui vẻ. Hi vọng bạn sẽ trở lại máy chủ ***${guild.name}*** vào 1 ngày không xa.\`\`\``;

                    const goodbyeEmbed = new EmbedBuilder()
                        .setAuthor({
                            name: '★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★',
                            iconURL: user.displayAvatarURL(),
                            url: 'https://discord.com/channels/1028540923249958912/1155704256154828881'
                        })
                        .setTitle(`Tạm biệt ${user.displayName}! 😢`)
                        .setDescription(goodbyeMessage)
                        .setColor('Red')
                        .setThumbnail(user.displayAvatarURL())
                        .setImage('https://media.giphy.com/media/q8btWot24CHVWJc7D2/giphy.gif')
                        .setTimestamp();

                        if (!user.bot || !user.blocked) {
                            user.send({ content: ``, embeds: [goodbyeEmbed], components: [row1] })
                            .catch(error => {   
                                if (error.code === 50007) {
                                    guild.fetchOwner().then(owner => {
                                        owner.send(`${user.tag} trong máy chủ ${guild.name} sẽ không nhận tin nhắn riêng tư .`);
                                    }).catch(error => {
                                        console.error(`Không thể gửi tin nhắn riêng tư cho ${user.displayName}:`, error);
                                    });
                                } else {
                                    console.error(`Không thể gửi tin nhắn riêng tư cho ${user.displayName}:`, error);
                                }
                            });
                    } else {
                        console.log(`Không thể gửi tin nhắn riêng tư cho ${user.displayName} do người dùng đã chặn hoặc là bot.`);
                    }
                } else {
                    // console.log(`Không tìm thấy channel với ID: ${channelId}`);
                    return;
                }
            }
        }
