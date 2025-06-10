// const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('give')
//     .setDescription('🎖️ | Cung cấp cho người dùng một vai trò.')
//     .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
//     .addUserOption(option =>
//       option.setName('user')
//         .setDescription('Người dùng giao vai trò cho.')
//         .setRequired(true))
//     .addRoleOption(option =>
//       option.setName('role')
//         .setDescription('hiện tại chỉ có thể cấp cho người dùng vai trò thành viên, mọi vai trò khác sẽ bị lỗi.')
//         .setRequired(true)),
//   async execute(interaction) {
//     const guild = interaction.guild;
//     const member = guild.members.cache.get(interaction.options.getUser('user').id);
//     const role = interaction.options.getRole('role');

//     try {
//       await member.roles.add(role);
//       await interaction.reply(`Vai trò ***${role.toString()}*** đã được thêm vào cho ${member.toString()}.`);
//     } catch (error) {
//       console.error(error);
//       await interaction.reply('Đã xảy ra lỗi khi đưa ra vai trò.');
//     }
//   },
// };



const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('🔹 Quản lý vai trò cho người dùng.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('🔹 Cung cấp cho người dùng một vai trò.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Người dùng giao vai trò cho.')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Chỉ có thể cấp vai trò thành viên, các vai trò khác sẽ bị lỗi.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-role')
                .setDescription('🔹 Xóa một vai trò của người dùng.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Người dùng mà bạn muốn xóa vai trò.')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Vai trò sẽ bị xóa.')
                        .setRequired(true))),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/give' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const guild = interaction.guild;
        const member = guild.members.cache.get(interaction.options.getUser('user').id);
        const role = interaction.options.getRole('role');

        try {
            if (interaction.options.getSubcommand() === 'role') {
                await member.roles.add(role);
                await interaction.reply(`Vai trò ***${role.toString()}*** đã được thêm vào cho ${member.toString()}.`);
            } else if (interaction.options.getSubcommand() === 'remove-role') {
                await member.roles.remove(role);
                await interaction.reply(`Vai trò ***${role.toString()}*** đã được xóa khỏi ${member.toString()}.`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Đã xảy ra lỗi khi thực hiện thao tác với vai trò.');
        }
    },
};
