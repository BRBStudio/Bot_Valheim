// const figlet = require('figlet');
// const { ChannelType, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
// const WelcomeDefault = require('../../schemas/welcomedefaultSchema');
// const EventStatus = require('../../schemas/Event_Status');
// const config = require(`../../config`)

// module.exports = {
//     name: "guildMemberAdd",

//     execute: async (member, client) => {

//         // Kiểm tra trạng thái của sự kiện này
//         const eventStatus = await EventStatus.findOne({ event: 'wc-df' });

//         // Nếu sự kiện không được bật, thoát khỏi hàm
//         if (!eventStatus || eventStatus.status === 'off') {
//             return; // Không làm gì cả nếu sự kiện bị tắt
//         }

//         const { user, guild } = member; // Sử dụng trực tiếp 'guild' từ 'member'

//         // Lấy thông tin kênh chào mừng từ MongoDB
//         const welcomeData = await WelcomeDefault.findOne({ guildId: guild.id });
//         const welcomeChannelId = welcomeData ? welcomeData.channelId : null;
//         const welcomeChannel = welcomeChannelId ? guild.channels.cache.get(welcomeChannelId) : null;

//         if (!welcomeChannel) return; // Nếu không có kênh, thoát

//         // Kiểm tra xem thành viên tham gia có phải là bot hay không
//         if (user.bot) {

//             // // Kiểm tra xem bot có phải là bot có ID đặc biệt hay không
//             // if (user.id === '123456789' || user.id === '987654321') {
//             //     // Nếu bot có ID đặc biệt, kick bot này ra khỏi máy chủ
//             //     await member.kick('Bot bị mời vào máy chủ và bị kick theo yêu cầu.');
//             //     console.log(`Bot với ID ${user.id} đã bị kick ra khỏi máy chủ.`);
//             //     return; // Kết thúc sau khi kick bot
//             // }

//             // Tìm kiếm người đã mời bot (giả định là member đã mời)
//             const auditLogs = await guild.fetchAuditLogs({
//                 type: '28',
//                 limit: 1
//             });
//             const botAddLog = auditLogs.entries.first();

//             if (botAddLog && botAddLog.target.id === user.id) {
//                 const inviter = botAddLog.executor;
                
//                 // Tìm kênh văn bản có tên là 'bot-bot'
//                 const botChannel = guild.channels.cache.find(
//                     (channel) => channel.type === ChannelType.GuildText && channel.name === 'bot-bot'
//                 );

//                 if (botChannel) {
//                     // Gửi tin nhắn thông báo về việc mời bot vào kênh 'bot-bot'
//                     botChannel.send(`Người dùng **${inviter.displayName}** đã mời bot **${user.tag}** vào máy chủ **${guild.name}**.`);
//                 } else {
//                     // Nếu không tìm thấy kênh 'bot-bot', gửi tin nhắn thông báo yêu cầu tạo kênh này
//                     const defaultChannel = guild.systemChannel || guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);
//                     if (defaultChannel) {
//                         defaultChannel.send(`Không tìm thấy kênh văn bản \`bot-bot\`. Vui lòng tạo một kênh có tên là \`bot-bot\` để nhận thông báo khi bot được mời vào máy chủ.`);
//                     }
//                 }
//             }
//             return; // Kết thúc nếu thành viên là bot, không gửi lời chào thông thường
//         }

//         // Kiểm tra nếu người dùng có ID là 940104526285910046 
//         if (user.id === '940104526285910046' || user.id === '1215380543815024700') {
//             const welcomeDB = `**${member.displayName}**, Người điều hành bot đã tham gia máy chủ!`

//             const WcDBEmbed = new EmbedBuilder()
//             .setDescription(welcomeDB)
//             .setColor(config.embedCyan)
//             .setThumbnail(user.displayAvatarURL())
//             .setImage('https://media.giphy.com/media/q8btWot24CHVWJc7D2/giphy.gif')

//             welcomeChannel.send({ embeds:[WcDBEmbed] });
//             return; // Thoát khỏi hàm sau khi gửi tin nhắn chào mừng đặc biệt          
//         }

//         const ruleChannel = welcomeChannel;

//         const welcomeMessage = `${member.displayName} vừa tham gia ${guild.name}. \nBạn là thành viên thứ ${guild.memberCount}. \n\nVui lòng đọc kỹ thông tin tại đây ${ruleChannel}. Xin cảm ơn!`;

//         const brb = `
//         ██████╗ ██████╗░██████╗                
//         ██╔══██╗██╔══██╗██╔══██╗               
//         ██████╔╝██████╔╝██████╔╝               
//         ██╔══██╗██╔══██╗██╔══██╗                  
//         ██████╔╝██║░░██║██████╔╝                
//         ╚═════╝ ╚═╝░░╚═╝╚═════╝                 
//         `;

//         // Lấy thông tin chủ sở hữu máy chủ (guild owner)
//         const owner = await guild.members.fetch(guild.ownerId);
//         const ownerName = owner.displayName || owner.user.username; // Lấy nickname nếu có, không thì lấy username

//         const sendButton = new ButtonBuilder()
//             .setCustomId('WelcomeDefault')
//             .setLabel(`CHÀO MỪNG BẠN ĐẾN VỚI ${guild.name}`)
//             .setEmoji(`<:confetti1:1250099145637761164>`)
//             .setStyle(ButtonStyle.Success);

//         const row = new ActionRowBuilder()
//             .addComponents(sendButton);

//         const welcomeEmbed = new EmbedBuilder()
//             .setAuthor({
//                 name: guild.name, // Dùng 'guild.name' để lấy tên máy chủ
//                 icon_url: user.displayAvatarURL(),
//                 url: 'https://discord.com/channels/1028540923249958912/1155704256154828881',
//             })
//             .setTitle(`Chào mừng ${member.displayName} đến với ${guild.name} 🎉 !!!`)
//             .setDescription(welcomeMessage)
//             .setColor('Green')
//             .setThumbnail(user.displayAvatarURL())
//             .setImage('https://media.giphy.com/media/q8btWot24CHVWJc7D2/giphy.gif')
//             .addFields([
//                 { name: "Tổng Số Thành Viên:", value: `${guild.memberCount}`, inline: true },
//                 { name: "Author", value: ownerName, inline: true },
//                 { name: "Luật Server", value: `${ruleChannel}`, inline: false },
//                 { name: "Thanks!", value: '```\n' + brb + '\n```', inline: false }
//             ])
//             .setTimestamp();

//         welcomeChannel.send({ content: `${user}`, components: [row] })
//             .then(() => {
//                 welcomeChannel.send({ embeds: [welcomeEmbed] });
//             });

            
//     }
// }

