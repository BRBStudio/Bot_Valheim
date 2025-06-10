const { EmbedBuilder } = require(`discord.js`)
const config = require(`../config`)
const questions = [
    'AD chúc toàn thể ae 1 năm mới vạn sự như ý tỉ sự như mơ triệu triệu triệu bất ngờ nhé, ai chua có vk năm nay lấy vk, ai có rồi thì có thêm bà 2 giúp vk cả đỡ mệt =))))))',
    `Có tiền không, cho vài triệu đi chơi gái coi :))`
    ];

const randomquestion = questions[Math.floor(Math.random() * questions.length)];

//  set_nsfw.js
const BRB = new EmbedBuilder()
                .setColor(config.embedCyan)
                .setTitle(`LỆNH NÀY DÀNH CHO DEV`)
                .setDescription(`Hãy liên hệ trực tiếp với DEV [Valheim Survival](https://discord.com/users/940104526285910046), chúng tôi sẽ xem xét.`)


//  role_members.js
const finalEmbed = new EmbedBuilder()
            .setColor(config.embedGreen)
            .setDescription("Chọn một vai trò để xem danh sách thành viên có trong vai trò đó")
            .setImage(`https://i.makeagif.com/media/2-10-2022/Rqy9Le.gif`);


//  todo.js
const loadembeds = new EmbedBuilder()
            .setDescription(`⏳ Đang tìm nạp danh sách việc cần làm của bạn...`)
            .setColor('DarkNavy')

const embedr = new EmbedBuilder()
            .setColor('DarkNavy')
            .setDescription(`❗\`Bạn không có danh sách việc cần làm!\``)

const loadembedsff = new EmbedBuilder()
            .setDescription(`⏳ Đang kiểm tra danh sách việc cần làm của bạn...`)
            .setColor('DarkNavy')

const nodt = new EmbedBuilder()
            .setColor('DarkNavy')
            .setDescription(`❗\`Bạn không có nhiệm vụ nào cần xóa!\``)
            .setTimestamp();


//  welcome_custom.js
const removedEmbed = new EmbedBuilder()
            .setTitle("Hệ thống tin nhắn chào mừng")
            .setColor(config.embedRed)
            .setDescription("Thông báo chào mừng đã bị xóa khỏi máy chủ này");


//  get_help.js
const threadembed = new EmbedBuilder()
            .setTitle('⚠️| LƯU Ý:')
            .setDescription('Lệnh này chỉ có thể được sử dụng trong kênh diễn đàn!')
            .setThumbnail('https://i.imgur.com/9bQGPQM.gif')
            .setImage('https://4.bp.blogspot.com/-4xAT_MNNnng/TdwaZVdItUI/AAAAAAAAAQA/srsHB8vDVUY/s1600/animation_warning.gif')
            .setTimestamp();


//  help_valheim.js
const SetupMod = new EmbedBuilder()
            .setColor(config.embedRandom)
            .setDescription(
                `**Hướng dẫn 1:**\n` +

                `Giải nén file mod bạn vừa tải về, coppy toàn bộ file bên trong folder BRB STUDIO => paste vào nơi bạn để game valheim trên steam. Nếu không biết file đó nằm ở đâu ` +
                `thì bạn có thể vào steam => thư viện steam => valheim kích chuột phải => chọn quản lý (dòng số 4) => chọn mở thư mục trên máy ( dòng số 2)**\n` +

                `Hướng dẫn 2:**\n` +

                `Nếu bạn từng chơi mod rồi hoặc trong fodel vẫn còn file mod,thì bạn vào steam gỡ cài đặt, sau đó vào nơi chứa thư mục đó xóa hết file trong đó đi, sau đó làm theo ` +
                `**\`hướng dẫn 1\`**`
            )
            .setThumbnail("https://images-ext-2.discordapp.net/external/_T0Cb2tVMjPrszLCx-7Do1A5lRZrPliSVzbno44v6kU/https/i.ibb.co/S54HQLJ/standard-2.gif")
            .setTitle("★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★")
            .setImage(`https://i.imgur.com/9bQGPQM.gif`)

//  random_question.js
const randomquestionembed = new EmbedBuilder()
            .setTitle('Tết Giáp Thìn')
            .setDescription(`${randomquestion}`)
            .setColor('Blue')

//  verify_custom.js
const VerifyCustomembed = new EmbedBuilder()
            .setTitle('Xác minh tài khoản')
            .setDescription('Nhấn vào nút bên dưới để xác minh tài khoản của bạn.');

module.exports = {
    BRB,                                        // lệnh set_nsfw.js
    finalEmbed,                                 // lệnh role_members.js
    loadembeds,                                 // lệnh todo.js
    embedr,                                     // lệnh todo.js
    loadembedsff,                               // lệnh todo.js
    nodt,                                       // lệnh todo.js
    removedEmbed,                               // lệnh welcome_custom.js
    threadembed,                                // lệnh get_help.js
    SetupMod,                                   // lệnh help_valheim.js
    randomquestionembed,                        // lệnh random-question.js
    VerifyCustomembed,                          // lệnh verify_custom.js
}