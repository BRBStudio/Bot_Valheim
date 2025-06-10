// /*
// ***
//     Events/EventHandling/messageCreateSlash.js
//     Mã này xử lý các tin nhắn được gửi đến trong Discord máy chủ và thực thi lệnh khi có tiền tố
// ***
// */

const { PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
require('dotenv').config(); // Tải biến môi trường từ .env
const fs = require('fs');
const path = require('path');
const Blacklist = require('../../schemas/blacklistSchema');
const Blacklist_dev = require('../../schemas/blacklist_devSchema');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial'); // người dùng đặc biệt
const GuildPrefix = require('../../schemas/GuildPrefix'); // nơi lưu trữ dữ liệu tiền tố
const MessageCount = require('../../schemas/numbermess'); // Import schema đếm tin nhắn
const cooldowns = new Map();

// Danh sách người dùng đặc biệt (ID không bị ảnh hưởng bởi thay đổi tiền tố)
const specialUsers = ['1215380543815024700', '940104526285910046', `933544716883079278`]; // '1215380543815024700', 

async function isGameCommand(command) {
    try {
        const commandPath = path.join(__dirname, '../../PrefixCommands/4. game', `${command.name}.js`);
        return fs.existsSync(commandPath); // Kiểm tra file có tồn tại không
    } catch (error) {
        console.error('Lỗi khi kiểm tra thư mục command:', error);
        return false;
    }
}

module.exports = {
    name: 'messageCreate',
    once: false, // Sự kiện này sẽ xảy ra mỗi khi có tin nhắn mới

    async execute(message, client) {
        if (!message.guild || message.author.bot) return;

        // Đếm và lưu số lượng tin nhắn
        try {
            const { guild, author } = message;

            // Tìm kiếm hoặc tạo mới bản ghi trong MongoDB
            const userMessageData = await MessageCount.findOneAndUpdate(
                { guildId: guild.id, userId: author.id },
                { 
                    $inc: { numberMessages: 1 }, // Tăng số lượng tin nhắn
                    $set: { 
                        guildName: guild.name,
                        displayName: author.displayName,
                    }
                },
                { upsert: true, new: true } // Tạo mới nếu không tìm thấy
            );

            // console.log(`[${guild.name}] ${author.username}: Tổng tin nhắn: ${userMessageData.numberMessages}`);
        } catch (error) {
            console.error('Lỗi khi đếm và lưu tin nhắn:', error);
        }

        // Lấy tiền tố từ cơ sở dữ liệu
        let guildPrefix;
        let isPrefixEnabled = true; // bật tắt lệnh tiền tố
        const defaultPrefix = process.env.PREFIX || '?'; // Sử dụng prefix mặc định nếu không tìm thấy

        try {
            const guildData = await GuildPrefix.findOne({ guildId: message.guild.id });
            guildPrefix = guildData ? guildData.prefix : null; // Nếu không có thay đổi tiền tố, giá trị sẽ là null
            isPrefixEnabled = guildData ? guildData.isPrefixEnabled : true; // bật tắt lệnh tiền tố
        } catch (error) {
            console.error('Lỗi khi lấy tiền tố từ cơ sở dữ liệu:', error);
            guildPrefix = null;
        }

        // if (!isPrefixEnabled) return; // Nếu prefix bị tắt, bỏ qua tin nhắn (bật tắt lệnh tiền tố)
        if (!isPrefixEnabled) {
            try {
                // Truy vấn lại dữ liệu nếu cần
                const guildData = await GuildPrefix.findOne({ guildId: message.guild.id });
                const qq = guildData?.prefix || defaultPrefix; // Nếu không có prefix, dùng mặc định
        
                return message.channel.send(`Lệnh \`${qq}\` đã bị tắt bởi ADM.`);
            } catch (error) {
                console.error('Lỗi khi lấy prefix:', error);
                return message.channel.send(`Lệnh đã bị tắt bởi ADM, nhưng không thể lấy prefix.`);
            }
        } // Nếu prefix bị tắt, bỏ qua tin nhắn (bật tắt lệnh tiền tố)

        // Chuyển nội dung tin nhắn về chữ thường để so sánh
        const messageContent = message.content.trim().toLowerCase();
        const normalizedGuildPrefix = guildPrefix ? guildPrefix.toLowerCase() : null;
        const normalizedDefaultPrefix = defaultPrefix.toLowerCase();

        let startsWithCurrentPrefix = false;

        // Kiểm tra tiền tố với người dùng đặc biệt
        if (specialUsers.includes(message.author.id)) {
            startsWithCurrentPrefix = messageContent.startsWith(normalizedDefaultPrefix) ||
                                      (normalizedGuildPrefix && messageContent.startsWith(normalizedGuildPrefix));
        } else {
            // Kiểm tra tiền tố với người dùng thường
            startsWithCurrentPrefix = guildPrefix
                ? messageContent.startsWith(normalizedGuildPrefix)
                : messageContent.startsWith(normalizedDefaultPrefix);
        }

        // Nếu không bắt đầu với bất kỳ tiền tố nào, bỏ qua tin nhắn
        if (!startsWithCurrentPrefix) return;

        // Kiểm tra blacklist khi sử dụng lệnh prefix
        const blacklist_of_dev = await Blacklist_dev.findOne({ userId: message.author.id });
        if (blacklist_of_dev && !checkPermissions(message.member)) {
            return message.reply({
                content: "Bạn đã bị cấm sử dụng bot vì vi phạm điều luật của bot. Vui lòng liên hệ với Dev để được xóa khỏi danh sách đen.",
                ephemeral: true
            });
        }

        const blacklistedUser = await Blacklist.findOne({ guildId: message.guild.id, userId: message.author.id });
        if (blacklistedUser && !checkPermissions(message.member)) {
            return message.reply({
                content: "Bạn đã bị cấm sử dụng bot vì vi phạm điều luật máy chủ. Vui lòng liên hệ với chủ sở hữu để được xóa khỏi danh sách đen.",
                ephemeral: true
            });
        }

        // Lấy các tham số của lệnh
        const prefixLength = specialUsers.includes(message.author.id)
            ? (messageContent.startsWith(normalizedGuildPrefix) ? normalizedGuildPrefix.length : normalizedDefaultPrefix.length)
            : (guildPrefix ? normalizedGuildPrefix.length : normalizedDefaultPrefix.length);

        const args = messageContent.slice(prefixLength).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Lấy lệnh từ bộ sưu tập
        const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        // Quản lý cooldown và thực thi lệnh
        const now = Date.now();
        const timestamps = cooldowns.get(message.author.id) || {};
        const cooldownAmount = 5 * 1000; // Thời gian chờ là 5 giây

        if (timestamps[commandName] && (now - timestamps[commandName]) < cooldownAmount) {
            const timeLeft = ((timestamps[commandName] + cooldownAmount) - now) / 1000;
            return message.channel.send(`Bạn đã gửi tin nhắn quá nhanh. Vui lòng chờ **${timeLeft.toFixed(1)}** giây.`);
        }

        timestamps[commandName] = now;
        cooldowns.set(message.author.id, timestamps);

        // Kiểm tra xem bot có quyền 'Manage Messages' trên kênh hiện tại không
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send(
                `Bạn cần cấp quyền **Quản lý tin nhắn ( Manage Messages )** cho tôi. Nhưng tốt nhất thì bạn cấp **Người quản lý ( Administrator )** cho tôi\n` +
                `và nếu được hãy để tôi ở vị trí vai trò trên cùng, điều này sẽ giúp tôi hỗ trợ bạn được tốt nhất với tất cả những gì tôi có`
            );
        }

        try {
            message.delete().catch(err => console.error('Không thể xóa tin nhắn:', err));
            command.execute(message, args);

        // // Gửi embed vào kênh nhật ký lệnh
        // const logChannel = client.channels.cache.get('1263108374208446617'); // 1263108374208446617 kênh user-commands trong máy chủ BRB STUDIO
        // if (logChannel) {
        //     const invite = await message.channel.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => null);

        //     const emoji = ':question:';

        //     const embed = new EmbedBuilder()
        //         .setColor('#5865F2')
        //         .setTitle(`${emoji} Nhật ký lệnh prefix`)
        //         .setDescription(`Lệnh: **${commandName}**`)
        //         .addFields(
        //             { name: '👤 Người dùng', value: `${message.member.displayName} (${message.author.id})`, inline: true },
        //             { name: '📢 Kênh', value: `<#${message.channel.id}>`, inline: true },
        //             { name: '🆔 ID Lệnh', value: `\`${commandName}-${message.id}\``, inline: true },
        //             { name: '📌 Arguments', value: args.length ? args.join(' ') : 'Không có', inline: false },
        //             { name: '🕒 Thời gian', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
        //             { name: '🔗 Liên kết mời máy chủ', value: invite ? `${invite.url}` : 'Không thể tạo liên kết', inline: false },
        //         )
        //         .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        //         .setFooter({ text: `ID người dùng: ${message.author.id}` })
        //         .setTimestamp();
            
        //     logChannel.send({ embeds: [embed] });
        // } else {
        //     console.error('Không tìm thấy kênh nhật ký lệnh.');
        // }

        if (await isGameCommand(command)) {
            // console.log(`Lệnh "${commandName}" thuộc thư mục 4. game, gửi nhật ký...`);
        
            const logChannel = client.channels.cache.get('1263108374208446617');
            if (!logChannel) return console.error('Không tìm thấy kênh nhật ký lệnh.');
        
            const invite = await message.channel.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => null);
            // console.log('Tạo lời mời thành công:', invite?.url || 'Không thể tạo liên kết');
        
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle(':question: Nhật ký lệnh prefix')
                .setDescription(`Lệnh: **${commandName}**`)
                .addFields(
                    { name: '👤 Người dùng', value: `${message.member.displayName} (${message.author.id})`, inline: true },
                    { name: '📢 Kênh', value: `<#${message.channel.id}>`, inline: true },
                    { name: '🆔 ID Lệnh', value: `\`${commandName}-${message.id}\``, inline: true },
                    { name: '📌 Arguments', value: args.length ? args.join(' ') : 'Không có', inline: false },
                    { name: '🕒 Thời gian', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
                    { name: '🔗 Liên kết mời máy chủ', value: invite ? `${invite.url}` : 'Không thể tạo liên kết', inline: false },
                )
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `ID người dùng: ${message.author.id}` })
                .setTimestamp();
        
            logChannel.send({ embeds: [embed] });
            // console.log('Đã gửi nhật ký thành công!');
        }


        } catch (error) {
            console.error(error);
            message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh.');
        }
    },
};







// // thay đổi lệnh tiền tố được
// const { PermissionsBitField } = require(`discord.js`)
// require('dotenv').config(); // Tải biến môi trường từ .env
// const GuildPrefix = require('../../schemas/GuildPrefix'); // nơi lưu trữ dữ liệu tiền tố
// const cooldowns = new Map();

// // Danh sách người dùng đặc biệt (ID không bị ảnh hưởng bởi thay đổi tiền tố)
// const specialUsers = ['1215380543815024700', `940104526285910046`];

// module.exports = {
//     name: 'messageCreate',
//     once: false, // Sự kiện này sẽ xảy ra mỗi khi có tin nhắn mới

//     async execute(message, client) {
//         if (!message.guild || message.author.bot) return;

//         // Lấy tiền tố từ cơ sở dữ liệu
//         let guildPrefix;
//         const defaultPrefix = process.env.PREFIX || '?'; // Sử dụng prefix mặc định nếu không tìm thấy

//         try {
//             const guildData = await GuildPrefix.findOne({ guildId: message.guild.id });
//             guildPrefix = guildData ? guildData.prefix : null; // Nếu không có thay đổi tiền tố, giá trị sẽ là null
//         } catch (error) {
//             console.error('Lỗi khi lấy tiền tố từ cơ sở dữ liệu:', error);
//             guildPrefix = null;
//         }

//         // Chuyển nội dung tin nhắn về chữ thường để so sánh
//         const messageContent = message.content.trim().toLowerCase();
//         const normalizedGuildPrefix = guildPrefix ? guildPrefix.toLowerCase() : null;
//         const normalizedDefaultPrefix = defaultPrefix.toLowerCase();

//         let startsWithCurrentPrefix = false;

//         // Kiểm tra tiền tố với người dùng đặc biệt
//         if (specialUsers.includes(message.author.id)) {
//             startsWithCurrentPrefix = messageContent.startsWith(normalizedDefaultPrefix) ||
//                                       (normalizedGuildPrefix && messageContent.startsWith(normalizedGuildPrefix));
//         } else {
//             // Kiểm tra tiền tố với người dùng thường
//             startsWithCurrentPrefix = guildPrefix
//                 ? messageContent.startsWith(normalizedGuildPrefix)
//                 : messageContent.startsWith(normalizedDefaultPrefix);
//         }

//         // Nếu không bắt đầu với bất kỳ tiền tố nào, bỏ qua tin nhắn
//         if (!startsWithCurrentPrefix) return;

//         // Lấy các tham số của lệnh
//         const prefixLength = specialUsers.includes(message.author.id)
//             ? (messageContent.startsWith(normalizedGuildPrefix) ? normalizedGuildPrefix.length : normalizedDefaultPrefix.length)
//             : (guildPrefix ? normalizedGuildPrefix.length : normalizedDefaultPrefix.length);

//         const args = messageContent.slice(prefixLength).trim().split(/ +/);
//         const commandName = args.shift().toLowerCase();

//         // Kiểm tra nếu lệnh là `change_prefix list` hoặc alias của nó
//         const isChangePrefixListCommand = (commandName === 'change_prefix' || commandName === 'tt' || commandName === 'prefix') && args[0] === 'list';

//         // Thực thi lệnh `change_prefix list` nếu đúng
//         if (isChangePrefixListCommand) {
//             const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
//             if (!command) return;

//             try {
//                 command.execute(message, args);
//             } catch (error) {
//                 console.error(error);
//                 message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh.');
//             }
//             return;
//         }

//         // Lấy lệnh từ bộ sưu tập
//         const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
//         if (!command) return;

//         // Quản lý cooldown và thực thi lệnh
//         const now = Date.now();
//         const timestamps = cooldowns.get(message.author.id) || {};
//         const cooldownAmount = 5 * 1000; // Thời gian chờ là 5 giây

//         if (timestamps[commandName] && (now - timestamps[commandName]) < cooldownAmount) {
//             const timeLeft = ((timestamps[commandName] + cooldownAmount) - now) / 1000;
//             return message.channel.send(`Bạn đã gửi tin nhắn quá nhanh. Vui lòng chờ **${timeLeft.toFixed(1)}** giây.`);
//         }

//         timestamps[commandName] = now;
//         cooldowns.set(message.author.id, timestamps);

//         // Kiểm tra xem bot có quyền 'Manage Messages' trên kênh hiện tại không
//         if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
//             return message.channel.send(
//                 `Bạn cần cấp quyền **Quản lý tin nhắn ( Manage Messages )** cho tôi. Nhưng tốt nhất thì bạn cấp **Người quản lý ( Administrator )** cho tôi\n` +
//                 `và nếu được hãy để tôi ở vị trí vai trò trên cùng, điều này sẽ giúp tôi hỗ trợ bạn được tốt nhất với tất cả những gì tôi có`
//             );
//         }

//         try {
//             message.delete().catch(err => console.error('Không thể xóa tin nhắn:', err));
//             command.execute(message, args);
//         } catch (error) {
//             console.error(error);
//             message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh.');
//         }
//     },
// };









//////////////////////////////////////////////////////////////////////////////////////












// lệnh tiền tố cố định
// require('dotenv').config(); // Tải biến môi trường từ .env
// const cooldowns = new Map();

// module.exports = {
//     name: 'messageCreate',
//     once: false, // Xác định sự kiện này có chỉ xảy ra một lần hay không. false có nghĩa là nó sẽ xảy ra mỗi khi có tin nhắn mới

//     async execute(message, client) {


//         if (!message.guild || message.author.bot) return;

//         // Lấy prefix từ biến môi trường
//         const prefix = process.env.PREFIX;

//         // Kiểm tra xem tin nhắn có bắt đầu bằng prefix hay không
//         if (!message.content.startsWith(prefix)) return;
        
//         // Lấy các tham số của lệnh
//         const args = message.content.slice(prefix.length).trim().split(/ +/);

//         const commandName = args.shift().toLowerCase(); // shift() đã đổi thành join
//         // const commandName = args.shift() + (args.length ? ' ' + args.join(' ') : '').toLowerCase();
        
//         const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        

//         // console.log(`Command Name: ${commandName}`); // In ra tên lệnh



//         if (!command) return;

//         const now = Date.now();
//         const timestamps = cooldowns.get(message.author.id) || {};
//         const cooldownAmount = 5 * 1000; // 10 = 10 giây

//         if (timestamps[commandName] && (now - timestamps[commandName]) < cooldownAmount) {
//             const timeLeft = ((timestamps[commandName] + cooldownAmount) - now) / 1000;
//             return message.channel.send(`Bạn đã gửi tin nhắn quá nhanh, điều này sẽ dẫn đến discord hiểu lầm bạn đang spam tin nhắn. Vui lòng chờ ít nhất **${timeLeft.toFixed(1)}** để dùng lại lệnh.`);
//         }

//         timestamps[commandName] = now;
//         cooldowns.set(message.author.id, timestamps);

//         try {
//             // Xóa tin nhắn lệnh prefix
//             message.delete().catch(err => console.error('Không thể xóa tin nhắn:', err));

//             // Thực thi lệnh
//             command.execute(message, args);
//         } catch (error) {
//             console.error(error);
//             message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh.');
//         }
//     },
// };






