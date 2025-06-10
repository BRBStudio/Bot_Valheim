const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const economySystem = require('../../schemas/economySystem');
const CommandStatus = require('../../schemas/Command_Status');

// Biến toàn cục để lưu điểm số của các người chơi
const scores = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game_iq')
        .setDescription('🔹 Trò chơi IQ!')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('Chọn chủ đề thách đấu.')
                .addChoices(
                    { name: 'Lịch Sử', value: 'LS' },
                    { name: 'Đuổi Hình Bắt Chữ', value: 'DHBC' },
                    { name: 'Địa Lý', value: 'DL' },
                    { name: 'Âm Nhạc', value: 'AN' },
                    { name: 'Tổng Hợp', value: 'TH' },
                )
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName('player')
                .setDescription('Chọn người chơi để thách đấu')
                .setRequired(true)
        ),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/game_iq' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const topic = interaction.options.getString('topic');
        const player = interaction.options.getUser('player');

        // Kiểm tra xem người chơi có phải là người đã khởi tạo lệnh không
        if (player.id === interaction.user.id) {
            return await interaction.reply({ content: 'Bạn không thể thách đấu chính mình!', ephemeral: true });
        }

        // Xác định tên chủ đề và câu hỏi dựa trên giá trị
        let topicName = '';
        let questions = [];
        
        if (topic === 'LS') {
            topicName = 'Lịch Sử';
            questions = [
                { text: 'Người phụ nữ quyền lực nhất trong lịch sử Byzantine là ai?', answer: 'Empress Theodora' },
                { text: 'Ba nước thuộc bán đảo Đông Dương thời Pháp thuộc là những nước nào?', answer: 'Việt Nam, Lào, Campuchia' },
                { text: 'Ở Cuba có một nhà lãnh đạo nổi tiếng có 49 năm cầm quyền là ai?', answer: 'Fidel Castro' },
                { text: 'Trong chiến tranh thế giới thứ hai quốc gia nào ở Châu Á là thành viên của phe Trục?', answer: 'Nhật Bản' },
                { text: 'Người sáng lập Đảng cộng sản là ai?', answer: 'Lê-nin' },
                { text: 'Thời kỳ nào trong lịch sử được gọi là thời kỳ nhiệt thành của sự “tái sinh” VH, NT, CT và KT châu Âu sau thời kỳ Trung cổ?', answer: 'Thời kỳ Phục hưng' },
                { text: 'Thời kỳ được gọi là Thời kỳ Hoàng kim của La Mã đó là thời kỳ nào?', answer: 'Augustus Caesar' },
                { text: 'Ở Trung Quốc là triều đại cuối cùng là triều đại nào?', answer: 'Triều đại nhà Thanh' },
                { text: 'Ai là tổng thống đầu tiên của Hoa Kỳ?', answer: 'Washington' },
                { text: 'Tờ báo đầu tiên trên thế giới được thành lập bởi nước nào?', answer: 'Nước Đức' },
                { text: 'Ở La Mã cổ đại có mấy ngày mỗi tuần?', answer: '8 ngày' },
                { text: 'kƯớp xác có nguồn gốc từ đâu?', answer: 'Ai Cập' },
                { text: 'Thomas Edison là một nhà đầu tư và doanh nhân người nước nào?', answer: 'Người Mỹ' },
                { text: 'Magna Carta có nghĩa là gì?', answer: 'Hiến chương vĩ đại' },
                { text: 'Vào mùa đông cung điện Potala được phục vụ cho ai cho đến năm 1959?', answer: 'Dalai Lama' },
                { text: 'Trong chiến tranh thế giới thứ hai, loại máy bay nào đã được sử dụng để ném bom thành phố Hiroshima của Nhật Bản?', answer: 'Máy bay B-29 Superfortress' },
                { text: 'Thần bảo trợ của thành Troy là ai?', answer: 'Apollo' },
                { text: 'Quốc gia nào bắt đầu với Đại dịch Covid-19?', answer: 'Trung Quốc' },
                { text: 'Tác giả của Harry Potter là ai?', answer: 'JK Rowling' },
                { text: 'Sớ dâng chém nịnh không thành từ quan?', answer: 'Chu Văn An' },
                { text: 'Sánh duyên công chúa Ngọc Hân, vua nào?', answer: 'Quang Trung' },
                { text: 'Tướng nào bẻ gậy phò vua?', answer: 'Trần Hưng Đạo' },
                { text: 'Ngày nào kỷ niệm Đống Đa?', answer: 'Mùng 5 tháng Giêng' },
                { text: 'Thi nhân nổi loạn họ Cao?', answer: 'Cao Bá Quát' },
                { text: 'Hoa Kỳ có bao nhiêu tiểu bang?', answer: '50 tiểu bang' },
                { text: 'Sa mạc bao phủ phần lớn Bắc Phi là sa mạc nào?', answer: 'Sa mạc Sahara' },
                { text: 'Lê triều sử ký soạn thành, họ Ngô?', answer: 'Ngô Thì Nhậm' },
                { text: 'Bình Chiêm, dẹp Tống, Lý trào nổi danh?', answer: 'Lý Thuờng Kiệt' },
                { text: 'Lừng danh duyên hải dinh điền là ai ?', answer: 'Nguyễn Công Trứ' },
                { text: 'Còn ai đổi mặc hoàng bào ?', answer: 'Lê Lai' },
                { text: 'Vua nào trong buổi hàn vi ở chùa ?', answer: 'Lý Công Uẩn' },
                { text: 'Bác Hồ gửi bức thư cuối cùng cho ngành giáo dục vào ngày, tháng, năm nào?', answer: '15/10/1968' },
                { text: 'Hàng năm cứ đến ngày 13 tháng 12 chúng ta lại nhớ đến thầy giáo nào?', answer: 'Phan Ngọc Hiển' },
                { text: 'Lễ kỉ niệm ngày nhà giáo Việt Nam được tổ chức lần đầu tiên ở nước ta vào năm nào?', answer: '20-11-1958' },
                { text: 'Vua nào tám tuổi lên ngôi\nDẫu còn nhỏ bé mà người thông minh\nNgai vàng hư vị nào vinh,\nVì dân trốn khỏi hoàng thành giữa đêm. - Là ai?', answer: 'Duy Tân' },
                { text: 'Đố ai đan sọt giữa đàng\nGiáo đâm thủng vế rõ ràng không hay. - Là ai?', answer: 'Phạm Ngũ Lão' },
                { text: 'Tướng nào mà thả bồ câu,\nTướng nào mà chết chẳng cầu giặc Nguyên. - Là ai?', answer: 'Trần Nguyên Hãn' },
                { text: 'Thù chồng nợ nước hỏi ai,\nĐuôi quân tham bạo, diệt loài xâm lăng\nMê Linh nổi sóng đất bằng,\nHát giang ghi dấu hơn căm đến giờ. - Là ai?', answer: 'Hai Bà Trưng' },
                { text: 'Câu " Triệu Đà đã hoãn binh, cho con trai làm rể An Dương Vương" gợi cho ta nhớ đến câu chuyện nào?', answer: 'Mị Châu- Trọng thủy' },
                { text: 'Khởi nghĩa của Hai Bà Trưng diễn ra vào năm nào?', answer: 'Năm 40' },
                { text: 'Ai là người lãnh đạo nhân dân ta chống lại quân Nam Hán', answer: 'Ngô Quyền' },
                { text: 'Ngô Quyền đã lên ngôi vua năm nào?', answer: '939' },
                { text: 'Đinh Bộ Lĩnh lên ngôi vua đặt tên nước ta là gì?', answer: 'Đại Cồ Việt' },
                { text: 'Kinh đố nước Âu Lạc đặt ở đâu', answer: 'Cổ loa' },
                { text: 'Vì sao An Dương Vương lại thua Triệu Đà', answer: 'Do mất cảnh giác với địch' },
                { text: 'Ngô Quyền trị vì đất nước bao nhiêu năm', answer: '6 năm' },
                { text: 'Triều đại nhà Lý bắt đầu từ năm nào?', answer: '1009' },
                { text: 'Lê Hoàn lên ngôi vua lấy tên gọi là gì?', answer: 'Lê Đại Hành' },
                { text: 'Lý Thái Tổ dời đô về Đại La vào thời gian nào?', answer: '1010' },
                { text: 'Nhà Tống xâm lược nước ta lần thứ hai vào thời gian nào?', answer: '1068' },
                { text: 'Kết quả của cuộc kháng chiến chống quân Tống xâm lược lần thứ hai?', answer: 'Thắng lợi' },
                { text: 'Nhà trần được thành lập vào năm nào?', answer: 'Đầu năm 1226' },
                { text: 'Dưới thời nhà Trần thì nước ta được chia thành bao nhiêu lộ?', answer: '12 lộ' },
                { text: 'Nhà Trần đã lập ra " Hà đê sứ" để làm gì?', answer: 'Để trông coi việc đắp đê và bảo vệ đê' },
                { text: 'Ai là người lãnh đạo nghĩa quân Lam sơn chống lại quân Minh', answer: 'Lê Lợi' },
                { text: 'Lê Lợi lên ngôi vua vào năm nào?', answer: '1428' },
                { text: 'Bản đồ đầu tiên của nước ta có tên là gì?', answer: 'Bản đồ Hồng đức' },
                { text: 'Nội dung cơ bản của Bộ Luật Hồng đức là gì?', answer: 'Khuyến khích phát triển kinh tế và Bảo vệ quyền lợi của vua' },
                { text: 'Kỳ thi Hương được tổ chức mấy năm một lần', answer: '3 năm' },
                { text: 'Cuộc chiến giữa Nam Triều và Bắc Triều kéo dài bao nhiêu năm', answer: 'Hơn 50 năm' },
                { text: 'Ai là người lãnh đạo nghĩa quân Tây sơn', answer: 'Nguyễn Huệ' },
                { text: 'Sau khi lên ngôi vua thì Nguyễn Ánh chọn kinh đô ở đâu?', answer: 'Huế' },
                { text: 'Nhà Nguyễn trải qua bao nhiêu đời vua', answer: '4' },
                { text: 'Quang Trung kéo quân ra bắc tiêu diệt quân Thanh và thống nhất đất nước năm?', answer: 'Đầu năm 1788' },
                { text: 'Công cuộc khai khẩn đất hoang ở đàng trong diễn ra thời gian nào', answer: 'Cuối thế kỷ XVI' },
            ];
        } else if (topic === 'DHBC') {
            topicName = 'Đuổi Hình Bắt Chữ';
            questions = [
                { images: 'https://i.imgur.com/eJwU4EJ.jpeg', answer: 'Hầu Bao' }, // { images: ['link_to_image1', 'link_to_image2'], answer: 'A' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-43-1024x1011.jpg', answer: 'Gió Heo May' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-11-768x758.jpg', answer: 'Họa Tiết' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-50-768x758.jpg', answer: 'Tài Cán' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-24-768x758.jpg', answer: 'Nhân Đức' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-17-768x758.jpg', answer: 'Kỳ Vĩ' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-32-1024x1011.jpg', answer: 'Phê Phán' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-37-768x758.jpg', answer: 'Mật Thiết' },
                { images: 'https://haticado.com/wp-content/uploads/2021/07/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-42-768x758.jpg', answer: 'Tỷ Lệ' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-193-10-1.jpg', answer: 'Cảnh Vật' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-200.jpg', answer: 'E Ấp' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-181-768x758.jpg', answer: 'Cao Nhân' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-166-768x758.jpg', answer: 'Bất Ngờ' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-165-768x758.jpg', answer: 'Tối Hậu Thư' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-159-1024x1011.jpg', answer: 'Tương Tự' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-kho-duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-hay-nhat-moi-cau-do-vui-hack-nao-thu-thach-Haticado-33-768x758.jpg', answer: 'Tập Trung' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-199-768x758.jpg', answer: 'Đa Tạ' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-130-768x758.jpg', answer: 'Tổng Bí Thư' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-sieu-kho-tri-tue-Haticado-31-768x758.jpg', answer: 'Phong Độ' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-193-7-768x758.jpg', answer: 'Đồng Môn' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-193-5-768x761.jpg', answer: 'Thực Tiễn' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-193-3-1024x1011.jpg', answer: 'Cảnh Tượng' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-193-1-768x758.jpg', answer: 'Diện Kiến' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-kho-duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-hay-nhat-moi-cau-do-vui-hack-nao-thu-thach-Haticado-82-768x758.jpg', answer: 'Đầm Ấm' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-kho-duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-hay-nhat-moi-cau-do-vui-hack-nao-thu-thach-Haticado-56-768x758.jpg', answer: 'Lanh Chanh' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-kho-duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-hay-nhat-moi-cau-do-vui-hack-nao-thu-thach-Haticado-100-768x758.jpg', answer: 'Khẩu Độ' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-kho-duoi-hinh-bat-chu-2022-co-dap-an-duoi-hinh-bat-chu-hay-nhat-moi-cau-do-vui-hack-nao-thu-thach-Haticado-80-768x758.jpg', answer: 'Chạy Trường' },
                { images: 'https://haticado.com/wp-content/uploads/2021/01/Duoi-hinh-bat-chu-doan-ten-nhan-vat-lich-su-viet-nam-duoi-hinh-bat-chu-2021-dhbc-kho-game-do-vui-hack-nao-haticado-5-1024x576.jpg', answer: 'Nguyễn Xí' },
                { images: 'https://haticado.com/wp-content/uploads/2022/01/Duoi-hinh-bat-chu-mon-an-dac-san-am-thuc-viet-nam-duoi-hinh-bat-chu-2022-thu-thach-doan-ten-mon-an-dhbc-kho-game-do-vui-haticado-2-1024x576.jpg', answer: 'Cơm Gà Hội An' },
                { images: 'https://haticado.com/wp-content/uploads/2020/04/Duoi-hinh-bat-chu-2020-duoi-hinh-bat-chu-sieu-toc-cau-do-vui-hai-nao-tro-choi-tri-tue-Haticado-142-1024x1011.jpg', answer: 'Đơn Độc' },
                { images: 'https://haticado.com/wp-content/uploads/2020/04/Duoi-hinh-bat-chu-2020-duoi-hinh-bat-chu-sieu-toc-cau-do-vui-hai-nao-tro-choi-tri-tue-Haticado-137-768x758.jpg', answer: 'Trái Cấm' },
                { images: 'https://haticado.com/wp-content/uploads/2020/04/Duoi-hinh-bat-chu-2020-duoi-hinh-bat-chu-sieu-toc-cau-do-vui-hai-nao-tro-choi-tri-tue-Haticado-132-768x758.jpg', answer: 'Biển Hiệu' },
                { images: 'https://haticado.com/wp-content/uploads/2020/04/Duoi-hinh-bat-chu-2020-duoi-hinh-bat-chu-sieu-toc-cau-do-vui-hai-nao-tro-choi-tri-tue-Haticado-122-768x758.jpg', answer: 'Bánh Quy' },
                { images: 'https://haticado.com/wp-content/uploads/2020/04/Duoi-hinh-bat-chu-2020-duoi-hinh-bat-chu-sieu-toc-cau-do-vui-hai-nao-tro-choi-tri-tue-Haticado-102-768x758.jpg', answer: 'Cao Kiến' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-186-768x758.jpg', answer: 'Cảm Tử' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-195-ok-768x757.jpg', answer: 'Đô Thị' },
                { images: 'https://haticado.com/wp-content/uploads/2022/10/Duoi-hinh-bat-chu-2021-co-dap-an-duoi-hinh-bat-chu-kho-cau-do-vui-hack-nao-thu-thach-tri-tue-Haticado-152-768x758.jpg', answer: 'Hoành Tráng' },
                { images: 'https://haticado.com/wp-content/uploads/2020/04/Duoi-hinh-bat-chu-2020-duoi-hinh-bat-chu-sieu-toc-cau-do-vui-hai-nao-tro-choi-tri-tue-Haticado-59-768x758.jpg', answer: 'Thuốc Lào' },
            ];
            
        } else if (topic === 'DL') {
            topicName = 'Địa Lý';
            questions = [
                { text: 'Đố chơi, đố chọc\nVừa học vừa vui\nAi biết giúp tui\nKể tên ba tỉnh\nCó ba con vật hiện ra?', answer: 'Sóc Trăng, Đồng Nai, Sơn La' },
                { text: 'Tên GIANG mà chẳng phải sông\nĐây tên năm tỉnh, ai thông đáp liền\nEm ngoan thi với bạn hiền\nĐáp nhanh đáp đúng, ưu tiên thưởng quà', answer: 'Hà Giang, Bắc Giang, An Giang, Tiền Giang, Kiên Giang' },
                { text: 'Sông nào trước? sông nào sau?\nNhư rồng uốn khúc đẹp màu phù sa.', answer: 'Sông Tiền và Sông Hậu' },
                { text: 'Sông nào lạnh lẽo tâm can chảy qua Đà Nẵng Quảng Nam trung phần?', answer: 'Sông Hàn' },
                { text: 'Sông nào bên đục bên trong?', answer: 'Sông Thương' },
                { text: 'Tỉnh gì tên chẳng thiếu đâu?', answer: 'Thừa Thiên Huế' },
                { text: 'Có nơi tên tỉnh cũng là tên sông?', answer: 'Tiền Giang' },
                { text: 'Nơi nào có bến Ninh Kiều,\nTây Đô sông nước dập dìu khách thương?', answer: 'Cần Thơ' },
                { text: 'Theo ngược lên dòng sông Ba,\nNơi buồn muôn thuở gọi là gì đây?', answer: 'Buôn Ma Thuột' },
                { text: 'Tỉnh nào tiếp giáp đất Miên,\nLà nơi có núi Bà Đen lâu đời?', answer: 'Tây Ninh' },
                { text: 'Nơi nào có cửa nhượng ban\nGạo nhiều, cá lắm dễ bề làm ăn?', answer: 'Hà Tĩnh' },
                { text: 'Xe vừa qua huyện Sông Cầu,\nHai bên đồng ruộng xanh mầu bình yên.\nBạn ơi ! cho biết cái tên,\nThành phố núi Nhạn nằm bên sông Đà?', answer: 'Tuy Hòa' },
                { text: 'Phía trong quần đảo Thổ Chu,\nTrong vùng vịnh biển tít mù cực nam.\nĐảo nào nước mắm lừng danh,\nLà đảo lớn nhất Việt Nam của mình?', answer: 'Đảo Phú Quốc' },
                { text: 'Nơi nào có vải Đinh Hòa\nCó cau Hồ Bái, có cà Đan Nê\nCó dừa Quảng Hán, Lựu Khê\nCó cơm chợ Bản, thịt dê quán Lào?', answer: 'Thanh Hóa' },
                { text: 'Thành phố xanh hòa bình\nSoi bóng dòng sông đổ\nLịch sư ngàn năm qua\nBao dấu son còn đó\nĐây Ba Đình , Đống Đa\nĐây Hồ Gươm , Tháp Bút\nMãi mãi bản hùng ca?', answer: 'Hà Nội' },
                { text: 'Nơi nào giữa chốn đô thành\nBác vì dân, nước lên tàu bôn ba?', answer: 'Bến Nhà Rồng' },
                { text: 'Sông nào chia cắt nước nhà\nHai miền Nam Bắc can qua tương tàn?', answer: 'Sông Bến Hải' },
                { text: 'Núi nào Thánh Gióng lên trời?', answer: 'Núi Sóc Sơn' },
                { text: 'Núi nào Lê Lợi hội thề,\nMột lòng tụ nghĩa diệt bè xâm lăng?', answer: 'Núi Bù Me' },
                { text: 'Thành nào xây chỉ một đêm,\nCó hình xoắn ốc thưa tên là gì?', answer: 'Thành Cổ Loa' },
                { text: 'Chùa nào là chốn danh lam,\nGiữa lòng Hà Nội có ngàn năm hơn?', answer: 'Chùa Một Cột' },
                { text: 'Vịnh nào phong cảnh hữu tình,\nKỳ quan thế giới đã bình chọn ra?', answer: 'Vịnh Hạ Long' },
                { text: 'Đảo nào quần thể ở xa đất liền?', answer: 'quần đảo Trường Sa - Hoàng Sa' },
                { text: 'dVịnh nào mà có chữ Cam?', answer: 'Vịnh Cam Ranh' },
                { text: 'Bến gì tấp nập bán mua\nLừng danh ngôi chợ đất xưa Sài Thành?', answer: 'Bến Thành' },
                { text: 'Nơi nào ở huyện Chí Linh\nKhi xưa Nguyễn Trãi đã về ẩn cư?', answer: 'Côn Sơn' },
            ];
        } else if (topic === 'AN') {
            topicName = 'Âm Nhạc';
            questions = [
                { text: 'Bài hát Lý cây đa thuộc dân ca vùng nào?', answer: 'Dân ca Quan họ Bắc Ninh' },
                { text: 'Giá trị trường độ lớn nhất của nhịp 4/4 là?', answer: 'Nốt tròn' },
                { text: 'Nhạc sĩ Hoàng Việt sinh và mất năm nào?', answer: 'Năm 1928 - 1967' },
                { text: 'Bài hát Mái trường mếm yêu là của nhạc sĩ nào?', answer: 'Lê Quốc Thắng' },
                { text: 'Khuôn nhạc gồm mấy dòng và mấy khe?', answer: 'Năm dòng bốn khe' },
                { text: 'Bài hát Đi cấy thuộc dân ca vùng, miền nào?', answer: 'Dân ca Thanh Hóa' },
                { text: 'Nhạc sĩ thiên tài Mozart là người nước nào?', answer: 'Nước Áo' },
                { text: 'W.A Mozart (Mô da) đã sáng tác lúc ông bao nhiêu tuổi?', answer: '5 tuổi' },
                { text: 'Trong điệp khúc bài hát "Anh cứ đi đi", em đã đuổi anh đi bao nhiêu lần?', answer: '2 lần' },
                { text: 'Ai đã tách ra khỏi một bộ đôi để hoạt động solo vào năm 1987 và đạt được thành công ngay lập tức với bài hát “Faith”?', answer: 'George Michael' },
                { text: 'Trong bài Rước đèn tháng 9 có bao nhiêu loại lồng đèn trong lời bài hát?', answer: '8 loại' },
                { text: 'Nữ ca sĩ nào đoạt giải Nghệ sĩ mới xuất sắc nhất năm 1985?', answer: 'Cyndi Lauper' },
                { text: 'Bài hát "Người lạ ơi", có bao nhiêu thứ được mượn?', answer: '3 thứ' },
                { text: 'Nước nào bắt đầu nhạc pop?', answer: 'US và UK' },
                { text: 'Trong bài hát thiếu nhi "Ồ sao bé không lắc" đã nhắc tới mấy lần chữ lắc?', answer: '12 lần' },
                { text: 'Ông hoàng nhạc Pop là ai?', answer: 'Michael Jackson' },
                { text: 'Trong bài hát "Em yêu ai" em bé đã yêu những ai?', answer: 'Yêu ba, yêu mẹ, yêu anh, yêu chị' },
                { text: 'Britney Spears bao nhiêu tuổi khi bài hát nổi tiếng “Baby One More Time” của cô ra mắt năm 1998?', answer: '17' },
                { text: 'Trong bài hát "Túp lều lí tưởng" túp lều được xây bằng gì?', answer: 'Bằng duyên bằng tình' },
                { text: 'Ghé vào tai, sát vào bờ môi, anh là học sinh ngoan...không gọi anh dady, gọi anh là ông chủ', answer: 'Baby gọi cho anh' },
                { text: 'Trong bài "Túp lều lí tưởng" đêm đêm hai nhân vật làm gì?', answer: 'Ngắm chị Hằng' },
                { text: 'Anh này, đẹp trai này, đại gia này, nhà giầu tiêu thả ga...là bài hát nào?', answer: 'Anh không đòi quà' },
                { text: 'Cuối con đường là bầu trời xanh ấm em bên tôi mỗi khi buồn lặng lẽ xóa tan Âu Lo...là bài hát nào?', answer: 'Như ngày hôm qua' },
                { text: 'Thức giấc đi nguyên 1 đêm miệt mài, con gà trống đứng gáy...là bài hát nào?', answer: 'Thức dậy đi' },
                { text: 'Có những lúc cô đơn một mình dường như bước chân lê đi mỏi mệt... là bài hát nào?', answer: 'Bad girl' },
                { text: 'Giờ làm sao để quên tháng năm đó...trong tim. Điền vào chỗ trống ... còn thiếu ?', answer: 'In sâu vào' },
                { text: 'Người theo hương hoa mây mù giăng lối....là bài hát nào', answer: 'Lạc trôi' },
                { text: 'Anh phải cố chờ đợi....người ơi. Điền vào chỗ trống ... còn thiếu ?', answer: 'Đến bao giờ' },
                { text: 'Má em dặn là, con gái như ngọc ngà...còn đôi mắt phải điệu đà. Điền vào chỗ trống ... còn thiếu', answer: 'Dáng đi kiêu xa' },
                { text: 'Xác pháo vu quy bên thềm, có chắc hạnh phúc....đời người con gái dục trong người ơi. Điền vào chỗ trống ... còn thiếu ?', answer: 'Êm đềm' },
                { text: 'Và em muốn bước tiếp cùng anh....muôn trùng. Điền vào chỗ trống ... còn thiếu ?', answer: 'Đến nơi hạnh phúc' },
                { text: 'Ngày thơ bé có cánh đồng trưa nắng bên bờ sông.. là bài hát nào', answer: 'Lớn rồi còn khóc nhè' },
            ];
        } else if (topic === 'TH') {
            topicName = 'Tổng Hợp';
            questions = [
                { text: 'Câu hỏi địa lý 1?', answer: 'Đáp án X' },
                { text: 'Câu hỏi địa lý 2?', answer: 'Đáp án Z' }
            ];
        }

        const challengeMessage = `${player}, bạn đã được mời chơi Trò chơi đấu trí với chủ đề là ${topicName} bởi ${interaction.user}! Bạn có muốn chấp nhận thử thách này không?`;

        const yesButton = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel('Chấp nhận')
            .setStyle(ButtonStyle.Primary);

        const noButton = new ButtonBuilder()
            .setCustomId('no')
            .setLabel('Từ chối')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(yesButton, noButton);

        await interaction.reply({
            content: challengeMessage,
            components: [row]
        });

        const filter = i => i.customId === 'yes' || i.customId === 'no';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id === player.id) {
                if (i.customId === 'yes') {
                    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
                    
                    // Hiển thị câu hỏi dựa trên chủ đề
                    let questionContent;
                    if (topic === 'LS' || topic === 'DL' || topic === 'AN' || topic === 'TH') {
                        questionContent = `${player} đã chấp nhận thử thách\nChủ đề: ${topicName} !\nCâu hỏi của bạn: ${selectedQuestion.text}`;
                    } else if (topic === 'DHBC') {
                        questionContent = `${player} đã chấp nhận thử thách\nChủ đề: ${topicName}!\nCâu hỏi của bạn:`;
                    }

                    await i.update({ 
                        content: questionContent, 
                        components: [], 
                        embeds: topic === 'DHBC' ? [new EmbedBuilder().setImage(selectedQuestion.images)] : [] 
                    });

                    // Dừng collector cũ nếu tồn tại trước khi khởi tạo collector mới
                    if (collector) collector.stop();

                    // Tạo message collector để thu thập câu trả lời
                    const answerFilter = m => m.author.id === interaction.user.id || m.author.id === player.id;
                    const answerCollector = interaction.channel.createMessageCollector({ filter: answerFilter, time: 60000 });

                    // Khởi tạo điểm số nếu chưa có trong biến toàn cục
                    if (!scores[interaction.user.id]) scores[interaction.user.id] = 0;
                    if (!scores[player.id]) scores[player.id] = 0;

                    answerCollector.on('collect', async m => {
                        const userAnswer = m.content.trim().toUpperCase();
                        const correctAnswer = selectedQuestion.answer.toUpperCase();

                        // So sánh câu trả lời của người chơi với đáp án đúng
                        if (userAnswer === correctAnswer) {
                            // Nếu người chơi trả lời đúng, cập nhật điểm số
                            scores[m.author.id]++;
                            const resultEmbed = new EmbedBuilder()
                                .setColor(0x32CD32)
                                .setTitle(`🎉 Câu trả lời chính xác - chủ đề ${topicName}!`)
                                .setDescription(`Người chơi ${m.author} đã đoán đúng từ!\n\nTừ đó là: \`${correctAnswer}\``)
                                .addFields({ name: 'Điểm số', value: `${interaction.user.displayName}: ${scores[interaction.user.id]}\n${player.displayName}: ${scores[player.id]}` })
                                .setTimestamp()
                                .setFooter({ text: 'Trò chơi IQ', iconURL: 'https://a.silvergames.com/j/b/spelling-scramble.jpg' });
                            
                            // await interaction.followUp({ embeds: [resultEmbed] });
                            await interaction.channel.send({ embeds: [resultEmbed] });

                            

                            // Kiểm tra xem có người nào đạt 10 điểm chưa
                            if (scores[m.author.id] === 2) {

                                const randAmount = Math.round((Math.random() * 3000) + 10);

                                // \n\n💰 Phần thưởng của bạn: ${rewardAmount} vnd!
                                const winnerEmbed = new EmbedBuilder()
                                    .setColor(`Green`)
                                    .setTitle('🏆 Chúc mừng!')
                                    .setDescription
                                        (
                                            `Người chơi ${m.author.displayName} đã chiến thắng trong trận đấu với điểm số:\n\n` +
                                            `${interaction.user.displayName}: ${scores[interaction.user.id]}\n${player.displayName}: ${scores[player.id]}\n\n` +
                                            `💰 Phần thưởng của bạn: ${randAmount} <a:xu:1308740324415377418>!`
                                        )
                                    .setTimestamp()
                                    .setFooter({ text: 'Kết thúc trò chơi', iconURL: 'https://a.silvergames.com/j/b/spelling-scramble.jpg' });

                                await interaction.channel.send({ embeds: [winnerEmbed] });

                                // Thực hiện việc cập nhật phần thưởng vào MongoDB
                                const winnerData = await economySystem.findOne({ Guild: interaction.guild.id, User: m.author.id });
                                
                                if (winnerData) {
                                    // Cộng thêm 1000 vào ví (Wallet) của người chơi
                                    winnerData.Wallet += randAmount;
                                    await winnerData.save(); // Lưu lại thay đổi
                                } else {
                                    // Nếu không tìm thấy dữ liệu của người chơi, thông báo cho người chơi
                                    const noAccountEmbed = new EmbedBuilder()
                                        .setColor(`Red`)
                                        .setTitle('⚠️ KHÔNG TÌM THẤY TÀI KHOẢN!')
                                        .setDescription(`Người chơi ${m.author.displayName}, có vẻ như bạn chưa có tài khoản trong hệ thống. Vui lòng tạo tài khoản bằng lệnh \`\`\`/economy great-account\`\`\` để nhận phần thưởng.`)
                                        .setTimestamp();

                                    await interaction.channel.send({ embeds: [noAccountEmbed] });
                                }

                            // Reset điểm số sau khi có người thắng
                            scores[interaction.user.id] = 0; // Reset điểm số của người khởi tạo lệnh
                            scores[player.id] = 0; // Reset điểm số của người chơi

                            // Có thể thêm thông báo nếu muốn
                            // await interaction.followUp({ content: `Điểm số đã được reset! Bây giờ cả hai có thể thi đấu lại!`, ephemeral: false });

                            }

                            answerCollector.stop(); // Dừng collector sau khi có người chiến thắng
                        } else {
                            // Kiểm tra xem có phải là câu trả lời cuối cùng không
                            if (answerCollector.collected.size === 2) {
                                const wrongEmbed = new EmbedBuilder()
                                    .setColor(0xFF4500)
                                    .setTitle(`❌ Câu trả lời chưa chính xác - chủ đề ${topicName}!`)
                                    .setDescription(`**Đáp án đúng là:** \`${correctAnswer}\`\n\nCả hai người chơi đều không có điểm nào.Hãy thử lại với câu hỏi khác!`)
                                    .addFields({ name: 'Điểm số', value: `${interaction.user.username}: ${scores[interaction.user.id]}\n${player.username}: ${scores[player.id]}` })
                                    .setTimestamp()
                                    .setFooter({ text: 'Trò chơi IQ', iconURL: 'https://a.silvergames.com/j/b/spelling-scramble.jpg' });

                                await interaction.channel.send({ embeds: [wrongEmbed] });
                                answerCollector.stop(); // Dừng collector nếu không có ai đoán đúng
                            }
                        }
                    });

                    answerCollector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.followUp('Không có câu trả lời nào được đưa ra.');
                        }
                    });
                } else if (i.customId === 'no') {
                    await i.update({ content: `${player} đã từ chối thử thách.`, components: [] });
                }
            } else {
                await i.deferUpdate();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Không có phản hồi nào từ người chơi.', components: [] });
            }
        });
    },
};

