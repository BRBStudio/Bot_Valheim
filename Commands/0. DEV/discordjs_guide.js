const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("discordjs_guide")
    .setDescription("🔹 Tìm hiểu về các sự kiện và mã hóa Discord.js"),

    guildSpecific: true,
    guildId: `1319809040032989275`, // Máy chủ Emoji Command Bot

async execute(interaction) {
    const permissionEmbed = new EmbedBuilder().setDescription("`❌` Bạn không có quyền sử dụng lệnh này!").setColor(config.embedGreen).setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });
        
        // Kiểm tra quyền đặc biệt
    if (!checkPermissions(interaction)) {
        return interaction.reply({ embeds: [permissionEmbed] });
    }

    const embeds = [
        new EmbedBuilder()
            .setTitle("Hướng dẫn: Xác định Events")
            .setColor(config.embedCyan)
            .setDescription("**Thông tin về các sự kiện Discord.js và mã hóa cho người mới bắt đầu.**")
            .addFields(
            {
                name: "Sự định nghĩa",
                value:
                "Trong Discord.js, bạn xác định các sự kiện bằng cách đính kèm trình xử lý sự kiện vào ứng dụng khách Discord của mình.",
            },
            {
                name: "Ví dụ",
                value:
                "```js\nconst { SlashCommandBuilder } = require('discord.js')\n```",
            },
            {
                name: "Giải trình",
                value:
                "Trình xử lý sự kiện là các hàm được thực thi khi một sự kiện cụ thể xảy ra. Ví dụ: để sử dụng `SlashCommandBuilder`, bạn cần cài đặt Discord.js. Để cài đặt Discord.js, hãy chạy lệnh sau trong terminal của bạn:\n\n```bash\nnpm install discord.js\n```",
                inline: false,
            }
        ),
        new EmbedBuilder()
            .setTitle("Hướng dẫn: Bắt đầu Code")
            .setColor(config.embedCyan)
            .setDescription(
            "**Bắt đầu tạo mã.**\nTất cả những gì bạn cần làm để bắt đầu mã (CHƯA HOÀN THÀNH) là xác định một số sự kiện bạn có thể cần và viết lệnh gạch chéo thực tế."
            )
            .addFields(
            {
                name: "Ví dụ",
                value:
                "```js\nconst { SlashCommandBuilder } = require('discord.js')\n\nmodule.exports = {\n    data: new SlashCommandBuilder()\n        .setName('Example')\n        .setDescription('Example')\n}\n```",
            },
            {
                name: "Giải trình",
                value:
                "```js\nconst { SlashCommandBuilder } = require('discord.js'): Dòng này nhập lớp SlashCommandBuilder từ thư viện 'discord.js'. SlashCommandBuilder là một lớp tiện ích được Discord.js cung cấp để xây dựng các lệnh gạch chéo.\n\nmodule.exports = { ... }: Dòng này xuất một mô-đun chứa lệnh gạch chéo Discord.js. Đối tượng module.exports là thứ sẽ được sử dụng khi bao gồm hoặc yêu cầu mô-đun này trong một tệp khác.\n\ndata: new SlashCommandBuilder(): Điều này tạo ra một thể hiện của lớp SlashCommandBuilder. SlashCommandBuilder được sử dụng để xác định các thuộc tính của lệnh gạch chéo.\n\n.setName('Example'): Đặt tên của lệnh gạch chéo thành 'Example'. Tên là cách người dùng gọi lệnh.\n\n.setDescription('Example'): Đặt mô tả của lệnh gạch chéo thành 'Example'. Mô tả cung cấp thông tin bổ sung về những gì lệnh thực hiện.\n```",
                inline: false,
            }
        ),
            new EmbedBuilder()
            .setTitle("Hướng dẫn: Yêu cầu về ý định Gateway")
            .setColor(config.embedCyan)
            .setDescription("**Hiểu và định cấu hình ý định của Gateway**")
            .addFields(
            {
                name: "Giới thiệu",
                value:
                "Ý định Gateway là một phần quan trọng của Discord.js v14, cung cấp cách đăng ký các sự kiện cụ thể và nhận thông tin cập nhật. Tuy nhiên, người dùng thường gặp phải sự cố liên quan đến ý định bị thiếu hoặc được định cấu hình không chính xác.",
                },
            {
                name: "Kiểm tra các yêu cầu về ý định",
                value:
                "Trước khi đi sâu vào hướng dẫn, hãy đảm bảo kiểm tra xem bot của bạn cần xử lý những sự kiện nào. Discord.js yêu cầu bạn kích hoạt một số ý định nhất định để truy cập dữ liệu sự kiện cụ thể.",
            },
            {
                name: "Kích hoạt ý định",
                value:
                'Để bật ý định cho bot của bạn, hãy truy cập [Discord Developer Portal (Cổng thông tin dành cho nhà phát triển Discord)](https://discord.com/developers/applications), chọn ứng dụng của bạn và điều hướng đến phần "Bot". Bạn sẽ tìm thấy danh sách các tùy chọn mục đích. Kích hoạt các ý định tương ứng với các sự kiện mà bot của bạn yêu cầu.',
            },
            {
                name: "Ví dụ",
                value:
                'Ví dụ: nếu bot của bạn cần nghe thông tin cập nhật của thành viên, bạn sẽ kích hoạt mục đích "GuildMembers". Nếu bot của bạn cần nội dung tin nhắn, bạn sẽ kích hoạt mục đích "GuildMessages".',
            },
            {
                name: "Xử lý ý định trong mã",
                value:
                "Trong mã bot Discord.js của bạn, hãy đảm bảo rằng bạn đáp ứng các ý định cần thiết khi tạo phiên bản ứng dụng khách của mình. Điều này thường được thực hiện trong quá trình khởi tạo ứng dụng khách:\n```js\nconst { Client } = require('discord.js');\nconst client = new Client({\n ý định: [\n // Danh sách yêu cầu của bạn ý định\n ],\n});\n```",
            },
            {
                name: "Tài liệu",
                value:
                "Để biết thông tin chi tiết về từng mục đích và các sự kiện liên quan, hãy tham khảo [tài liệu Discord.js](https://discord.js.org/). Đảm bảo bot của bạn đăng ký các ý định phù hợp để có trải nghiệm liền mạch.",
            }
        ),
        new EmbedBuilder()
            .setTitle("Hướng dẫn: Quyền của bot")
            .setColor(config.embedCyan)
            .setDescription("**Hiểu quyền của Discord.js Bot**")
            .addFields(
            {
                name: "Giới thiệu",
                value:
                "Quyền của bot rất cần thiết để xác định những hành động mà bot Discord của bạn có thể thực hiện trên máy chủ. Việc định cấu hình các quyền chính xác đảm bảo bot của bạn có thể hoạt động như dự định mà không gây ra sự cố.",
            },
            {
                name: "Kiểm tra quyền",
                value:
                "Trước khi thêm bot của bạn vào máy chủ, hãy đảm bảo xem xét cẩn thận các quyền mà bot yêu cầu. Các quyền này thường được liệt kê khi bạn mời bot thông qua Cổng thông tin dành cho nhà phát triển Discord.",
            },
            {
                name: "Quyền chung",
                value:
                "Dưới đây là một số quyền phổ biến mà bot của bạn có thể cần:\n- Đọc tin nhắn\n- Gửi tin nhắn\n- Quản lý tin nhắn\n- Kết nối (đối với kênh thoại)\n- Xem kênh (đối với kênh văn bản và kênh thoại)\n- Sử dụng Biểu tượng cảm xúc bên ngoài",
            },
            {
                name: "Xử lý quyền trong mã",
                value:
                "Khi lập trình bot của bạn, hãy đảm bảo rằng bạn yêu cầu các quyền cần thiết khi tạo phiên bản máy khách của mình. Ví dụ:\n```js\nconst { Client } = require('discord.js');\nconst client = new Client({\n ý định: [...],\n một phần: [... ],\n hiện diện: {...},\n được phépĐề cập: {...},\n RestTimeOffset: ..., // tùy chọn\n RestWsBridgeTimeout: ..., // tùy chọn\n retryLimit: .. ., // tùy chọn\n});\n```",
            },
            {
                name: "Tài liệu",
                value:
                "Tham khảo [tài liệu Discord.js](https://discord.js.org/) để biết danh sách đầy đủ các quyền và mô tả của chúng. Đảm bảo bot của bạn chỉ yêu cầu những quyền mà nó thực sự cần để bảo mật và quyền riêng tư của người dùng.",
            }
        ),
        new EmbedBuilder()
            .setTitle("Các vấn đề chung: Embeds and Messages")
            .setColor(config.embedCyan)
            .setDescription(
            "Nếu bạn đang gặp vấn đề với việc tạo và gửi tin nhắn hoặc nội dung nhúng, hãy xem xét các mẹo sau:"
            )
            .addFields(
            {
                name: "1. Sử dụng đúng cách gửi tin nhắn:",
                value:
                "Đảm bảo bạn đang sử dụng đúng phương pháp để gửi tin nhắn và nội dung nhúng. Kiểm tra tài liệu cho `textChannel.send()` và `textChannel.send({ embeds: [embed] })`.",
            },
            {
                name: "2. Định dạng nhúng thích hợp:",
                value:
                "Kiểm tra xem nội dung nhúng của bạn có được định dạng đúng hay không. Việc sử dụng thuộc tính hoặc màu sắc không chính xác có thể dẫn đến kết quả không mong muốn.",
            },
            {
                name: "3. Quyền:",
                value:
                "Đảm bảo bot của bạn có các quyền cần thiết để gửi tin nhắn và nhúng vào kênh mục tiêu. Ngoài ra, hãy kiểm tra xem bot của bạn có được phép nhúng liên kết hay không nếu nội dung nhúng của bạn chứa chúng.",
            },
            {
                name: "4. Cú pháp mã:",
                value:
                "Nếu bạn đang sử dụng khối mã, hãy đảm bảo cú pháp đúng. Cú pháp không chính xác có thể ảnh hưởng đến việc hiển thị thông báo và nội dung nhúng.",
            },
            {
                name: "5. Khả năng tương thích phiên bản thư viện:",
                value:
                "Xác minh xem phiên bản Discord.js của bạn có tương thích với phiên bản Node.js của bạn không. Sử dụng các phiên bản thích hợp để tránh các vấn đề tương thích.",
            },
            {
                name: "6. Xử lý lỗi:",
                value:
                "Triển khai xử lý lỗi thích hợp trong mã của bạn để phát hiện mọi vấn đề liên quan đến việc gửi tin nhắn hoặc nội dung nhúng. Kiểm tra các thông báo lỗi để biết manh mối về điều gì có thể xảy ra.",
            }
        ),
        new EmbedBuilder()
            .setTitle("Các vấn đề chung: Discord.js")
            .setColor(config.embedCyan)
            .setDescription(
            "Nếu bạn gặp khó khăn khi làm việc với Discord.js, hãy xem xét các vấn đề và giải pháp phổ biến sau:"
            )
            .addFields(
            {
                name: "1. Phiên bản không phù hợp:",
                value:
                "Đảm bảo rằng phiên bản Discord.js của bạn tương thích với phiên bản Node.js của bạn. Việc sử dụng các phiên bản không khớp có thể dẫn đến những lỗi không mong muốn. Bạn có thể kiểm tra tính tương thích trong [tài liệu Discord.js](https://discord.js.org/#/docs/main/stable/typedef/VersionResolvable).",
            },
            {
                name: "2. Thay đổi API:",
                value:
                "Hãy theo dõi tài liệu Discord.js để biết mọi thay đổi hoặc ngừng sử dụng gần đây. API có thể được cập nhật và việc sử dụng các phương pháp lỗi thời có thể gây ra sự cố. Luôn tham khảo [tài liệu chính thức](https://discord.js.org/).",
            },
            {
                name: "3. Giới hạn tỷ lệ:",
                value:
                "Hãy chú ý đến giới hạn tốc độ API của Discord. Nếu bot của bạn thực hiện hành động quá nhanh, nó có thể đạt giới hạn tốc độ, dẫn đến những hạn chế tạm thời. Triển khai các cơ chế giới hạn tốc độ thích hợp trong mã của bạn để tránh những vấn đề này.",
            },
            {
                name: "4. Xử lý sự kiện:",
                value:
                "Đảm bảo rằng trình xử lý sự kiện của bạn được thiết lập chính xác. Cấu hình sai trong xử lý sự kiện có thể dẫn đến sự kiện không kích hoạt như mong đợi. Kiểm tra kỹ đăng ký sự kiện của bạn và các chức năng gọi lại tương ứng.",
            },
            {
                name: "5. Intents Configuration:",
                value:
                "Với việc giới thiệu Ý định cổng trong Discord.js v14, hãy đảm bảo rằng bạn đã định cấu hình các ý định cần thiết cho các sự kiện mà bot của bạn cần. Tham khảo [tài liệu Discord.js](https://discord.js.org/) để biết thông tin về ý định và các sự kiện liên quan.",
            }
        ),
        new EmbedBuilder()
            .setTitle("Hướng dẫn: Các lỗi Discord.js thường gặp")
            .setColor(config.embedCyan)
            .setDescription(
            "Dưới đây là một số lỗi phổ biến mà người dùng gặp phải trong Discord.js:"
            )
            .addFields(
            {
                name: "1. `TypeError: Cannot read property X of undefined`",
                value:
                "Đảm bảo rằng thuộc tính (X) bạn đang cố truy cập thực sự tồn tại. Kiểm tra xem đối tượng đã được xác định chưa hoặc sử dụng chuỗi tùy chọn (`?.`).",
            },
            {
                name: "2. `DiscordAPIError: Missing Permissions`",
                value:
                "Đảm bảo bot của bạn có các quyền cần thiết trong kênh hoặc máy chủ mục tiêu. Kiểm tra kỹ các quyền cần thiết cho hành động cụ thể.",
            },
            {
                name: "3. `DiscordAPIError: Missing Access`",
                value:
                "Kiểm tra xem bot của bạn có quyền truy cập vào tài nguyên mà nó đang cố gắng tương tác hay không (ví dụ: kênh hoặc bang hội).",
            },
            {
                name: "4. `DiscordAPIError: Privileged Intent is required`",
                value:
                "Kích hoạt mục đích đặc quyền bắt buộc trong Cổng thông tin nhà phát triển Discord của bạn cho các sự kiện liên quan. Cập nhật mã bot của bạn để bao gồm ý định.",
            },
            {
                name: "5. `DiscordAPIError: Missing Intent`",
                value:
                "Đảm bảo rằng bạn vượt qua tất cả các ý định cần thiết khi tạo phiên bản máy khách Discord.js của mình. Tham khảo tài liệu Discord.js để biết các yêu cầu về mục đích.",
            },
            {
                name: "6. `DiscordAPIError: Unknown Interaction`",
                value:
                "Kiểm tra xem trình xử lý tương tác của bạn có được thiết lập chính xác hay không. Đảm bảo rằng bạn đang xử lý các tương tác dự kiến.",
            },
            {
                name: "7. `Error: listen EADDRINUSE`",
                value:
                "Lỗi này cho biết cổng mà bot của bạn đang cố sử dụng đã được sử dụng. Thay đổi số cổng trong mã bot của bạn hoặc chấm dứt quá trình sử dụng cổng.",
            },
            {
                name: "8. `Error [TOKEN_INVALID]: An invalid token was provided`",
                value:
                "Kiểm tra kỹ mã thông báo bạn đã cung cấp trong mã bot của mình. Đảm bảo không có lỗi chính tả hoặc khoảng trống thừa.",
            }
        ),
        new EmbedBuilder()
            .setTitle("Hướng dẫn: Tùy chọn chuỗi trong lệnh Discord.js")
            .setColor(config.embedCyan)
            .setDescription(
            "Tùy chọn chuỗi cho phép người dùng cung cấp kiểu nhập văn bản khi sử dụng lệnh."
            )
            .addFields(
            {
                name: "1. Xác định String Option",
                value:
                "```js\n.addStringOption(option =>\n option.setName('text')\n .setDescription('Nhập văn bản cho lệnh')\n .setRequired(true)\n)```",
            },
            {
                name: "2. Truy cập String Option",
                value:
                "```js\n// Nhận giá trị của tùy chọn 'văn bản'\nconst textOption = tương tác.options.getString('text');```",
            },
            {
                name: "3. Sử dụng tùy chọn trong logic của bạn",
                value:
                "```js\n// Logic lệnh của bạn ở đây...\ninteraction.reply(`Bạn đã nhập: ${textOption}`);```",
            }
        ),
        new EmbedBuilder()
            .setTitle("Guide: Tương tác người dùng")
            .setColor(config.embedCyan)
            .setDescription(
            "Tìm hiểu cách triển khai tương tác của người dùng bằng các nút và menu thả xuống."
            )
            .addFields(
            {
                name: "Buttons",
                value:
                "Các nút cho phép người dùng tương tác với bot của bạn bằng cách nhấp vào chúng. Đây là cách bạn có thể tạo và xử lý các nút:",
            },
            {
                name: "Tạo Buttons",
                value:
                "```js\nconst button = new ButtonBuilder()\n  .setCustomId('button_id')\n  .setLabel('Click me')\n  .setStyle(ButtonStyle.Primary);\n```",
            },
            {
                name: "Thêm nút vào tin nhắn",
                value:
                "```js\nconst row = new ActionRowBuilder().addComponents(button);\n\ninteraction.reply({\n  content: 'Click the button:',\n  components: [row],\n});\n```",
            },
            {
                name: "Xử lý các lần nhấp vào nút",
                value:
                "```js\nconst collector = interaction.channel.createMessageComponentCollector({ filter: i => i.isButton() && i.customId === 'button_id' });\ncollector.on('collect', i => {\n  // Nút xử lý bấm vào đây\n  i.reply('Button clicked!');\n});\n```",
            },
            {
                name: "Menu thả xuống",
                value:
                "Menu thả xuống cho phép người dùng chọn các tùy chọn từ danh sách. Dưới đây là cách tạo và xử lý các menu thả xuống:",
            },
            {
                name: "Tạo menu thả xuống",
                value:
                "```js\nconst selectMenu = new ActionRowBuilder()\n  .setCustomId('select_id')\n  .addComponents(\n    new ButtonBuilder()\n      .setCustomId('button_id')\n      .setLabel('Click me')\n      .setStyle(ButtonStyle.Primary)\n  );\n```",
            },
            {
                name: "Thêm menu thả xuống vào tin nhắn",
                value:
                "```js\nconst row = new ActionRowBuilder().addComponents(selectMenu);\n\ninteraction.reply({\n  content: 'Choose an option:',\n  components: [row],\n});\n```",
            },
            {
                name: "Xử lý các lựa chọn thả xuống",
                value:
                "```js\nconst collector = interaction.channel.createMessageComponentCollector({ filter: i => i.isSelectMenu() && i.customId === 'select_id' });\ncollector.on('collect', i => {\n  // Xử lý lựa chọn thả xuống ở đây\n  const selectedValue = i.values[0];\n  i.reply(`You selected: ${selectedValue}`);\n});\n```",
            }
        ),
        new EmbedBuilder()
            .setTitle("Hướng dẫn: Xử lý lỗi trong Discord.js")
            .setColor(config.embedCyan)
            .setDescription(
            "Tìm hiểu cách xử lý lỗi trong bot Discord.js của bạn một cách hiệu quả."
            )
            .addFields(
            {
                name: "Khối Try-Catch",
                value:
                "Sử dụng các khối try-catch để bọc các phần quan trọng trong mã của bạn và bắt lỗi. Điều này ngăn toàn bộ bot bị hỏng do một lỗi duy nhất.",
                inline: false,
            },
            {
                name: "Ví dụ",
                value:
                "```js\ntry {\n  // Mã của bạn có thể gây ra lỗi\n} catch (error) {\n  console.error(`Error occurred: ${error.message}`);\n  // Xử lý lỗi một cách khéo léo\n}\n```",
                inline: false,
            },
            {
                name: "Lỗi ghi nhật ký",
                value:
                "Ghi lại thông tin chi tiết về lỗi, bao gồm dấu thời gian, thông báo lỗi và dấu vết ngăn xếp để hỗ trợ gỡ lỗi.",
                inline: false,
            },
            {
                name: "Ví dụ",
                value:
                "```js\ntry {\n  // Mã của bạn có thể gây ra lỗi\n} catch (error) {\n  console.error(`Error occurred at ${new Date().toLocaleString()}: ${error.stack}`);\n  // Xử lý lỗi một cách khéo léo\n}\n```",
                inline: false,
            },
            {
                name: "Lỗi Events",
                value:
                "Lắng nghe các sự kiện lỗi do ứng dụng khách Discord.js của bạn phát ra để nắm bắt và xử lý các lời từ chối chưa được xử lý cũng như các lỗi không đồng bộ khác.",
                inline: false,
            },
            {
                name: "Example",
                value:
                "```js\nclient.on('error', (error) => {\n  console.error(`Client encountered an error: ${error.message}`);\n  // Handle the error gracefully\n});\n```",
                inline: false,
            },
            {
                name: "Centralized Error Handling",
                value:
                "Consider implementing a centralized error handling mechanism, like a dedicated function or middleware, for consistent error handling.",
                inline: false,
            },
            {
                name: "Ví dụ",
                value:
                "```js\nfunction handleError(error) {\n  console.error(`An error occurred: ${error.message}`);\n  // Additional error handling logic\n}\n\n// Usage\ntry {\n  // Your code that might throw an error\n} catch (error) {\n  handleError(error);\n}\n```",
                inline: false,
            },
            {
                name: "User-Friendly Responses",
                value:
                "Cung cấp thông báo lỗi thân thiện với người dùng khi tương tác với người dùng. Tránh tiết lộ thông tin nhạy cảm và hướng dẫn người dùng về những gì đã xảy ra.",
                inline: false,
            },
            {
                name: "Ví dụ",
                value:
                "```js\ntry {\n  // Mã của bạn có thể gây ra lỗi\n} catch (error) {\n  interaction.reply(`An error occurred: ${error.message}`);\n  // Xử lý lỗi một cách khéo léo\n}\n```",
                inline: false,
            },
            {
                name: "Từ chối Promise",
                value:
                "Xử lý các lời từ chối bằng cách sử dụng sự kiện `unhandledRejection`. Ghi lại những lời từ chối này và xem xét triển khai một quy trình để xử lý chúng một cách khéo léo.",
                inline: false,
            },
            {
                name: "Ví dụ",
                value:
                "```js\nprocess.on('unhandledRejection', (reason, promise) => {\n  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason.message}`);\n  // Xử lý lời từ chối một cách khéo léo\n});\n```",
                inline: false,
            },
            {
                name: "Stack Traces",
                value:
                "Bao gồm dấu vết ngăn xếp trong nhật ký lỗi của bạn. Dấu vết ngăn xếp cung cấp thông tin có giá trị về chuỗi lệnh gọi hàm dẫn đến lỗi.",
                inline: false,
            },
            {
                name: "Ví dụ",
                value:
                "```js\ntry {\n  // Mã của bạn có thể gây ra lỗi\n} catch (error) {\n  console.error(`Error occurred: ${error.message}`, error.stack);\n  // Xử lý lỗi một cách khéo léo\n}\n```",
                inline: false,
            },
            {
                name: "Kịch bản lỗi kiểm tra",
                value:
                "Kiểm tra bot của bạn trong các tình huống có thể gây ra lỗi, chẳng hạn như dữ liệu nhập của người dùng không hợp lệ hoặc lỗi API. Điều này giúp bạn xác định và xử lý các vấn đề tiềm ẩn một cách chủ động.",
                inline: false,
            },
            {
                name: "Tài liệu",
                value:
                "Ghi lại các lỗi phổ biến và giải pháp khắc phục. Việc có phần khắc phục sự cố trong tài liệu về bot của bạn có thể hỗ trợ người dùng và các nhà phát triển khác.",
                inline: false,
            },
            {
                name: "Cải tiến liên tục",
                value:
                "Thường xuyên xem xét và cập nhật chiến lược xử lý lỗi của bạn. Xem xét phản hồi từ người dùng và thành viên cộng đồng để nâng cao độ tin cậy của bot.",
                inline: false,
            }
        ),      
    ];

    let currentPage = 0;

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("previous_button")
            .setLabel("Trang trước")
            .setStyle("Primary"),
        new ButtonBuilder()
            .setCustomId("next_button")
            .setLabel("Trang tiếp theo")
            .setStyle("Primary"),
        new ButtonBuilder()
            .setCustomId("end_button")
            .setLabel("Kết thúc hướng dẫn")
            .setStyle("Danger")
    );

    const message = await interaction.reply({
        embeds: [embeds[currentPage]],
        components: [row],
    });

    // Tạo bộ lọc cho các tương tác từ người dùng
    const filter = (i) =>
        (i.customId === "previous_button" ||
            i.customId === "next_button" ||
            i.customId === "end_button" ||
            i.customId === "restart_button") &&
        i.user.id === interaction.user.id;

    // Tạo bộ thu thập dữ liệu tương tác
    const collector = interaction.channel.createMessageComponentCollector({
        filter,
    });

    collector.on("collect", async (i) => {
        if (i.customId === "previous_button") {
            currentPage--;
        } else if (i.customId === "next_button") {
            currentPage++;
        } else if (i.customId === "end_button") {

            await message.edit({
                content: "Hướng dẫn đã kết thúc.",
                components: [],
            });

            setTimeout(() => {
                message.delete();
            }, 0);

            collector.stop();
            return;

        } else if (i.customId === "restart_button") {
            currentPage = 0;
        }
        if (currentPage >= 0 && currentPage < embeds.length) {

            await i.update({
                embeds: [embeds[currentPage]],
                components: [row],
            });

        } else {
            await i.update({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Không còn trang nào.")
                    .setColor(config.embedCyan),
            ],
            components: [
                new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("restart_button")
                    .setStyle("Primary")
                    .setEmoji(`<:UK8zaNG86f:1250122827596697620>`)
                ),
            ],
            });
        }
    });

    collector.on("end", (collected) => {
            if (collected.size === 0) {
                interaction.followUp("Bạn mất quá nhiều thời gian để trả lời.");
            }
        });
    },
};
