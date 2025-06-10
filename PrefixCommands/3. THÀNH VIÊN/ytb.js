const ytSearch = require("yt-search");

// Hàm tìm kiếm video trên YouTube
async function searchVideo(query) {
	try {
		const searchResults = await ytSearch(query); // Tìm kiếm video

		if (searchResults && searchResults.videos.length > 0) {
			return searchResults.videos[0].url; // Trả về URL của video đầu tiên
		} else {
			return null; // Không tìm thấy video
		}
	} catch (error) {
		console.error("Lỗi tìm kiếm video:", error);
		return null;
	}
}

	// Hàm kiểm tra nếu query là URL hợp lệ
function isURL(str) {
	const urlRegex =
		/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/\S*)?$/;
	return urlRegex.test(str);
}

module.exports = {
	name: "ytb",
	description: "🔸 Tìm kiếm video trên ytb.",
	hd: '🔸 ?ytb <tên video bạn muốn tìm>',

	aliases: ['tv11'],

	async execute(message, args) {
		const query = args.join(" ");

		if (!query) {
			return message.channel.send("Bạn phải cung cấp tên hoặc URL của video!");
		}

		const isURLResult = isURL(query);

		if (isURLResult) {
			await playVideo(message, query);
		} else {
			const videoURL = await searchVideo(query);

			if (videoURL) {
				await playVideo(message, videoURL);
			} else {
				await message.channel.send(`Không tìm thấy video cho: ${query}`);
			}
		}
	},
};

// Hàm phát video (dành cho tiền tố ?)
async function playVideo(message, videoURL) {
	try {
		await message.channel.send("Đây là video của bạn: " + videoURL);
		// Cần sử dụng một thư viện âm thanh Discord để phát video vào kênh thoại cụ thể
	} catch (error) {
		console.error("Lỗi khi phát video:", error);
		await message.channel.send("Đã xảy ra lỗi khi phát video.");
	}
}





















// // const { google } = require("googleapis");

// // const youtube = google.youtube({
// //   version: "v3",
// //   auth: "AIzaSyCwmQEeGyYEMmHMpzbuA-XzsLjAVx1UziQ", // API của youtube
// // });

// // // Hàm tìm kiếm video trên YouTube
// // async function searchVideo(query) {
// //   try {
// //     const response = await youtube.search.list({
// //       part: "snippet",
// //       q: query,
// //       type: "video",
// //     });

// //     if (response.data.items.length > 0) {
// //       return response.data.items[0].id.videoId;
// //     } else {
// //       return null;
// //     }
// //   } catch (error) {
// //     console.error("Lỗi tìm kiếm video:", error);
// //     return null;
// //   }
// // }

// // // Hàm kiểm tra nếu query là URL hợp lệ
// // function isURL(str) {
// //   const urlRegex =
// //     /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/\S*)?$/;
// //   return urlRegex.test(str);
// // }

// // module.exports = {
// //   name: 'ytb',  // Tên lệnh, dùng để người dùng gọi lệnh tiền tố ?
// //   description: '♬˚🎧 | xem phim.!',  // Mô tả ngắn gọn về lệnh
// //   async execute(message, args) {
// //     const query = args.join(" ");  // Lấy query từ các đối số người dùng nhập vào

// //     if (!query) {
// //       return message.channel.send("Bạn phải cung cấp tên hoặc URL của video!");
// //     }

// //     const isURLResult = isURL(query);

// //     if (isURLResult) {
// //       await playVideo(message, query);
// //     } else {
// //       const videoId = await searchVideo(query);
// //       if (videoId) {
// //         const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
// //         await playVideo(message, videoURL);
// //       } else {
// //         await message.channel.send(`Không tìm thấy video cho: ${query}`);
// //       }
// //     }
// //   },
// // };

// // // Hàm phát video (dành cho tiền tố ?)
// // async function playVideo(message, videoURL) {
// //   try {
// //     // Trả lời tin nhắn với video URL
// //     await message.channel.send("Đây là video của bạn: " + videoURL);
// //     // Cần sử dụng một thư viện âm thanh Discord để phát âm thanh của video vào kênh thoại cụ thể
// //   } catch (error) {
// //     console.error("Lỗi khi phát video:", error);
// //     await message.channel.send("Đã xảy ra lỗi khi phát video.");
// //   }
// // }
