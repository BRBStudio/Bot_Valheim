const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const vd = 'https://www.youtube.com/'
const tinycolor = require("tinycolor2");
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('statute_server')
        .setDescription('🔹 Tạo embed với quy định của server')
        .addBooleanOption(option =>
            option.setName('title')
                .setDescription('Có sử dụng tiêu đề mặc định hay không?')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('\\n-xuống dòng,{id kênh},```khung```,đường dẫn-[tên hiển thị](https://discord.com/channels/ID)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Màu bạn muốn nhúng (Tên màu, ví dụ: red, blue)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('title-custom')
                .setDescription('Tiêu đề tùy chỉnh')
                .setRequired(false) // Đặt thành false ban đầu
        )
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Chèn link kênh mà bạn để luật ở đó vào title')
                .setRequired(false)
        )
        .addAttachmentOption((option) =>
            option
              .setName("image")
              .setDescription("Ảnh to")
              .setRequired(false)
        )
        .addAttachmentOption(option =>
            option.setName('thumbnail')
                .setDescription('Ảnh nhỏ')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
              .setName("link-button")
              .setDescription(`Nhập một Link Wed, bạn cũng có thể đặt tên cho link đó.Ví dụ: ${vd} | Tên nút`)
              .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("fieldop1")
            .setDescription("Tên Trường.")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("fieldopv1")
            .setDescription("Văn bản bạn muốn thêm vào trường văn bản bổ sung.")
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('footer_text')
                .setDescription('Viết Chân trang')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('footer_icon')
                .setDescription('Thêm icon vào chân trang bằng link hình ảnh hoặc link biểu tượng cảm xúc.')
                .setRequired(false)
        ),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/statute_server' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Định nghĩa hàm isValidUrl
        function isValidUrl(url) {
            const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
            return urlRegex.test(url);
        }

        // Định nghĩa hàm isValidEmoji
        function isValidEmoji(emoji) {
            const emojiRegex = /^<a?:\w+:\d+>$/;
            return emojiRegex.test(emoji);
        }
        
        // Lấy dữ liệu từ người dùng qua interaction options
        const options = interaction.options;
        const useDefaultTitle = options.getBoolean("title") ?? true;
        const customTitle = options.getString("title-custom");    
        let description = options.getString("description"); // Updated line
        const imageAttachment = options.getAttachment("image");
        const url = options.getString("url");
        const footerText = options.getString("footer_text");
        const footerIcon = options.getString("footer_icon");
        const thumbnailAttachment = options.getAttachment("thumbnail");
        const fieldop1 = options.getString("fieldop1") || " ";
        const fieldopv1 = options.getString("fieldopv1") || " ";
        const linkButton = options.getString("link-button");
        // Chuyển đổi tên màu thành mã HEX
        const colorObject = tinycolor(options.getString("color"));

        // Kiểm tra nếu `title` là true và `title-custom` được chọn
        if (useDefaultTitle === true && customTitle) {
            return await interaction.reply({ content: "Bạn chỉ có thể dùng lựa chọn title-custom khi mà bạn chọn false cho lựa chọn title.", ephemeral: true });
        }

        if (useDefaultTitle === false && !customTitle) {
            return await interaction.reply({ content: "Bạn đã chọn không sử dụng tiêu đề mặc định, nhưng bạn chưa cung cấp tiêu đề tùy chỉnh.", ephemeral: true });
        }

        // Kiểm tra và xử lý imageAttachment và thumbnailAttachment
        const imageAttachmentURL = imageAttachment ? imageAttachment.url : null;
        const thumbnailAttachmentURL = thumbnailAttachment ? thumbnailAttachment.url : null;

        let title = "Luật Server"; // Mặc định tiêu đề
        if (!useDefaultTitle) {
            title = customTitle || "Luật Server"; 
        }

        // Xử lý các định dạng đặc biệt trong mô tả
        description = description
            .replace(/\{(\d+)\}/g, "<#$1>") // Thay thế ID kênh bằng kênh tương ứng
            .replace(/```/g, "```") // Đảm bảo định dạng khung văn bản được giữ nguyên
            .replace(/\[(.*?)\]\((.*?)\)/g, "[$1]($2)"); // Giữ nguyên định dạng của các liên kết

        // Người dùng có thể sử dụng \n để xuống dòng trong mô tả
        description = description.replace(/\\n/g, "\n");

        // Kiểm tra URL hợp lệ cho lựa chọn 'url'
        if (url && !isValidUrl(url) && !isValidEmoji(url)) {
            return await interaction.reply({ content: "Url nằm bên dưới Tiêu đề Title nên bạn phải dùng link đường dẫn đến 1 trang web cho lựa chọn url.", ephemeral: true });
        }


        // Xác thực đầu vào biểu tượng chân trang
        if (footerIcon && !/^https?:\/\//.test(footerIcon) && /[^\w-]/.test(footerIcon)) {
            return await interaction.reply({ content: "Bạn phải dùng link hình ảnh hoặc link biểu tượng cảm xúc cho lựa chọn footer_icon.", ephemeral: true });
        }

        // Kiểm tra và xử lý linkButton
        let linkButtonField = null;
        if (linkButton) {
          const [link, buttonName] = linkButton.split("|").map((s) => s.trim());
          if (!isValidUrl(link)) {
            return await interaction.reply({ content: "***Tôi cũng đã đưa ra ví dụ khi bạn lựa chọn link-button rồi, bạn nên đọc để hiểu rõ mình đang làm gì!***\n\nBạn phải dùng link hợp lệ cho lựa chọn link-button.", ephemeral: true });
          }
          linkButtonField = { name:"```Link Web:```", value: `[${buttonName || "Link Web!"}](${link})` };
        }

        const fields = [
            { name: `${fieldop1}`, value: `${fieldopv1}` },
            linkButtonField // Thêm linkButton vào các trường nếu tồn tại
          ].filter((field) => field && field.name && field.value);


          if (!colorObject.isValid()) {                                                 //////////////////// if (!colorCode)
            return await interaction.reply({ content: "Màu bạn nhập không hợp lệ.", ephemeral: true,});
          }
              // Chuyển đổi tên màu thành mã HEX
              const colorCode = colorObject.toHexString();

        // Tạo embed mới và thiết lập dữ liệu từ người dùng
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setURL(url)
            .setThumbnail(thumbnailAttachmentURL)
            .setTimestamp()
            .setColor(colorCode);
            
        

        // Thiết lập footer nếu có footerText và/hoặc footerIcon
        if (footerText || footerIcon) {
            embed.setFooter({
                text: footerText || "",
                iconURL: footerIcon || null, // Kiểm tra và đặt footerIcon nếu có
            });
        }

        if (imageAttachmentURL) {
            embed.setImage(imageAttachmentURL);
          }

          if (thumbnailAttachmentURL) {
            embed.setThumbnail(thumbnailAttachmentURL);
        }
        // Thêm các trường đã lọc vào embed
        embed.addFields(fields);

        // Gửi embed đã tạo
        await interaction.reply({ embeds: [embed] });
    },
};
