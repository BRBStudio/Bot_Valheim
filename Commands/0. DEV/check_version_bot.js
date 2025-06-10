const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
const discordJsVersion = require('../../package.json').dependencies['discord.js'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check_version_bot')
    .setDescription('Kiểm tra phiên bản Node.js, npm và Discord.js đang dùng'),

    guildSpecific: true,
    guildId: ['1319809040032989275'], // máy chủ Emoji Command Bot

  async execute(interaction) {
    await interaction.deferReply();

    const nodeVersion = process.version;

    // Lấy phiên bản npm
    exec('npm -v', (error, stdout, stderr) => {
      if (error) {
        console.error(`Lỗi khi kiểm tra npm: ${error}`);
        return interaction.editReply('⚠️ Không thể lấy phiên bản npm.');
      }

      const npmVersion = stdout.trim();

      return interaction.editReply({
        embeds: [{
          title: '📦 Phiên bản hệ thống hiện tại',
          fields: [
            { name: 'Node.js', value: nodeVersion, inline: true },
            { name: 'npm', value: npmVersion, inline: true },
            { name: 'discord.js', value: discordJsVersion, inline: true }
          ],
          color: 0x00AE86,
          footer: { text: 'Dữ liệu lấy từ hệ thống máy chủ đang chạy bot.' }
        }]
      });
    });
  }
};
