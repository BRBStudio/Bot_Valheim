const { Guild } = require("discord.js");

module.exports = {

    // PHIÊN BẢN BOT //
    botVersion: "v1.0.0",
    
    // NGƯỜI DÙNG ĐẶC BIỆT //
    specialUsers: [`940104526285910046`, ],// `1215380543815024700` , `933544716883079278`

    // QUYỀN //
    BotPermissions: `Bot thiếu quyền hạn cần thiết để thực hiện lệnh này`,
    OwnerPermissions: `\`\`\`diff\n+Chỉ dành cho chủ sở hữu.\`\`\``,
    test: `test`,

    // ĐỒNG XU CỦA BOT //
    xu: `<:xu1:1373619444408127518>`,
    
    // THÔNG TIN BOT // token brb dự phòng (MTMxOTkwNjY1NTUyNTI3Nzc1OQ.GgUFyB.CrpnUpSqCy938xMZsQXIe9lK1ciGzJWnM0tNBU) , token chính (MTI2ODU2OTE0MDQ2NjAyODY0OQ.GtveYQ.dQJMmcU9PCLXruK43bG9lVTQ2K39_3vfdjHnsA)
    Statusdnd: `dnd`,
    Statusonline: `online`,
    Statusofline: `offline`,
    EventListeners: 100,
    TitleInviteBot: `<a:VpQX0uNFuk:1249329135118057544> MỜI BOT`,
    DescriptionInviteBot: (clientId) => `<a:pinkstar:1249623499534893127> [Nhấn vào đây để mời bot đến server của bạn](https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=8)`,
    TitleReportBot: `<a:VpQX0uNFuk:1249329135118057544> BÁO CÁO BOT`,
    DescriptionReportBot: 
        `<a:pinkstar:1249623499534893127> Nếu bạn muốn báo cáo bot, vui lòng sử dụng hệ thống báo cáo        của chúng tôi` +
        `\`\`\`/mailbox\`\`\`<a:pinkstar:1249623499534893127> Hoặc liên hệ trực tiếp với chúng tôi thông qua lệnh\`\`\`/sup\`\`\``,
    TitleEmptyCategory: `DANH MỤC TRỐNG`,
    DescriptionEmptyCategory: `Vui lòng chọn danh mục khác hoặc chờ DEV thêm vào.`,
    DescriptionPrefix: `Danh sách các lệnh ? có sẵn trong danh mục này:`,
    DescriptionSlash: `Danh sách các lệnh / có sẵn trong danh mục này:`,
    TitleCommandsHelp: `<a:VpQX0uNFuk:1249329135118057544> LỆNH CỦA BOT`,
    TitleOnGame: `HƯỚNG DẪN VÀO GAME`,
    TitleCaiMod: `HƯỚNG DẪN TẢI MOD VÀ CÀI MOD`,
    TitleBRB: `Các Lệnh của Bot Valheim`,
    DescriptionBRB: `**Ấn / trước khi viết lệnh**`,
    DescriptionCommandsHelp: 
        `<a:pinkstar:1249623499534893127> Đây là danh sách các lệnh của BRB STUDIO.\n` + 
        `<a:pinkstar:1249623499534893127> Sử dụng menu bên dưới để xem thông tin từng mục.\n` +
        `<a:pinkstar:1249623499534893127> Mỗi mục sẽ có lệnh tương ứng với quyền hạn mà bạn có thể sử        dụng.`,
    DevBy: `Được phát triển bởi ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`,
    Dev1: `Lệnh này chỉ dùng cho **NPT** bot`,
    NoPerms: `Bạn **không** có quyền cần thiết để sử dụng lệnh này!`,
    OwnerOnlyCommand: `Lệnh này **chỉ** dành cho chủ sở hữu!`,
    GuildOnlyCommand: `Lệnh này **chỉ** có thể được sử dụng trong máy chủ.`,
    BadMessage: `Tin nhắn của bạn bao gồm ngôn từ tục tĩu **không** được phép!`,
    botInvite: `[BRB STUDIO]https://discord.gg/s2ec8Y2uPa`,
    botServerInvite: `https://discord.com/oauth2/authorize?client_id=1319906655525277759&permissions=8&integration_type=0&scope=bot`, 
    LinkMoiBot: `https://bit.ly/BotValheim`,

    // THỜI GIAN HỒI CHIÊU //
    COOLDOWN: 5, // 5 giây

    // CẤU HÌNH EMAIL //
    emailConfig: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        user: "brbstudio.88@gmail.com",
        pass: "123456facebook"
    },

    // MÀU SẮC EMBED //
    embedRandom: "Random",                          // Mầu ngẫu nhiên
    embedBlurple: "Blurple",                        // Mầu tím đỏ
    embedBlue: "Blue",                              // Mầu xanh dương
    embedGreen: "Green",                            // Mầu xanh lá cây
    embedRed: "Red",                                // Mầu đỏ
    embedDarkRed: "DarkRed",                        // Mầu đỏ đậm
    embedLuminousVividPink: "LuminousVividPink",    // màu hồng sáng
    embedGold: "Gold",                              // Mầu vàng đồng
    embedOrange: "Orange",                          // Mầu cam
    embedYellow: "Yellow",                          // Mầu vàng
    embedBlack: "Black",                            // Mầu đen
    embedPink: "Pink",                              // Mầu hồng
    embedLavender: "Lavender",                      // Mầu hoa oải hương
    embedMaroon: "Maroon",                          // Mầu sẫm (Mầu đỏ sẫm, hơi tím)
    embedOlive: "Olive",                            // Mầu ô liu
    embedTeal: "Teal",                              // Mầu xanh lam (xanh nước biển)
    embedSilver: "Silver",                          // Mầu bạc
    embedBeige: "Beige",                            // Mầu be
    embedAqua: "Aqua",                              // màu xanh nhạt gần giống như màu cyan
    embedNavy: "Navy",                              // Mầu hải quân (xanh dương đậm)
    embedIndigo: "Indigo",                          // Mầu tím đậm
    embedViolet: "Violet",                          // Mầu hồng tím
    embedPurple: "Purple",                          // Mầu tím
    embedFuchsia: "Fuchsia",                        // màu đỏ tươi
    embedDarkOrange: "DarkOrange",                  // Mầu cam đậm
    embedDarkGreen: "DarkGreen",                    // Mầu xanh lá cây đậm
    embedCyan: "#00FFFF",                           // Mầu xanh lơ (rất đẹp)
    embedWhite: "White",                            // Màu Trắng

    // EMOJIS ĐỘNG //
    tuchoiEmoji: "<a:tickred51:1240060253240819843>",
    dongyEmoji: "<a:_verified_:1240060278863958056>",
    echEmoji: "<a:ech7:1234014842004705360>",
    nitroEmoji: "<a:hanyaCheer:1173363092353200158>",
    helpEmoji: "<a:help:1247600956804300882>",
    khoaEmoji: "<a:khoa:1247600800889442334>",
    testEmoji: "<a:music:1312885473039089684>",
    fishEmoji: "<a:vip:1320072970340925470>",

    // EMOJIS TĨNH //
    arrowDownEmoji: "↴",
    errorEmoji: "❌",
    warning: "⚠️",

    // ID KÊNH //
    slashCommandLoggingChannel: "1238869804744441896", // kênh ghi lệnh gạch chéo
    prefixCommandLoggingChannel: "1241592178480775188", // Kênh ghi lệnh tiền tố
    suggestionChannel: "1240335460463677503", // Kênh gợi ý
    bugReportChannel: "1240341717031456840", // Kênh báo cáo lỗi
    botLeaveChannel: "1139731092329480332", // Kênh ghi nhật ký cho bot rời khỏi máy chủ
    botJoinChannel: "1240480049681928203", // Kênh ghi nhật ký cho bot tham gia máy chủ
    commandErrorChannel: "1240912641719930970", // Kênh ghi nhật ký lỗi lệnh

    // ID MÁY CHỦ //
    server1: `1028540923249958912`, // Máy chủ chính
    server2: `1225228795070648351`, // máy chủ test1
    server3: `1225250831280898168`, // máy chủ test2
}
