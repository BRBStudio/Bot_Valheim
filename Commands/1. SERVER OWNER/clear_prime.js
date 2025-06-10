const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const interactionError = require('../../Events/WebhookError/interactionError');
const { checkOwner } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear_prime")
        .setDescription("🔹 Xóa tất cả tin nhắn trong kênh")
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Số lượng tin nhắn cần xóa')
                .setRequired(true)),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/clear_prime' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const hasPermission = await checkOwner(interaction);
        if (!hasPermission) return;

        // Lấy kênh và khởi tạo bộ đếm cho các tin nhắn đã xóa
        const channel = interaction.channel;
        const amount = interaction.options.getInteger('amount');

        // Kiểm tra nếu amount vượt quá 100
        if (amount > 100) {
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription('```Bạn chỉ có thể xóa tối đa 100 tin nhắn một lần.```');

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        // Gửi phản hồi tạm thời với nội dung ban đầu
        await interaction.reply({ content: 'Tôi đang xóa, hãy chờ chút.', ephemeral: true });

        // Hiệu ứng dấu chấm `...`
        let repeatCount = 1;
        const interval = setInterval(async () => {
            repeatCount = (repeatCount % 3) + 1;
            const repeat = '.'.repeat(repeatCount);
            await interaction.editReply({ content: `Tôi đang xóa, hãy chờ chút${repeat}` });
        }, 1000);
        
        let deletedSize = 0;

        try {
            // Lấy tất cả tin nhắn và xóa chúng một cách đơn lẻ
            const fetchedMessages = await channel.messages.fetch({ limit: amount });
            await Promise.all(fetchedMessages.map(async (message) => {
                await message.delete();
                deletedSize++;
            }));
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }

        // Sau khi hoàn tất xóa, dừng hiệu ứng dấu chấm và gửi thông báo hoàn tất
        clearInterval(interval);
        await interaction.editReply({
            content: `Đã xóa thành công **${deletedSize}** tin nhắn trong kênh này.`,
        });
    },
};

