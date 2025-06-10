const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');
const pingStaff = require('../../schemas/pingstaffSchema');
var timeout = [];

module.exports = {
    id: 'Ticket_Modals_Help',
    description: `Nút hỗ trợ ticket`,
    async execute(interaction, client) {
        try {

            const channelTopic = interaction.channel.topic;
            const ticketOwnerId = channelTopic?.match(/Người Sử dụng vé: (\d+)/)?.[1];

            if (!ticketOwnerId || interaction.user.id !== ticketOwnerId) {
                return await interaction.reply({ content: `🚫 Bạn không có quyền sử dụng nút này trong kênh vé này.`, ephemeral: true });
            }

            const data = await pingStaff.findOne({ Guild: interaction.guild.id });
            
            if (!data || !data.Roles || data.Roles.length === 0) {
                return await interaction.reply({ content: `Hệ thống ping chưa được kích hoạt.`, ephemeral: true });
            }
            
            // Tìm vai trò phù hợp để ping
            const channelName = interaction.channel.name;
            const expectedRole = data.Roles.find(role => {
                if (channelName.startsWith('discord-') && role.ChannelType === 'discord-') {
                    return true;
                } else if (channelName.startsWith('game-') && role.ChannelType === 'game-') {
                    return true;
                }
                return false;
            });
            
            if (!expectedRole) {
                                
                // return await interaction.reply({ content: `Chỉ áp dụng với kênh vé.`, ephemeral: true });
                                
                // Xác định loại kênh hiện tại
                const channelType = channelName.startsWith('discord-') ? 'discord' : (channelName.startsWith('game-') ? 'game' : '');
            
                // Kiểm tra nếu kênh không có tiền tố phù hợp
                if (!channelType) {
                    return await interaction.reply({ 
                        content: `Vui lòng sử dụng lệnh này trong kênh vé \`discord-\` hoặc \`game-\`.`,
                        ephemeral: true 
                    });
                }
            
                // Nếu có tiền tố nhưng không tìm thấy vai trò
                return await interaction.reply({ 
                    content: `Vai trò cho loại kênh vé ${channelType} chưa được thiết lập trong hệ thống ping. Vui lòng thiết lập vai trò tương ứng để sử dụng lệnh này.`,
                    ephemeral: true 
                });
            }
            
            if (timeout.includes(interaction.user.id)) {
                return await interaction.reply({ content: `Bạn đang trong thời gian hồi chiêu 1 phút cho lệnh này! Thử lại sau`, ephemeral: true });
            }
            
            const roleToPing = await interaction.guild.roles.fetch(expectedRole.RoleID);
            const membersToPing = interaction.guild.members.cache.filter(member => member.roles.cache.has(roleToPing.id))
                .filter(member => ['online', 'dnd', 'idle'].includes(member.presence?.status || ''));
            
            if (membersToPing.size === 0) {
                await interaction.reply({ content: `Không có ai trực tuyến trong vai trò ${roleToPing}... Thử lại sau`, ephemeral: true });
            } else {
                const memberList = membersToPing.map(member => member.toString()).join('\n+ ');
            
                const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`Các thành viên này sẽ hỗ trợ bạn! Hãy kiên nhẫn.`);
            
                await interaction.reply({ 
                        embeds: [embed], 
                        content: `\>\>\> **NHỮNG NGƯỜI ĐANG ONL TRONG VAI TRÒ <@&${roleToPing.id}> GỒM:**\n\n + ${memberList}\n\n`,
                        ephemeral: true
                    });

                // Gửi tin nhắn riêng đến từng thành viên
                membersToPing.forEach(async member => {
                try {
                        const dmEmbed = new EmbedBuilder()
                            .setColor('Yellow')
                            .setTitle('Yêu cầu hỗ trợ')
                            .setDescription(
                                `Người dùng **${interaction.user.displayName}** đang cần trợ giúp. Vui lòng đến kênh ${interaction.channel} để hỗ trợ họ.`
                            );
                                
                            await member.send({ embeds: [dmEmbed] });
                    } catch (error) {
                            console.error(`Không thể gửi tin nhắn cho ${member.user.displayName}:`, error);
                    }
                });
            
                timeout.push(interaction.user.id);
                setTimeout(() => {
                    timeout.shift();
                }, 60000);
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    }
}