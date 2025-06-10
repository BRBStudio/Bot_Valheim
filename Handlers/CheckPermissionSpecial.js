/*
đang dùng cho lệnh:
- ping-staff.js
- discordjs-guide.js
- set-nsfw.js
*/
const { PermissionsBitField } = require('discord.js');
const config = require('../config');

// Hàm kiểm tra quyền
function checkPermissions(interaction) {
    const userId = interaction.user.id;

    if (config.specialUsers.includes(userId)) {
        return true; // Người dùng có quyền đặc biệt
    }

    return false; // Không đủ quyền
}

module.exports = checkPermissions;
