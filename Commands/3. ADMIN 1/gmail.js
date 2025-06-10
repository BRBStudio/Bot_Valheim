const { SlashCommandBuilder } = require('discord.js');
const nodemailer = require('nodemailer');
// const { checkAdministrator } = require(`../../permissionCheck`)
require('dotenv').config();
// photographer2504@gmail.com test


module.exports = {
	data: new SlashCommandBuilder()
		.setName('gmail')
		.setDescription('🔹 Gửi tin nhắn đến Gmail của người dùng')
		.addStringOption(o => o
            .setName('gmail')
			.setDescription('Địa chỉ Gmail của người nhận')
			.setRequired(true))
		.addStringOption(o => o
            .setName('text')				
            .setDescription('✉ Nội dung tin nhắn')
			.setRequired(true))
        .addStringOption(o => o
            .setName('dc')				
            .setDescription('link mời máy chủ discordcủa bạn')
			.setRequired(false))
        .addStringOption(o => o
            .setName('background')
            .setDescription('🔹 Link ảnh nền (tùy chọn)')
            .setRequired(false)),

    async execute(interaction) {
        // const hasPermission = await checkAdministrator(interaction);
        // if (!hasPermission) return;

        await interaction.deferReply({ ephemeral: true });

        const { guild } = interaction;
        const guildName = guild ? guild.name.toUpperCase() : 'Tin nhắn riêng tư';
        const member = interaction.user;
        const userId = interaction.user.id;
        const gmail = interaction.options.getString('gmail');
        const text = interaction.options.getString('text');
        const dc = interaction.options.getString('dc')
        const fb = interaction.options.getString('fb') || 'https://www.facebook.com/leenonam3'; // Link Facebook mặc định
        const phone = interaction.options.getString('phone') || '0818.25.04.88'; // Số điện thoại mặc định
        // let background = interaction.options.getString('background') || 'https://i.imgur.com/oa8CEqa.gif'; // Ảnh nền mặc định

        // Nếu ID khớp với 940104526285910046, cho phép đặt background tùy chỉnh
        let ha = 'https://i.imgur.com/oa8CEqa.gif'; // Ảnh nền mặc định

        // Kiểm tra nếu người dùng có ID đặc biệt mới được phép sử dụng background
		const bg = interaction.options.getString('background');

        if (bg) {
			if (userId === '940104526285910046') {
				const urlRegex = /^(https?:\/\/[^\s]+(\.png|\.jpg|\.jpeg|\.gif|\.webp))$/i;
				if (urlRegex.test(bg)) {
					ha = bg;
				}
			} else {
				return interaction.editReply({ content: '❌ Bạn không thể sử dụng lựa chọn "background"!' });
			}
		}
    
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ^ bắt đầu chuỗi [Tên người dùng]+@[Tên miền]+.[Phần mở rộng] $ kết thúc chuỗi
        if (!emailRegex.test(gmail)) {
            return interaction.editReply({ content: '❌ Email không hợp lệ!' });
        }

        // // Kiểm tra URL hợp lệ
        // const urlRegex = /^(https?:\/\/[^\s]+(\.png|\.jpg|\.jpeg|\.gif|\.webp))$/i;
        // if (!urlRegex.test(background)) {
        //     background = 'https://i.imgur.com/oa8CEqa.gif'; // Nếu URL không hợp lệ, dùng ảnh mặc định
        // }

        const formattedText = text.replace(/\\n/g, '\n'); // Dùng cho email dạng text

        const formattedHtml = text
            .replace(/\\n/g, '\n') // Chuyển \\n thành \n thật
            .replace(/(^|\n)\+(.+)/g, '$1<span style="color: rgb(255, 81, 0);">$2</span>') // Dòng bắt đầu bằng +
            .replace(/(^|\n)\-(.+)/g, '$1<span style="color: rgb(25, 0, 255);">$2</span>') // Dòng bắt đầu bằng -
            .replace(/\n/g, '<br>'); // Cuối cùng, thay \n bằng <br> để hiển thị đúng xuống dòng


    
        // Cấu hình Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    
        const botAvatar = interaction.client.user.displayAvatarURL({ format: 'png', size: 128 });

        // Lấy tổng số lượng thành viên từ tất cả các server bot tham gia
        const totalMembers = interaction.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

        // Tên nút sẽ thay đổi tùy theo giá trị của `dc`
        const dcButtonName = dc ? `DC của ${interaction.user.displayName}` : 'Truy cập DC của tôi';
        const dcButtonLink = dc || 'https://discord.gg/s2ec8Y2uPa'; // Nếu không có `dc`, dùng link mặc định

       const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: gmail,
                    replyTo: process.env.EMAIL_USER,
                    subject: `📬 TIN NHẮN TỪ NGƯỜI DÙNG ${member.displayName} TRONG MÁY CHỦ DISCORD ${interaction.client.user.displayName}`,
                    text: `Mã xác minh của bạn: \n\nHướng dẫn: Copy mã này và sử dụng để xác minh.\n\n---\nChill And Relax\nSupport: support@chillandrelax.com\nLinks: https://www.facebook.com/leenonam3 | https://discord.gg/s2ec8Y2uPa`,
                    html: `
                        <!-- Tin nhắn + BRB STUDIO -->
                        <div style="text-align: center; margin-bottom: 20px;">
                            <p style="margin: 0;">${formattedHtml}</p>
                            <p style="margin: 0; line-height: 1;">
                                ----------------------------<br>
                                <span style="display: inline-flex; align-items: center; justify-content: center; white-space: nowrap;">
                                    <img src="${botAvatar}" alt="Bot Avatar" width="20" height="20" style="border-radius: 50%; margin-right: 5px; margin-top: 5px;">
                                    <strong style="display: inline-block; margin-top: 8px;">BRB STUDIO</strong>
                                </span><br>----------------------------
                            </p>
                        </div>

                        <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; background-image: url('${ha}'); background-size: cover; background-position: center; padding: 50px; border-radius: 10px;">

                            <!-- Bố cục chính của email: hiển thị nội dung, thông tin bot, và các liên kết... -->
                            
                            <div style="background-color: rgba(128, 128, 128, 0.5); padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                <!-- Tiêu đề (Hiển thị ảnh đại diện và tên bot) -->
                                <div style="text-align: left; margin-bottom: 25px;">
                                    <h3 style="color: rgb(255, 255, 255); font-size: 24px; margin: 0;">
                                        <img src="${botAvatar}" alt="Bot Avatar" style="width: 50px; height: 50px; vertical-align: middle; margin-right: 10px; border-radius: 50%;">
                                        ${interaction.client.user.displayName.toUpperCase()}
                                    </h3>
                                </div>
        
                                <!-- Nội dung chính + Hiển thị tổng số thành viên dùng bot -->
                                <div style="text-align: center;">
                                    <h3 style="color: rgb(2, 255, 242); font-size: 20px; margin: 0 0 10px;">Tổng số thành viên dùng bot</h3>
                                    <div style="display: flex; justify-content: center; align-items: center; margin: 0 auto 10px; width: 100%;">
                                        <input type="text" value="${totalMembers}" readonly style="font-size: 24px; color: #333; padding: 8px; border: 1px solid #ccc; border-radius: 5px; text-align: center; width: 150px; display: block; margin: 0 auto; background-color: rgba(128, 128, 128, 0.3);" onclick="this.select();" />
                                    </div>
                                    <p style="color:rgb(255, 255, 255); font-size: 14px; margin: 0 0 25px;">
                                        Nếu bạn cần hỗ trợ quảng cáo thì hãy nhấp vào nút DC HỖ TRỢ
                                    </p>
                                </div>

                                <!-- nút cho người dùng -->
                                <div style="text-align: center; margin: 20px 0;">
                                    <a href="${dcButtonLink}" style="display: inline-block; background-color: #ff5733; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin: 5px;">${dcButtonName}</a>
                                </div>

                                <!-- nút hỗ trợ -->
                                <div style="text-align: center; margin: 20px 0;">
                                    <a href="https://discord.gg/s2ec8Y2uPa" style="display: inline-block; background-color: rgb(5, 163, 255); color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin: 5px;">DC HỖ TRỢ</a>
                                    <a href="https://www.facebook.com/leenonam3" style="display: inline-block; background-color:rgb(8, 101, 255); color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin: 5px;">FB ẢNH CƯỚI</a>
                                </div>

                                <!-- Soạn thư -->
                                <div style="text-align: center; margin-top: 10px;">
                                    <p style="color: #999; font-size: 14px; margin: 0;">
                                        <a href="mailto:brbstudio.88@gmail.com" style="color:rgb(0, 247, 255);">brbstudio.88@gmail.com</a>
                                    </p>
                                </div>

                                <!-- Biểu tượng -->
                                <div style="text-align: center; margin: 10px 0;">
                                    <a href="https://www.instagram.com" style="margin: 0 5px;">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style="width: 24px; height: 24px;" />
                                    </a>
                                    <a href="https://open.spotify.com" style="margin: 0 5px;">
                                        <img src="https://i.imgur.com/Jolbx8m.png" alt="Spotify" style="width: 24px; height: 24px;" />
                                    </a>
                                    <a href="https://www.youtube.com" style="margin: 0 5px;">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" alt="YouTube" style="width: 24px; height: 24px;" />
                                    </a>
                                    <a href="https://tiktok.com" style="margin: 0 5px;">
                                        <img src="https://cdn.pixabay.com/photo/2022/02/09/08/35/tiktok-7002882_960_720.png" alt="TikTok" style="width: 24px; height: 24px;" />
                                    </a>
                                    <a href="https://twitter.com" style="margin: 0 5px;">
                                        <img src="https://i.imgur.com/YRt2P52.png" alt="Twitter" style="width: 24px; height: 24px;" />
                                    </a>

                                </div>

                                <!-- Số điện thoại -->
                                <div style="text-align: center; margin-top: 10px;">
                                    <p style="color: #999; font-size: 18px; margin: 0;">
                                        <a href="#" style="color:rgb(255, 81, 0);">☎️: 0818.25.04.88</a>
                                    </p>
                                </div>
        
                                <!-- Chân trang -->
                                <div style="text-align: center; margin-top: 25px;">
                                    <p style="color: #999; font-size: 12px; margin: 0;">
                                        <a href="#" style="color:rgb(12, 11, 12);">Bản quyền © 2025-2030 BRB Studio, Mọi quyền được bảo lưu.</a>
                                        <a href="#" style="color:rgb(0, 48, 151);">Được hỗ trợ bởi BRB Studio</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `,
                    cc: null,
                    bcc: null
                };
    
        try {
            await transporter.sendMail(mailOptions);
            await interaction.editReply({ content: `✅ Tin nhắn đã gửi đến **${gmail}**` });
        } catch (error) {
            console.error('Lỗi khi gửi email:', error);
            await interaction.editReply({ content: '❌ Không thể gửi email. Vui lòng thử lại sau!' });
        }
    }    
};