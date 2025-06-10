// const { WebhookClient, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
// require('colors');
// const fs = require('fs');
// const path = require('path');
// const config = require('../../config');

// // const webhookURL = 'https://discord.com/api/webhooks/1275804964467507281/aOzwICNmgVvXz1SyBOzbKDJmOQiiWhrsXtXqS4fbP0e2-EM2vAz_y2vnPz-PpdB3bC0Z';
// const webhookURL = process.env.WEBHOOK_URL;
// const webhookClient = new WebhookClient({ url: webhookURL });

// // hàm tạo link mời vào máy chủ
// const getServerInviteLink = async (guild) => {
//     try {
//         if (guild.vanityURLCode) {
//             return `https://discord.gg/${guild.vanityURLCode}`;
//         }

//         const channel = guild.channels.cache.find(ch => 
//             ch.type === ChannelType.GuildText && ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
//         );

//         if (channel) {
//             const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
//             return invite.url;
//         }

//         return 'Không có liên kết mời có sẵn';
//     } catch (error) {
//         console.error('Lỗi khi lấy liên kết mời server:', error);
//         return 'Không có liên kết mời có sẵn';
//     }
// };

// // Hàm phân tích và định dạng thông tin lỗi từ stack trace
// // Trả về đường dẫn tương đối của tệp, số dòng và số cột lỗi, nếu có
// const getErrorLocation = (stack) => {
//     const lines = stack.split('\n');
//     for (const line of lines) {
//         if (line.includes('at ')) {
//             const match = line.match(/\((.*):(\d+):(\d+)\)/);
//             if (match) {
//                 const filePath = match[1];
//                 const lineNumber = match[2];
//                 const columnNumber = match[3];
//                 const relativePath = path.relative(process.cwd(), filePath);

//                 if (relativePath.startsWith('InteractionTypes') ||
//                     relativePath.startsWith('Handlers') ||
//                     relativePath.startsWith('Commands') ||
//                     relativePath.startsWith('Events') ||
//                     relativePath.startsWith('ButtonPlace')) {

//                     return `Tệp: ${relativePath}\nDòng: ${lineNumber}, Cột: ${columnNumber}`;
//                 }
//             }
//         }
//     }
//     return 'Không xác định';
// };

// module.exports = {
//     name: 'interactionError',

//     async execute(interaction, error, client) {
//         // console.log(error.stack ? String(error.stack).red : String(error).red);

//         const user = interaction.user;
//         const isButtonInteraction = interaction.isButton();
//         const interactionType = isButtonInteraction ? 'Nút' : 'Lệnh';
//         const interactionName = isButtonInteraction ? interaction.customId : interaction.commandName;

//         const serverInviteLink = await getServerInviteLink(interaction.guild);

//         // Kiểm tra lỗi thường gặp
//         let customErrorMessage = '';
//         if (error.message.includes('error is not defined')) {
//             customErrorMessage = `Đây là lỗi thường gặp khi viết mã trong khối try-catch nhưng quên không khai báo biến error trong khối catch.`;
//         } else if (error.message.includes('Unable to convert color to a number')) {
//             customErrorMessage = `Lỗi chuyển đổi màu không hợp lệ tại dòng .setColor(). Hãy kiểm tra lại màu sắc được sử dụng trong Embed tại tệp: ${path.join(__dirname, '../../InteractionTypes/Buttons')}/${interaction.customId}.`;
//         }

//         // Xử lý lỗi tương tác và gửi phản hồi
//         interaction.reply({
//             embeds: [new EmbedBuilder()
//                 .setColor('Red')
//                 .setAuthor({ name: 'Đã xảy ra lỗi! Thử lại sau', icon_url: user.displayAvatarURL(), url: 'https://discord.com/channels/1028540923249958912/1155704256154828881' })
//             ],
//             ephemeral: true
//         }).catch((e) => {
//             // Nếu không gửi được tin nhắn phản hồi, gửi tin nhắn lỗi vào kênh
//             interaction.channel.send({
//                 content: `${interaction.user}`,
//                 embeds: [new EmbedBuilder()
//                     .setColor('Blue')
//                     .setAuthor({ name: 'Đã xảy ra lỗi! Thử lại sau!', icon_url: user.displayAvatarURL(), url: 'https://discord.com/channels/1028540923249958912/1155704256154828881' })
//                 ],
//             }).then(m => setTimeout(() => m.delete(), 9000));
//         });

//         // Xác định đường dẫn tệp chính xác
//         // const resolvedFilePath = path.join(__dirname, '../../InteractionTypes/Buttons', interaction.customId);
//         // Đảm bảo rằng customId được xác định trước khi sử dụng trong path.join
//         const resolvedFilePath = interaction.customId ? path.join(__dirname, '../../InteractionTypes/Buttons', interaction.customId) : 'Không xác định';

//         // Lấy thông tin vị trí lỗi từ stack trace
//         const errorLocation = getErrorLocation(error.stack || '');

//         // Gửi nhật ký lỗi tới webhook (không có nút)
//         webhookClient.send({                            
//             embeds: [
//                 new EmbedBuilder()
//                 .setColor("#00ffaa")
//                 .setTitle(isButtonInteraction ? 'Hệ thống lỗi [NÚT TƯƠI TÁC]' : 'Hệ thống lỗi [LỆNH TƯƠI TÁC]')
//                 .setDescription(`_Đã xảy ra lỗi_.\n\n**Lỗi Code:** \`${error.name || 'Không xác định'}\`\n**Lỗi tin nhắn:** \`${error.message || 'Không xác định'}\`\n**Hiển thị lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n**Thông tin bổ sung:** ${customErrorMessage}`)
//                 .setFooter({ text: `Bộ nhớ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}% | Ping: ${Date.now() - interaction.createdTimestamp}ms` })
//                 .addFields([
//                     { name: "Máy chủ", value: interaction.guild.name || 'Không xác định', inline: true },
//                     { name: "ID máy chủ", value: interaction.guild.id || 'Không xác định', inline: true },
//                     { name: "Loại tương tác", value: interactionType, inline: true },
//                     { name: interactionType === 'Nút' ? 'Tên nút' : 'Tên lệnh', value: interactionName || 'N/A', inline: true },
//                     { name: 'ID Nút/Tệp lỗi', value: interaction.customId ? `ID: ${interaction.customId} | Tệp: ${resolvedFilePath}` : 'Không xác định', inline: true },
//                     { name: 'Vị trí lỗi', value: errorLocation, inline: true },
//                     { name: `Vào máy chủ bị lỗi ${config.arrowDownEmoji}`, value: serverInviteLink, inline: false },
//                 ])
//             ],
//         })

//     },
// };

















const { WebhookClient, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField, Message } = require('discord.js');
require('colors');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

// const webhookURL = 'https://discord.com/api/webhooks/1275804964467507281/aOzwICNmgVvXz1SyBOzbKDJmOQiiWhrsXtXqS4fbP0e2-EM2vAz_y2vnPz-PpdB3bC0Z';
const webhookURL = process.env.WEBHOOK_URL;
const webhookClient = new WebhookClient({ url: webhookURL });

// hàm tạo link mời vào máy chủ
const getServerInviteLink = async (guild) => {
    try {
        if (guild.vanityURLCode) {
            return `https://discord.gg/${guild.vanityURLCode}`;
        }

        const channel = guild.channels.cache.find(ch => 
            ch.type === ChannelType.GuildText && ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
        );

        if (channel) {
            const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            return invite.url;
        }

        return 'Không có liên kết mời có sẵn';
    } catch (error) {
        console.error('Lỗi khi lấy liên kết mời server:', error);
        return 'Không có liên kết mời có sẵn';
    }
};

// Hàm phân tích và định dạng thông tin lỗi từ stack trace
// Trả về đường dẫn tương đối của tệp, số dòng và số cột lỗi, nếu có
const getErrorLocation = (stack) => {
    const lines = stack.split('\n');
    for (const line of lines) {
        if (line.includes('at ')) {
            const match = line.match(/\((.*):(\d+):(\d+)\)/);
            if (match) {
                const filePath = match[1];
                const lineNumber = match[2];
                const columnNumber = match[3];
                const relativePath = path.relative(process.cwd(), filePath);

                if (relativePath.startsWith('InteractionTypes') ||
                    relativePath.startsWith('Handlers') ||
                    relativePath.startsWith('Commands') ||
                    relativePath.startsWith('Events') ||
                    relativePath.startsWith('ButtonPlace')) {

                    return `Tệp: ${relativePath}\nDòng: ${lineNumber}, Cột: ${columnNumber}`;
                }
            }
        }
    }
    return 'Không xác định';
};

module.exports = {
    name: 'interactionError',

    async execute(source, error, client) {
        // Kiểm tra xem source có phải là một lệnh tiền tố hay không
        const isMessage = source instanceof Message; // Kiểm tra nếu source là một Message
        const isInteraction = source.isInteraction?.();
        const isButtonInteraction = isInteraction && source.isButton();
        const interactionType = isButtonInteraction ? 'Nút' : (isInteraction ? 'Lệnh' : 'Sự kiện');
        const interactionName = isButtonInteraction ? source.customId : (isInteraction ? source.commandName : 'messageCreate');
        const user = isInteraction ? source.user : source.author;
        const guild = source.guild;

        // Lấy link mời vào server
        const serverInviteLink = await getServerInviteLink(guild);

        // Kiểm tra lỗi thường gặp
        let customErrorMessage = '';
        if (error.message.includes('error is not defined')) {
            customErrorMessage = `Đây là lỗi thường gặp khi viết mã trong khối try-catch nhưng quên không khai báo biến error trong khối catch.`;
        } else if (error.message.includes('Unable to convert color to a number')) {
            customErrorMessage = `Lỗi chuyển đổi màu không hợp lệ tại dòng .setColor(). Hãy kiểm tra lại màu sắc được sử dụng trong Embed.`;
        }

        // Xử lý lỗi tương tác và gửi phản hồi (nếu có)
        if (isInteraction) {
            source.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor({ name: 'Đã xảy ra lỗi! Thử lại sau', iconURL: user.displayAvatarURL(), url: 'https://discord.com/channels/1028540923249958912/1155704256154828881' })
                ],
                ephemeral: true
            }).catch((e) => {
                // Nếu không gửi được tin nhắn phản hồi, gửi tin nhắn lỗi vào kênh
                source.channel.send({
                    content: `${user}`,
                    embeds: [new EmbedBuilder()
                        .setColor('Blue')
                        .setAuthor({ name: 'Đã xảy ra lỗi! Thử lại sau!', iconURL: user.displayAvatarURL(), url: 'https://discord.com/channels/1028540923249958912/1155704256154828881' })
                    ],
                }).then(m => setTimeout(() => m.delete(), 9000));
            });
        } else if (isMessage) { // Kiểm tra nếu là lệnh tiền tố
            source.channel.send({
                content: `${user}`,
                embeds: [new EmbedBuilder()
                    .setColor('Blue')
                    .setAuthor({ name: 'Đã xảy ra lỗi! Thử lại sau!', iconURL: user.displayAvatarURL(), url: 'https://discord.com/channels/1028540923249958912/1155704256154828881' })
                ],
            }).then(m => setTimeout(() => m.delete(), 9000));
        }

        // Xác định đường dẫn tệp chính xác (chỉ dành cho interaction có customId)
        const resolvedFilePath = source.customId ? path.join(__dirname, '../../InteractionTypes/Buttons', source.customId) : 'Không xác định';

        // Lấy thông tin vị trí lỗi từ stack trace
        const errorLocation = getErrorLocation(error.stack || '');

        // Gửi nhật ký lỗi tới webhook
        webhookClient.send({
            embeds: [
                new EmbedBuilder()
                .setColor("#00ffaa")
                .setTitle(isButtonInteraction ? 'Hệ thống lỗi [NÚT TƯƠI TÁC]' : `Hệ thống lỗi [${interactionType.toUpperCase()}]`)
                .setDescription(`_Đã xảy ra lỗi_.\n\n**Lỗi Code:** \`${error.name || 'Không xác định'}\`\n**Lỗi tin nhắn:** \`${error.message || 'Không xác định'}\`\n**Hiển thị lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n**Thông tin bổ sung:** ${customErrorMessage}`)
                .setFooter({ text: `Bộ nhớ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}% | Ping: ${Date.now() - (isInteraction ? source.createdTimestamp : Date.now())}ms` })
                .addFields([
                    { name: "Máy chủ", value: guild.name || 'Không xác định', inline: true },
                    { name: "ID máy chủ", value: guild.id || 'Không xác định', inline: true },
                    { name: "Loại tương tác", value: interactionType, inline: true },
                    { name: interactionType === 'Nút' ? 'Tên nút' : (interactionType === 'Lệnh' ? 'Tên lệnh' : 'Tên sự kiện'), value: interactionName || 'N/A', inline: true },
                    { name: 'ID Nút/Tệp lỗi', value: source.customId ? `ID: ${source.customId} | Tệp: ${resolvedFilePath}` : 'Không xác định', inline: true },
                    { name: 'Vị trí lỗi', value: errorLocation, inline: true },
                    { name: `Vào máy chủ bị lỗi ${config.arrowDownEmoji}`, value: serverInviteLink, inline: false },
                ])
            ],
        });
    },
};

























// const { WebhookClient, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js'); // Import WebhookClient and EmbedBuilder
// require('colors');

// const webhookURL = 'https://discord.com/api/webhooks/1275804964467507281/aOzwICNmgVvXz1SyBOzbKDJmOQiiWhrsXtXqS4fbP0e2-EM2vAz_y2vnPz-PpdB3bC0Z'; 
// const webhookClient = new WebhookClient({ url: webhookURL });

//     module.exports = {
//         name: 'interactionError',

//         execute(interaction, error, client) {
//             console.log(error.stack ? String(error.stack).red : String(error).red);
            
//             const user = interaction.user;

//             // Xử lý lỗi tương tác và gửi phản hồi
//             interaction.reply({
//             embeds: [new EmbedBuilder()
//                 .setColor(`Red`)
//                 .setAuthor({ name: `Đã xảy ra lỗi! Thử lại sau`, icon_url: user.displayAvatarURL(), url: "https://discord.com/channels/1028540923249958912/1155704256154828881" })
//             ],
//             ephemeral: true
//             }).catch((e) => {

//             // Nếu không gửi được tin nhắn phản hồi, gửi tin nhắn lỗi vào kênh
//             interaction.channel.send({
//                 content: `${interaction.user}`,
//                 embeds: [new EmbedBuilder()
//                 .setColor(`Blue`)
//                 .setAuthor({ name: ` Đã xảy ra lỗi! Thử lại sau!`, icon_url: user.displayAvatarURL(), url: "https://discord.com/channels/1028540923249958912/1155704256154828881" })],
//             }).then(m => setTimeout(() => m.delete(), 9000));
//             });

//             // Gửi nhật ký lỗi tới webhook
//             webhookClient.send({
//             embeds: [
//                 new EmbedBuilder()
//                 .setColor("#00ffaa")
//                 .setTitle(`Hệ thống lỗi [LỆNH TƯƠNG TÁC]`)
//                 .setDescription(`_Đã xảy ra lỗi_.\n\n**Lỗi Code:** \`${error.name || 'Không xác định'}\`\n**Lỗi tin nhắn:** \`${error.message || 'Không xác định'}\`\n**Hiển thị lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\``)
//                 .setFooter({ text: `Bộ nhớ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}% | Ping: ${Date.now() - interaction.createdTimestamp}ms` })
//                 .addFields([
//                     { name: "Máy chủ", value: interaction.guild.name, inline: true },
//                     { name: "ID máy chủ", value: interaction.guild.id, inline: true },
//                     { name: "Lệnh", value: interaction.commandName, inline: true },
//                 ])
//             ]
//         });
//     },
// };
