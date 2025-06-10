const mongoose = require("mongoose");

/*
	* Các mã liên quan: 
		- Ytb.js (Commands) 		---		lệnh slash
		- YTB Events.js 			---		sự kiện
		- YoutubeAnnouncer.js 		---		thư viện ytb
		- YoutubeSchema.js 		  	---		video youtube của tôi
		- YTB Event                 ---     sự kiện
*/

const userYoutubeSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	guildId: { type: String, required: true },
	youtubeChannelId: { type: String, required: true },
	announcementChannelId: { type: String, required: true } // Thêm dòng này
}, 
	{ collection: "YTB kênh của người dùng" }
);

module.exports = mongoose.model("UserYoutube", userYoutubeSchema);