
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const tinycolor = require("tinycolor2");
const moment = require("moment-timezone");
const randomColor = require("randomcolor");
const { getPreferredLanguage } = require('../../languageUtils');
const translate = require('@iamtraction/google-translate');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("🔹 Gửi thông báo nâng cao")
        .setDescriptionLocalization(`en-US`, '🔹 Send advanced notifications')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Chọn kênh để thông báo") 
                .setDescriptionLocalization('en-US', 'Choose the channel to send the notification')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
                
        )
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Tin nhắn thông báo, Mẹo: có thể dùng \\n: để xuống 1 dòng, {s1}mầu xanh{/s1} và {s2}mầu đỏ{/s2}")
                .setDescriptionLocalization('en-US', 'Notification message, Tip: you can use \\n: to go down one line, {s1}green{/s1} and {s2}red{/s2}')
                .setRequired(true)
        )
        .addRoleOption(option=>
            option.setName("role")
                  .setDescription("Chọn vai trò bạn muốn gửi thông báo")
                  .setRequired(true)         
        )
        .addStringOption((option) =>
            option.setName("title")
                .setDescription("Tiêu đề của thông báo")
                .setDescriptionLocalization('en-US', 'Title of the notification')
        )
        .addStringOption((option) =>
            option.setName("color")
                .setDescription("Chọn Mầu bạn muốn (chỉ dành cho tin nhắn nhúng)")
                .setDescriptionLocalization('en-US', 'Select the Color you want (embedded messages only)')
                .addChoices(
                    { name: "Mầu ngẫu nhiên", value: "Random" },
                    { name: "Mầu đỏ", value: "Red" },
                    { name: "Mầu xanh dương", value: "Blue" },
                    { name: "Mầu xanh lá cây", value: "Green" },
                    { name: "Mầu tím", value: "Purple" },
                    { name: "Mầu cam", value: "Orange" },
                    { name: "Mầu vàng", value: "Yellow" },
                    { name: "Mầu đen", value: "Black" },
                    { name: "Mầu xanh lơ (rất đẹp)", value: "Cyan" },
                    { name: "Mầu hồng", value: "Pink" },
                    { name: "Mầu hoa oải hương", value: "Lavender" },
                    { name: "Mầu sẫm (Mầu đỏ sẫm, hơi tím)", value: "Maroon" },
                    { name: "Mầu ô liu", value: "Olive" },
                    { name: "Mầu xanh lam (xanh nước biển)", value: "Teal" },
                    { name: "Mầu bạc", value: "Silver" },
                    { name: "Mầu vàng đồng", value: "Gold" },
                    { name: "Mầu be", value: "Beige" },
                    { name: "Mầu hải quân (xanh dương đậm)", value: "Navy" },
                    { name: "Mầu tím đậm", value: "Indigo" },
                    { name: "Mầu hồng tím", value: "Violet" },
        ))
        .addStringOption((option) =>
            option
                .setName("timestamp")
                .setDescription("Định dạng Hẹn thời gian để gửi thông báo (HH:mm DD/MM/YYYY)")
                .setDescriptionLocalization('en-US', 'Set time to schedule the notification (HH:mm DD/MM/YYYY)')
        ),

    async execute(interaction) {
        try {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/announce' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            const channel = interaction.options.getChannel("channel");
            const messageText = interaction.options.getString("message");
            const title = interaction.options.getString("title") || "Thông báo";
            const color = interaction.options.getString("color") || "turquoise";
            const timestamp = interaction.options.getString("timestamp");
            const Role = interaction.options.getRole('role');

            // Lấy ngôn ngữ đã lưu từ cơ sở dữ liệu
            const preferredLanguage = await getPreferredLanguage(interaction.guild.id, interaction.user.id);

            // Dịch tên lệnh, mô tả và các thông báo nếu ngôn ngữ là tiếng Anh
            let translatedDescription = "🔔 | Gửi thông báo nâng cao"; // Mô tả gốc
            if (preferredLanguage === 'en') {
                const translationResult = await translate(translatedDescription, { to: 'en' });
                translatedDescription = translationResult.text;
            }

            // Kiểm tra nếu ngôn ngữ là tiếng Anh thì dịch tiêu đề
            let translatedTitle = title;
            if (preferredLanguage === 'en') {
                const translationResult = await translate(title, { to: 'en' });
                translatedTitle = translationResult.text; // Lưu tiêu đề đã dịch
            }

            // Dịch nội dung thông báo nếu ngôn ngữ là tiếng Anh
            let translatedMessage = messageText;
            if (preferredLanguage === 'en') {
                const translationResult = await translate(messageText, { to: 'en' });
                translatedMessage = translationResult.text; // Lưu nội dung đã dịch
            }

            // Dịch các thông báo nếu ngôn ngữ là tiếng Anh
            const messages = {
                insufficientPermissions: preferredLanguage === 'en' 
                ? `You do not have permission to reset xp level in server ${interaction.guild.name}.`
                : `\`\`\`yml\nBạn không có quyền đặt lại cấp độ xp trong máy chủ ${interaction.guild.name}.\`\`\``,
                invalidColor: preferredLanguage === 'en'
                ? "The color you entered is not valid."
                : "Mầu bạn nhập không hợp lệ.",
                scheduleError: preferredLanguage === 'en'
                ? "The scheduled time must be a future time."
                : "Thời gian lên lịch phải là một thời gian trong tương lai.",
                // Bạn có thể thêm nhiều thông báo khác ở đây...
            };

            const perm = new EmbedBuilder()
                .setColor(`Blue`)
                .setDescription(messages.insufficientPermissions);

            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true });

            let colorCode;

            if (color === "Random") {
                colorCode = randomColor();
            } else {
                colorCode = tinycolor(color);
            }

            if (color !== "Random" && !colorCode.isValid()) {
                return await interaction.reply({ content: messages.invalidColor, ephemeral: true });
            }

            const processMessage = (text) => {
                return text
                    .replace(/{s1}/g, '```diff\n+ ')
                    .replace(/{\/s1}/g, '\n```')
                    .replace(/{s2}/g, '```diff\n- ')
                    .replace(/{\/s2}/g, '\n```')
                    .replace(/{s3}/g, '✅ ')
                    .replace(/{s4}/g, '❌ ')
                    .replace(/\\n/g, '\n'); // Thêm dòng này để thay thế ký tự \n bằng xuống dòng thực sự;
            };

            const embed = new EmbedBuilder()
                .setTitle(translatedTitle)
                .setDescription(processMessage(translatedMessage));

            if (color === "Random") {
                embed.setColor(colorCode);
            } else {
                embed.setColor(colorCode.toHexString());
            }

            if (timestamp) {
                const regex = /^(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/;
                const match = timestamp.match(regex);

                if (!match) {
                    await interaction.reply({
                        content: preferredLanguage === 'en'
                            ? "Invalid timestamp format. Please use the format HH:mm DD/MM/YYYY\n\n***NOTE***:\nHH: hour\nmm: minute\nDD: day\nMM: month\nYYYY: year."
                            : "Định dạng dấu thời gian không hợp lệ. Vui lòng sử dụng định dạng HH:mm DD/MM/YYYY\n\n***CHÚ THÍCH***:\nHH: hiển thị giờ\nmm: hiển thị phút\nDD: hiển thị ngày\nMM: hiển thị tháng\nYYYY: hiển thị năm.",
                        ephemeral: true,
                    });
                    return;
                }

                const [_, hour, minute, day, month, year] = match;
                const scheduledTime = moment.tz(`${year}-${month}-${day} ${hour}:${minute}`, "YYYY-MM-DD HH:mm", "Asia/Ho_Chi_Minh");

                if (!scheduledTime.isValid()) {
                    await interaction.reply({
                        content: preferredLanguage === 'en'
                            ? "It seems you wrote the time value incorrectly. Please check the date and time again."
                            : "Có vẻ như bạn viết đã viết sai giá trị thời gian rồi. Vui lòng kiểm tra lại ngày và giờ",
                        ephemeral: true,
                    });
                    return;
                }

                const delay = scheduledTime.valueOf() - Date.now();

                if (delay <= 0) {
                    await interaction.reply({
                        content: messages.scheduleError,
                        ephemeral: true,
                    });
                    return;
                }

                await interaction.reply({
                    content: preferredLanguage === 'en' 
                    ? `The announcement will be sent at ${scheduledTime.format('HH:mm [on] DD/MM/YYYY')} (Vietnam time)`
                    : `Thông báo sẽ được gửi vào lúc ${scheduledTime.format('HH:mm [ngày] DD/MM/YYYY')} (giờ Việt Nam)`, // `Thông báo sẽ được gửi vào lúc ${scheduledTime.format('HH:mm [ngày] DD/MM/YYYY')} (giờ Việt Nam)`,
                    ephemeral: true,
                });

                setTimeout(async () => {
                    await channel.send({ content: `${Role}`, embeds: [embed] });
                }, delay);

            } else {
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("confirm_send")
                        .setEmoji(`<:177envelopesend:1252735130003443722>`)
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("cancel_send")
                        .setEmoji(`<:giphy5:1252736661763391548>`)
                        .setStyle(ButtonStyle.Primary)
                );

                await interaction.deferReply({ ephemeral: true });

                await interaction.editReply({
                    content: preferredLanguage === 'en' ? "Preview announcement:" : "Xem trước thông báo:",
                    embeds: [embed],
                    components: [row],
                });

                const filter = (i) => i.user.id === interaction.user.id;

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                collector.on("collect", async (i) => {
                    await i.deferUpdate();

                    if (i.customId === "confirm_send") {
                        await channel.send({ content: `${Role}`,embeds: [embed] });

                        await interaction.followUp({
                            content: preferredLanguage === 'en'
                                ? "Announcement sent!"
                                : "Thông báo đã được gửi!",
                            ephemeral: true,
                        });

                        collector.stop();
                    } else if (i.customId === "cancel_send") {
                        await interaction.followUp({
                            content: preferredLanguage === 'en'
                                ? "Announcement canceled!"
                                : "Đã hủy thông báo!",
                            ephemeral: true,
                        });

                        collector.stop();
                    }
                });

                collector.on("end", async () => {
                    await interaction.editReply({ components: [] });
                });
            }
        } catch (error) {
            // Lấy ngôn ngữ đã lưu từ cơ sở dữ liệu
            const preferredLanguage = await getPreferredLanguage(interaction.guild.id, interaction.user.id);
            console.error("Lỗi khi thực hiện lệnh:", error);
            await interaction.reply({
                content: preferredLanguage === 'en' 
                ? "An error occurred. Please try again."
                : "Đã có lỗi xảy ra. Vui lòng thử lại.", // "Đã có lỗi xảy ra. Vui lòng thử lại.",
                ephemeral: true,
            });
        }
    },
};