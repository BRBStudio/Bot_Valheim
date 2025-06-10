// const { Events } = require('discord.js');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const translate = require('@iamtraction/google-translate');
// const ModValheim = require('../../schemas/mod_valheimschema');

// const THUNDERSTORE_URL = 'https://thunderstore.io/c/valheim/';
// const CHANNEL_ID = '1364516959236128859';
// const CHECK_INTERVAL = 5 * 60 * 1000;

// module.exports = {
//   name: Events.ClientReady,
//   once: true,
//   async execute(client) {
//     console.log(`✅ Bot đã sẵn sàng: ${client.user.tag}`);

//     const channel = await client.channels.fetch(CHANNEL_ID).catch(console.error);
//     if (!channel) return console.error('❌ Không tìm thấy kênh thông báo!');

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
//         const { data } = await axios.get(url);
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
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);
    
//         const changelogContainer = $('div.card-body.markdown-body');
    
//         if (!changelogContainer.length) return 'Không có changelog.';
    
//         const lines = [];
    
//         changelogContainer.children().each((_, el) => {
//           const tag = $(el).get(0).tagName;

//           if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
//             const versionTitle = `🔖 ${$(el).text().trim()}`;
//             if (lines.length > 0) lines.push(''); // Thêm dòng trống trước mỗi phiên bản (trừ dòng đầu)
//             lines.push(versionTitle);
//           } else if (tag === 'ul') {
//             $(el).find('li').each((_, li) => {
//               const text = $(li).text().trim();
//               if (text) lines.push(`- ${text}`);
//             });
//             lines.push(''); // Thêm dòng trống sau mỗi danh sách thay đổi
//           } else if (tag === 'p') {
//             const text = $(el).text().trim();
//             if (text) lines.push(`- ${text}`);
//             lines.push(''); // Thêm dòng trống sau mỗi đoạn văn
//           }
    
//           if (lines.length >= 15) return false; // chỉ lấy 15 dòng đầu tiên
//         });
    
//         const joined = lines.slice(0, 15).join('\n');
//         const translated = await translateText(joined || 'Không có changelog.');
//         return translated;
    
//       } catch (err) {
//         console.error(`⚠️ Không thể lấy changelog từ ${modUrl}:`, err.message);
//         return 'Không có changelog.';
//       }
//     }

//     async function checkThunderstore() {
//       console.log('🌐 Đang gửi request tới Thunderstore...');
//       try {
//         const { data: html } = await axios.get(THUNDERSTORE_URL);
//         const $ = cheerio.load(html);

//         const modContainers = $('div.col-6.col-md-4.col-lg-3');
//         console.log(`🔍 Đã tìm thấy ${modContainers.length} mod.`);

//         const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

//         for (const el of modContainers.toArray()) {
//           const container = $(el);

//           const name = container.find('h5').text().trim();
//           const author = container.find('div.overflow-hidden a').text().trim();
//           const descriptionRaw = container.find('div.bg-light.px-2.flex-grow-1').text().trim();
//           const link = container.find('a').first().attr('href');
//           const fullLink = link ? `${link}` : null;
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

//           const detailPage = await axios.get(fullLink);
//           const $$ = cheerio.load(detailPage.data);
//           const version = $$('table.table tr').first().find('td').eq(1).text().trim();

//           const versionHistory = await getVersionHistory(fullLink);
//           const latestVersion = versionHistory.length > 0 ? versionHistory[0] : null;

//           const id = `${author}/${name}`;
//           const currentVersion = latestVersion?.version || version;

//           const existingMod = await ModValheim.findOne({ name, author });

//           const translatedDescription = descriptionRaw ? await translateText(descriptionRaw) : 'Không có mô tả';
//           const translatedVersion = version ? await translateText(version) : 'Không có mô tả';
//           const translatedDate = latestVersion?.date ? await translateText(latestVersion.date) : 'Không có ngày';
//           const changelog = await getChangelog(fullLink);

//           const versionText = latestVersion ? `v${latestVersion.version} (${translatedDate})` : 'Không có thông tin phiên bản.';

//           if (!existingMod) {
//             console.log(`🆕 Mod mới: ${id}`);
//             await ModValheim.create({
//               name,
//               author,
//               version: currentVersion,
//               versionDate: latestVersion?.date || null,
//               link: fullLink
//             });

//             await channel.send({
//               embeds: [{
//                 title: `${name} - ${versionText}`,
//                 url: fullLink,
//                 description: `**Tác giả**: ${author}\n\n**Mô tả**: ${translatedDescription}\n\n**📥 Tải về**: ${downloads}\n\n**🏷️ Thể loại**: ${categories}\n\n**🕒 Phát hiện lúc**: ${now}\n\n**📜 Thời gian phát hành phiên bản:** ${translatedVersion}\n\n**📃 Ghi chú cập nhật:**\n\`\`\`${changelog}\`\`\``,
//                 thumbnail: thumbnail ? { url: thumbnail } : undefined,
//                 color: 0x00ff99,
//               }],
//             });
//           } else if (existingMod.version !== currentVersion) {
//             const translatedOldVersion = await translateText(existingMod.version);
//             console.log(`♻️ Mod cập nhật: ${id} từ ${existingMod.version} → ${currentVersion}`);
//             await ModValheim.updateOne({ name,  }, {
//               version: currentVersion,
//               versionDate: latestVersion?.date || null,
//               link: fullLink
//             });

//             await channel.send({
//               embeds: [{
//                 title: `${name} - ${versionText}`,
//                 url: fullLink,
//                 description: `**Tác giả**: ${author}\n\n**Mô tả**: ${translatedDescription}\n\n**📥 Tải về**: ${downloads}\n\n**🏷️ Thể loại**: ${categories}\n\n**🕒 Cập nhật lúc**: ${now}\n\n**📜 thời gian cập nhật phiên bản:**\n\n${translatedOldVersion} → ${currentVersion}\n\n**📃 Ghi chú cập nhật:**\n\`\`\`${changelog}\`\`\``,
//                 thumbnail: thumbnail ? { url: thumbnail } : undefined,
//                 color: 0xffcc00,
//               }],
//             });
//           }
//         }

//       } catch (error) {
//         console.error('⚠️ Lỗi khi kiểm tra Thunderstore:', error.message);
//       }
//     }

//     await checkThunderstore();
//     setInterval(checkThunderstore, CHECK_INTERVAL);
//   }
// };