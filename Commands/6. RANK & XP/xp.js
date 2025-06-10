const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require(`../../schemas/messagelevelSchema`);
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp`)
    .setDescription(`🔹 Đặt lại thành viên XP`)
    .addSubcommand(subcommand =>
                    subcommand
                        .setName('reset')
                        .setDescription('🔹 Đặt lại XP của thành viên về 0')
                        .addUserOption(option => option.setName(`user`).setDescription(`Thành viên bạn muốn xóa xp của`).setRequired(true)))
    .addSubcommand(subcommand =>
                    subcommand
                        .setName('all')
                        .setDescription('🔹 Đặt lại tất cả cấp độ XP của máy chủ')),

    async execute (interaction) {


        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/xpuse_reset' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const sub = interaction.options.getSubcommand();

        const guildName = interaction.guild.name;

        const perm = new EmbedBuilder()
        .setColor(`Blue`)
        .setDescription(`\`\`\`yml\n🏅 Bạn không có quyền đặt lại cấp độ xp trong máy chủ ${guildName}.\`\`\``)

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [ perm], ephemeral: true });

        const { guildId } = interaction;

        switch (sub) {
            case 'reset':

                const target = interaction.options.getUser(`user`);

                try {
                    await levelSchema.deleteMany({ Guild: guildId, User: target.id });

                    const embed = new EmbedBuilder()
                        .setColor(`Blue`)
                        .setDescription(`🏅 ${target.displayName} xp đã được thiết lập lại!`);

                    await interaction.reply({ embeds: [embed] });
                } catch (error) {
                    console.error("Lỗi khi xóa dữ liệu XP:", error);
                    await interaction.reply("⚠️ Đã xảy ra lỗi khi xóa dữ liệu XP.");
                }

            break;

            case 'all':

                try {
                    // Xóa tất cả dữ liệu cấp độ XP
                    const result = await levelSchema.deleteMany({ Guild: guildId });
        
                    // Kiểm tra xem có tài liệu nào bị xóa không
                    if (result.deletedCount === 0) {
                        const noDataEmbed = new EmbedBuilder()
                            .setColor(`Blue`)
                            .setDescription(`\`\`\`yml\n🏅 Không có dữ liệu cấp độ XP nào để xóa trong máy chủ ${guildName}.\`\`\``);
                        return await interaction.reply({ embeds: [noDataEmbed] });
                    }
        
                    const embed = new EmbedBuilder()
                        .setColor(`Blue`)
                        .setDescription(`\`\`\`yml\n🏅 Hệ thống xp trong máy chủ ${guildName} đã được thiết lập lại!\`\`\``);
        
                    await interaction.reply({ embeds: [embed] });
                } catch (error) {
                    console.error("Error resetting XP:", error);
                    const errorEmbed = new EmbedBuilder()
                        .setColor(`Red`)
                        .setDescription(`\`\`\`yml\n⚠️ Đã xảy ra lỗi khi thiết lập lại hệ thống xp trong máy chủ ${guildName}.\`\`\``);
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }

            break;

            default:
                await interaction.reply({ content: "Lệnh phụ không hợp lệ!", ephemeral: true });
        }
    }
}