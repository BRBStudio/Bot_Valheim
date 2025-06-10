const mongoose = require("mongoose");

/*
	* Các mã liên quan: 
		- Ytb.js (Commands) 			---		lệnh slash
		- YoutubeAnnouncer.js 			---		thư viện ytb
		- YTB Events.js 				---		sự kiện
		- Youtube_userSchema.js 		---		video youtube của người dùng (YTB kênh của người dùng)
		- YTB Event                     ---     sự kiện
*/

const videoSchema = new mongoose.Schema({
	videoTitle: { type: String, required: true },
	videoUrl: { type: String, required: true },
	channelTitle: { type: String, required: true },
	videoThumbnail: { type: String, required: true },
	videoDescription: { type: String, default: "" },
	channelThumbnail: { type: String },
},
	{ collection: 'YTB video mới' }
);

module.exports = mongoose.model("Video", videoSchema);
