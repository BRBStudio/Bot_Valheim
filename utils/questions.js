// Định nghĩa lớp BooleanQuestion
class BooleanQuestion {
    constructor() {
        this.value = "";        // Nội dung câu hỏi
        this.category = "";     // Danh mục của câu hỏi
        this.difficulty = "";   // Độ khó của câu hỏi
        this.correctAnswer = ""; // Câu trả lời đúng (true hoặc false)
    }

    // Thiết lập nội dung câu hỏi
    setValue(value) {
        this.value = value;
        return this;
    }

    // Thiết lập danh mục câu hỏi
    setCategory(category) {
        this.category = category;
        return this;
    }

    // Thiết lập độ khó của câu hỏi
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        return this;
    }

    // Thiết lập câu trả lời đúng
    setCorrectAnswer(answer) {
        this.correctAnswer = answer;
        return this;
    }
}

// Định nghĩa lớp MultipleChoiceQuestion
class MultipleChoiceQuestion {
    constructor() {
        this.value = "";                // Nội dung câu hỏi
        this.category = "";             // Danh mục câu hỏi
        this.difficulty = "";           // Độ khó của câu hỏi
        this.correctAnswer = "";        // Câu trả lời đúng
        this.incorrectAnswers = [];     // Danh sách câu trả lời sai
    }

    // Thiết lập nội dung câu hỏi
    setValue(value) {
        this.value = value;
        return this;
    }

    // Thiết lập danh mục câu hỏi
    setCategory(category) {
        this.category = category;
        return this;
    }

    // Thiết lập độ khó câu hỏi
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        return this;
    }

    // Thiết lập câu trả lời đúng
    setCorrectAnswer(answer) {
        this.correctAnswer = answer;
        return this;
    }

    // Thiết lập danh sách câu trả lời sai
    setIncorrectAnswers(answers) {
        this.incorrectAnswers = answers;
        return this;
    }
}

// Xuất các lớp để sử dụng trong file khác
module.exports = {
    BooleanQuestion,
    MultipleChoiceQuestion
};
