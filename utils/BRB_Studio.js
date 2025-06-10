// Import các thành phần từ discord.js để tạo Embed và ActionRow (cho các nút)
const { EmbedBuilder, ActionRowBuilder } = require('discord.js');

// Import các hàm tiện ích để vô hiệu hóa nút, định dạng tin nhắn và tạo nút
const { disableButtons, formatMessage, ButtonBuilder } = require('./utils');

// Định nghĩa mảng biểu tượng màu sắc cho trò chơi
const squares = ['🍊', '🐙', '🎀', '🥝', '🍬', '🦋', '💥', '🩸'];

// Import thư viện events để tạo event emitter cho trò chơi
const events = require('events');

// Xuất lớp Flood, kế thừa từ events (để sử dụng event emitter)
module.exports = class BRB_Studio extends events {
    constructor(options = {}) {
        // Đặt tùy chọn mặc định cho isSlashGame nếu chưa được chỉ định (false nghĩa là không phải slash command)
        if (!options.isSlashGame) options.isSlashGame = false;

        // Kiểm tra xem tin nhắn có được cung cấp không; nếu không, throw lỗi
        if (!options.message) throw new TypeError('KHÔNG_CÓ_TIN_NHẮN: Không có tùy chọn tin nhắn nào được cung cấp.');

        // Kiểm tra loại của options.message, phải là một object
        if (typeof options.message !== 'object') throw new TypeError('TIN_NHẮN_KHÔNG_HỢP_LỆ: Tùy chọn tin nhắn phải là một đối tượng.');

        // Kiểm tra loại của isSlashGame, phải là boolean
        if (typeof options.isSlashGame !== 'boolean') throw new TypeError('LOẠI_LỆNH_KHÔNG_HỢP_LỆ: Tùy chọn isSlashGame phải là một boolean.');

        // Đặt các tùy chọn mặc định cho embed nếu chưa được cung cấp
        if (!options.embed) options.embed = {};
        if (!options.embed.title) options.embed.title = 'Flood';
        if (!options.embed.color) options.embed.color = '#5865F2';

        // Đặt độ khó, thời gian chờ và kiểu nút nếu chưa được cung cấp
        if (!options.difficulty) options.difficulty = 13; // Đặt độ khó mặc định là 13
        if (!options.timeoutTime) options.timeoutTime = 60000; // Đặt thời gian chờ mặc định là 60000 (1 phút)
        if (!options.buttonStyle) options.buttonStyle = 'Primary';

        // Đặt tin nhắn thắng/thua nếu chưa được cung cấp
        if (!options.winMessage) options.winMessage = 'Bạn đã thắng! Bạn đã mất **{turns}** lượt.';
        if (!options.loseMessage) options.loseMessage = 'Bạn đã thua! Bạn đã mất **{turns}** lượt.';

        // Nếu tùy chọn biểu tượng emoji được cung cấp và là một mảng, cập nhật mảng squares
        if (options.emojis && Array.isArray(options.emojis)) squares.splice(0, 5, ...options.emojis);

        // Các kiểm tra loại của từng thuộc tính trong options
        if (typeof options.embed !== 'object') throw new TypeError('EMBED_KHÔNG_HỢP_LỆ: Tùy chọn embed phải là một đối tượng.');
        if (typeof options.embed.title !== 'string') throw new TypeError('EMBED_KHÔNG_HỢP_LỆ: Tiêu đề embed phải là một chuỗi.');
        if (typeof options.embed.color !== 'string') throw new TypeError('EMBED_KHÔNG_HỢP_LỆ: Màu embed phải là một chuỗi.');
        if (typeof options.timeoutTime !== 'number') throw new TypeError('THỜI_GIAN_KHÔNG_HỢP_LỆ: Thời gian chờ phải là một số.');
        if (typeof options.difficulty !== 'number') throw new TypeError('ĐỘ_DÀI_KHÔNG_HỢP_LỆ: Độ khó phải là một số.');
        if (typeof options.buttonStyle !== 'string') throw new TypeError('KIỂU_NÚT_KHÔNG_HỢP_LỆ: Kiểu nút phải là một chuỗi.');
        if (typeof options.winMessage !== 'string') throw new TypeError('TIN_NHẮN_KHÔNG_HỢP_LỆ: Tin nhắn thắng phải là một chuỗi.');
        if (typeof options.loseMessage !== 'string') throw new TypeError('TIN_NHẮN_KHÔNG_HỢP_LỆ: Tin nhắn thua phải là một chuỗi.');

        // Kiểm tra và thiết lập tin nhắn chỉ dành cho người chơi
        if (options.playerOnlyMessage !== false) {
            if (!options.playerOnlyMessage) options.playerOnlyMessage = 'Chỉ có {player} mới có thể sử dụng các nút này.';
            if (typeof options.playerOnlyMessage !== 'string') throw new TypeError('TIN_NHẮN_KHÔNG_HỢP_LỆ: Tin nhắn chỉ dành cho người chơi phải là một chuỗi.');
        }

        super(); // Gọi constructor của lớp events
        this.options = options; // Lưu trữ tùy chọn
        this.message = options.message; // Lưu trữ tin nhắn
        this.length = options.difficulty; // Lưu trữ độ khó
        this.gameBoard = []; // Khởi tạo bảng trò chơi
        this.maxTurns = 0; // Đặt số lượt tối đa ban đầu
        this.turns = 0; // Khởi tạo lượt bắt đầu từ 0

        // Khởi tạo bảng trò chơi với biểu tượng màu ngẫu nhiên
        for (let y = 0; y < this.length; y++) {
            for (let x = 0; x < this.length; x++) {
                this.gameBoard[y * this.length + x] = squares[Math.floor(Math.random() * squares.length)];
            }
        }
        // Thêm log để kiểm tra nội dung bảng trò chơi
        // console.log('Nội dung bảng trò chơi ban đầu:', this.gameBoard);
    }

    // Phương thức để tạo nội dung bảng dưới dạng chuỗi
    getBoardContent() {
        let board = ''; // Biến lưu nội dung bảng
        for (let y = 0; y < this.length; y++) {
            for (let x = 0; x < this.length; x++) {
                board += this.gameBoard[y * this.length + x]; // Thêm biểu tượng vào chuỗi bảng
            }
            board += '\n'; // Xuống dòng sau mỗi hàng
        }
        return board;
    }

    // Gửi tin nhắn, kiểm tra xem đó là slash command hay tin nhắn thường
    async sendMessage(content) {
        if (this.options.isSlashGame) return await this.message.editReply(content); // Nếu là slash, chỉnh sửa trả lời
        else return await this.message.channel.send(content); // Nếu không, gửi tin nhắn mới
    }

    // Bắt đầu trò chơi
    async startGame() {
        // Kiểm tra nếu là slash command và tin nhắn chưa có author, gán lại author từ user
        if (this.options.isSlashGame || !this.message.author) {
            if (!this.message.deferred) await this.message.deferReply().catch(e => {}); // Chờ trả lời nếu chưa defer
            this.message.author = this.message.user;
            this.options.isSlashGame = true;
        }

        // Tính toán số lượt tối đa dựa trên độ dài
        // this.maxTurns = Math.floor((25 * (this.length * 2)) / 26);

        // Tính toán số lượt tối đa dựa trên cấp độ
        if (this.options.difficulty === 5) { // Cấp độ 1
                this.maxTurns = 40; // Số lượt tối đa cho cấp độ 1
            } else if (this.options.difficulty === 10) { // Cấp độ 2
                this.maxTurns = 30; // Số lượt tối đa cho cấp độ 2
            } else if (this.options.difficulty === 13) { // Cấp độ 3
                this.maxTurns = 22; // Số lượt tối đa cho cấp độ 3
            } else {
                this.maxTurns = Math.floor((25 * (this.length * 2)) / 26); // Mặc định nếu không có cấp độ hợp lệ
            }
        
        // console.log("Chiều dài của gameBoard:", this.gameBoard.length)

        // Console log để kiểm tra nội dung bảng trò chơi
    // console.log('Nội dung bảng trò chơi:', this.getBoardContent());

        // Tạo Embed hiển thị nội dung bảng và thông tin lượt
        const embed = new EmbedBuilder()
            .setColor(this.options.embed.color)
            .setTitle(this.options.embed.title)
            .setDescription(this.getBoardContent())
            .addFields({ name: 'Lượt', value: `${this.turns}/${this.maxTurns}` })
            .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) });

        // Tạo các nút biểu tượng màu
        const btn1 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[0]).setCustomId('flood_0');
        const btn2 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[1]).setCustomId('flood_1');
        const btn3 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[2]).setCustomId('flood_2');
        const btn4 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[3]).setCustomId('flood_3');
        const btn5 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[4]).setCustomId('flood_4');
        const btn6 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[5]).setCustomId('flood_5'); // Màu 🟫
        const btn7 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[6]).setCustomId('flood_6'); // Màu 🔳
        const btn8 = new ButtonBuilder().setStyle(this.options.buttonStyle).setEmoji(squares[7]).setCustomId('flood_7'); // Màu ⬛
        const row = new ActionRowBuilder().addComponents(btn1, btn2, btn3, btn4, btn5); // Tạo hàng nút
        const row1 = new ActionRowBuilder().addComponents(btn6, btn7, btn8);

        const msg = await this.sendMessage({ embeds: [embed], components: [row, row1] }); // Gửi tin nhắn với embed và nút

        // Tạo collector để xử lý các tương tác với nút
        const collector = msg.createMessageComponentCollector({ idle: this.options.timeoutTime });

        // Xử lý khi có tương tác với nút
        collector.on('collect', async btn => {
            await btn.deferUpdate().catch(e => {}); // Chờ cập nhật không trả lời công khai
            if (btn.user.id !== this.message.author.id) {
                // Nếu người dùng không phải người chơi ban đầu, gửi tin nhắn riêng
                if (this.options.playerOnlyMessage) btn.followUp({ content: formatMessage(this.options, 'playerOnlyMessage'), ephemeral: true });
                return;
            }

            const update = await this.updateGame(squares[btn.customId.split('_')[1]], msg); // Cập nhật trò chơi khi bấm nút

            if (!update && update !== false) return collector.stop(); // Nếu không có cập nhật, dừng collector
            if (update === false) return; // Trò chơi không cần cập nhật

            // Cập nhật Embed với nội dung bảng mới
            const embed = new EmbedBuilder()
                .setColor(this.options.embed.color)
                .setTitle(this.options.embed.title)
                .setDescription(this.getBoardContent())
                .addFields({ name: 'Lượt', value: `${this.turns}/${this.maxTurns}` })
                .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) });

            return await msg.edit({ embeds: [embed], components: [row, row1] }); // Chỉnh sửa tin nhắn với embed và nút mới
        });

        // Xử lý khi collector hết thời gian
        collector.on('end', (_, reason) => {
            if (reason === 'idle') return this.gameOver(msg, false); // Dừng trò chơi nếu collector idle
        });
    }

    // Kết thúc trò chơi với kết quả thắng/thua
    gameOver(msg, result) {
        const FloodGame = { player: this.message.author, turns: this.turns, maxTurns: this.maxTurns, boardColor: this.gameBoard[0] }; // Lưu thông tin trò chơi
        const GameOverMessage = result ? this.options.winMessage : this.options.loseMessage; // Chọn tin nhắn kết thúc
        this.emit('gameOver', { result: (result ? 'win' : 'lose'), ...FloodGame }); // Phát event kết thúc

        // Tạo Embed kết thúc trò chơi
        const embed = new EmbedBuilder()
            .setColor(this.options.embed.color)
            .setTitle(this.options.embed.title)
            .setDescription(this.getBoardContent())
            .addFields({ name: 'Kết thúc trò chơi', value: GameOverMessage.replace('{turns}', this.turns) })
            .setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) });

        return msg.edit({ embeds: [embed], components: disableButtons(msg.components) }); // Chỉnh sửa tin nhắn với embed kết thúc và vô hiệu hóa nút
    }

    // Cập nhật trò chơi khi người chơi chọn màu
    async updateGame(selected, msg) {
        if (selected === this.gameBoard[0]) return false; // Nếu chọn lại màu cũ, không cập nhật
        const firstBlock = this.gameBoard[0]; // Lưu trữ màu đầu tiên
        const queue = [{ x: 0, y: 0 }]; // Tạo hàng đợi từ ô đầu tiên
        const visited = []; // Tạo mảng lưu các ô đã ghé qua
        this.turns += 1; // Tăng số lượt

        // Duyệt hàng đợi để thay đổi màu các ô
        while (queue.length > 0) {
            const block = queue.shift(); // Lấy ô từ hàng đợi
            if (!block || visited.some(v => v.x === block.x && v.y === block.y)) continue; // Nếu đã ghé qua, bỏ qua
            const index = (block.y * this.length + block.x); // Tính chỉ số ô

            visited.push(block); // Đánh dấu đã ghé qua
            if (this.gameBoard[index] === firstBlock) {
                this.gameBoard[index] = selected; // Đổi màu ô

                // Thêm các ô xung quanh vào hàng đợi nếu chưa ghé qua
                const up = { x: block.x, y: block.y - 1 };
                if (!visited.some(v => v.x === up.x && v.y === up.y) && up.y >= 0) queue.push(up);

                const down = { x: block.x, y: block.y + 1 };
                if (!visited.some(v => v.x === down.x && v.y === down.y) && down.y < this.length) queue.push(down);

                const left = { x: block.x - 1, y: block.y };
                if (!visited.some(v => v.x === left.x && v.y === left.y) && left.x >= 0) queue.push(left);

                const right = { x: block.x + 1, y: block.y };
                if (!visited.some(v => v.x === right.x && v.y === right.y) && right.x < this.length) queue.push(right);
            }
        }

        // Kiểm tra nếu tất cả các ô có cùng màu
        let gameOver = true;
        for (let y = 0; y < this.length; y++) {
            for (let x = 0; x < this.length; x++) {
                if (this.gameBoard[y * this.length + x] !== selected) gameOver = false; // Nếu không giống nhau, chưa kết thúc
            }
        }

        if (this.turns >= this.maxTurns && !gameOver) return void this.gameOver(msg, false); // Nếu hết lượt và chưa kết thúc, thua
        if (gameOver) return void this.gameOver(msg, true); // Nếu tất cả ô có cùng màu, thắng
        return true; // Tiếp tục trò chơi nếu không kết thúc
    }
}
