const ksModel = require('../schemas/ksSchema');

class KhaoSatBRB_Studio {
    constructor() {
        this.config = {
            customQuestions: [] // Danh sách các câu hỏi tùy chỉnh
        };
        this.queue = []; // Hàng đợi người chơi
        this.results = {}; // Để lưu trữ kết quả của người chơi
    }

    // Phương thức để bắt đầu hàng đợi và khảo sát
    async startQueue(msg) {
        if (this.config.customQuestions.length === 0) {
            return msg.channel.send('Không có câu hỏi nào được định cấu hình!');
        }

        // Kiểm tra tồn tại của `msg.author` trước khi thêm vào khảo sát
        if (msg.author && msg.author.id) {
            this.queue.push(msg.author.id); // Thêm người chơi vào khảo sát
            this.results[msg.author.id] = { correctAnswers: 0, answers: [] }; // Khởi tạo kết quả cho người chơi

            // Tạo một đối tượng mới để lưu dữ liệu khảo sát
            const surveyData = new ksModel({
                GuildName: msg.guild.name,
                Guild: msg.guild.id,
                displayName: msg.author.displayName,
                User: msg.author.id,
                questions: this.config.customQuestions.map(q => ({
                    question: q.value, // Lưu câu hỏi
                    answer: null, // Chưa có câu trả lời ở đây
                    status: null // Trạng thái (đúng/sai)
                })), // Chuyển đổi câu hỏi thành đối tượng với câu hỏi, câu trả lời và trạng thái
                score: 0, // Điểm khởi đầu
                correctAnswers: 0 // Số câu trả lời đúng khởi đầu
            });

            // Lưu dữ liệu khảo sát vào MongoDB
            await surveyData.save();

            msg.channel.send('Chào mừng bạn đến với khảo sát về Bot BRB Studio! Hãy trả lời 10 câu hỏi sau để giúp chúng tôi cải thiện bot.');

            // Lấy câu hỏi đầu tiên
            this.askQuestion(msg, 0, surveyData); // Truyền dữ liệu khảo sát vào phương thức
        } else {
            msg.channel.send('Lỗi: Không thể xác định người dùng. Vui lòng thử lại.');
        }
    }

    // Phương thức để đặt câu hỏi cho người chơi
    async askQuestion(msg, questionIndex, surveyData) {
        if (questionIndex >= this.config.customQuestions.length) {
            // Sau khi hoàn thành tất cả câu hỏi, hiển thị kết quả
            const userId = msg.author.id;
            const resultMessage = this.generateResultMessage(userId);
            msg.channel.send(resultMessage); // Gửi thông báo kết quả cho người chơi
            
            // Cập nhật dữ liệu khảo sát với điểm và số câu trả lời đúng
            surveyData.score = (this.results[userId].correctAnswers / this.config.customQuestions.length) * 100;
            surveyData.correctAnswers = this.results[userId].correctAnswers;
            await surveyData.save(); // Lưu cập nhật vào MongoDB
            return;
        }

        const question = this.config.customQuestions[questionIndex];
        msg.channel.send(`Câu hỏi: ${question.value}\nThể loại: ${question.category}\nMức độ: ${question.difficulty}`);

        // Lắng nghe câu trả lời và chuyển sang câu hỏi tiếp theo
        const filter = response => response.author.id === msg.author.id;
        msg.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                const answer = collected.first().content.toLowerCase();
                const correctAnswer = question.correctAnswer.toLowerCase();

                // Lưu câu trả lời vào đối tượng khảo sát
                surveyData.questions[questionIndex].answer = answer; // Cập nhật câu trả lời cho câu hỏi hiện tại

                if (answer === correctAnswer) {
                    msg.channel.send('Chính xác!');
                    this.results[msg.author.id].correctAnswers++; // Tăng số câu trả lời đúng
                    surveyData.questions[questionIndex].status = 'Đúng'; // Cập nhật trạng thái câu trả lời
                } else {
                    msg.channel.send(`Sai! Câu trả lời đúng là: ${question.correctAnswer}`);
                    surveyData.questions[questionIndex].status = 'Sai'; // Cập nhật trạng thái câu trả lời
                }

                // Gọi lại phương thức với câu hỏi tiếp theo
                this.askQuestion(msg, questionIndex + 1, surveyData);
            })
            .catch(() => {
                msg.channel.send('Hết giờ rồi!');
                // Gọi lại phương thức với câu hỏi tiếp theo, không tăng số câu trả lời đúng
                this.askQuestion(msg, questionIndex + 1, surveyData);
            });
    }

    // Tạo thông điệp kết quả cho người chơi
    generateResultMessage(userId) {
        const correctAnswers = this.results[userId].correctAnswers;
        const totalQuestions = this.config.customQuestions.length;
        const scorePercentage = (correctAnswers / totalQuestions) * 100;

        return `Khảo sát đã kết thúc! Bạn đã trả lời đúng ${correctAnswers} trên tổng số ${totalQuestions} câu hỏi.\n` +
               `Điểm của bạn là: ${scorePercentage.toFixed(2)}%`;
    }
}

module.exports = KhaoSatBRB_Studio;
