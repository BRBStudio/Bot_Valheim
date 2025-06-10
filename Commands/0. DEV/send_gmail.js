const { SlashCommandBuilder } = require('discord.js');
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send_gmail')
		.setDescription('📧 Gửi tin nhắn đến email của người dùng')
		.addStringOption(option =>
			option.setName('gmail')
				.setDescription('📩 Địa chỉ Gmail của người nhận')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('text')
				.setDescription('✉ Nội dung tin nhắn')
				.setRequired(true)),
        guildSpecific: true,
        guildId: ['1319809040032989275'],
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true }); // Phản hồi ngay lập tức
    
        // const member = interaction.user;
        const gmail = interaction.options.getString('gmail');
        const text = interaction.options.getString('text');
    
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(gmail)) {
            return interaction.editReply({ content: '❌ Email không hợp lệ!' });
        }

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

        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: gmail,
        //     subject: `Tin nhắn từ NPT bot Discord`,
        //     html: `
        //         <p>${text.replace(/\n/g, '<br>')}</p>
        //         <p style="margin: 0; line-height: 1;">
        //             ----------------------------<br>
        //             <span style="display: inline-flex; align-items: center; white-space: nowrap;">
        //                 <img src="${botAvatar}" alt="Bot Avatar" width="20" height="20" style="border-radius: 50%; margin-right: 5px; margin-top: 5px;">
        //                 <strong style="display: inline-block; margin-top: 8px;">BRB STUDIO</strong>
        //             </span><br>----------------------------
        //         </p>
        //         <hr>
        //         <p>☎️☎️☎️☎️☎️ <br><strong style="display: inline-block; margin-top: 5px;">0818.25.04.88</strong></p>
        //         <p>🔗 <a href="https://www.facebook.com/leenonam3">Facebook</a> | 🎮 <a href="https://discord.gg/s2ec8Y2uPa">Discord</a></p>
        //     `,
        //     cc: null,  // CC nếu cần, Khi đặt email vào trường CC, tất cả những người nhận sẽ thấy địa chỉ email của nhau.
        //     bcc: null // BCC nếu cần, Khi đặt email vào BCC, những người nhận sẽ không thấy địa chỉ email của nhau.
        //     // text: text + \n\n--\n📌 BRB Studio Bot
        //     // <p>☎️ <strong>0818.25.04.88</strong></p>
        // };


        // const mailOptions = {
        //             from: process.env.EMAIL_USER,
        //             to: gmail,
        //             replyTo: process.env.EMAIL_USER,
        //             subject: `Verification code from ${interaction.client.user.displayName}`,
        //             text: `Mã xác minh của bạn: \n\nHướng dẫn: Copy mã này và sử dụng để xác minh.\n\n---\nChill And Relax\nSupport: support@chillandrelax.com\nLinks: https://www.facebook.com/leenonam3 | https://discord.gg/s2ec8Y2uPa`,
        //             html: `
        //                 <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; background-image: url('https://i.imgur.com/3qjaOeG.gif'); background-size: cover; background-position: center; padding: 50px; border-radius: 10px;">
        //                     <!-- Card Container -->
        //                     <div style="background-color: rgba(128, 128, 128, 0.5); padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        //                         <!-- Header -->
        //                         <div style="text-align: left; margin-bottom: 25px;">
        //                             <h3 style="color: #333; font-size: 24px; margin: 0;">
        //                                 <img src="${botAvatar}" alt="Bot Avatar" style="width: 50px; height: 50px; vertical-align: middle; margin-right: 10px; border-radius: 50%;">
        //                                 ${interaction.client.user.displayName.toUpperCase()}
        //                             </h3>
        //                         </div>
        
        //                         <!-- Main Content -->
        //                         <div style="text-align: center;">
        //                             <h3 style="color: #333; font-size: 20px; margin: 0 0 10px;">Mã xác minh của bạn</h3>
        //                             <div style="display: flex; justify-content: center; align-items: center; margin: 0 auto 10px; width: 100%;">
        //                                 <input type="text" value="" readonly style="font-size: 24px; color: #333; padding: 8px; border: 1px solid #ccc; border-radius: 5px; text-align: center; width: 150px; display: block; margin: 0 auto; background-color: rgba(128, 128, 128, 0.3);" onclick="this.select();" />
        //                             </div>
        //                             <p style="color: #333; font-size: 14px; margin: 0 0 25px;">
        //                                 Vui lòng copy mã này để sử dụng cho việc xác minh.
        //                             </p>
        //                         </div>
        
        //                         <!-- Footer -->
        //                         <div style="text-align: center; margin-top: 25px;">
        //                             <p style="color: #999; font-size: 12px; margin: 0;">
        //                                 <a href="#" style="color:rgb(12, 11, 12);">Copyright © 2024-2025 Machiko.</a><a href="#" style="color:rgb(0, 48, 151);">Powered by Mực Team</a>
        //                             </p>
        //                         </div>
        //                     </div>
        //                 </div>
        //             `,
        //             cc: null,
        //             bcc: null
        //         };


        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: gmail,
        //     subject: `Tin nhắn từ NPT bot Discord`,
        //     html: `
        //         <div style="background-image: url('https://i.imgur.com/3qjaOeG.gif'); background-size: cover; padding: 20px;">
        //             <table style="width: 100%; background-color: rgba(255,255,255,0.9); border-radius: 10px; padding: 20px;">
        //                 <tr>
        //                     <td align="center">
        //                         <img src="${botAvatar}" alt="Bot Avatar" width="50" height="50" style="border-radius: 50%;">
        //                         <h2 style="color: #4a2c7d;">BRB STUDIO</h2>
        //                     </td>
        //                 </tr>
        //                 <tr>
        //                     <td>
        //                         <p>${text.replace(/\n/g, '<br>')}</p>
        //                     </td>
        //                 </tr>
        //                 <tr>
        //                     <td align="center">
        //                         <a href="https://discord.gg/s2ec8Y2uPa" style="background-color: #6b3fa0; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Tham gia Discord</a>
        //                     </td>
        //                 </tr>
        //             </table>
        //         </div>
        //     `
        // };

        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: gmail,
        //     subject: `Dominic`,
        //     text: `${text}\n\n---\nChill And Relax\nSupport: support@chillandrelax.com\nLinks: https://www.facebook.com/leenonam3 | https://discord.gg/s2ec8Y2uPa`,
        //     html: `
        //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-image: url('https://i.imgur.com/3qjaOeG.gif'); background-size: cover; background-position: center; padding: 20px; border-radius: 10px;">
        //             <!-- Card Container -->
        //             <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        //                 <!-- Header -->
        //                 <div style="text-align: left; margin-bottom: 20px;">
        //                     <h2 style="color: #4a2c7d; font-size: 24px; margin: 0;">Chill And Relax</h2>
        //                 </div>
        
        //                 <!-- Main Content -->
        //                 <div style="text-align: center;">
        //                     <h3 style="color: #333; font-size: 20px; margin: 0 0 10px;">Mở khóa một thế giới khả năng bằng mã QR</h3>
        //                     <p style="color: #666; font-size: 16px; margin: 0 0 20px;">
        //                         ${text.replace(/\n/g, '<br>')}
        //                     </p>
        
        //                     <!-- Buttons -->
        //                     <div style="margin: 20px 0;">
        //                         <a href="https://discord.gg/s2ec8Y2uPa" style="display: inline-block; background-color: #6b3fa0; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin: 5px;">Tạo mã QR</a>
        //                         <a href="https://www.facebook.com/leenonam3" style="display: inline-block; background-color: #8b6fc0; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin: 5px;">Đăng nhập</a>
        //                     </div>
        
        //                     <!-- Illustration Placeholder -->
        //                     <div style="margin: 20px 0;">
        //                         <img src="https://via.placeholder.com/300x150?text=Illustration" alt="Illustration" style="max-width: 100%; height: auto;" />
        //                     </div>
        //                 </div>
        
        //                 <!-- Footer -->
        //                 <div style="text-align: center; margin-top: 20px;">
        //                     <p style="color: #666; font-size: 14px; margin: 0 0 10px;">
        //                         Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ chúng tôi tại 
        //                         <a href="mailto:support@chillandrelax.com" style="color: #6b3fa0;">support@chillandrelax.com</a>
        //                     </p>
        //                     <div style="margin: 10px 0;">
        //                         <a href="https://www.instagram.com" style="margin: 0 5px;">
        //                             <img src="https://cdn.discordapp.com/emojis/1255001591308877876.webp?size=96" alt="Instagram" style="width: 24px; height: 24px;" />
        //                         </a>
        //                         <a href="https://www.facebook.com/leenonam3" style="margin: 0 5px;">
        //                             <img src="https://cdn.discordapp.com/emojis/1255001591308877876.webp?size=96" alt="Facebook" style="width: 24px; height: 24px;" />
        //                         </a>
        //                         <a href="https://www.youtube.com" style="margin: 0 5px;">
        //                             <img src="https://cdn.discordapp.com/emojis/1255001591308877876.webp?size=96" alt="YouTube" style="width: 24px; height: 24px;" />
        //                         </a>
        //                     </div>
        //                     <p style="color: #999; font-size: 12px; margin: 0;">
        //                         Bạn đã nhận được email này vì bạn đã đăng ký tại Chill And Relax.<br>
        //                         Hủy đăng ký <a href="#" style="color: #6b3fa0;">tại đây</a>
        //                     </p>
        //                 </div>
        //             </div>
        //         </div>
        //     `,
        //     cc: null,
        //     bcc: null
        // };

        // hình đẹp https://i.imgur.com/3qjaOeG.gif
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: gmail,
            subject: `Dominic`,
            text: `${text}\n\n---\nBRB Studio-\nSupport: brbstudio.88@gmail.com\nLinks: https://www.facebook.com/leenonam3 | https://discord.gg/s2ec8Y2uPa`,
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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-image: url('https://i.imgur.com/3qjaOeG.gif'); background-size: cover; background-position: center; padding: 20px; border-radius: 10px;">
                    <!-- Card Container -->
                    <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <div style="text-align: left; margin-bottom: 20px;">
                            <h2 style="color: #4a2c7d; font-size: 24px; margin: 0;">BRB Studio</h2>
                        </div>

                        <!-- Main Content -->
                        <div style="text-align: center;">
                            <h3 style="color: #333; font-size: 20px; margin: 0 0 10px;">Một thế giới tràn đầy niềm vui đang chờ bạn</h3>
                            <p style="color: #666; font-size: 16px; margin: 0 0 20px;">
                                ${text.replace(/\n/g, '<br>')}
                            </p>

                            <!-- Buttons -->
                            <div style="margin: 20px 0;">
                                <a href="https://discord.gg/s2ec8Y2uPa" style="display: inline-block; background-color: #6b3fa0; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin: 5px;">Đăng nhập DC</a>
                                <a href="https://www.facebook.com/leenonam3" style="display: inline-block; background-color: #8b6fc0; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin: 5px;">Đăng nhập FB</a>
                            </div>

                            <!-- Illustration Placeholder -->
                            <div style="margin: 20px 0;">
                                <img src="https://via.placeholder.com/300x150?text=Illustration" alt="Illustration" style="max-width: 100%; height: auto;" />
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="text-align: center; margin-top: 20px;">
                            <p style="color: #666; font-size: 14px; margin: 0 0 10px;">
                                Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ chúng tôi tại <a href="mailto:brbstudio.88@gmail.com" style="color: #6b3fa0;">brbstudio.88@gmail.com</a>
                            </p>
                            <div style="margin: 10px 0;">
                                <a href="https://www.instagram.com" style="margin: 0 5px;"><img src="https://cdn.discordapp.com/emojis/1255001591308877876.webp?size=96" alt="Instagram" style="width: 24px; height: 24px;" /></a>
                                <a href="https://www.facebook.com/leenonam3" style="margin: 0 5px;"><img src="https://cdn.discordapp.com/emojis/1255001591308877876.webp?size=96" alt="Facebook" style="width: 24px; height: 24px;" /></a>
                                <a href="https://www.youtube.com" style="margin: 0 5px;"><img src="https://cdn.discordapp.com/emojis/1255001591308877876.webp?size=96" alt="YouTube" style="width: 24px; height: 24px;" /></a>
                            </div>
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                Bạn đã nhận được email này vì bạn đã đăng ký tại BRB Studio.<br>
                                Hủy đăng ký <a href="#" style="color: #6b3fa0;">tại đây</a>
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
