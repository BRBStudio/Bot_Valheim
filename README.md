# 🤖 BRB Studio Discord Bot

🎮 **Bot Discord chính thức của cộng đồng Valheim [BRB Studio]**, hỗ trợ quản lý người chơi, lệnh slash thông minh, embed tiếng Việt thân thiện và tích hợp nhiều tiện ích game hiện đại.

> ⚠️ **Luu y:** Vui long **khong chinh sua bat ky file nao trong du an**, ngoai tru file `.env`, de tranh loi hoac xung dot khi cap nhat ve sau.

---

## 🚀 Tính năng nổi bật

- Slash command trực quan (có gợi ý)
- Lệnh tùy chỉnh
- Cập nhật với Discord.js v14
- Tạo embed nhanh bằng thư viện [embed-brb](https://www.npmjs.com/package/embed-brb)
- Quản lý thành viên, ping hệ thống, kiểm tra trạng thái server
- Tích hợp MongoDB để lưu dữ liệu người dùng, video, trạng thái
- Hệ thống phát nhạc, nhận diện giọng nói, dịch tự động, tạo QR
- Hỗ trợ mini-game, chống spam, và nhiều tính năng mở rộng
- Vé
- lệnh /cm bot để xem tất cả lệnh của bot
- lệnh /cm new sẽ cho bạn biết về sử dụng lệnh mới, không phải lệnh slash cũng như lệnh tiền tố
- Vai trò phản ứng
- Quà tặng
- Dễ sử dụng
[x] Và nhiều hơn nữa
[x] Bạn không muốn tự mình lưu trữ? [Hãy sử dụng bot công khai của chúng tôi](https://discord.com/oauth2/authorize?client_id=1319906655525277759&permissions=8&integration_type=0&scope=bot)

---

## 📦 Cài đặt

### 0. Cap nhat khi co phien ban moi

Khi du an duoc cap nhat tren GitHub (them lenh moi, sua loi, cai tien...), ban co the lay ban moi nhat nhu sau:

```bash
git pull origin main
```
> ⚠️ **Lưu ý:** Vui long **không chỉnh sửa bất kỳ file nào trong dự án**, ngoại trừ file `.env`, để tránh lỗi hoặc xung đột khi cập nhật phiên bản mới của tôi. Nếu bạn đã chỉnh sửa các file trong thư mục (trừ .env), có thể sẽ gặp lỗi xung đột khi chạy `git pull`

## 0.1 Liên hệ & Hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào khi sử dụng bot, vui lòng mở một Issue tại trang GitHub của dự án **hoặc** liên hệ trực tiếp với Admin qua [Discord của dev](https://discord.gg/s2ec8Y2uPa)

### 1. Clone dự án
```bash
git clone https://github.com/BRBStudio/Bot_Valheim.git
cd Bot_Valheim ( nếu có sự thay đổi và cần chạy lệnh npm install )
```

### 2. Cài dependencies
```bash
npm install ( nếu có sự thay đổi )
```

### 3. Cấu hình biến môi trường `.env`
Tạo file `.env` trong thư mục gốc và thêm các biến sau:

```env
TOKEN=TOKEN_BOT_DISCORD_CỦA_BẠN
CLIENT_ID=Mã_khách_hàng_BOT
GUILD_ID=ID_Máy_Chủ ( bot không dùng, nếu bạn muốn dùng có thể thêm vào )
MONGODB_URI=mongodb+srv://...
```

---

## 🧪 Chạy bot

```bash
node index.js
node .
```

---

## 🛠 Cấu trúc thư mục

```
📁 commands/          # Slash commands
📁 events/            # Event listeners (ready, interactionCreate...)
📁 utils/             # Helper functions
📁 database/          # Mongoose models
📁 embeds/            # Tùy chỉnh EmbedBRB
📁 assets/            # Hình ảnh / media
📄 index.js           # Điểm khởi chạy bot
📄 .env               # Biến môi trường
📄 package.json       # Thông tin dự án
```

---

## 🧪 Ví dụ: Slash Command `/testembed`

```js
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBRB, reply } = require('embed-brb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testembed')
    .setDescription('Test EmbedBRB')
    .addStringOption(opt => opt.setName('name').setDescription('Tên').setRequired(true))
    .addStringOption(opt => opt.setName('value').setDescription('Nội dung').setRequired(true)),

  async execute(int) {
    reply(int);
    await int.deferReply({ ephemeral: true });

    const name = int.options.getString('name');
    const value = int.options.getString('value');

    const embed = new EmbedBRB(int)
      .Mau('xanh_đẹp')
      .Tieude('BRB Studio')
      .Noidung('Chào mừng bạn đến với Valheim!')
      .ThemLuaChon(name, value)
      .Truong(
        { name: 'Người chơi', value: 'Cơn Mưa Lạ', inline: true },
        { name: 'Trạng thái', value: 'Đang chiến đấu', inline: true }
      )
      .Chantrang('BRB Studio • Valheim Server')
      .tg_guitn();

    await int.editReply({ tnn: [embed] });
  },
};
```

---

## 📚 Tài nguyên liên quan

- [embed-brb trên npm](https://www.npmjs.com/package/embed-brb)
- [discord.js Documentation](https://discord.js.org/#/docs/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Valheim on Steam](https://store.steampowered.com/app/892970/Valheim/)

---

## 🧑‍💻 Tác giả

**Cơn Mưa Lạ**  
📸 Nhiếp ảnh gia & dev Discord Bot  
• [facebook](https://www.facebook.com/leenonam3) 
• [youtube](https://www.youtube.com/@brb4164/featured) 
• [zalo](https://zalo.me/pc)

---

---

## ☕ Ủng hộ tác giả

Nếu bạn thấy dự án này hữu ích hoặc muốn mình có thêm động lực để phát triển nhiều tính năng hơn nữa, hãy ủng hộ mình một ly cà phê tại:

👉 [Ủng hộ tác giả một ly cà phê tại đây](https://coff.ee/conmuala)

Mỗi ly cà phê là một lời cảm ơn quý giá giúp mình tiếp tục sáng tạo, cải tiến bot, và duy trì cộng đồng BRB Studio mạnh mẽ hơn! 💙

---

## 🪪 Giấy phép

MIT License © 2025 – Cơn Mưa Lạ