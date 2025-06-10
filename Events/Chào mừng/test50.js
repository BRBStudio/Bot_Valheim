// const Welcome = require('../../thư viện embed/chaomung');

// module.exports = {
//   name: 'guildMemberAdd',
//   async execute(member, client) {
//     const welcome = new Welcome();

//     const buffer = await welcome
//       .Background('image', 'https://i.imgur.com/NIZ3GCe.jpeg')
//       .Avatar(member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
//       .Title(`Chào mừng ${member.displayName}`)
//       .Description('Bạn đã chính thức gia nhập cộng đồng danh giá.\nHãy cùng tạo nên những khoảnh khắc đáng nhớ!')
//       .Border('#FF4500')
//       .AvatarBorder('#FFD700')
//       .BorderOpacity(0.3)
//       .build();

//     const channel = member.guild.channels.cache.get('1373725867238232209');
//     if (!channel) return;

//     channel.send({
//       content: `Chào mừng ${member} đến với server! Bạn là thành viên thứkkkk ${member.guild.memberCount}`,
//       files: [{ attachment: buffer, name: `welcome-${member.id}.png` }],
//     });
//   },
// };
