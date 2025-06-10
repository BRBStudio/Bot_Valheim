const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const interactionError = require('../../Events/WebhookError/interactionError');
const { removeEvent } = require('../../utils/sự_kiện');

// /great_events_valheim
const participatedUsers = new Map();

module.exports = {
    id: 'event_accept',
    description: 'Nút này được sử dụng để đồng ý tham gia sự kiện Valheim',
    
    async execute(interaction, client) {
        try {
            const guild = interaction.guild;
            const member = await guild.members.fetch(interaction.user.id);

            const message = interaction.message;
            const embed = message.embeds[0];
            const eventTitle = embed?.description?.match(/-\s(.+)/)?.[1];

            if (!eventTitle) {
                return interaction.reply({ content: '❌ Không thể xác định tên sự kiện.', ephemeral: true });
            }

            const eventKey = `${guild.id}-${eventTitle}`;
            if (!participatedUsers.has(eventKey)) {
                participatedUsers.set(eventKey, new Set());
            }

            const participants = participatedUsers.get(eventKey);
            if (participants.has(interaction.user.id)) {
                return interaction.reply({ content: '❌ Bạn đã đăng ký tham gia sự kiện này rồi!', ephemeral: true });
            }

            participants.add(interaction.user.id);

            // // ✅ LOG ra kiểm tra
            // console.log('==> Người dùng đã đăng ký sự kiện:', interaction.user.tag);
            // console.log('==> Danh sách người đã tham gia sự kiện này:', [...participants]);
            // console.log('==> Toàn bộ participatedUsers:');
            // for (const [key, userSet] of participatedUsers.entries()) {
            //     console.log(`Sự kiện: ${key} -> Người dùng:`, [...userSet]);
            // }

            // Danh sách vai trò (ngoại trừ @everyone)
            const roles = member.roles.cache
                .filter(role => role.name !== '@everyone')
                .sort((a, b) => b.position - a.position); // Sắp xếp theo vị trí

            const roleList = roles.map(role => `• ${role.toString()}`); // hiển thị vai trò bằng mention để có màu

            // Lấy màu vai trò cao nhất hoặc mặc định
            const topRoleColor = roles.first()?.hexColor || '#00FF00';

            const categoryName = "SỰ KIỆN DO AD TỔ CHỨC";
            const channelName = "danh_sách_đăng_kí";
            
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
            let eventChannel = guild.channels.cache.find(
                c => c.name === channelName && c.parentId === category.id
            );
            
            // Nếu chưa có kênh "raid", tạo mới trong category
            if (!eventChannel) {
                eventChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                });
            }


            const embedReply = new EmbedBuilder()
                .setTitle(`✅ Nộp đơn tham gia sự kiện **${eventTitle}**`)
                .addFields(
                    { name: '👤 Tên người dùng', value: `${member.displayName}`, inline: true },
                    { name: '🆔 ID người dùng', value: member.id, inline: true },
                    { name: '📅 Ngày tạo tài khoản', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: false },
                    { name: '🏷️ Vai trò', value: roleList.length > 0 ? roleList.join('\n') : 'Không có', inline: false },
                    { name: '🎯 Sự kiện', value: `**${eventTitle}**`, inline: false }
                )
                .setColor(topRoleColor)
                .setFooter({ text: `Server: ${guild.name}` })
                .setTimestamp();

            const xóa = new ButtonBuilder()
                .setCustomId(`dy_${interaction.user.id}`)
                .setLabel('đồng ý')
                .setStyle(ButtonStyle.Success);

            const nút = new ActionRowBuilder().addComponents(xóa);


            // await interaction.deferReply(); 
            // await interaction.deleteReply();
            await interaction.reply({ content: `Bạn đã đăng ký thành công, hãy đợi chủ thớt thông báo kết quả nhé ahihi`, ephemeral: [true]});
            const m = await eventChannel.send({ embeds: [embedReply], components: [nút] });

            // Tạo collector trên tin nhắn `m`
            const collector = m.createMessageComponentCollector({
                filter: i => i => i.customId.startsWith('dy_'), // chỉ người tạo sự kiện (bạn) được quyền nhấn
                time: 300_000, // 5 phút
            });

            collector.on('collect', async (i) => {
                try {
                    const targetUserId = i.customId.split('_')[1]; // Lấy ID người tham gia
                    const targetMember = await guild.members.fetch(targetUserId).catch(() => null);
            
                    if (!targetMember) {
                        return i.reply({ content: '❌ Không thể tìm thấy thành viên để duyệt.', ephemeral: true });
                    }

                    const displayName = targetMember.displayName; // Lấy tên hiển thị trong server
            
                    // Gửi DM cho người được duyệt
                    const dmEmbed = new EmbedBuilder()
                        .setTitle('🎉 Bạn đã được chấp nhận tham gia sự kiện!')
                        .setDescription(`Bạn đã có thể tham gia sự kiện **${eventTitle}** rồi, hãy chuẩn bị tinh thần đi nào 😎.`)
                        .setColor('Green')
                        .setFooter({ text: `Từ server: ${guild.name}` })
                        .setTimestamp();
            
                    await targetMember.send({ embeds: [dmEmbed] }).catch(() => {
                        console.warn(`Không thể gửi DM cho ${targetMember.user.tag}`);
                    });
            
                    // Xoá người dùng khỏi Map (nếu cần)
                    const participants = participatedUsers.get(eventKey);
                    if (participants) {
                        participants.delete(targetUserId);
                    }

                    // ✅ LOG kiểm tra sau khi xoá
                    // console.log(`==> Đã xoá ${targetUserId} khỏi sự kiện: ${eventKey}`);
                    // console.log('==> participatedUsers hiện tại:');
                    // for (const [key, userSet] of participatedUsers.entries()) {
                    //     console.log(`Sự kiện: ${key} -> Người dùng:`, [...userSet]);
                    // }
            
                    // Xoá tin nhắn đăng ký
                    await m.delete();

                    // Sau khi xóa tin nhắn thành công, mới gọi removeEvent
                    const timeMatch = eventTitle.match(/^(\d{1,2}):(\d{2})\s+(.+)/);
                    if (timeMatch) {
                        const [, hourStr, minuteStr, eventName] = timeMatch;
                        const hour = parseInt(hourStr);
                        const minute = parseInt(minuteStr);
                        removeEvent(guild, hour, minute, eventName);
                    }
            
                    await i.reply({ content: `✅ Đã duyệt người tham gia ${displayName}.`, ephemeral: true });  
                } catch (err) {
                    console.error('Lỗi khi duyệt người dùng:', err);
                    await i.reply({ content: '❌ Đã xảy ra lỗi khi duyệt người dùng.', ephemeral: true });
                }
            });

        } catch (error) {
            console.error('Lỗi khi xử lý nút event_accept:', error);
            return interactionError(interaction, 'Đã xảy ra lỗi khi xử lý đăng ký sự kiện.');
        }
    }
};