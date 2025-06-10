const YoutubeAnnouncer = require(`../../YoutubeAnnouncer`); // đường dẫn tùy theo cấu trúc dự án của bạn

/*
	* Đặt cấu hình động ở đây, có thể cải tiến để đọc từ database hoặc file riêng

	* Các mã liên quan: 
		- Ytb.js (Commands) 		---		lệnh slash
		- YoutubeAnnouncer.js 		---		thư viện ytb
		- YoutubeSchema.js 			---		video youtube của tôi
		- Youtube_userSchema.js 	---		video youtube của người dùng (YTB kênh của người dùng)
*/

const config = {
		youtubeChannelIds: [
				`UCg1k7_fu9RnEWO5t6p630bA`
			],
		kenh_thong_bao: "1359632862902747218", // ID kênh Discord
		interval: 30 * 60 * 1000, // 30 phút
	};

	module.exports = {
		name: "ready", // tên sự kiện
		once: true, // chỉ chạy 1 lần khi bot online
		async execute(client) {

		// Khởi tạo YoutubeAnnouncer và chạy
		const youtubeAnnouncer = new YoutubeAnnouncer(client, config);
		youtubeAnnouncer.start(); // bắt đầu theo dõi và gửi thông báo
	}
};
