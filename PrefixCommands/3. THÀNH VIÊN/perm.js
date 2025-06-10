const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { permissionMap } = require(`../../permissionMap`);
const interactionError = require('../../Events/WebhookError/interactionError');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    name: 'perm',
    description: `🔸 Kiểm tra vai trò và quyền của người dùng trong máy chủ!`,
    hd: '🔸 ?perm <tag người dùng muốn kiểm tra>',
    aliases: ['q', 'tv8'],

    async execute(message) {

        try {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '?perm' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            // Kiểm tra nếu người dùng có tag một người khác (@user)
            let target = message.mentions.members.first(); // Lấy người dùng được tag
            if (!target) {
                return message.channel.send('Bạn phải tag một người dùng để kiểm tra quyền!');
            }

            // Lấy danh sách các vai trò của người dùng
            // const roles = target.roles.cache;

            // Lấy danh sách các vai trò của người dùng, loại bỏ @everyone
            const roles = target.roles.cache.filter(role => role.name !== '@everyone');

            // Nếu người dùng không có vai trò nào, trả về thông báo
            if (roles.size === 0) {
                return message.channel.send(`${target.user.displayName} không có vai trò nào trong máy chủ này.`);
            }

            // Tạo một Embed để hiển thị
            const embed = new EmbedBuilder()
                .setTitle(`Vai trò và quyền của ${target.user.displayName} trong máy chủ`)
                .setColor(0x00FF00)
                .setTimestamp();

            // Duyệt qua từng vai trò của người dùng
            roles.forEach(role => {
                if (role.name === '@everyone') return; // Bỏ qua vai trò mặc định @everyone

                const permissionsList = [];
                const permissionFlags = Object.keys(PermissionFlagsBits);

                // Kiểm tra từng quyền của vai trò
                permissionFlags.forEach(flag => {
                    if (role.permissions.has(PermissionFlagsBits[flag])) {
                        // Sử dụng permissionMap để dịch quyền sang tiếng Việt nếu có
                        const translatedPermission = permissionMap[flag] || flag;
                        permissionsList.push(`• ${translatedPermission}`);
                    }
                });

                // Tạo một chuỗi quyền dạng danh sách cho từng vai trò
                const permissionList = permissionsList.length > 0 ? permissionsList.join('\n') : 'Không có quyền nào.';

                // Thêm vào embed vai trò và quyền của nó
                embed.addFields({
                    name: `Vai trò: ${role.name}`,
                    value: permissionList,
                    inline: true
                });
            });

            // Gửi embed chứa vai trò và quyền của người dùng
            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            // Xử lý lỗi và gửi thông báo tới webhook
            await interactionError.execute(message, error, message.client);
        }
    }
};
