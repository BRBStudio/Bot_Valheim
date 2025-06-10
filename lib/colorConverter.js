// lib/colorConverter.js
const tinycolor = require('tinycolor2');
const config = require('../config');

// Hàm để chuyển đổi mã màu sử dụng tinycolor
const convertColor = (colorName) => {
  const color = tinycolor(colorName);
  return color.toHexString();
};

// Tạo một đối tượng với tất cả các màu đã được chuyển đổi
const convertedColors = {};
for (const [key, value] of Object.entries(config)) {
  if (key.startsWith('embed')) {
    convertedColors[key] = convertColor(value);
  }
}

module.exports = convertedColors;