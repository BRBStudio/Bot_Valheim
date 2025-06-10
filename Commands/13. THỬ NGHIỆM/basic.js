const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('basic')
    .setDescription('📔 | Giải đáp thắc mắc cơ bản.'),

    guildSpecific: true,
    guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`, `1028540923249958912`],
    
    async execute(interaction) {
      ///////// danh sách thay thế, ví dụ ${usename} = ....
      const { guild } = interaction;
      const { members, stickers, role } = guild;
      const { name, ownerId, createdTimestamp, memberCount } = guild;
      const icon = guild.iconURL();
      const roles = guild.roles.cache.size;
      const emojis = guild.emojis.cache.size;
      const id = guild.id;
      const channels = interaction.guild.channels.cache.size;
      const category = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size
      const text = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
      const voice = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
      const username1 = "Valheim Survival";
      const username2 = "Pasunom";

////////          là 1                      /////
                    // Tìm người dùng đầu tiên
      const user1 = guild.members.cache.find((member) => member.user.username === username1);
                    // Tìm người dùng đầu tiên
                    // Tìm người dùng thứ 2
      const user2 = guild.members.cache.find((member) => member.user.username === username2);
                    // Tìm người dùng thứ 2
      // Kết hợp thông tin cho cả hai người dùng trong một giá trị bằng cách sử dụng các ký tự mẫu
      const combinedValue = `\`\`\`diff\n+ ${user1?.displayName || `${username1}`} \n+ ${user2?.displayName || `${username2}`} \`\`\``;
      // Kết hợp thông tin cho cả hai người dùng trong một giá trị bằng cách sử dụng các ký tự mẫu
////////          là 1                      ///// 

////////          màu name của .addfield{}                     ///// 
      const coloredNameField = { 
                name: `\`\`\`\u200b ✨✿ **Người điều hành** ✿✨ \`\`\``,
      };
////////          màu name của .addfield{}                     ///// 



      /////////////////////// Đếm số lượng kênh thông báo
      // const annnouncement = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement).size
      const announcementChannels = interaction.guild.channels.cache.filter((c) => c.type === 'GUILD_NEWS');
      const announcementCount = announcementChannels.size;
      /////////////////////// Đếm số lượng kênh thông báo

      const stage = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size
      const forum = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size

      //// bộ đếm kênh chát ///////////////////////////////
      // const thread = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size
      const threadChannels = interaction.guild.channels.cache.filter((c) => c.type === 'CHANNEL_PUBLIC_THREAD');
      const threadCount = threadChannels.size;
      //// bộ đếm kênh chát ///////////////////////////////

      ///////// danh sách thay thế, ví dụ ${usename} = ...
      const rolelist = guild.roles.cache.toJSON().join(' ')
      const botCount = members.cache.filter(member => member.user.bot).size
      const vanity = guild.vanityURLCode || '[Facebook](https://www.facebook.com/profile.php?id=100092393403399)'
      const sticker = stickers.cache.size
      const highestrole = interaction.guild.roles.highest
      const animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size
      const description = interaction.guild.description || 'No description'
      ///////// danh sách thay thế, ví dụ ${usename} = ....
      
      //////// Thêm các người dùng khác nếu cần
      const usernameMap = {
        user1: "Valheim Survival",
        user2: "Pasunom",      
      };
      //////// Thêm các người dùng khác nếu cần

      const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
      const toPascalCase = (string, separator = false) => {
          const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
          return separator ? splitPascal(pascal, separator) : pascal;
      };
      const features = guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None"

      let baseVerification = guild.verificationLevel;

      ////////////////////////// Cấp độ xác minh
      if (baseVerification == 0) baseVerification = "Không có"
      if (baseVerification == 1) baseVerification = "Thấp"
      if (baseVerification == 2) baseVerification = "Trung bình"
      if (baseVerification == 3) baseVerification = "Cao"
      if (baseVerification == 4) baseVerification = "Rất cao"
      ////////////////////// Cấp dộ xác minh
      
      ////// thông tin embed ////////////////////////
      const embed = new EmbedBuilder()
      .setAuthor({ name: name, iconURL: icon })
      .setURL("https://discord.com/channels/1028540923249958912/1173537274542174218")
      .setDescription("Chào mừng đến kỷ nguyên mới\n\nđây là FB của tôi nếu bạn cần sự hỗ trợ từ FB\n***[Facebook](https://www.facebook.com/profile.php?id=100092393403399)***\n\n> Lệnh hỗ trợ\n```/help```\n*Bot của ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★*\n`Bot Valheim` or ``Khi nào có sẽ cho vào``\n\n[Link Youtube](https://www.youtube.com/channel/UCg1k7_fu9RnEWO5t6p630bA)\n\n``@ADMIN``, ``@BRB STUDIO``, ``#channel``, ``@Thành Viên``, @here, @everyone đề cập đến\n\n|| Các lệnh của bot||\n\n**Đang chỉnh, chưa dùng được. Để không ảnh hưởng đến bot hoạt động, đề nghị không dùng cho đến khi có thông báo mới **\n~~/menu~~\n\n> ||Lệnh của admin||\n__/ban__\n__/unban__\n__/kick__\n__/poll__\n__/verification__\n\n> ||Lệnh của người dùng||\n**/basic(giải đáp thắc mắc cơ bản)**\n**/user-info**\n**/help**\n**/event**\n**/giverole**\n**/hi**\n**/ping**")
      .addFields(
        {
          name: "» Làm sao để lấy link mod?",
          value: "Đầu tiên bạn cần vào **[📌┊🦋rules🦋](https://discord.com/channels/1028540923249958912/1173537274542174218)** để kích hoạt tài khoản lên thành viên, khi trở thành thành viên bạn sẽ thấy [📂┊🦋𝑳𝒊𝒏𝒌-𝑴𝒐𝒅🦋](https://discord.com/channels/1028540923249958912/1111674941557985400)",
          inline: false
        },
        {
          name: "» Thế giới có thường xuyên cập nhật không? có thông báo khi server cập nhật không?",
          value: "Tất nhiên rồi, nó được công khai mà :))",
          inline: false
        },
        {
          name: "» Vào đâu để biết khi nào có sự kiện",
          value: "[🏇┊🦋event-sự-kiện🦋](https://discord.com/channels/1028540923249958912/1139719596820152461)",
          inline: false
        },
        { name: `» Vai trò cao nhất`,
          value: `${highestrole}`,
          inline: true
        },
        { 
           name: "» Ngày tạo",
           value: `<t:${parseInt(createdTimestamp / 1000 )}:R>`,
           inline: true
        },
        { 
          name: "» Chủ sở hữu máy chủ",
          value: `<@${ownerId}>`,
          inline: true
        },
        { 
          name: "» URL độc quyền",
          value: `${vanity}`,
          inline: true
        },
        { 
          name: "» Số lượng thành viên",
          value: `${memberCount - botCount}`,
          inline: true
        },
        { 
          name: "» Số lượng bot",
          value: `${botCount}`,
          inline: true
        },
        { 
          name: "» Số lượng emoji",
          value: `${emojis}`,
          inline: true
        },
        { 
          name: "» Biểu tượng cảm xúc hoạt hình",
          value: `${animated}`,
          inline: true
        },
        { 
          name: "» Số lượng nhãn dán",
          value: `${sticker}`,
          inline: true
        },
        { 
          name: `» Số lượng vai trò`,
          value: `${roles}`,
          inline: true
        },
        { 
          name: "» Cấp độ xác minh",
          value: `${baseVerification}`,
          inline: true
        },
        { 
          name: "» Tăng số lượng",
          value: `${guild.premiumSubscriptionCount}`,
          inline: true
        },
        { 
          name: "» Kênh",
          value: `Tổng: ${channels} | <:4974discordcreatecategorywhite:1204771498355855401> ${category} | <:m_channel:1204771510305296474> ${text} | <:6322channelvoice:1204771500574507019> ${voice} | <:1697discordannouncementwhite:1204771495998529576> ${announcementCount} | <:6528channelstage:1204771502885568553> | ${stage} | <:9372discordforumdark:1204771507981787156> ${forum} | <:8582discordthreadwhite:1204771505481711616> ${threadCount}`,
          inline: false
        },
        { 
          name: `» Chức năng dành cho máy chủ`,
          value: `\`\`\`${features}\`\`\``
        },
        {
          name: `» Danh sách vai trò`,
          value: `${rolelist}`
        },
        {
          name: `» Số lượng Chủ đề công khai`,
          value: `${threadCount}`
        },
        { 
          name: coloredNameField.name,
          value: combinedValue,
          inline: true
        },
      )
      .setImage("https://images-ext-2.discordapp.net/external/z5x-r6jMsdwwIB3154VGplo0GI42Bd1ma3wXgvmcq5A/https/i.ibb.co/Wf34yd3/standard.gif")
      .setThumbnail("https://images-ext-2.discordapp.net/external/_T0Cb2tVMjPrszLCx-7Do1A5lRZrPliSVzbno44v6kU/https/i.ibb.co/S54HQLJ/standard-2.gif")
      .setColor("#00b0f4")
      .setFooter({ text: `Server ID: ${id}`})
      .setTimestamp();
        ////// thông tin embed ////////////////////////

       
        ///////////// tương tác lệnh / sẽ hiện ra ////
  try {
    await interaction.reply({ content: "Giải đáp thắc mắc cơ bản.", embeds: [embed], ephemeral: true, });
} catch (err) {
    console.log("lỗi gửi thông báo từ chối chưa được xử lý tới hội nhà phát triển", err); 
}
        ///////////// tương tác lệnh / sẽ hiện ra ////

 
// await message.reply({  });
    }
}