const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require(`discord.js`)
const CreateButton = require('../../schemas/Verify_CustomSchema.js'); // verificationSchema.js
const { VerifyUsers, Captcha } = require('../../schemas/Captcha_CustomSchema');
const config = require(`../../config`)
const { createCanvas, loadImage } = require('canvas');

// Tạo mã CAPTCHA ngẫu nhiên
const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 10; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

// Tạo hình ảnh CAPTCHA từ URL thay vì vẽ chữ nhật vàng
const createCaptchaImage = async (captchaText) => {
    const outerCanvas = createCanvas(600, 150); // Kích thước hình ảnh CAPTCHA
    const outerContext = outerCanvas.getContext('2d');
    const innerCanvas = createCanvas(560, 110); // Kích thước của hình ảnh CAPTCHA nhỏ bên trong
    const innerContext = innerCanvas.getContext('2d');

    // Tải hình ảnh từ URL
    const backgroundImage = await loadImage('https://i.imgur.com/ggN7WUM.jpeg');
    
    // // Vẽ hình ảnh vào canvas
    // outerContext.drawImage(backgroundImage, 0, 0, outerCanvas.width, outerCanvas.height);

    innerContext.globalAlpha = 1;

    // Tạo đường viền với các góc bo tròn cho hình chữ nhật lớn
const borderRadius = 20; // Độ bo tròn của các góc
outerContext.lineWidth = 5; // Độ dày của đường viền
outerContext.strokeStyle = 'cyan'; // Màu đường viền

outerContext.beginPath();
outerContext.lineWidth = 8;
outerContext.strokeStyle = this.border;
outerContext.moveTo(55, 15);
outerContext.lineTo(outerCanvas.width - 55, 15);
outerContext.quadraticCurveTo(outerCanvas.width - 20, 20, outerCanvas.width - 15, 55);
outerContext.lineTo(outerCanvas.width - 15, outerCanvas.height - 55);
outerContext.quadraticCurveTo(outerCanvas.width - 20, outerCanvas.height - 20, outerCanvas.width - 55, outerCanvas.height - 15);
outerContext.lineTo(55, outerCanvas.height - 15);
outerContext.quadraticCurveTo(20, outerCanvas.height - 20, 15, outerCanvas.height - 55);
outerContext.lineTo(15, 55);
outerContext.quadraticCurveTo(20, 20, 55, 15);
outerContext.lineTo(56, 15);
outerContext.stroke();
outerContext.closePath();


    // Tạo hình chữ nhật nhỏ bên trong với bán kính bo tròn
    const innerRadius = 40;
    innerContext.beginPath();
    innerContext.moveTo(innerRadius, 0);
    innerContext.lineTo(innerCanvas.width - innerRadius, 0);
    innerContext.quadraticCurveTo(innerCanvas.width, 0, innerCanvas.width, innerRadius);
    innerContext.lineTo(innerCanvas.width, innerCanvas.height - innerRadius);
    innerContext.quadraticCurveTo(innerCanvas.width, innerCanvas.height, innerCanvas.width - innerRadius, innerCanvas.height);
    innerContext.lineTo(innerRadius, innerCanvas.height);
    innerContext.quadraticCurveTo(0, innerCanvas.height, 0, innerCanvas.height - innerRadius);
    innerContext.lineTo(0, innerRadius);
    innerContext.quadraticCurveTo(0, 0, innerRadius, 0);
    innerContext.closePath();
    innerContext.clip(); // Cắt theo đường bo tròn

    // Đặt màu nền cho hình CAPTCHA
    // innerContext.fillStyle = 'Cyan'; // mầu nền captcha
    innerContext.fillRect(0, 0, innerCanvas.width, innerCanvas.height);

    // Thêm nhiễu với các đường ngang ngẫu nhiên
    for (let i = 0; i < 30; i++) {
        innerContext.strokeStyle = 'Black';
        innerContext.lineWidth = Math.random() * 1;
        innerContext.beginPath();
        innerContext.moveTo(0, Math.random() * innerCanvas.height);
        innerContext.lineTo(innerCanvas.width, Math.random() * innerCanvas.height);
        innerContext.stroke();
    }

    // Thêm nhiễu với các chấm ngẫu nhiên
    for (let i = 0; i < 100; i++) {
        innerContext.fillStyle = 'Yellow';
        innerContext.beginPath();
        innerContext.arc(Math.random() * innerCanvas.width, Math.random() * innerCanvas.height, Math.random() * 2, 0, Math.PI * 2);
        innerContext.fill();
    }

    // Đặt font chữ và vẽ từng ký tự với độ nghiêng và khoảng cách ngẫu nhiên
    innerContext.font = '50px fantasy';
    innerContext.fillStyle = 'Red';
    innerContext.textBaseline = 'middle';

    let x = 60;
    for (let i = 0; i < captchaText.length; i++) {
        const char = captchaText.charAt(i);
        const angle = (Math.random() - 0.5) * 2.0;
        const offsetY = (Math.random() - 0.5) * 50;

        innerContext.save();
        innerContext.translate(x, innerCanvas.height / 2);
        innerContext.rotate(angle);
        innerContext.fillText(char, 0, offsetY);
        innerContext.restore();

        x += 35 + Math.random() * 10;
    }

    // Vẽ hình CAPTCHA nhỏ vào bên trong hình chữ nhật lớn, căn giữa
    outerContext.drawImage(innerCanvas, 20, 20); // Căn giữa hình chữ nhật nhỏ bên trong hình lớn

    // Trả về hình ảnh hoàn chỉnh dưới dạng buffer
    return outerCanvas.toBuffer('image/png'); // Đảm bảo trả về một buffer hợp lệ
};

module.exports = {
    id: 'verify-custom',
    description: 'Nút này cấp vai trò tùy chỉnh cho người dùng khi họ nhấn vào nút xác thực, chưa có captcha.',
    async execute(interaction, client) {

        // await interaction.deferReply({ ephemeral: true });

        try {
            // Lấy thông tin từ CSDL
            const buttonInfo = await CreateButton.findOne({ buttonLabel: interaction.component.label });

            if (!buttonInfo) {
                
                // Xóa dữ liệu của người dùng trong VerifyUsers nếu nút không còn tồn tại
                await VerifyUsers.deleteMany({ Guild: interaction.guild.id });

                await interaction.deferReply({ ephemeral: true }); //
                await interaction.deleteReply();
                await interaction.channel.send({
                    content: 'Nút đã bị xóa, bạn không thể làm gì khác, hãy liên hệ với chủ sở hữu máy chủ nếu bạn cần nút này',
                });

                // nếu nút đã bị xóa dữ liệu thì ngăn người dùng tương tác bằng cách xóa tin nhắn chứa nút
                await interaction.message.delete();
                return;
            }

            // Kiểm tra xem vai trò đã tồn tại trong server hay chưa
            let guildRole = interaction.guild.roles.cache.get(buttonInfo.namerolek);

            if (!guildRole) {
                console.error('Vai trò không tồn tại trong máy chủ.');
                return await interaction.reply({
                    content: 'Vai trò không tồn tại trong máy chủ.',
                    ephemeral: true
                });
            }

            const serverId = interaction.guild.id;
            const serverName = interaction.guild.name;
            const userId = interaction.user.id;
            const displayName = interaction.member.displayName;

            const member = interaction.guild.members.cache.get(userId);
            const roleToCheck = interaction.guild.roles.cache.get(buttonInfo.namerolek);
            const hasRole = roleToCheck && member.roles.cache.has(roleToCheck.id);
            // const hasRole = member.roles.cache.some(role => role.name === 'Thành Viên');

            if (hasRole) {
                await interaction.deferReply({ ephemeral: true }); //
                await interaction.editReply({
                    content: `Bạn đã có vai trò **${roleToCheck.name}** rồi.`,
                    ephemeral: true
                });
                return;
            }

            const userVerified = await VerifyUsers.findOne({ Guild: serverId, User: userId });
            // if (userVerified) {
            //     await interaction.deferReply({ ephemeral: true }); //
            //     await interaction.editReply({ content: `Bạn đã hoàn thành xác thực, không cần làm lại.\nNếu bạn nhận được tin nhắn này mà không được cấp vai trò thì hãy liên hệ chủ sở hữu để được gỡ bỏ dữ liệu để captcha lại. `, ephemeral: true });
            //     return;
            // }

            if (userVerified) {
                const member = interaction.guild.members.cache.get(userId);
                const roleFromDB = interaction.guild.roles.cache.get(buttonInfo.namerolek);

                const hasRoleNow = roleFromDB && member.roles.cache.has(roleFromDB.id);

                if (hasRoleNow) {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({
                        content: `Bạn đã có vai trò **${roleFromDB.name}** rồii.`,
                        ephemeral: true
                    });
                    return;
                } else {
                    // Người dùng đã xác thực trước đây nhưng không còn vai trò => gán lại
                    try {
                        await member.roles.add(roleFromDB);
                        await interaction.deferReply({ ephemeral: true });
                        await interaction.editReply({
                            content: `Chào mừng bạn quay lại! Vai trò **${roleFromDB.name}** đã được cấp lại cho bạn.`,
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error('Không thể cấp lại vai trò:', error);
                        await interaction.deferReply({ ephemeral: true });
                        await interaction.editReply({
                            content: 'Đã xảy ra lỗi khi cấp lại vai trò. Vui lòng liên hệ quản trị viên.',
                            ephemeral: true
                        });
                    }
                    return;
                }
            }

            let captchaRecord = await Captcha.findOne({ Guild: serverId, User: userId, completed: false });

            if (!captchaRecord) {
                await interaction.deferReply({ ephemeral: true }); //
                const captcha = generateCaptcha();
                const captchaImage = await createCaptchaImage(captcha); // Lưu ý thêm `await` vì `createCaptchaImage` là async

                captchaRecord = new Captcha({
                    Guild: serverId,
                    GuildName: serverName,
                    Key: captcha,
                    User: userId,
                    displayName: displayName,
                    Verified: [],
                    completed: false,
                    attempts: 0,
                });
                await captchaRecord.save();

                const opencodeButton = new ButtonBuilder()
                    .setCustomId('captcha_ct')
                    .setLabel('Nhập mã captcha')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(opencodeButton);

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Mã CAPTCHA')
                    .setDescription('Đây là mã CAPTCHA của bạn:')
                    .setImage('attachment://captcha.png');

                await interaction.editReply({
                    embeds: [embed],
                    files: [{ attachment: captchaImage, name: 'captcha.png' }],
                    components: [row]
                });
            } else {
                await interaction.deferReply({ ephemeral: true }); //
                const captchaImage = await createCaptchaImage(captchaRecord.Key);

                const opencodeButton = new ButtonBuilder()
                    .setCustomId('captcha_ct')
                    .setLabel('Nhập mã captcha')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(opencodeButton);

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Mã CAPTCHA')
                    .setDescription('Bạn đã có mã CAPTCHA trong dữ liệu, hãy hoàn thành nó:')
                    .setImage('attachment://captcha.png');

                await interaction.editReply({
                    embeds: [embed],
                    files: [{ attachment: captchaImage, name: 'captcha.png' }],
                    components: [row]
                });
            }
            
        } catch (error) {
            await interaction.deferReply({ ephemeral: true }); //
            console.error('Đã xảy ra lỗi trong quá trình xử lý CAPTCHA:', error);
            await interaction.editReply({
                content: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
                ephemeral: true
            });
        }
    },
};













// const { EmbedBuilder } = require(`discord.js`)
// const CreateButton = require('../../schemas/Verify_CustomSchema.js'); // verificationSchema.js
// const { VerifyUsers, Captcha } = require('../../schemas/Captcha_CustomSchema');
// const config = require(`../../config`)
// // const canvafy = require("canvafy");

// module.exports = {
//     id: 'verify-custom',
//     description: 'Nút này cấp vai trò tùy chỉnh cho người dùng khi họ nhấn vào nút xác thực, chưa có captcha.',
//     async execute(interaction, client) {
//         try {
//             // Lấy thông tin từ CSDL
//             const buttonInfo = await CreateButton.findOne({ buttonLabel: interaction.component.label });

//             if (!buttonInfo) {
//                 await interaction.deferReply();
//                 await interaction.deleteReply();
//                 await interaction.channel.send({
//                     content: 'Nút đã bị xóa, bạn không thể làm gì khác, hãy liên hệ với chủ sở hữu máy chủ nếu bạn cần nút này',
//                 });

//                 // nếu nút đã bị xóa dữ liệu thì ngăn người dùng tương tác bằng cách xóa tin nhắn chứa nút
//                 await interaction.message.delete();
//                 return;
//             }

//             // Kiểm tra xem vai trò đã tồn tại trong server hay chưa
//             let guildRole = interaction.guild.roles.cache.get(buttonInfo.namerolek);

//             if (!guildRole) {
//                 console.error('Vai trò không tồn tại trong server.');
//                 return await interaction.reply({
//                     content: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
//                     ephemeral: true
//                 });
//             }

//             // // Tạo captcha
//             // const captcha = await new canvafy.Captcha()
//             //     .setBackground("image", "https://i.imgur.com/3wCB9iW.jpeg")
//             //     .setCaptchaKey(canvafy.Util.captchaKey(15)) // Độ dài mã captcha là 6 ký tự
//             //     .setBorder("#f0f0f0")
//             //     .setOverlayOpacity(0.7)
//             //     .build();

//             // Cấp vai trò cho thành viên tương tác
//             await interaction.member.roles.add(guildRole);

//             // Phản hồi với thông báo
//             await interaction.reply({
//                 // files: [{
//                 //     attachment: captcha,
//                 //     name: `captcha-${interaction.user.id}.png`
//                 // }],
//                 content: `Đã kích hoạt vai trò ${guildRole.name} cho tài khoản của bạn.`,
//                 ephemeral: true
//             });
//         } catch (error) {
//             // console.log(`lỗi tương atcs:`, error)
//             await interaction.reply({
//                 content: `Bot thiếu quyền ***QUẢN LÝ VAI TRÒ*** hoặc vai trò mà bạn muốn gắn cho người dùng cao hơn vai trò của bot`,
//                 ephemeral: true
//             });
//         }
//     },
// };
