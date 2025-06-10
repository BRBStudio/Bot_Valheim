const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("find_team")
        .setDescription("🔹 Tìm đồng đội Valheim và các game khác")
        .addStringOption(option =>
            option.setName("lolmode")
                .setDescription("Viết Tên Game Mà Bạn Muốn Mời Họ Tham Gia. Ví Dụ: Valheim")
                .setRequired(false))
        .addMentionableOption(option => // Thay đổi thành `addMentionableOption` để nhận cả người dùng và vai trò
            option
                .setName("user")
                .setDescription("Tag người dùng hoặc vai trò bạn muốn mời")
                .setRequired(false)),

    async execute(interaction) {
        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/find_team' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const LOLMode = interaction.options.getString("lolmode")?.toLowerCase();
        const Msg = `Đang còn slot, vào đây cho vui`;

        if (!interaction.member.voice.channel) {
            await interaction.reply("Cần phải ở trong một kênh thoại để sử dụng lệnh này.");
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        const users = await voiceChannel.guild.members.fetch();
        const userCounts = users.size;
        const userCount = voiceChannel.members.size;
        const channelName = voiceChannel.name;
        const slotValue = userCount === 0 ? "∞" : `${userCount} / ${userCounts}`;
        const invite = await voiceChannel.createInvite({ maxAge: 3600 });
        const inviteUrl = invite.url;

        // Lấy lựa chọn `user` hoặc `role`
        const mentionable = interaction.options.getMentionable("user");
        let mentionTag = "@everyone"; // Mặc định nếu không có lựa chọn

        if (mentionable) {
            if (mentionable.user) {
                // Nếu là người dùng
                mentionTag = mentionable.toString();
            } else if (mentionable.id) {
                // Nếu là vai trò
                mentionTag = `<@&${mentionable.id}>`;
            }
        }

        let thumbnailUrl = "";
        if (LOLMode) {
            thumbnailUrl = getThumbnailUrl(LOLMode);
        }

        const button1 = new ButtonBuilder()
            .setLabel(`Tham gia vào phòng`)
            .setStyle(ButtonStyle.Link)
            .setURL(inviteUrl)
            .setEmoji("<:hanyaCheer:1173363092353200158>");

        const button2 = new ButtonBuilder()
            .setLabel("Discord Hỗ Trợ")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/z96kMmEGpP")
            .setEmoji("<:Spooky_poggers:1173362773015679117>");

        const actionRow = new ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("**TUYỂN THÀNH VIÊN VÀO PHÒNG**")
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL(), url: thumbnailUrl || "https://example.com/default-url" });

        if (thumbnailUrl) {
            embed.setThumbnail(`${thumbnailUrl}`);
        }

        embed.setFields(
            { name: "> **Kênh Thoại**", value: `\`\`\`yml\n${channelName}\`\`\``, inline: true },
            { name: "> **Số Người Trong Kênh**", value: `\`\`\`yml\n${slotValue}\`\`\``, inline: true },
            { name: "> **Thể Loại**", value: `\`\`\`yml\n${LOLMode || "Không xác định"}\`\`\``, inline: true }
        )
            .setFooter({ text: "/find_team - để tìm đồng đội", iconURL: "https://i.imgur.com/JREpG1E.png" })
            .setTimestamp();

        await interaction.reply({
            content: `**${interaction.user.toString()}** ${Msg} ${mentionTag}`,
            embeds: [embed],
            components: [actionRow],
            allowedMentions: { parse: ['users', 'roles', 'everyone'] }
        });
    }
};

function getThumbnailUrl(LOLMode) {
    switch (LOLMode) {
        case "sắt":
        case "iron":
            return "https://caythueelo.com/img_app/ironi.png";
        case "đồng":
        case "bronze":
            return "https://i.imgur.com/0ggCZCj.png";
        case "bạc":
        case "silver":
            return "https://i.imgur.com/RN3D8Gt.png";
        case "vàng":
        case "gold":
            return "https://i.imgur.com/NCVgBb5.png";
        case "bạch kim":
        case "platinum":
            return "https://i.imgur.com/fHbZ0gd.png";
        case "lục bảo":
        case "emerald":
            return "https://i.imgur.com/fHbZ0gd.png";
        case "kim cương":
        case "diamond":
            return "https://i.imgur.com/TOIFEU5.png";
        case "cao thủ":
        case "master":
            return "https://i.imgur.com/aTiPpUy.png";
        case "đại cao thủ":
        case "grandmaster":
            return "https://i.imgur.com/eo5tljR.png";
        case "thách đấu":
        case "challenger":
            return "https://i.imgur.com/BsHJN70.png";
        case "aram":
            return "https://images-ext-2.discordapp.net/external/hb1GA1JuZeD8LRgVJsKT7uhjmVTPsDGm1Pqqb_5G-u8/https/bettergamer.fra1.cdn.digitaloceanspaces.com/media/uploads/788e655d1bc017b4c2841d21c676b7d2.png?format=webp&quality=lossless&width=671&height=671";
        case "urf":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/2/2e/The_Thinking_Manatee_profileicon.png/revision/latest/smart/width/250/height/250?cb=20170504215412";
        case "đánh thường":
        case "thường":
        case "normal":
            return "https://i.imgur.com/pt5YQfy.jpeg";
        case "valheim":
            return "https://cdn.akamai.steamstatic.com/steam/apps/892970/extras/VALHEIM_EXPLORE.gif?t=1708348390";
        case "lol":
        case "lmht":
        case "liên minh huyền thoại":
        case "League of Legends":
            return "https://i.gifer.com/WKta.gif";
        default:
            return "";
    }
}



// const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("find_team")
//         .setDescription("🔹 Tìm đồng đội Valheim và các gamne khác")
//         .addStringOption(option =>
//         option.setName("lolmode")
//             .setDescription("Viết Tên Game Mà Bạn Muốn Mời Họ Tham Gia. Ví Dụ: Valheim")
//             .setRequired(false))
//         .addUserOption(option =>
//         option
//             .setName("user")
//             .setDescription("Tag người dùng bạn muốn mời")
//             .setRequired(false)),

// async execute(interaction) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/find_team' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         // const LOLMode = interaction.options.getString("lolmode");
//         const LOLMode = interaction.options.getString("lolmode")?.toLowerCase(); // Chuyển đổi thành chữ viết thường
//         const Msg = `Đang còn slot, vào đây cho vui`;


//         if (!interaction.member.voice.channel) {
//         await interaction.reply("Cần phải ở trong một kênh thoại để sử dụng lệnh này.");
//         return;
//         }

//         const voiceChannel = interaction.member.voice.channel;
//         const users = await voiceChannel.guild.members.fetch();
//         const userCounts = users.size; // số lượng người trong máy chủ discord
//         const userCount = voiceChannel.members.size; // Số lượng người trong phòng
//         const user = interaction.user;
//         const channelName = voiceChannel.name; // tên kênh
//         // const slotValue = userCount === 0 ? "∞" : `${userCount} / ${(voiceChannel.userLimit || "vô hạn")}`;
//         const slotValue = userCount === 0 ? "∞" : `${userCount} / ${userCounts}`;
//         const invite = await voiceChannel.createInvite({ maxAge: 3600 });
//         const inviteUrl = invite.url;
//         const userOption = interaction.options.getUser("user"); // Lấy thông tin người dùng từ lựa chọn
//         const userTag = userOption ? userOption.toString() : "@everyone"; // Tag everyone hoặc tag vai trò

//         // const thumbnailUrl = getThumbnailUrl(LOLMode.toLowerCase()); // Lấy URL cho thumbnail dựa trên rank mode
//         let thumbnailUrl = "";
//         if (LOLMode) { // Kiểm tra xem LOLMode có phải là null hoặc không được xác định không
//         // thumbnailUrl = getThumbnailUrl(LOLMode.toLowerCase()); // Nhận URL cho hình thu nhỏ dựa trên chế độ xếp hạng
//         thumbnailUrl = getThumbnailUrl(LOLMode);
//         }
        

//         const button1 = new ButtonBuilder()
//             .setLabel(`Tham gia vào phòng`)
//             .setStyle(ButtonStyle.Link)
//             .setURL(inviteUrl)
//             .setEmoji("<:hanyaCheer:1173363092353200158>"); //<:icons_lol:1206391029608091679>,

//         const button2 = new ButtonBuilder()
//             .setLabel("Discord Hỗ Trợ")
//             .setStyle(ButtonStyle.Link)
//             .setURL("https://discord.gg/z96kMmEGpP")
//             .setEmoji("<:Spooky_poggers:1173362773015679117>"); //<a:thongbso:1200132023302500453>(loa thông báo), <a:GG:1116058941365944372> (tăng level)
        
//         const actionRow = new ActionRowBuilder()
//             .addComponents(button1)
//             .addComponents(button2);

//         // .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: "https://discord.com/channels/1028540923249958912/1028540923761664042" })
//         const embed = new EmbedBuilder() // Tạo embed mới
//             .setColor("Green")
//             .setDescription("**TUYỂN THÀNH VIÊN VÀO PHÒNG**") // Thêm mô tả nếu cần
//             .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL(), url: thumbnailUrl || "https://example.com/default-url" })

//         if (thumbnailUrl) {
//             embed.setThumbnail(`${thumbnailUrl}`);
//         }
        
//         embed.setFields(
//             { name: "> **Kênh Thoại**", value: `\`\`\`yml\n${channelName}\`\`\``, inline: true },
//             { name: "> **Số Người Trong Kênh**", value: `\`\`\`yml\n${slotValue}\`\`\``, inline: true },
//             { name: "> **Thể Loại**", value: `\`\`\`yml\n${LOLMode}\`\`\``, inline: true }
//         )
//             .setFooter({ text: "/valheim - để tìm đồng đội", iconURL: "https://i.imgur.com/JREpG1E.png" }) // https://i.imgur.com/pt5YQfy.jpeg, https://discord.com/channels/1028540923249958912/1028540923761664042
//             .setTimestamp();

//         await interaction.reply({ 
//                             content: `**${interaction.user.toString()}** ${Msg} ${userTag === '@everyone' ? '@everyone' : userTag}`, // Đề cập rõ ràng đến @everyone
//                             embeds: [embed],
//                             components: [actionRow],
//                             allowedMentions: { parse: ['users', 'roles', 'everyone'] } // Cho phép đề cập một cách rõ ràng
//                         }); 
//     }
// };

// function getThumbnailUrl(LOLMode) {
//     switch (LOLMode) {
//         case "sắt":
//         case "iron":
//         return "https://caythueelo.com/img_app/ironi.png";
//         case "đồng":
//         case "bronze":
//         return "https://i.imgur.com/0ggCZCj.png";
//         case "bạc":
//         case "silver":
//         return "https://i.imgur.com/RN3D8Gt.png";
//         case "vàng":
//         case "gold":
//         return "https://i.imgur.com/NCVgBb5.png";
//         case "bạch kim":
//         case "platinum":
//         return "https://i.imgur.com/fHbZ0gd.png";
//         case "lục bảo":
//         case "emerald":
//         return "https://i.imgur.com/fHbZ0gd.png";
//         case "kim cương":
//         case "diamond":
//         return "https://i.imgur.com/TOIFEU5.png";
//         case "cao thủ":
//         case "master":
//         return "https://i.imgur.com/aTiPpUy.png";
//         case "đại cao thủ":
//         case "grandmaster":
//         return "https://i.imgur.com/eo5tljR.png";
//         case "thách đấu":
//         case "challenger":
//         return "https://i.imgur.com/BsHJN70.png";
//         case "aram":
//         return "https://images-ext-2.discordapp.net/external/hb1GA1JuZeD8LRgVJsKT7uhjmVTPsDGm1Pqqb_5G-u8/https/bettergamer.fra1.cdn.digitaloceanspaces.com/media/uploads/788e655d1bc017b4c2841d21c676b7d2.png?format=webp&quality=lossless&width=671&height=671";
//         case "urf":
//         return "https://static.wikia.nocookie.net/leagueoflegends/images/2/2e/The_Thinking_Manatee_profileicon.png/revision/latest/smart/width/250/height/250?cb=20170504215412";
//         case "đánh thường":
//         case "thường":
//         case "normal":
//         return "https://i.imgur.com/pt5YQfy.jpeg";
//         case "valheim":
//         return "https://cdn.akamai.steamstatic.com/steam/apps/892970/extras/VALHEIM_EXPLORE.gif?t=1708348390"; // https://i.imgur.com/KAplu9J.gif
//         case "lol":
//         case "lmht":
//         case "liên minh huyền thoại":
//         case "League of Legends":
//         return "https://i.gifer.com/WKta.gif";
//         default:
//         return "";
//     }
// }