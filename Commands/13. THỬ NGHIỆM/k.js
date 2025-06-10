// const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
// const QRCode = require('qrcode');
// const CommandStatus = require('../../schemas/Command_Status');
// const { writeFile, unlink, existsSync, mkdirSync } = require("fs");
// const path = require("path");

// // Định nghĩa thư mục lưu trữ QR
// const qrStoragePath = path.join(__dirname, "../../Thư mục lưu mã QR không được xóa");

// // Tạo thư mục nếu chưa có
// if (!existsSync(qrStoragePath)) {
//     mkdirSync(qrStoragePath, { recursive: true });
// }

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("qk")
//         .setDescription("🔹 Lưu dữ liệu Qr và gửi Qr")
//         .addSubcommand(c => c
//             .setName("setup")
//             .setDescription("🔹 Lưu dữ liệu mã QR")
//             .addAttachmentOption(o => o
//                 .setName("image")
//                 .setDescription("Hình ảnh QR bạn muốn lưu.")
//                 .setRequired(true)))
//         .addSubcommand(c => c
//             .setName("send")
//             .setDescription("🔹 Gửi mã QR của bạn trong kênh hiện tại"))
//         .addSubcommand(c => c
//             .setName("creat")
//             .setDescription("🔹 Tạo mã QR từ một đường link và lưu vào hệ thống")
//             .addStringOption(o => o
//                 .setName("link")
//                 .setDescription("Link bạn muốn chuyển thành mã QR")
//                 .setRequired(true))),
//     guildSpecific: true,
//     guildId: ['1319809040032989275', '1312185401347407902', '1319947820991774753'],

//     async execute(interaction) {
//         const subCommand = interaction.options.getSubcommand();

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: "/qr" });
//         if (commandStatus && commandStatus.status === "off") {
//             return interaction.reply({ content: "Lệnh này đã bị tắt, vui lòng thử lại sau.", ephemeral: true });
//         }

//         if (subCommand === "setup") {
//             const imageURL = interaction.options.getAttachment("image");

//             // Kiểm tra nếu file là ảnh động (GIF)
//             const imageType = imageURL.contentType; // Ví dụ: "image/png", "image/gif", ...
//             if (imageType && imageType.startsWith("image/gif")) {
//                 return interaction.reply({ content: "❌ Chúng tôi không chấp nhận ảnh động (GIF). Vui lòng chọn ảnh tĩnh.", ephemeral: true });
//             }

//             const filePath = path.join(qrStoragePath, `${interaction.user.id}.png`);

//             try {
//                 // Dùng fetch để tải ảnh về
//                 const response = await fetch(imageURL.url);
//                 const arrayBuffer = await response.arrayBuffer();
//                 const buffer = Buffer.from(arrayBuffer);

//                 // Lưu file vào thư mục
//                 await writeFile(filePath, buffer, (err) => {
//                     if (err) throw err;
//                 });

//                 interaction.reply("📥 Mã QR của bạn đã được lưu thành công vào hệ thống!");
//             } catch (err) {
//                 console.error(err);
//                 interaction.reply({ content: "❌ Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại sau.", ephemeral: true });
//             }

//         } else if (subCommand === "send") {
//             const filePath = path.join(qrStoragePath, `${interaction.user.id}.png`);

//             if (!existsSync(filePath)) {
//                 return interaction.reply({ content: "❌ Không tìm thấy mã QR của bạn. Hãy sử dụng lệnh `/qk setup` hoặc `/qk creat` để tạo lại.", ephemeral: true });
//             }

//             const attachment = new AttachmentBuilder(filePath, { name: "qrcode.png" });
//             const embed = new EmbedBuilder()
//                 .setColor("Green")
//                 .setTitle(`💳 HÃY CHUYỂN KHOẢN VÀO ĐÂY CHO ${interaction.user.displayName.toUpperCase()}`)
//                 .setImage("attachment://qrcode.png")
//                 .setFooter({ text: "⚠️ Để đảm bảo an toàn, hãy xác minh tài khoản trước khi giao dịch." })
//                 .setTimestamp();

//             interaction.reply({ embeds: [embed], files: [attachment] });

//         } else if (subCommand === "creat") {
//             const link = interaction.options.getString("link");
//             const filePath = path.join(qrStoragePath, `${interaction.user.id}.png`);

//             try {
//                 await interaction.deferReply();
//                 const qrBuffer = await QRCode.toBuffer(link, { errorCorrectionLevel: "H" });

//                 await writeFile(filePath, qrBuffer, (err) => {
//                     if (err) throw err;
//                 });

//                 const attachment = new AttachmentBuilder(filePath, { name: "qrcode.png" });
//                 interaction.followUp({ content: "✅ Mã QR của bạn đã được tạo và lưu vào hệ thống!", files: [attachment] });
//             } catch (err) {
//                 console.error(err);
//                 interaction.reply({ content: "❌ Đã xảy ra lỗi khi tạo mã QR. Vui lòng thử lại sau.", ephemeral: true });
//             }
//         }
//     }
// };
