const Canvas = require('canvas');
const path = require('path');
const fs = require('fs');

class Welcome {
  constructor(options = {}) {
    this.width = 800;
    this.height = 300;

    // Font mặc định: Poppins, không cần path nếu đã có sẵn trong hệ thống
    this.font = {
      name: options?.font?.name ?? 'Poppins',
      path: options?.font?.path
    };

    this.backgroundType = null; // 'image' hoặc 'color'
    this.backgroundValue = null;

    this.avatarURL = null;
    this.title = '';
    this.description = '';

    this.borderColor = '#000000';
    this.avatarBorderColor = '#000000';
    this.overlayOpacity = 0;

    this._registeredFonts = new Set();
  }

  Background(type, value) {
    if (type !== 'image' && type !== 'color') {
      throw new Error('Background chỉ nhận "image" hoặc "color"');
    }
    this.backgroundType = type;
    this.backgroundValue = value;
    return this;
  }

  Avatar(url) {
    this.avatarURL = url;
    return this;
  }

  Title(text) {
    this.title = text;
    return this;
  }

  Description(text) {
    this.description = text;
    return this;
  }

  Border(color) {
    this.borderColor = color;
    return this;
  }

  AvatarBorder(color) {
    this.avatarBorderColor = color;
    return this;
  }

  BorderOpacity(value) {
    if (typeof value !== 'number' || value < 0 || value > 1) {
      throw new Error('BorderOpacity cần giá trị number từ 0 đến 1');
    }
    this.overlayOpacity = value;
    return this;
  }

  /**
   * Cho phép người dùng đổi font trong lúc gọi chain method.
   * fontFilename là tên file font, ví dụ: 'Roboto-Regular.ttf'
   * Tìm trong thư mục ./fonts/ gốc của dự án
   */
  setFont(fontFilename) {
    const fontsDir = path.join(process.cwd(), 'fonts');
    const fontPath = path.join(fontsDir, fontFilename);

    if (!fs.existsSync(fontPath)) {
      throw new Error(`Font file không tồn tại: ${fontPath}`);
    }

    this.font = {
      name: path.parse(fontFilename).name,
      path: fontPath
    };

    return this;
  }

  /**
   * Đăng ký font nếu chưa có
   */
  _registerFontIfNeeded() {
    if (this.font.path && !this._registeredFonts.has(this.font.path)) {
      Canvas.registerFont(this.font.path, { family: this.font.name });
      this._registeredFonts.add(this.font.path);
    }
  }

  async build() {
    const canvas = Canvas.createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Đăng ký font nếu cần
    this._registerFontIfNeeded();

    // Vẽ background
    if (this.backgroundType === 'image' && this.backgroundValue) {
      try {
        const bg = await Canvas.loadImage(this.backgroundValue);
        ctx.drawImage(bg, 0, 0, this.width, this.height);
      } catch {
        ctx.fillStyle = '#2f3136';
        ctx.fillRect(0, 0, this.width, this.height);
      }
    } else if (this.backgroundType === 'color' && this.backgroundValue) {
      ctx.fillStyle = this.backgroundValue;
      ctx.fillRect(0, 0, this.width, this.height);
    } else {
      ctx.fillStyle = '#2f3136';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // Overlay đen với opacity
    if (this.overlayOpacity > 0) {
      ctx.fillStyle = `rgba(0,0,0,${this.overlayOpacity})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // Vẽ border bao quanh ảnh
    const borderWidth = 8;
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = this.borderColor;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, this.width - borderWidth, this.height - borderWidth);

    // Vẽ avatar hình tròn + viền
    if (this.avatarURL) {
      try {
        const avatar = await Canvas.loadImage(this.avatarURL);

        const avatarSize = 256;
        const avatarX = 20;
        const avatarY = (this.height - avatarSize) / 2;

        ctx.save();

        // Viền avatar
        ctx.beginPath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = this.avatarBorderColor;
        ctx.shadowColor = this.avatarBorderColor;
        ctx.shadowBlur = 10;
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        // Cắt avatar hình tròn
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
      } catch {
        // Lỗi load avatar, bỏ qua
      }
    }

    // Vẽ Title
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'top';
    ctx.font = `bold 48px "${this.font.name}"`;

    const titleX = 300;
    let titleY = 50;

    const titleLines = this.title.split('\n');
    for (const line of titleLines) {
      ctx.fillText(line, titleX, titleY);
      titleY += 54;
    }

    // Vẽ Description
    ctx.font = `28px "${this.font.name}"`;
    ctx.fillStyle = '#CCCCCC';

    let descY = titleY + 10;
    const descLines = this.description.split('\n');
    for (const line of descLines) {
      ctx.fillText(line, titleX, descY);
      descY += 34;
    }

    return canvas.toBuffer('image/png');
  }
}

module.exports = Welcome;

