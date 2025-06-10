const { SlashCommandBuilder, PermissionsBitField, BitField } = require('discord.js');
const LockSchema = require('../../schemas/lockSchema');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock_channel')
        .setDescription('🔹 Khóa hoặc mở khóa kênh')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Chọn hành động: khóa hoặc mở khóa')
                .setRequired(true)
                .addChoices(
                    { name: 'Khóa kênh', value: 'lock' },
                    { name: 'Mở khóa kênh', value: 'open' }
                )
        ),
    async execute(interaction, client) {
        try {
            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/lock_channel' });
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            // Kiểm tra quyền Administrator
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({
                    content: '⚠️ Lệnh này chỉ có thể được sử dụng bởi quản trị viên (Administrator) của máy chủ!',
                    ephemeral: true
                });
            }

            await interaction.deferReply();

            // Lấy tùy chọn hành động
            const action = interaction.options.getString('action');

            // Lấy hoặc tạo dữ liệu khóa kênh
            const lockData = await LockSchema.findOne({
                Guild: interaction.guild.id,
                Channel: interaction.channel.id
            }) ?? await LockSchema.create({
                Guild: interaction.guild.id,
                Channel: interaction.channel.id,
                Permissions: interaction.channel.permissionOverwrites,
                Locked: false
            });

            // Xử lý hành động
            if (action === 'lock') {
                if (lockData.Locked) {
                    return interaction.editReply('⚠️ Kênh này đã bị khóa trước đó!');
                }

                const oldPermissions = [];
                for (const perms of interaction.channel.permissionOverwrites.cache.values()) {
                    oldPermissions.push({
                        id: perms.id,
                        allow: perms.allow.bitfield,
                        deny: perms.deny.bitfield
                    });
                }

                await lockData.updateOne({
                    Permissions: oldPermissions
                });

                const permissions = [{
                    id: interaction.guild.id,
                    allow: [],
                    deny: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.CreatePublicThreads,
                        PermissionsBitField.Flags.CreatePrivateThreads,
                        PermissionsBitField.Flags.SendMessagesInThreads,
                        PermissionsBitField.Flags.AddReactions
                    ]
                }];

                const defaultPerms = interaction.channel.permissionsFor(interaction.guild.id).bitfield;
                if (defaultPerms & PermissionsBitField.Flags.ViewChannel) {
                    permissions[0].allow.push(PermissionsBitField.Flags.ViewChannel);
                } else {
                    permissions[0].deny.push(PermissionsBitField.Flags.ViewChannel);
                }

                await interaction.channel.permissionOverwrites.set(permissions);

                await lockData.updateOne({ Locked: true });

                await interaction.editReply('🔒 Kênh này đã bị khóa, vui lòng chờ!');
            } else if (action === 'open') {
                if (!lockData.Locked) {
                    return interaction.editReply('⚠️ Kênh này đã được mở khóa trước đó!');
                }

                const permissions = lockData.Permissions.map(perm => ({
                    ...perm,
                    allow: new BitField(perm.allow),
                    deny: new BitField(perm.deny)
                }));

                await interaction.channel.permissionOverwrites.set(permissions);

                await lockData.updateOne({ Locked: false });

                await interaction.editReply('🔓 Kênh này đã được mở khóa, cảm ơn sự kiên nhẫn của bạn!');
            } else {
                await interaction.editReply('⚠️ Hành động không hợp lệ.');
            }
        } catch (error) {
            await interaction.editReply('Lệnh này không có tác dụng với bài viết trong diễn đàn.');
        }
    }
};







// const { SlashCommandBuilder, PermissionsBitField, BitField } = require('discord.js');
// const LockSchema = require('../../schemas/lockSchema');
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('lock_channel')
//         .setDescription('Dùng lần 1 để khóa kênh, dùng lần 2 để mở khóa kênh'),
//     async execute(interaction, client) {

//         try {

//             // Kiểm tra trạng thái của lệnh
//             const commandStatus = await CommandStatus.findOne({ command: '/lock_channel' });

//             // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//             if (commandStatus && commandStatus.status === 'off') {
//                 return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//             }

//             // Kiểm tra quyền Administrator
//             if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                 return await interaction.reply({
//                     content: '⚠️ Lệnh này chỉ có thể được sử dụng bởi quản trị viên (Administrator) của máy chủ!',
//                     ephemeral: true // chỉ hiển thị cho người dùng đã gọi lệnh
//                 });
//             }

//             await interaction.deferReply();

//             const lockData = await LockSchema.findOne({
//                 Guild: interaction.guild.id,
//                 Channel: interaction.channel.id
//             }) ?? await LockSchema.create({
//                 Guild: interaction.guild.id,
//                 Channel: interaction.channel.id,
//                 Permissions: interaction.channel.permissionOverwrites,
//                 Locked: false
//             });

//             if (!lockData.Locked) {
//                 const oldPermissons = [];
//                 for (const perms of interaction.channel.permissionOverwrites.cache.values()) {
//                     oldPermissons.push({
//                         id: perms.id,
//                         allow: perms.allow.bitfield,
//                         deny: perms.deny.bitfield
//                     });
//                 }

//                 await lockData.updateOne({
//                     Permissions: oldPermissons
//                 });

//                 const permissions = [];
//                 permissions.push({
//                     id: interaction.guild.id,
//                     allow: [],
//                     deny: [
//                         PermissionsBitField.Flags.SendMessages,
//                         PermissionsBitField.Flags.CreatePublicThreads,
//                         PermissionsBitField.Flags.CreatePrivateThreads,
//                         PermissionsBitField.Flags.SendMessagesInThreads,
//                         PermissionsBitField.Flags.AddReactions
//                     ]
//                 });

//                 // Xác định quyền mặc định cho kênh
//                 const defaultPerms = interaction.channel.permissionsFor(interaction.guild.id).bitfield;

//                 if (defaultPerms & PermissionsBitField.Flags.ViewChannel) {
//                     permissions[0].allow.push(PermissionsBitField.Flags.ViewChannel);
//                 } else {
//                     permissions[0].deny.push(PermissionsBitField.Flags.ViewChannel);
//                 }

//                 await interaction.channel.permissionOverwrites.set(permissions);

//                 await lockData.updateOne({
//                     Locked: true
//                 });

//                 await interaction.editReply({
//                     content: `# 🔒 Kênh này đã bị khóa, vui lòng chờ!`
//                 });

//             } else {
//                 const permissions = lockData.Permissions.map(perm => ({
//                     ...perm,
//                     allow: new BitField(perm.allow),
//                     deny: new BitField(perm.deny)
//                 }));

//                 await interaction.channel.permissionOverwrites.set(permissions);

//                 await lockData.updateOne({
//                     Locked: false
//                 });

//                 await interaction.editReply({
//                     content: `# 🔓 Kênh này đã được mở khóa, cảm ơn sự kiên nhẫn của bạn!`
//                 });
//             }
//         } catch (error) {
//             await interaction.editReply({
//                 content: `Lệnh này không có tác dụng với bài viết trong diễn đàn.`
//             });
//         }
//     }
// };