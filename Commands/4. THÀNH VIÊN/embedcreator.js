const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const vd = 'https://www.youtube.com/'
const tinycolor = require("tinycolor2");
const CommandStatus = require('../../schemas/Command_Status');

	module.exports = {
		data: new SlashCommandBuilder()
			.setName("embedcreator")
			.setDescription("🔹 Tạo nội dung nhúng tùy chỉnh để gửi trong kênh.")
			.addStringOption((option) =>
				option
					.setName("title")
					.setDescription("Tiêu đề sẽ được hiển thị trên phần nhúng")
					.setRequired(true)
				)
			.addStringOption((option) =>
				option
					.setName("description")
					.setDescription("Mô tả sẽ được hiển thị trên phần nhúng")
					.setRequired(true)
				)
			.addStringOption((option) =>
				option
					.setName("color")
					.setDescription("Màu bạn muốn nhúng (Tên màu, ví dụ: red, blue).")
					.setRequired(true)
					.addChoices(
					{ name: "Mầu đỏ", value: "Red" },
					{ name: "Mầu xanh dương", value: "Blue" },
					{ name: "Mầu xanh lá cây", value: "Green" },
					{ name: "Mầu tím", value: "Purple" },
					{ name: "Mầu cam", value: "Orange" },
					{ name: "Mầu vàng", value: "Yellow" },
					{ name: "Mầu đen", value: "Black" },
					{ name: "Mầu xanh lơ (rất đẹp)", value: "Cyan" },
					{ name: "Mầu hồng", value: "Pink" },
					{ name: "Mầu hoa oải hương", value: "Lavender" },
					{ name: "Mầu sẫm (Mầu đỏ sẫm, hơi tím)", value: "Maroon" },
					{ name: "Mầu ô liu", value: "Olive" },
					{ name: "Mầu xanh lam (xanh nước biển)", value: "Teal" },
					{ name: "Mầu bạc", value: "Silver" },
					{ name: "Mầu vàng đồng", value: "Gold" },
					{ name: "Mầu be", value: "Beige" },
					{ name: "Mầu hải quân (xanh dương đậm)", value: "Navy" },
					{ name: "Mầu tím đậm", value: "Indigo" },
					{ name: "Mầu hồng tím", value: "Violet" },
					)
				)
			.addChannelOption((option) =>
				option
					.setName("channel-id")
					.setDescription("Kênh nơi nội dung nhúng được gửi tới.")
					.setRequired(true)
				)
			.addAttachmentOption((option) =>
				option
					.setName("image")
					.setDescription("Hình ảnh sẽ được hiển thị trên nhúng.")
					.setRequired(false)
				)
			.addAttachmentOption((option) =>
				option
					.setName("thumbnail")
					.setDescription("Hình thu nhỏ sẽ được hiển thị khi nhúng.")
					.setRequired(false)
				)
			.addStringOption((option) =>
				option
					.setName("fieldop1")
					.setDescription("Một trường văn bản bổ sung sẽ được thêm vào phần nhúng.")
					.setRequired(false)
				)
			.addStringOption((option) =>
				option
					.setName("fieldopv1")
					.setDescription("Giá trị bạn muốn thêm vào trường văn bản bổ sung.")
					.setRequired(false)
				)
			.addStringOption((option) =>
				option
					.setName("fieldop2")
					.setDescription("Một trường văn bản bổ sung sẽ được thêm vào phần nhúng.")
					.setRequired(false)
				)
			.addStringOption((option) =>
				option
					.setName("fieldopv2")
					.setDescription("Giá trị bạn muốn thêm vào trường văn bản bổ sung.")
					.setRequired(false)
				)
			.addStringOption((option) =>
				option
					.setName("fieldop3")
					.setDescription("Một trường văn bản bổ sung sẽ được thêm vào phần nhúng.")
					.setRequired(false)
				)
			.addStringOption((option) =>
				option
					.setName("fieldopv3")
					.setDescription("Giá trị bạn muốn thêm vào trường văn bản bổ sung.")
					.setRequired(false)
				)
			.addStringOption((option) =>
				option
					.setName("footer")
					.setDescription("Chân trang sẽ được hiển thị ở cuối phần nhúng.")
					.setRequired(false)
				)
			.addBooleanOption((option) =>
				option
					.setName("author")
					.setDescription("Đặt tên và ảnh hồ sơ của bạn ở đầu phần nhúng.")
				)
			// .addStringOption((option) =>
			// option
			// 	.setName("link-button")
			// 	.setDescription(`Nhập một Link Wed, bạn cũng có thể đặt tên cho link đó.Ví dụ: ${vd} | Tên nút`)
			// 	.setRequired(false)
			// ),
			// Thay thế lựa chọn "link-button" thành hai lựa chọn riêng biệt cho link và tên nút
			.addStringOption((option) =>
				option
					.setName("link-url")
					.setDescription("Nhập một URL cho link.")
					.setRequired(false)
			)
			.addStringOption((option) =>
				option
					.setName("link-name")
					.setDescription("Nhập tên cho nút của link.")
					.setRequired(false)
			),

		async execute(interaction) {

			// Kiểm tra trạng thái của lệnh
			const commandStatus = await CommandStatus.findOne({ command: '/embedcreator' });

			// Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
			if (commandStatus && commandStatus.status === 'off') {
				return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
			}

			const { options } = interaction;

			const title = options.getString("title");
			const description = options.getString("description");
			const color = options.getString("color");
			const imageAttachment = options.getAttachment("image");
			const thumbnailAttachment = options.getAttachment("thumbnail");
			const fieldop1 = options.getString("fieldop1") || " ";
			const fieldopv1 = options.getString("fieldopv1") || " ";
			const fieldop2 = options.getString("fieldop2") || " ";
			const fieldopv2 = options.getString("fieldopv2") || " ";
			const fieldop3 = options.getString("fieldop3") || " ";
			const fieldopv3 = options.getString("fieldopv3") || " ";
			const footer = options.getString("footer") || " ";
			const author = options.getBoolean("author");
			const channel = options.getChannel("channel-id");
			// const linkButton = options.getString("link-button");

			// Kiểm tra và xử lý imageAttachment và thumbnailAttachment
			const imageAttachmentURL = imageAttachment ? imageAttachment.url : null;
			const thumbnailAttachmentURL = thumbnailAttachment ? thumbnailAttachment.url : null;

			// // Kiểm tra và xử lý linkButton
			// let linkButtonField = null;
			// if (linkButton) {
			// const [link, buttonName] = linkButton.split("|").map((s) => s.trim());
			// linkButtonField = { name:"```Link Web:```", value: `[${buttonName || "Link Web!"}](${link})` };
			// }

			// Lấy URL và tên nút từ các lựa chọn mới
			const linkUrl = options.getString("link-url");
			const linkText = options.getString("link-name");
	
			// Tạo link button nếu URL tồn tại
			let linkButtonField = null;
			if (linkUrl) {
				linkButtonField = { name: "```Link Web:```", value: `[${linkText || "Link Web!"}](${linkUrl})` };
			}
			
			const fields = [
				{ name: `${fieldop1}`, value: `${fieldopv1}` },
				{ name: `${fieldop2}`, value: `${fieldopv2}` },
				{ name: `${fieldop3}`, value: `${fieldopv3}` },
				linkButtonField // Thêm linkButton vào các trường nếu tồn tại
			].filter((field) => field && field.name && field.value);

			// Chuyển đổi tên màu thành mã HEX
			const colorObject = tinycolor(options.getString("color"));

			if (!colorObject.isValid()) {                                                 //////////////////// if (!colorCode)
				return await interaction.reply({ content: "Màu bạn nhập không hợp lệ.", ephemeral: true,});
			}
				// Chuyển đổi tên màu thành mã HEX
			const colorCode = colorObject.toHexString();

			const embed = new EmbedBuilder()
				.setTitle(title)
				.setDescription(description)
				.setColor(colorCode) //.setColor(`${color}`)
				.setThumbnail(thumbnailAttachmentURL)
				.setTimestamp();

			// Thêm các trường đã lọc vào embed
			embed.addFields(fields);

			embed.setFooter({
				text: `${footer}`,
				iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
			});

			if (imageAttachmentURL) {
			embed.setImage(imageAttachmentURL);
			}

			if (thumbnailAttachmentURL) {
			if (!thumbnailAttachmentURL.startsWith("http")) {
						return await interaction.reply({
						content: "Bạn đã cung cấp giá trị không hợp lệ cho hình ảnh thu nhỏ của mình!",
						ephemeral: true,
					});
				}
			}

			if (author) {
				embed.setAuthor({
					name: interaction.member.user.displayName,
					iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
				});
			}

		if (channel.isTextBased()) {
				await interaction.reply({
				content: `Nội dung nhúng của bạn đã được gửi thành công đến ${channel}`,
				ephemeral: true,
			});

			await channel.send({ embeds: [embed], ephemeral: true });
		} else {
			await interaction.reply({
				content: "Kênh bạn chọn không phải là kênh văn bản hợp lệ.",
				ephemeral: true,
			});
        }
    },
};