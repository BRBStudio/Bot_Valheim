const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config');
const CreateButton = require('../../schemas/Verify_CustomSchema.js'); // verificationSchema.js
const { VerifyUsers, Captcha } = require('../../schemas/Captcha_CustomSchema');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    id: 'vermodal_ct',
    async execute(interaction) {

        // Kiểm tra trạng thái Modal
        const commandStatus = await CommandStatus.findOne({ command: 'vermodal_ct' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện Modal
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Modal này đã bị tắt, vui lòng thử lại sau.');
        }

        // Lấy giá trị từ modal
        const captchaInput = interaction.fields.getTextInputValue('captchaInput_ct');
        
        // Lấy ID máy chủ và người dùng
        const serverId = interaction.guild.id;
        const serverName = interaction.guild.name;
        const userId = interaction.user.id;
        const displayName = interaction.member.displayName;

        // Tìm bản ghi CAPTCHA cho người dùng và máy chủ hiện tại
        const captchaRecord = await Captcha.findOne({
            Guild: serverId, // ID máy chủ
            User: userId,    // ID người dùng
            completed: false,
        });

        // Kiểm tra xem có bản ghi CAPTCHA không
        if (captchaRecord) {
            // Kiểm tra mã CAPTCHA người dùng nhập vào
            if (captchaInput === captchaRecord.Key) {
                await interaction.deferReply({ ephemeral: true });

                // Kiểm tra quyền quản lý vai trò
                const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
                if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    await interaction.editReply({ content: "Tôi cần quyền 'Quản lý vai trò' để thực hiện điều này.", ephemeral: true });
                    return;
                }

                


                // Lấy thông tin vai trò từ MongoDB
                const buttonData = await CreateButton.findOne({ guildId: serverId });
                if (!buttonData || !buttonData.namerolek) {
                    return interaction.editReply({ content: "Không tìm thấy dữ liệu vai trò trong cơ sở dữ liệu.", ephemeral: true });
                }

                // Lấy vai trò từ ID đã lưu
                const role = interaction.guild.roles.cache.get(buttonData.namerolek);
                if (!role) {
                    return interaction.editReply({ content: "Vai trò được lưu không hợp lệ hoặc không tồn tại.", ephemeral: true });
                }

                // Gán vai trò cho người dùng
                const member = interaction.guild.members.cache.get(userId);
                await member.roles.add(role);

                // Lưu thông tin người dùng đã xác thực vào VerifyUsers
                const verifyRecord = new VerifyUsers({
                    Guild: serverId,
                    GuildName: serverName,
                    Key: captchaRecord.Key,
                    User: userId,
                    displayName: displayName,
                });
                await verifyRecord.save();

                // Xóa bản ghi CAPTCHA của người dùng trong model Captcha
                await Captcha.deleteOne({ Guild: serverId, User: userId });

                // Phản hồi thành công
                await interaction.editReply({ content: `🎉 Xác thực thành công! Bạn đã được cấp vai trò: **${role.name}**`, ephemeral: true });

            } else {
                
                // Người dùng nhập sai CAPTCHA
                captchaRecord.attempts += 1;

                // Nếu người dùng nhập sai quá 5 lần, tạo mã CAPTCHA mới
                if (captchaRecord.attempts >= 5) {

                    // Nếu người dùng đã thử sai quá 5 lần,
                    await Captcha.updateOne(
                        { Guild: serverId, User: userId },
                        { $set: { attempts: 0 } } // Cập nhật attempts
                    );

                    // Tạo embed thông báo mã CAPTCHA mới
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('❌ Bạn đã nhập sai quá 5 lần.')
                        .setImage('https://icall.asia/wp-content/uploads/2024/07/ma-captcha-la-gi-ReCAPTCHA.jpg');

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                } else {
                    // Thông báo số lần thử còn lại
                    await Captcha.updateOne({ Guild: serverId, User: userId }, { $set: { attempts: captchaRecord.attempts } });
                    const attemptsLeft = 5 - captchaRecord.attempts;
                    await interaction.reply({ content: `❌ Sai mã CAPTCHA. Bạn còn ${attemptsLeft} lần thử.`, ephemeral: true });
                }
            }
        } else {
            await interaction.reply({ content: 'Không tìm thấy dữ liệu CAPTCHA.', ephemeral: true });
        }
    }
};





























// const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');
// const config = require('../../config');
// const CreateButton = require('../../schemas/Verify_CustomSchema.js'); // verificationSchema.js
// const { VerifyUsers, Captcha } = require('../../schemas/Captcha_CustomSchema');
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     id: 'vermodal_ct',
//     async execute(interaction) {

//         // Kiểm tra trạng thái Modal
//         const commandStatus = await CommandStatus.findOne({ command: 'vermodal_ct' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện Modal
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Modal này đã bị tắt, vui lòng thử lại sau.');
//         }

//         // Lấy giá trị từ modal
//         const captchaInput = interaction.fields.getTextInputValue('captchaInput_ct');
        
//         // Lấy ID máy chủ và người dùng
//         const serverId = interaction.guild.id;
//         const serverName = interaction.guild.name;
//         const userId = interaction.user.id;
//         const displayName = interaction.member.displayName;

//         // Tìm bản ghi CAPTCHA cho người dùng và máy chủ hiện tại
//         const captchaRecord = await Captcha.findOne({
//             Guild: serverId, // ID máy chủ
//             User: userId,    // ID người dùng
//             completed: false,
//         });

//         if (captchaRecord) {
//             // Kiểm tra mã CAPTCHA người dùng nhập vào
//             if (captchaInput === captchaRecord.Key) {
//                 await interaction.deferReply({ ephemeral: true });

//                 // Kiểm tra quyền quản lý vai trò
//                 const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
//                 if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
//                     await interaction.editReply({ content: "Tôi cần quyền 'Quản lý vai trò' để thực hiện điều này.", ephemeral: true });
//                     return;
//                 }

//                 // Truy xuất dữ liệu vai trò từ MongoDB
//                 const buttonData = await CreateButton.findOne({});

//                 if (!buttonData) {
//                     await interaction.editReply({ content: 'Không tìm thấy thông tin vai trò trong cơ sở dữ liệu.', ephemeral: true });
//                     return;
//                 }

//                 const roleId = buttonData.namerolek; // ID vai trò đã lưu
//                 const role = interaction.guild.roles.cache.get(roleId);

//                 if (!role) {
//                     await interaction.editReply({ content: 'Không tìm thấy vai trò trong máy chủ này.', ephemeral: true });
//                     return;
//                 }

//                 // Gán vai trò cho người dùng
//                 const member = interaction.guild.members.cache.get(userId);
//                 await member.roles.add(role);

//                 // Lưu thông tin người dùng đã xác thực vào VerifyUsers
//                 const verifyRecord = new VerifyUsers({
//                     Guild: serverId,
//                     GuildName: serverName,
//                     Key: captchaRecord.Key,
//                     User: userId,
//                     displayName: displayName,
//                 });
//                 await verifyRecord.save();

//                 // Xóa bản ghi CAPTCHA của người dùng trong model Captcha
//                 await Captcha.deleteOne({ Guild: serverId, User: userId });

//                 // Phản hồi xác nhận
//                 await interaction.editReply({ content: `✅ Bạn đã giải mã thành công và được cấp vai trò **${role.name}**!`, ephemeral: true });

//             } else {
//                 // Xử lý khi nhập sai CAPTCHA
//                 captchaRecord.attempts += 1;

//                 if (captchaRecord.attempts >= 5) {
//                     await Captcha.updateOne(
//                         { Guild: serverId, User: userId },
//                         { $set: { attempts: 0 } }
//                     );

//                     const embed = new EmbedBuilder()
//                         .setColor('Red')
//                         .setDescription('❌ Bạn đã nhập sai quá 5 lần.')
//                         .setImage('https://icall.asia/wp-content/uploads/2024/07/ma-captcha-la-gi-ReCAPTCHA.jpg');

//                     await interaction.reply({ embeds: [embed], ephemeral: true });
//                 } else {
//                     const attemptsLeft = 5 - captchaRecord.attempts;
//                     await Captcha.updateOne({ Guild: serverId, User: userId }, { $set: { attempts: captchaRecord.attempts } });
//                     await interaction.reply({ content: `❌ Sai mã CAPTCHA. Bạn còn ${attemptsLeft} lần thử.`, ephemeral: true });
//                 }
//             }
//         } else {
//             await interaction.reply({ content: 'Không tìm thấy dữ liệu CAPTCHA.', ephemeral: true });
//         }
//     }
// };
