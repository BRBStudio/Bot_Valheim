/* 
                                            CUNG CẤP CHỨC NĂNG TƯƠNG TÁC CHO WEB
*/

// Tìm hình ảnh và chú thích
const imageContainer = document.querySelector('.image-container');
const tooltip = imageContainer.querySelector('.tooltip');

// Sự kiện di chuyển chuột vào trong container của ảnh
imageContainer.addEventListener('mousemove', function(event) {
    const imageRect = imageContainer.getBoundingClientRect(); // Lấy vị trí của ảnh
    const mouseX = event.clientX - imageRect.left; // Vị trí X của chuột so với hình ảnh
    const mouseY = event.clientY - imageRect.top; // Vị trí Y của chuột so với hình ảnh

    // Kiểm tra nếu con trỏ nằm ở vùng trung tâm của ảnh
    const imageCenterX = imageRect.width / 2;
    const imageCenterY = imageRect.height / 2;
    const centerThreshold = 50; // Khoảng cách cho phép tính là trung tâm

    if (
        Math.abs(mouseX - imageCenterX) < centerThreshold &&
        Math.abs(mouseY - imageCenterY) < centerThreshold
    ) {
        tooltip.style.opacity = '1'; // Hiển thị chú thích nếu nằm gần giữa ảnh
    } else {
        tooltip.style.opacity = '0'; // Ẩn chú thích nếu ra ngoài vùng trung tâm
    }

    // Đặt vị trí của chú thích theo vị trí chuột và dịch sang phải
    tooltip.style.left = `${event.clientX + 20}px`; // Hiển thị bên phải chuột
    tooltip.style.top = `${event.clientY}px`; // Giữ vị trí theo chiều dọc của chuột
});

// Ẩn chú thích khi rời khỏi container của ảnh
imageContainer.addEventListener('mouseleave', function() {
    tooltip.style.opacity = '0'; // Ẩn khi chuột ra ngoài ảnh
});


console.log('Trang web BRB STUDIO đã được tải'); //  Nhấn F12 tìm tab "Console" sẽ thấy thông điệp "Trang web đã được tải" hiển thị tại đây mỗi khi tải lại trang.
