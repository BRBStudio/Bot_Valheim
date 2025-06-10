const { EmbedBuilder, ChannelType, SlashCommandBuilder, ActionRowBuilder, ComponentType, ButtonBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('@napi-rs/canvas');
const axios = require('axios');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info_server')
        .setDescription('🔹 Hiển thị thông tin về máy chủ'),
    
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/info_server' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const guild2 = interaction.guild;
        const owner = await guild2.fetchOwner();

        const serverIds = ['1028540923249958912']; 
        const emojis = {
            'PD_Online': '\:green_circle:',
            'PD_Offline': `\:red_circle:`,
            'booster': '\:star:',
            'a_secure': '\:lock:',
            'paramembers': '\:busts_in_silhouette:'
        };

        interaction.client.guilds.cache.forEach(guild => {
            if (serverIds.includes(guild.id)) {
                guild.emojis.cache.forEach(emoji => {
                emojis[emoji.name] = emoji;
                });
            }
        });

        const online = emojis['PD_Online']
        const offline = emojis['PD_Offline']
        const boost = emojis['booster'];
        const secure = emojis['a_secure'];
        const members2 = emojis['paramembers'];

        const textChannels = guild2.channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild2.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
        const categoryChannels = guild2.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;
        const totalMembers = guild2.memberCount;
        const onlineMembers = guild2.presences.cache.filter((presence) => presence.status !== 'offline').size;
        const offlineMembers = totalMembers - onlineMembers;
        const totalBots = guild2.members.cache.filter((m) => m.user.bot).size;
        const totalRoles = guild2.roles.cache.size;
        const totalEmojis = guild2.emojis.cache.size + guild2.stickers.cache.size;
        const verifyLevel = guild2.verificationLevel;
        const bots = guild2.members.cache.filter((member) => member.user.bot);
        const botCount = bots.size;

        const vanityURL = guild2.vanityURLCode || 'non';
        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };

        const boostLevel = getBoostLevel(guild2.premiumSubscriptionCount);
        const features = interaction.guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None"
        const channels = interaction.guild.channels.cache.size;
        const category = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size
        const text = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
        const voice = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
        const annnouncement = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement).size
        const stage = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size
        const forum = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size
        const thread = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size
        const embedMessage = new EmbedBuilder()
            .setColor('#1fbdd2')
            .setTitle('Server Info')
            .setDescription(`**Server Descrtipion:**\n _${guild2.description || 'Không có mô tả'}_\n`)
            .setThumbnail(guild2.iconURL({ dynamic: true }))
            .addFields(
                { name: '> Server Name', value: `- **${guild2.name}**`, inline: true },
                { name: '> Server Owner', value: `- **${owner}** :crown:`, inline: true },
                { name: '> Server ID', value: `- ${guild2.id}`, inline: true },
                { name: '> Members', value: `- ${members2} Member:**${totalMembers}**\n- 🤖 Bots : **${botCount}**`, inline: true },
                {
                name: '> Status',
                value: `- ${online} Online: **${onlineMembers}**\n- ${offline} Offline: **${offlineMembers}**`,
                inline: true,
                },
                { name: `> Boost Level: ${boost}`, value: `- Level:${boostLevel} \n- Boosts: **${guild2.premiumSubscriptionCount}**`, inline: true },
                { name: '> Link 🔗', value: `-  Custom:  ${interaction.guild.vanityURLCode || "None"}`, inline: true },
                { name: '> Roles', value: `- 🏅 Roles: **${totalRoles}**`, inline: true },

                { name: `> Verification ${secure}`, value: `- Level: **${verifyLevel}**`, inline: true },
                
                {
                name: '> Channels',
                value: `- 📝 Text: **${textChannels}**\n- 🔊 Voice: **${voiceChannels}**\n- 📁Category:**${categoryChannels}**`,
                inline: true,
                },
                {
                name: '> Created On 📅',
                value: `- <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R> \n- <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:d>\n- <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:t>`,
                inline: true,
                },

                {
                name: `> Emojis ${totalEmojis}`,
                value: `- 😀 Static: **${guild2.emojis.cache.filter(emoji => !emoji.animated).size}**\n- 📺Animated:**${guild2.emojis.cache.filter(emoji => emoji.animated).size}**\n- :label: Stickers: **${guild2.stickers.cache.size}**`,
                inline: true,
                },
                { name: `> Channels ${channels}`,
                value: `-  ⏺️ ${category} | 📝 ${text} | 🔊 ${voice} | 🔔 ${annnouncement} | 🎙️ ${stage} | 📢 ${forum} | 🔗 ${thread}`, inline: false},
                { name: `> Features`, value: `\`\`\`${features}\`\`\``},

            )
            .setFooter({ text: `Được yêu cầu bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        if (guild2.banner) {
            embedMessage.setImage(guild2.bannerURL({ dynamic: true }));
        }

        const row1 = new ActionRowBuilder().addComponents(                    
            
                        new ButtonBuilder()
                            .setCustomId('serverinfo')
                            .setLabel('Thông tin máy chủ')
                            .setDisabled(true)
                            .setStyle('Secondary'),

                        new ButtonBuilder()
                            .setCustomId('servermemberinfo')
                            .setLabel('Biểu đồ đơn giản')
                            .setStyle('Secondary')
                    )

        const row2 = new ActionRowBuilder().addComponents(

                        new ButtonBuilder()
                            .setCustomId('serverinfo')
                            .setLabel('Thông tin máy chủ')
                            .setStyle('Secondary'),

                        new ButtonBuilder()
                            .setCustomId('servermemberinfo')
                            .setLabel('Biểu đồ đơn giản')
                            .setDisabled(true)
                            .setStyle('Secondary')
                    )
        const guild = await interaction.guild;
        const members = await guild.members.fetch();

        const memberCount = members.filter(member => !member.user.bot).size;
        const botCount2 = members.filter(member => member.user.bot).size;

        const total = memberCount + botCount2;
        const memberRatio = memberCount / total;
        const botRatio = botCount2 / total;

        const canvasWidth = 1200;
        const canvasHeight = 600;

        const circleSize1 = 500;
        const circleRadius1 = circleSize1 / 2 - 50;
        const centerX1 = 250;
        const centerY1 = 300;

        const circleSize2 = 300;
        const circleRadius2 = circleSize2 / 2 - 20;
        const centerX2 = 820;
        const centerY2 = 300;

        
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(centerX1, centerY1, circleRadius1, 0, 2 * Math.PI);
        ctx.fillStyle = '#009CFF'; 
        ctx.fill();

        const botStartAngle = -Math.PI / 2; 
        const botEndAngle = botStartAngle + 2 * Math.PI * botRatio;
        ctx.beginPath();
        ctx.moveTo(centerX1, centerY1); 
        ctx.arc(centerX1, centerY1, circleRadius1, botStartAngle, botEndAngle);
        ctx.fillStyle = '#0000FF'; 
        ctx.fill();

        const memberStartAngle = botEndAngle;
        const memberEndAngle = memberStartAngle + 2 * Math.PI * memberRatio;
        ctx.beginPath();
        ctx.moveTo(centerX1, centerY1);
        ctx.arc(centerX1, centerY1, circleRadius1, memberStartAngle, memberEndAngle);
        ctx.fillStyle = '#8E60E2'; 
        ctx.fill();

        const legendBoxWidth1 = 258;
        const legendBoxHeight1 = 90;
        const legendBoxX1 = centerX1 + circleRadius1 - 15 ;
        const legendBoxY1 = 130 + centerY1 - legendBoxHeight1 / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(legendBoxX1, legendBoxY1, legendBoxWidth1, legendBoxHeight1);

        const botLegendBoxX1 = legendBoxX1 + 10;
        const botLegendBoxY1 = legendBoxY1 + 10;
        const botLegendBoxSize1 = 20;

        ctx.fillStyle = '#0000FF';
        ctx.fillRect(botLegendBoxX1, botLegendBoxY1, botLegendBoxSize1, botLegendBoxSize1);

        const botLegendTextX1 = botLegendBoxX1 + botLegendBoxSize1 + 5;
        const botLegendTextY1 = botLegendBoxY1 + botLegendBoxSize1 / 2;

        ctx.fillStyle = '#000000';
        ctx.font = '22px Arial';
        ctx.fillText(`Bots: ${botRatio < 0.01 ? 'Very Low' : (botRatio.toFixed(2) * 100).toFixed(2)}%`, botLegendTextX1, botLegendTextY1 + 10);

        const memberLegendBoxX1 = legendBoxX1 + 10;
        const memberLegendBoxY1 = botLegendBoxY1 + botLegendBoxSize1 + 10;

        ctx.fillStyle = '#8E60E2';
        ctx.fillRect(memberLegendBoxX1, memberLegendBoxY1, botLegendBoxSize1, botLegendBoxSize1);

        const memberLegendTextX1 = memberLegendBoxX1 + botLegendBoxSize1 + 5;
        const memberLegendTextY1 = memberLegendBoxY1 + botLegendBoxSize1 / 2;

        ctx.fillStyle = '#000000'; 
        ctx.font = '22px Arial';
        ctx.fillText(`Members: ${memberRatio < 0.01 ? 'Very Low' : (memberRatio.toFixed(2) * 100).toFixed(2)}%`, memberLegendTextX1, memberLegendTextY1 + 10);

        ctx.beginPath();
        ctx.arc(centerX2, centerY2, circleRadius2, 0, 2 * Math.PI);
        ctx.fillStyle = '#009CFF';
        ctx.fill();

        const onlineCount = members.filter(member => member.presence?.status === 'online').size;
        const dndCount = members.filter(member => member.presence?.status === 'dnd').size;
        const idleCount = members.filter(member => member.presence?.status === 'idle').size;
        const offlineCount = members.filter(member => !member.presence || member.presence?.status === 'offline').size;

        const presenceColors = ['#00FF00', '#FF0000', '#FFFF00', '#808080'];
        const presenceRatios = [onlineCount / total, dndCount / total, idleCount / total, offlineCount / total];

        let currentAngle2 = -Math.PI / 2;

        presenceRatios.forEach((ratio, index) => {
            const startAngle2 = currentAngle2;
            const endAngle2 = currentAngle2 + 2 * Math.PI * ratio;

            const color2 = presenceColors[index];

            ctx.beginPath();
            ctx.moveTo(centerX2, centerY2);
            ctx.arc(centerX2, centerY2, circleRadius2, startAngle2, endAngle2);
            ctx.fillStyle = color2;
            ctx.fill();

            currentAngle2 = endAngle2;
        });

        const legendBoxWidth2 = 250;
        const legendBoxHeight2 = 140;
        const legendBoxX2 = centerX2 + circleRadius2 - 15;
        const legendBoxY2 = 140 + centerY2 - legendBoxHeight2 / 2;

        ctx.fillStyle = '#FFFFFF'; 
        ctx.fillRect(legendBoxX2, legendBoxY2, legendBoxWidth2, legendBoxHeight2);

        const onlineLegendBoxX2 = legendBoxX2 + 10;
        const onlineLegendBoxY2 = legendBoxY2 + 10;
        const onlineLegendBoxSize2 = 20;

        ctx.fillStyle = '#00FF00'; 
        ctx.fillRect(onlineLegendBoxX2, onlineLegendBoxY2, onlineLegendBoxSize2, onlineLegendBoxSize2);

        const onlineLegendTextX2 = onlineLegendBoxX2 + onlineLegendBoxSize2 + 5;
        const onlineLegendTextY2 = onlineLegendBoxY2 + onlineLegendBoxSize2 / 2;

        ctx.fillStyle = '#000000'; 
        ctx.font = '22px Arial';

        const onlinePercentage = (onlineCount / total * 100).toFixed(2);
        const displayText = (onlinePercentage === '0.00') ? '0%' : (onlinePercentage < 0.01) ? 'Very Low' : `${onlinePercentage}%`;

        ctx.fillText(`Online: ${displayText}`, onlineLegendTextX2, onlineLegendTextY2 + 10);
        const dndLegendBoxX2 = legendBoxX2 + 10;
        const dndLegendBoxY2 = onlineLegendBoxY2 + onlineLegendBoxSize2 + 10;

        ctx.fillStyle = '#FF0000'; 
        ctx.fillRect(dndLegendBoxX2, dndLegendBoxY2, onlineLegendBoxSize2, onlineLegendBoxSize2);

        const dndLegendTextX2 = dndLegendBoxX2 + onlineLegendBoxSize2 + 5;
        const dndLegendTextY2 = dndLegendBoxY2 + onlineLegendBoxSize2 / 2;

        ctx.fillStyle = '#000000';
        ctx.font = '22px Arial';
        const dndPercentage = (dndCount / total * 100).toFixed(2);
        const dndDisplayText = (dndPercentage === '0.00') ? '0%' : (dndPercentage < 0.01) ? 'Very Low' : `${dndPercentage}%`;
        ctx.fillText(`DND: ${dndDisplayText}`, dndLegendTextX2, dndLegendTextY2 + 10);

        const idleLegendBoxX2 = legendBoxX2 + 10;
        const idleLegendBoxY2 = dndLegendBoxY2 + onlineLegendBoxSize2 + 10;

        ctx.fillStyle = '#FFFF00'; 
        ctx.fillRect(idleLegendBoxX2, idleLegendBoxY2, onlineLegendBoxSize2, onlineLegendBoxSize2);

        const idleLegendTextX2 = idleLegendBoxX2 + onlineLegendBoxSize2 + 5;
        const idleLegendTextY2 = idleLegendBoxY2 + onlineLegendBoxSize2 / 2;

        ctx.fillStyle = '#000000';
        ctx.font = '22px Arial';
        const idlePercentage = (idleCount / total * 100).toFixed(2);
        const idleDisplayText = (idlePercentage === '0.00') ? '0%' : (idlePercentage < 0.01) ? 'Very Low' : `${idlePercentage}%`;
        ctx.fillText(`Idle: ${idleDisplayText}`, idleLegendTextX2, idleLegendTextY2 + 10);

        const offlineLegendBoxX2 = legendBoxX2 + 10;
        const offlineLegendBoxY2 = idleLegendBoxY2 + onlineLegendBoxSize2 + 10;

        ctx.fillStyle = '#808080'; 
        ctx.fillRect(offlineLegendBoxX2, offlineLegendBoxY2, onlineLegendBoxSize2, onlineLegendBoxSize2);

        const offlineLegendTextX2 = offlineLegendBoxX2 + onlineLegendBoxSize2 + 5;
        const offlineLegendTextY2 = offlineLegendBoxY2 + onlineLegendBoxSize2 / 2;

        ctx.fillStyle = '#000000';
        ctx.font = '22px Arial';
        const offlinePercentage = (offlineCount / total * 100).toFixed(2);
        const offlineDisplayText = (offlinePercentage === '0.00') ? '0%' : (offlinePercentage < 0.01) ? 'Very Low' : `${offlinePercentage}%`;
        ctx.fillText(`Offline: ${offlineDisplayText}`, offlineLegendTextX2, offlineLegendTextY2 + 10);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), 'server_chart.png');
        const serverinfo = await interaction.reply({ embeds: [embedMessage], components: [row1], ephemeral: true });

        const collector = serverinfo.createMessageComponentCollector({ componentType: ComponentType.Button, time: 150000 });

        collector.on('collect', async (i) => {
            if (i.user.id === interaction.user.id) {
                if (i.customId === 'serverinfo') {
                    await i.deferUpdate()
                    await serverinfo.edit({ embeds: [embedMessage], components: [row1], files: [], ephemeral: true });
                } else if (i.customId === 'servermemberinfo') {
                    await i.deferUpdate()
                    await serverinfo.edit({ files: [attachment], components: [row2], embeds: [], ephemeral: true });
                } 
            } else {
                i.reply({ content: `Những nút này không dành cho bạn!`, ephemeral: true });
            }
        });

        collector.on('end', async (collected) => {
            if (serverinfo && !serverinfo.deleted) {
                await serverinfo.edit({components: []});
            }
        });
    },
};

function getBoostLevel(boostCount) {
    if (boostCount >= 14) {
        return 3;
    } else if (boostCount >= 7) {
        return 2;
    } else if (boostCount >= 2) {
        return 1;
    } else {
        return 0;
    }
}
