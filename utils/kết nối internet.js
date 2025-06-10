const https = require('https'); // Yêu cầu module HTTPS

let connected = false; // Lưu trạng thái kết nối
let lastTest = 0; // Thời gian kiểm tra kết nối gần nhất

async function TestConnection() {
    if (Date.now() - lastTest < 1000 * 60) return connected; // Kiểm tra lại sau 1 phút
    return new Promise(resolve => {
        const request = https.get({
            hostname: 'www.google.com',
            port: 443,
            path: '/',
            method: 'HEAD', // Chỉ lấy tiêu đề, không cần toàn bộ trang
            timeout: 5000 // Hết thời gian chờ sau 5 giây
        }, function (response) {
            lastTest = Date.now(); // Cập nhật thời gian kiểm tra
            connected = response.statusCode === 200; // Kiểm tra mã trạng thái HTTP
            resolve(connected); // Trả về kết quả
        });
        function onError() {
            lastTest = Date.now();
            connected = false;
            resolve(false); // Kết nối thất bại
        }
        request.on('error', onError); // Xử lý lỗi
        request.on('timeout', onError); // Xử lý hết thời gian chờ
        request.end();
    });
}

module.exports = TestConnection;
