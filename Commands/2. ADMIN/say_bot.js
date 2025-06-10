const { SlashCommandBuilder } = require("discord.js");
const { sayModal } = require("../../ButtonPlace/Modals"); // Import modal từ mod.js
const { checkAdministrator } = require(`../../permissionCheck`);
const CommandStatus = require('../../schemas/Command_Status');
const config = require(`../../config`)

/*
nếu thay đổi thì thay cả mã interactionModals.js
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say_bot")
        .setDescription("🔹 Gửi tin nhắn qua bot")
        .addChannelOption(options => 
            options.setName("channel").setDescription("Kênh bạn muốn gửi tin nhắn").setRequired(false)
        ),

    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/say_bot' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const QBD = config.specialUsers.includes(interaction.user.id);
        
        // Nếu không phải người dùng đặc biệt thì kiểm tra quyền admin
        if (!QBD) {
            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;
        }

        let channel = interaction.options.getChannel("channel");

        // Nếu không có kênh nào được chọn, sử dụng kênh hiện tại
        if (!channel) { 
            channel = interaction.channel;
        }

        // Gửi thông tin kênh vào modal, truyền kênh qua customId
        const modal = sayModal(channel.id); // Truyền ID của kênh vào modal
        await interaction.showModal(modal);
    },
};










// const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
// const { sayModal } = require("../../ButtonPlace/Modals"); // Import modal từ mod.js
// const { checkAdministrator } = require(`../../permissionCheck`)
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("say_bot")
//         .setDescription("Gửi tin nhắn qua bot")
//         .addChannelOption(options => options.setName("channel").setDescription("Kênh bạn muốn gửi tin nhắn").setRequired(false)),

//     async execute(interaction, client) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/say_bot' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         const hasPermission = await checkAdministrator(interaction);
//         if (!hasPermission) return;
   
//         let channel = interaction.options.getChannel("channel");

//         // Nếu không có kênh nào được chọn, sử dụng kênh hiện tại
//         if (!channel) { 
//             channel = interaction.channel;
//         }

//         // Gửi thông tin kênh vào modal
//         await interaction.showModal(sayModal(channel));  // Truyền kênh vào modal
//     },
// };