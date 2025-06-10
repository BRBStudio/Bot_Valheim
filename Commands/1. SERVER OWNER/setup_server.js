const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, setPosition } = require("discord.js");
const User = require('../../schemas/premiumUserSchema');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup_server")
        .setDescription("🔹 Thiết lập toàn bộ máy chủ (nhúng, kênh, v.v.)")
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addStringOption((option) => option.setName("setup").setDescription("thiết lập máy chủ bằng lệnh!").setRequired(true).addChoices(

            { name: "Cơ bản", value: "basic" },
            { name: "Nâng cao", value: "advanced" },
            { name: "Cao cấp", value: "premium" })),


    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/setup_server' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }
        
        // Kiểm tra xem tương tác đã được trả lời hoặc hoãn lại chưa
        if (interaction.deferred || interaction.replied) {
            // Nếu đã được trả lời hoặc hoãn lại, không thực hiện hành động nữa
            return;
        }

        // // Kiểm tra xem tương tác có phải là lệnh "setup-server" không
        // if (interaction.commandName !== "setup-server") {
        //     // Nếu không phải là lệnh "setup-server", không thực hiện hành động
        //     return;
        // }

        // Kiểm tra xem bot có quyền quản trị viên không
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: `Tôi thiếu quyền ***QUẢN TRỊ VIÊN***, bạn cần cấp quyền này cho tôi trước khi bắt đầu.`, ephemeral: true });
            return;
        }

        // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu của máy chủ không
        if (interaction.guild.ownerId !== interaction.user.id) {
            return await interaction.reply({ content: "Lệnh này chỉ dành cho chủ sở hữu máy chủ", ephemeral: true });
        }

        // // Danh sách ID của các người dùng được phép sử dụng lệnh này
        // const allowedUserIds = ["1215380543815024700", "940104526285910046", "ID_nguoi_dung_1", "ID_nguoi_dung_2"];

        // // Kiểm tra xem người dùng hiện tại có trong danh sách được phép không
        // if (!allowedUserIds.includes(interaction.user.id))
        //     return await interaction.reply({ content: "Lệnh này chỉ dành cho dev", ephemeral: true });
        // if (interaction.user.id !== "1215380543815024700" && interaction.user.id !== "940104526285910046") return await interaction.reply({ content: "Lệnh này chỉ dành cho dev", ephemeral: true });

        const setup = interaction.options.getString("setup");

        switch (setup) {
            case "basic": {

                const basicEmbed = new EmbedBuilder()
                    .setColor("Orange")
                    .setTitle("⚠️ Cảnh báo tạo máy chủ cơ bản ⚠️")
                    .setDescription(
                        "***CẤP TẤT CẢ CÁC QUYỀN CHO BOT TRƯỚC KHI THỰC HIỆN ĐIỀU NÀY***\n\n" +
                        "⚠️⚠️⚠️LƯU Ý: NẾU BẠN XÁC NHẬN THÌ TẤT CẢ KÊNH/DANH MỤC/VAI TRÒ TRONG MÁY CHỦ NÀY SẼ BỊ XÓA/THAY THẾ***\n\n" +
                        "Nhấp vào nút ✅ để xác nhận thiết lập hoặc nút ❌ để từ chối thiết lập cho máy chủ này!"
                    )
                    .setTimestamp()
                    .setFooter({ text: "Cảnh báo cài đặt cơ bản" });

                const buttons = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setEmoji("✖️")
                        .setLabel("Từ Chối")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("setup-sv-no"),

                    new ButtonBuilder()
                        .setEmoji("✅")
                        .setLabel("Đồng Ý")
                        .setStyle(ButtonStyle.Success)
                        .setCustomId("setup-sv-ok"));

                await interaction.deferReply({ ephemeral: true }); // Hoãn phản hồi để tránh lỗi

                await interaction.channel.send({ embeds: [basicEmbed], components: [buttons] });

                await interaction.deleteReply(); // Xóa phản hồi đã hoãn để tránh lỗi "Ứng dụng không phản hồi"
                
                const collector = interaction.channel.createMessageComponentCollector();

                // let setupMessage; // Biến để lưu trữ tham chiếu tin nhắn

                collector.on("collect", async (i) => {
                    
                    if (i.customId === "setup-sv-no") {
                        basicEmbed.setColor("DarkGreen");
                        basicEmbed.setTitle("Đã hủy thiết lập máy chủ cơ bản");
                        basicEmbed.setDescription("Việc thiết lập máy chủ cơ bản đã bị hủy, nếu điều này không phải dự định của bạn thì hãy chạy lại lệnh.");
                        basicEmbed.setTimestamp();
                        i.update({ embeds: [basicEmbed], components: [], fetchReply: true }).then((message) => {
                            setTimeout(() => { message.delete(); }, 5000);
                        });

                        return;
                    }

                    if (i.customId === "setup-sv-ok") {
                    
                        basicEmbed.setColor("Gold");
                        basicEmbed.setTitle("Đang khởi tạo...");
                        basicEmbed.setDescription("Quá trình thiết lập máy chủ cơ bản đã được bắt đầu, việc này sẽ mất nhiều thời gian hơn và phụ thuộc vào đường truyền mạng của bạn. Đừng nóng vội, hãy đợi trong giây lát");
                        basicEmbed.setImage(`https://cdn.dribbble.com/users/90627/screenshots/1096260/loading.gif`);
                        basicEmbed.setTimestamp();

                        // lưu trữ tin nhắn cần xóa
                        setupMessage = await i.update({ embeds: [basicEmbed], components: [] });

                        await new Promise((resolve) => setTimeout(resolve, 5000));
                    } // sử dụng lại mã nhúng và mã nút cho các giá trị khác

                    if (interaction.guild.channels.cache.size) {
                        for await (const [, channel] of interaction.guild.channels.cache) await channel.delete().catch(() => null);
                    }

                    const { guild } = interaction;

                    const categorybasic = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "Quan trọng"
                    });

                    await guild.channels.create({
                        name: "🙌・chào-mừng", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages]
                            }
                        ]
                    });

                    await guild.channels.create({
                        name: "📚・quy-tắc", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages]
                            }
                        ]
                    });

                    // const category = interaction.guild.categories.cache.find((category) => category.name.includes("report"));
                    const channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("quy-tắc")); // when reusing this line change the variable (channel) change to like (channel2) (used to find channels)

                    const rulesembed = new EmbedBuilder()
                        .setTitle("Quy tắc")
                        .setColor("Orange")
                        .addFields({ name: "**Quy tắc máy chủ Discord**", value: "**Khi tham gia máy chủ đồng ý tất cả các quy tắc!**" })
                        .addFields({ name: "• 1) __Discord ToS và Nguyên tắc__", value: "Tất cả người dùng cần tuân theo Điều khoản dịch vụ và Nguyên tắc cộng đồng của Discord --> https://discordapp.com/guidelines" })
                        .addFields({ name: "• 2) __Quảng cáo__", value: "Không người dùng nào nên đăng quảng cáo, Trong các thành viên DM của chính máy chủ, Nếu bạn muốn hợp tác Hãy hỏi chủ sở hữu." })
                        .addFields({ name: "• 3) __Lừa đảo__", value: "Không người dùng nào sẽ lừa đảo hoặc cố gắng lừa đảo các thành viên/nhân viên để lấy các mặt hàng Thật hoặc các mặt hàng trực tuyến." })
                        .addFields({ name: "• 4) __Ngôn ngữ phân biệt chủng tộc__", value: "Bất kỳ lời nói xấu về chủng tộc hoặc hành vi/nhận xét phân biệt chủng tộc nào đều KHÔNG được chấp nhận trong máy chủ này. Đây sẽ là lệnh cấm ngay lập tức." })
                        .addFields({ name: "• 5) __Sự tôn trọng__", value: "Việc tôn trọng admin và mod team thực sự rất quan trọng. Nhóm kiểm duyệt có tiếng nói cuối cùng." })
                        .addFields({ name: "• 6) __NSFW__", value: "Sẽ có 0 hình ảnh, video hoặc văn bản NSFW, vi phạm quy định này sẽ bị cấm ngay lập tức và vĩnh viễn." })
                        .addFields({ name: "• 7) __Bán hàng__", value: "Sẽ không có việc bán hàng trực tuyến bằng tiền THỰC." })
                        .addFields({ name: "• 8) __Không mạo danh nhân viên__", value: "Đừng cố gắng mạo danh nhân viên." })
                        .addFields({ name: "• 9) __Lổ hổng__", value: "Đừng cố gắng bỏ qua bất kỳ quy tắc nào có sơ hở trong quy tắc, nếu có sơ hở bị khai thác, người dùng sẽ bị cấm sử dụng nó, Vui lòng báo cáo mọi sơ hở được tìm thấy." })
                        .addFields({ name: "• 10) __Đột kích máy chủ__", value: "Đừng cố gắng thiết lập và cố gắng đột kích máy chủ này hoặc bất kỳ máy chủ nào." })
                        .addFields({ name: " __**Cảnh báo**__", value: "vi phạm nhẹ sẽ bị cảnh cáo." });

                    channel.send({ embeds: [rulesembed] });

                    await guild.channels.create({
                        name: "📢・thông-báo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages]
                            }
                        ]
                    });

                    await guild.channels.create({
                        name: "💎・boosts", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages]
                            }
                        ]
                    });

                    await guild.channels.create({
                        name: "⚠・báo-cáo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type 🙌・welcome
                        parent: categorybasic // Category ID
                    });

                    
                    const categorybasic2 = await guild.channels.create({ // change category variable when reusing this to make new category
                        type: ChannelType.GuildCategory,
                        name: "CỘNG ĐỒNG"
                    });

                    await guild.channels.create({
                        name: "💬・chung", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic2 // Category ID
                    });

                    await guild.channels.create({
                        name: "🤖・lệnh", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic2 // Category ID
                    });

                    await guild.channels.create({
                        name: "🆙・thăng-hạng", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic2, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages]
                            }
                        ]
                    });


                    const categorybasic3 = await guild.channels.create({ // thay đổi biến danh mục khi sử dụng lại biến này để tạo danh mục mới
                        type: ChannelType.GuildCategory,
                        name: "Nhân-viên"
                    });

                    // xóa vai trò để chuẩn bị vai trò nhân viên + vai trò thành viên sau
                    if (interaction.guild.roles.cache.size) {
                        for await (const [, role] of interaction.guild.roles.cache) if (role.editable) await role.delete().catch(() => null);
                    }

                    // sáng tạo vai trò
                    await interaction.guild.roles.create({
                        name: "người sở hữu",
                        color: "#D60620",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.Administrator]
                    });

                    await interaction.guild.roles.create({
                        name: "quản trị viên",
                        color: "#7f00ff",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.BanMembers,
                            PermissionsBitField.Flags.KickMembers,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.MuteMembers]
                    });

                    await interaction.guild.roles.create({
                        name: "người điều hành",
                        color: "#FF8303",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.MuteMembers]
                    });

                    await interaction.guild.roles.create({
                        name: "nhân viên",
                        color: "#d9ff00",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel]
                    });

                    await interaction.guild.roles.create({
                        name: "thành viên",
                        color: "#1338BE",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel]
                    });


                    const role = interaction.guild.roles.cache.find((r) => r.name === "nhân viên"); // to find roles

                    await guild.channels.create({
                        name: "🔔・thông-báo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic3, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: role.id,
                                allow: [PermissionsBitField.Flags.ViewChannel] // const role is used for role.id
                            }
                        ]
                    });

                    await guild.channels.create({
                        name: "🔔・trò-chuyện-nhân-viên", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic3, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: role.id,
                                allow: [PermissionsBitField.Flags.ViewChannel] // const role is used for role.id
                            }
                        ]
                    });

                    await guild.channels.create({
                        name: "🔔・nhân-viên-cmd", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic3, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: role.id,
                                allow: [PermissionsBitField.Flags.ViewChannel] // const role is used for role.id
                            }
                        ]
                    });

                    await guild.channels.create({
                        name: "🔔・nhật-ký-mod", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: categorybasic3, // Category ID
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: role.id,
                                allow: [PermissionsBitField.Flags.ViewChannel] // const role is used for role.id
                            }]
                    });

                    const basicdone1 = interaction.guild.channels.cache.find((channel) => channel.name.includes("nhật-ký-mod"));

                    const basiccomplete = new EmbedBuilder()
                        .setTitle("Thiết lập cơ bản đã hoàn tất")
                        .setColor("Green")
                        .setDescription("máy chủ cơ bản của bạn đã được thiết lập, hãy tận hưởng máy chủ của bạn!")
                        .setImage(`https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3Bqa2loYWxlZnNsYWczZmU2ZHRxbzNweTh5aGt5N2hlbWg0djcxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ftw7aDJxYNOBvLAoQw/giphy.gif`)
                        .setTimestamp()
                        .setFooter({ text: "bạn có thể xóa nội dung nhúng này" });

                    basicdone1.send(({ embeds: [basiccomplete] }));

                });

                break;
            }
            














            
            case "advanced": {

                const advancedembed = new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setTitle("⚠️ Cảnh báo tạo máy chủ nâng cao ⚠️")
                    .setDescription(
                        "***CẤP TẤT CẢ CÁC QUYỀN CHO BOT TRƯỚC KHI THỰC HIỆN ĐIỀU NÀY***\n\n" +
                        "⚠️⚠️⚠️LƯU Ý: NẾU BẠN XÁC NHẬN THÌ TẤT CẢ KÊNH/DANH MỤC/VAI TRÒ TRONG MÁY CHỦ NÀY SẼ BỊ XÓA/THAY THẾ***\n\n" +
                        "Nhấp vào nút ✅ để xác nhận thiết lập hoặc nút ❌ để từ chối thiết lập cho máy chủ này!"
                    )
                    .setTimestamp()
                    .setFooter({ text: "Cảnh báo cài đặt nâng cao" });

                const advancedbuttons = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setEmoji("✖️")
                        .setLabel("Hủy bỏ")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("setup-sv-no1"),

                    new ButtonBuilder()
                        .setEmoji("✅")
                        .setLabel("xác nhận")
                        .setStyle(ButtonStyle.Success)
                        .setCustomId("setup-sv-ok1"));

                await interaction.deferReply({ ephemeral: true }); // Hoãn phản hồi để tránh lỗi

                await interaction.channel.send({ embeds: [advancedembed], components: [advancedbuttons] });

                await interaction.deleteReply(); // Xóa phản hồi đã hoãn để tránh lỗi

                const advancedcollector = interaction.channel.createMessageComponentCollector();

                // let setupMessage; // Biến để lưu trữ tham chiếu tin nhắn

                advancedcollector.on("collect", async (i) => {

                    if (i.customId === "setup-sv-no1") {
                        advancedembed.setColor("DarkGreen");
                        advancedembed.setTitle("Đã hủy thiết lập máy chủ nâng cao");
                        advancedembed.setDescription("Việc thiết lập máy chủ nâng cao đã bị hủy, nếu điều này không được dự định thì hãy chạy lại lệnh.");
                        advancedembed.setTimestamp();
                        i.update({ embeds: [advancedembed], components: [], fetchReply: true }).then((message) => {
                            setTimeout(() => { message.delete(); }, 5000);
                        });

                        return;
                    }


                    if (i.customId === "setup-sv-ok1") {
                        advancedembed.setColor("Gold");
                        advancedembed.setTitle("Đang khởi tạo...");
                        advancedembed.setDescription("Quá trình thiết lập máy chủ nâng cao đã được bắt đầu, việc này sẽ mất nhiều thời gian hơn và phụ thuộc vào đường truyền mạng của bạn. Đừng nóng vội, hãy đợi trong giây lát");
                        advancedembed.setTimestamp();
                        advancedembed.setImage(`https://cdn.dribbble.com/users/90627/screenshots/1096260/loading.gif`);

                        // lưu trữ tin nhắn cần xóa
                        setupMessage = await i.update({ embeds: [advancedembed], components: [] });


                        await new Promise((resolve) => setTimeout(resolve, 5000));
                    }


                    
                    // trước tiên hãy tạo vai trò ở đây cho các quyền nâng cao
                    
                    if (interaction.guild.roles.cache.size) {
                        for await (const [, role] of interaction.guild.roles.cache) if (role.editable) await role.delete().catch(() => null);
                    }

                    // roles creations
                    await interaction.guild.roles.create({
                        name: "người sở hữu",
                        color: "#D60620",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.Administrator],
                            Position: 1
                    });

                    await interaction.guild.roles.create({
                        name: "đồng sở hữu",
                        color: "#FFFFFF",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.BanMembers,
                            PermissionsBitField.Flags.KickMembers,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.MuteMembers,
                            PermissionsBitField.Flags.Administrator],
                            Position: 2
                    });


                    await interaction.guild.roles.create({
                        name: "quản trị viên cấp cao",
                        color: "#0a0612",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.BanMembers,
                            PermissionsBitField.Flags.KickMembers,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.MuteMembers,
                            PermissionsBitField.Flags.DeafenMembers],
                            Position: 3
                    });


                    await interaction.guild.roles.create({
                        name: "admin",
                        color: "#7f00ff",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.BanMembers,
                            PermissionsBitField.Flags.KickMembers,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.MuteMembers],
                            Position: 4
                    });

                    await interaction.guild.roles.create({
                        name: "người điều hành cấp cao",
                        color: "#FCE205",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.MuteMembers,
                            PermissionsBitField.Flags.KickMembers],
                            Position: 5
                    });

                    await interaction.guild.roles.create({
                        name: "người điều hành",
                        color: "#FF8303",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.MuteMembers],
                            Position: 6
                    });

                    await interaction.guild.roles.create({
                        name: "nhân viên",
                        color: "#1167b1",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel],
                            Position: 7
                    });

                    await interaction.guild.roles.create({
                        name: "Người tổ chức quà tặng",
                        color: "#010101",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.ViewAuditLog,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel],
                            Position: 8
                    });

                    await interaction.guild.roles.create({
                        name: "VIP",
                        color: "#D4AF37",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel],
                            Position: 9
                    });

                    await interaction.guild.roles.create({
                        name: "thành viên",
                        color: "#1338BE",
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ViewChannel],
                            Position: 10
                    });

                    
                    const senioradminrole = interaction.guild.roles.cache.find((r) => r.name === "quản trị viên cấp cao"); // to find roles

                    const adminrole = interaction.guild.roles.cache.find((r) => r.name === "admin"); // to find roles

                    const seniormodrole = interaction.guild.roles.cache.find((r) => r.name === "người điều hành cấp cao"); // to find roles

                    const modrole = interaction.guild.roles.cache.find((r) => r.name === "người điều hành"); // to find roles

                    const staffrole = interaction.guild.roles.cache.find((r) => r.name === "nhân viên"); // to find roles

                    const giverole = interaction.guild.roles.cache.find((r) => r.name === "Người tổ chức quà tặng"); // to find roles

                    const viprole = interaction.guild.roles.cache.find((r) => r.name === "VIP"); // to find roles
                    
                    const memberrole = interaction.guild.roles.cache.find((r) => r.name === "thành viên"); // to find roles




                    
                    if (interaction.guild.channels.cache.size) {
                    for await (const [, channel] of interaction.guild.channels.cache) await channel.delete().catch(() => null);
                    }


                    const ids = [memberrole.id, viprole.id, giverole.id, staffrole.id, modrole.id, seniormodrole.id, adminrole.id]; const overwritesmute = [];
                    for await (const id of ids) overwritesmute.push({ id: id, deny: [PermissionsBitField.Flags.SendMessages], allow: [PermissionsBitField.Flags.ViewChannel] });


                    const ids0 = [adminrole.id, senioradminrole.id]; const overwritesadmin = [];
                    for await (const id of ids0) overwritesadmin.push({ id: id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });

                    const { guild } = interaction;


                    const advancedcategory = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "Quan trọng"
                    });

                
                    await guild.channels.create({
                        name: "🙌・chào-mừng", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory, // Category ID
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "📚・quy-tắc", // Tên kênh
                        type: ChannelType.GuildText, // Loại kênh
                        parent: advancedcategory, // Thể loại ID
                        permissionOverwrites: overwritesmute
                    });

                    const channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("quy-tắc")); // when reusing this line change the variable (channel) change to like (channel2) (used to find channels)

                    const advancedrules = new EmbedBuilder()
                        .setTitle("Quy tắc")
                        .setColor("Orange")
                        .addFields({ name: "**Quy tắc máy chủ Discord**", value: "**Khi tham gia máy chủ, tất cả các quy tắc đều được đồng ý!**" })
                        .addFields({ name: "• 1) __Discord ToS và Nguyên tắc__", value: "Tất cả người dùng cần tuân theo Điều khoản dịch vụ và Nguyên tắc cộng đồng của Discord --> https://discordapp.com/guidelines" })
                        .addFields({ name: "• 2) __Quảng cáo__", value: "Không người dùng nào nên đăng quảng cáo, Trong các thành viên DM của chính máy chủ, Nếu bạn muốn hợp tác Hãy hỏi chủ sở hữu." })
                        .addFields({ name: "• 3) __Lừa đảo__", value: "Không người dùng nào sẽ lừa đảo hoặc cố gắng lừa đảo các thành viên/nhân viên để lấy các mặt hàng Thật hoặc các mặt hàng trực tuyến." })
                        .addFields({ name: "• 4) __Ngôn ngữ phân biệt chủng tộc__", value: "Bất kỳ lời nói xấu về chủng tộc hoặc hành vi/nhận xét phân biệt chủng tộc nào đều KHÔNG được chấp nhận trong máy chủ này. Đây sẽ là lệnh cấm ngay lập tức." })
                        .addFields({ name: "• 5) __Sự tôn trọng__", value: "Việc tôn trọng admin và mod team thực sự rất quan trọng. Nhóm kiểm duyệt có tiếng nói cuối cùng." })
                        .addFields({ name: "• 6) __NSFW__", value: "Sẽ có 0 hình ảnh, video hoặc văn bản NSFW, vi phạm quy định này sẽ bị cấm ngay lập tức và vĩnh viễn." })
                        .addFields({ name: "• 7) __Bán hàng__", value: "Sẽ không có việc bán hàng trực tuyến bằng tiền THỰC." })
                        .addFields({ name: "• 8) __Không mạo danh nhân viên__", value: "Đừng cố gắng mạo danh nhân viên." })
                        .addFields({ name: "• 9) __Lỗ hổng__", value: "Đừng cố gắng bỏ qua bất kỳ quy tắc nào có lỗ hổng trong quy tắc, nếu có sơ hở bị khai thác, người dùng sẽ bị cấm sử dụng nó, Vui lòng báo cáo mọi lỗ hổng được tìm thấy." })
                        .addFields({ name: "• 10) __Đột kích máy chủ__", value: "Đừng cố gắng thiết lập và cố gắng tấn công máy chủ này hoặc bất kỳ máy chủ nào." })
                        .addFields({ name: " __**Cảnh báo**__", value: "vi phạm nhẹ sẽ bị cảnh cáo." });

                    channel.send({ embeds: [advancedrules] });
                
                    await guild.channels.create({
                        name: "📢・thông-báo", // Channel Name🍀┃pings
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory, // Category ID
                        permissionOverwrites: overwritesmute, ...overwritesadmin
                    });

                    await guild.channels.create({
                        name: "💎・boosts", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory, // Category ID
                        permissionOverwrites: overwritesmute, ...overwritesadmin
                    });

                    await guild.channels.create({
                        name: "🍀・pings", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory, // Category ID
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "🎨・màu-sắc", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory, // Category ID
                        permissionOverwrites: overwritesmute
                    });

                    const ids1 = [memberrole.id,viprole.id, giverole.id, staffrole.id, modrole.id, seniormodrole.id, adminrole.id]; const overwritestalk = [];
                    for await (const id of ids1) overwritestalk.push({ id: id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });

                    await guild.channels.create({
                        name: "⚠・báo-cáo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type 🙌・welcome
                        parent: advancedcategory, // Category ID
                        permissionOverwrites: overwritestalk
                        
                    });



                    const advancedcategory2 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "CỘNG ĐỒNG"
                    });


                    await guild.channels.create({
                        name: "💬・chung", // Channel Name
                        type: ChannelType.GuildText, // Channel Type 🙌・welcome
                        parent: advancedcategory2, // Category ID
                        permissionOverwrites: overwritestalk
                        
                    });

                    await guild.channels.create({
                        name: "🤡・memes", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory2, // Category ID 
                    });

                    await guild.channels.create({
                        name: "🤖・lệnh", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory2 // Category ID
                    });

                    await guild.channels.create({
                        name: "📷・phương-tiện-truyền-thông", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory2 // Category ID
                    });

                    await guild.channels.create({
                        name: "🥇・thăng-hạng", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory2, // Category ID
                        permissionOverwrites: overwritesmute
                    });


                    const advancedcategory3 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "SỰ KIỆN"
                    });

                    await guild.channels.create({
                        name: "🎪・sự-kiện", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory3, // Category ID 
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "các-trò-chơi-phụ", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory3, // Category ID 
                        permissionOverwrites: overwritesmute
                    });

                    const advancedcategory4 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "QUÀ TẶNG"
                    });

                    await guild.channels.create({
                        name: "🎉╭・quà-tặng-lớn", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory4, // Category ID 
                        permissionOverwrites: [
                            {
                                id: giverole,
                                allow: [PermissionsBitField.Flags.SendMessages]
                            },
                            ...overwritesmute],
                            
                    });


                    await guild.channels.create({
                        name: "🎉┃ phát-phần-thưởngs", // Channel Name🥳╰・open-invites
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory4, // Category ID 
                        permissionOverwrites: [
                            {
                                id: giverole,
                                allow: [PermissionsBitField.Flags.SendMessages]
                            },
                            ...overwritesmute],
                            
                    });


                    await guild.channels.create({
                        name: "🥳╰・quà-tặng-nhanh", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory4, // Category ID 
                        permissionOverwrites: [
                            {
                                id: giverole,
                                allow: [PermissionsBitField.Flags.SendMessages]
                            },
                            ...overwritesmute],
                            
                    });


                    const advancedcategory5 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "VÉ"
                    });

                    await guild.channels.create({
                        name: "📩╭・vé", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory5, // Category ID 
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "📢┃ vé-nhân-viên", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory5, // Category ID 
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: memberrole,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: viprole,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            ...overwritesmute, ...overwritesadmin],
                            
                        
                    });

                    await guild.channels.create({
                        name: "📨╰・vé-tặng", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory5, // Category ID 
                        permissionOverwrites: overwritesmute
                    });

                    const ids2 = [memberrole.id,viprole.id, interaction.guild.id]; const overwritesprivate = [];
                    for await (const id of ids2) overwritesprivate.push({ id: id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });


                    const ids3 = [giverole.id, staffrole.id, modrole.id, seniormodrole.id, adminrole.id]; const overwritestaffmute = [];
                    for await (const id of ids3) overwritestaffmute.push({ id: id, allow: [PermissionsBitField.Flags.ViewChannel], deny: [PermissionsBitField.Flags.SendMessages] });


                    const ids4 = [giverole.id, staffrole.id, modrole.id, seniormodrole.id, adminrole.id]; const overwritestafftalk = [];
                    for await (const id of ids4) overwritestafftalk.push({ id: id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]});

                    const ids5 = [giverole.id, staffrole.id, modrole.id, seniormodrole.id]; const overwritestaffhide = [];
                    for await (const id of ids5) overwritestaffhide.push({ id: id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]});





                    const advancedcategory6 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "NHÂN VIÊN"
                    });

                    await guild.channels.create({
                        name: "📣╭・thông-báo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffmute, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "📜┃・nội-quy-nhân-viên", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffmute, ...overwritesadmin]
                    });


                    //staff rules embed
                    const channel2 = interaction.guild.channels.cache.find((channel) => channel.name.includes("nội-quy-nhân-viên")); // when reusing this line change the variable (channel) change to like (channel2) (used to find channels)

                    const staffrules = new EmbedBuilder()
                    .setTitle('Nội quy nhân viên')
                    .setColor('Random')
                    .addFields({ name: "**Nội quy đội ngũ nhân viên**", value: "**Khi gia nhập đội ngũ nhân viên, phải chấp hành mọi nội quy đã được BQT đặt ra!**" })
                    .addFields({ name: "• 1) __Discord ToS và Nguyên tắc__", value: "Với tư cách là nhân viên, bạn đại diện cho máy chủ và các giá trị của nó, vì vậy bạn phải tuân thủ các quy tắc! --> https://discordapp.com/guidelines" })
                    .addFields({ name: "• 2) __Sự tôn trọng__", value: "Bạn phải tôn trọng cộng đồng và các nhân viên khác." })
                    .addFields({ name: "• 3) __Quyết định__", value: "Dù là nhân viên nhưng bạn vẫn phải nghe lời BQT vì họ là người đưa ra quyết định cuối cùng." })
                    .addFields({ name: "• 4) __Quyết định__", value: "Với tư cách là thành viên nhóm nhân viên, trách nhiệm của bạn là đưa ra quyết định nhanh chóng và công bằng." })
                    .addFields({ name: "• 5) __Quảng cáo__", value: "Không quảng cáo các máy chủ khác khi chưa có sự cho phép của nhân viên cấp cao." })
                    .addFields({ name: "• 6) __Tranh cãi__", value: "Đừng gây sự với nhau hoặc giữa các thành viên chỉ vì niềm vui." })
                    .addFields({ name: "• 7) __Khẩn cầu__", value: "Đừng Khẩn cầu nhân viên cấp cao về mọi thứ." })

                    channel2.send({ embeds: [staffrules] });


                    await guild.channels.create({
                        name: "🎀┃・trò-chuyện-nhân-viên", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestafftalk, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "💼┃・lệnh-nhân-viên", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestafftalk, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "🔒╰・trò-chuyện-quản-trị-viên", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "vc-của-nhân-viên", // Channel Name
                        type: ChannelType.GuildVoice, // Channel Type
                        parent: advancedcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate]
                    });


                    const advancedcategory7 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "NHẬT-KÝ"
                    });

                    await guild.channels.create({
                        name: "💼┃ tin-nhắn", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "💼┃ nhật-ký-mod", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "💼┃ nhật-ký-bảo-mật", // Channel Nameserver-log
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "💼┃ nhật-ký-máy-chủ", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    const advancedcategory8 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "VC"
                    });
    
                    await guild.channels.create({
                        name: "Chơi-game-1", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: advancedcategory8, // Category ID 
                    });
    
                    await guild.channels.create({
                        name: "Chơi-game-2", // Channel Name
                        type: ChannelType.GuildVoice, // Channel Type
                        parent: advancedcategory8, // Category ID 
                    });
    
                    await guild.channels.create({
                        name: "Tổng", // Channel Name
                        type: ChannelType.GuildVoice, // Channel Type
                        parent: advancedcategory8, // Category ID 
                    });


                    //set-up complete embed

                const advancedcomplete = interaction.guild.channels.cache.find((channel) => channel.name.includes("nhật-ký-máy-chủ"));

                const advanceddone1 = new EmbedBuilder()
                    .setTitle("Thiết lập nâng cao đã hoàn tất")
                    .setColor("Green")
                    .setDescription("máy chủ nâng cao của bạn đã được thiết lập hoàn chỉnh, hãy tận hưởng máy chủ của bạn!")
                    .setTimestamp()
                    .setImage(`https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3Bqa2loYWxlZnNsYWczZmU2ZHRxbzNweTh5aGt5N2hlbWg0djcxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ftw7aDJxYNOBvLAoQw/giphy.gif`)
                    .setFooter({ text: "bạn có thể xóa nội dung nhúng này" });

                    advancedcomplete.send({ embeds: [advanceddone1] });

    
                });

                break;
            }


















            case "premium": {

        //         // Danh sách ID của các người dùng được phép sử dụng lệnh này
        // const allowedUserIds = ["1215380543815024700", "940104526285910046", "ID_nguoi_dung_2", "ID_nguoi_dung_1"];

        // // Kiểm tra xem người dùng hiện tại có trong danh sách được phép không
        // if (!allowedUserIds.includes(interaction.user.id))
        //     return await interaction.reply({ content: "Lệnh này chỉ dành cho dev", ephemeral: true });

        // Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user || !user.isPremium) {
        return interaction.reply({ content: 'Bạn không có quyền sử dụng gói cao cấp premium. Vui lòng đăng ký premium để sử dụng.\n\n', ephemeral: true });
        }

        // Kiểm tra xem người dùng có mã premium và mã đó còn hạn hay không
        const currentTime = new Date();
        if (user.premiumUntil && user.premiumUntil < currentTime) {
            return interaction.reply({ content: 'Mã premium của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng gói cao cấp premium.', ephemeral: true });
        }

                const premiumembed = new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setTitle("⚠️ CẢNH BÁO TẠO MÁY CHỦ CAO CẤP ⚠️")
                    .setDescription(
                        "***CẤP TẤT CẢ CÁC QUYỀN CHO BOT TRƯỚC KHI THỰC HIỆN ĐIỀU NÀY***\n\n" +
                        "⚠️⚠️⚠️LƯU Ý: NẾU BẠN XÁC NHẬN THÌ TẤT CẢ KÊNH/DANH MỤC/VAI TRÒ TRONG MÁY CHỦ NÀY SẼ BỊ XÓA/THAY THẾ***\n\n" +
                        "Nhấp vào nút ✅ để xác nhận thiết lập hoặc nút ❌ để từ chối thiết lập cho máy chủ này!"
                    )
                    .setTimestamp()
                    .setFooter({ text: "Cảnh báo cài đặt cao cấp" });

                const premiumbuttons = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setEmoji("✖️")
                        .setLabel("Hủy bỏ")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("setup-sv-no2"),

                    new ButtonBuilder()
                        .setEmoji("✅")
                        .setLabel("xác nhận")
                        .setStyle(ButtonStyle.Success)
                        .setCustomId("setup-sv-ok2"));

                await interaction.deferReply({ ephemeral: true }); // Hoãn phản hồi để tránh lỗi

                await interaction.channel.send({ embeds: [premiumembed], components: [premiumbuttons] });

                await interaction.deleteReply(); // Xóa phản hồi đã hoãn để tránh lỗi

                const premiumcollector = interaction.channel.createMessageComponentCollector();

                // let setupMessage; // Biến để lưu trữ tham chiếu tin nhắn

                premiumcollector.on("collect", async (i) => {

                if (i.customId === "setup-sv-no2") {
                    premiumembed.setColor("DarkGreen");
                    premiumembed.setTitle("Đã hủy bỏ thiết lập máy chủ cao cấp");
                    premiumembed.setDescription("Việc thiết lập máy chủ cao cấp đã bị hủy, nếu điều này không phải dự định của bạn thì hãy chạy lại lệnh.");
                    premiumembed.setTimestamp();
                    i.update({ embeds: [premiumembed], components: [], fetchReply: true }).then((message) => {
                        setTimeout(() => { message.delete(); }, 5000);
                    });

                    return;
                }


                if (i.customId === "setup-sv-ok2") {
                    premiumembed.setColor("Gold");
                    premiumembed.setTitle("Đang khởi tạo...");
                    premiumembed.setDescription("Quá trình thiết lập máy chủ cao cấp đã được bắt đầu, việc này sẽ mất nhiều thời gian hơn và phụ thuộc vào đường truyền mạng của bạn. Đừng nóng vội, hãy đợi trong giây lát");
                    premiumembed.setTimestamp();
                    premiumembed.setImage(`https://cdn.dribbble.com/users/90627/screenshots/1096260/loading.gif`);
                    setupMessage = await i.update({ embeds: [premiumembed], components: [] });


                    await new Promise((resolve) => setTimeout(resolve, 5000));
                };


                if (interaction.guild.roles.cache.size) {
                for await (const [, role] of interaction.guild.roles.cache) if (role.editable) await role.delete().catch(() => null);
                }

                // sáng tạo vai trò

                await interaction.guild.roles.create({
                    name: "-",
                    color: "#a8a8a8",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.Administrator],
                        Position: 1
                });

                await interaction.guild.roles.create({
                    name: "owner",
                    color: "#D60620",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.Administrator],
                        Position: 2
                });

                await interaction.guild.roles.create({
                    name: "*",
                    color: "#a8a8a8",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.Administrator],
                        Position: 3
                });

                await interaction.guild.roles.create({
                    name: "co-owner",
                    color: "#FFFFFF",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.BanMembers,
                        PermissionsBitField.Flags.KickMembers,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.MuteMembers,
                        PermissionsBitField.Flags.Administrator],
                        Position: 4
                });

                await interaction.guild.roles.create({
                    name: "Bots",
                    color: "#FFFFFF",
                    hoist: true,
                    permissions: [PermissionsBitField.Flags.Administrator],
                        Position: 5
                });

                await interaction.guild.roles.create({
                    name: "server manager",
                    color: "#FCE205",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.BanMembers,
                        PermissionsBitField.Flags.KickMembers,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.MuteMembers,
                        PermissionsBitField.Flags.DeafenMembers,
                        PermissionsBitField.Flags.ManageGuild,
                        PermissionsBitField.Flags.ManageChannels],
                        Position: 6
                });

                await interaction.guild.roles.create({
                    name: "Administrator",
                    color: "#a8a8a8",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.ManageRoles,
                        PermissionsBitField.Flags.BanMembers,
                        PermissionsBitField.Flags.ModerateMembers],
                        Position: 7
                });


                await interaction.guild.roles.create({
                    name: "BQT",
                    color: "#00ff28",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.BanMembers,
                        PermissionsBitField.Flags.KickMembers,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.MuteMembers,
                        PermissionsBitField.Flags.DeafenMembers],
                        Position: 8
                });


                await interaction.guild.roles.create({
                    name: "Admin",
                    color: "#7f00ff",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.BanMembers,
                        PermissionsBitField.Flags.KickMembers,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.MuteMembers],
                        Position: 9
                });

                await interaction.guild.roles.create({
                    name: "Quản trị viên cấp cao",
                    color: "#9d4af0",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.BanMembers,
                        PermissionsBitField.Flags.KickMembers,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.MuteMembers],
                        Position: 10
                });

                
                await interaction.guild.roles.create({
                    name: "Người điều hành cấp cao",
                    color: "#FCE205",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.MuteMembers,
                        PermissionsBitField.Flags.KickMembers],
                        Position: 11
                });

                await interaction.guild.roles.create({
                    name: "Người điều hành",
                    color: "#FF8303",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.MuteMembers],
                        Position: 12
                });

                await interaction.guild.roles.create({
                    name: "Nhân viên",
                    color: "#1167b1",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel],
                        Position: 13
                });

                await interaction.guild.roles.create({
                    name: "Nhân viên xét xử",
                    color: "#6abd97",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel],
                        Position: 14
                });

                await interaction.guild.roles.create({
                    name: "Người tổ chức quà tặng",
                    color: "#010101",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.ViewAuditLog,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel],
                        Position: 15
                });

                await interaction.guild.roles.create({
                    name: "VIP",
                    color: "#D4AF37",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel],
                        Position: 16
                });


                //color roles (6), ping roles(3), level roles(5-8)

                await interaction.guild.roles.create({
                    name: "red",
                    color: "#ff0000",
                    hoist: false,
                    Position: 17
                });

                await interaction.guild.roles.create({
                    name: "blue",
                    color: "#0065ff",
                    hoist: false,
                    Position: 18
                });

                await interaction.guild.roles.create({
                    name: "purple",
                    color: "#8d00ff",
                    hoist: false,
                    Position: 19
                });

                await interaction.guild.roles.create({
                    name: "orange",
                    color: "#ff8b00",
                    hoist: false,
                    Position: 20
                });

                await interaction.guild.roles.create({
                    name: "green",
                    color: "#00ff28",
                    hoist: false,
                    Position: 21
                });

                await interaction.guild.roles.create({
                    name: "pink",
                    color: "#ff94e0",
                    hoist: false,
                    Position: 22
                });

                await interaction.guild.roles.create({
                    name: "Thành viên",
                    color: "#1338BE",
                    hoist: true,
                    permissions: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ViewChannel],
                        Position: 23
                });

                //level roles

                await interaction.guild.roles.create({
                    name: "Level 30",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 24
                });

                await interaction.guild.roles.create({
                    name: "Level 25",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 25
                });

                await interaction.guild.roles.create({
                    name: "Level 20",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 26
                });

                await interaction.guild.roles.create({
                    name: "Level 15",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 27
                });

                await interaction.guild.roles.create({
                    name: "Level 10",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 28
                });

                await interaction.guild.roles.create({
                    name: "Level 5",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 29
                });

                //ping roles

                await interaction.guild.roles.create({
                    name: "announcement ping",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 30
                });

                await interaction.guild.roles.create({
                    name: "giveaway ping",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 31
                });

                await interaction.guild.roles.create({
                    name: "staff ping",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 32
                });

                await interaction.guild.roles.create({
                    name: "event ping",
                    color: "#a8a8a8",
                    hoist: false,
                    Position: 33
                }); //end of roles


                const servermanager = interaction.guild.roles.cache.find((r) => r.name === "server manager"); // to find roles
                const perms = interaction.guild.roles.cache.find((r) => r.name === "Administrator"); 
                const senioradmin = interaction.guild.roles.cache.find((r) => r.name === "BQT"); 
                const admin = interaction.guild.roles.cache.find((r) => r.name === "Admin"); 
                const junioradmin = interaction.guild.roles.cache.find((r) => r.name === "Quản trị viên cấp cao"); 
                const seniormod = interaction.guild.roles.cache.find((r) => r.name === "Người điều hành cấp cao"); 
                const mod = interaction.guild.roles.cache.find((r) => r.name === "Người điều hành"); 
                const staff = interaction.guild.roles.cache.find((r) => r.name === "Nhân viên"); 
                const trialstaff = interaction.guild.roles.cache.find((r) => r.name === "Nhân viên xét xử");
                const givehost = interaction.guild.roles.cache.find((r) => r.name === "Người tổ chức quà tặng"); // staff roles


                const vip = interaction.guild.roles.cache.find((r) => r.name === "VIP"); // color role


                const member = interaction.guild.roles.cache.find((r) => r.name === "Thành viên");



                const ids = [interaction.guild.roles.everyone.id, member.id, vip.id, givehost.id, trialstaff.id, staff.id, mod.id, seniormod.id, junioradmin.id]; const overwritesmute = [];
                for await (const id of ids) overwritesmute.push({ id: id, deny: [PermissionsBitField.Flags.SendMessages], allow: [PermissionsBitField.Flags.ViewChannel] });


                const ids1 = [admin.id, senioradmin.id, perms.id, servermanager.id]; const overwritesadmin = [];
                for await (const id of ids1) overwritesadmin.push({ id: id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });


                const ids2 = [member.id, vip.id, interaction.guild.id]; const overwritesprivate = [];
                for await (const id of ids2) overwritesprivate.push({ id: id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });



                const ids3 = [givehost.id, trialstaff.id, staff.id, mod.id, seniormod.id, junioradmin.id]; const overwritestaffmute = [];
                for await (const id of ids3) overwritestaffmute.push({ id: id, allow: [PermissionsBitField.Flags.ViewChannel], deny: [PermissionsBitField.Flags.SendMessages] });



                const ids4 = [givehost.id, trialstaff.id, staff.id, mod.id, seniormod.id, junioradmin.id]; const overwritestafftalk = [];
                for await (const id of ids4) overwritestafftalk.push({ id: id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]});

                
                const ids5 = [givehost.id, trialstaff.id, staff.id, mod.id, seniormod.id, junioradmin.id]; const overwritestaffhide = [];
                for await (const id of ids5) overwritestaffhide.push({ id: id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]});


                if (interaction.guild.channels.cache.size) {
                    for await (const [, channel] of interaction.guild.channels.cache) await channel.delete().catch(() => null);
                    }


                const { guild } = interaction;

                const premiumcategory = await guild.channels.create({
                    type: ChannelType.GuildCategory,
                    name: "THÔNG TIN"
                });


                await guild.channels.create({
                    name: "quản-lý", // Channel Name
                    type: ChannelType.GuildText, // Channel Type
                    parent: premiumcategory, // Category ID
                    permissionOverwrites: [...overwritesadmin, ...overwritestaffhide, ...overwritesprivate]
                });


                await guild.channels.create({
                    name: "🙌・chào-mừng", // Channel Name
                    type: ChannelType.GuildText, // Channel Type
                    parent: premiumcategory, // Category ID
                    permissionOverwrites: [...overwritesmute, ...overwritesadmin]
                });

                await guild.channels.create({
                    name: "📚・quy-tắc", // Channel Name
                    type: ChannelType.GuildText, // Channel Type
                    parent: premiumcategory, // Category ID
                    permissionOverwrites: [...overwritesmute, ...overwritesadmin]
                });

                const channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("quy-tắc")); // when reusing this line change the variable (channel) change to like (channel2) (used to find channels)

                    const premiumrules = new EmbedBuilder()
                        .setTitle("Quy tắc")
                        .setColor('DarkGold')
                        .addFields({ name: "**Quy tắc máy chủ Discord**", value: "**Khi tham gia máy chủ, phải tuân theo tất cả các quy tắc của máy chủ**" })
                        .addFields({ name: "• 1) __Discord ToS and Guidelines__", value: "All users need to follow Discord's Terms of Service and Community Guidelines." })
                        .addFields({ name: "• 2) __Advertising__", value: "No user should post ads, In members DM's of within the server its self, If you wish to partner Ask the owner." })
                        .addFields({ name: "• 3) __Scamming__", value: "No user will scam or attempt to scam members/staff for Real items or online items." })
                        .addFields({ name: "• 4) __Racist language__", value: "Any racial slurs or racist behaviour/comments are NOT accepted in this server. This will be an instant Ban." })
                        .addFields({ name: "• 5) __Respect__", value: "Respecting the admin and mod team is really important. The moderation team has the final say." })
                        .addFields({ name: "• 6) __NSFW__", value: "There will be 0 NSFW images, videos or text, breaking this rule is an instant and permanent ban." })
                        .addFields({ name: "• 7) __Selling__", value: "There will be no selling online itmes for REAL currency." })
                        .addFields({ name: "• 8) __No staff impersonation__", value: "Do not attempt to Impersonate staff members." })
                        .addFields({ name: "• 9) __Loopholes__", value: "Do not attempt to bypass any rules with loopholes within the rules, if there are loopholes being exploited users will be punished for using it, Please report any found loopholes." })
                        .addFields({ name: "• 10) __Server raiding__", value: "Do not try to set up and attempt to raid this server or any server." })
                        .addFields({ name: " __**Warnings**__", value: "minor offences will result in a warn." });

                    channel.send({ embeds: [premiumrules] });
                

                    await guild.channels.create({
                        name: "📢・thông-báo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory, // Category ID
                        permissionOverwrites: overwritesmute, ...overwritesadmin
                    });

                    await guild.channels.create({
                        name: "💎・boosts", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory, // Category ID
                        permissionOverwrites: overwritesmute, ...overwritesadmin
                    });

                    await guild.channels.create({
                        name: "🍀・pings", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory, // Category ID
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "🎨・màu-sắc", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory, // Category ID
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "⚠・báo-cáo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory, // Category ID
                        permissionOverwrites: overwritesmute
                    });


                    const premiumcategory2 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "CỘNG ĐỒNG"
                    });


                    await guild.channels.create({
                        name: "💬・trò-chuyện-chính", // Tên kênh
                        type: ChannelType.GuildText, // Loại kênh 🙌・chào mừng
                        parent: premiumcategory2, // Thể loại ID
                        
                    });

                    await guild.channels.create({
                        name: "🤡・memes", // Tên kênh
                        type: ChannelType.GuildText, // Loại kênh
                        parent: premiumcategory2, // Thể loại ID
                    });

                    await guild.channels.create({
                        name: "🤖・lệnh", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory2 // Category ID
                    });

                    await guild.channels.create({
                        name: "📷・phương tiện truyền thông", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory2 // Category ID
                    });

                    await guild.channels.create({
                        name: "🥇・thăng hạng", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory2, // Category ID
                        permissionOverwrites: overwritesmute
                    });


                    const premiumcategory3 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "SỰ KIỆN"
                    });

                    await guild.channels.create({
                        name: "🎪・thông-báo-sự-kiện", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory3, // Category ID 
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "minigames", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory3, // Category ID 
                        permissionOverwrites: overwritesmute
                    });

                    const premiumcategory4 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "QUÀ TẶNG"
                    });

                    await guild.channels.create({
                        name: "🎉╭・quà-tặng-lớn", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory4, // Category ID 
                        permissionOverwrites: [
                            {
                                id: givehost,
                                allow: [PermissionsBitField.Flags.SendMessages]
                            },
                            ...overwritesmute],
                            
                    });


                    await guild.channels.create({
                        name: "🎉┃ quà-tặng", // Channel Name🥳╰・open-invites
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory4, // Category ID 
                        permissionOverwrites: [
                            {
                                id: givehost,
                                allow: [PermissionsBitField.Flags.SendMessages]
                            },
                            ...overwritesmute],
                            
                    });


                    await guild.channels.create({
                        name: "🥳╰・quà-tặng-ngắn-hạn", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory4, // Category ID 
                        permissionOverwrites: [
                            {
                                id: givehost,
                                allow: [PermissionsBitField.Flags.SendMessages]
                            },
                            ...overwritesmute],
                            
                    });


                    const premiumcategory5 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "𝓥É"
                    });

                    await guild.channels.create({
                        name: "📩╭・𝓥é", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory5, // Category ID 
                        permissionOverwrites: overwritesmute
                    });

                    await guild.channels.create({
                        name: "nk-thay-đổi-tên", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory5, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritesmute, ...overwritesadmin],
                            
                        
                    });

                    await guild.channels.create({
                        name: "bot-bot", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory5, // Category ID 
                        permissionOverwrites: overwritesmute
                    });


                    const premiumcategory6 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "THÔNG TIN CẬP NHẬT MOD & GAME"
                    });

                    await guild.channels.create({
                        name: "📣╭・thông-báo", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffmute, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "📣╭・giao-dịch", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffmute, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "📜┃・cập-nhật-mod", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffmute, ...overwritesadmin]
                    });


                    //staff rules embed
                    const channel3 = interaction.guild.channels.cache.find((channel) => channel.name.includes("cập-nhật-mod")); // when reusing this line change the variable (channel) change to like (channel2) (used to find channels)

                    const staffrules = new EmbedBuilder()
                    .setTitle('THÔNG TIN CẬP NHẬT MOD')
                    .setColor('Random')
                    .addFields({ name: "**Nội quy đội ngũ nhân viên**", value: "**Khi gia nhập đội ngũ nhân viên, phải chấp hành mọi nội quy đã được BQT đặt ra!**" })
                    .addFields({ name: "• 1) __Discord ToS và Nguyên tắc__", value: "Với tư cách là nhân viên, bạn đại diện cho máy chủ và các giá trị của nó, vì vậy bạn phải tuân thủ các quy tắc! --> https://discordapp.com/guidelines" })
                    .addFields({ name: "• 2) __Sự tôn trọng__", value: "Bạn phải tôn trọng cộng đồng và các nhân viên khác." })
                    .addFields({ name: "• 3) __Quyết định__", value: "Dù là nhân viên nhưng bạn vẫn phải nghe lời BQT vì họ là người đưa ra quyết định cuối cùng." })
                    .addFields({ name: "• 4) __Quyết định__", value: "Với tư cách là thành viên nhóm nhân viên, trách nhiệm của bạn là đưa ra quyết định nhanh chóng và công bằng." })
                    .addFields({ name: "• 5) __Quảng cáo__", value: "Không quảng cáo các máy chủ khác khi chưa có sự cho phép của nhân viên cấp cao." })
                    .addFields({ name: "• 6) __Tranh cãi__", value: "Đừng gây sự với nhau hoặc giữa các thành viên chỉ vì niềm vui." })
                    .addFields({ name: "• 7) __Khẩn cầu__", value: "Đừng Khẩn cầu nhân viên cấp cao về mọi thứ." })

                    channel3.send({ embeds: [staffrules] });


                    await guild.channels.create({
                        name: "📜┃・cập-nhật-game", // Channel Name 🎀
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestafftalk, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "📂┃・linh-mod", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestafftalk, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "🔒╰・sự-kiện", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "🐾 THẢO LUẬN MOD & GAME 🐾", // Channel Name
                        type: ChannelType.GuildVoice, // Channel Type
                        parent: premiumcategory6, // Category ID 
                        permissionOverwrites: [...overwritesprivate]
                    });


                    const premiumcategory7 = await guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "🐾 NHẬT KÝ 🐾"
                    });

                    await guild.channels.create({
                        name: "💼┃ gamble", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "💼┃ nhật-ký-mod", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "💼┃ nhật-ký-bảo-mật", // Channel Nameserver-log
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    await guild.channels.create({
                        name: "💼┃ nhật-ký-máy-chủ", // Channel Name
                        type: ChannelType.GuildText, // Channel Type
                        parent: premiumcategory7, // Category ID 
                        permissionOverwrites: [...overwritesprivate, ...overwritestaffhide, ...overwritesadmin]
                    });

                    // const premiumcategory8 = await guild.channels.create({
                    //     type: ChannelType.GuildCategory,
                    //     name: "THÔNG TIN"
                    // });

                     //set-up complete embed

                const premiumcomplate = interaction.guild.channels.cache.find((channel) => channel.name.includes("nhật-ký-máy-chủ"));

                const premiumdone = new EmbedBuilder()
                    .setTitle("Thiết lập cao cấp đã hoàn tất ")
                    .setColor('Gold')
                    .setDescription("máy chủ cao cấp của bạn đã được thiết lập rất tốt, hãy tận hưởng máy chủ của bạn!")
                    .setTimestamp()
                    .setImage(`https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3Bqa2loYWxlZnNsYWczZmU2ZHRxbzNweTh5aGt5N2hlbWg0djcxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ftw7aDJxYNOBvLAoQw/giphy.gif`)
                    .setFooter({ text: "bạn có thể xóa nội dung nhúng này" });

                    premiumcomplate.send({ embeds: [premiumdone] });
                    
            })
            break;
        }; // dòng cuối dành cho người thu phí cao cấp
    }
}}