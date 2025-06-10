const { SlashCommandBuilder } = require('discord.js');
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh_channel')
        .setDescription('🔹 Làm mới lại kênh.')
        .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Kênh muốn làm mới.")
              .setRequired(true)
          ),
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/refresh_channel' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const { options, channel: currentChannel } = interaction;
        const channel = options.getChannel("channel");

        // Lưu ID của kênh hiện tại
        const currentChannelId = currentChannel.id;

        // Trì hoãn phản hồi mà không gửi tin nhắn
        await interaction.deferReply({ ephemeral: true });

        // Tạo bản sao của kênh
        const newChannel = await channel.clone();

        // Đặt lại vị trí của kênh mới
        await newChannel.setPosition(channel.position);
        await newChannel.setName(channel.name); // Giữ tên kênh
        await newChannel.setTopic(channel.topic); // Giữ chủ đề kênh
        await newChannel.setNSFW(channel.nsfw); // Giữ trạng thái NSFW nếu có

        // Xóa kênh cũ
        await channel.delete();

        // Gửi tin nhắn xác nhận vào kênh mới
        await newChannel.send({ content: 'Kênh đã được làm mới thành công!' });

        if (currentChannelId === channel.id) {
            // Xóa phản hồi đã trì hoãn nếu lệnh được thực hiện trong kênh không bị làm mới
            await interaction.deleteReply().catch(() => {});
        } else {
            // Xóa phản hồi đã trì hoãn nếu lệnh được thực hiện trong kênh bị làm mới
            await interaction.deleteReply().catch(() => {});
        }
    },
};
