# 🤖 BRB Studio Discord Bot

🎮 **Bot Discord chính thức của cộng đồng Valheim [BRB Studio]**, hỗ trợ quản lý người chơi, lệnh slash thông minh, embed tiếng Việt thân thiện và tích hợp nhiều tiện ích game hiện đại.

---

## 🚀 Tính năng nổi bật

- Slash command trực quan (có gợi ý)
- Tạo embed nhanh bằng thư viện [embed-brb](https://www.npmjs.com/package/embed-brb)
- Quản lý thành viên, ping hệ thống, kiểm tra trạng thái server
- Tích hợp MongoDB để lưu dữ liệu người dùng, video, trạng thái
- Hệ thống phát nhạc, nhận diện giọng nói, dịch tự động, tạo QR
- Hỗ trợ mini-game, chống spam, và nhiều tính năng mở rộng

---

## 📦 Cài đặt

### 1. Clone dự án
```bash
git clone https://github.com/yourusername/brb_studio_bot.git
cd brb_studio_bot
```

### 2. Cài dependencies
```bash
npm install
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