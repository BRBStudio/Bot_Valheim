const { Events, WebhookClient } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const translate = require('@iamtraction/google-translate');
const ModValheim = require('../../schemas/mod_valheimschema');
const Webhook = require('../../schemas/webhookschemas');

const THUNDERSTORE_URL = 'https://thunderstore.io/c/valheim/';
const CHECK_INTERVAL = 60 * 60 * 1000;

module.exports = {
	name: Events.ClientReady,
	once: true,
		async execute(client) {

			/*
				DÙNG VỚI LỆNH WH (wh.js trong thư mục 0. DEV)
				VÀ DỮ LIỆU MONGODB WEDHOOK (webhookschemas.js )
			*/

			async function translateText(text) {
				try {
					const res = await translate(text, { to: 'vi' });
					return res.text;
				} catch (err) {
					console.error('⚠️ Lỗi khi dịch mô tả:', err.message);
					return text;
				}
			}

			async function getVersionHistory(modUrl) {
				try {
					const url = modUrl.endsWith('/') ? `${modUrl}versions/` : `${modUrl}/versions/`;
					const { data } = await axios.get(url);
					const $ = cheerio.load(data);
					const versions = [];

					$('table tbody tr').each((_, row) => {
					const cols = $(row).find('td');
					if (cols.length >= 2) {
						const date = $(cols[0]).text().trim();
						const version = $(cols[1]).text().trim();
						versions.push({ version, date });
					}
					});

					return versions;
				} catch (err) {
					console.error(`⚠️ Không thể lấy danh sách phiên bản từ ${modUrl}:`, err.message);
					return [];
				}
			}

			// async function getChangelog(modUrl) {
			// try {
			// 	const url = modUrl.endsWith('/') ? `${modUrl}changelog/` : `${modUrl}/changelog/`;
			// 	const { data } = await axios.get(url);
			// 	const $ = cheerio.load(data);

			// 	const changelogContainer = $('div.card-body.markdown-body');
			// 	if (!changelogContainer.length) return 'Không có changelog.';

			// 	const lines = [];
			// 	changelogContainer.children().each((_, el) => {
			// 		const tag = $(el).get(0).tagName;

			// 		// if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
			// 		//   const versionTitle = `🔖 ${$(el).text().trim()}`;
			// 		//   if (lines.length > 0) lines.push('');
			// 		//   lines.push(versionTitle);
			// 		// }
			// 		if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
			// 			const versionTitle = `🔖 ${$(el).text().trim()}`;
			// 			if (!lines.includes(versionTitle)) {
			// 				if (lines.length > 0) lines.push('');
			// 				lines.push(versionTitle);
			// 			}
			// 		} else if (tag === 'ul') {
			// 			$(el).find('li').each((_, li) => {
			// 				const text = $(li).text().trim();
			// 				if (text) lines.push(`- ${text}`);
			// 			});
			// 			lines.push('');
			// 		} else if (tag === 'p') {
			// 			const text = $(el).text().trim();
			// 			if (text) lines.push(`- ${text}`);
			// 			lines.push('');
			// 		} else if (tag === 'pre') {
			// 			const codeBlock = $(el).find('code').text().trim();
			// 			if (codeBlock) {
			// 				const contentLines = codeBlock
			// 					.split('\n')
			// 					.map(line => line.trim())
			// 					.filter(line => line);
						
			// 				for (const rawLine of contentLines) {
			// 					const cleaned = rawLine.replace(/^-+/, '').trim();
			// 					const finalLine = `- ${cleaned}`;
			// 					if (cleaned && !lines.includes(finalLine)) {
			// 						lines.push(finalLine);
			// 					}
			// 				}
						
			// 				lines.push('');
			// 			}
			// 		}

			// 		if (lines.length >= 15) return false;
			// 	});

			// 		const joined = lines.slice(0, 15).join('\n');
			// 		return await translateText(joined || 'Không có changelog.');
			// 	} catch (err) {
			// 		console.error(`⚠️ Không thể lấy changelog từ ${modUrl}:`, err.message);
			// 		return 'Không có changelog.';
			// 	}
			// }

			async function getChangelog(modUrl) {
				try {
					const url = modUrl.endsWith('/') ? `${modUrl}changelog/` : `${modUrl}/changelog/`;
					const { data } = await axios.get(url);
					const $ = cheerio.load(data);
			
					// Thử lấy từ markdown-body trước (kiểu cũ)
					const changelogContainer = $('div.card-body.markdown-body');
					let lines = [];
			
					if (changelogContainer.length > 0) {
						changelogContainer.children().each((_, el) => {
							const tag = $(el).get(0).tagName;
							if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
								const versionTitle = `🔖 ${$(el).text().trim()}`;
								if (!lines.includes(versionTitle)) {
									if (lines.length > 0) lines.push('');
									lines.push(versionTitle);
								}
							} else if (tag === 'ul') {
								$(el).find('li').each((_, li) => {
									const text = $(li).text().trim();
									if (text) lines.push(`- ${text}`);
								});
								lines.push('');
							} else if (tag === 'p') {
								const text = $(el).text().trim();
								if (text) lines.push(`- ${text}`);
								lines.push('');
							} else if (tag === 'pre') {
								const codeBlock = $(el).find('code').text().trim();
								if (codeBlock) {
									const contentLines = codeBlock
										.split('\n')
										.map(line => line.trim())
										.filter(line => line);
			
									for (const rawLine of contentLines) {
										const cleaned = rawLine.replace(/^-+/, '').trim();
										const finalLine = `- ${cleaned}`;
										if (cleaned && !lines.includes(finalLine)) {
											lines.push(finalLine);
										}
									}
									lines.push('');
								}
							}
			
							if (lines.length >= 15) return false;
						});
					}
			
					// Nếu markdown-body không có dữ liệu, fallback sang bảng
					if (lines.length === 0) {
						const tableRows = $('table tbody tr');
						tableRows.each((_, row) => {
							const cols = $(row).find('td');
							if (cols.length >= 2) {
								const version = $(cols[0]).text().trim();
								const content = $(cols[1]).text().trim().split('\n')
									.map(line => line.trim()).filter(Boolean);
								lines.push(`🔖 ${version}`);
								content.forEach(line => lines.push(`${line}`));
								lines.push('');
							}
							if (lines.length >= 27) return false;
						});
					}
			
					const joined = lines.slice(0, 27).join('\n').trim();
					return await translateText(joined || 'Không có changelog.');
				} catch (err) {
					console.error(`⚠️ Không thể lấy changelog từ ${modUrl}:`, err.message);
					return 'Không có changelog.';
				}
			}
			

			async function sendToAllWebhooks(embed) {
				const webhooks = await Webhook.find({});
					for (const { url } of webhooks) {
						const whClient = new WebhookClient({ url });

					try {
						await whClient.send({ embeds: [embed] });
					} catch (err) {
						console.error(`❌ Gửi thất bại tới webhook: ${url}`, err.message);
					}
				}
			}

			async function checkThunderstore() {
			// console.log('🌐 Đang gửi request tới Thunderstore...');
			try {
				const { data: html } = await axios.get(THUNDERSTORE_URL);
				const $ = cheerio.load(html);
				const modContainers = $('div.col-6.col-md-4.col-lg-3');
				const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

				for (const el of modContainers.toArray()) {
					const container = $(el);
					const name = container.find('h5').text().trim();
					const author = container.find('div.overflow-hidden a').text().trim();
					const descriptionRaw = container.find('div.bg-light.px-2.flex-grow-1').text().trim();
					const link = container.find('a').first().attr('href');
					const fullLink = link ? link : null;
					const imageUrl = container.find('img').attr('src');
					const thumbnail = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://thunderstore.io${imageUrl}`) : null;

					let downloads = 'Không rõ';
					container.find('div.row.mb-1 .col-6').each((_, col) => {
							const icon = $(col).find('i.fas.fa-download');
							if (icon.length > 0) {
							const raw = $(col).text().replace(/\D/g, '');
							if (raw) downloads = raw;
							}
						});

					const categoryElements = container.find('.category-badge-container .category-badge');
					const categories = categoryElements.map((_, el) => $(el).text().trim()).get().join(', ') || 'Không rõ';

					const detailPage = await axios.get(fullLink);
					const $$ = cheerio.load(detailPage.data);
					const version = $$('table.table tr').first().find('td').eq(1).text().trim();

					const versionHistory = await getVersionHistory(fullLink);
					const latestVersion = versionHistory.length > 0 ? versionHistory[0] : null;
					const id = `${author}/${name}`;
					const currentVersion = latestVersion?.version || version;

					const existingMod = await ModValheim.findOne({ name, author });
					const translatedDescription = await translateText(descriptionRaw || 'Không có mô tả');
					const translatedVersion = await translateText(version || 'Không có mô tả');
					const translatedDate = latestVersion?.date ? await translateText(latestVersion.date) : 'Không có ngày';
					const changelog = await getChangelog(fullLink);
					const versionText = latestVersion ? `v${latestVersion.version} (${translatedDate})` : 'Không có thông tin phiên bản.';

					// const isUpdate = !!existingMod && existingMod.version !== currentVersion;
					const isUpdate = existingMod && existingMod.version !== currentVersion;

					// const updateNote = isUpdate ? `**📦 Phiên bản cũ → mới:** ${existingMod.version} → ${currentVersion}\n\n` : `**💡 Phiên bản phát hành** ${existingMod.version}`;
					const updateNote = isUpdate
						? `**📦 Phiên bản cũ → mới:** ${existingMod.version} → ${currentVersion}\n\n`
						: `**💡 Phiên bản phát hành** ${currentVersion}\n\n`;

					let versionLabel = isUpdate
						? `**🛠️ Thời gian cập nhật phiên bản:** ${translatedVersion}\n\n`
						: `**🗓️ Thời gian phát hành phiên bản:** ${translatedVersion}\n\n`;

					// const embed = {
					// 	title: `${name} - ${versionText}`,
					// 	url: fullLink,
					// 	description: updateNote +
					// 		`**Tác giả**: ${author}\n\n` +
					// 		`**Mô tả**: ${translatedDescription}\n\n` +
					// 		`**📥 Tải về**: ${downloads}\n\n` +
					// 		`**🏷️ Thể loại**: ${categories}\n\n` +
					// 		`**🕒 Phát hiện lúc**: ${now}\n\n` +
					// 		// `**📜 Thời gian phát hành phiên bản:** ${translatedVersion}\n\n` +
					// 			versionLabel +
					// 		`**📃 Ghi chú cập nhật:**\n\`\`\`${changelog}\`\`\``,
					// 	thumbnail: thumbnail ? { url: thumbnail } : undefined,
					// 	color: !existingMod ? 0x00ff99 : 0xffcc00
					// };

					// // Giới hạn mô tả để tránh lỗi
					// if (embed.description.length > 4096) {
					// 	embed.description = embed.description.slice(0, 4093) + '...';
					// }

					let description = updateNote +
						`**Tác giả**: ${author}\n\n` +
						`**Mô tả**: ${translatedDescription}\n\n` +
						`**📥 Tải về**: ${downloads}\n\n` +
						`**🏷️ Thể loại**: ${categories}\n\n` +
						`**🕒 Phát hiện lúc**: ${now}\n\n` +
						versionLabel +
						`**📃 Ghi chú cập nhật:**\n\`\`\`${changelog}\`\`\``;

					// Giới hạn 4096 ký tự
					if (description.length > 4096) {
						description = description.slice(0, 4090) + '...\n```';
					}

					const embed = {
						title: `${name} - ${versionText}`,
						url: fullLink,
						description,
						thumbnail: thumbnail ? { url: thumbnail } : undefined,
						color: !existingMod ? 0x00ff99 : 0xffcc00
					};

					if (!existingMod) {
						await ModValheim.create({
							name,
							author,
							version: currentVersion,
							versionDate: latestVersion?.date || null,
							link: fullLink
						});
						await sendToAllWebhooks(embed);
					} else if (existingMod.version !== currentVersion) {
						await ModValheim.updateOne({ name, author }, {
							version: currentVersion,
							versionDate: latestVersion?.date || null,
							link: fullLink
						});

						embed.description = embed.description.replace('**🕒 Phát hiện lúc**', '**🕒 Cập nhật lúc**')
						//   + `\n\n**🔄 Phiên bản cũ → mới:**\n${existingMod.version} → ${currentVersion}`;
						await sendToAllWebhooks(embed);
					}
				}
			} catch (err) {
				console.error('⚠️ Lỗi khi kiểm tra Thunderstore:', err.message);
			}
		}

		await checkThunderstore();
		setInterval(checkThunderstore, CHECK_INTERVAL);
	}
};


// const { Events, WebhookClient } = require('discord.js');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const translate = require('@iamtraction/google-translate');
// const ModValheim = require('../../schemas/mod_valheimschema');
// const Webhook = require('../../schemas/webhookschemas');

// const THUNDERSTORE_URL = 'https://thunderstore.io/c/valheim/';
// const CHECK_INTERVAL = 60 * 60 * 1000;

// const axiosInstance = axios.create({
//   timeout: 10000, // 10 seconds timeout
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
//                   'AppleWebKit/537.36 (KHTML, like Gecko) ' +
//                   'Chrome/112.0.0.0 Safari/537.36'
//   }
// });

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function fetchWithRetry(url, retries = 3) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await axiosInstance.get(url);
//       return response;
//     } catch (err) {
//       console.warn(`⏳ Retry (${i + 1}/${retries}) for ${url}: ${err.message}`);
//       if (i === retries - 1) throw err;
//       await sleep(1000);
//     }
//   }
// }

// module.exports = {
//   name: Events.ClientReady,
//   once: true,
//   async execute(client) {
//     console.log(`✅ Bot đã sẵn sàng: ${client.user.tag}`);

//     async function translateText(text) {
//       try {
//         const res = await translate(text, { to: 'vi' });
//         return res.text;
//       } catch (err) {
//         console.error('⚠️ Lỗi khi dịch mô tả:', err.message);
//         return text;
//       }
//     }

//     async function getVersionHistory(modUrl) {
//       try {
//         const url = modUrl.endsWith('/') ? `${modUrl}versions/` : `${modUrl}/versions/`;
//         const { data } = await fetchWithRetry(url);
//         const $ = cheerio.load(data);
//         const versions = [];

//         $('table tbody tr').each((_, row) => {
//           const cols = $(row).find('td');
//           if (cols.length >= 2) {
//             const date = $(cols[0]).text().trim();
//             const version = $(cols[1]).text().trim();
//             versions.push({ version, date });
//           }
//         });

//         return versions;
//       } catch (err) {
//         console.error(`⚠️ Không thể lấy danh sách phiên bản từ ${modUrl}:`, err.message);
//         return [];
//       }
//     }

//     async function getChangelog(modUrl) {
//       try {
//         const url = modUrl.endsWith('/') ? `${modUrl}changelog/` : `${modUrl}/changelog/`;
//         const { data } = await fetchWithRetry(url);
//         const $ = cheerio.load(data);

//         const changelogContainer = $('div.card-body.markdown-body');
//         if (!changelogContainer.length) return 'Không có changelog.';

//         const lines = [];
//         const seen = new Set();

//         changelogContainer.children().each((_, el) => {
//           const tag = $(el).get(0).tagName;

//           if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
//             const versionTitle = `🔖 ${$(el).text().trim()}`;
//             if (lines.length > 0) lines.push('');
//             lines.push(versionTitle);
//           } else if (tag === 'ul') {
//             $(el).find('li').each((_, li) => {
//               const text = `- ${$(li).text().trim()}`;
//               if (text && !seen.has(text)) {
//                 lines.push(text);
//                 seen.add(text);
//               }
//             });
//             lines.push('');
//           } else if (tag === 'p') {
//             const text = `- ${$(el).text().trim()}`;
//             if (text && !seen.has(text)) {
//               lines.push(text);
//               seen.add(text);
//             }
//             lines.push('');
//           }

//           if (lines.length >= 15) return false;
//         });

//         const joined = lines.slice(0, 15).join('\n');
//         return await translateText(joined || 'Không có changelog.');
//       } catch (err) {
//         console.error(`⚠️ Không thể lấy changelog từ ${modUrl}:`, err.message);
//         return 'Không có changelog.';
//       }
//     }

//     async function sendToAllWebhooks(embed) {
//       const webhooks = await Webhook.find({});
//       for (const { url } of webhooks) {
//         const whClient = new WebhookClient({ url });
//         try {
//           await whClient.send({ embeds: [embed] });
//         } catch (err) {
//           console.error(`❌ Gửi thất bại tới webhook: ${url}`, err.message);
//         }
//       }
//     }

//     async function checkThunderstore() {
//       console.log('🌐 Đang gửi request tới Thunderstore...');
//       try {
//         const { data: html } = await fetchWithRetry(THUNDERSTORE_URL);
//         const $ = cheerio.load(html);
//         const modContainers = $('div.col-6.col-md-4.col-lg-3');
//         const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

//         for (const el of modContainers.toArray()) {
//           const container = $(el);
//           const name = container.find('h5').text().trim();
//           const author = container.find('div.overflow-hidden a').text().trim();
//           const descriptionRaw = container.find('div.bg-light.px-2.flex-grow-1').text().trim();
//           const link = container.find('a').first().attr('href');
//           const fullLink = link ? link : null;
//           const imageUrl = container.find('img').attr('src');
//           const thumbnail = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://thunderstore.io${imageUrl}`) : null;

//           let downloads = 'Không rõ';
//           container.find('div.row.mb-1 .col-6').each((_, col) => {
//             const icon = $(col).find('i.fas.fa-download');
//             if (icon.length > 0) {
//               const raw = $(col).text().replace(/\D/g, '');
//               if (raw) downloads = raw;
//             }
//           });

//           const categoryElements = container.find('.category-badge-container .category-badge');
//           const categories = categoryElements.map((_, el) => $(el).text().trim()).get().join(', ') || 'Không rõ';

//           const detailPage = await fetchWithRetry(fullLink);
//           const $$ = cheerio.load(detailPage.data);
//           const version = $$('table.table tr').first().find('td').eq(1).text().trim();

//           const versionHistory = await getVersionHistory(fullLink);
//           const latestVersion = versionHistory.length > 0 ? versionHistory[0] : null;
//           const id = `${author}/${name}`;
//           const currentVersion = latestVersion?.version || version;

//           const existingMod = await ModValheim.findOne({ name, author });
//           const translatedDescription = await translateText(descriptionRaw || 'Không có mô tả');
//           const translatedVersion = await translateText(version || 'Không có mô tả');
//           const translatedDate = latestVersion?.date ? await translateText(latestVersion.date) : 'Không có ngày';
//           const changelog = await getChangelog(fullLink);
//           const versionText = latestVersion ? `v${latestVersion.version} (${translatedDate})` : 'Không có thông tin phiên bản.';

//           const isUpdate = !!existingMod && existingMod.version !== currentVersion;
//           const updateNote = isUpdate ? `**🔄 Phiên bản cũ → mới:** ${existingMod.version} → ${currentVersion}\n\n` : '';

//           const embed = {
//             title: `${name} - ${versionText}`,
//             url: fullLink,
//             description: updateNote + `**Tác giả**: ${author}\n\n**Mô tả**: ${translatedDescription}\n\n**📥 Tải về**: ${downloads}\n\n**🏷️ Thể loại**: ${categories}\n\n**🕒 ${isUpdate ? 'Cập nhật' : 'Phát hiện'} lúc**: ${now}\n\n**📜 Thời gian phát hành phiên bản:** ${translatedVersion}\n\n**📃 Ghi chú cập nhật:**\n\`\`\`${changelog}\`\`\``,
//             thumbnail: thumbnail ? { url: thumbnail } : undefined,
//             color: !existingMod ? 0x00ff99 : 0xffcc00
//           };

//           if (!existingMod) {
//             await ModValheim.create({
//               name,
//               author,
//               version: currentVersion,
//               versionDate: latestVersion?.date || null,
//               link: fullLink
//             });
//             await sendToAllWebhooks(embed);
//           } else if (existingMod.version !== currentVersion) {
//             await ModValheim.updateOne({ name, author }, {
//               version: currentVersion,
//               versionDate: latestVersion?.date || null,
//               link: fullLink
//             });
//             await sendToAllWebhooks(embed);
//           }
//         }
//       } catch (err) {
//         console.error('⚠️ Lỗi khi kiểm tra Thunderstore:', err.message);
//       }
//     }

//     await checkThunderstore();
//     setInterval(checkThunderstore, CHECK_INTERVAL);
//   }
// };
