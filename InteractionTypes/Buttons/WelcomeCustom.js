module.exports = {
    id: 'WelcomeCustom',
    description: 'Nút xác nhận tương tác trong chào mừng tùy chỉnh mà không gửi tin nhắn phản hồi nào.',
    async execute(interaction) {
        await interaction.deferUpdate(); // Xác nhận sự tương tác mà không gửi tin nhắn
    }
}