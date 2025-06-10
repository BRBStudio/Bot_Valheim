const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { VerifyUsers, Captcha } = require('../../schemas/defaultCaptchaSchema');
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

// outerContext.beginPath();
// outerContext.moveTo(borderRadius, 0); // Bắt đầu từ góc trên bên trái
// outerContext.lineTo(outerCanvas.width - borderRadius, 0); // Đường trên cùng
// outerContext.quadraticCurveTo(outerCanvas.width, 0, outerCanvas.width, borderRadius); // Góc trên phải
// outerContext.lineTo(outerCanvas.width, outerCanvas.height - borderRadius); // Đường bên phải
// outerContext.quadraticCurveTo(outerCanvas.width, outerCanvas.height, outerCanvas.width - borderRadius, outerCanvas.height); // Góc dưới phải
// outerContext.lineTo(borderRadius, outerCanvas.height); // Đường dưới cùng
// outerContext.quadraticCurveTo(0, outerCanvas.height, 0, outerCanvas.height - borderRadius); // Góc dưới trái
// outerContext.lineTo(0, borderRadius); // Đường bên trái
// outerContext.quadraticCurveTo(0, 0, borderRadius, 0); // Góc trên trái
// outerContext.closePath();
// outerContext.stroke(); // Vẽ đường viền

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
    id: 'verify-default',
    description: 'Nút để xác thực người dùng bằng mã CAPTCHA, và sẽ cấp vai trò mặc định `Thành Viên` cho người dùng',
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const serverId = interaction.guild.id;
            const serverName = interaction.guild.name;
            const userId = interaction.user.id;
            const displayName = interaction.member.displayName;

            const member = interaction.guild.members.cache.get(userId);
            const hasRole = member.roles.cache.some(role => role.name === 'Thành Viên');

            if (hasRole) {
                await interaction.editReply({
                    content: `Bạn đã có vai trò **Thành Viên** rồi.`,
                    ephemeral: true
                });
                return;
            }

            const userVerified = await VerifyUsers.findOne({ Guild: serverId, User: userId });
            // if (userVerified) {
            //     await interaction.editReply({ content: `Bạn đã hoàn thành xác thực, không cần làm lại.\nNếu bạn nhận được tin nhắn này mà không được cấp vai trò thì hãy liên hệ chủ sở hữu để được gỡ bỏ dữ liệu để captcha lại. `, ephemeral: true });
            //     return;
            // }

            if (userVerified) {
                if (!hasRole) {
                    const role = interaction.guild.roles.cache.find(r => r.name === 'Thành Viên');
                    if (role) {
                        await member.roles.add(role, 'Khôi phục vai trò Thành Viên cho người đã xác thực');
                        await interaction.editReply({
                            content: `Chào mừng bạn quay lại! Vai trò **Thành Viên** đã được cấp lại cho bạn.`,
                            ephemeral: true
                        });
                    } else {
                        await interaction.editReply({
                            content: `Không tìm thấy vai trò **Thành Viên** trong máy chủ. Vui lòng liên hệ quản trị viên.`,
                            ephemeral: true
                        });
                    }
                } else {
                    await interaction.editReply({
                        content: `Bạn đã có vai trò **Thành Viên** rồi.`,
                        ephemeral: true
                    });
                }
                return;
            }


            let captchaRecord = await Captcha.findOne({ Guild: serverId, User: userId, completed: false });

            if (!captchaRecord) {
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
                    .setCustomId('opencode')
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
                const captchaImage = await createCaptchaImage(captchaRecord.Key);

                const opencodeButton = new ButtonBuilder()
                    .setCustomId('opencode')
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
            console.error('Đã xảy ra lỗi trong quá trình xử lý CAPTCHA:', error);
            await interaction.editReply({
                content: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
                ephemeral: true
            });
        }
    }
};
