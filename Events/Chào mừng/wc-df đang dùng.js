const WelcomeLeave = require("../../utils/welcome(thuvien_canvafy)");
const WelcomeDefault = require('../../schemas/welcomedefaultSchema');
const EventStatus = require('../../schemas/Event_Status');
const config = require(`../../config`);

/*
chào mừng mặc định
*/

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Đường dẫn đến font hỗ trợ tiếng Việt
const fonttv = '../../font/FleurDeLeah-Regular.ttf';

// Danh sách ID đặc biệt
const specialUserIds = ["933544716883079278", "940104526285910046"];

module.exports = {
	name: "guildMemberAdd",

	async execute(member, client) {
		// const eventStatus = await EventStatus.findOne({ event: 'wc-df' });

		// if (!eventStatus || eventStatus.status === 'off') {
		// 	return;
		// }

		const { user, guild } = member;

		const welcomeData = await WelcomeDefault.findOne({ guildId: guild.id });
		const welcomeChannelId = welcomeData ? welcomeData.channelId : null;
		const welcomeChannel = welcomeChannelId ? guild.channels.cache.get(welcomeChannelId) : null;

		if (!welcomeChannel) return;

		const randomBorderColor = getRandomColor();
		const randomAvatarBorderColor = getRandomColor();

		// Văn bản chào mừng với xuống dòng
		// const title =`VỊ KHÁCH ĐẶC BIỆT`
		const title = specialUserIds.includes(user.id) ? "VỊ KHÁCH ĐẶC BIỆT" : user.displayName;
		const description = `Bạn đã chính thức gia nhập cộng đồng danh giá.\nHãy cùng tạo nên những khoảnh khắc đáng nhớ!`; 
		// ${user.displayName.toUpperCase()}\nĐến với máy chủ ${guild.name.toUpperCase()}

		// Tạo hình ảnh chào mừng
		const welcomeImage = await new WelcomeLeave({ font: { name: "Roboto", path: fonttv } }) // Đăng ký font Roboto
			.setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
			.setBackground("image", welcomeData.imageURL || "https://i.imgur.com/NIZ3GCe.jpeg") // .setBackground("image", welcomeData.imageURL || "https://i.imgur.com/U6dpDKR.jpg")
			.setTitle(title)
			.setDescription(description) // Truyền chuỗi có ký tự xuống dòng
			.setBorder(randomBorderColor)
			.setAvatarBorder(randomAvatarBorderColor)
			.setOverlayOpacity(0.3)
			.build();

		welcomeChannel.send({
		content: `**${member}** vừa tham gia ***${guild.name}***. Bạn là thành viên thứ **${guild.memberCount}**`,
		files: [{
			attachment: welcomeImage,
			name: `welcome-${member.id}.png`,
		}],
		});
	},
};

// ᴮᴿᴮ ᔆᵀᵁᴰᴵᴼ



