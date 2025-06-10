// bot-version.js
const { SlashCommandBuilder } = require('discord.js');
const Version = require(`../../schemas/versionSchema`);
const { botVersion: currentVersion } = require('../../config');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version_bot')
        .setDescription('🔹 Kiểm tra phiên bản của bot'),

    async execute(interaction) {

        try {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/version_bot' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            await interaction.deferReply();

            // Lấy thông tin phiên bản đã lưu trong MongoDB
            const versionData = await Version.findOne(); // Tìm một bản ghi trong MongoDB

            // Nếu không tìm thấy bản ghi, thông báo người dùng
            if (!versionData) {
                await interaction.channel.send('Không tìm thấy thông tin phiên bản trong cơ sở dữ liệu.');
                return await interaction.deleteReply();
            }

            const previousVersion = versionData.botVersion; // Lấy phiên bản cũ từ MongoDB

            // So sánh phiên bản cũ và mới
            if (previousVersion !== currentVersion) {
                // Nếu có sự khác biệt, gửi tin nhắn
                await interaction.channel.send(`**Bot đã được cập nhật!**\nPhiên bản cũ: **${currentVersion}**\nPhiên bản mới: **${previousVersion}**`);
                return await interaction.deleteReply();
            } else {
                // Nếu không có sự khác biệt
                await interaction.channel.send(`Bot hiện tại đang ở phiên bản: **${currentVersion}**, không có cập nhật mới.`);
                return await interaction.deleteReply();
            }
            
        } catch (error) {
            console.error('Lỗi truy xuất phiên bản từ MongoDB:', error);
            await interaction.channel.send('Đã xảy ra lỗi khi lấy thông tin phiên bản từ dữ liệu.');
            await interaction.deleteReply();
        }
    },
};
