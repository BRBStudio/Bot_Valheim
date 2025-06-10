const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("modpanel")
    .setDescription(
        `🔹 Kiểm duyệt người dùng với bảng điều khiển này, phạt có\n` +
        `       thời gian`
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
    .addUserOption(option => option
        .setName("target")
        .setDescription("mục tiêu của hành động")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("lý do cho hành động của bạn")
        .setRequired(true)
    )
    .addAttachmentOption((option) => option
        .setName('image')
        .setDescription('Hình ảnh của bạn')
        .setRequired(true)
    ),

    async execute (interaction, client) {
        
        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/modpanel' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const {guild, options} = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason") || "Không có lý do nào được đưa ra";
        const image = options.getAttachment('image');
        const username = target
        const user = interaction.user.id

        const responses = [
            `Máy chủ này là nơi tôn nghiêm, bạn đã vi phạm luật đã được nêu ra trước đó.`,

            `Freya bị trục xuất khỏi ánh sáng, bị ràng buộc bởi bóng tối, Trong cô đơn, không tìm thấy niềm an ủi. Bạn cũng giống vậy, sau này hãy hành xử như 1 chiến binh.`,

            `Bạn nên nhớ luật server được đặt ra, bất kì ai cũng phải chấp hành kể cả Admin.`,

            `Bị cấm khỏi server, một mình, Trong bóng tối ngự trị, nơi sự im lặng ngự trị, Tiếng vang của sự mất mát, ở vùng đồng bằng trống trải.`,
                            
            `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ là nơi hội tụ các chiến binh valheim ngự trị.Hãy trở thành ánh sáng dẫn dắt mọi ngươi...`,
            
        ]

        const randomMessage = responses[ Math.floor(Math.random() * responses.length)];

        // Kiểm tra quyền của bot
        const botMember = guild.members.cache.get(client.user.id);
        const requiredPermissions = [
            PermissionsBitField.Flags.BanMembers,
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.ModerateMembers,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.EmbedLinks
        ];
        const missingPermissions = requiredPermissions.filter(permission => !interaction.guild.members.me.permissions.has(permission));

        if (missingPermissions.length > 0) {
            const missingPermissionsNames = missingPermissions.map(permission => {
                switch (permission) {
                    case PermissionsBitField.Flags.BanMembers:
                        return "Cấm thành viên";
                    case PermissionsBitField.Flags.KickMembers:
                        return "Đuổi thành viên";
                    case PermissionsBitField.Flags.ModerateMembers:
                        return "Quản lý thành viên";
                    case PermissionsBitField.Flags.SendMessages:
                        return "Gửi tin nhắn";
                    case PermissionsBitField.Flags.EmbedLinks:
                        return "Nhúng liên kết";
                    // Thêm các trường hợp cho các quyền khác nếu cần
                    default:
                        return "";
                }
            });
        
            const errorMessage = `Bot của bạn thiếu các quyền sau đây: ${missingPermissionsNames.join(", ")}, bạn cần cấp quyền này trước khi bắt đầu.\n\n\n${randomMessage}`;
        
            await interaction.reply({ content: errorMessage, ephemeral: true });
            return;
        }

        // Kiểm tra xem vai trò bot có cao hơn vai trò mục tiêu không
        if (botMember.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
            return await interaction.reply({
                content: `Bot không có quyền kiểm duyệt thành viên này vì vai trò của bot không cao hơn thành viên đó.\n\n\n${randomMessage}`,
                ephemeral: true
            });
        }

        if (target === interaction.user) {
            return await interaction.reply({
                content: `Bạn không thể kiểm duyệt bản thân!\n\n\n${randomMessage}`,
                ephemeral: true
            })
        }

        // timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("5 phút")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("10 phút")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("1 Tiếng")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("1 Ngày")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("1 Tuần")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Danger),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Ban(cấm)")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick(đá)")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("unban")
            .setEmoji("✅")
            .setLabel("Bỏ Ban")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("✅")
            .setLabel("Bỏ Hạn Chế")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle("Bảng kiểm duyệt")
        .setColor('Blue')
        .setImage('https://i.imgur.com/iBdxcV6.gif')
        .setDescription(`Đây là bảng điều khiển để kiểm duyệt <@${target.id}>!`)
        .addFields(
            {name: "Tên người dùng được kiểm duyệt", value: `${username}`, inline: false},
            {name: "ID người dùng", value: `${target.id}`, inline: false},
            {name: "Người xử phạt", value: `${interaction.user}`, inline: false},
            {name: "URL hình đại diện", value: `[Avatar](${await target.displayAvatarURL()})`, inline: false},
            {name: "Lý do xử phạt", value: `${reason}\n\n\n${randomMessage}`, inline: false},
        )
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        if (image) {
            embed.setImage(image.url);
        }

        const msg = await interaction.reply({
            embeds: [embed],
            components: [Row, tRow],
            ephemeral: true
        });

        const collector = msg.createMessageComponentCollector();

        const embed3 = new EmbedBuilder()
        .setColor('Blue')
        .setImage('https://i.imgur.com/iBdxcV6.gif')
        .setTimestamp()
        .setFooter({ text: `Người điều hành: ${interaction.user.displayName}`})

        if (image) {
            embed3.setImage(image.url);
        }

        collector.on('collect', async i => {
            if (i.customId === "ban") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                    return await i.reply({
                        content: `Bạn cần có quyền **CẤM (BanMembers)** thành viên !\n\n\n${randomMessage}`,
                        ephemeral: true
                    })
                }

                await interaction.guild.members.ban(target, {reason});

                embed3.setTitle("Ban").setDescription(`Bạn đã bị cấm vào ${i.guild.name}!\n\n\n${randomMessage}`)
                      .setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif')
                
                if (image) {
                    embed3.setImage(image.url);
                }

                await target.send({ embeds: [embed3] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });;

                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `<@${target.id}> đã bị cấm!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await i.reply({ content: `Bạn không có quyền **HẠN CHẾ (ModerateMembers)** Thành viên!\n\n\n${randomMessage}`, ephemeral: true})

                await target.timeout(null).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi xóa thời gian chờ của thành viên này!", ephemeral: true });
                });

                embed.setTitle("Hết thời gian").setDescription(`<@${target.id}> đã hết thời gian hình phạt trong máy chủ ***${i.guild.name}***!`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif');

                if (image) {
                    embed.setImage(image.url);
                }

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });

                // await i.deferUpdate();
                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `Thời gian hạn chế <@${target.id}> đã kết thúc`, ephemeral: true});
            }

            if (i.customId === "unban") {

                if (i.customId === "unban") {
                    // Kiểm tra quyền của người thực hiện thao tác
                    if (!i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                        return await i.reply({
                            content: `Bạn không có quyền **BỎ CẤM (BanMembers)** thành viên!\n\n\n${randomMessage}`,
                            ephemeral: true
                        });
                    }
    
                    try {
                        // Thực hiện bỏ cấm
                        await guild.bans.fetch(target.id)
                            .then(async () => {
                                await guild.bans.remove(target.id, reason);                               
    
                                // Gửi thông báo cho người dùng
                                embed3.setTitle("Bỏ cấm")
                                    .setDescription(`Bạn đã được **BỎ CẤM** khỏi máy chủ **${i.guild.name}**!\n\n\n${randomMessage}`)
                                    .setColor('Blue')
                                    .setImage('https://i.imgur.com/iBdxcV6.gif');
                                
                                if (image) {
                                    embed3.setImage(image.url);
                                }
    
                                await target.send({ embeds: [embed3] }).catch(err => {
                                    return i.reply({
                                        content: "Không thể gửi tin nhắn riêng cho người dùng này!",
                                        ephemeral: true
                                    });
                                });
    
                                // Gửi phản hồi thành công
                                if (!i.deferred && !i.replied) {
                                    await i.deferUpdate();
                                }
                                await i.editReply({
                                    content: `<@${target.id}> đã được bỏ cấm thành công!`,
                                    ephemeral: true
                                });
                            })
                            .catch(() => {
                                // Nếu người dùng không bị cấm
                                return i.reply({
                                    content: "Người dùng này không nằm trong danh sách bị cấm!",
                                    ephemeral: true
                                });
                            });
                    } catch (err) {
                        console.error(err);
                        return i.reply({
                            content: "Đã xảy ra lỗi khi cố gắng bỏ cấm người dùng này!",
                            ephemeral: true
                        });
                    }
                }    
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await i.reply({ content: `Bạn không có quyền **KICK (KickMembers)** Thành viên!\n\n\n${randomMessage}`, ephemeral: true});

                await interaction.guild.members.kick(target, {reason});

                embed.setTitle("Kick").setDescription(`Bạn đã bị đá khỏi ${i.guild.name}!`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif')

                if (image) {
                    embed.setImage(image.url);
                }

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });

                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `<@${target.id}> đã bị đá!`, ephemeral: true});
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await i.reply({ content: `Bạn không có quyền **HẠN CHẾ (ModerateMembers) ** Thành viên!\n\n\n${randomMessage}`, ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi chờ thành viên này!", ephemeral: true });
                });

                embed.setTitle("THÔNG BÁO VỀ VIỆC HẠN CHẾ NGƯỜI DÙNG").setDescription(`Bạn đã vi phạm hoặc gian lận, hình phạt sẽ diễn ra trong **5 phút**`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif');

                if (image) {
                    embed.setImage(image.url);
                }

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });

                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `Thời gian hình phạt <@${target.id}> là **5 phút**`, ephemeral: true});
            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await i.reply({ content: `Bạn không có quyền **HẠN CHẾ (ModerateMembers)** Thành viên!`, ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi chờ thành viên này!", ephemeral: true });
                });

                embed.setTitle("THÔNG BÁO VỀ VIỆC HẠN CHẾ NGƯỜI DÙNG").setDescription(`Bạn đã vi phạm hoặc gian lận, hình phạt sẽ diễn ra trong **10 phút**`).setColor('Blue');

                if (image) {
                    embed.setImage(image.url);
                }

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });

                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `Thời gian hình phạt <@${target.id}> là **10 phút**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await i.reply({ content: `Bạn không có quyền **HẠN CHẾ (ModerateMembers)** Thành viên!`, ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi chờ thành viên này!", ephemeral: true });
                });

                embed.setTitle("THÔNG BÁO VỀ VIỆC HẠN CHẾ NGƯỜI DÙNG").setDescription(`Bạn đã vi phạm hoặc gian lận, hình phạt sẽ diễn ra trong **1 giờ**`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif');

                if (image) {
                    embed.setImage(image.url);
                }

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });

                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `Thời gian hình phạt <@${target.id}> là **1 giờ**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await i.reply({ content: `Bạn không có quyền **HẠN CHẾ (ModerateMembers)** Thành viên!`, ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi chờ thành viên này!", ephemeral: true });
                });

                embed.setTitle("THÔNG BÁO VỀ VIỆC HẠN CHẾ NGƯỜI DÙNG").setDescription(`Bạn đã vi phạm hoặc gian lận, hình phạt sẽ diễn ra trong **1 ngày**`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif')

                if (image) {
                    embed.setImage(image.url);
                }

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });

                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `Thời gian hình phạt <@${target.id}> là **1 ngày**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await i.reply({ content: `Bạn không có quyền **HẠN CHẾ (ModerateMembers)** Thành viên!`, ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi chờ thành viên này!", ephemeral: true });
                });

                embed.setTitle("THÔNG BÁO VỀ VIỆC HẠN CHẾ NGƯỜI DÙNG").setDescription(`Bạn đã vi phạm hoặc gian lận, hình phạt sẽ diễn ra trong **1 tuần**`).setColor('Blue').setImage('https://i.imgur.com/iBdxcV6.gif')

                if (image) {
                    embed.setImage(image.url);
                }

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "Đã xảy ra lỗi khi gửi dm cho người dùng này!", ephemeral: true});
                });

                if (!i.deferred && !i.replied) {
                    await i.deferUpdate();
                }
                await i.editReply({ content: `Thời gian hình phạt <@${target.id}> là **1 tuần**`, ephemeral: true});
            }            
        })
    }
}
