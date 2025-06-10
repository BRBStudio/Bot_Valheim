const { SlashCommandBuilder } = require('discord.js');
const unpingSchemas = require(`../../schemas/unpingSchema`);
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untag')
        .setDescription('🔹 Thiết lập hoặc xóa thiết lập cấm tag người dùng.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('🔹 Thiết lập người dùng không bị tag.')
                .addUserOption(option => 
                    option.setName('user')
                          .setDescription('Chọn người dùng cần thiết lập.')
                          .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-setup')
                .setDescription('🔹 Xóa thiết lập người dùng không bị tag.')
                .addUserOption(option => 
                    option.setName('user')
                          .setDescription('Chọn người dùng cần xóa thiết lập.')
                          .setRequired(true))
        ),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/untag' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        if (subcommand === 'setup') {

            await unpingSchemas.findOneAndUpdate(
                { Guild: guildId, User: user.id },
                { $set: { Guild: guildId, User: user.id } },
                { upsert: true, new: true }
            );

            await interaction.reply(`Đã thiết lập người dùng ${user.displayName} trong máy chủ này không bị ping.`);
        } else if (subcommand === 'remove-setup') {

            await unpingSchemas.findOneAndDelete({ Guild: guildId, User: user.id });

            await interaction.reply(`Đã xóa thiết lập người dùng ${user.displayName} trong máy chủ này.`);
        }
    }
};
