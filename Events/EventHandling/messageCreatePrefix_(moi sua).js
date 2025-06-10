// const { PermissionsBitField } = require('discord.js');
// require('dotenv').config();
// const GuildPrefix = require('../../schemas/GuildPrefix');
// const cooldowns = new Map();
// const specialUsers = ['1215380543815024700', '940104526285910046'];

// module.exports = {
//     name: 'messageCreate',
//     once: false,

//     async execute(message, client) {
//         if (!message.guild || message.author.bot) return;

//         // Lấy tiền tố từ cơ sở dữ liệu
//         let guildPrefix;
//         const defaultPrefix = process.env.PREFIX || '?';

//         try {
//             const guildData = await GuildPrefix.findOne({ guildId: message.guild.id });
//             guildPrefix = guildData ? guildData.prefix : null;
//         } catch (error) {
//             console.error('Lỗi khi lấy tiền tố từ cơ sở dữ liệu:', error);
//             guildPrefix = null;
//         }

//         const messageContent = message.content.trim().toLowerCase();
//         const normalizedGuildPrefix = guildPrefix ? guildPrefix.toLowerCase() : null;
//         const normalizedDefaultPrefix = defaultPrefix.toLowerCase();

//         let startsWithCurrentPrefix = false;

//         if (specialUsers.includes(message.author.id)) {
//             startsWithCurrentPrefix = messageContent.startsWith(normalizedDefaultPrefix) ||
//                                       (normalizedGuildPrefix && messageContent.startsWith(normalizedGuildPrefix));
//         } else {
//             startsWithCurrentPrefix = guildPrefix
//                 ? messageContent.startsWith(normalizedGuildPrefix)
//                 : messageContent.startsWith(normalizedDefaultPrefix);
//         }

//         if (!startsWithCurrentPrefix) return;

//         const prefixLength = specialUsers.includes(message.author.id)
//             ? (messageContent.startsWith(normalizedGuildPrefix) ? normalizedGuildPrefix.length : normalizedDefaultPrefix.length)
//             : (guildPrefix ? normalizedGuildPrefix.length : normalizedDefaultPrefix.length);

//         const args = messageContent.slice(prefixLength).trim().split(/ +/);
//         const commandName = args.shift().toLowerCase();

//         // Xử lý lệnh prefix
//         const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
//         if (command) {
//             const now = Date.now();
//             const timestamps = cooldowns.get(message.author.id) || {};
//             const cooldownAmount = 5 * 1000;

//             if (timestamps[commandName] && (now - timestamps[commandName]) < cooldownAmount) {
//                 const timeLeft = ((timestamps[commandName] + cooldownAmount) - now) / 1000;
//                 return message.channel.send(`Bạn đã gửi tin nhắn quá nhanh. Vui lòng chờ **${timeLeft.toFixed(1)}** giây.`);
//             }

//             timestamps[commandName] = now;
//             cooldowns.set(message.author.id, timestamps);

//             if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
//                 return message.channel.send(
//                     `Bạn cần cấp quyền **Quản lý tin nhắn (Manage Messages)** cho tôi. Nhưng tốt nhất thì bạn cấp **Người quản lý (Administrator)** cho tôi.`
//                 );
//             }

//             try {
//                 message.delete().catch(err => console.error('Không thể xóa tin nhắn:', err));
//                 command.execute(message, args);
//             } catch (error) {
//                 console.error(error);
//                 message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh.');
//             }
//             return;
//         }

//         // Xử lý lệnh slash
//         const slashCommand = client.slashCommands.get(commandName);
//         if (slashCommand) {
//             try {
//                 await slashCommand.execute({ interaction: message, args, isMessage: true });
//             } catch (error) {
//                 console.error(error);
//                 message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh slash.');
//             }
//         }
//     },
// };
