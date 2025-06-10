const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, PermissionsBitField } = require('discord.js'); 
const votes = require('../../schemas/Vote_open_valheim');

module.exports = {
    mgmt: true,
    data: new SlashCommandBuilder()
        .setName('vote_valheim')
        .setDescription('🔹 Tạo cuộc bỏ phiếu mở server Valheim')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Tên server đề cử')
                .setRequired(true),
        )
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Mã tham gia')
                .setRequired(true),
        )
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Số phiếu bầu cần thiết')
                .setRequired(true),
        ),

    // guildSpecific: true,
    // guildId: ['1319809040032989275', '1312185401347407902'], // , '1312185401347407902', '1319947820991774753'

    async execute(interaction, client) {
        // // Kiểm tra quyền ADMIN của người dùng
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        //     return await interaction.reply({ content: '❌ Bạn cần có quyền **ADMIN** để thực hiện lệnh này.', ephemeral: true });
        // }

        // Kiểm tra quyền ADMIN của bot
        const botMember = await interaction.guild.members.fetchMe();
        if (!botMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: '❌ Bot cần có quyền **ADMIN** để thực hiện lệnh này.', ephemeral: true });
        }

        const server = interaction.options.getString('name').toLowerCase();
        const code = interaction.options.getString('code').toLowerCase();
        const number = interaction.options.getInteger('number'); // Lấy số phiếu bầu cần thiết
        const channel = interaction.channel;

        // Kiểm tra quyền gửi tin nhắn của bot trong kênh hiện tại
        if (!channel.permissionsFor(botMember).has(PermissionsBitField.Flags.SendMessages)) {
            return await interaction.reply({ content: '❌ Bot không có quyền gửi tin nhắn trong kênh này!', ephemeral: true });
        }

        // await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        await interaction.deferReply({ ephemeral: true });


        // Kiểm tra xem đã có cuộc bỏ phiếu nào đang diễn ra trong server này không
        const existingVote = await votes.findOne({ Guild: interaction.guild.id });
        if (existingVote) {
            return await interaction.editReply({ content: '⚠️ Đã có một cuộc bỏ phiếu mở server đang diễn ra trong máy chủ này. Vui lòng kết thúc trước khi tạo cuộc bỏ phiếu mới.' });
        }

        // Tạo Embed cho cuộc bỏ phiếu
        const poll = new EmbedBuilder()
            .setColor('Gold')
            .setAuthor({ name: 'Valheim Roleplay' })
            .setTitle(`🚀 Bỏ phiếu mở Server!`)
            .setDescription(`Một cuộc bỏ phiếu để mở server **Valheim Roleplay** vừa được khởi động! Nếu bạn bỏ phiếu, bạn có thể tham gia sever!`)
            .addFields({ name: '> 🏰 Thông tin Server:', value: `**🔹 Tên server:** ${server}\n**🔹 Mã tham gia:** ${code}\n**🔹 Chủ Server:** ${interaction.user}\n\n**⚠️ ${number} PHIẾU BẦU CẦN THIẾT!**` })
            .addFields({ name: '> 📊 Số phiếu bầu:', value: `🔘 **Chưa có ai bỏ phiếu**` }) // 🔘 **Chưa có ai bỏ phiếu**
            .setTimestamp();

        // Tạo nút bỏ phiếu
        const reaction = new ButtonBuilder()
            .setCustomId('sever_valheim_reaction')
            .setLabel(`🗳️ Bỏ phiếu`)
            .setStyle(ButtonStyle.Primary);

        // Nút xem danh sách người đã bỏ phiếu
        const voters = new ButtonBuilder()
            .setCustomId('sever_valheim_membervotes')
            .setLabel(`👥 Danh sách phiếu`)
            .setStyle(ButtonStyle.Secondary);
        
        // Nút kết thúc bỏ phiếu
        const endVote = new ButtonBuilder()
            .setCustomId('sever_valheim_end')
            .setLabel(`🛑 Kết thúc bỏ phiếu`)
            .setStyle(ButtonStyle.Danger);

        const rows = new ActionRowBuilder().addComponents(reaction, voters, endVote);

        // Gửi phản hồi cho người dùng
        await interaction.editReply({ content: `✅ Đã tạo cuộc bỏ phiếu mở server **Valheim Roleplay** theo yêu cầu của bạn tại <#${channel.id}>` });

        // Gửi thông báo đến **kênh hiện tại**
        const msg = await channel.send({ content: `@everyone, một cuộc bỏ phiếu mở server **Valheim Roleplay** đã bắt đầu!`, embeds: [poll], components: [rows] });
        // console.log(`📢 Đã gửi cuộc bỏ phiếu mở server Valheim tại kênh: ${channel.name}`);

        // Lưu dữ liệu vào database
        await votes.create({
            Msg: msg.id,
            TotalVotes: 0,
            Server: server,
            Code: code,
            Vote_request: number,
            Guild: interaction.guild.id, // Lưu ID máy chủ để tách biệt dữ liệu
            Owner: interaction.user.id,
            Voters: []
        });
    }
};
