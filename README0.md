## Tên bot: Mới
## Tác giả: Valheim Survival
## Phiên bản phát hành: v1.0.0

```[**https://coff.ee/conmuala**](https://coff.ee/conmuala) // Ủng hộ tác giả một ly cà phê tại đây```

# Bot này được tạo bởi Cơn Mưa Lạ
- Cần bất kỳ hỗ trợ mã hóa nào, hãy tham gia máy chủ mã hóa của tôi https://discord.gg/s2ec8Y2uPa

- CÀI ĐẶT NÀY (nếu bạn chưa có)
    + node.js https://nodejs.org/en (đảm bảo cài đặt phiên bản LTS!)
    + Mã Visual Studio https://code.visualstudio.com/

- Cổng thông tin Discord Dev: https://discord.com/developers/applications

- Đảm bảo tham gia máy chủ mã hóa của tôi nếu bạn cần hỗ trợ và nó sẽ xây dựng một cộng đồng mã hóa tốt: Mã hóa Pu1s3: https://discord.gg/s2ec8Y2uPa

- https://cdn.discordapp.com/emojis/1250385786600296459.gif tìm emoji gif

# Mời Bot của tôi:
- https://discord.com/oauth2/authorize?client_id=1268569140466028649&permissions=8&integration_type=0&scope=bot

# Đường dẫn để nhắn tin với người dùng
- [liên hệ Valheim Survival](https://discord.com/users/703098031092006964) thay '703098031092006964' thành id của mình

# Tất cả máy chủ Discord của tôi:
- Chính ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★: https://discord.gg/s2ec8Y2uPa
- Phụ: hiện tại chưa muốn cho vào

# Trang web của tôi:
- https:// hiện tại chưa có

- Error: no test specified\" && exit 1

# const response = await axios.get('https://api.github.com/repos/Kkkermit/Testify/releases/latest'); trong version.js đây là mẫu

# Kiểm tra xem lệnh được gửi từ một máy chủ hoặc không
    if (!interaction.guild) {
        return interaction.reply("Lệnh này chỉ có thể được sử dụng trong một máy chủ.");
        }

# Lấy mầu từ dữ liệu config.js thì thêm 2 cái bên dưới
- const config = require('../../config');
- config.embedYellow

# Chú thích:
- InteractionTypes :
    + Nơi xử lý các lệnh

- Interaction trong thư mục Events:
    + Nơi xử lý sự kiện khi người dùng chọn một tùy chọn và thực hiện lệnh tương ứng.

- handler: 
    + Đọc danh sách file có trong các thư mục
    + Tạo danh sách lệnh, sử dụng require nhập lệnh tệp và lấy các thuộc tính namevà descriptionlệnh của tệp đó.
    + Hiển thị lệnh thông tin bao gồm tên và mô tả của chúng và trong bảng điều khiển

- PrefixCommands:
    + Nơi viết lệnh tiền tố

- schemas:
    + Nơi để file lưu trữ mongoDB

- lib:
    + Nơi để thông tin phiên bản bot
    + Nơi chuyển đổi mầu ( dùng đường dẫn const colors = require('../../lib/colorConverter'); )

- ¹⁹⁸⁸Host Valheim¹⁹⁸⁸

- EventHandling:
    + Nơi xử lý tin nhắn

- config.js:
    + Nơi để thông tin dữ liệu như mầu, lấy dữ liệu bằng cách dùng const config = require(../../config)
    + Dùng thời gian hồi chiêu thì dùng `const { COOLDOWN } = require('../../config');` và `cooldown: COOLDOWN,`
    + Cách lấy hàm DescriptionInviteBot: (clientId)
        *   const clientId = client.user.id; // Thay clientId bằng ID của bot, có thể lấy từ config hoặc client
        *   .setDescription(config.DescriptionInviteBot(clientId)) // Gọi hàm với clientId
        * ${client.user.username} tên bot
        * client.user.displayAvatarURL() avatar bot

- index.js:
    + Thư mục chính của bot

- ButtonPlace.js:
    + Tạo các nút nút tại đây, sau đó khi cần có thể lấy thông tin từ đây mà không cần phải viết nút tại đó nữa
    + Cách tạo hàm và lấy hàm row99 với interaction dùng trong lệnh hi
        *   Cách lấy hàm:
                    Tạo row với interaction
                    const row = row99(interaction);
                    sau đó dùng như bình thường
        *   Cách tạo hàm:
                    const row99 = (interaction) => new ActionRowBuilder()

rgb(51, 51, 51)
    
- Dùng [Valheim Survival](https://discord.com/users/940104526285910046) để nhắn tin trực tiếp tới người dùng, thay id 940104526285910046 thành id mong muốn

- Dùng await i.deferUpdate(); // Xác nhận sự tương tác mà không gửi tin nhắn
- Dùng await i.deferReply(); // Xác nhận sự tương tác và gửi tin nhắn kết hợp với await i.deleteReply();
- Dùng await i.deleteReply(); // Xóa phản hồi đã trì hoãn
- Dùng await i.editReply({ content: '...' }); // Sửa tin nhắn đã
- Dùng await i.followUp({ content: '...' }); // Gửi tin nhắn tiếp
- Dùng interaction.reply ({ embeds: [embed], components: [button], ephemeral: true }) // dùng để phản hồi tin nhắn
- user.displayName dùng displayName để hiển thị tên hiển thị người dùng trong discord (tôi thích dùng điều này hơn)

# Các cài đặt liên quan:
- npm i colors (để sử dụng màu cho terminal)
- npm i ascii-table (để sử dụng màu cho terminal)
- npm i dotenv (cài đặt .env)
- npm i figlet (dùng để làm đẹp terminal)
- npm i sharp để xử lý và thao tác hình ảnh trong Node.js
    + Chuyển đổi định dạng hình ảnh
    + Thay đổi kích thước hình ảnh (Resize)
    + Cắt và chỉnh sửa hình ảnh
    + Nén hình ảnh
    + Hiệu suất cao
    + Xử lý ảnh bất đồng bộ
- npm i canvacord là một thư viện Node.js giúp tạo các ảnh và ảnh động với sự hỗ trợ của Canvacord API để tạo ảnh meme, ảnh động, và nhiều loại hình ảnh khác
    + Tạo ảnh động, ảnh có hiệu ứng động, và chỉnh sửa ảnh trực tiếp thông qua API
    + Tạo ảnh meme, cung cấp nhiều mẫu ảnh meme phổ biến có thể tùy chỉnh với văn bản và hình ảnh
    + Cho phép gửi các ảnh động và ảnh thay đổi trực tiếp trong các tin nhắn của bot
    + Cung cấp nhiều loại hiệu ứng đặc biệt như ảnh động GIF, ảnh với hiệu ứng đặc biệt, và nhiều tính năng khác.
- npm i canvas
    + Tạo hình ảnh động.
    + Vẽ đồ họa cho các ứng dụng trò chơi
    + Tạo hình ảnh tùy chỉnh, chẳng hạn như biểu đồ, thẻ xếp hạng (rank cards), hoặc avatar.
    + Kết xuất văn bản và hình ảnh cho các ứng dụng server-side.
- npm i colors
- npm i colors
- npm i colors
- npm uninstall cli-table3 ( xóa bỏ thư viện cli-table3 ra khỏi dự án)
- npm i pollcord
- npm i canvafy@7.0.4 phiên bản 7.0.4 để dùng kết đôi mã lệnh tiền tố pairing.js
- npm install yt-search sử dụng trong lệnh ?ytb để tìm video trên youtube
- npm install googleapis phiên bản 134.0.0 dùng trong lệnh ytb để xem phim ( không dùng phiên bản "googleapis": "^144.0.0")
- npm list googleapis để kiểm tra phiên bản đã cài đặt


- .setDMPermission(false) không để hiện thị lệnh trong tin nhắn DM

- lệnh speak  cần cài npm i ffmpeg-static và npm i libsodium-wrappers

- npm install bottleneck
    + dùng để giới hạn số lượng cập nhật đồng thời

- npm install discord.js@14.15.3
- npm install discord.js@14.14.1

- // Hiệu ứng dấu chấm `...`, bỏ trì hoãn
        let repeatCount = 1;
        const interval = setInterval(async () => {
            repeatCount = (repeatCount % 3) + 1;
            const repeat = '.'.repeat(repeatCount);
            await interaction.editReply({ content: `Tôi đang xóa, hãy chờ chút${repeat}` });
        }, 1000);

- // Lấy tên người dùng từ đối tượng message
        const name = interaction.author.displayName;

- LỖI const sourcebin = require("sourcebin_js");  TẠI CÁC FILE **ticketTranscript.js** VÀ **servers.js** ĐÃ ĐƯỢC SỬA THÀNH DÙNG THƯ VIỆN **npm install sourcebin**, ĐỂ KIỂM TRA NẾU KHÔNG LỖI GÌ THÌ SẼ XÓA THƯ VIỆN **"sourcebin_js": "^0.0.3-ignore",**

- .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice) // Chỉ hiển thị các kênh văn bản, kênh thoại

- if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return await interaction.reply({ content: '**Bạn không có quyền dùng lệnh này!**', ephemeral: true });
        } quyền dùng lệnh
        
- const { checkAdministrator } = require(`../../permissionCheck`)
// Kiểm tra quyền quản lý tin nhắn
        const hasPermission = await checkManageMessages(interaction);
        if (!hasPermission) return; // Nếu không có quyền, thoát khỏi hàm

- hoist: true, // hiển thị vai trò riêng biệt

- xủ lý khi tương tác lỗi, khi gặp lỗi gủi về webhook
        const interactionError = require('../../Events/WebhookError/interactionError');
        try {
            
        } catch (error) {
                interactionError.execute(interaction, error, client);
            }

- xử lý trong events, khi gặp lỗi gủi về webhook
try {
    // Mã xử lý sự kiện
} catch (err) {
    console.error('Lỗi kết nối MongoDB:', err);
    interactionError.execute(client.user, err, client);
}

- xử lý lỗi trong tương tác tiền tố, khi gặp lỗi gủi về webhook
try {
    // Mã xử lý lệnh tiền tố
} catch (error) {
            // Xử lý lỗi và gửi thông báo tới webhook
            await interactionError.execute(message, error, message.client);
        }

/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/
- “ ”
Vận Mệnh Kim Cương

- có thời gian sẽ điều chỉnh lại lệnh recruitment

- .setFooter({ text: client.user.username }); hiển thị tên bot

- { name: `\u200b`, value: `\u200b` }, giá trị trường trống

- { collection: 'tên tùy chỉnh' } đặt tên theo ý trong dữ liệu mongoDB

- await interaction.reply({ content: `Tặng quà đã bắt đầu! Phần thưởng: **${reward}**\nThời gian kết thúc: <t:${Math.floor(giveawayEndDate / 1000)}:R>`, ephemeral: true });

- ?retryWrites=true&w=majority&appName=botapha // bỏ botmoi và thay thành dòng này trong .env nếu lỗi

- bit.ly // trang web rút gọn link, ẩn thổng tin bảo mật

- https://discord.com/oauth2/authorize?client_id=1268569140466028649&permissions=8&integration_type=0&scope=bot // link mời bot

- .setDisabled(true); tắt nút

- const button11 = new ButtonBuilder()
            .setCustomId(`button11`)
            .setLabel(`Trang tiếp theo`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`<a:kqWQGPzIsE:1250109668886315119>`)

- .toLowerCase() để chuyển thành chữ thường và .toUpperCase() để chuyển thành chữ viết hoa

- quyền đặc biệt lấy trong config
 + if (!config.specialUsers.includes(message.author.id)) {
                return message.channel.send({ content: config.Dev1 }); // Thông báo nếu người dùng không có quyền
            }

- hình ảnh qr tài khoản ngân hàng của tôi https://i.imgur.com/oY5IfSY.jpeg

- ‎ khoảng trống

- { "Guild": "ID" } (Tìm kiếm theo Guild (ID máy chủ)) hoặc { guildId: "id", userId: "id" } // Tìm kiếm theo User và Guild (Cả máy chủ và người dùng) trong ứng dụng MongoDB Compass


# ###################################################################             THIẾT KẾ WEB           ######################################################################### #

- node app.js để chạy web

- Mã app.js để thiết lập và chạy máy chủ

- Mã index.html để xây dựng giao diện người dùng.

- Mã styles.css sẽ định dạng và làm đẹp trang web.

- Mã script.js sẽ cung cấp chức năng tương tác cho trang web.

- background-size: 100% 50%; /* Đặt chiều rộng 100% và chiều cao 50% của viewport */, background-size: 1920px 1080px; /* Đặt kích thước cố định cho hình nền */

- chỉ hiển thị ở một chiều cao hoặc chiều rộng nhất định
    + height: 100vh; /* Chiều cao 100% viewport */
    + width: 100vw; /* Chiều rộng 100% viewport */


- thêm hướng dẫn người dùng nạp tiền cho premium và mã qr để người dùng nạp tiền cho premium

- mỗi máy chủ hiển thị kết quả khảo sát trong một khối mã riêng

-        -------------------------------------------------------------------------------------      --------------------------------------------
- để kích hoạt bật tắt lệnh thì sử dụng:

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/ping-api' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }```

- dùng ?toggle-command <lệnh> <on|off> để bật tắt lệnh

# ##########################################################                   ĐẨY THƯ VIỆN LÊN NPM                    ########################################################## #

Tạo thư mục cho thư viện
mkdir welcome-brb
cd welcome-brb

Khởi tạo dự án npm
npm init -y

Tạo cấu trúc thư mục
mkdir fonts
mkdir src
touch src/index.js

Thêm file .npmignore
node_modules
example
test


- vào package.json thay "main": "index.js", thành file chứa thư viện như unit.js, "name": "moi", thành tên của thư viện, "version": "1.0.0", phiên bản của thư viện

- npm publish --access public đẩy lên npm công khai

- npm publish đẩy dự án lên npm

- vào package.json thay "main": "index.js", thành file chứa thư viện như unit.js, "name": "moi", thành tên của thư viện, "version": "1.0.0", phiên bản của thư viện

- npm login đăng nhập npm

Quy trình:

Bước 1: Chuẩn bị thư mục dự án thư viện

- Đảm bảo có các file chính:

        + package.json

        + index.js (hoặc file chính thư viện)

        + README.md (mô tả thư viện)

        + LICENSE (giấy phép)

Bước 2: Khởi tạo package.json

- Nếu chưa có file package.json, bạn chạy lệnh: npm init

Bước 3: Đăng nhập vào npm

- npm login (Nhập username, password, email của tài khoản npmjs.com, Nếu chưa có tài khoản, bạn phải tạo trên https://www.npmjs.com/signup)

Bước 4: Kiểm tra tên package đã tồn tại chưa

Trước khi publish, nên kiểm tra tên package có ai dùng chưa trên https://www.npmjs.com/

Tên package phải là duy nhất

Bước 5: Publish lên npm

- chạy lệnh npm publish

Bước 6: Tăng version (nếu publish lại)

- Nếu muốn cập nhật version mới:

    + Mở file package.json, sửa "version" thành số mới (ví dụ "1.0.1")

    + Hoặc dùng lệnh tự động tăng version:

- Cách xoá package NPM (nếu mới publish < 72h)

    + npm unpublish embed-brb --force

- Kiểm tra package trước khi publish

    + npm pack


- gộp 2 dữ liệu mongoDB
    + // Import mongoose
const mongoose = require("mongoose");

// Schema cho Welcome_Default collection
const welcomedefaultSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    defaultWelcomeActive: { type: Boolean, default: false },
    customWelcomeActive: { type: Boolean, default: false }
}, 
    { collection: 'Welcome_Default' }
);

// Schema cho Welcome_Custom collection
const welcomeMessageSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    message: String,
    isEmbed: { type: Boolean, default: false },
    imageUrl: { type: String, default: null },
    rulesChannelId: String,
    defaultWelcomeActive: { type: Boolean, default: false },
    customWelcomeActive: { type: Boolean, default: false }
}, 
    { collection: 'Welcome_Custom' }
);

// Tạo và xuất các model
const WelcomeDefault = mongoose.model("Welcome-Default", welcomedefaultSchema);
const WelcomeMessage = mongoose.model("WelcomeMessage", welcomeMessageSchema);

module.exports = {
    WelcomeDefault,
    WelcomeMessage
};


- 
// Kiểm tra nếu thành viên mới là bot
if (user.bot) {
    console.log(`Thành viên mới là bot: ${user.tag}`); // Log nếu là bot

    // Tìm kiếm người mời bot trong lịch sử sự kiện
    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 28,
    });
    const inviteLog = fetchedLogs.entries.first();
    let inviter = 'Không xác định';

    if (inviteLog) {
        const { executor, createdTimestamp } = inviteLog;
        const inviteTime = Date.now() - createdTimestamp;

        // Kiểm tra nếu người mời bot là trong khoảng thời gian 5 giây (để tránh lỗi)
        if (inviteTime < 5000) {
            // Lấy thông tin người mời
            const inviterMember = await guild.members.fetch(executor.id); // Lấy đối tượng thành viên từ ID của người mời
            inviter = inviterMember.displayName || inviterMember.user.username; // Lấy biệt danh hoặc tên người dùng
            console.log(`Người mời bot: ${inviter}`); // Log người mời bot
        }
    }

    // Gửi thông báo đến kênh văn bản
    const botInviteEmbed = new EmbedBuilder()
        .setTitle(`Một bot mới đã được mời! 🤖`)
        .setDescription(`Người dùng **${inviter}** đã mời bot **${user.username}** vào máy chủ **${guild.name}**. Người mời: ****`)
        .setColor('Blue')
        .setTimestamp();

    // Gửi thông báo vào kênh chào mừng (hoặc kênh bất kỳ mà bạn muốn)
    const welcomeChannel = guild.channels.cache.find(channel => channel.name === 'bot-bot');
    console.log("Kênh chào mừng tìm thấy:", welcomeChannel ? welcomeChannel.name : "Không tìm thấy kênh"); // Log tên kênh chào mừng
    if (welcomeChannel) {
        await welcomeChannel.send({ embeds: [botInviteEmbed] });
        console.log("Thông báo về bot đã được gửi."); // Log khi gửi thông báo
    }
    return; // Kết thúc hàm nếu đây là bot
}

