const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economySystem = require('../../schemas/economySystem');
const economyCK = require('../../schemas/economyck')
const config = require(`../../config`);
const { checkOwner } = require(`../../permissionCheck`)
const moment = require('moment-timezone');
const CommandStatus = require('../../schemas/Command_Status');

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('🔹 Kinh tế BRB STUDIO.')
        .addSubcommand(command => command.setName('great-account').setDescription('🔹 Tạo tài khoản kinh tế'))
        .addSubcommand(command => command.setName('delete').setDescription('🔹 Xóa tài khoản tiết kiệm của người dùng').addUserOption(op => op.setName('account').setDescription('Chọn người dùng để xóa tài khoản').setRequired(true)))
        .addSubcommand(command => command.setName('view-account').setDescription('🔹 Xem số dư và thông tin tài khoản nền kinh tế của bạn.'))
        .addSubcommand(command => command.setName('deposit-account').setDescription('🔹 Gửi tiền từ ví của bạn vào ngân hàng.').addStringOption(op => op.setName('amount').setDescription('Số tiền gửi').setRequired(true)))
        .addSubcommand(command => command.setName('daily-account').setDescription('🔹 số tiền hỗ trợ hàng ngày của bạn'))
        .addSubcommand(command => command.setName('ask-money').setDescription('🔹 Xin tiền'))
        .addSubcommand(command => command.setName('gamble').setDescription('🔹 Đánh bạc để thắng hoặc thua tiền').addStringOption(op => op.setName('amount').setDescription('Số tiền đánh bạc (mặc định = 500)').setRequired(false)))
        .addSubcommand(command => command.setName('work').setDescription('🔹 Làm việc để kiếm tiền'))
        .addSubcommand(command => command.setName('withdraw-money').setDescription('🔹 Rút tiền từ ngân hàng về ví').addStringOption(op => op.setName('amount').setDescription('Số tiền cần rút').setRequired(true)))
        .addSubcommand(command => command.setName('rob').setDescription('🔹 Cướp tiền một người').addUserOption(op => op.setName('user').setDescription('Chọn người dùng bạn muốn cướp').setRequired(true)))
        .addSubcommand(command => command.setName('ck').setDescription('🔹 Chuyển khoản cho người dùng khác').addUserOption(op => op.setName('user').setDescription('Người nhận').setRequired(true)).addStringOption(op => op.setName('amount').setDescription('Số tiền chuyển').setRequired(true)).addStringOption(op => op.setName('nd').setDescription('Nội dung chuyển khoản').setRequired(true)).addStringOption(op => op.setName('id').setDescription('ID máy chủ (tùy chọn)')))
        .addSubcommand(command => command.setName('transaction-history').setDescription('🔹 Xem lịch sử giao dịch chuyển khoản của bạn (30 ngày gần nhất)')),

    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/economy' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const { options, guild, user } = interaction;

        // Ghi lại thông tin người dùng và guild
        // console.log(`User: ${user.id}, Guild: ${guild.id}`);
        
        let data = await economySystem.findOne({ Guild: guild.id, User: user.id });
        // console.log('Tìm dữ liệu tài khoản:', data);
        
        const sub = options.getSubcommand();
        // console.log(`Subcommand được thực thi: ${sub}`);

        try {
            switch (sub) {
            case "great-account":
                    if (data) {
                        // console.log("Tài khoản đã tồn tại.");
                        return await interaction.reply({ content: "Bạn đã có tài khoản phổ thông!", ephemeral: true });
                    } else {
                        // console.log("Tạo tài khoản mới.");
                try {        
                        await economySystem.create({
                            Guild: guild.id,
                            User: user.id,
                            Bank: 5000,
                            Wallet: 5000,
                            Worked: 0,
                            Gambled: 0,
                            Begged: 0,
                            HoursWorked: 0,
                            CommandsRan: 0,
                            Moderated: 0
                        });
                    } catch (error) {
                        // console.error("Lỗi khi tạo tài khoản:", error);
                        return await interaction.reply({ content: "Đã xảy ra lỗi khi tạo tài khoản!", ephemeral: true });
                    }

                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                            .setColor(config.embedCyan)
                            .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                            .setThumbnail(client.user.displayAvatarURL())
                            .setDescription(
                                `Bạn đã tạo tài khoản kinh tế, bạn đã được thưởng:\n\n` +
                                `• 5.000 <a:xu:1320563128848744548> -> 🏦\n` +
                                `• 5.000 <a:xu:1320563128848744548> -> 💵\n\n` +
                                `__Dùng lệnh \`/economy view-account \` để xem số dư và thông tin của bạn.__`)
                            .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                            .setTimestamp();

                        await interaction.reply({ embeds: [embed] });
                    }
                    break;

            
            // case "ck":
            //         const receiver = options.getUser('user');
            //         let amountStringCK = options.getString('amount');
            //         let amountCK = parseFloat(amountStringCK.replace(/\./g, ''));
            //         const contentCK = options.getString('nd');

            //         if (isNaN(amountCK) || amountCK <= 0) 
            //             return await interaction.reply({ content: "Số tiền không hợp lệ! Hãy dùng cách viết ```1.000```", ephemeral: true });

            //         // Kiểm tra nếu người gửi và người nhận là cùng một người
            //         if (receiver.id === user.id) 
            //             return await interaction.reply({ content: "Bạn không thể chuyển tiền cho chính mình!", ephemeral: true });

            //         // Tìm dữ liệu người gửi
            //         let senderData = await economySystem.findOne({ Guild: guild.id, User: user.id });
            //         if (!senderData) 
            //             return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng `/economy great-account`", ephemeral: true });

            //         // Tìm dữ liệu người nhận
            //         let receiverData = await economySystem.findOne({ Guild: guild.id, User: receiver.id });
            //         if (!receiverData) 
            //             return await interaction.reply({ content: "Người nhận chưa có tài khoản phổ thông được tạo.", ephemeral: true });

            //         // Tính phí 10% số tiền chuyển
            //         const transferFee = Math.ceil(amountCK * 0.1); // Làm tròn lên để đảm bảo không có lỗi làm tròn
            //         const totalAmount = amountCK + transferFee;   // Tổng số tiền bị trừ của người gửi

            //         // Kiểm tra số dư của người gửi
            //         if (senderData.Bank < totalAmount) 
            //             return await interaction.reply({ 
            //                 content: `Bạn không đủ tiền để thực hiện giao dịch.\nSố dư hiện tại của bạn: **${senderData.Bank.toLocaleString('vi-VN')} vnd**\nCần thiết: **${totalAmount.toLocaleString('vi-VN')} vnd** (bao gồm phí chuyển khoản 10%).`, 
            //                 ephemeral: true 
            //             });

            //         // Thực hiện giao dịch
            //         // senderData.Bank -= amountCK;
            //         // receiverData.Bank += amountCK;
            //         senderData.Bank -= totalAmount; // Trừ tổng tiền của người gửi
            //         receiverData.Bank += amountCK; // Cộng tiền thực nhận cho người nhận
            //         await senderData.save();
            //         await receiverData.save();

            //         // Lấy thời gian chuyển khoản theo định dạng mong muốn
            //         const transferTime = moment().tz("Asia/Ho_Chi_Minh").format('HH:mm:ss DD/MM/YYYY');

            //         await economyCK.create({
            //             Guild: guild.id,
            //             GuildName: guild.name,
            //             SenderID: user.id,            // ID người gửi
            //             SenderName: user.displayName,     // Tên người gửi
            //             ReceiverID: receiver.id,       // ID người nhận
            //             ReceiverName: receiver.displayName, // Tên người nhận
            //             Amount: amountCK,              // Số tiền chuyển
            //             Content: contentCK,             // Nội dung chuyển khoản
            //             Description: 
            //                 `${user.displayName} chuyển khoản cho ${receiver.displayName} với số tiền ${amountCK.toLocaleString('vi-VN')} vnd\n` +
            //                 `Nội dung: ${contentCK}\nPhí giao dịch: ${transferFee.toLocaleString('vi-VN')} vnd.`, // Thêm mô tả rõ ràng
            //             TransferTime: transferTime
            //         });

            //         const embedCK = new EmbedBuilder()
            //             .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
            //             .setTitle(`Chuyển khoản thành công`)
            //             .setThumbnail(client.user.displayAvatarURL())
            //             .setColor(config.embedGreen)
            //             .setDescription(`> Bạn đã chuyển thành công **${amountCK.toLocaleString('vi-VN')} vnd** tới tài khoản của ${receiver.username}.\n\n• Dùng \`/economy view-account\` để xem thông tin mới của bạn.`)
            //             .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
            //             .setTimestamp();
            
            //         await interaction.reply({ embeds: [embedCK] });

            //         const embedReceiver = new EmbedBuilder()
            //             .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
            //             .setTitle(`Bạn đã nhận được chuyển khoản`)
            //             .setThumbnail(client.user.displayAvatarURL())
            //             .setColor(config.embedGreen)
            //             .setDescription(`> Bạn đã nhận được số tiền là **${amountCK.toLocaleString('vi-VN')} vnd** từ tài khoản ${interaction.user.username}\nNội dung: ${contentCK}.\n\n• Dùng \`/economy view-account\` để xem thông tin mới của bạn.`)
            //             .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
            //             .setTimestamp();

            //             try {
            //                 await receiver.send({ embeds: [embedReceiver] });
            //             } catch (error) {
            //                 console.error("Không thể gửi tin nhắn cho người nhận:", error);
            //             }
            //         break;
            
            
            case "ck":
                    const receiver = options.getUser('user');
                    let amountStringCK = options.getString('amount');
                    let amountCK = parseFloat(amountStringCK.replace(/\./g, ''));
                    const contentCK = options.getString('nd');
                    const customGuildId = options.getString('id'); // ID máy chủ tùy chọn

                    if (isNaN(amountCK) || amountCK <= 0) 
                        return await interaction.reply({ content: "Số tiền không hợp lệ! Hãy dùng cách viết ```1.000```", ephemeral: true });

                    if (receiver.id === user.id) 
                        return await interaction.reply({ content: "Bạn không thể chuyển tiền cho chính mình!", ephemeral: true });

                    // Luôn kiểm tra dữ liệu người gửi trong máy chủ hiện tại
                    let senderData = await economySystem.findOne({ Guild: guild.id, User: user.id });
                    if (!senderData) 
                        return await interaction.reply({ content: `Bạn chưa có tài khoản trong máy chủ **${guild.name}**, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account\`.`, ephemeral: true });

                    // Tìm dữ liệu người nhận trong máy chủ mục tiêu tùy chọn (hoặc máy chủ hiện tại nếu không có ID tùy chọn)
                    const targetGuildId = customGuildId ? customGuildId : guild.id;
                    let receiverData = await economySystem.findOne({ Guild: targetGuildId, User: receiver.id });
                    if (!receiverData) 
                        return await interaction.reply({ content: "Người nhận chưa có tài khoản phổ thông được tạo.", ephemeral: true });

                    const transferFee = Math.ceil(amountCK * 0.1); 
                    const totalAmount = amountCK + transferFee;

                    if (senderData.Bank < totalAmount) 
                        return await interaction.reply({ 
                            content: 
                                `Bạn không đủ tiền để thực hiện giao dịch.\n` +
                                `Số dư hiện tại của bạn: **${senderData.Bank.toLocaleString('vi-VN')} <a:xu:1320563128848744548>**\n` +
                                `Cần có: **${totalAmount.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** (bao gồm phí chuyển khoản 10%).`, 
                            ephemeral: true 
                        });

                    // Thực hiện giao dịch
                    senderData.Bank -= totalAmount;
                    receiverData.Bank += amountCK;
                    await senderData.save();
                    await receiverData.save();

                    const transferTime = moment().tz("Asia/Ho_Chi_Minh").format('HH:mm:ss DD/MM/YYYY');

                    await economyCK.create({
                        Guild: targetGuildId,
                        GuildName: guild.name,
                        SenderID: user.id,
                        SenderName: user.displayName,
                        ReceiverID: receiver.id,
                        ReceiverName: receiver.displayName,
                        Amount: amountCK,
                        Content: contentCK,
                        Description: 
                            `${user.displayName} chuyển khoản cho ${receiver.displayName} với số tiền ${amountCK.toLocaleString('vi-VN')} <a:xu:1320563128848744548>\n` +
                            `Nội dung: ${contentCK}\n` +
                            `Phí giao dịch: ${transferFee.toLocaleString('vi-VN')} <a:xu:1320563128848744548>.`,
                        TransferTime: transferTime
                    });

                    const embedCK = new EmbedBuilder()
                        .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                        .setTitle(`Chuyển khoản thành công`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(config.embedGreen)
                        .setDescription(
                            `> Bạn đã chuyển thành công **${amountCK.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** tới tài khoản của ${receiver.displayName}.\n\n` +
                            `> Phí ck: 10% \n\n` +
                            `• Dùng \`/economy view-account\` để xem thông tin mới của bạn.`
                        )
                        .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                        .setTimestamp();

                    await interaction.reply({ embeds: [embedCK] });

                    const embedReceiver = new EmbedBuilder()
                        .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                        .setTitle(`Bạn đã nhận được chuyển khoản`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(config.embedGreen)
                        .setDescription(
                            `> Tài khoản của bạn đã nhận được **${amountCK.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** từ ${user.displayName}.\n\n` +
                            `• Nội dung: \`${contentCK}\`\n• Dùng \`/economy view-account\` để xem thông tin mới của bạn.`
                        )
                        .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                        .setTimestamp();
                    
                    await receiver.send({ embeds: [embedReceiver] });

                    break;


            case "transaction-history":
                    // Lấy thời gian hiện tại
                    const now = moment().tz("Asia/Ho_Chi_Minh");

                    // Tìm giao dịch chuyển khoản của người dùng trong 30 ngày gần nhất
                    const recentTransactions = await economyCK.find({
                        Guild: guild.id,
                        SenderID: user.id,
                    })

                    if (recentTransactions.length === 0) {
                        return await interaction.reply({ content: "Không có lịch sử giao dịch nào trong 30 ngày gần nhất.", ephemeral: true });
                    }

                    // Tạo Embed để hiển thị lịch sử giao dịch
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Lịch sử giao dịch - ${client.config.DevBy}` })
                        .setTitle(`Lịch sử giao dịch của bạn trong 30 ngày qua`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(config.embedCyan)
                        .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                        .setTimestamp();

                    // Duyệt qua từng giao dịch và thêm vào embed
                    recentTransactions.forEach(transaction => {
                        embed.addFields({
                            name: `Giao dịch với ${transaction.ReceiverName}`,
                            value: `Số tiền: ${transaction.Amount.toLocaleString('vi-VN')} <a:xu:1320563128848744548>\nNội dung: ${transaction.Content}\nThời gian: ${transaction.TransferTime}`,
                            inline: false
                        });
                    });

                    // Gửi thông tin lịch sử giao dịch
                    await interaction.reply({ embeds: [embed] });
                    break;


            case "delete":

                    // quyền chủ sở hữu mới được dùng lệnh delete
                    const hasPermission = await checkOwner(interaction);
                    if (!hasPermission) return;
                    
                    // Lấy thông tin người dùng muốn xóa tài khoản
                    const targetUser = options.getUser('account');
                    const targetData = await economySystem.findOne({ Guild: guild.id, User: targetUser.id });

                    if (!targetData) {
                        return await interaction.reply({ content: `Tài khoản của người dùng này không tồn tại.`, ephemeral: true });
                    }

                    // Xóa dữ liệu tài khoản người dùng
                    await economySystem.deleteOne({ Guild: guild.id, User: targetUser.id });

                    const deleted = new EmbedBuilder()
                        .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                        .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                        .setTimestamp()
                        .setColor(config.embedRed)
                        .setDescription(`> Tài khoản của người dùng **${targetUser.displayName}** đã bị **xóa**.`);

                    await interaction.reply({ embeds: [deleted] });

                    break;

            case "view-account":
                    if (!data) return await interaction.reply({ content: "Không tìm thấy tài khoản phổ thông, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account \`", ephemeral: true });

                    else {
                        const formattedBank = data.Bank.toLocaleString('vi-VN');
                        const formattedWallet = data.Wallet.toLocaleString('vi-VN');
                        const totalAmount = (data.Wallet + data.Bank).toLocaleString('vi-VN');
                        
                        const embed = new EmbedBuilder()
                        .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                        .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                        .setDescription(`> Đây là thông tin tài khoản của bạn:`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(config.embedGreen)
                        .addFields(
                            { name: "Tài khoản vãng lai", value: [
                                `• 🏦 **${formattedBank} <a:xu:1320563128848744548>** Trong ngân hàng`, 
                                `• 💵 **${formattedWallet} <a:xu:1320563128848744548>** Bằng tiền mặt`, 
                                `• 💰 **${totalAmount} <a:xu:1320563128848744548>** Tổng thể`
                            ].join("\n"), inline: false },
                            { name: "Khu vực cá nhân", value: [
                                `• 🧑‍💻 **${data.CommandsRan}** {/} lần gửi và rút tiền`, 
                                `• 🛠️ **${data.Moderated}** lần (kiểm duyệt)`, 
                                `• 🙏 **${data.Begged}** lần xin tiền`, 
                                `• 👷 **${data.Worked}** lần làm việc (${data.HoursWorked} h)`, 
                                `• 🎰 **${data.Gambled}** lần đánh bạc`
                            ].join("\n"), inline: false }
                        )
                        .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                        .setTimestamp();

                        await interaction.reply({ embeds: [embed] });
                    }
                    break;


            case "deposit-account": 
                    if (!data) return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng `/economy great-account`", ephemeral: true });

                    // Nhận giá trị từ tham số và chuyển đổi thành số
                    let amountString = options.getString('amount'); // Nhận giá trị dưới dạng chuỗi
                    let amount = parseFloat(amountString.replace('.', '')); // Thay thế dấu chấm để chuyển đổi thành số

                    // Kiểm tra nếu số tiền là một số hợp lệ
                    if (isNaN(amount) || amount <= 0) {
                        return await interaction.reply({ content: "Số tiền gửi không hợp lệ!", ephemeral: true });
                    }

                    if (data.Wallet < amount) {
                        return await interaction.reply({ 
                            content:
                                `Bạn đang cố gắng gửi tiền ${amountString} <a:xu:1320563128848744548> ` +
                                `trong khi bạn chỉ có ${data.Wallet.toLocaleString('vi-VN')} <a:xu:1320563128848744548> có sẵn để gửi...`, 
                            ephemeral: true 
                        });
                    }

                    // Cập nhật số dư
                    data.Wallet -= amount; // Sử dụng amount đã tính toán
                    data.Bank += amount; // Cập nhật số tiền vào ngân hàng
                    data.CommandsRan += 1;
                    await data.save();

                    // Tạo Embed để trả lời
                    const embedDeposit = new EmbedBuilder()
                        .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                        .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.config.embedGreen)
                        .setDescription(
                            `> Bạn đã gửi tiền thành công **${amountString} <a:xu:1320563128848744548>** vào ví của bạn \n\n` +
                            `• dùng \`/economy view-account\` để xem thông tin mới của bạn.`
                        )
                        .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                        .setTimestamp();

                    // Trả lời với Embed đã định dạng
                    await interaction.reply({ embeds: [embedDeposit] });
                    break;


            case "daily-account":
                    if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: "Hôm nay bạn đã sử dụng \`/daily\` rồi. Hãy quay lại sau **24 h**", ephemeral: true });

                    if (!data) return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account \`", ephemeral: true });
                    else {
                        const randAmount = Math.round((Math.random() * 900) + 10);

                        data.Bank += randAmount;
                        data.CommandsRan += 1;
                        data.save();

                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                            .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor(client.config.embedGreen)
                            .setDescription(`> Bạn đã nhận được số tiền hỗ trợ hàng ngày của mình!\n\n• Số lượng: **$${randAmount}**\n• Thời gian nhận tiếp sau: **24 h**`)
                            .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                            .setTimestamp();

                        await interaction.reply({ embeds: [embed] });

                        timeout.push(interaction.user.id);
                        setTimeout(() => {
                            timeout.shift();
                        }, 86400000);
                    }
                    break;


            case "ask-money":
                         // Kiểm tra người dùng có tài khoản hay chưa
                        if (!data) {
                            return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng `/economy great-account`", ephemeral: true });
                        }

                        // Kiểm tra nếu người dùng đã xin tiền gần đây (timeout)
                        if (timeout.includes(user.id)) {
                            return await interaction.reply({ content: "Hãy quay lại sau **2 tiếng** để xin tiền!", ephemeral: true });
                        }

                        // Random số tiền xin
                        const randAmount = Math.round((Math.random() * 1000) + 100); // Random từ 100 đến 1100 vnd
                        const success = Math.random() > 0.5; // 50% thành công hoặc thất bại

                        if (success) {
                            // Thêm tiền vào ngân hàng
                            data.Bank += randAmount;
                            data.CommandsRan += 1;
                            await data.save();

                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                                .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                                .setDescription(
                                    `> Bạn vừa xin tiền và đã **thành công**:\n\n` +
                                    `→ Số tiền đã xin: **${randAmount} <a:xu:1320563128848744548>**\n` +
                                    `• Thời gian xin tiếp theo: **10 giờ**`
                                )
                                .setFooter({ text: `1 phút nữa quay lại và dùng \`/economy ask-money\`` })
                                .setColor(client.config.embedGreen)
                                .setTimestamp()
                                .setThumbnail(client.user.displayAvatarURL());

                            await interaction.reply({ embeds: [embed] });
                        } else {
                            data.CommandsRan += 1;
                            await data.save();
                            const embed1 = new EmbedBuilder()
                                .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                                .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                                .setDescription(
                                    `> Bạn vừa xin tiền nhưng không **thành công**, bạn sẽ không nhận được bất kì đồng tiền nào:\n\n` +
                                    `→ Số tiền đã xin: **0 <a:xu:1320563128848744548>**\n` +
                                    `• Thời gian xin tiếp theo: **10 giờ**`)
                                .setFooter({ text: `1 phút nữa quay lại và dùng \`/economy ask-money\`` })
                                .setColor(client.config.embedGreen)
                                .setTimestamp()
                                .setThumbnail(client.user.displayAvatarURL());

                            await interaction.reply({ embeds: [embed1] });
                        }

                            // Thêm người dùng vào timeout
                            timeout.push(user.id);
                            setTimeout(() => {
                                // Xóa người dùng khỏi timeout sau 10 tiếng
                                timeout = timeout.filter(id => id !== user.id);
                            }, 7200000); // 2 tiếng
                            
                        break;
                    
                        case "gamble":
                            if (timeout.includes(interaction.user.id)) {
                                return await interaction.reply({ content: "Hãy quay lại sau **5 phút** để đánh bạc nhiều hơn!", ephemeral: true });
                            }

                            // Nhận giá trị từ tham số và chuyển đổi thành số
                            let amountString1 = options.getString('amount') || '500'; // Nhận giá trị dưới dạng chuỗi
                            let amount1 = parseFloat(amountString1.replace('.', '')); // Thay thế dấu chấm để chuyển đổi thành số

                            // Kiểm tra nếu số tiền là một số hợp lệ
                            if (isNaN(amount1) || amount1 <= 0) {
                                return await interaction.reply({ content: "Số tiền không hợp lệ! hãy dùng cách viết ```1.000```", ephemeral: true });
                            }

                            if (!data) {
                                return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng `/economy great-account`", ephemeral: true });
                            } else {
                                if (data.Wallet < amount1) {
                                    return await interaction.reply({ 
                                        content: 
                                            `Bạn chỉ có **${data.Wallet.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** trong ví của bạn, ` +
                                            `hãy làm việc chăm chỉ để kiếm thêm tiền :))...`, 
                                        ephemeral: true 
                                    });
                                }

                                // const acca = [
                            //     0.4, 0.8, 0.9, 0.5, 0.2, 0.3, 0.1, 0.6, 0.7, 0.3, // Các giá trị thua (10 phần tử)
                            //     1, 1, 1,                                           // Không thắng không thua (3 phần tử)
                            //     2, 2.5, 3, 5, 10                                   // Các giá trị thắng (4 phần tử)
                            // ];
                    
                            // const acca = [0.4, 0.8, 0.9, 0.5, 0.2, 0.3, 0.1, 0.6, 0.7, 0.3, 0.4, 0.8, 1, 5, 2.1, 1.6, 10, 2, 0.9, 1.1, 0, 0, 1, 2, 3, 0.2, 0.3, 0.4, 1.2, 0.3, 0.35, 0, 8, 0.2, 0.5, 0, 0.1, 2.5, 1.8, 0.4, 0.8, 1, 5, 2.1, 1.6, 10, 2, 0.9, 1.1, 0, 0, 1, 2, 3, 0.1, 2.5, 1.8, 100];



                                const acca = [0.4, 0.8, 0.9, 0.5, 0.2, 0.3, 0.1, 0.6, 0.4, 1, 1, 2, 3, 5, 0.8, 0.9, 0.5, 0.2, 0.3, 0.1, 0.6, 0.4, 0.8, 0.9, 0.5, 0.2, 0.3, 0.1, 0.6, 0.7, 0.3, 1, 1, 2, 3, 5];

                                const jobPick = acca[Math.floor(Math.random() * acca.length)];

                                let choice;
                                let winorlose;

                                if (jobPick === 1) {
                                    return await interaction.reply({ content: "Bạn không *thắng* hay *thua*" });
                                }

                                if (jobPick < 1) {
                                    choice = "Thua";
                                    winorlose = amount1

                                    if (winorlose > amount1 * 4) {
                                        winorlose = amount1 * 4;
                                    }

                                    data.Wallet -= winorlose; // Trừ số tiền bị mất khỏi ví
                                } else {
                                    choice = "Thắng";
                                    winorlose = amount1 * jobPick;
                                    data.Wallet += (winorlose - amount1); // Thêm số tiền thắng vào ví
                                }

                                data.Gambled += 1;
                                data.CommandsRan += 1;
                                await data.save();

                                const embed = new EmbedBuilder()
                                    .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                                    .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                                    .setThumbnail(client.user.displayAvatarURL())
                                    .setDescription(
                                        `Bạn vừa đánh bạc **${amountString1} <a:xu:1320563128848744548>** và **${choice}**\n\n` +
                                        `💵 Số tiền đánh bạc: **${amountString1} <a:xu:1320563128848744548>**\n` +
                                        `🎰 Tích lũy: **${jobPick}**\n\n` +
                                        `${choice === "Thắng" 
                                            ? `🎉 Tổng cộng Thắng: ${winorlose.toLocaleString('vi-VN')} <a:xu:1320563128848744548>` 
                                            : `💸 Bạn đã mất: ${winorlose.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`}`
                                        )
                                    .setFooter({ text: `Quay lại sau 5 phút và dùng \`/economy gamble\`` })
                                    .setColor(config.embedGold)
                                    .setTimestamp();

                                await interaction.reply({ embeds: [embed] });

                                // Đặt thời gian chờ cho lệnh gamble
                                timeout.push(interaction.user.id);
                                setTimeout(() => {
                                    timeout.shift();
                                }, 6000); // 5 phút 300000
                            }
                            break;
                
            case "work":
                    if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: "hãy quay lại sau **5 phút** để làm việc lại!", ephemeral: true });

                    if (!data) return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account\`", ephemeral: true });
                    else {
                        const jobs = [
                            "Valheim",
                            "LMHT",
                            "Xây dựng nhà Valheim",
                            "Xây dựng map",
                            "Game thủ",
                            "Người sáng tạo",
                            "Streamer",
                            "Quan hệ công chúng",
                            "Quản lý",
                            "Câu 10 cá vip",
                            "Câu 25 cá condo"
                        ];

                        const jobPick = jobs[Math.floor(Math.random() * jobs.length)];

                        const amount = Math.round((Math.random() * 10000) + 10);

                        const hours = Math.round((Math.random() * 15) + 8);

                        const pph = Math.round(amount / hours);

                        data.Bank += amount;
                        data.Worked += 1;
                        data.HoursWorked += hours;
                        data.CommandsRan += 1;
                        data.save();

                        // Định dạng lại amount và pph theo kiểu VND
                        const formattedAmount = amount.toLocaleString('vi-VN');
                        const formattedPPH = pph.toLocaleString('vi-VN');

                        const embed = new EmbedBuilder()
                        .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                        .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setDescription(
                            `Bạn đã làm việc với tư cách **${jobPick}**\n\n` +
                            `→ Số giờ đã làm việc: **${hours}** giờ\n` +
                            `^ Trả lương trong ngày: **${formattedAmount} <a:xu:1320563128848744548>**\n` +
                            `→ Trả lương mỗi giờ: **${formattedPPH} <a:xu:1320563128848744548>**`)
                        .setFooter({ text: `Hãy quay lại sau 5 phút và dùng \`/economy work\`` })
                        .setColor(config.embedGold)
                        .setTimestamp()

                        await interaction.reply({ embeds: [embed] });

                        timeout.push(interaction.user.id);
                        setTimeout(() => {
                            timeout.shift();
                        }, 300000);
                    }
                    break;


                case "withdraw-money":
                            // Nhận giá trị từ tham số và chuyển đổi thành số
                            let amountString2 = options.getString('amount');
                            let amount2 = parseFloat(amountString2.replace(/\./g, '')); // Thay thế dấu chấm để chuyển đổi thành số
                            
                            // Kiểm tra nếu số tiền là một số hợp lệ
                            if (isNaN(amount2) || amount2 <= 0) {
                                return await interaction.reply({ content: "Số tiền không hợp lệ! Hãy dùng cách viết ```1.000```", ephemeral: true });
                            }
                        
                            if (!data) {
                                return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng \`/economy great-account\`", ephemeral: true });
                            } else {
                                if (data.Bank < amount2) {
                                    return await interaction.reply({ 
                                        content: 
                                            `Bạn đang cố gắng rút **${amount2.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** ` +
                                            `trong khi bạn chỉ có sẵn **${data.Bank.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** để thực hiện việc đó...`, 
                                        ephemeral: true 
                                    });
                                }
                        
                                data.Bank -= amount2;
                                data.Wallet += amount2;
                                data.CommandsRan += 1;
                                await data.save();
                        
                                const embed = new EmbedBuilder()
                                    .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}` })
                                    .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                                    .setThumbnail(client.user.displayAvatarURL())
                                    .setColor(client.config.embedGreen)
                                    .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                                    .setDescription(
                                        `Bạn đã rút thành công **${amount2.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** về ví của mình \n\n` +
                                        `Chạy \`/economy view-account\` để xem thông tin mới của bạn.`
                                    )
                                    .setTimestamp();
                        
                                await interaction.reply({ embeds: [embed] });
                            }
                            break;

                    
            case "rob":
                        if (timeout.includes(interaction.user.id)) 
                            return await interaction.reply({ content: 'Bạn cần đợi **1 phút** để cướp lại người dùng khác', ephemeral: true });

                        const userStealing = options.getUser('user');

                        let Data = await economySystem.findOne({ Guild: guild.id, User: user.id });
                        let DataUser = await economySystem.findOne({ Guild: guild.id, User: userStealing.id });

                        if (!Data) 
                            return await interaction.reply({ content: "Bạn chưa có tài khoản, hãy tạo một tài khoản bằng cách sử dụng `/economy great-account`", ephemeral: true });
                        if (userStealing == interaction.user) 
                            return await interaction.reply({ content: 'Bạn **không thể** cướp chính mình!', ephemeral: true });
                        if (!DataUser) 
                            return await interaction.reply({ content: 'Người dùng đó **không** có tài khoản phổ thông được tạo, không có gì để cướp', ephemeral: true });
                        if (DataUser.Wallet <= 0) 
                            return await interaction.reply({ content: 'Người dùng đó **không** có tiền trong ví của họ, không có gì để cướp', ephemeral: true });

                        let negative = Math.round((Math.random() * -150) - 10);
                        let positive = Math.round((Math.random() * 300) - 10);

                        const posN = [negative, positive];

                        const amount3 = Math.round(Math.random() * posN.length);
                        const value = posN[amount3];

                        if (Data.Wallet <= 0) 
                            return await interaction.reply({ content: 'Bạn **không thể** cướp của người này vì ví của bạn có **0 <a:xu:1320563128848744548>** trong đó', ephemeral: true });

                        if (value > 0) {
                            // trộm thành công
                            const positiveChoices = [
                                "Bạn đã ăn trộm",
                                "Người chủ đã nhìn thấy bạn và giúp bạn cướp",
                                "Bạn đã cướp",
                                "Bạn đã lấy",
                                "Bạn đã cướp thành công",
                                "Bạn đánh người đó và lấy",
                                "Bạn cướp người rồi bỏ trốn cùng",
                                "Bạn đã đột nhập vào tài khoản ngân hàng của người đó và lấy",
                            ];

                            const posName = Math.floor(Math.random() * positiveChoices.length);

                            const begEmbed = new EmbedBuilder()
                                .setColor(client.config.embedGreen)
                                .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}`})
                                .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                                .addFields({ name: '> Bạn đã cướp và', value: `• ${positiveChoices[posName]} ${value.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`})  // Thay đổi số tiền sang định dạng vnd
                                .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                                .setThumbnail(client.user.avatarURL())
                                .setTimestamp();

                            await interaction.reply({ embeds: [begEmbed] });

                            Data.Wallet += value;
                            await Data.save();

                            DataUser.Wallet -= value;
                            await DataUser.save();
                        } else if (value < 0) {
                            // trộm thất bại
                            const negativeChoices = [
                                "Bạn bị cảnh sát bắt và bị lạc",
                                "Bạn để lại giấy tờ tùy thân và bị bắt, bạn thua cuộc",
                                "Người đó đánh bạn bất tỉnh và lấy đi",
                                "Người đó nhìn thấy bạn và lấy",
                                "Người đó bắt được bạn và lấy đi",
                                "Người đó đã đánh bạn và lấy đi",
                                "Người đó đã gọi cảnh sát và bạn đã thua cuộc",
                            ];

                            const wal = Data.Wallet;
                            if (isNaN(value)) 
                                return await interaction.reply({ content: 'Người dùng này đã gọi cảnh sát đến bắt bạn nhưng bạn đã bỏ chạy. Bạn không mất hay đạt được gì cả', ephemeral: true });

                            const negName = Math.floor(Math.random() * negativeChoices.length);

                            let nonSymbol;
                            if (value - wal < 0) {
                                const stringV = `${value}`;

                                nonSymbol = await stringV.slice(1);  // Xóa dấu âm từ giá trị số

                                // ví âm tiền
                                const los = new EmbedBuilder()
                                    .setColor(client.config.embedGreen)
                                    .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                                    .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}`})
                                    .addFields({ name: '> Bạn đã cướp và', value: `• ${negativeChoices[negName]} ${nonSymbol.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`})  // Thay đổi số tiền sang định dạng vnd
                                    .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                                    .setThumbnail(client.user.avatarURL())
                                    .setTimestamp();

                                Data.Bank += value;
                                await Data.save();

                                DataUser.Wallet -= value;
                                await DataUser.save();

                                return interaction.reply({ embeds: [los] });
                            }

                            const begLostEmbed = new EmbedBuilder()
                                .setColor(client.config.embedEconomy)
                                .setTitle(`Hệ thống kinh tế của ${client.user.displayName} ${client.config.arrowDownEmoji}`)
                                .setAuthor({ name: `Hệ thống kinh tế ${client.config.DevBy}`})
                                .addFields({ name: '> Bạn đã cướp và', value: `• ${negativeChoices[negName]} ${value.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`})  // Thay đổi số tiền sang định dạng vnd
                                .setFooter({ text: `Kinh tế máy chủ ${guild.name}`, iconURL: guild.iconURL() })
                                .setThumbnail(client.user.avatarURL())
                                .setTimestamp();

                            await interaction.reply({ embeds: [begLostEmbed] });

                            Data.Wallet += value;
                            await Data.save();

                            DataUser.Wallet -= value;
                            await DataUser.save();
                        }

                        timeout.push(interaction.user.id);
                        setTimeout(() => {
                            timeout.shift();
                        }, 60000);
                    break;

            }
        } catch (error) {
            console.error(`Đã xảy ra lỗi khi thực thi lệnh ${sub}:`, error);
            await interaction.reply({ content: 'Đã xảy ra lỗi! Thử lại sau', ephemeral: true });
        }
    }
}
