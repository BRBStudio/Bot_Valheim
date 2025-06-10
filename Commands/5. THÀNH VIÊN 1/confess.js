const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const User = require('../../schemas/premiumUserSchema');
const PremiumCode = require('../../schemas/premiumSchema');
const Confess = require('../../schemas/confessSchema');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confess')
        .setDescription(
            `🔹 Hãy thú nhận điều gì đó ẩn danh (ẩn-danh) hoặc bằng tên\n` +
            `       người dùng của bạn (công khai)`
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ẩn-danh')
                .setDescription('🔹 cfs một cách ẩn danh')
                .addStringOption(option => option.setName('message').setDescription('Tin nhắn bạn muốn gửi.').setRequired(true))
                .addChannelOption(options => options.setName("channel").setDescription("Kênh bạn muốn gửi tin nhắn").setRequired(true))
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('công-khai')
                .setDescription('🔹 Thú nhận điều gì đó với tên người dùng của bạn')
                .addStringOption(option => option.setName('message').setDescription('Tin nhắn bạn muốn gửi.').setRequired(true))
                .addChannelOption(options => options.setName("channel").setDescription("Kênh bạn muốn gửi tin nhắn").setRequired(true))
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('admin')
                .setDescription('🔹 Chỉ dành cho admin')
                .addStringOption(option => option.setName('message').setDescription('Nhập ID tin nhắn ẩn danh bạn muốn kiểm tra thông tin.').setRequired(true))
            ),

async execute(interaction) {

    // Kiểm tra trạng thái của lệnh
    const commandStatus = await CommandStatus.findOne({ command: '/confess' });

    // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
    if (commandStatus && commandStatus.status === 'off') {
        return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
    }

    const { options } = interaction;

    const subcommand = options.getSubcommand();
    
    if (subcommand === 'admin') {

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Bạn cần có quyền Admin để sử dụng lệnh này.', ephemeral: true });
      }

      const messageId = options.getString('message');
      const guildId = interaction.guild.id;

      // Tìm tin nhắn theo ID và máy chủ
      const confess = await Confess.findOne({ messageID: messageId, guild: guildId });
      
      if (!confess) {
        return interaction.reply({ content: 'Không tìm thấy tin nhắn với ID đã cung cấp trong máy chủ này. Hãy lấy ID trong tin nhắn ẩn danh', ephemeral: true });
      }

      // Lấy thông tin thành viên để lấy displayName
      const member = await interaction.guild.members.fetch(confess.user);

      const embed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTimestamp()
        .setTitle('Thông Tin Tin Nhắn')
        .setDescription(`**Tên người dùng:** ${member.displayName}\n**Tin nhắn:** ${confess.message}\n`);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const channelcustom = options.getChannel(`channel`) // kênh âsdt của test 1
    const message = options.getString('message');

    //////////////////////////////////////////////////////////////////////////
    // Kiểm tra xem người dùng có dữ liệu trong bảng User hay không
    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user || !user.isPremium) {
      return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng đăng ký premium để sử dụng.', ephemeral: true });
    }

    // Kiểm tra xem người dùng có mã premium và mã đó còn hạn hay không
    const currentTime = new Date();
    if (user.premiumUntil && user.premiumUntil < currentTime) {
        return interaction.reply({ content: 'Mã premium của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng lệnh ***server-statistics***.', ephemeral: true });
    }

    // Kiểm tra xem người dùng có mã premium hay không
    // const premiumCode = await PremiumCode.findOne({ user: interaction.user.id });
    // if (!premiumCode || !premiumCode.isUsed) {
    //   return interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này. Vui lòng nhập mã premium để sử dụng.', ephemeral: true });
    // }
  //////////////////////////////////////////////////////////////////////////


    function generateRandomID(length) {
      const chars = "0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    const randomID = generateRandomID(10); 

    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTimestamp()
      .setTitle(options.getSubcommand() === 'ẩn-danh' ? 'Tin Nhắn Ẩn Danh' : `Tin Nhắn Của ${interaction.user.username}`)
      .setDescription(`${message}\n\n**ID:** ${randomID}`);

    if (interaction.guild) {
      const channel = channelcustom;
      if (channel) {
        await channel.send({ embeds: [embed] });

        // Lưu ID tin nhắn và tên người dùng vào MongoDB
        const newConfess = new Confess({
          guild: interaction.guild.id, // ID của máy chủ
          user: interaction.user.id, // ID của người dùng
          username: interaction.user.username, // Tên người dùng
          messageID: randomID, // ID tin nhắn
          message: message, // Nội dung tin nhắn
          timestamp: new Date(), // Thời gian tạo
        });
        await newConfess.save();

      } else {
        console.error("Không tìm thấy kênh cfs.");
        interaction.reply({ content: "nhắn tin thất bại! Không tìm thấy kênh.", ephemeral: true });
      }

      interaction.reply({ content: 'cofession của bạn đã được gửi!', ephemeral: true });

    } else {
      console.error("cfs không thể được sử dụng trong các kênh DM.");
      interaction.reply({ content: "cfs chỉ có thể được sử dụng trong máy chủ!", ephemeral: true });
    }
  }
}
