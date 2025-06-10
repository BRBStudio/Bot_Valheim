const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');

// Dùng một cấu trúc dữ liệu để lưu trữ menu lựa chọn của mỗi người dùng
const userMenus = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription(`🔹 Thông tin về những người phát triển bot.`),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/dev' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Kiểm tra xem người dùng đã có menu lựa chọn hay chưa
        let menu = userMenus.get(interaction.user.id);
        if (!menu) {
            // Nếu không, tạo menu lựa chọn mới cho người dùng
            menu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`dev`)
                        .setPlaceholder('Chọn người bạn muốn xem thông tin')
                        .setDisabled(false)
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel('DEV 1')
                                .setValue('admin1')
                                .setDescription('Thông tin về dev 1')
                                .setEmoji('<:Discord1:1250097843889504322>'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('DEV 2')
                                .setValue('admin2')
                                .setDescription('Thông tin về dev 2')
                                .setEmoji('<:Discord1:1250097843889504322>'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('DEV 3')
                                .setValue('contributor1')
                                .setDescription('Thông tin về dev 3')
                                .setEmoji('<:VpQX0uNFuk:1249329135118057544>'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('DEV 4')
                                .setValue('contributor2')
                                .setDescription('Thông tin về dev 4')
                                .setEmoji('<:VpQX0uNFuk:1249329135118057544>')
                        )
                );
            userMenus.set(interaction.user.id, menu);
        }

        const thongtinAdmin1 = {
            Name: `Valheim Survival`,
            Age: `36`,
            Country: `Việt Nam 🇻🇳`,
            Skills: `\`\`\`yml\nChụp ảnh cưới, quay phim và một chút mọi thứ khác.\`\`\``,
            Hobbies: `\`\`\`yml\nNghe nhạc, phiêu lưu ẩm thực, phát triển mọi thứ, chơi trò chơi điện tử như Valheim hoặc Tomb Raider và ngủ.\`\`\``,
            JobTitle: `\`\`\`yml\nPhotographer\`\`\``,
            Company: `\`\`\`yml\nBRB Studio\`\`\``,
            CompanyAddress: `\`\`\`yml\n380 Đường Thành Công, Thành phố Yên Bái\`\`\``,
            Avatar: 'https://i.imgur.com/coUpySu.jpeg'
        };
        const thongtinAdmin2 = {
            Name: 'người dùng B',
            Age: '36',
            Country: 'Việt Nam 🇻🇳',
            Skills: 'bơi lội.',
            Hobbies: 'nghe nhạc',
            JobTitle: 'hướng dẫn viên',
            Company: 'cc tv',
            CompanyAddress: '558 Đường Thành Công, Thành phố Yên Bái',
            Avatar: 'https://i.imgur.com/coUpySu.jpeg'
        };
        const thongtinQuanly1 = {
            Name: 'Người dùng C',
            Age: '16',
            Country: 'Việt Nam 🇻🇳',
            Skills: ' quay phim và thứ khác.',
            Hobbies: ' ngủ.',
            JobTitle: 'học sinh',
            Company: 'không có vì đang là học sinh mà kkk',
            CompanyAddress: 'làm gì có công tý mà có địa chỉ hzzz',
            Avatar: 'https://i.imgur.com/coUpySu.jpeg'
        };
        const thongtinQuanly2 = {
            Name: 'Người dùng D',
            Age: '44',
            Country: 'Việt Nam 🇻🇳',
            Skills: 'chơi game.',
            Hobbies: 'Nghe nhạc, phiêu lưu ẩm thực, chơi trò chơi điện tử như Valheim hoặc Tomb Raider và ngủ.',
            JobTitle: 'tự do',
            Company: 'không có',
            CompanyAddress: 'công ty còn không có lấy đâu ra địa chỉ Y_Y',
            Avatar: 'https://i.imgur.com/coUpySu.jpeg'
        };

        const message = await interaction.reply({ content: 'Mọi thông tin về những thành viên quản lý cấp cao❤!\n\nNếu bạn muốn thêm hoặc thay đổi thông tin\ncó thể liên hệ tới [QUẢN LÝ BOT](https://discord.com/channels/@me/1225249585656496149)', components: [menu], ephemeral: false });

        // const collector = interaction.channel.createMessageComponentCollector();
        const collector = message.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            // console.log('Thành phần được thu thập:', i.customId);
            if (i.customId === `dev`) { // Kiểm tra xem ID của menu lựa chọn có trùng với ID của người dùng không
                const value = i.values[0];
                if (i.user.id !== interaction.user.id) {
                    // console.log('Nỗ lực tương tác trái phép bởi:', i.user.tag);
                    return await i.reply({ content: `Chỉ ${interaction.user.displayName} mới có thể tương tác với menu này! Nếu bạn muốn dùng hãy ấn */dev*`, ephemeral: true})
                }

                await i.deferUpdate(); // Dùng deferUpdate trước khi cập nhật thông tin

                let embed;
                switch (value) {
                    case 'admin1':
                        embed = new EmbedBuilder()
                            .setColor('#00FFFF')
                            .setTitle('Thông tin cá nhân của Admin Valheim Survival')
                            .setDescription(`Dưới đây là thông tin`)
                            .addFields(
                                { name: 'Tên', value: thongtinAdmin1.Name, inline: true },
                                { name: 'Tuổi', value: thongtinAdmin1.Age, inline: true },
                                { name: 'Quốc gia', value: thongtinAdmin1.Country, inline: true },
                                { name: 'Kỹ năng', value: thongtinAdmin1.Skills },
                                { name: 'Sở thích', value: thongtinAdmin1.Hobbies },
                                { name: 'Chức danh công việc', value: thongtinAdmin1.JobTitle, inline: true },
                                { name: 'Studio', value: thongtinAdmin1.Company },
                                { name: 'Địa chỉ Studio', value: thongtinAdmin1.CompanyAddress }
                            )
                            .setThumbnail(thongtinAdmin1.Avatar)
                            .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
                            .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
                            .setTimestamp();
                        break;
                    case 'admin2':
                        embed = new EmbedBuilder()
                            .setColor('#00FFFF')
                            .setTitle('Thông tin cá nhân của Admin 2')
                            .setDescription('Dưới đây là thông tin')
                            .addFields(
                                { name: 'Tên', value: thongtinAdmin2.Name, inline: true },
                                { name: 'Tuổi', value: thongtinAdmin2.Age, inline: true },
                                { name: 'Quốc gia', value: thongtinAdmin2.Country, inline: true },
                                { name: 'Kỹ năng', value: thongtinAdmin2.Skills },
                                { name: 'Sở thích', value: thongtinAdmin2.Hobbies },
                                { name: 'Chức danh công việc', value: thongtinAdmin2.JobTitle, inline: true },
                                { name: 'Studio', value: thongtinAdmin2.Company },
                                { name: 'Địa chỉ Studio', value: thongtinAdmin2.CompanyAddress }
                            )
                            .setThumbnail(thongtinAdmin2.Avatar)
                            .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
                            .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
                            .setTimestamp();
                        break;
                    case 'contributor1':
                        embed = new EmbedBuilder()
                            .setColor('#00FFFF')
                            .setTitle('Thông tin cá nhân Cộng tác viên 1')
                            .setDescription('Dưới đây là thông tin')
                            .addFields(
                                { name: 'Tên', value: thongtinQuanly1.Name, inline: true },
                                { name: 'Tuổi', value: thongtinQuanly1.Age, inline: true },
                                { name: 'Quốc gia', value: thongtinQuanly1.Country, inline: true },
                                { name: 'Kỹ năng', value: thongtinQuanly1.Skills },
                                { name: 'Sở thích', value: thongtinQuanly1.Hobbies },
                                { name: 'Chức danh công việc', value: thongtinQuanly1.JobTitle, inline: true },
                                { name: 'Studio', value: thongtinQuanly1.Company },
                                { name: 'Địa chỉ Studio', value: thongtinQuanly1.CompanyAddress }
                            )
                            .setThumbnail(thongtinQuanly1.Avatar)
                            .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
                            .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
                            .setTimestamp();
                        break;
                    case 'contributor2':
                        embed = new EmbedBuilder()
                            .setColor('#00FFFF')
                            .setTitle('Thông tin cá nhân Cộng tác viên 2')
                            .setDescription('Dưới đây là thông tin')
                            .addFields(
                                { name: 'Tên', value: thongtinQuanly2.Name, inline: true },
                                { name: 'Tuổi', value: thongtinQuanly2.Age, inline: true },
                                { name: 'Quốc gia', value: thongtinQuanly2.Country, inline: true },
                                { name: 'Kỹ năng', value: thongtinQuanly2.Skills },
                                { name: 'Sở thích', value: thongtinQuanly2.Hobbies },
                                { name: 'Chức danh công việc', value: thongtinQuanly2.JobTitle, inline: true },
                                { name: 'Studio', value: thongtinQuanly2.Company },
                                { name: 'Địa chỉ Studio', value: thongtinQuanly2.CompanyAddress }
                            )
                            .setThumbnail(thongtinQuanly2.Avatar)
                            .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
                            .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
                            .setTimestamp();
                        break;
                }
                
                // Cập nhật tin nhắn với embed mới
                await i.editReply({ embeds: [embed] });
            }
        });
    }
};








// const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');

// // Dùng một cấu trúc dữ liệu để lưu trữ menu lựa chọn của mỗi người dùng
// const userMenus = new Map();

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('admin-s')
//         .setDescription(`🕵️‍♂️ | Thông tin về các thành viên quản lý server.`),

//     async execute(interaction) {

//         // Kiểm tra xem người dùng đã có menu lựa chọn hay chưa
//         let menu = userMenus.get(interaction.user.id);
//         if (!menu) {
//             // Nếu không, tạo menu lựa chọn mới cho người dùng
//             menu = new ActionRowBuilder()
//                 .addComponents(
//                     new StringSelectMenuBuilder()
//                         .setCustomId(interaction.user.id) // Sử dụng ID của người dùng làm custom ID
//                         .setPlaceholder('Chọn người bạn muốn xem thông tin')
//                         .setDisabled(false)
//                         .addOptions(
//                             new StringSelectMenuOptionBuilder()
//                                 .setLabel('Admin 1')
//                                 .setValue('admin1')
//                                 .setDescription('Thông tin về Admin 1')
//                                 .setEmoji('<:Discord1:1250097843889504322>'),
//                             new StringSelectMenuOptionBuilder()
//                                 .setLabel('Admin 2')
//                                 .setValue('admin2')
//                                 .setDescription('Thông tin về Admin 2')
//                                 .setEmoji('<:Discord1:1250097843889504322>'),
//                             new StringSelectMenuOptionBuilder()
//                                 .setLabel('Cộng tác viên 1')
//                                 .setValue('contributor1')
//                                 .setDescription('Thông tin về Cộng tác viên 1')
//                                 .setEmoji('<:VpQX0uNFuk:1249329135118057544>'),
//                             new StringSelectMenuOptionBuilder()
//                                 .setLabel('Cộng tác viên 2')
//                                 .setValue('contributor2')
//                                 .setDescription('Thông tin về Cộng tác viên 2')
//                                 .setEmoji('<:VpQX0uNFuk:1249329135118057544>')
//                         )
//                 );
//             userMenus.set(interaction.user.id, menu);
//         }

//         const thongtinAdmin1 = {
//             Name: `Valheim Survival`,
//             Age: `36`,
//             Country: `Việt Nam 🇻🇳`,
//             Skills: `\`\`\`yml\nChụp ảnh cưới, quay phim và một chút mọi thứ khác.\`\`\``,
//             Hobbies: `\`\`\`yml\nNghe nhạc, phiêu lưu ẩm thực, phát triển mọi thứ, chơi trò chơi điện tử như Valheim hoặc Tomb Raider và ngủ.\`\`\``,
//             JobTitle: `\`\`\`yml\nPhotographer\`\`\``,
//             Company: `\`\`\`yml\nBRB Studio\`\`\``,
//             CompanyAddress: `\`\`\`yml\n380 Đường Thành Công, Thành phố Yên Bái\`\`\``,
//             Avatar: 'https://i.imgur.com/coUpySu.jpeg'
//         };
//         const thongtinAdmin2 = {
//             Name: 'người dùng B',
//             Age: '36',
//             Country: 'Việt Nam 🇻🇳',
//             Skills: 'bơi lội.',
//             Hobbies: 'nghe nhạc',
//             JobTitle: 'hướng dẫn viên',
//             Company: 'cc tv',
//             CompanyAddress: '558 Đường Thành Công, Thành phố Yên Bái',
//             Avatar: 'https://i.imgur.com/coUpySu.jpeg'
//         };
//         const thongtinQuanly1 = {
//             Name: 'Người dùng C',
//             Age: '16',
//             Country: 'Việt Nam 🇻🇳',
//             Skills: ' quay phim và thứ khác.',
//             Hobbies: ' ngủ.',
//             JobTitle: 'học sinh',
//             Company: 'không có vì đang là học sinh mà kkk',
//             CompanyAddress: 'làm gì có công tý mà có địa chỉ hzzz',
//             Avatar: 'https://i.imgur.com/coUpySu.jpeg'
//         };
//         const thongtinQuanly2 = {
//             Name: 'Người dùng D',
//             Age: '44',
//             Country: 'Việt Nam 🇻🇳',
//             Skills: 'chơi game.',
//             Hobbies: 'Nghe nhạc, phiêu lưu ẩm thực, chơi trò chơi điện tử như Valheim hoặc Tomb Raider và ngủ.',
//             JobTitle: 'tự do',
//             Company: 'không có',
//             CompanyAddress: 'công ty còn không có lấy đâu ra địa chỉ Y_Y',
//             Avatar: 'https://i.imgur.com/coUpySu.jpeg'
//         };

//         await interaction.deferReply(); // Giữ tương tác trước khi gửi phản hồ

//         const collector = await interaction.channel.createMessageComponentCollector();

//         collector.on('collect', async (i) => {
//             // console.log('Thành phần được thu thập:', i.customId);
//             if (i.customId === interaction.user.id) { // Kiểm tra xem ID của menu lựa chọn có trùng với ID của người dùng không
//                 const value = i.values[0];
//                 if (i.user.id !== interaction.user.id) {
//                     console.log('Nỗ lực tương tác trái phép bởi:', i.user.tag);
//                     return await i.reply({ content: `Chỉ ${interaction.user.tag} mới có thể tương tác với menu này! Nếu bạn muốn dùng hãy ấn */admin*`, ephemeral: true})
//                 }

//                 let embed;
//                 switch (value) {
//                     case 'admin1':
//                         embed = new EmbedBuilder()
//                             .setColor('#00FFFF')
//                             .setTitle('Thông tin cá nhân của Admin Valheim Survival')
//                             .setDescription(`Dưới đây là thông tin`)
//                             .addFields(
//                                 { name: 'Tên', value: thongtinAdmin1.Name, inline: true },
//                                 { name: 'Tuổi', value: thongtinAdmin1.Age, inline: true },
//                                 { name: 'Quốc gia', value: thongtinAdmin1.Country, inline: true },
//                                 { name: 'Kỹ năng', value: thongtinAdmin1.Skills },
//                                 { name: 'Sở thích', value: thongtinAdmin1.Hobbies },
//                                 { name: 'Chức danh công việc', value: thongtinAdmin1.JobTitle, inline: true },
//                                 { name: 'Studio', value: thongtinAdmin1.Company },
//                                 { name: 'Địa chỉ Studio', value: thongtinAdmin1.CompanyAddress }
//                             )
//                             .setThumbnail(thongtinAdmin1.Avatar)
//                             .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
//                             .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
//                             .setTimestamp();
//                         break;
//                     case 'admin2':
//                         embed = new EmbedBuilder()
//                             .setColor('#00FFFF')
//                             .setTitle('Thông tin cá nhân của Admin 2')
//                             .setDescription('Dưới đây là thông tin')
//                             .addFields(
//                                 { name: 'Tên', value: thongtinAdmin2.Name, inline: true },
//                                 { name: 'Tuổi', value: thongtinAdmin2.Age, inline: true },
//                                 { name: 'Quốc gia', value: thongtinAdmin2.Country, inline: true },
//                                 { name: 'Kỹ năng', value: thongtinAdmin2.Skills },
//                                 { name: 'Sở thích', value: thongtinAdmin2.Hobbies },
//                                 { name: 'Chức danh công việc', value: thongtinAdmin2.JobTitle, inline: true },
//                                 { name: 'Studio', value: thongtinAdmin2.Company },
//                                 { name: 'Địa chỉ Studio', value: thongtinAdmin2.CompanyAddress }
//                             )
//                             .setThumbnail(thongtinAdmin2.Avatar)
//                             .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
//                             .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
//                             .setTimestamp();
//                         break;
//                     case 'contributor1':
//                         embed = new EmbedBuilder()
//                             .setColor('#00FFFF')
//                             .setTitle('Thông tin cá nhân Cộng tác viên 1')
//                             .setDescription('Dưới đây là thông tin')
//                             .addFields(
//                                 { name: 'Tên', value: thongtinQuanly1.Name, inline: true },
//                                 { name: 'Tuổi', value: thongtinQuanly1.Age, inline: true },
//                                 { name: 'Quốc gia', value: thongtinQuanly1.Country, inline: true },
//                                 { name: 'Kỹ năng', value: thongtinQuanly1.Skills },
//                                 { name: 'Sở thích', value: thongtinQuanly1.Hobbies },
//                                 { name: 'Chức danh công việc', value: thongtinQuanly1.JobTitle, inline: true },
//                                 { name: 'Studio', value: thongtinQuanly1.Company },
//                                 { name: 'Địa chỉ Studio', value: thongtinQuanly1.CompanyAddress }
//                             )
//                             .setThumbnail(thongtinQuanly1.Avatar)
//                             .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
//                             .setImage(`https://i.imgur.com/ZPQtJ4V.gif`)
//                             .setTimestamp();
//                         break;
//                     case 'contributor2':
//                         embed = new EmbedBuilder()
//                             .setColor('#00FFFF')
//                             .setTitle('Thông tin cá nhân của Cộng tác viên 2')
//                             .setDescription('Dưới đây là thông tin')
//                             .addFields(
//                                 { name: 'Tên', value: thongtinQuanly2.Name, inline: true },
//                                 { name: 'Tuổi', value: thongtinQuanly2.Age, inline: true },
//                                 { name: 'Quốc gia', value: thongtinQuanly2.Country, inline: true },
//                                 { name: 'Kỹ năng', value: thongtinQuanly2.Skills },
//                                 { name: 'Sở thích', value: thongtinQuanly2.Hobbies },
//                                 { name: 'Chức danh công việc', value: thongtinQuanly2.JobTitle, inline: true },
//                                 { name: 'Studio', value: thongtinQuanly2.Company },
//                                 { name: 'Địa chỉ Studio', value: thongtinQuanly2.CompanyAddress }
//                             )
//                             .setThumbnail(thongtinQuanly2.Avatar)
//                             .setFooter({text: 'Thông tin này được cung cấp bởi Valheim Survival'})
//                             .setImage(`https://i.imgur.com/ZPQtJ4V.gif`)
//                             .setTimestamp();
//                         break;
//                 }
//                 await i.update({ embeds: [embed], ephemeral: true }).catch(console.error);
//             }
//         });
//         const message = await interaction.editReply({ content: 'Mọi thông tin về những thành viên quản lý cấp cao❤!\n\nNếu bạn muốn thêm hoặc thay đổi thông tin\ncó thể liên hệ tới [QUẢN LÝ BOT](https://discord.com/channels/@me/1225249585656496149)', components: [menu], ephemeral: false });
//     }
// }

