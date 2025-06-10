const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config');
const { VerifyUsers, Captcha } = require('../../schemas/defaultCaptchaSchema');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    id: 'vermodal',
    async execute(interaction) {

        // Kiểm tra trạng thái Modal
        const commandStatus = await CommandStatus.findOne({ command: 'vermodal' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện Modal
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Modal này đã bị tắt, vui lòng thử lại sau.');
        }

        // Lấy giá trị từ modal
        const captchaInput = interaction.fields.getTextInputValue('captchaInput');
        
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

                // Tìm hoặc tạo vai trò "Thành Viên"
                let role = interaction.guild.roles.cache.find(r => r.name === 'Thành Viên');
                if (!role) {
                    role = await interaction.guild.roles.create({
                        name: 'Thành Viên',
                        color: 'Blue',
                        hoist: true,
                        permissions: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.SendMessages
                        ],
                    });
                } else {
                    await role.edit({
                        permissions: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.SendMessages
                        ]
                    });
                }

                // Kiểm tra nếu người dùng đã có vai trò "Thành Viên"
                if (interaction.member.roles.cache.some(r => r.name === 'Thành Viên')) {
                    if (interaction.isRepliable()) {
                        await interaction.editReply({
                            content: `Bạn đã có vai trò Thành Viên.`,
                            ephemeral: true,
                        });
                    }
                    return;
                }

                // Cài đặt vai trò cho người dùng
                await interaction.member.roles.add(role);
                const roleTag = role.toString();
                await interaction.editReply({
                    content: `Đã kích hoạt ***${roleTag}*** cho tài khoản bạn.`,
                    ephemeral: true,
                });

                // // Cập nhật trạng thái CAPTCHA thành hoàn thành
                // await Captcha.updateOne(
                //     { Guild: serverId, User: userId },
                //     { $set: { completed: true } }
                // );

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

