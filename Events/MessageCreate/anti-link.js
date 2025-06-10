// const { EmbedBuilder, PermissionsBitField } = require('discord.js');
// const AutoMod = require('../../schemas/autoModSchema');


// module.exports = {
//     name: 'messageCreate',
//     async execute(message) {
//         if (message.author.bot) return; 

//         const guildConfig = await AutoMod.findOne({ guildId: message.guild.id });
//         if (!guildConfig) return; 
//         const logChannel = guildConfig.logChannelId ? message.guild.channels.cache.get(guildConfig.logChannelId) : null;

//         if (guildConfig.antiLinkChannels.includes(message.channel.id)) {
//             if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

//             const discordLinkRegex = /(discord(?:\.com|\.gg|app\.com)\/(?:[a-zA-Z0-9-]{2,32}))|(https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11})|(https?:\/\/(www\.)?youtu\.be\/[\w-]{11})/;
//             if (discordLinkRegex.test(message.content)) {
//                 await message.delete();

//                 const warningEmbed = new EmbedBuilder()
//                     .setDescription(`Channel <#${message.channel.id}> đã bật **\`AutoMod - AntiLink\`**.`)
//                     .setColor('#2f3136')

//                 await message.channel.send({ content: `<@${message.author.id}>`, embeds: [warningEmbed] });

//                 if (logChannel) {
//                     const logEmbed = new EmbedBuilder()
//                         .setTitle('AutoMod')
//                         .addFields(
//                             { name: 'Người dùng', value: `\`${message.author.tag}\`\nID: \`${message.author.id}\` đã gửi link bị cấm`, inline: false },
//                             { name: 'Link đã bị xóa', value: message.content, inline: true },
//                             { name: 'Kênh', value: `<#${message.channel.id}>`, inline: true }
//                         )
//                         .setColor('#2f3136')
//                         .setTimestamp();

//                     logChannel.send({ content: `<@${message.author.id}>`, embeds: [logEmbed] });
//                 }
//             }
//         }
//     }
// };


const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const AutoMod = require('../../schemas/autoModSchema');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',

    async execute(message) {

        // // Kiểm tra trạng thái của sự kiện này
        // const eventStatus = await EventStatus.findOne({ event: 'anti-link' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (message.author.bot || !message.guild) return;

        const guildConfig = await AutoMod.findOne({ guildId: message.guild.id });
        if (!guildConfig) return; 
        const logChannel = guildConfig.logChannelId ? message.guild.channels.cache.get(guildConfig.logChannelId) : null;

        // Kiểm tra nếu kênh này được cấu hình để chống liên kết
        if (guildConfig.antiLinkChannels.includes(message.channel.id)) {
            if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

            const discordLinkRegex = /discord(?:\.com|\.gg|app\.com)\/(?:[a-zA-Z0-9-]{2,32})/;
            if (discordLinkRegex.test(message.content)) {
                await message.delete();

                const warningEmbed = new EmbedBuilder()
                    .setDescription(`Kênh <#${message.channel.id}> đã bật **\`AutoMod - AntiLink\`**.`)
                    .setColor('#2f3136')

                await message.channel.send({ content: `<@${message.author.id}>`, embeds: [warningEmbed] });

                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('AutoMod')
                        .addFields(
                            { name: 'Người dùng', value: `\`${message.author.tag}\`\nID: \`${message.author.id}\` đã gửi link bị cấm`, inline: false },
                            { name: 'Link đã bị xóa', value: message.content, inline: true },
                            { name: 'Kênh', value: `<#${message.channel.id}>`, inline: true }
                        )
                        .setColor('#2f3136')
                        .setTimestamp();

                    logChannel.send({ content: `<@${message.author.id}>`, embeds: [logEmbed] });
                }
            }
        }
    }
};
