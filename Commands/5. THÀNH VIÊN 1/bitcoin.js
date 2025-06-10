const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bitcoin')
        .setDescription('🔹 Xem giá trị Bitcoin hoặc chuyển đổi Bitcoin sang tiền tệ')
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('Số lượng Bitcoin bạn muốn chuyển đổi')
                .setRequired(false)),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/bitcoin' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Lấy số lượng Bitcoin (mặc định là 1 nếu không có đầu vào)
        const amount = interaction.options.getNumber('amount') || 1;

        // Sử dụng cú pháp import() động để tải node-fetch
        const fetch = await import('node-fetch').then(mod => mod.default);

        // Fetch dữ liệu từ blockchain.info
        let res = await fetch(encodeURI('https://blockchain.info/ticker'));
        let body = await res.json();

        // Các loại tiền tệ cần chuyển đổi
        let types = {
            'usd': 'en-US',
            'cad': 'en-CA',
            'cny': 'en-CN',
            'jpy': 'en-JP',
            'hkd': 'en-HK',
            'rub': 'en-RU'
        };

        // Tỷ giá hối đoái USD sang VND (giả định là 1 USD = 24,000 VND)
        const exchangeRateVND = 24000;

        // Tạo embed để hiển thị kết quả
        let embed = new EmbedBuilder()
            .setTitle(`Chuyển đổi ${amount} Bitcoin`)
            .setColor('Green')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        // Duyệt qua từng loại tiền tệ và thêm vào embed
        for (let k in types) {
            let upK = k.toUpperCase();
            let format = new Intl.NumberFormat(types[k], {
                style: 'currency',
                currency: upK
            }).format(body[upK].last * amount);
            
            embed.addFields({ name: `Giá cả ${upK}`, value: `💰 ${format}`, inline: true });
        }

        // Tính giá trị Bitcoin sang VND
        let bitcoinToUSD = body['USD'].last * amount; // Giá Bitcoin theo USD
        let bitcoinToVND = bitcoinToUSD * exchangeRateVND; // Chuyển từ USD sang VND

        // Định dạng giá trị VND và thêm vào embed
        let formatVND = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(bitcoinToVND);
        
        embed.addFields({ name: 'Giá cả VND', value: `💰 ${formatVND}`, inline: true });

        // Gửi kết quả trả lời cho người dùng
        await interaction.reply({ embeds: [embed] });
    }
};




