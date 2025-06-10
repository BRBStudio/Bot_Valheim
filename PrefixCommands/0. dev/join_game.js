const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const joingameModel = require('../../schemas/joingameSchema.js');
const CommandStatus = require('../../schemas/Command_Status.js');
const config = require('../../config.js');

/*
Hiển thị danh sách trò chơi từ tất cả các máy chủ
*/

module.exports = {
    name: 'join_game',
    description: `\`🔸 LỆNH DÀNH CHO DEV\``,
    hd: `\`🔸 Cách dùng: Không có thông tin\``,
    q: `\`🔸 Dành cho DEV\``, // ?join_game list-sv - Hiển thị danh sách trò chơi từ tất cả các máy chủ
                
    aliases: ['jg', 'tv5'],

    async execute(msg) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?joingame' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Kiểm tra nếu người dùng có quyền đặc biệt
        if (!config.specialUsers.includes(msg.author.id)) {
            return msg.channel.send({ content: config.Dev1 }); // Thông báo nếu người dùng không có quyền
        }

         // Truy xuất dữ liệu tất cả các trò chơi từ MongoDB
        const allGames = await joingameModel.find(); // Lấy tất cả bản ghi trong schema

        if (allGames.length === 0) {
            return msg.channel.send({ content: 'Hiện tại không có trò chơi nào được tạo trên bất kỳ máy chủ nào.' });
        }

        // Duyệt qua tất cả các máy chủ và tạo danh sách các trò chơi
        const gameDetails = allGames.map((gameData, index) => {
            // Tạo danh sách những người đã tham gia
            const participantList = gameData.Listjoin.length > 0 
                // ? gameData.Listjoin.map((user, idx) => `${idx + 1}. ${user.displayName} (ID: ${user.userId})`).join('\n')
                ? gameData.Listjoin.map((user, idx) => `${idx + 1}. ${user.displayName} (ID: ${user.userId}) - Tham gia lúc: ${user.formattedTime}`).join('\n')
                : 'Chưa có ai tham gia';

                return `**${index + 1}. Máy chủ:** ${gameData.guildName.toUpperCase()} (ID: ${gameData.guildId})\n` +
                `**Tiêu đề trò chơi:** ${gameData.title}\n` +
                `**Người khởi tạo:** ${gameData.displayName} (ID: ${gameData.userId})\n` +
                `**Thời gian khởi tạo ds tham gia:** ${gameData.time.replace(/(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/, '$1:$2:$3 ngày $4/$5/$6')}\n` +
                `**Số người đã tham gia:** ${gameData.totalUsers}/${gameData.maxUsers}\n` +
                `**Danh sách người tham gia:**\n\`${participantList}\`\n`;
        }).join('\n\n'); // Tạo danh sách và ngắt dòng giữa các máy chủ

        // Tạo embed hiển thị thông tin của tất cả các trò chơi
        const embed = new EmbedBuilder()
            .setColor('Red') // Màu sắc của embed
            .setTitle('DANH SÁCH TRÒ CHƠI TỪ TẤT CẢ CÁC MÁY CHỦ')
            .setDescription(gameDetails.length > 0 ? gameDetails : 'Không có trò chơi nào được tìm thấy.');

        // Gửi embed chứa danh sách trò chơi từ tất cả các máy chủ
        return msg.channel.send({ embeds: [embed] });
    },
};

