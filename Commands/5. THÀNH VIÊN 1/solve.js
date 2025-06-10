// const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('solve')
//         .setDescription('Khóa chủ đề trên diễn đàn'),
//     async execute(interaction) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/solve' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         // Lấy ID kênh của interaction
//         const threadID = interaction.channelId;

//         try {
//             // Lấy kênh từ ID và khóa kênh
//             const channel = await interaction.guild.channels.fetch(threadID);
//             // await channel.delete();

//             // Kiểm tra xem ID thread có phải là do người dùng viết hay không
//             if (channel.isThread() && channel.ownerId !== interaction.user.id) {
//                 return interaction.reply(`\`\`\`yml\nBạn không phải là tác giả của bài viết này!\`\`\``);
//             }

//             await channel.setLocked(true);
//             // console.log("Kênh đã được khóa thành công.");
                       
//             await interaction.reply(`\`\`\`yml\nChủ đề trên diễn đàn đã được khóa thành công. Để mở lại liên hệ với ☎ Admin ☎\`\`\``);
            

//         } catch (error) {
//             // console.error('Đã xảy ra lỗi khi khóa chủ đề:', error);
//             await interaction.reply(`\`\`\`yml\n/solve chỉ dùng được trên bài viết diễn đàn\`\`\``);
//         }
//     },
// };


const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('solve')
        .setDescription('🔹 Khóa chủ đề trên diễn đàn'),
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/solve' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Lấy ID kênh của interaction
        const threadID = interaction.channelId;

        try {
            // Lấy kênh từ ID và khóa kênh
            const channel = await interaction.guild.channels.fetch(threadID);
            // await channel.delete();

            // Kiểm tra xem ID thread có phải là do người dùng viết hay không
            if (channel.isThread() && channel.ownerId !== interaction.user.id) {
                return interaction.reply(`\`\`\`yml\nBạn không phải là tác giả của bài viết này!\`\`\``);
            }

            // await channel.setLocked(true);
            // console.log("Kênh đã được khóa thành công.");
                       
            // await interaction.reply(`\`\`\`yml\nChủ đề trên diễn đàn đã được khóa thành công. Để mở lại liên hệ với ☎ Admin ☎\`\`\``);

            // Gửi thông báo chờ trước khi khóa
            await interaction.reply(`\`\`\`yml\n
Chủ đề này đã được đánh dấu là đã giải quyết.
                
Hãy chắc chắn gửi lời cảm ơn đến người giúp đỡ của chúng tôi! /tks
                
Bài viết này sẽ bị đóng lại sau vài phút nữa...
Vẫn cần giúp đỡ? Mở một bài viết mới!
                    \`\`\``);


            setTimeout(async () => {
                try {
                    // Khóa thread sau 1 phút
                    await channel.setLocked(true);
                    await channel.setArchived(true);
                } catch (error) {
                    console.error('Đã xảy ra lỗi khi khóa kênh:', error);
                }
            }, 60000);
            

        } catch (error) {
            // console.error('Đã xảy ra lỗi khi khóa chủ đề:', error);
            await interaction.reply(`\`\`\`yml\n/solve chỉ dùng được trên bài viết diễn đàn\`\`\``);
        }
    },
};