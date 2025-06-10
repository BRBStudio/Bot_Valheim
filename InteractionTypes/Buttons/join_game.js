const {EmbedBuilder} = require('discord.js');
const interactionError = require('../../Events/WebhookError/interactionError');
const joingameModel = require('../../schemas/joingameSchema');

module.exports = {
    id: 'join_game', // id nút
    description: 'Nút để người dùng tham gia đăng ký vào trò chơi đang diễn ra trong máy chủ',

    async execute(interaction, client) {
        try {
            const customId = interaction.customId; // Lấy customId từ interaction
            const gameChoice = customId.split('_')[2]; // Trích xuất tên trò chơi từ customId .slice(2).join('_')
            const creatorId = customId.split('_')[3]; // Lấy userId của người tạo danh sách

            // Tiếp tục xử lý như trước, nhưng bây giờ bạn có thể sử dụng gameChoice để xác định trò chơi cụ thể
            const guildId = interaction.guild.id;
            const userId = interaction.user.id;
            const displayName = interaction.member.displayName;

            const currentTime = new Date();
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Ho_Chi_Minh'
            };
            const formattedTime = currentTime.toLocaleString('vi-VN', options);

            // Tìm kiếm tài liệu trong MongoDB dựa trên guildId và gameChoice
            const gameData = await joingameModel.findOne({ guildId, title: gameChoice, userId: creatorId });

            if (!gameData) {
                return interaction.reply({ content: `Không tìm thấy trò chơi "${gameChoice}" trong máy chủ này.`, ephemeral: true });
            }

            // Kiểm tra số lượng người tham gia đã đạt giới hạn chưa
            if (gameData.totalUsers >= gameData.maxUsers) {
                return interaction.reply({ content: `Trò chơi "${gameChoice}" đã đạt giới hạn người tham gia (${gameData.maxUsers}).`, ephemeral: true });
            }

            // Kiểm tra nếu người dùng đã tham gia rồi
            if (gameData.Listjoin.some(user => user.userId === userId)) {
                return interaction.reply({ content: `Bạn đã tham gia trò chơi "${gameChoice}" rồi!`, ephemeral: true });
            }

            // Thêm người dùng vào danh sách tham gia
            gameData.Listjoin.push({ userId, displayName, formattedTime });
            gameData.totalUsers += 1;

            // Lưu cập nhật vào MongoDB
            await gameData.save();

            // Cập nhật lại thông tin số người tham gia
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Tạo danh sách đội ${gameChoice}`)
                .setDescription(`Nhấp vào nút bên dưới để tham gia đội của ${gameData.displayName}.`)
                .addFields(
                    {
                        name: 'Số người đã đăng kí',
                        value: `${gameData.totalUsers}/${gameData.maxUsers}`,
                        inline: true
                    }
                )
                .setFooter({ text: `Tạo bởi ${gameData.displayName}` });

            await interaction.update({ embeds: [embed] });

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};