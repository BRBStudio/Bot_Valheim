const { SlashCommandSubcommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('create')
        .setDescription('Tạo sự kiện phát trực tiếp trên Discord')
        .addStringOption(o => o
            .setName('tensukien')
            .setDescription('Nhập chủ đề sự kiện')
            .setRequired(true))
        .addStringOption(o => o
            .setName('mota')
            .setDescription('Mô tả sự kiện')
            .setRequired(true))
        .addStringOption(o => o
            .setName('thoigian')
            .setDescription('Thời gian bắt đầu, ghi rõ giờ và ngày theo đúng định dạng (vd: 01:24 16-05-2025 hoặc 1:24 16/5/2025)')
            .setRequired(true))
        .addStringOption(o => o
            .setName('noitochuc')
            .setDescription('Chọn nơi sự kiện diễn ra')
            .addChoices(
                { name: 'Kênh thoại (Voice)', value: 'VOICE' },
                { name: 'Kênh sân khấu (Stage)', value: 'STAGE' },
                { name: 'Ngoài Discord (External)', value: 'EXTERNAL' },
                { name: 'Livestream (YouTube/Twitch)', value: 'LIVESTREAM' }
            )
            .setRequired(true))
        .addChannelOption(o => o
            .setName('kenh')
            .setDescription('Địa điểm diễn ra sự kiện ( dành cho nơi diễn ra sự kiện như voice hoặc sân khấu )')
            .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
            .setRequired(false))
        .addStringOption(o => o
            .setName('diadiem')
            .setDescription('Địa điểm diễn ra sự kiện ( dành cho nơi diễn ra sự kiện như ngoài Discord )')
            .setRequired(false))
        .addStringOption(o => o
            .setName('link')
            .setDescription('Link livestream YouTube ( dành riêng cho lựa chọn Livestream (YouTube/Twitch) ) ')
            .setRequired(false))
        .addAttachmentOption(o => o
            .setName('hinhanh')
            .setDescription('Ảnh minh họa cho sự kiện')
            .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        

        // if (!interaction.guild.features.includes('COMMUNITY')) {
        //     return interaction.reply({
        //     content: '❌ Máy chủ này chưa bật tính năng **Cộng đồng** nên không thể tạo sự kiện. Bạn có thể bật tại: **Server Settings > Enable Community** ( cài đặt máy chủ > Kích hoạt cộng đồng ).',
        //     ephemeral: true,
        //     });
        // }

        const name = interaction.options.getString('tensukien');
        const type = interaction.options.getString('noitochuc');
        const channel = interaction.options.getChannel('kenh');
        const location = interaction.options.getString('diadiem');
        const description = interaction.options.getString('mota');
        const timeStr = interaction.options.getString('thoigian');
        const imageAttachment = interaction.options.getAttachment('hinhanh');
        const livestreamLink = interaction.options.getString('link');

        // Parse thời gian
        // const timeRegex = /^(\d{1,2}):(\d{2}) (\d{1,2})-(\d{1,2})-(\d{4})$/;
        const timeRegex = /^(\d{1,2}):(\d{1,2}) (\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/;
        const match = timeStr.match(timeRegex);

        if (!match) {
            return interaction.editReply({
                content: '❌ Định dạng thời gian không hợp lệ. Hãy dùng định dạng: `01:24 16-05-2025` hoặc `1:24 16-5-2025`',
                ephemeral: true,
            });
        }

        const [, hour, minute, day, month, year] = match.map(Number);
        const startTime = new Date(year, month - 1, day, hour, minute);

        // Kiểm tra thời gian hợp lệ
        if (isNaN(startTime.getTime()) || startTime < new Date()) {
            return interaction.editReply({
                content: '❌ Thời gian bắt đầu không hợp lệ hoặc đã qua. Hãy kiểm tra lại.',
                ephemeral: true,
            });
        }

        // Format ngày giờ thành tiếng Việt <t:${Math.floor(startTime.getTime() / 1000)}:F>
        const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const weekday = weekdays[startTime.getDay()];
        const dd = startTime.getDate();
        const mm = startTime.getMonth() + 1;
        const yyyy = startTime.getFullYear();
        const hh = startTime.getHours().toString().padStart(2, '0');
        const min = startTime.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${weekday}, ngày ${dd} tháng ${mm} năm ${yyyy} lúc ${hh}:${min}`;

        // Xác định loại sự kiện
        let entityType;

        const createdAt = new Date().toLocaleString('vi-VN');

        let options = {
            name: `Chủ đề: ${name}`,
            description: `Nội dung sự kiện: ${description}\n\n👤 ${interaction.member?.displayName || interaction.user.tag} đã tạo sự kiện này bằng lệnh /events_online create (lúc ${createdAt})`,
            scheduledStartTime: startTime,
            privacyLevel: 2,
            reason: `Tạo bởi /events_online create của ${interaction.member?.displayName || interaction.user.tag}`,
        };

        if (type === 'VOICE') {
            entityType = 2;

            if (!channel || channel.type !== ChannelType.GuildVoice) {
                return interaction.editReply({ content: '❌ Bạn phải chọn kênh thoại hợp lệ.', ephemeral: true });
            }

            if (location || livestreamLink) {
                return interaction.editReply({ content: '❌ Không được nhập địa điểm hoặc link cho sự kiện thoại.', ephemeral: true });
            }

            options.entityType = entityType;
            options.channel = channel.id;

        } else if (type === 'STAGE') {
            entityType = 1;
            
            if (!channel || channel.type !== ChannelType.GuildStageVoice) {
                return interaction.editReply({ content: '❌ Bạn phải chọn kênh sân khấu hợp lệ.', ephemeral: true });
            }

            if (location || livestreamLink) {
                return interaction.editReply({ content: '❌ Không được nhập địa điểm hoặc link cho sự kiện sân khấu.', ephemeral: true });
            }

            options.entityType = entityType;
            options.channel = channel.id;

        } else if (type === 'EXTERNAL') {
            entityType = 3;

            if (!location) {
                return interaction.editReply({ content: '❌ Bạn cần cung cấp địa điểm diễn ra sự kiện.', ephemeral: true });
            }

            if (channel || livestreamLink) {
                return interaction.editReply({ content: '❌ Không được chọn kênh hoặc nhập link cho sự kiện ngoài Discord.', ephemeral: true });
            }

            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Mặc định kéo dài 1 giờ
            options.entityType = entityType;
            options.entityMetadata = { location };
            options.scheduledEndTime = endTime;

        } else if (type === 'LIVESTREAM') {
            if (!livestreamLink || !livestreamLink.startsWith('http')) {
                return interaction.editReply({ content: '❌ Bạn cần nhập link livestream hợp lệ.', ephemeral: true });
            }

            if (channel || location) {
                return interaction.editReply({ content: '❌ Không được chọn kênh hoặc nhập địa điểm cho sự kiện livestream.', ephemeral: true });
            }

            entityType = 3;
            options.entityType = entityType;
            options.entityMetadata = { location: livestreamLink };
            options.scheduledEndTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        }

        // Nếu có ảnh
        if (imageAttachment) {
            try {
                const response = await fetch(imageAttachment.url);
                const buffer = await response.arrayBuffer();
                options.image = Buffer.from(buffer);
            } catch (e) {
                return interaction.editReply({ content: '❌ Ảnh không hợp lệ hoặc không tải được.', ephemeral: true });
            }
        }

        try {
            const event = await interaction.guild.scheduledEvents.create(options);

        // Tạo hoặc lấy một invite (nếu chưa có)
        let invite = null;
        const systemChannel = interaction.guild.systemChannel || interaction.guild.channels.cache.find(
            c => c.type === ChannelType.GuildText && c.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
        );

        if (systemChannel) {
            invite = await systemChannel.createInvite({ maxAge: 0, maxUses: 0, reason: 'Tạo để chia sẻ sự kiện' });
        }

        const link = invite
            ? `https://discord.gg/${invite.code}?event=${event.id}`
            : `Sự kiện đã tạo thành công nhưng không thể tạo link chia sẻ do thiếu quyền tạo invite.`;

            await interaction.editReply({ content: `✅ Đã tạo sự kiện: **${event.name}** bắt đầu vào ${formattedDate}\n🔗 Sao chép link để mời mọi người tham gia sự kiện của bạn. Liên kết này cũng là liên kết mời vào máy chủ: ${link}`, ephemeral: true });
        } catch (err) {
            console.error('Lỗi tạo sự kiện:', err);
            await interaction.editReply({
                content: '❌ Lỗi khi tạo sự kiện. Hãy kiểm tra lại quyền bot và đầu vào.',
                ephemeral: true,
            });
        }
    }
};