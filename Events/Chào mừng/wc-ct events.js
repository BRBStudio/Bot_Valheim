/*
***
    Events/Guild/messageCreateSlash.js
    Mã này gửi tin nhắn chào mừng đến kênh được chỉ định khi một máy chủ mới nhập vào thành viên.
    Dùng lệnh /welcome-setup để kích hoạt điều này
***
*/
const { ChannelType, Events, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const WelcomeMessage = require("../../schemas/welcomecustomSchema.js");
const EventStatus = require('../../schemas/Event_Status.js');
const config = require(`../../config.js`)

module.exports = {
    name: Events.GuildMemberAdd,

        async execute(member) {
          
            // // Kiểm tra trạng thái của sự kiện này
            // const eventStatus = await EventStatus.findOne({ event: 'wc-ct' });

            // // Nếu sự kiện không được bật, thoát khỏi hàm
            // if (!eventStatus || eventStatus.status === 'off') {
            //     return; // Không làm gì cả nếu sự kiện bị tắt
            // }

            try{
                const { user, guild } = member;

                const brb = `
   
        ██████╗ ██████╗░██████╗     
        ██╔══██╗██╔══██╗██╔══██╗    
        ██████╔╝██████╔╝██████╔╝    
        ██╔══██╗██╔══██╗██╔══██╗    
        ██████╔╝██║░░██║██████╔╝    
        ╚═════╝ ╚═╝░░╚═╝╚═════╝     
                                        
                `;
        
                // Lấy thông tin tin nhắn chào mừng từ cơ sở dữ liệu
                const welcomeMessage = await WelcomeMessage.findOne({
                    guildId: member.guild.id,
                });

                // Nếu không có thông tin tin nhắn chào mừng thì tạo một tin nhắn
                if (welcomeMessage) {
                    const channel = member.guild.channels.cache.get(welcomeMessage.channelId);
                    const rules = member.guild.channels.cache.get(welcomeMessage.rulesChannelId);  // Lấy kênh luật lệ
                    const owner = await guild.fetchOwner();  // Lấy thông tin của chủ sở hữu server

                    // Kiểm tra nếu kênh tồn tại trước khi gửi tin nhắn
                if (!channel) {
                    const fallback = guild.systemChannel || guild.channels.cache.find(c => c.type === ChannelType.GuildText);
                    if (fallback) {
                        fallback.send(`⚠️ Không tìm thấy kênh có ID: \`${welcomeMessage.channelId}\`. Hãy kiểm tra lại lệnh /welcome-setup.`);
                    }
                    console.error(`Không tìm thấy kênh với ID: ${welcomeMessage.channelId}`);
                    return;
                }

                // Kiểm tra xem thành viên tham gia có phải là bot hay không
                if (user.bot) {

                    // // Kiểm tra xem bot có phải là bot có ID đặc biệt hay không
                    // if (user.id === '123456789' || user.id === '987654321') {
                    //     // Nếu bot có ID đặc biệt, kick bot này ra khỏi máy chủ
                    //     await member.kick('Bot bị mời vào máy chủ và bị kick theo yêu cầu.');
                    //     console.log(`Bot với ID ${user.id} đã bị kick ra khỏi máy chủ.`);
                    //     return; // Kết thúc sau khi kick bot
                    // }

                    // Tìm kiếm người đã mời bot (giả định là member đã mời)
                    const auditLogs = await guild.fetchAuditLogs({
                        type: '28',
                        limit: 1
                    });
                    const botAddLog = auditLogs.entries.first();

                    if (botAddLog && botAddLog.target.id === user.id) {
                        const inviter = botAddLog.executor;
                        
                        // Tìm kênh văn bản có tên là 'bot-bot'
                        const botChannel = guild.channels.cache.find(
                            (channel) => channel.type === ChannelType.GuildText && channel.name === 'bot-bot'
                        );

                        if (botChannel) {
                            // Gửi tin nhắn thông báo về việc mời bot vào kênh 'bot-bot'
                            botChannel.send(`Người dùng **${inviter.displayName}** đã mời bot **${user.tag}** vào máy chủ **${guild.name}**.`);
                        } else {
                            // Nếu không tìm thấy kênh 'bot-bot', gửi tin nhắn thông báo yêu cầu tạo kênh này
                            const defaultChannel = guild.systemChannel || guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);
                            if (defaultChannel) {
                                defaultChannel.send(`Không tìm thấy kênh văn bản \`bot-bot\`. Vui lòng tạo một kênh có tên là \`bot-bot\` để nhận thông báo khi bot được mời vào máy chủ.`);
                            }
                        }
                    }
                    return;
                }

                // Kiểm tra nếu người dùng có ID là 940104526285910046, 1215380543815024700
                const b = ['940104526285910046', '1215380543815024700', `933544716883079278`]; 
                if (b.includes(user.id)) {  
                    const welcomeDB = `**${member.displayName}**, Người điều hành bot đã tham gia máy chủ!`;

                    const WcDBEmbed = new EmbedBuilder()
                        .setDescription(welcomeDB)
                        .setColor(config.embedCyan)
                        .setThumbnail(user.displayAvatarURL())
                        .setImage('https://media.giphy.com/media/q8btWot24CHVWJc7D2/giphy.gif');

                    channel.send({ embeds: [WcDBEmbed] });
                    return; // Thoát khỏi hàm sau khi gửi tin nhắn chào mừng đặc biệt
                }

                // // Kiểm tra nếu kênh tồn tại trước khi gửi tin nhắn
                // if (!channel) {
                //     console.error(`Không tìm thấy kênh với ID: ${welcomeMessage.channelId}`);
                //     return;
                // }

                const placeholders = {
                    b1: member.user.toString(),
                    b2: guild.name,
                    b3: guild.memberCount,
                    b4: rules ? rules.toString() : 'chưa có kênh rules'  // Thêm b4: Kênh luật lệ
                };

                const messageContent = replacePlaceholders(welcomeMessage.message, placeholders).replace(/\\n/g, "\n");

                if (welcomeMessage.isEmbed) {

                const sendButton = new ButtonBuilder()
                    .setCustomId('WelcomeCustom')
                    .setLabel(`CHÀO MỪNG BẠN ĐẾN VỚI ${guild.name}`) // Dùng 'guild.name' thay vì 'client.guild.name'
                    .setEmoji(`<:confetti1:1250099145637761164>`)
                    .setStyle(ButtonStyle.Success);

                const row = new ActionRowBuilder()
                    .addComponents(sendButton);

                // Gửi nút lên trên embed
                await channel.send({ components: [row] });

                // Gửi tin nhắn chào mừng dưới dạng nhúng
                const embed = new EmbedBuilder()
                        .setTitle(`Chào mừng ${user.username} đến với ${guild.name}🎉 !!!`)
                        .setColor("Random")
                        .setDescription(messageContent)
                        .addFields(
                            { name: `Luật Server`, value: rules ? `${rules}` : 'chưa có kênh rules', inline: true },
                            { name: "Admin", value: `${owner.displayName}`, inline: true }, // `${owner.user.tag}` tên đăng nhập (`${owner.displayName}` tên hiển thị)
                            { name: `Tổng số thành viên`, value: `${guild.memberCount}`, inline: false }
                        )
                        .setThumbnail(user.displayAvatarURL())
                        .setTimestamp();

                if (welcomeMessage.imageUrl) {
                embed.setImage(welcomeMessage.imageUrl);  // Thiết lập hình ảnh
                } else {
                    embed.addFields({ name: `TÊN BOT`, value: '```\n' + brb + '\n```', inline: false });  // Thêm trường TÊN BOT nếu không có hình ảnh
                }

                    channel.send({ embeds: [embed] });
                } else {
                    channel.send(messageContent);
                }
            }
        } catch (error) {
            console.error(`Đã xảy ra lỗi khi gửi tin nhắn chào mừng: ${error.message}`);
        }
    },
};

function replacePlaceholders(message, placeholders) {
    return message.replace(/\b(b1|b2|b3|b4)\b/gi, (match) => placeholders[match.toLowerCase()] || match);
}
