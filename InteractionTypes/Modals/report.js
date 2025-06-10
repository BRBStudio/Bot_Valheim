const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    id: 'report',
    async execute(interaction) {

        // Kiểm tra trạng thái Modal
        const commandStatus = await CommandStatus.findOne({ command: 'report' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện Modal
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Modal này đã bị tắt, vui lòng thử lại sau.');
        }

        try {
            // Truy cập thông tin từ modal đã gửi trực tiếp
            let message = interaction.fields.getTextInputValue('report');
            let embedReport = interaction.fields.getTextInputValue('embed');
            let userId = interaction.fields.getTextInputValue('userId'); // Lấy user ID từ modal

            let user = await interaction.guild.members.fetch(userId); // Lấy thông tin thành viên từ ID

            const embed = new EmbedBuilder()
                .setAuthor({ name: `THÔNG BÁO VỀ VIỆC TỐ CÁO` })
                .setDescription(`${interaction.user} **đã tố cáo** ${user}\n > **Lý do tố cáo:** \n ${message}`)
                .setColor('Blue')
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL())
                .setImage('https://img-new.cgtrader.com/items/4238995/5de24ba7b2/large/tax-report-3d-icon-3d-model-5de24ba7b2.jpg')
                .setFooter({ text: `tố cáo đã được gửi tới [valheim Survival]` });

            const channel = interaction.client.channels.cache.get('1311396635837861888');

            if (!channel) {
                await interaction.reply({ content: "Không thể tìm thấy kênh để gửi tố cáo.", ephemeral: true });
                return;
            }

            if (embedReport.toLowerCase() === "on") {
                await channel.send({ embeds: [embed] });
            } else {
                await channel.send({ content: `${interaction.user} **đã tố cáo** ${user}\n > **Lý do tố cáo:** \n ${message}` });
            }

            await interaction.reply({ content: "Tố cáo của bạn đã được gửi thành công", ephemeral: true });
        } catch (error) {
            if (error.message.includes('Collector không nhận được tương tác nào trước khi kết thúc với lý do: thời gian')) {
                await interaction.followUp({ content: "Bạn đã không gửi tố cáo trong thời gian cho phép.", ephemeral: true });
            } else if (error.message.includes('Interaction has already been acknowledged')) {
                console.error("Đã cố gắng trả lời tương tác đã được trả lời");
            } else {
                console.error(error);
                if (!interaction.replied) {
                    await interaction.followUp({ content: "Đã xảy ra lỗi khi gửi tố cáo của bạn.", ephemeral: true });
                }
            }
        }
    }
};
