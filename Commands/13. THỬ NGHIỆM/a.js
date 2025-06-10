const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, ChannelType } = require('discord.js');

// Tạo nhóm lệnh con "config"
const configGroup = new SlashCommandSubcommandGroupBuilder()
    .setName('config')
    .setDescription('⚙️ Cấu hình kênh')
    .addSubcommand(subcommand =>
        subcommand
            .setName('text')
            .setDescription('📝 Thiết lập kênh văn bản')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Chọn kênh văn bản')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('voice')
            .setDescription('🎙️ Thiết lập kênh thoại')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Chọn kênh thoại')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildVoice)
            )
    );

// Tạo nhóm lệnh con "edit"
const editGroup = new SlashCommandSubcommandGroupBuilder()
    .setName('edit')
    .setDescription('✏️ Chỉnh sửa kênh')
    .addSubcommand(subcommand =>
        subcommand
            .setName('name')
            .setDescription('📝 Đổi tên kênh')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Chọn kênh cần đổi tên')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('new_name')
                    .setDescription('Tên mới cho kênh')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('topic')
            .setDescription('💬 Đổi tên kênh thoại')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Chọn kênh thoại cần đổi tên')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildVoice) // Chỉ cho phép kênh thoại
            )
            .addStringOption(option =>
                option
                    .setName('new_topic')
                    .setDescription('Tên mới cho kênh thoại')
                    .setRequired(true)
            )
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_channel')
        .setDescription('🔹 Thiết lập kênh')
        .addSubcommandGroup(configGroup)
        .addSubcommandGroup(editGroup)
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('🗑️ Xóa thiết lập kênh')
        ),

    guildSpecific: true,
    guildId: ['1319809040032989275', '1312185401347407902', '1319947820991774753'],

    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        const subcommand = interaction.options.getSubcommand();

        // Xử lý nhóm "config"
        if (subcommandGroup === 'config') {
            const channel = interaction.options.getChannel('channel');
            
            if (subcommand === 'text') {
                return interaction.reply(`✅ Đã thiết lập kênh văn bản: ${channel}`);
            }

            if (subcommand === 'voice') {
                return interaction.reply(`✅ Đã thiết lập kênh thoại: ${channel}`);
            }
        }

        // Xử lý nhóm "edit"
        if (subcommandGroup === 'edit') {
            const channel = interaction.options.getChannel('channel');

            if (!channel.manageable) {
                return interaction.reply({ content: '❌ Bot không có quyền chỉnh sửa kênh này!', ephemeral: true });
            }

            if (subcommand === 'name') {
                const newName = interaction.options.getString('new_name');

                try {
                    await channel.setName(newName);
                    return interaction.reply(`✅ Đã đổi tên kênh thành **${newName}**`);
                } catch (error) {
                    console.error(error);
                    return interaction.reply({ content: '❌ Không thể đổi tên kênh!', ephemeral: true });
                }
            }

            if (subcommand === 'topic') {
                const newTopic = interaction.options.getString('new_topic');

                try {
                    await channel.setName(newTopic);
                    return interaction.reply(`✅ Đã đổi tên kênh thoại thành: **${newTopic}**`);
                } catch (error) {
                    console.error(error);
                    return interaction.reply({ content: '❌ Không thể đổi tên kênh thoại!', ephemeral: true });
                }
            }
        }

        // Xử lý lệnh "reset"
        if (subcommand === 'reset') {
            return interaction.reply('♻️ Đã xóa thiết lập kênh.');
        }
    }
};
