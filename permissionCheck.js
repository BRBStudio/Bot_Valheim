const { PermissionsBitField } = require('discord.js');

// Kiểm tra quyền quản lý tin nhắn
async function checkManageMessages(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **QUẢN LÝ TIN NHẮN**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền quản trị viên
async function checkAdministrator(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **ADMIN**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền ban thành viên
async function checkBanMembers(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **BAN THÀNH VIÊN**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền quản lý kênh
async function checkManageChannels(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **QUẢN LÝ KÊNH**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền quản lý vai trò
async function checkManageRoles(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **QUẢN LÝ VAI TRÒ**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền quản lý tin nhắn và vai trò
async function checkManageMessagesAndRoles(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
        !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **QUẢN LÝ TIN NHẮN VÀ VAI TRÒ**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền gửi tin nhắn trong kênh
async function checkSendMessages(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendMessages)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **GỬI TIN NHẮN TRONG KÊNH**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền quản lý máy chủ
async function checkManageGuild(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **QUẢN LÝ MÁY CHỦ**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền thêm ứng dụng vào máy chủ
async function checkAddApplications(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.AddReactions)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **THÊM ỨNG DỤNG VÀO MÁY CHỦ**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền quản lý emoji
async function checkManageEmojisAndStickers(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.GuildEmojisAndStickers)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền ** QUẢN LÝ EMOJI VÀ STICKERS**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền tạo tin nhắn riêng tư
async function checkCreatePrivateMessages(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **TẠO TIN NHẮN RIÊNG TƯ**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền tạo kênh
async function checkCreateChannels(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **TẠO KÊNH**`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền quản lý thành viên, quyền này có thể cấm, bock hoặc kick Tv
async function checkModerateMembers(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **QUẢN LÝ THÀNH VIÊN**`, ephemeral: true });
        return false;
    }
    return true;
}


// Kiểm tra quyền sửa đổi nhãn dán
async function checkEditStickers(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageStickers)) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! bạn cần có quyền **SỬA ĐỔI STICKERS`, ephemeral: true });
        return false;
    }
    return true;
}

// Kiểm tra quyền chủ sở hữu máy chủ
async function checkOwner(interaction) {
    if (interaction.guild.ownerId !== interaction.user.id) {
        await interaction.reply({ content: `Bạn không có quyền dùng lệnh này! chỉ **CHỦ SỞ HỮU MÁY CHỦ** mới có quyền`, ephemeral: true });
        return false;
    }
    return true;
}

module.exports = {
    checkManageMessages,
    checkAdministrator,
    checkBanMembers,
    checkManageChannels,
    checkManageRoles,
    checkManageMessagesAndRoles,
    checkSendMessages,
    checkManageGuild,
    checkAddApplications,
    checkManageEmojisAndStickers,
    checkCreatePrivateMessages,
    checkCreateChannels,
    checkModerateMembers,
    checkEditStickers,
    checkOwner
};
