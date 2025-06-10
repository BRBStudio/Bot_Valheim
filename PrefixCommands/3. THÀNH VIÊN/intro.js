const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require(`discord.js`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    name: 'intro',
    description: '🔸 Hiển thị các tính năng và hướng dẫn sử dụng bot tối ưu nhất!',
    hd: '🔸 ?intro',
    aliases: ['gt', 'tv4', 'it'],

/* 
có thể dùng để  để gọi nút list_game
`- **Thống kê hàng đầu của máy chủ**: Xem danh sách thành viên hoạt động nổi bật theo các tiêu chí như **chat nhiều nhất, thời gian voice nhiều nhất**.\n` +
*/
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?intro' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const message =

            `<a:lua2:1322591029932851261> Trước khi bắt đầu bạn cần chấp nhận điều khoản dịch vụ của chúng tôi để có thể sử dụng lệnh.\n` +

            `Nếu bạn quên hoặc lỡ bỏ qua thì có thể nói chủ sở hữu máy chủ gọi lại bằng lệnh \`\`\`/proviso_bot\`\`\`\n\n` +

            `<a:lua2:1322591029932851261> **ĐỂ BOT HOẠT ĐỘNG TỐT NHẤT (TRÁNH BOT HOẠT ĐỘNG KHÔNG NHƯ MONG MUỐN HOẶC BỊ LỖI), VUI LÒNG LÀM THEO CÁC BƯỚC SAU:**
                1. Mở Discord và vào máy chủ mà bot đã được mời.\n
                2. Truy cập vào phần "Server Settings" (Cài đặt máy chủ).\n
                3. Chọn "Roles" (Vai trò).\n
                4. Tìm và chọn vai trò của bot.\n
                5. Cấp tất cả các quyền cho bot.\n
                6. Kéo vai trò của bot lên trên cùng trong danh sách các vai trò.\n\n` +

            `<a:lua2:1322591029932851261> **1 SỐ TÍNH NĂNG ĐẶC BIỆT CỦA TÔI:**\n ` +

            `- **Hỗ trợ đa dạng lệnh**: Bot cung cấp nhiều lệnh tùy chỉnh để tối ưu hóa trải nghiệm.\n` +

            `- **Tạo phòng và mời người chơi**: Dễ dàng tạo phòng chơi và mời bạn bè tham gia thông qua các lệnh nhanh chóng.\n` +

            `- **Ticket**: Sử dụng hệ thống ticket để hỗ trợ thành viên nhanh chóng và chuyên nghiệp. có thể tự chỉ định vai trò người ht cũng như kênh mà bạn mong muốn\n` +

            `- **Giveaway**: Tổ chức và quản lý các sự kiện giveaway với tính năng chọn ngẫu nhiên người thắng.\n` +

            `- **Thanh lọc thành viên**: Thành viên không hoạt động hoặc không tuân thủ quy định bởi lệnh\n` +

            `- **Thay đổi tên máy chủ, tên kênh**: Bot sẽ thông báo để mọi người sẽ luôn có được thông tin mới nhất từ máy chủ.\n` +

            `- **Hệ thống đếm số lượng thành viên**: Cập nhật số lượng thành viên, bot, người dùng bị ban và số người tăng cường (boosts) mỗi phút để có cái nhìn tổng quát về máy chủ.\n` +

            `- **Hệ thống kinh tế tự chủ**: Tham gia vào nền kinh tế ảo của máy chủ với các hoạt động giao dịch và kiếm điểm thông qua trò chơi và nhiều hoạt động khác.\n` +

            `<a:muiten1:1321530226983043072>\`\`\`yml\n❄️ ĐẶC BIỆT: hệ thống kinh tế này cho phép **mỗi máy chủ tự quy định** về cách sử dụng số điểm kiếm được:\n\n` +

            `- Các mục đích sử dụng số điểm này hoàn toàn **tùy thuộc vào chính sách của từng máy chủ** (Chúng tôi sẽ không chịu trách nhiệm cho điều này).\n`+     

            `- Chúng tôi chỉ cung cấp nền tảng để kiếm điểm và hỗ trợ giao dịch, **việc sử dụng và quy định chi tiết do mỗi máy chủ tự quản lý**\n\n` +

            `⚙️ Hệ thống này vẫn đang trong quá trình hoàn thiện, sẽ có thông báo tới máy chủ nếu có thay đổi lớn.\n\`\`\`\n` +

            `- **Hệ thống cấp độ**: Cho phép người dùng đạt đủ level để truy cập vào các kênh cho thành viên có cấp độ cao. Mỗi máy chủ có thể ` +
            `thiết lập cấp độ và quyền truy cập kênh của riêng mình thông qua lệnh để phù hợp với nhu cầu của máy chủ\n` +
            
            `- **Hệ thống cảm ơn:** Hệ thống cho phép các thành viên cảm ơn nhau để tăng điểm và thăng cấp. Quy định về việc sử dụng điểm cảm ơn và vai trò thăng cấp sẽ được quản lý riêng tại mỗi máy chủ (Mỗi máy chủ có thể tùy chỉnh chính sách)\n` +

            `- **Hệ thống chào mừng**: Có lời chào mừng mặc định và lời chào mừng tùy chỉnh khi có người dùng tham gia máy chủ, bạn có thể chọn 1 trong 2 thông qua lệnh.\n` +

            `- **Thiết lập máy chủ**: Bạn mới dùng discord? bạn không biết hoặc ngại thiết lập kênh cũng như vai trò...không sao, bot sẽ làm điều đó thay bạn\n` +

            `- **Thông báo tên khi người dùng vào/ra kênh voice**: Bot sẽ tự động thông báo và đọc tên khi thành viên tham gia hoặc rời khỏi kênh voice.\n` +

            `- **Thống kê hàng đầu của máy chủ**: Xem danh sách thành viên hoạt động nổi bật theo các tiêu chí như **chat nhiều nhất, thời gian voice nhiều nhất**.\n` +

            `- **Game mini**: Giải trí với các mini game tích hợp, thử vận may và giao lưu cùng các thành viên khác và 1 số game không có bot nào có\n` +

            `- **Thông báo thành viên rời khỏi máy chủ**: Dùng lệnh **/leave_guild** để tự động thông báo khi thành viên rời máy chủ.\n` +

            `<a:ket_2025:1322596328773128253> **TỔNG KẾT**:\n` +
            `- Bot khoảng 200 lệnh, đa dạng để bạn sử dụng, tôi không kể hết ra đây được, hãy tự trải nghiệm thêm nhé.\n\n` +

            `>>> <a:warning:1322596681329410162> ***LƯU Ý:***\n` +
            `**Nếu có bất kỳ câu hỏi nào, vui lòng dùng lệnh /mailbox gửi thông tin về cho chúng tôi hoặc liên hệ với ` +
            `DEV** [@Valheim Survival](https://discord.com/users/940104526285910046)!`;

        const e = new EmbedBuilder()
            .setTitle(`KHÁM PHÁ TÍNH NĂNG CỦA TÔI`)
            .setDescription(message)
            .addFields(
                    {
                        name: `\u200b`,
                        value: `<a:VpQX0uNFuk:1249329135118057544> **CÁC BOT KHÁC CỦA CHÚNG TÔI. NHẤP VÀO ĐỂ MỜI <a:VpQX0uNFuk:1249329135118057544>**`,
                    },
                    {
                        name: `\u200b`,
                        value: `❱ [Bot Youtube](https://discord.com/oauth2/authorize?client_id=1174576448829411328&permissions=8&scope=bot)`,
                    },
                    {
                        name: `\u200b`,
                        value: `❱ [KÊNH THOẠI BRB](https://discord.com/oauth2/authorize?client_id=1254906517954625678)`,
                    },
                    {
                        name: `\u200b`,
                        value: `❱ [Kể Truyện 24/7](https://discord.com/oauth2/authorize?client_id=1225688454835474483&permissions=0&integration_type=0&scope=bot)`, // https://discord.com/oauth2/authorize?client_id=1225688454835474483
                    },
                    // {
                    //     name: "**Thông tin khác có thể bạn muôn biết**",
                    //     value: `📊 **Bỏ phiếu:** [Bỏ phiếu ở đây](https://discord.com/channels/1028540923249958912/1189601806494470184)\n🔧 **Máy chủ hỗ trợ:** [Tham gia tại đây](https://discord.com/channels/1028540923249958912/1028540923761664042)`,
                    // }
                )
            .setFooter({ 
                text: 
                    `‎                                                                                                                                 © BẢN QUYỀN THUỘC VỀ\n` +
                    `‎                                                                                                                                       ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`
                })

        interaction.channel.send({ embeds: [e] }); // , components: [row]
    },
};
