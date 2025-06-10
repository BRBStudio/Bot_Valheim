const { EmbedBuilder } = require(`discord.js`);
const config = require(`../../config`)
const tienganhTranslationCollector = require(`./translate_tienganh.js`).translationCollector;
const tienganhTranslationEvents = require('./translate_tienganh.js').translationEvents;
const tiengvietTranslationCollector = require('./translate_tiengviet.js').translationCollector;
const tiengvietTranslationEvents = require('./translate_tiengviet.js').translationEvents;

module.exports = {
    id: 'translate_cancel',
    description: 'Nút tạm dừng dịch.',
    async execute(interaction, client) {
        const userId = interaction.user.id;

        let collectorStopped = false;

        // Kiểm tra và dừng collector của `tienganh_translate`
        if (tienganhTranslationCollector.has(userId)) {
            const collector = tienganhTranslationCollector.get(userId);
            collector.stop('translate_cancel');
            tienganhTranslationCollector.delete(userId);
            delete tienganhTranslationEvents[userId];
            collectorStopped = true;
        }

        // Kiểm tra và dừng collector của `tiengviet_translate`
        if (tiengvietTranslationCollector.has(userId)) {
            const collector = tiengvietTranslationCollector.get(userId);
            collector.stop('translate_cancel');
            tiengvietTranslationCollector.delete(userId);
            delete tiengvietTranslationEvents[userId];
            collectorStopped = true;
        }

        // Thông báo hủy bỏ dịch
        if (collectorStopped) {
            const cancelEmbed = new EmbedBuilder()
                .setColor(config.embedRed)
                .setTitle('🚫 Dịch đã bị hủy')
                .setDescription('Việc dịch tin nhắn của bạn đã được hủy bỏ.')
                .setTimestamp()
                .setFooter({ text: `Chúc bạn 1 ngày tốt lành tại ***${interaction.guild.name}***` });

            await interaction.reply({ embeds: [cancelEmbed], ephemeral: true });
        } else {
            // Nếu không có sự kiện dịch, thông báo rằng không có gì để hủy bỏ
            await interaction.reply({
                content: 'Không có quá trình dịch nào để hủy.',
                ephemeral: true,
            });
        }
    },
};
