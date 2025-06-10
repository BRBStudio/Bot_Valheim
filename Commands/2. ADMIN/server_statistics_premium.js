const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/premiumUserSchema');
const PremiumCode = require('../../schemas/premiumSchema');
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server_statistics')
        .setDescription(`🔹 Thống kê máy chủ chỉ dành cho BQT`),
    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/server_statistics' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const QBD = config.specialUsers.includes(interaction.user.id);

        // Nếu không phải người dùng đặc biệt thì kiểm tra quyền admin
        if (!QBD) {
            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;
        }

        // Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user || !user.isPremium) {
        return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh ***server_statistics***. Vui lòng đăng ký premium để sử dụng.', ephemeral: true });
        }

        // Kiểm tra xem người dùng có mã premium và mã đó còn hạn hay không
        const currentTime = new Date();
        if (user.premiumUntil && user.premiumUntil < currentTime) {
            return interaction.reply({ content: 'Mã premium của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng lệnh ***server_statistics***.', ephemeral: true });
        }
        // if (!user || !user.isPremium || (user.premiumUntil && user.premiumUntil < currentTime)) {
        //     return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này hoặc mã premium của bạn đã hết hạn. Vui lòng đăng ký hoặc gia hạn premium để sử dụng.', ephemeral: true });
        // }

        // Kiểm tra xem người dùng có mã premium hay không
        // const premiumCode = await PremiumCode.findOne({ user: interaction.user.id });
        // if (!premiumCode || !premiumCode.isUsed) {
        //   return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng nhập mã premium để sử dụng.', ephemeral: true });
        // }


        function refreshNewMembersData() {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
            const newMembers = interaction.guild.members.cache.filter(member => member.joinedTimestamp > twentyFourHoursAgo);
            newMembersCount = newMembers.size;
            newMemberNames = newMembers.map(member => member.user.displayName).join('\n- ');
        }

        let newMembersCount = 0;
        let newMemberNames = '';

        refreshNewMembersData();

        setInterval(() => {
            refreshNewMembersData();
        }, 24 * 60 * 60 * 1000);

        const memberCount = interaction.guild.memberCount;
        const roleCount = interaction.guild.roles.cache.filter(role => !role.managed && role.name !== '@everyone').size;
        const kenhvanban = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
        const kenhthoai = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;
        const kenhdiendan = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildForum).size;
        const danhmuc = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size;
        const restrictedCount = interaction.guild.members.cache.filter(member => member.communicationDisabledUntil).size;
        const banCount = (await interaction.guild.bans.fetch()).size;
        const privateChannelCount = interaction.guild.channels.cache.filter(channel => channel.permissionsLocked === true).size;


        let soluongbaiviet = '';
        interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildForum).forEach(forumChannel => {
            const threadCount = forumChannel.threads.cache.size;
            soluongbaiviet += `\n${forumChannel.name}: ${threadCount}`;
        });

        let danhMucThongTin = '';
        interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).forEach(category => {
            const channelsInCategory = interaction.guild.channels.cache.filter(channel => channel.parentId === category.id);
            const sortedChannels = channelsInCategory.sort((a, b) => {
                if (a.type === ChannelType.GuildForum) return -1;
                if (b.type === ChannelType.GuildForum) return 1;
                if (a.type === ChannelType.GuildText && a.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel)) && b.type === ChannelType.GuildText && !b.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel))) return -1;
                if (a.type === ChannelType.GuildText && !a.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel)) && b.type === ChannelType.GuildText && b.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel))) return 1;
                if (a.type === ChannelType.GuildText) return -1;
                if (b.type === ChannelType.GuildText) return 1;
                if (a.type === ChannelType.GuildVoice && a.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel)) && b.type === ChannelType.GuildVoice && !b.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel))) return -1;
                if (a.type === ChannelType.GuildVoice && !a.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel)) && b.type === ChannelType.GuildVoice && b.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel))) return 1;
                if (a.type === ChannelType.GuildVoice) return -1;
                if (b.type === ChannelType.GuildVoice) return 1;
                return 0;
            });

            const channelInfo = sortedChannels.map(channel => {
                let channelTypeIcon;
                if (channel.type === ChannelType.GuildText) {
                    channelTypeIcon = channel.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel)) ? '💬🔒' : '💬';
                } else if (channel.type === ChannelType.GuildVoice) {
                    channelTypeIcon = channel.permissionOverwrites.cache.some(po => po.type === 0 && po.allow.has(PermissionsBitField.Flags.ViewChannel)) ? '🔊🔒' : '🔊';
                } else if (channel.type === ChannelType.GuildForum) {
                    channelTypeIcon = '💰 kênh chủ đề';
                }
                return `- ${channel.name} (${channelTypeIcon})`;
            }).join('\n\n');

            danhMucThongTin += `\nDANH MỤC: ${category.name} (${channelsInCategory.size})\n\n${channelInfo}\n`;
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Lệnh đếm số lượng trong máy chủ` })
            .setTitle(`${client.user.username} THỐNG KÊ SỐ LƯỢNG TẤT CẢ CÓ TRONG MÁY CHỦ`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: `${client.user.username} Số lượng thành viên`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
            .setDescription(`
                \`\`\`diff\n+Số lượng thành viên:\n${memberCount}\`\`\`
                \`\`\`diff\n+Số lượng vai trò:\n${roleCount}\`\`\`
                \`\`\`diff\n+Số lượng kênh văn bản:\n${kenhvanban}\`\`\`
                \`\`\`diff\n+Số lượng kênh thoại:\n${kenhthoai}\`\`\`
                \`\`\`diff\n+Số lượng kênh khóa:\n${privateChannelCount}\`\`\`
                \`\`\`diff\n+Số lượng kênh diễn đàn:\n${kenhdiendan}\`\`\`
                \`\`\`diff\n+Số lượng bài viết trong kênh diễn đàn:\n${soluongbaiviet}\`\`\`
                \`\`\`diff\n+Số lượng danh mục:\n${danhmuc}\`\`\`
                \`\`\`diff\n+Số lượng thành viên bị hạn chế (timeout):\n${restrictedCount}\`\`\`
                \`\`\`diff\n+Số lượng thành viên bị cấm (ban):\n${banCount}\`\`\`
                \`\`\`diff\n+Số lượng và danh sách thành viên mới trong 24 giờ qua:\n\nSố lượng thành viên mới thêm: ${newMembersCount}\nDanh sách thành viên mới thêm:\n- ${newMemberNames}\`\`\`
                \`\`\`diff\n+TT đầy đủ danh mục và các kênh bên trong:\n\nSỐ LƯỢNG DANH MỤC: ${danhmuc}\n${danhMucThongTin}\`\`\`
            `)
            .setColor('Red');

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};