const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const { BRB } = require(`../../Embeds/embedsDEV`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("owen")
        .setDescription("🔹 Xem chủ sở hữu máy chủ là ai")
        .addStringOption(o => o
            .setName(`id`)
            .setDescription(`ID máy chủ muốn kiểm tra`)
        ),
    async execute(interaction, client) {

        // Kiểm tra quyền của người dùng
        if (!checkPermissions(interaction)) {
            await interaction.deferReply({ ephemeral: true });
            await interaction.deleteReply();
            return await interaction.channel.send({ embeds: [BRB], ephemeral: true });
        }

        // Lấy id máy chủ từ tùy chọn hoặc sử dụng id máy chủ hiện tại
        const guildId = interaction.options.getString('id') || interaction.guild.id;
        const guild = client.guilds.cache.get(guildId) //|| await client.guilds.fetch(guildId);

        // Nếu máy chủ không tồn tại
        if (!guild) {
            return interaction.reply({ content: `Không tìm thấy máy chủ với ID ${guildId}`, ephemeral: true });
        }

        // Lấy thông tin chủ sở hữu máy chủ
        const owner = await guild.fetchOwner();

        // Lấy cấp độ xác minh của máy chủ
        let baseVerification = guild.verificationLevel;

        ////////////////////////// Cấp độ xác minh
        if (baseVerification == 0) baseVerification = "Không có";
        if (baseVerification == 1) baseVerification = "Thấp";
        if (baseVerification == 2) baseVerification = "Trung bình";
        if (baseVerification == 3) baseVerification = "Cao";
        if (baseVerification == 4) baseVerification = "Rất cao";

        // Lấy số lượng boost của máy chủ
        const boostCount = guild.premiumSubscriptionCount || 0;

        // Lấy danh sách vai trò
        const rolelist = guild.roles.cache.toJSON(); // guild.roles.cache.toJSON(); + guild.roles.cache.toJSON().join(' ') || "Không có vai trò";

        // Chuyển đổi danh sách vai trò thành mảng và chia thành 3 cột
        const rolesArray = rolelist.map(role => role.name); // Tạo mảng tên vai trò
        const columnSize = 25; // Số vai trò tối đa trên mỗi cột
        const columns = [];

        // Chia mảng vai trò thành các cột
        for (let i = 0; i < rolesArray.length; i += columnSize) {
            columns.push(rolesArray.slice(i, i + columnSize).join('\n')); // Mỗi cột sẽ chứa tối đa 15 vai trò
        }

        // Nếu danh sách vai trò trống
        if (columns.length === 0) {
            columns.push("Không có vai trò");
        }

        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);

        const toPascalCase = (string, separator = false) => {
        const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
          return separator ? splitPascal(pascal, separator) : pascal;
        };

        // Ánh xạ các tính năng sang tiếng Việt
        const featureTranslations = {
            "ANIMATED_BANNER": "Biểu ngữ hoạt hình",
            "BANNER": "Biểu ngữ",
            "COMMERCE": "Thương mại",
            "COMMUNITY": "Cộng đồng",
            "CHANNEL_ICON_EMOJIS_GENERATED": "Biểu tượng kênh với biểu tượng cảm xúc được tạo ra",
            "DISCOVERABLE": "Có thể khám phá",
            "FEATURABLE": "Có thể nổi bật",
            "GUESTS_ENABLED": "Khách mời đã được kích hoạt",
            "INVITE_SPLASH": "Màn hình mời",
            "NEWS": "Tin tức",
            "PARTNERED": "Đối tác",
            "PUBLIC": "Công khai",
            "RELAY": "Đường dẫn",
            "SEASONAL": "Theo mùa",
            "SOUNDBOARD": "Bảng âm thanh",
            "VANITY_URL": "URL tự chọn",
            "VERIFIED": "Đã xác minh",
            "VIP_REGIONS": "Khu vực VIP",
            "GUILD_ONBOARDING": "Giới thiệu bang hội",
            "GUILD_ONBOARDING_HAS_PROMPTS": "Việc giới thiệu bang hội có lời nhắc",
            "GUILD_ONBOARDING_EVER_ENABLED": "Tính năng giới thiệu bang hội đã được kích hoạt",
            "GUILD_SERVER_GUIDE": "Hướng dẫn máy chủ bang hội",
            "AUTO_MODERATION": "Tự động kiểm duyệt" // Đảm bảo không bị lặp lại
            // Thêm các tính năng khác nếu cần
        };

        // Tính năng của máy chủ
        const features = guild.features?.map(feature => `\n- ${featureTranslations[feature] || toPascalCase(feature, " ")}`)?.join("\n") || "Không có";

        // Tạo embed với thông tin chủ sở hữu
        const e = new EmbedBuilder()
            .setTitle(`THÔNG TIN CHỦ SỞ HỮU MÁY CHỦ: ${guild.name}`)
            .setDescription(
                `**ID CHỦ SỞ HỮU MÁY CHỦ:** ${owner.id}\n` +
                `**TÊN CHỦ SỞ HỮU MÁY CHỦ:** ${owner.displayName}\n` +
                `**CẤP ĐỘ XÁC MINH CỦA MÁY CHỦ:** ${baseVerification}\n` +
                `**SỐ LƯỢNG BOOSTS:** ${boostCount}\n` +
                `**TÍNH NĂNG CỦA MÁY CHỦ:** ${features}`
            )
            .addFields(
                { name: 'Danh sách vai trò (Cột 1)', value: columns[0] || "Không có", inline: true },
                { name: 'Danh sách vai trò (Cột 2)', value: columns[1] || "Không có", inline: true },
                { name: 'Danh sách vai trò (Cột 3)', value: columns[2] || "Không có", inline: true },
            )
            .setColor(`Green`)

        // Gửi embed
        await interaction.reply({ embeds: [e], ephemeral: true });
    },
};














// const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
// const { checkOwner } = require(`../../permissionCheck`);

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("owen")
//         .setDescription("Xem chủ sở hữu máy chủ là ai")
//         .addStringOption(op => op
//             .setName(`id`)
//             .setDescription(`ID máy chủ muốn kiểm tra`)
//         ),
//     async execute(interaction, client) {

//         // Kiểm tra quyền của người dùng
//         const hasPermission = await checkOwner(interaction);
//         if (!hasPermission) return;

//         // Lấy id máy chủ từ tùy chọn hoặc sử dụng id máy chủ hiện tại
//         const guildId = interaction.options.getString('id') || interaction.guild.id;
//         const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId);

//         // Nếu máy chủ không tồn tại
//         if (!guild) {
//             return interaction.reply({ content: `Không tìm thấy máy chủ với ID ${guildId}`, ephemeral: true });
//         }

//         // Lấy thông tin chủ sở hữu máy chủ
//         const owner = await guild.fetchOwner();

//         // Lấy cấp độ xác minh của máy chủ
//         let baseVerification = guild.verificationLevel;

//         ////////////////////////// Cấp độ xác minh
//         if (baseVerification == 0) baseVerification = "Không có";
//         if (baseVerification == 1) baseVerification = "Thấp";
//         if (baseVerification == 2) baseVerification = "Trung bình";
//         if (baseVerification == 3) baseVerification = "Cao";
//         if (baseVerification == 4) baseVerification = "Rất cao";

//         // Lấy số lượng boost của máy chủ
//         const boostCount = guild.premiumSubscriptionCount || 0;

//         // Lấy danh sách vai trò
//         const rolelist = guild.roles.cache.toJSON().join(' ') || "Không có vai trò";

//         // Chuyển đổi danh sách vai trò thành mảng và chia thành 3 cột
//         const rolesArray = rolelist.split(' '); // Tách chuỗi vai trò thành mảng
//         const columnSize = 25;
//         const columns = [];

//         // Chia mảng vai trò thành các cột (mỗi cột chứa 15 vai trò)
//         for (let i = 0; i < rolesArray.length; i += columnSize) {
//             columns.push(rolesArray.slice(i, i + columnSize).join('\n')); // Mỗi cột sẽ chứa 15 vai trò, ngăn cách bởi dấu xuống dòng
//         }

//         // Nếu danh sách vai trò trống
//         if (columns.length === 0) {
//             columns.push("Không có vai trò");
//         }

//         // Tạo embed với thông tin chủ sở hữu
//         const e = new EmbedBuilder()
//             .setTitle(`THÔNG TIN CHỦ SỞ HỮU MÁY CHỦ: ${guild.name}`)
//             .setDescription(
//                 `**ID CHỦ SỞ HỮU MÁY CHỦ:** ${owner.id}\n` +
//                 `**TÊN CHỦ SỞ HỮU MÁY CHỦ:** ${owner.displayName}\n` +
//                 `**CẤP ĐỘ XÁC MINH CỦA MÁY CHỦ:** ${baseVerification}\n` +
//                 `**SỐ LƯỢNG BOOSTS:** ${boostCount}\n`
//             )
//             .addFields(
//                 { name: 'Danh sách vai trò (Cột 1)', value: columns[0] || "Không có", inline: true },
//                 { name: 'Danh sách vai trò (Cột 2)', value: columns[1] || "Không có", inline: true },
//                 { name: 'Danh sách vai trò (Cột 3)', value: columns[2] || "Không có", inline: true },
//             )
//             .setColor(`Green`);

//         // Gửi embed
//         await interaction.reply({ embeds: [e], ephemeral: true });

//     },
// };