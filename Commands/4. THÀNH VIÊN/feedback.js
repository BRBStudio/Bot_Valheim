const { SlashCommandBuilder, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const FeedbackChannel = require("../../schemas/feedbackSchema");
const CommandStatus = require('../../schemas/Command_Status');

// Định nghĩa các tùy chọn cho mỗi loại phản hồi
const options = {
    bug: {
        name: "Lỗi game",
        replyMessage: "Cảm ơn bạn đã gửi báo cáo lỗi! Chúng tôi sẽ xem xét và xử lý ngay.",
        previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Báo cáo lỗi:`
    },
    suggestion: {
        name: "Vai trò trong máy chủ",
        replyMessage: "Cảm ơn bạn đã gửi đề xuất! Chúng tôi sẽ xem xét và xử lý nhanh chóng.",
        previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Báo cáo đề xuất:`
    },
    review: {
        name: "Đánh giá game",
        replyMessage: "Cảm ơn bạn đã gửi đánh giá! Chúng tôi tôn trọng quyết định của bạn.",
        previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Đánh giá phản hồi:`
    },
    other: {
        name: "Báo cáo khác",
        replyMessage: "Cảm ơn bạn đã gửi báo cáo! Chúng tôi sẽ cân nhắc về điều đó.",
        previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Báo cáo khác:`
    },
};

// Xuất module để sử dụng trong ứng dụng Discord
module.exports = {
    // Định nghĩa thông tin của Slash Command
    data: new SlashCommandBuilder()
        .setName("feedback")
        .setDescription("🔹 Phản hồi về lỗi hoặc đóng góp ý kiến về cho máy chủ")
        .addSubcommand(subcommand =>
            subcommand
                .setName("send")
                .setDescription("🔹 Gửi phản hồi")
                .addStringOption(option => option.setName('option').setDescription('Chọn danh mục phản hồi').setRequired(true).addChoices(
                    { name: options.bug.name, value: "bug" },
                    { name: options.suggestion.name, value: "suggestion" },
                    { name: options.review.name, value: "review" },
                    { name: options.other.name, value: "other" },
                ))
                .addStringOption(option => option.setName('feedback').setDescription('Thông tin phản hồi của bạn').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("setup")
                .setDescription("🔹 Chọn kênh để gửi phản hồi")
                .addChannelOption(option => option.setName('channel').setDescription('Chọn kênh để gửi phản hồi').setRequired(true).addChannelTypes(ChannelType.GuildText)))
                
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("🔹 Xóa thiết lập kênh phản hồi")),

    // Hàm xử lý khi Slash Command được thực thi
    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
		const commandStatus = await CommandStatus.findOne({ command: '/feedback' });

		// Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
		if (commandStatus && commandStatus.status === 'off') {
			return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
		}

        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (subcommand === "setup") {
            // Thiết lập kênh gửi phản hồi
            const channel = interaction.options.getChannel('channel');
            const channelId = channel.id;

            // Lưu trữ thông tin kênh vào MongoDB
            await FeedbackChannel.findOneAndUpdate(
                { guildId },
                { channelId },
                { upsert: true, new: true }
            );

            await interaction.reply({ content: `Kênh ${channel.name} đã được thiết lập để nhận phản hồi.`, ephemeral: true });
        } else if (subcommand === "remove") {
            // Xóa thiết lập kênh phản hồi
            await FeedbackChannel.findOneAndDelete({ guildId });

            await interaction.reply({ content: `Đã xóa thiết lập kênh phản hồi cho máy chủ này.`, ephemeral: true });
        } else if (subcommand === "send") {
            const option = interaction.options.get('option').value;
            const feedback = interaction.options.get('feedback').value;

            // Kiểm tra xem kênh gửi phản hồi đã được thiết lập hay chưa
            const feedbackChannelDoc = await FeedbackChannel.findOne({ guildId });
            if (!feedbackChannelDoc) {
                await interaction.reply({ content: `Chưa có kênh nào được thiết lập để gửi phản hồi. Vui lòng sử dụng lệnh /feedback setup để thiết lập kênh.`, ephemeral: true });
                return;
            }

            const feedbackChannel = interaction.guild.channels.cache.get(feedbackChannelDoc.channelId);

            // Lấy tên hiển thị của người dùng trong máy chủ
            const userDisplayName = interaction.user.displayName;

            // Tạo embed dựa trên loại phản hồi và thêm timestamp
            const feedbackEmbed = new EmbedBuilder()
                .setTitle(`<a:brb:1319969574845677568> TIÊU ĐỀ: ${options[option].name}`)
                .setDescription(`<a:brb:1319969574845677568> **NỘI DUNG:**\`\`\`${feedback}\`\`\``)
                .setColor('Random')
                .setImage(`https://i.gifer.com/origin/bc/bc77626a04355c8c12cf05a09f87c61a_w200.gif`)
                .addFields({
                    name: `NGƯỜI DÙNG GỬI FEEDBACK:\n\`${userDisplayName}\`\n\nID:\n\`${interaction.user.id}\``,
                    value: `\u200b`,
                    inline: true
                })
                .setTimestamp();

            // Tạo nút "Send"
            const sendButton = new ButtonBuilder()
                .setCustomId('sendButton')
                .setLabel('OK')
                .setEmoji(`<:zzahhdinook:1249470387016695808>`)
                .setStyle(ButtonStyle.Success);

            // Tạo nút "Cancel"
            const cancelButton = new ButtonBuilder()
                .setCustomId('cancelButton')
                .setLabel('Cancel')
                .setEmoji(`<:2629notick:1249471458565165156>`)
                .setStyle(ButtonStyle.Danger);

            // Hiển thị xem trước và nút cho người tương tác
            const row = new ActionRowBuilder()
                .addComponents(sendButton, cancelButton);

            // Gửi tin nhắn xem trước và lấy tin nhắn đó để thực hiện xóa sau này
            const previewMessage = await interaction.reply({ content: options[option].previewMessage, embeds: [feedbackEmbed], components: [row], ephemeral: true });

            // Tạo lắng nghe sự kiện cho nút
            const filter = i => i.customId === 'sendButton' || i.customId === 'cancelButton';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

            // Biến kiểm soát trạng thái của nút
            let sendButtonClicked = false;
            let cancelButtonClicked = false;

            // Xử lý sự kiện khi người dùng ấn nút
            collector.on('collect', async i => {
                if (i.customId === 'sendButton' && !sendButtonClicked) {
                    sendButtonClicked = true;

                    // Gửi phản hồi và tin nhắn cảm ơn
                    interaction.followUp({ content: options[option].replyMessage, ephemeral: true });

                    // Gửi embed vào kênh feedback đã chọn
                    feedbackChannel.send({ embeds: [feedbackEmbed] });

                    // Kiểm tra nếu tin nhắn xem trước tồn tại trước khi cố gắng xóa
                    await previewMessage.delete().catch(error => {
                        console.error(`Không thể xóa tin nhắn xem trước: ${error.message}`);
                    });
                } else if (i.customId === 'cancelButton' && !cancelButtonClicked) {
                    cancelButtonClicked = true;

                    // Huỷ tin nhắn xem trước
                    interaction.followUp({ content: `Bạn đã huỷ việc gửi phản hồi.`, ephemeral: true });

                    // Kiểm tra nếu tin nhắn xem trước tồn tại trước khi cố gắng xóa
                    await previewMessage.delete().catch(error => {
                        console.error(`Không thể xóa tin nhắn xem trước: ${error.message}`);
                    });
                }
            });

            // Xử lý sự kiện khi thời gian chờ kết thúc
            collector.on('end', collected => {
                if (collected.size === 0) {
                    // Nếu không có sự kiện nào được thu thập, thông báo về việc hết thời gian
                    interaction.followUp({ content: `Bạn đã không thực hiện hành động nào trong 2 phút, vì vậy sẽ không tương tác được với nút nữa.`, ephemeral: true });
                }
            });
        }
    }
};

