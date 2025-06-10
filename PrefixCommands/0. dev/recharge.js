const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const economySystem = require('../../schemas/economySystem');
const CommandStatus = require('../../schemas/Command_Status');
const lsntSchema = require('../../schemas/lsntSchema'); // Schema lưu lịch sử
const config = require('../../config');

/*
    ?re list lịch sử nạp tiền
    ?re dsn danh sách nợ
    ?re <id người dùng cần nạp> <số tiền muốn nạp> <id máy chủ cần nạp> nạp tiền cho người dùng
    ?re recall <id người dùng cần thu hồi số tiền> <số tiền muốn thu hồi> <id máy chủ cần thu hồi số tiền> thu hồi số tiền của người dùng
*/

module.exports = {
    name: 'recharge',
    description: '\`🔸 LỆNH DÀNH CHO DEV\`', // Nạp tiền vào tài khoản người chơi hoặc xem lịch sử nạp tiền.
    hd: `\`🔸 Cách dùng: Không có thông tin\``,
    q: `\`🔸 Dành cho DEV\``,
    aliases: ['nt', 'ct'],
    async execute(msg, args) {
        
        // Kiểm tra trạng thái lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?recharge' });

        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        if (!config.specialUsers.includes(msg.author.id)) { 
            return msg.channel.send("Bạn không có quyền sử dụng lệnh này!"); 
        }

        if (args[0].toLowerCase() === 'recall') {

            if (args.length < 4) {
                return msg.channel.send('❌ Vui lòng nhập đúng cú pháp: `?recharge recall <ID người dùng> <số tiền> <ID máy chủ>`.');
            }

            const userId = args[1];
            const amountString = args[2];
            const guildId = args[3];
            const amount = parseFloat(amountString.replace(/\./g, ''));

            if (isNaN(amount) || amount <= 0) {
                return msg.channel.send('❌ Số <a:xu:1320563128848744548> thu hồi không hợp lệ! Vui lòng nhập số <a:xu:1320563128848744548> dương.');
            }

            try {
                // Tìm tài khoản người dùng mục tiêu
                const targetData = await economySystem.findOne({ Guild: guildId, User: userId });

                if (!targetData) {
                    return msg.channel.send(`❌ Người dùng có ID **${userId}** trong máy chủ **${guildId}** không có tài khoản economy.`);
                }

                let remainingAmount = amount; // Số tiền cần thu hồi
                const bankBefore = targetData.Bank; // Tiền trước khi thu hồi
                const walletBefore = targetData.Wallet; // Tiền ví trước khi thu hồi
                const debtBefore = targetData.Debt; // Nợ trước khi thu hồi
                const debtCountBefore = targetData.DebtCount; // Số lần nợ trước khi thu hồi

                // Trừ tiền từ Bank trước
                if (targetData.Bank >= remainingAmount) {
                    targetData.Bank -= remainingAmount;
                    remainingAmount = 0;
                } else {
                    remainingAmount -= targetData.Bank;
                    targetData.Bank = 0;
                }

                // Nếu còn dư, trừ tiếp từ Wallet
                if (remainingAmount > 0) {
                    if (targetData.Wallet >= remainingAmount) {
                        targetData.Wallet -= remainingAmount;
                        remainingAmount = 0;
                    } else {
                        remainingAmount -= targetData.Wallet;
                        targetData.Wallet = 0;
                    }
                }

                // // Nếu không đủ, ghi chú nợ
                // if (remainingAmount > 0) {
                //     targetData.Debt += remainingAmount;
                //     targetData.DebtCount += 1;  // Tăng số lần nợ
                // }

               // Đoạn bổ sung xử lý trừ nợ trong phần `recall`
                if (remainingAmount > 0) {
                    // Người dùng không đủ tiền => Ghi nợ
                    targetData.Debt += remainingAmount;
                    targetData.DebtCount += 1;  // Tăng số lần nợ khi phát sinh nợ mới
                } else {
                    // Trừ nợ nếu có dư nợ trước đó
                    if (targetData.Debt > 0) {
                        const originalDebt = targetData.Debt;
                        targetData.Debt -= Math.min(originalDebt, amount); // Trừ nợ theo số tiền recall

                        // Điều chỉnh số lần nợ nếu hết nợ
                        if (targetData.Debt === 0 && targetData.DebtCount > 0) {
                            targetData.DebtCount -= 1; // Giảm số lần nợ khi xóa hết nợ
                        }
                    }
                }

                // Lưu lại biệt danh và tên máy chủ vào data
                const targetGuild = await msg.client.guilds.fetch(guildId).catch(() => null);
                const targetGuildName = targetGuild ? targetGuild.name : 'Không xác định';
                const member = await msg.guild.members.fetch(userId).catch(() => null);
                const displayName = member ? member.displayName : 'Người dùng không xác định';

                targetData.DisplayName = displayName;
                targetData.GuildName = targetGuildName;

                await targetData.save();

                const channel = `1308473911218016266`

                // Tìm kênh qua ID
                const c = await msg.client.channels.fetch(channel).catch(() => null);

                if (!c || !c.isTextBased()) {
                    return msg.channel.send('❌ Không thể gửi thông báo vì kênh chỉ định không tồn tại hoặc không phải là kênh văn bản.');
                }
                
                // `Đã thu hồi **${amount.toLocaleString('vi-VN')} vnd** từ người dùng có ID **${userId}** trong máy chủ **${guildId}**.`
                // Tạo thông báo Hệ thống thu hồi nợ
                const embed = new EmbedBuilder()
                    .setColor(remainingAmount > 0 ? config.embedRed : config.embedGreen)
                    .setTitle('<a:the_nh:1308507227992227840> THU HỒI <a:xu:1320563128848744548>')
                    .setDescription(
                        `**<a:diamond:1308498026750279760> Tên Máy Chủ:**\n` +
                        `${targetGuildName}(${guildId})\n\n` +
                        `**<a:diamond:1308498026750279760> Tên Người Bị Thu Hồi:**\n` +
                        `${displayName}(${userId})\n\n` +
                        `**<a:thuhoi:1308501772758683648> Số <a:xu:1320563128848744548> Thu Hồi:**\n` +
                        `${amount.toLocaleString('vi-VN')} <a:xu:1320563128848744548>\n\n` +
                        `<a:loading:1308505719133175911><a:loading:1308505719133175911><a:loading:1308505719133175911>` +
                        `<a:loading:1308505719133175911><a:loading:1308505719133175911><a:loading:1308505719133175911>` +
                        `<a:loading:1308505719133175911><a:loading:1308505719133175911><a:loading:1308505719133175911>` +
                        `<a:loading:1308505719133175911><a:loading:1308505719133175911><a:loading:1308505719133175911>` +
                        `<a:loading:1308505719133175911><a:loading:1308505719133175911><a:loading:1308505719133175911>` +
                        `<a:loading:1308505719133175911><a:loading:1308505719133175911><a:loading:1308505719133175911>` +
                        `<a:loading:1308505719133175911><a:loading:1308505719133175911>`
                        // `➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖`
                    )
                    .addFields(
                        { 
                            name: `<:bank:1308501478838767626> Bank trước`, 
                            value: `${bankBefore.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`, 
                            inline: true 
                        },

                        { 
                            name: `<a:money:1308498915989127208> Wallet trước`, 
                            value: `${walletBefore.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`, 
                            inline: true },

                        { 
                            name: `\u200b`, 
                            value: `\u200b`, 
                            inline: true 
                        },

                        { 
                            name: `<a:muitenxuong:1307784555578789988> Bank hiện tại`, 
                            value: `${targetData.Bank.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`, 
                            inline: true 
                        },

                        { 
                            name: `<a:muitenxuong:1307784555578789988> Wallet hiện tại`, 
                            value: `${targetData.Wallet.toLocaleString('vi-VN')} <a:xu:1320563128848744548>`, 
                            inline: true 
                        }
                    )
                    .setFooter({ text: `Hệ thống thu hồi nợ` });

                if (remainingAmount > 0) {
                    embed.addFields({ name: '⚠️ Ghi chú nợ', value: `Người dùng này còn nợ **${remainingAmount.toLocaleString('vi-VN')} <a:xu:1320563128848744548>**.` });
                }

                return c.send({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                return msg.channel.send('❌ Đã xảy ra lỗi khi thu hồi <a:xu:1320563128848744548>.');
            }
        }

        if (args[0].toLowerCase() === 'dsn') {
            try {
                const debts = await economySystem.find({ Debt: { $gt: 0 } });

                if (!debts.length) {
                    return msg.channel.send('✅ Không có người dùng nào còn nợ.');
                }

                const embed = new EmbedBuilder()
                    .setColor(config.embedBlue)
                    .setTitle('📜 Danh sách nợ')
                    .setDescription(debts.map(debt => 
                        `🔸 **Tên người dùng:** ${debt.DisplayName || 'Chưa có biệt danh'}\n` +
                        `🔸 **ID người dùng:** ${debt.User}\n` +
                        `🔸 **Tên Máy chủ:** ${debt.GuildName || 'Không xác định'}\n` +
                        `🔸 **ID máy chủ:** ${debt.Guild}\n` +
                        `**Nợ trước đó:** ${(debt.PreviousDebt || debt.Debt).toLocaleString('vi-VN')} <a:xu:1320563128848744548>\n` +
                        `**Nợ đã bị trừ:** ${((debt.PreviousDebt || debt.Debt) - debt.Debt).toLocaleString('vi-VN')} <a:xu:1320563128848744548>\n` +
                        `**Còn nợ:** ${debt.Debt.toLocaleString('vi-VN')} <a:xu:1320563128848744548>\n` +
                        `**Số lần nợ:** ${debt.DebtCount}`
                    ).join('\n'))
                    .setFooter({ text: `Người yêu cầu: ${msg.author.displayName}`, iconURL: msg.author.displayAvatarURL() })
                    .setTimestamp();

                


                return msg.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                return msg.channel.send('❌ Đã xảy ra lỗi khi kiểm tra danh sách nợ.');
            }
        }

        // Kiểm tra nếu người dùng muốn xem lịch sử
        if (args[0].toLowerCase() === 'list') {
            try {
                // Lấy danh sách lịch sử trong 30 ngày gần nhất
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const history = await lsntSchema.find({ date: { $gte: thirtyDaysAgo } }).sort({ date: -1 });

                if (!history.length) {
                    return msg.channel.send('❌ Không có lịch sử nạp <a:xu:1320563128848744548> nào trong 30 ngày qua.');
                }

                // Chia danh sách thành các trang (mỗi trang tối đa 15 mục)
                const itemsPerPage = 15;
                const totalPages = Math.ceil(history.length / itemsPerPage);

                let currentPage = 0;

                const generateEmbed = (page) => {
                    const embed = new EmbedBuilder()
                        .setColor(config.embedBlue)
                        .setTitle('📜 Lịch sử nạp <a:xu:1320563128848744548> (30 ngày gần nhất)')
                        .setFooter({ 
                            text: `Người yêu cầu: ${msg.author.displayName}                                                            ` +
                            `                                                       Trang ${page + 1}/${totalPages}`, 
                            iconURL: msg.author.displayAvatarURL() 
                        })
                        .setTimestamp();

                    const start = page * itemsPerPage;
                    const end = start + itemsPerPage;
                    const pageItems = history.slice(start, end);

                    pageItems.forEach(entry => {
                        embed.addFields({
                            name: `🔸 ${entry.displayName} (ID: ${entry.UserId})`,
                            value: 
                                `**Số <a:xu:1320563128848744548>:** ${entry.amount.toLocaleString('vi-VN')} <a:xu:1320563128848744548>\n` +
                                `**Máy chủ:** ${entry.GuildName} (ID: ${entry.GuildId})\n` +
                                `**Thời gian:** ${new Date(entry.date).toLocaleString('vi-VN')}`,
                            inline: false
                        });
                    });

                    return embed;
                };

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('◀️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true), // Trang đầu tiên, nút "Trước" bị vô hiệu hóa
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('▶️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(totalPages === 1) // Nếu chỉ có 1 trang, nút "Sau" bị vô hiệu hóa
                    );

                const message = await msg.channel.send({ embeds: [generateEmbed(currentPage)], components: [row] });

                const filter = (interaction) => {
                    return ['prev', 'next'].includes(interaction.customId) && interaction.user.id === msg.author.id;
                };

                const collector = message.createMessageComponentCollector({ filter, time: 60000 });

                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'prev') {
                        currentPage--;
                    } else if (interaction.customId === 'next') {
                        currentPage++;
                    }

                    // Cập nhật trạng thái của các nút
                    row.components[0].setDisabled(currentPage === 0);
                    row.components[1].setDisabled(currentPage === totalPages - 1);

                    await interaction.update({ embeds: [generateEmbed(currentPage)], components: [row] });
                });

                collector.on('end', () => {
                    row.components.forEach(button => button.setDisabled(true));
                    message.edit({ components: [row] }).catch(() => {});
                });

                return;

            } catch (error) {
                console.error(error);
                return msg.channel.send('❌ Đã xảy ra lỗi khi lấy lịch sử.');
            }
        }

        // Nếu không phải "list", "dsn", "recall" xử lý nạp tiền
        if (args.length < 3) {
            return msg.channel.send('❌ Vui lòng nhập đúng cú pháp: `?recharge <ID người dùng> <số tiền> <ID máy chủ>`.');
        }

        const userId = args[0];
        const amountString = args[1];
        const guildId = args[2];
        const amount = parseFloat(amountString.replace(/\./g, ''));

        if (isNaN(amount) || amount <= 0) {
            return msg.channel.send('❌ Số <a:xu:1320563128848744548> nạp không hợp lệ! Vui lòng nhập số <a:xu:1320563128848744548> dương.');
        }

        try {
            // Tìm tài khoản của người dùng mục tiêu
            const targetData = await economySystem.findOne({ Guild: guildId, User: userId });
        
            if (!targetData) {
                return msg.channel.send(`❌ Người dùng có ID **${userId}** trong máy chủ **${guildId}** không có tài khoản economy.`);
            }
        
            // Lấy thông tin chi tiết của máy chủ từ dữ liệu của tài khoản mục tiêu
            const targetGuild = await msg.client.guilds.fetch(guildId).catch(() => null);
            const targetGuildName = targetGuild ? targetGuild.name : 'Máy chủ không xác định';
        
            // Cộng tiền vào Bank
            targetData.Bank += amount;
            await targetData.save();
        
            // Lưu lịch sử vào MongoDB
            await lsntSchema.create({
                UserId: userId,
                GuildId: guildId,
                GuildName: targetGuildName, // Tên máy chủ chính xác từ GuildId
                displayName: msg.guild.members.cache.get(userId)?.displayName || 'Unknown User',
                amount: amount,
                date: new Date()
            });
        
            // Gửi thông báo thành công
            const embed = new EmbedBuilder()
                .setColor(config.embedGreen)
                .setTitle('💳 Nạp <a:xu:1320563128848744548> thành công')
                .setDescription(
                    `Bạn đã nạp **${amount.toLocaleString('vi-VN')} <a:xu:1320563128848744548>** ` +
                    `vào tài khoản của người dùng có ID **${userId}** trong máy chủ **${targetGuildName}**.`
                )
                .setFooter({ text: `Người thực hiện: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
                .setTimestamp();
        
            return msg.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return msg.channel.send('❌ Đã xảy ra lỗi khi thực hiện lệnh.');
        }
    },
};























// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const economySystem = require('../../schemas/economySystem');
// const CommandStatus = require('../../schemas/Command_Status');
// const lsntSchema = require('../../schemas/lsntSchema'); // Schema lưu lịch sử
// const config = require('../../config');

// module.exports = {
//     name: 'recharge',
//     description: 'Nạp tiền vào tài khoản người chơi hoặc xem lịch sử nạp tiền.',
//     aliases: ['re', 'dev66'],
//     async execute(msg, args) {
//         // Kiểm tra trạng thái lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '?recharge' });
//         if (commandStatus && commandStatus.status === 'off') {
//             return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         if (args[0] === 'recall') {
//             if (args.length < 4) {
//                 return msg.channel.send('❌ Vui lòng nhập đúng cú pháp: `?recharge recall <ID người dùng> <số tiền> <ID máy chủ>`.');
//             }

//             const userId = args[1];
//             const amountString = args[2];
//             const guildId = args[3];
//             const amount = parseFloat(amountString.replace(/\./g, ''));

//             if (isNaN(amount) || amount <= 0) {
//                 return msg.channel.send('❌ Số tiền thu hồi không hợp lệ! Vui lòng nhập số tiền dương.');
//             }

//             try {
//                 // Tìm tài khoản người dùng mục tiêu
//                 const targetData = await economySystem.findOne({ Guild: guildId, User: userId });

//                 if (!targetData) {
//                     return msg.channel.send(`❌ Người dùng có ID **${userId}** trong máy chủ **${guildId}** không có tài khoản economy.`);
//                 }

//                 let remainingAmount = amount; // Số tiền cần thu hồi
//                 const bankBefore = targetData.Bank; // Tiền trước khi thu hồi
//                 const walletBefore = targetData.Wallet; // Tiền ví trước khi thu hồi

//                 // Trừ tiền từ Bank trước
//                 if (targetData.Bank >= remainingAmount) {
//                     targetData.Bank -= remainingAmount;
//                     remainingAmount = 0;
//                 } else {
//                     remainingAmount -= targetData.Bank;
//                     targetData.Bank = 0;
//                 }

//                 // Nếu còn dư, trừ tiếp từ Wallet
//                 if (remainingAmount > 0) {
//                     if (targetData.Wallet >= remainingAmount) {
//                         targetData.Wallet -= remainingAmount;
//                         remainingAmount = 0;
//                     } else {
//                         remainingAmount -= targetData.Wallet;
//                         targetData.Wallet = 0;
//                     }
//                 }

//                 // Nếu không đủ, ghi chú nợ
//                 if (remainingAmount > 0) {
//                     targetData.Debt += remainingAmount;
//                 }

//                 await targetData.save();

//                 // Tạo thông báo
//                 const embed = new EmbedBuilder()
//                     .setColor(remainingAmount > 0 ? config.embedRed : config.embedGreen)
//                     .setTitle('💳 Thu hồi tiền')
//                     .setDescription(`Đã thu hồi **${amount.toLocaleString('vi-VN')} vnd** từ người dùng có ID **${userId}** trong máy chủ **${guildId}**.`)
//                     .addFields(
//                         { name: '💰 Bank trước', value: `${bankBefore.toLocaleString('vi-VN')} vnd`, inline: true },
//                         { name: '💵 Wallet trước', value: `${walletBefore.toLocaleString('vi-VN')} vnd`, inline: true },
//                         { name: '🔻 Bank hiện tại', value: `${targetData.Bank.toLocaleString('vi-VN')} vnd`, inline: true },
//                         { name: '🔻 Wallet hiện tại', value: `${targetData.Wallet.toLocaleString('vi-VN')} vnd`, inline: true }
//                     );

//                 if (remainingAmount > 0) {
//                     embed.addFields({ name: '⚠️ Ghi chú nợ', value: `Người dùng này còn nợ **${remainingAmount.toLocaleString('vi-VN')} vnd**.` });
//                 }

//                 return msg.channel.send({ embeds: [embed] });
//             } catch (error) {
//                 console.error(error);
//                 return msg.channel.send('❌ Đã xảy ra lỗi khi thu hồi tiền.');
//             }
//         }

//         if (args[0] === 'baddebt') {
//             try {
//                 const debts = await economySystem.find({ Debt: { $gt: 0 } });

//                 if (!debts.length) {
//                     return msg.channel.send('✅ Không có người dùng nào còn nợ.');
//                 }

//                 const embed = new EmbedBuilder()
//                     .setColor(config.embedBlue)
//                     .setTitle('📜 Danh sách nợ')
//                     .setDescription(debts.map(debt => 
//                         `🔸 **ID người dùng:** ${debt.User}\n**Máy chủ:** ${debt.Guild}\n**Còn nợ:** ${debt.Debt.toLocaleString('vi-VN')} vnd\n`
//                     ).join('\n'))
//                     .setFooter({ text: `Người yêu cầu: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
//                     .setTimestamp();

//                 return msg.channel.send({ embeds: [embed] });
//             } catch (error) {
//                 console.error(error);
//                 return msg.channel.send('❌ Đã xảy ra lỗi khi kiểm tra danh sách nợ.');
//             }
//         }

//         // Kiểm tra nếu người dùng muốn xem lịch sử
//         if (args[0] === 'list') {
//             try {
//                 // Lấy danh sách lịch sử trong 30 ngày gần nhất
//                 const thirtyDaysAgo = new Date();
//                 thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//                 const history = await lsntSchema.find({ date: { $gte: thirtyDaysAgo } }).sort({ date: -1 });

//                 if (!history.length) {
//                     return msg.channel.send('❌ Không có lịch sử nạp tiền nào trong 30 ngày qua.');
//                 }

//                 // Chia danh sách thành các trang (mỗi trang tối đa 15 mục)
//                 const itemsPerPage = 15;
//                 const totalPages = Math.ceil(history.length / itemsPerPage);

//                 let currentPage = 0;

//                 const generateEmbed = (page) => {
//                     const embed = new EmbedBuilder()
//                         .setColor(config.embedBlue)
//                         .setTitle('📜 Lịch sử nạp tiền (30 ngày gần nhất)')
//                         .setFooter({ text: `Trang ${page + 1}/${totalPages} | Người yêu cầu: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
//                         .setTimestamp();

//                     const start = page * itemsPerPage;
//                     const end = start + itemsPerPage;
//                     const pageItems = history.slice(start, end);

//                     pageItems.forEach(entry => {
//                         embed.addFields({
//                             name: `🔸 ${entry.displayName} (ID: ${entry.UserId})`,
//                             value: `**Số tiền:** ${entry.amount.toLocaleString('vi-VN')} vnd\n**Máy chủ:** ${entry.GuildName} (ID: ${entry.GuildId})\n**Thời gian:** ${new Date(entry.date).toLocaleString('vi-VN')}`,
//                             inline: false
//                         });
//                     });

//                     return embed;
//                 };

//                 const row = new ActionRowBuilder()
//                     .addComponents(
//                         new ButtonBuilder()
//                             .setCustomId('prev')
//                             .setLabel('◀️')
//                             .setStyle(ButtonStyle.Primary)
//                             .setDisabled(true), // Trang đầu tiên, nút "Trước" bị vô hiệu hóa
//                         new ButtonBuilder()
//                             .setCustomId('next')
//                             .setLabel('▶️')
//                             .setStyle(ButtonStyle.Primary)
//                             .setDisabled(totalPages === 1) // Nếu chỉ có 1 trang, nút "Sau" bị vô hiệu hóa
//                     );

//                 const message = await msg.channel.send({ embeds: [generateEmbed(currentPage)], components: [row] });

//                 const filter = (interaction) => {
//                     return ['prev', 'next'].includes(interaction.customId) && interaction.user.id === msg.author.id;
//                 };

//                 const collector = message.createMessageComponentCollector({ filter, time: 60000 });

//                 collector.on('collect', async (interaction) => {
//                     if (interaction.customId === 'prev') {
//                         currentPage--;
//                     } else if (interaction.customId === 'next') {
//                         currentPage++;
//                     }

//                     // Cập nhật trạng thái của các nút
//                     row.components[0].setDisabled(currentPage === 0);
//                     row.components[1].setDisabled(currentPage === totalPages - 1);

//                     await interaction.update({ embeds: [generateEmbed(currentPage)], components: [row] });
//                 });

//                 collector.on('end', () => {
//                     row.components.forEach(button => button.setDisabled(true));
//                     message.edit({ components: [row] }).catch(() => {});
//                 });

//                 return;

//             } catch (error) {
//                 console.error(error);
//                 return msg.channel.send('❌ Đã xảy ra lỗi khi lấy lịch sử.');
//             }
//         }

//         // Nếu không phải "list", xử lý nạp tiền
//         if (args.length < 3) {
//             return msg.channel.send('❌ Vui lòng nhập đúng cú pháp: `?recharge <ID người dùng> <số tiền> <ID máy chủ>`.');
//         }

//         const userId = args[0];
//         const amountString = args[1];
//         const guildId = args[2];
//         const amount = parseFloat(amountString.replace(/\./g, ''));

//         if (isNaN(amount) || amount <= 0) {
//             return msg.channel.send('❌ Số tiền nạp không hợp lệ! Vui lòng nhập số tiền dương.');
//         }

//         try {
//             // Tìm tài khoản của người dùng mục tiêu
//             const targetData = await economySystem.findOne({ Guild: guildId, User: userId });
        
//             if (!targetData) {
//                 return msg.channel.send(`❌ Người dùng có ID **${userId}** trong máy chủ **${guildId}** không có tài khoản economy.`);
//             }
        
//             // Lấy thông tin chi tiết của máy chủ từ dữ liệu của tài khoản mục tiêu
//             const targetGuild = await msg.client.guilds.fetch(guildId).catch(() => null);
//             const targetGuildName = targetGuild ? targetGuild.name : 'Máy chủ không xác định';
        
//             // Cộng tiền vào Bank
//             targetData.Bank += amount;
//             await targetData.save();
        
//             // Lưu lịch sử vào MongoDB
//             await lsntSchema.create({
//                 UserId: userId,
//                 GuildId: guildId,
//                 GuildName: targetGuildName, // Tên máy chủ chính xác từ GuildId
//                 displayName: msg.guild.members.cache.get(userId)?.displayName || 'Unknown User',
//                 amount: amount,
//                 date: new Date()
//             });
        
//             // Gửi thông báo thành công
//             const embed = new EmbedBuilder()
//                 .setColor(config.embedGreen)
//                 .setTitle('💳 Nạp tiền thành công')
//                 .setDescription(`Bạn đã nạp **${amount.toLocaleString('vi-VN')} vnd** vào tài khoản của người dùng có ID **${userId}** trong máy chủ **${targetGuildName}**.`)
//                 .setFooter({ text: `Người thực hiện: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
//                 .setTimestamp();
        
//             return msg.channel.send({ embeds: [embed] });
//         } catch (error) {
//             console.error(error);
//             return msg.channel.send('❌ Đã xảy ra lỗi khi thực hiện lệnh.');
//         }
//     },
// };
