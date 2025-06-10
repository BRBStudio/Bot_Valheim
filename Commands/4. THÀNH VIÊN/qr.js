const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const qrModel = require('../../schemas/qrSchema');
const QRCode = require('qrcode');
const CommandStatus = require('../../schemas/Command_Status');
const { writeFile, unlink } = require("fs/promises");
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("qr")
        .setDescription("🔹 Lưu dữ liệu Qr và gửi Qr")
        .addSubcommand(c => c
            .setName("setup")
            .setDescription("🔹 Lưu dữ liệu mã QR")
            .addAttachmentOption(o => o
                .setName("image")
                .setDescription("Hình ảnh QR bạn muốn lưu.")
                .setRequired(true)))
        .addSubcommand(c => c
            .setName("send")
            .setDescription("🔹 Gửi mã QR của bạn trong kênh hiện tại"))
        .addSubcommand(c => c
            .setName("creat")
            .setDescription("🔹 Tạo mã QR từ một đường link và lưu vào hệ thống")
            .addStringOption(o => o
                .setName("link")
                .setDescription("Link bạn muốn chuyển thành mã QR")
                .setRequired(true))),       

    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: "/qr" });
        if (commandStatus && commandStatus.status === "off") {
            return interaction.reply({ content: "Lệnh này đã bị tắt, vui lòng thử lại sau.", ephemeral: true });
        }

        if (subCommand === "setup") {
            const imageURL = interaction.options.getAttachment("image");
            const thumbnail = imageURL ? imageURL.url : null;

            try {
                const existingQrData = await qrModel.findOne({ User: interaction.user.id });

                if (existingQrData) {
                    existingQrData.imageURL = thumbnail;
                    existingQrData.GuildName = interaction.guild.name;
                    existingQrData.Guild = interaction.guild.id;
                    existingQrData.displayName = interaction.user.displayName;
                    await existingQrData.save();

                    interaction.reply("Thông tin mã QR của bạn đã được cập nhật thành công!");
                } else {
                    const qrData = new qrModel({
                        displayName: interaction.user.displayName,
                        User: interaction.user.id,
                        GuildName: interaction.guild.name,
                        Guild: interaction.guild.id,
                        imageURL: thumbnail
                    });

                    await qrData.save();
                    interaction.reply("Thông tin mã QR của bạn đã được lưu thành công!");
                }
            } catch (err) {
                console.error(err);
                interaction.reply({ content: "Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại sau.", ephemeral: true });
            }

        } else if (subCommand === "send") {
            try {
                const qrData = await qrModel.findOne({ User: interaction.user.id });

                if (!qrData) {
                    return interaction.reply({ content: "Không tìm thấy thông tin của bạn. Vui lòng sử dụng lệnh `/qr setup` để lưu dữ liệu.", ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`HÃY CHUYỂN KHOẢN VÀO ĐÂY CHO ${qrData.displayName.toUpperCase()}`)
                    .setDescription(`Được tạo bởi: <@${interaction.client.user.id}>`)
                    .setImage(qrData.imageURL)
                    .setFooter({ text: "Để đảm bảo an toàn, hãy xác minh tài khoản trước khi giao dịch." })
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                interaction.reply({ content: "Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại sau.", ephemeral: true });
            }

        } else if (subCommand === "creat") {
            const link = interaction.options.getString("link");
        
            try {
                await interaction.deferReply();
        
                // Kiểm tra nếu link là URL hợp lệ
                const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
                const isURL = urlRegex.test(link);
        
                // **1. Tạo mã QR dưới dạng buffer**
                const qrBuffer = await QRCode.toBuffer(link, { errorCorrectionLevel: "H" });
        
                // **2. Lưu ảnh tạm thời vào server**
                const fileName = `qrcode_${interaction.user.id}.png`;
                const filePath = path.join(__dirname, "../../Thư mục lưu mã QR không được xóa", fileName);
                await writeFile(filePath, qrBuffer);
        
                // **3. Gửi ảnh lên Discord để lấy URL**
                const attachment = new AttachmentBuilder(filePath, { name: fileName });
                // const message = await interaction.channel.send({
                //     content: isURL 
                //         ? `Mã QR này sẽ dẫn bạn đến: ` // ${link}
                //         : `Đây là mã QR mà bạn yêu cầu, mã QR này sẽ được lưu vào dữ liệu bot, bạn có thể dùng lệnh **/qr send** để lấy mã:`, // \`\`\`${link}\`\`\``
                //     files: [attachment]
                // });

                const message = await interaction.channel.send({
                    content: `${isURL ? `` : `Đây là mã QR mà bạn yêu cầu, mã QR này sẽ được lưu vào dữ liệu bot, bạn có thể dùng lệnh **/qr send** để lấy mã:`}`,
                    files: [attachment]
                });
        
                // **4. Lấy URL từ Discord CDN**
                const imageUrl = message.attachments.first()?.url;
                if (!imageUrl) {
                    return interaction.reply({ content: "Đã xảy ra lỗi khi lấy URL hình ảnh.", ephemeral: true });
                }
        
                // **5. Lưu URL vào MongoDB**
                const existingQrData = await qrModel.findOne({ User: interaction.user.id });
        
                if (existingQrData) {
                    existingQrData.imageURL = imageUrl;
                    existingQrData.GuildName = interaction.guild.name;
                    existingQrData.Guild = interaction.guild.id;
                    existingQrData.displayName = interaction.user.displayName;
                    await existingQrData.save();
                } else {
                    const newQrData = new qrModel({
                        displayName: interaction.user.displayName,
                        User: interaction.user.id,
                        GuildName: interaction.guild.name,
                        Guild: interaction.guild.id,
                        imageURL: imageUrl
                    });
        
                    await newQrData.save();
                }
        
                await interaction.deleteReply();
            } catch (err) {
                console.error(err);
                interaction.reply({ content: "Đã xảy ra lỗi khi tạo mã QR. Vui lòng thử lại sau.", ephemeral: true });
            }
        }
        
    }
};






// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const qrModel = require('../../schemas/qrSchema');
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("qr")
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
//             .setDescription("🔹 Gửi mã QR của bạn trong kênh hiện tại")),

//     async execute(interaction) {
//         const subCommand = interaction.options.getSubcommand();

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: "/qr" });
//         if (commandStatus && commandStatus.status === "off") {
//             return interaction.reply({ content: "Lệnh này đã bị tắt, vui lòng thử lại sau.", ephemeral: true });
//         }

//         if (subCommand === "setup") {
//             const imageURL = interaction.options.getAttachment("image");

//             // Kiểm tra và xử lý thumbnail
//             const thumbnail = imageURL ? imageURL.url : null;

//             try {                
//                 // Tìm dữ liệu QR của người dùng trong cơ sở dữ liệu
//                 const existingQrData = await qrModel.findOne({ User: interaction.user.id });

//                 if (existingQrData) {
//                     // Nếu người dùng đã có dữ liệu QR, cập nhật thông tin
//                     existingQrData.imageURL = thumbnail;
//                     existingQrData.GuildName = interaction.guild.name;
//                     existingQrData.Guild = interaction.guild.id;
//                     existingQrData.displayName = interaction.user.displayName;

//                     // Lưu cập nhật vào MongoDB
//                     await existingQrData.save();

//                     interaction.reply("Thông tin mã QR của bạn đã được cập nhật thành công!");
//                 } else {
//                     // Nếu người dùng chưa có dữ liệu QR, tạo mới
//                     const qrData = new qrModel({
//                         displayName: interaction.user.displayName,
//                         User: interaction.user.id,
//                         GuildName: interaction.guild.name,
//                         Guild: interaction.guild.id,
//                         imageURL: thumbnail
//                     });

//                     // Lưu dữ liệu mới vào MongoDB
//                     await qrData.save();

//                     interaction.reply("Thông tin mã QR của bạn đã được lưu thành công!");
//                 }
//             } catch (err) {
//                 console.error(err);
//                 interaction.reply({ content: "Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại sau.", ephemeral: true });
//             }
//         } else if (subCommand === "send") {
//             try {
//                 const qrData = await qrModel.findOne({
//                     User: interaction.user.id
//                 });

//                 if (!qrData) {
//                     return interaction.reply({ content: "Không tìm thấy thông tin của bạn. Vui lòng sử dụng lệnh `/qr setup` để lưu dữ liệu.", ephemeral: true });
//                 }

//                 const embed = new EmbedBuilder()
//                     .setColor("Green")
//                     .setTitle(`HÃY CHUYỂN KHOẢN VÀO ĐÂY CHO ${qrData.displayName.toUpperCase()}`)
//                     .setDescription(`Được tạo bởi: <@${interaction.client.user.id}>`)
//                     .setImage(qrData.imageURL)
//                     .setFooter({ text: "Để đảm bảo an toàn, hãy xác minh tài khoản trước khi giao dịch." })
//                     .setTimestamp();

//                 interaction.reply({ embeds: [embed] });
//             } catch (err) {
//                 console.error(err);
//                 interaction.reply({ content: "Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại sau.", ephemeral: true });
//             }
//         }
//     }
// };