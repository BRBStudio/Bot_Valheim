// welcome-default.js
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const WelcomeDefault = require('../../schemas/welcomedefaultSchema.js');
const WelcomeCustom = require("../../schemas/welcomecustomSchema.js");
const { checkOwner } = require(`../../permissionCheck.js`)
const CommandStatus = require('../../schemas/Command_Status.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome_default')
        .setDescription('🔹 Quản lý kênh chào mừng mặc định cho thành viên mới')
        .addSubcommand(subcommand =>
            subcommand
                .setName('on')
                .setDescription('🔹 Bật chào mừng mặc định và chọn kênh chào mừng mặc định')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('Chọn kênh để chào mừng mặc định')
                        .setRequired(true))
                .addAttachmentOption(option => 
                    option.setName('image')
                        .setDescription('Chọn hình ảnh')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('off')
                .setDescription('🔹 Tắt chào mừng mặc định và xóa thiết lập mặc định')),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/welcome_default' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkOwner(interaction);
        if (!hasPermission) return;

        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        // Kiểm tra xem lời chào tùy chỉnh đã được kích hoạt chưa
        const customWelcome = await WelcomeCustom.findOne({ guildId });
        if (customWelcome && customWelcome.customWelcomeActive) {
            return await interaction.reply('Lời chào mừng custom đã được thiết lập trước đó, vui lòng xóa dữ liệu trước khi thay đổi thiết lập lời chào mừng mới.');
        }

        if (subcommand === 'on') {
            const channel = interaction.options.getChannel('channel'); // Lấy kênh từ tùy chọn
            if (channel.type !== ChannelType.GuildText) { // Kiểm tra xem kênh có phải là kênh văn bản không
                return await interaction.reply('Vui lòng chọn kênh văn bản.');
            }

            const image = interaction.options.getAttachment('image'); // Hình ảnh tùy chọn
            let imageURL;

            // Nếu người dùng không cung cấp hình ảnh, sử dụng ảnh đã lưu trước đó
            if (!image) {
                const existingWelcome = await WelcomeDefault.findOne({ guildId });
                if (existingWelcome && existingWelcome.imageURL) {
                    imageURL = existingWelcome.imageURL; // Sử dụng hình ảnh đã lưu
                } else {
                    imageURL = null; // Không có hình ảnh nào
                }
            } else {
                imageURL = image.url; // Sử dụng URL của hình ảnh mới
            }

            // Lưu thông tin vào MongoDB
            await WelcomeDefault.findOneAndUpdate(
                { guildId },
                { channelId: channel.id, defaultWelcomeActive: true, imageURL },
                { upsert: true } // Tạo mới nếu không tìm thấy bản ghi
            );

            return await interaction.reply(`Đã bật chào mừng và kênh được chọn là <#${channel.id}>.`);
        } else if (subcommand === 'off') {
            // Xóa thiết lập
            await WelcomeDefault.deleteOne({ guildId });
            return await interaction.reply('Đã tắt chào mừng và xóa thiết lập.');
        }
    },
};


























// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const economySystem = require('../../schemas/economySystem');
// const config = require(`../../config`);

// var timeout = [];

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('economy')
//         .setDescription('Kinh tế.')
//         .addSubcommand(command => command.setName('great-account').setDescription('Tạo tài khoản kinh tế'))
//         .addSubcommand(command => command.setName('delete').setDescription('Xóa tài khoản tiết kiệm của người dùng').addUserOption(op => op.setName('account').setDescription('Chọn người dùng để xóa tài khoản').setRequired(true)))
//         .addSubcommand(command => command.setName('view-account').setDescription('Xem số dư và thông tin tài khoản nền kinh tế của bạn.'))
//         .addSubcommand(command => command.setName('deposit-account').setDescription('Gửi tiền từ ví của bạn vào ngân hàng.').addStringOption(op => op.setName('amount').setDescription('Số tiền gửi').setRequired(true)))
//         .addSubcommand(command => command.setName('daily-account').setDescription('số tiền hỗ trợ hàng ngày của bạn'))
//         .addSubcommand(command => command.setName('ask-money').setDescription('Xin tiền'))
//         .addSubcommand(command => command.setName('gamble').setDescription('Đánh bạc để thắng hoặc thua tiền').addStringOption(op => op.setName('amount').setDescription('Số tiền đánh bạc (mặc định = 500)').setRequired(false)))
//         .addSubcommand(command => command.setName('work').setDescription('Làm việc để kiếm tiền'))
//         .addSubcommand(command => command.setName('withdraw-money').setDescription('Rút tiền từ ngân hàng về ví').addStringOption(op => op.setName('amount').setDescription('Số tiền cần rút').setRequired(true)))
//         .addSubcommand(command => command.setName('rob').setDescription('Cướp tiền một người').addUserOption(op => op.setName('user').setDescription('Chọn người dùng bạn muốn cướp').setRequired(true))),

//     async execute(interaction, client) {
//         const { options, guild, user } = interaction;

//         // Ghi lại thông tin người dùng và guild
//         // console.log(`User: ${user.id}, Guild: ${guild.id}`);
        
//         let data = await economySystem.findOne({ Guild: guild.id, User: user.id });
//         // console.log('Tìm dữ liệu tài khoản:', data);
        
//         const sub = options.getSubcommand();
//         // console.log(`Subcommand được thực thi: ${sub}`);

//         try {
//             switch (sub) {
//             case "great-account":
//                     if (data) {
//                         // console.log("Tài khoản đã tồn tại.");
//                         return await interaction.reply({ content: "Bạn đã có tài khoản phổ thông!", ephemeral: true });
//                     } else {
//                         // console.log("Tạo tài khoản mới.");
//                 try {        
//                         await economySystem.create({
//                             Guild: guild.id,
//                             User: user.id,
//                             Bank: 5000,
//                             Wallet: 5000,
//                             Worked: 0,
//                             Gambled: 0,
//                             Begged: 0,
//                             HoursWorked: 0,
//                             CommandsRan: 0,
//                             Moderated: 0
//                         });
//                     } catch (error) {
//                         // console.error("Lỗi khi tạo tài khoản:", error);
//                         return await interaction.reply({ content: "Đã xảy ra lỗi khi tạo tài khoản!", ephemeral: true });
//                     }

//                         const embed = new EmbedBuilder()
//                             .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                             .setColor(config.embedCyan)
//                             .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                             .setThumbnail(client.user.displayAvatarURL())
//                             .setDescription('Bạn đã tạo tài khoản kinh tế, bạn đã được thưởng:\n\n• 5.000 vnd -> 🏦\n• 5.000 vnd -> 💵\n\n__Dùng lệnh \`/economy view-account \` để xem số dư và thông tin của bạn.__')
//                             .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                             .setTimestamp();

//                         await interaction.reply({ embeds: [embed] });
//                     }
//                     break;


//             case "delete":
//                     if (!data) {
//                         return await interaction.reply({ content: "Bạn không có tài khoản phổ thông để xóa!", ephemeral: true });
//                     } else {
//                         await economySystem.deleteOne({ Guild: guild.id, User: user.id });

//                         const deleted = new EmbedBuilder()
//                             .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                             .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                             .setThumbnail(client.user.displayAvatarURL())
//                             .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                             .setTimestamp()
//                             .setColor(config.embedRed)
//                             .setDescription('> Tài khoản phổ thông của bạn đã bị **xóa**.');

//                         await interaction.reply({ embeds: [deleted] });
//                     }
//                     break;


//             case "view-account":
//                     if (!data) return await interaction.reply({ content: "Không tìm thấy tài khoản phổ thông, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account \`", ephemeral: true });

//                     else {
//                         const formattedBank = data.Bank.toLocaleString('vi-VN');
//                         const formattedWallet = data.Wallet.toLocaleString('vi-VN');
//                         const totalAmount = (data.Wallet + data.Bank).toLocaleString('vi-VN');
                        
//                         const embed = new EmbedBuilder()
//                         .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                         .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                         .setDescription(`> Đây là thông tin tài khoản của bạn:`)
//                         .setThumbnail(client.user.displayAvatarURL())
//                         .setColor(config.embedGreen)
//                         .addFields(
//                             { name: "Tài khoản vãng lai", value: [
//                                 `• 🏦 **${formattedBank} vnd** Trong ngân hàng`, 
//                                 `• 💵 **${formattedWallet} vnd** Bằng tiền mặt`, 
//                                 `• 💰 **${totalAmount} vnd** Tổng thể`
//                             ].join("\n"), inline: false },
//                             { name: "Khu vực cá nhân", value: [
//                                 `• 🧑‍💻 **${data.CommandsRan}** {/} lần gửi và rút tiền`, 
//                                 `• 🛠️ **${data.Moderated}** lần (kiểm duyệt)`, 
//                                 `• 🙏 **${data.Begged}** lần xin tiền`, 
//                                 `• 👷 **${data.Worked}** lần làm việc (${data.HoursWorked} h)`, 
//                                 `• 🎰 **${data.Gambled}** lần đánh bạc`
//                             ].join("\n"), inline: false }
//                         )
//                         .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                         .setTimestamp();

//                         await interaction.reply({ embeds: [embed] });
//                     }
//                     break;


//             case "deposit-account": 
//                     if (!data) return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng `/economy great-account`", ephemeral: true });

//                     // Nhận giá trị từ tham số và chuyển đổi thành số
//                     let amountString = options.getString('amount'); // Nhận giá trị dưới dạng chuỗi
//                     let amount = parseFloat(amountString.replace('.', '')); // Thay thế dấu chấm để chuyển đổi thành số

//                     // Kiểm tra nếu số tiền là một số hợp lệ
//                     if (isNaN(amount) || amount <= 0) {
//                         return await interaction.reply({ content: "Số tiền gửi không hợp lệ!", ephemeral: true });
//                     }

//                     if (data.Wallet < amount) {
//                         return await interaction.reply({ content: `Bạn đang cố gắng gửi tiền ${amountString} vnd trong khi bạn chỉ có ${data.Wallet.toLocaleString('vi-VN')} vnd có sẵn để gửi...`, ephemeral: true });
//                     }

//                     // Cập nhật số dư
//                     data.Wallet -= amount; // Sử dụng amount đã tính toán
//                     data.Bank += amount; // Cập nhật số tiền vào ngân hàng
//                     data.CommandsRan += 1;
//                     await data.save();

//                     // Tạo Embed để trả lời
//                     const embedDeposit = new EmbedBuilder()
//                         .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                         .setTitle(`Mới Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                         .setThumbnail(client.user.displayAvatarURL())
//                         .setColor(client.config.embedGreen)
//                         .setDescription(`> Bạn đã gửi tiền thành công **${amountString} vnd** vào ví của bạn \n\n• dùng \`/economy view-account\` để xem thông tin mới của bạn.`)
//                         .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                         .setTimestamp();

//                     // Trả lời với Embed đã định dạng
//                     await interaction.reply({ embeds: [embedDeposit] });
//                     break;


//             case "daily-account":
//                     if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: "Hôm nay bạn đã sử dụng \`/daily\` rồi. Hãy quay lại sau **24 h**", ephemeral: true });

//                     if (!data) return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account \`", ephemeral: true });
//                     else {
//                         const randAmount = Math.round((Math.random() * 3000) + 10);

//                         data.Bank += randAmount;
//                         data.CommandsRan += 1;
//                         data.save();

//                         const embed = new EmbedBuilder()
//                             .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                             .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                             .setThumbnail(client.user.displayAvatarURL())
//                             .setColor(client.config.embedGreen)
//                             .setDescription(`> Bạn đã nhận được số tiền hỗ trợ hàng ngày của mình!\n\n• Số lượng: **$${randAmount}**\n• Thời gian nhận tiếp sau: **24 h**`)
//                             .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                             .setTimestamp();

//                         await interaction.reply({ embeds: [embed] });

//                         timeout.push(interaction.user.id);
//                         setTimeout(() => {
//                             timeout.shift();
//                         }, 86400000);
//                     }
//                     break;


//                     case "ask-money":
//                         // Kiểm tra nếu người dùng không có tài khoản
//                         if (!data) {
//                             return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account\`", ephemeral: true });
//                         }
                    
//                         // Kiểm tra nếu người dùng đã xin tiền gần đây
//                         if (timeout.includes(interaction.user.id)) {
//                             return await interaction.reply({ content: "Hãy quay lại sau **10 tiếng** để xin tiền!", ephemeral: true });
//                         }
                    
//                         // Lấy thời gian hiện tại và thời gian gần nhất người dùng xin tiền
//                         const now = new Date();
//                         const lastBegged = data.LastBegged;
//                         const timeDifference = lastBegged ? (now - lastBegged) / (1000 * 60 * 60) : 0; // Tính thời gian chờ (tính bằng giờ)
                    
//                         // Kiểm tra nếu thời gian chờ đủ 10 tiếng
//                         if (timeDifference < 10) {
//                             const remainingTime = 10 - timeDifference; // Tính thời gian còn lại
//                             return await interaction.reply({ content: `Hãy quay lại sau **${remainingTime.toFixed(2)} giờ** để xin tiền.`, ephemeral: true });
//                         } else {
//                             const randAmount = Math.round((Math.random() * 750) + 10);
                    
//                             // Cập nhật số liệu
//                             data.CommandsRan += 1;
//                             data.Begged += 1; // Tăng số lần xin tiền
//                             data.Wallet += randAmount; // Cập nhật số tiền vào ví
//                             data.LastBegged = now; // Cập nhật thời gian xin tiền
//                             await data.save();
                    
//                             // Tạo Embed để trả lời
//                             const embed = new EmbedBuilder()
//                                 .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                                 .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                                 .setDescription(`> Bạn vừa xin tiền và đã **thành công**:\n\n→ Số tiền đã xin: **${randAmount} vnd**\n• Thời gian xin tiếp theo: **10 giờ**`)
//                                 .setFooter({ text: `1 phút nữa quay lại và dùng \`/economy ask-money\`` })
//                                 .setColor(client.config.embedGreen)
//                                 .setTimestamp()
//                                 .setThumbnail(client.user.displayAvatarURL());
                    
//                             await interaction.reply({ embeds: [embed] });
                    
//                             // Thêm user vào timeout
//                             timeout.push(interaction.user.id);
//                             setTimeout(() => {
//                                 timeout = timeout.filter(id => id !== interaction.user.id); // Xóa user khỏi timeout sau 10 tiếng
//                             }, 36000000); // 10 tiếng
//                         }
//                         break;
                    


//             case "gamble":
//                         if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: "Hãy quay lại sau **5 phút** để đánh bạc nhiều hơn!", ephemeral: true });
                    
//                         // Nhận giá trị từ tham số và chuyển đổi thành số
//                         let amountString1 = options.getString('amount') || '500'; // Nhận giá trị dưới dạng chuỗi
//                         let amount1 = parseFloat(amountString1.replace('.', '')); // Thay thế dấu chấm để chuyển đổi thành số
                    
//                         // Kiểm tra nếu số tiền là một số hợp lệ
//                         if (isNaN(amount1) || amount1 <= 0) {
//                             return await interaction.reply({ content: "Số tiền không hợp lệ! hãy dùng cách viết ```1.000```", ephemeral: true });
//                         }
                    
//                         if (!data) return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account\`", ephemeral: true });
//                         else {
//                             if (data.Wallet < amount1) return await interaction.reply({ content: `Bạn chỉ có **${data.Wallet.toLocaleString('vi-VN')} vnd** trong ví của bạn...`, ephemeral: true });
//                             if (data.Wallet < amount1 && data.Bank > amount1) return await interaction.reply({ content: `Bạn có **${data.Wallet.toLocaleString('vi-VN')} vnd** trong ví của bạn nhưng **${data.Bank.toLocaleString('vi-VN')} vnd**...không đủ rút một số tiền để đánh bạc` });
                    
//                             const acca = [0.4, 0.8, 1, 5, 2.1, 1.6, 10, 2, 0.9, 1.1, 0, 0, 1, 2, 3, 0.2, 0.3, 0.4, 1.2, 0.3, 0.35, 0, 8, 0.2, 0.5, 0, 0.1, 2.5, 1.8, 0.4, 0.8, 1, 5, 2.1, 1.6, 10, 2, 0.9, 1.1, 0, 0, 1, 2, 3, 0.1, 2.5, 1.8, 100];
                    
//                             const jobPick = acca[Math.floor(Math.random() * acca.length)];
                    
//                             if (jobPick === 1) return await interaction.reply({ content: "Bạn không *thắng* hay *thua*" });
                    
//                             const winorlose = jobPick * amount1;
                    
//                             const hours = Math.round((Math.random() * 15) + 8);
                    
//                             let choice;
//                             let happened;
//                             let profit;
                    
//                             if (jobPick < 1) {
//                                 choice = "Thua";
//                                 happened = "Thắng";
//                             }
//                             if (jobPick > 1) {
//                                 choice = "Thắng";
//                                 happened = "Thắng";
//                                 profit = winorlose - amount1;
//                             }
                    
//                             data.Wallet -= amount1;
//                             data.Wallet += winorlose;
//                             data.Gambled += 5;
//                             data.CommandsRan += 1;
//                             await data.save();
                    
//                             const embed = new EmbedBuilder()
//                                 .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                                 .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                                 .setThumbnail(client.user.displayAvatarURL())
//                                 .setDescription(`Bạn vừa đánh bạc **${amountString1} vnd** và **${choice}**\n\n💵 Số tiền đánh bạc: **${amountString1} vnd**\n🎰 Tích lũy: **${jobPick}**\n\n🎉 Tổng cộng **${happened}: ${winorlose.toLocaleString('vi-VN')} vnd**`)
//                                 .setFooter({ text: `Quay lại sau 5 phút và dùng \`/economy gamble\`` })
//                                 .setColor(config.embedGold)
//                                 .setTimestamp();
                    
//                             await interaction.reply({ embeds: [embed] });
                    
//                             timeout.push(interaction.user.id);
//                             setTimeout(() => {
//                                 timeout.shift();
//                             }, 300000);
//                         }
//                         break;
                        
                    
//             case "work":
//                     if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: "hãy quay lại sau **5 phút** để làm việc lại!", ephemeral: true });

//                     if (!data) return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account\`", ephemeral: true });
//                     else {
//                         const jobs = [
//                             "Valheim",
//                             "LMHT",
//                             "Xây dựng nhà Valheim",
//                             "Xây dựng map",
//                             "Game thủ",
//                             "Người sáng tạo",
//                             "Streamer",
//                             "Quan hệ công chúng",
//                             "Quản lý"
//                         ];

//                         const jobPick = jobs[Math.floor(Math.random() * jobs.length)];

//                         const amount = Math.round((Math.random() * 10000) + 10);

//                         const hours = Math.round((Math.random() * 15) + 8);

//                         const pph = Math.round(amount / hours);

//                         data.Bank += amount;
//                         data.Worked += 1;
//                         data.HoursWorked += hours;
//                         data.CommandsRan += 1;
//                         data.save();

//                         // Định dạng lại amount và pph theo kiểu VND
//                         const formattedAmount = amount.toLocaleString('vi-VN');
//                         const formattedPPH = pph.toLocaleString('vi-VN');

//                         const embed = new EmbedBuilder()
//                         .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                         .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                         .setThumbnail(client.user.displayAvatarURL())
//                         .setDescription(`Bạn đã làm việc với tư cách **${jobPick}**\n\n→ Số giờ đã làm việc: **${hours}** giờ\n^ Trả lương trong ngày: **${formattedAmount} vnd**\n→ Trả lương mỗi giờ: **${formattedPPH} vnd**`)
//                         .setFooter({ text: `Hãy quay lại sau 5 phút và dùng \`/economy work\`` })
//                         .setColor(config.embedGold)
//                         .setTimestamp()

//                         await interaction.reply({ embeds: [embed] });

//                         timeout.push(interaction.user.id);
//                         setTimeout(() => {
//                             timeout.shift();
//                         }, 300000);
//                     }
//                     break;


//             case "withdraw-money":
//                         // Nhận giá trị từ tham số và chuyển đổi thành số
//                         let amountString2 = options.getString('amount');
//                         let amount2 = parseFloat(amountString2.replace(/\./g, '')); // Thay thế dấu chấm để chuyển đổi thành số
                        
//                         // Kiểm tra nếu số tiền là một số hợp lệ
//                         if (isNaN(amount2) || amount2 <= 0) {
//                             return await interaction.reply({ content: "Số tiền không hợp lệ! Hãy dùng cách viết ```1.000```", ephemeral: true });
//                         }
                    
//                         if (!data) {
//                             return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account\`", ephemeral: true });
//                         } else {
//                             if (data.Bank < amount2) {
//                                 return await interaction.reply({ content: `Bạn đang cố gắng rút **${amount2.toLocaleString('vi-VN')} vnd** trong khi bạn chỉ có sẵn **${data.Bank.toLocaleString('vi-VN')} vnd** để thực hiện việc đó...`, ephemeral: true });
//                             }
                    
//                             data.Bank -= amount2;
//                             data.Wallet += amount2;
//                             data.CommandsRan += 1;
//                             await data.save();
                    
//                             const embed = new EmbedBuilder()
//                                 .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
//                                 .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                                 .setThumbnail(client.user.displayAvatarURL())
//                                 .setColor(client.config.embedGreen)
//                                 .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                                 .setDescription(`Bạn đã rút thành công **${amount2.toLocaleString('vi-VN')} vnd** về ví của mình \n\nChạy \`/economy view-account\` để xem thông tin mới của bạn.`)
//                                 .setTimestamp();
                    
//                             await interaction.reply({ embeds: [embed] });
//                         }
//                         break;

                    
//             case "rob":
//                         if (timeout.includes(interaction.user.id)) 
//                             return await interaction.reply({ content: 'Bạn cần đợi **1 phút** để cướp lại người dùng khác', ephemeral: true });

//                         const userStealing = options.getUser('user');

//                         let Data = await economySystem.findOne({ Guild: guild.id, User: user.id });
//                         let DataUser = await economySystem.findOne({ Guild: guild.id, User: userStealing.id });

//                         if (!Data) 
//                             return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng `/economy great-account`", ephemeral: true });
//                         if (userStealing == interaction.user) 
//                             return await interaction.reply({ content: 'Bạn **không thể** cướp chính mình!', ephemeral: true });
//                         if (!DataUser) 
//                             return await interaction.reply({ content: 'Người dùng đó **không** có tài khoản phổ thông được tạo', ephemeral: true });
//                         if (DataUser.Wallet <= 0) 
//                             return await interaction.reply({ content: 'Người dùng đó **không** có tiền trong ví của họ', ephemeral: true });

//                         let negative = Math.round((Math.random() * -150) - 10);
//                         let positive = Math.round((Math.random() * 300) - 10);

//                         const posN = [negative, positive];

//                         const amount3 = Math.round(Math.random() * posN.length);
//                         const value = posN[amount3];

//                         if (Data.Wallet <= 0) 
//                             return await interaction.reply({ content: 'Bạn **không thể** cướp của người này vì ví của bạn có **0 vnd** trong đó', ephemeral: true });

//                         if (value > 0) {
//                             // trộm thành công
//                             const positiveChoices = [
//                                 "Bạn đã ăn trộm",
//                                 "Người chủ đã nhìn thấy bạn và giúp bạn cướp",
//                                 "Bạn đã cướp",
//                                 "Bạn đã lấy",
//                                 "Bạn đã cướp thành công",
//                                 "Bạn đánh người đó và lấy",
//                                 "Bạn cướp người rồi bỏ trốn cùng",
//                                 "Bạn đã đột nhập vào tài khoản ngân hàng của người đó và lấy",
//                             ];

//                             const posName = Math.floor(Math.random() * positiveChoices.length);

//                             const begEmbed = new EmbedBuilder()
//                                 .setColor(client.config.embedGreen)
//                                 .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}`})
//                                 .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                                 .addFields({ name: '> Bạn đã cướp và', value: `• ${positiveChoices[posName]} ${value.toLocaleString('vi-VN')} vnd`})  // Thay đổi số tiền sang định dạng vnd
//                                 .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                                 .setThumbnail(client.user.avatarURL())
//                                 .setTimestamp();

//                             await interaction.reply({ embeds: [begEmbed] });

//                             Data.Wallet += value;
//                             await Data.save();

//                             DataUser.Wallet -= value;
//                             await DataUser.save();
//                         } else if (value < 0) {
//                             // trộm thất bại
//                             const negativeChoices = [
//                                 "Bạn bị cảnh sát bắt và bị lạc",
//                                 "Bạn để lại giấy tờ tùy thân và bị bắt, bạn thua cuộc",
//                                 "Người đó đánh bạn bất tỉnh và lấy đi",
//                                 "Người đó nhìn thấy bạn và lấy",
//                                 "Người đó bắt được bạn và lấy đi",
//                                 "Người đó đã đánh bạn và lấy đi",
//                                 "Người đó đã gọi cảnh sát và bạn đã thua cuộc",
//                             ];

//                             const wal = Data.Wallet;
//                             if (isNaN(value)) 
//                                 return await interaction.reply({ content: 'Người dùng này đã gọi cảnh sát đến bắt bạn nhưng bạn đã bỏ chạy. Bạn không mất hay đạt được gì cả', ephemeral: true });

//                             const negName = Math.floor(Math.random() * negativeChoices.length);

//                             let nonSymbol;
//                             if (value - wal < 0) {
//                                 const stringV = `${value}`;

//                                 nonSymbol = await stringV.slice(1);  // Xóa dấu âm từ giá trị số

//                                 // ví âm tiền
//                                 const los = new EmbedBuilder()
//                                     .setColor(client.config.embedGreen)
//                                     .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                                     .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}`})
//                                     .addFields({ name: '> Bạn đã cướp và', value: `• ${negativeChoices[negName]} ${nonSymbol.toLocaleString('vi-VN')} vnd`})  // Thay đổi số tiền sang định dạng vnd
//                                     .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                                     .setThumbnail(client.user.avatarURL())
//                                     .setTimestamp();

//                                 Data.Bank += value;
//                                 await Data.save();

//                                 DataUser.Wallet -= value;
//                                 await DataUser.save();

//                                 return interaction.reply({ embeds: [los] });
//                             }

//                             const begLostEmbed = new EmbedBuilder()
//                                 .setColor(client.config.embedEconomy)
//                                 .setTitle(`${client.user.username} Hệ thống kinh tế ${client.config.arrowDownEmoji}`)
//                                 .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}`})
//                                 .addFields({ name: '> Bạn đã cướp và', value: `• ${negativeChoices[negName]} ${value.toLocaleString('vi-VN')} vnd`})  // Thay đổi số tiền sang định dạng vnd
//                                 .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
//                                 .setThumbnail(client.user.avatarURL())
//                                 .setTimestamp();

//                             await interaction.reply({ embeds: [begLostEmbed] });

//                             Data.Wallet += value;
//                             await Data.save();

//                             DataUser.Wallet -= value;
//                             await DataUser.save();
//                         }

//                         timeout.push(interaction.user.id);
//                         setTimeout(() => {
//                             timeout.shift();
//                         }, 60000);
//                     break;

//             }
//         } catch (error) {
//             console.error(`Đã xảy ra lỗi khi thực thi lệnh ${sub}:`, error);
//             await interaction.reply({ content: 'Đã xảy ra lỗi! Thử lại sau', ephemeral: true });
//         }
//     }
// }



// BỎ