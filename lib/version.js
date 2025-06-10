const axios = require('axios');
const config = require('../config')

// mã màu ansi https://talyian.github.io/ansicolors/
const color = {
    red: '\x1b[31m',
    orange: '\x1b[38;5;202m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    pink: '\x1b[38;5;213m',
    torquise: '\x1b[38;5;45m', // Xanh ngọc
    reset: '\x1b[0m',          // màu mặc định

    lightRed: '\x1b[38;5;197m',     // Đỏ sáng
    lightGreen: '\x1b[38;5;82m',    // Xanh lá cây sáng
    lightYellow: '\x1b[38;5;227m',  // Vàng sáng
    lightBlue: '\x1b[38;5;75m',     // Xanh dương sáng
    lightPink: '\x1b[38;5;213m',    // Hồng sáng

    darkRed: '\x1b[38;5;124m',      // Đỏ tối
    darkGreen: '\x1b[38;5;22m',     // Xanh lá cây tối
    darkYellow: '\x1b[38;5;130m',   // Vàng tối
    darkBlue: '\x1b[38;5;17m',      // Xanh dương tối
    darkPink: '\x1b[38;5;199m',     // Hồng tối

    cyan: '\x1b[36m',               // Xanh lam nhạt
    magenta: '\x1b[35m',            // Tím
    gray: '\x1b[90m',               // Xám
    lightGray: '\x1b[37m',          // Xám sáng
    darkGray: '\x1b[90m',           // Xám đen

    lightCyan: '\x1b[96m',          // Xanh lam sáng
    lightMagenta: '\x1b[95m',       // Tím sáng
    darkCyan: '\x1b[36m',           // Xanh lam tối
    darkMagenta: '\x1b[35m',        // Tím tối
    brown: '\x1b[33m',              // Nâu

    purple: '\x1b[35m',             // Tím
    lightPurple: '\x1b[38;5;171m',  // Tím sáng
    deepBlue: '\x1b[38;5;17m',      // Xanh dương sâu
    olive: '\x1b[38;5;64m',         // Xanh ô liu
    teal: '\x1b[38;5;37m',          // Xanh lam xanh

    salmon: '\x1b[38;5;209m',       // Đỏ hồng
    peach: '\x1b[38;5;216m',        // Đào
    lavender: '\x1b[38;5;207m',     // Hoa oải hương
    mint: '\x1b[38;5;119m',         // Xanh bạc hà
    coral: '\x1b[38;5;202m'         // San hô
}

function getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

async function getLatestVersion() {
    try {
        const response = await axios.get('https://api.github.com/repos/BRBStudio/Valheim/releases/latest');
        const latestVersion = response.data.tag_name;
        return latestVersion;
    } catch (error) {
        console.error(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Lỗi khi truy xuất phiên bản mới nhất. Không tìm thấy bản phát hành. ${color.reset}`);
    }
}

// // Hàm delay trả về Promise để sử dụng async/await
// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

async function checkVersion(currentVersion, client) {
    const latestVersion = await getLatestVersion(); // Dùng await để đảm bảo lấy được phiên bản mới nhất

    // // Chờ 2 giây trước khi thực hiện các dòng console.log
    // await delay(2000); // Delay 2 giây

    // hoặc dùng Thêm độ trễ 2 giây trước khi hiển thị console.log 
    setTimeout(async () => {

        if (currentVersion < latestVersion) {
            console.log(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Chú ý, đã có bản cập nhật mới, vui lòng cài đặt nó - https://github.com/BRBStudio/Bot_Valheim/releases/latest`);
        } else {
            console.log(`${color.yellow}💕 ${client.user.username} đã được bật\n💕 ID Bot: ${client.user.id}`);

            console.log(`${color.green}🐰  Bot đang tham gia ${client.guilds.cache.size} máy chủ.`);

            console.log(`${color.peach} ـﮩ٨ـ Đảm bảo tham gia máy chủ hỗ trợ nếu bạn cần bất kỳ trợ giúp nào: ${config.botServerInvite}`);

            console.log(`${color.torquise} ـﮩ٨ـ [${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] BRB STUDIO (${config.botVersion})`);
        }
    }, 2000);  // Đợi 2 giây trước khi hiển thị console.log 🐰 💕
}

module.exports = { getLatestVersion, checkVersion };