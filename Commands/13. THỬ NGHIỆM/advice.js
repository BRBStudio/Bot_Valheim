const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advice')
        .setDescription('Nhận một lời khuyên ngẫu nhiên.'),

    guildSpecific: true,
    guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`],
    
    async execute(interaction, client) {
        try {
            // Tìm nạp nút nhập động Dynamic import node-fetch
            const fetch = (await import('node-fetch')).default;
            
            const response = await fetch("https://api.adviceslip.com/advice");

            if (!response.ok) throw new Error(`Lỗi HTTP! trạng thái: ${response.status}`); // HTTP error! status:
            
            const data = await response.json();
            
            if (!data.slip || !data.slip.advice) throw new Error('Định dạng phản hồi API không hợp lệ'); // Invalid API response format
            
            // Translate the advice to Vietnamese
            const translation = await translate(data.slip.advice, { to: 'vi' });
            
            const embed = new EmbedBuilder()
                .setTimestamp()
                .setThumbnail(client.user.avatarURL())
                .setAuthor({ name: `Hệ thống cộng đồng` })
                .setTitle(`${client.user.username} Lời khuyên ngẫu nhiên`)
                .setDescription('> Đây là lời khuyên ngẫu nhiên của bạn:')
                .addFields({ name: 'Khuyên bảo', value: `> ${translation.text}` })
                .setColor('Red')
                .setFooter({ text: 'Lời khuyên được đưa ra' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Lỗi tìm nạp hoặc dịch lời khuyên:', error);
            await interaction.reply('Rất tiếc, đã xảy ra lỗi khi tìm nạp hoặc dịch lời khuyên. Vui lòng thử lại sau.'); // Error fetching or translating advice
        }
    }
};
