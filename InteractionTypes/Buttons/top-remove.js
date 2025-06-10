/*
xử lý tương tác với id nút top-remove sẽ xóa tin nhắn trong lệnh /top
*/
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'top-remove',
    description: 'Xóa tin nhắn trong lệnh /top, chỉ người dùng lệnh /top mới được phép xóa.',

    async execute(interaction, client) {

    try {
            if (interaction.message.deletable) {
                // Lấy userId của người tạo lệnh từ customId
                const messageOwnerId = interaction.message.interaction?.user.id;

                // Kiểm tra nếu người nhấn nút không phải là người dùng lệnh /top
                if (interaction.user.id !== messageOwnerId) {
                    await interaction.reply({ 
                        content: '❌ Chỉ người dùng lệnh **/top** mới có thể xóa tin nhắn này!', 
                        ephemeral: true 
                    });
                    return;
                }

                // Xóa tin nhắn
                await interaction.message.delete();
            } else {
                await interaction.reply({ content: 'Không thể xóa tin nhắn này! Bạn cần cấp quyền **Manage Messages (Quản lý tin nhắn)** cho tôi', ephemeral: true });
            }
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
        
    },
};