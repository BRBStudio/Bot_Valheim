const { SelectMenuInteraction } = require('discord.js');

module.exports = {
    name: "interactionCreate", // Tên sự kiện mà module này sẽ xử lý

    execute(interaction, client) {
        // Kiểm tra xem tương tác có phải là tương tác lựa chọn menu không
        if (!interaction.isStringSelectMenu()) return;

        try {
            const customId = interaction.customId;

            // Danh sách Id select menu cần loại trừ của lệnh bot-conmands.js
            const BotConmandsButtons = ['slash-category-select', 'prefix-category-select'];

            // Danh sách Id select menu cần loại trừ của lệnh help-valheim.js
            const HelpValheimButtons = ['select'];

            // Danh sách Id select menu cần loại trừ của lệnh sup.js
            const InviteButtons = ['invite-menu'];

            // Danh sách Id select menu cần loại trừ của lệnh help-valheim.js
            const devButtons = ['dev'];

            const a = [`top-select-menu`]

            // Nếu customId là một trong các select menu cần loại trừ, không xử lý
            if (a.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các select menu cần loại trừ, không xử lý
            if (devButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các select menu cần loại trừ, không xử lý
            if (InviteButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            if (BotConmandsButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các select menu cần loại trừ, không xử lý
            if (HelpValheimButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Loại trừ nếu customId là interaction.user.id của lệnh
            if (customId === interaction.user.id) {
                return; // Không làm gì cả
            }

            // Lấy lệnh từ client.selectMenus bằng customId
            const selectMenu = client.selectMenus.get(customId);

            // Nếu không tìm thấy lệnh, trả lời rằng lựa chọn menu không xác định
            if (!selectMenu) {  
                interaction.reply({ content: "Danh sách lựa chọn không xác định", ephemeral: true });
                return;
            }

            // Thực thi lệnh lựa chọn menu
            selectMenu.execute(interaction, client);
        } catch (error) {
            console.error('Lỗi khi xử lý interaction:', error);
            interaction.reply({ content: "Đã xảy ra lỗi khi xử lý select menu. Vui lòng thử lại sau.", ephemeral: true });
        }
    },
};
