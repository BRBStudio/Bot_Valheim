const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const WelcomeCustom = require("../../schemas/welcomecustomSchema.js");
const WelcomeDefault = require('../../schemas/welcomedefaultSchema.js');
const config = require('../../config.js');
const { checkOwner } = require(`../../permissionCheck.js`)
const { removedEmbed } = require(`../../Embeds/embedsDEV.js`)
const CommandStatus = require('../../schemas/Command_Status.js');

/*
welcome-setup
*/
    
    module.exports = {
        data: new SlashCommandBuilder()
            .setName("welcome_custom")
            .setDescription("🔹 Cấu hình hệ thống tin nhắn chào mừng tùy chỉnh")
            .addSubcommand((subcommand) =>
                subcommand
                .setName("set")
                .setDescription("🔹 Đặt hệ thống tin nhắn chào mừng tùy chỉnh tới máy chủ")
                .addStringOption((option) =>
                    option
                    .setName("message")
                    .setDescription(`b1: tên người tham gia,b2: tên máy chủ,b3: hiển thị thứ tự,b4: kênh luật,\\n: để xuống 1 dòng`)
                    .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                    .setName("channel")
                    .setDescription("Kênh gửi tin nhắn chào mừng tới")
                    .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                    .setName("rules")
                    .setDescription("Nơi mọi người đọc luật.")
                    .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                    .setName("embed")
                    .setDescription("Gửi tin nhắn chào mừng tùy chỉnh dưới dạng nhúng")
                    .setRequired(false)
                )
                .addAttachmentOption((option) => option
                    .setName('image')
                    .setDescription('Hình ảnh của bạn')
                    .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
                subcommand
                .setName("remove")
                .setDescription("🔹 Xóa hệ thống tin nhắn chào mừng tùy chỉnh khỏi máy chủ")
            ),
    
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/welcome_custom' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkOwner(interaction);
        if (!hasPermission) return;

        const { options } = interaction;
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;
        const isEmbed = interaction.options.getBoolean("embed");
        const image = options.getAttachment('image');

        // Kiểm tra xem lời chào mặc định đã được kích hoạt chưa
        const defaultWelcome = await WelcomeDefault.findOne({ guildId });
        if (defaultWelcome && defaultWelcome.defaultWelcomeActive) {
            return await interaction.reply('Lời chào mừng mặc định đã được thiết lập trước đó, vui lòng xóa dữ liệu trước khi thiết lập lời chào mừng mới.');
        }
    
        let welcome_custom = await WelcomeCustom.findOne({ guildId });
        if (!welcome_custom) {
            welcome_custom = new WelcomeCustom({ guildId });
        }

        if (subcommand === "set") {
            // SET
            const channelId = interaction.options.getChannel("channel").id;
            const message = interaction.options.getString("message");
            const rulesChannelId = interaction.options.getChannel("rules").id;
            welcome_custom.channelId = channelId;
            welcome_custom.message = message;
            welcome_custom.isEmbed = isEmbed;
            welcome_custom.imageUrl = image ? image.url : null;  // Lưu URL của hình ảnh nếu có
            welcome_custom.rulesChannelId = rulesChannelId;
            welcome_custom.customWelcomeActive = true;

            await welcome_custom.save();
    
            const successEmbed = new EmbedBuilder()
                .setTitle("Hệ thống tin nhắn chào mừng")
                .setColor(config.embedGreen)
                .setDescription(`Thông báo chào mừng được đặt thành: ${message}.\n\nKênh chào mừng thành viên mới: <#${channelId}>\nBật tắt tin nhắn nhúng: ${isEmbed ? "Bật" : "tắt"}`);
    
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    
        } else if (subcommand === "remove") {
                // TOGGLE
                let existingData = await WelcomeCustom.findOne({ guildId });
        
                if (!existingData) {
                
                return await interaction.reply({ content: "Hệ thống tin nhắn chào mừng chưa được thiết lập trên máy chủ này", ephemeral: true });
        
            }
    
            if (existingData) {
        
                await WelcomeCustom.deleteOne({ guildId });
                await interaction.reply({
                    embeds: [removedEmbed],
                    ephemeral: true,
                });
            }
        }
    },
};