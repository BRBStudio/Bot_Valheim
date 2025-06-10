const { SlashCommandBuilder, ChannelType } = require("discord.js");
const UserYoutube = require("../../schemas/Youtube_userSchema");
const { checkAdministrator } = require(`../../permissionCheck`);

/*
	* Các mã liên quan: 
        - YoutubeAnnouncer.js (Commands) 		---		thư viện ytb
        - YTB Events.js 			            ---		sự kiện
        - YoutubeSchema.js 		                ---		video youtube của tôi
        - Youtube_userSchema.js 	            ---		video youtube của người dùng (YTB kênh của người dùng)
        - YTB Event                 ---     sự kiện
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ytb")
        .setDescription("Đăng ký kênh YouTube của bạn để được tự động quảng bá")
        .addStringOption(option =>
            option.setName("channel_id")
                .setDescription("ID của kênh YouTube của bạn (ví dụ: UCabc123...)")
                .setRequired(true)
            )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Chọn kênh để thông báo")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            ),
        async execute(interaction) {

            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;

            const userId = interaction.user.id;
            const youtubeChannelId = interaction.options.getString("channel_id");
            const announcementChannelId = interaction.options.getChannel("channel").id;
            const guildId = interaction.guildId;

            const existing = await UserYoutube.findOne({ userId, guildId });
            if (existing) {
                existing.youtubeChannelId = youtubeChannelId;
                existing.announcementChannelId = announcementChannelId;
                await existing.save();
                return interaction.reply(`🔁 Cập nhật kênh YouTube của bạn thành: \`${youtubeChannelId}\`, sẽ thông báo vào <#${announcementChannelId}>`);
            }

            await UserYoutube.create({
                userId,
                guildId,
                youtubeChannelId,
                announcementChannelId
            });

        interaction.reply(`✅ Đã đăng ký kênh YouTube: \`${youtubeChannelId}\`! Thông báo sẽ được gửi vào <#${announcementChannelId}>`);
    }
};