const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const Video = require("./schemas/youtubeSchema");
const UserYoutube = require(`./schemas/Youtube_userSchema`);
require("dotenv").config();

/*
	* Các mã liên quan: 
		- Ytb.js (Commands) 		---		lệnh slash
		- YoutubeSchema.js 			---		video youtube của tôi
		- YTB Events.js 			---		sự kiện
		- Youtube_userSchema.js 	---		video youtube của người dùng (YTB kênh của người dùng)
*/

class YoutubeAnnouncer {
	constructor(client, options = {}) {
		this.client = client;
		this.apiKey = process.env.youtube;
		this.channelIds = options.youtubeChannelIds || [];
		this.discordChannelId = options.kenh_thong_bao || process.env.kenh_thong_bao; // announcementChannel (options.kenh_thong_bao) + youtube_announcement (process.env.kenh_thong_bao)
		this.interval = options.interval || 30 * 60 * 1000; // Mặc định 30 phút
		this.notifiedErrors = new Set();
		this.ERROR_REPORT_CHANNEL_ID = "1373148304908484659"; // Kênh báo lỗi cố định
	}

	start() {
		// console.log(`✅ YoutubeAnnouncer đang chạy mỗi ${this.interval / 1000 / 60} phút`);
		this.checkVideos();
		setInterval(() => this.checkVideos(), this.interval);
	}

	async checkVideos() {
		try {
			const userChannels = await UserYoutube.find({});

			if (userChannels.length === 0) {
				// Trường hợp không có ai đăng ký → dùng mặc định
				for (const channelId of this.channelIds) {
					await this.announceChannelVideos(channelId, this.discordChannelId);
				}
			} else {
				// Duyệt từng người dùng đăng ký riêng
				for (const user of userChannels) {
					await this.announceChannelVideos(user.youtubeChannelId, user.discordChannelId);
				}
			}

	
		} catch (err) {
			console.error("⛔ Lỗi khi kiểm tra video:", err);
		}
	}
	
	async checkVideos() {
		try {
			const userChannels = await UserYoutube.find({});
			const sentGuilds = new Set(); // Để tránh gửi kênh mặc định nếu đã có người dùng trong guild
		
			for (const user of userChannels) {
				const videos = await this.getRecentVideos(user.youtubeChannelId);
		
				for (const video of videos) {
					const videoId = video.id?.videoId;
					if (!videoId) continue;
			
					const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
					const existingVideo = await Video.findOne({ videoUrl });
					if (existingVideo) continue;
			
					const embed = new EmbedBuilder()
						.setColor(`#00ffff`)
						.setDescription(video.snippet.description || "Không có mô tả.")
						.setThumbnail(video.snippet.thumbnails.default.url)
						.setURL(videoUrl)
						.setTitle(video.snippet.title)
						.setImage(
							video.snippet.thumbnails.maxres?.url ||
							video.snippet.thumbnails.high?.url ||
							video.snippet.thumbnails.medium?.url ||
							video.snippet.thumbnails.default.url
						);
			
					const guild = this.client.guilds.cache.get(user.guildId);
					if (!guild) continue;
			
					const channel = guild.channels.cache.get(user.announcementChannelId);
					if (channel) {
						// await channel.send(videoUrl);
						await channel.send({ 
							// content: 
							// 	`Mô tả: ${video.snippet.description || "Không có mô tả."}\n` +								
							// 	`[Link](${videoUrl})`,
							embeds: [embed]});// , embeds: [embed] 
						console.log(`📢 Đã gửi video mới cho người dùng ${user.userId} trong máy chủ ${user.guildId}`);
					}
			
					await new Video({
						videoTitle: video.snippet.title,
						videoUrl,
						channelTitle: video.snippet.channelTitle,
						videoThumbnail: video.snippet.thumbnails.high?.url || "",// embed.data.image.url,
						videoDescription: video.snippet.description || "",
						channelThumbnail: video.snippet.thumbnails.default?.url || ""//embed.data.thumbnail.url
					}).save();
				}
		
				sentGuilds.add(user.guildId);
			}
		
			// Nếu không có người dùng đăng ký trong guild, thì gửi kênh mặc định
			if (this.channelIds.length > 0) {
				for (const channelId of this.channelIds) {
					const videos = await this.getRecentVideos(channelId);
			
					for (const video of videos) {
						const videoId = video.id?.videoId;
						if (!videoId) continue;
			
						const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
						const existingVideo = await Video.findOne({ videoUrl });
						if (existingVideo) continue;
			
						const embed = new EmbedBuilder()
							.setColor(`#00ffff`)
							.setDescription(video.snippet.description || "Không có mô tả.")
							.setThumbnail(video.snippet.thumbnails.default.url)
							.setURL(videoUrl)
							.setTitle(video.snippet.title)
							.setImage(
								video.snippet.thumbnails.maxres?.url ||
								video.snippet.thumbnails.high?.url ||
								video.snippet.thumbnails.medium?.url ||
								video.snippet.thumbnails.default.url
							);

						for (const guild of this.client.guilds.cache.values()) {
							if (sentGuilds.has(guild.id)) continue;
							
							let defaultChannel = guild.channels.cache.find(
								(ch) => ch.name === "ytb_người_dùng" && ch.type === 0 // ytb_người_dùng
							);
						
						if (!defaultChannel) {
							let category = guild.channels.cache.find(
								(c) => c.name.toLowerCase() === "ytb" && c.type === 4
							);
						
							if (!category) {
								try {
									category = await guild.channels.create({
									name: "YTB",
									type: 4,
									position: 0,
									});
							
									await category.setPosition(0).catch(() => {});
								} catch (err) {
									console.error(`⛔ Không thể tạo danh mục YTB trong guild ${guild.id}:`, err);
									continue;
								}
							}
						// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
							try {
								defaultChannel = await guild.channels.create({
									name: "ytb_người_dùng",
									type: 0,
									parent: category.id,
									topic: 
										`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
										📌 Hướng dẫn lấy channel_id: vào kênh ytb bạn muốn theo dõi và chọn bất kì video, sau đó ấn Ctrl + U → Ctrl + F → tìm channelId và copy ID.`,
									permissionOverwrites: [
										{
											id: guild.roles.everyone.id,
											allow: ["ViewChannel", "ReadMessageHistory"],
											deny: [`SendMessages`]
										},
									],
								});
							} catch (err) {
								console.error(`⛔ Không thể tạo kênh ytb_người_dùng trong guild ${guild.id}:`, err);
								continue;
							}
						}
						
							if (defaultChannel) {
								try {
									// Gỡ ghim tin nhắn cũ của bot nếu có
									const pinned = await defaultChannel.messages.fetchPinned();
									for (const msg of pinned.values()) {
										if (msg.author.id === this.client.user.id) {
										await msg.unpin().catch(() => {});
										}
									}

									// Thêm thời gian đăng vào embed
									embed.setFooter({
										text: `🕒 Đã đăng vào: ${new Date().toLocaleString('vi-VN')}`
									});
								
									// Gửi và ghim video mới
									const sentMessage = await defaultChannel.send({ embeds: [embed] });
									await sentMessage.pin();
								
									// console.log(`📢 Đã gửi và ghim ${defaultChannel.name} vào guild ${guild.id}`);
								} catch (err) {
									console.error(`⛔ Lỗi mã YoutubeAnnouncer.js khi gửi hoặc ghim video trong guild ${guild.id}:`, err);
								}
							}
						}

						await new Video({
							videoTitle: video.snippet.title,
							videoUrl,
							channelTitle: video.snippet.channelTitle,
							videoThumbnail: video.snippet.thumbnails.high?.url || "",// embed.data.image.url,
							videoDescription: video.snippet.description || "",
							channelThumbnail: video.snippet.thumbnails.default?.url || ""// embed.data.thumbnail.url
						}).save();
					}
				}
			}
	
		} catch (err) {
			console.error("⛔ Lỗi khi kiểm tra video:", err);
		}
	}

	async getRecentVideos(channelId) {
		try {
			const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`;
			const res = await axios.get(url);
			return res.data.items || [];
		} catch (err) {

			// if (!this.notifiedErrors.has(channelId)) {
			// 	this.notifiedErrors.add(channelId);
			// 	const errorEmbed = new EmbedBuilder()
			// 		.setColor("Red")
			// 		.setTitle("❌ Lỗi khi lấy video YouTube")
			// 		.setDescription(
			// 			`Không thể lấy video từ kênh **${channelId}**\n` +
			// 			(err.response?.status === 403
			// 				?
			// 				`Yêu cầu đến **YouTube API bị từ chối truy cập**.\n\n` +
			// 				`Nguyên nhân phổ biến:\n` +
			// 				`1. API key không hợp lệ, hết quota, hoặc chưa bật YouTube Data API v3.\n` +
			// 				`2. Kênh YouTube bạn đang cố lấy video là "private" hoặc bị giới hạn nội dung.\n` +
			// 				`3. URL API sai cú pháp.\n\n` +
			// 				`🔑 Kiểm tra lại API Key hoặc quota trong Google Cloud Console.`
			// 				:
			// 				`Chi tiết lỗi: \`${err.message}\``)
			// 		)
			// 		.setTimestamp();

			// 	const notifyChannel = this.client.channels.cache.get(this.ERROR_REPORT_CHANNEL_ID);
			// 	if (notifyChannel) {
			// 		notifyChannel.send({ embeds: [errorEmbed] }).catch(console.error);
			// 	}
			// }
			// return [];

			if (!this.notifiedErrors.has(channelId)) {
				this.notifiedErrors.add(channelId);
				const errorEmbed = new EmbedBuilder()
					.setColor(`Green`)
					.setTitle("❌ Lỗi khi lấy video YouTube")
					.setDescription(
						`Không thể lấy video từ kênh **${channelId}**\n` +
						(err.response?.status === 403
							? 
							`Yêu cầu đến **YouTube API bị từ chối truy cập**.\n\n`+
							`Nguyên nhân phổ biến:\n`+
							`1. API key của bạn không hợp lệ, hết quota, hoặc chưa bật YouTube Data API v3.\n`+
							`2. Kênh YouTube bạn đang cố lấy video là "private" hoặc đã bị giới hạn nội dung.\n`+
							`3. URL API bị sai cú pháp.\n\n`+
							`🔑 Hãy liên hệ Chủ sở hữu bot **Host Valheim** để kiểm tra lại API Key, hoặc quota trong Google Cloud Console. Cũng có thể cài lại key youtube trong .env`
							: 
							`Chi tiết lỗi: \`${err.message}\`
						`)
					)
					.setTimestamp();

				const firstGuild = this.client.guilds.cache.first();
				if (firstGuild) {
					const notifyChannel =
						firstGuild.channels.cache.get(this.discordChannelId) ||
						firstGuild.channels.cache.find(ch => ch.name === "ytb_người_dùng" && ch.type === 0);
					if (notifyChannel) {
						notifyChannel.send({ embeds: [errorEmbed] }).catch(console.error);
					}
				}
			}
			return [];
		}
	}
}

module.exports = YoutubeAnnouncer;

` ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀abc`