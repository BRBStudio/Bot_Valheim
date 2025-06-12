module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        // Kiểm tra nếu interaction là message context menu hoặc user context menu
        if (!interaction.isMessageContextMenuCommand() && !interaction.isUserContextMenuCommand()) return;

        try {
            const commandName = interaction.commandName;
            // console.log(`📩 Nhận lệnh context menu: ${commandName}`);

            // Lấy lệnh từ client.contextMenus
            const contextMenu = client.contextMenus.get(commandName);
            if (!contextMenu) {
                // console.error(`❌ Lệnh context menu không xác định: ${commandName}`);
                return interaction.reply({ content: '❌ Context Menu không xác định.', ephemeral: true });
            }

            // Kiểm tra lệnh là loại nào để gọi execute đúng tham số
            if (interaction.isMessageContextMenuCommand()) {
                await contextMenu.execute(interaction, interaction.targetMessage); // Truyền tin nhắn mục tiêu
            } else if (interaction.isUserContextMenuCommand()) {
                await contextMenu.execute(interaction, interaction.targetUser); // Truyền người dùng mục tiêu
            }
        } catch (error) {
            // console.error('❌ Lỗi khi xử lý interaction:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: '⚠ Đã xảy ra lỗi khi xử lý. Bot cần có mặt trong máy chủ này và có quyền ***ADMIN*** để hoạt động đầy đủ các chức năng, vui lòng thử lại sau hoặc liên hệ với NPT ( dùng lệnh /dev để xem chi tiết ).', ephemeral: true });
            }
        }
    },
};



// const { ApplicationCommandType } = require('discord.js');

// module.exports = {
//     name: 'interactionCreate', // Tên sự kiện mà module này sẽ xử lý

//     async execute(interaction, client) {
//         // Kiểm tra xem tương tác có phải là một lệnh ngữ cảnh người dùng hoặc ngữ cảnh tin nhắn không
//         if (!interaction.isUserContextMenuCommand() || !interaction.isMessageContextMenuCommand()) return; // && !interaction.isMessageContextMenuCommand()


//         try {
//             // Lấy tên lệnh từ interaction
//             const commandName = interaction.commandName;
//             // console.log(`Nhận lệnh context menu: ${commandName}`);

//             // Lấy lệnh từ client.contextMenus bằng commandName
//             const contextMenu = client.contextMenus.get(commandName);

//             // Nếu không tìm thấy lệnh, trả lời rằng context menu không xác định
//             if (!contextMenu) {
//                 console.log(`Lệnh context menu không xác định: ${commandName}`);
//                 await interaction.reply({ content: 'Context Menu không xác định', ephemeral: true });
//                 return;
//             }

//             // Thực thi lệnh context menu
//             // console.log(`Lệnh context menu: ${commandName} đã được xử lý.`);
//             await contextMenu.execute(interaction, client);
//         } catch (error) {
//             console.error('Lỗi khi xử lý interaction:', error);
//             await interaction.reply({ content: 'Đã xảy ra lỗi khi xử lý. Vui lòng thử lại sau hoặc liên hệ với DEV', ephemeral: true });
//         }
//     },
// };
