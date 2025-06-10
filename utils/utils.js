const { ButtonBuilder } = require('discord.js');

module.exports = {
    
    // Hàm để vô hiệu hóa tất cả các nút trong các thành phần
    disableButtons(components) {

        // Lặp qua từng thành phần
        for (let x = 0; x < components.length; x++) {
            // Lặp qua từng nút trong thành phần
            for (let y = 0; y < components[x].components.length; y++) {
                 // Tạo một bản sao của nút hiện tại
                components[x].components[y] = ButtonBuilder.from(components[x].components[y]);
                // Đặt nút thành vô hiệu hóa
                components[x].components[y].setDisabled(true);
            }
        }
        return components; // Trả về các thành phần đã được chỉnh sửa
    },

    // Hàm để lấy biểu tượng cảm xúc tương ứng với số
    getNumEmoji(number) {
        // Mảng chứa biểu tượng cảm xúc cho các số từ 0 đến 10
        const numEmoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        return numEmoji[number]; // Trả về biểu tượng cảm xúc tương ứng với số được truyền vào
    },

    // Hàm định dạng tin nhắn với các tùy chọn và nội dung tin nhắn
    formatMessage(options, contentMsg) {
        const { message, opponent } = options; // Lấy thông tin người chơi và đối thủ từ options
        let content = options[contentMsg]; // Lấy nội dung tin nhắn từ options
        
        // Thay thế các biến trong nội dung với thông tin thực tế
        content = content.replace('{player.tag}', message.author.tag).replace('{player.username}', message.author.displayName).replace('{player}', `<@!${message.author.id}>`);
        content = content.replace('{opponent.tag}', opponent?.tag).replace('{opponent.username}', opponent?.displayName).replace('{opponent}', `<@!${opponent?.id}>`);
        return content; // Trả về nội dung đã được định dạng
    },

    // Hàm để giải mã nội dung HTML
    decode(content) {
        return require('html-entities').decode(content); // Sử dụng thư viện để giải mã các ký tự HTML
    },

    // Hàm để di chuyển vị trí trong bảng dựa trên hướng
    move(pos, direction) {
        // Dựa trên hướng, cập nhật vị trí x và y
        if (direction === 'up') return { x: pos.x, y: pos.y - 1 };
        else if (direction === 'down') return { x: pos.x, y: pos.y + 1 };
        else if (direction === 'left') return { x: pos.x - 1, y: pos.y };
        else if (direction === 'right') return { x: pos.x + 1, y: pos.y }
        else return pos; // Nếu hướng không hợp lệ, trả về vị trí gốc
    },

    // Hàm để lấy hướng đối diện với hướng hiện tại
    oppDirection(direction) {
        if (direction === 'up') return 'down';
        else if (direction === 'down') return 'up';
        else if (direction === 'left') return 'right';
        else if (direction === 'right') return 'left';
    },

    // Hàm để lấy biểu tượng cảm xúc tương ứng với một chữ cái
    getAlphaEmoji(letter) {
        // Đối tượng chứa các chữ cái và biểu tượng cảm xúc tương ứng
        const letters = {
            'A': '🇦', 'B': '🇧', 'C': '🇨', 'D': '🇩', 'E': '🇪', 'F': '🇫', 'G': '🇬', 'H': '🇭', 'I': '🇮',
            'J': '🇯', 'K': '🇰', 'L': '🇱', 'M': '🇲', 'N': '🇳', 'O': '🇴', 'P': '🇵', 'Q': '🇶', 'R': '🇷',
            'S': '🇸', 'T': '🇹', 'U': '🇺', 'V': '🇻', 'W': '🇼', 'X': '🇽', 'Y': '🇾', 'Z': '🇿',
            }

        // Trả về các chữ cái tương ứng với chỉ số 0 hoặc 1
        if (letter == 0) return Object.keys(letters).slice(0, 12);
        if (letter == 1) return Object.keys(letters).slice(12, 24);
        return letters[letter];// Trả về biểu tượng cảm xúc tương ứng với chữ cái được truyền vào
    },

    // Hàm để xáo trộn một mảng
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // Chọn một chỉ số ngẫu nhiên
            const j = Math.floor(Math.random() * (i + 1));
            // Hoán đổi vị trí của hai phần tử trong mảng
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array; // Trả về mảng đã được xáo trộn
    }
}

// Xuất một lớp tùy chỉnh kế thừa từ ButtonBuilder
module.exports.ButtonBuilder = class buttonBuilder extends ButtonBuilder {
    constructor(options) {
        super(options); // Gọi constructor của lớp cha
    }

    // Hàm để thiết lập tên cho lệnh
    setName(name) {
        this.setName(name); // Gọi phương thức setName của lớp cha
        return this; // Trả về đối tượng CustomSlashCommandBuilder hiện tại
    }

    // Hàm để thiết lập mô tả cho lệnh
    setDescription(description) {
        this.setDescription(description); // Gọi phương thức setDescription của lớp cha
        return this; // Trả về đối tượng CustomSlashCommandBuilder hiện tại
    }

    // Hàm để thiết lập kiểu nút
    setStyle(style) {
        this.data.style = (style==='Primary') ? 1 : (style==='Success') ? 3 : (style==='Danger') ? 4 : 2;
        return this; // Trả về đối tượng ButtonBuilder hiện tại để cho phép chaining
    }

    // Hàm để xóa nhãn của nút
    removeLabel() {
        this.data.label = null; // Đặt nhãn thành null
        return this; // Trả về đối tượng ButtonBuilder hiện tại
    }

    // Hàm để xóa biểu tượng cảm xúc của nút
    removeEmoji() {
        this.data.emoji = null; // Đặt emoji thành null
        return this;// Trả về đối tượng ButtonBuilder hiện tại
    }
}