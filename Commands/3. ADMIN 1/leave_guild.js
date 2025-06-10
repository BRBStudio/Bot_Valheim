const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const channelSchema = require('../../schemas/channelSchema.js');
const CommandStatus = require('../../schemas/Command_Status.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave_guild')
        .setDescription('🔹 Thiết lập gửi thông báo khi thành viên rời server.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption(option =>
            option.setName('channelid')
                .setDescription('Chọn kênh bạn muốn nhận được thông báo thành viên rời máy chủ')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('remove')
                .setDescription('Xóa thiết lập gửi thông báo')
                .setRequired(false)),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/leave_guild' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const removeSetting = interaction.options.getBoolean("remove");

        if (removeSetting === true) {
            // Xóa thiết lập từ database nếu lựa chọn remove được chọn
            const guildId = interaction.guild.id;
            await channelSchema.findOneAndDelete({ Guild: guildId });
            return interaction.reply(`Thiết lập gửi thông báo khi thành viên rời máy chủ đã được xóa.`);
        } else if (removeSetting === false) {
            // Gửi thông báo rằng việc xóa thiết lập đã tạm dừng
            return interaction.reply(`Tạm dừng việc xóa thiết lập gửi thông báo khi thành viên rời máy chủ.`);
        }

        const channelId = interaction.options.getChannel("channelid").id;
        const guildId = interaction.guild.id;

        // Lưu thông tin vào database
        await channelSchema.findOneAndUpdate(
            { Guild: guildId },
            { Channel: channelId },
            { upsert: true, new: true }
        );

        await interaction.reply(`Thiết lập thành công kênh gửi thông báo đến kênh khi thành viên rời máy chủ. Người rời khỏi máy chủ cũng sẽ nhận được tin nhắn`);
    },
};

