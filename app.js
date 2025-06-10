/*
                                                                    THIẾT LẬP VÀ CHẠY MÁY CHỦ WEB
*/

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Đặt thư mục tĩnh để chứa file HTML, CSS, JS
const publicPath = path.join(__dirname, 'web/public'); // Đường dẫn đến thư mục public
app.use(express.static(publicPath));

// Kiểm tra các tệp trong thư mục public
fs.readdir(publicPath, (err, files) => {
    if (err) {
        console.error('Lỗi khi đọc thư mục:', err);
    }
});

// Đặt cổng cho máy chủ
const PORT = process.env.PORT || 2800;

// Route chính để hiển thị trang index.html
app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html'); // Đường dẫn đến index.html
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Lỗi khi gửi tệp:', err); // Hiển thị lỗi nếu không gửi được tệp
        }
    });
});

app.get('/gallery.html', (req, res) => {
    const category = req.query.category; // Lấy giá trị của 'category' từ query parameters
    const galleryPath = path.join(publicPath, 'gallery.html');

    // Kiểm tra category để xác định loại ảnh nào sẽ được hiển thị
    if (category === 'wedding' || category === 'fashion') {
        res.sendFile(galleryPath, (err) => {
            if (err) {
                console.error('Lỗi khi gửi tệp gallery:', err);
            }
        });
    } else {
        res.status(404).send('Không tìm thấy danh mục hình ảnh.');
    }
});


// Khởi động server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Lỗi khi khởi động server:', err);
    } else {
        console.log(`Máy chủ web đang chạy tại http://localhost:${PORT}`);
    }
});
