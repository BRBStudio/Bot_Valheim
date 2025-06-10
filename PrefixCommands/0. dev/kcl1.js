const { EmbedBuilder } = require('discord.js');
const EconomySystem = require('../../schemas/economySystem');
const FishingRod = require('../../schemas/FishingRodSchema');
const moment = require('moment-timezone');

/*
THUÊ cần câu
*/

module.exports = {
    name: 'FishingRod',
    description: `\`🔸 LỆNH DÀNH CHO DEV\``, // Thuê cần câu
    hd: `\`🔸 Cách dùng: Không có thông tin\``,
    q: `\`🔸 Dành cho DEV\``,
    aliases: ['mcc'],

    /*
    ?FishingRod rainbow 3
    ?FishingRod whiteshark 5
    */

    // Lệnh giúp đỡ
    async help(msg) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('HƯỚNG DẪN MUA CẦN CÂU')
            .setDescription(
                `Có 3 loại cần câu là:\n` +
                `- Cần câu **RainBow**\n` +
                `- Cần câu **WhiteShark**\n` +
                `- Cần câu **DragonWrath**`
            )
            .addFields(
                { 
                    name: 'Cách Mua', 
                    value: `\`\`\`FishingRod <tên cần câu> <số lượng cần mua>\`\`\``, 
                    inline: false 
                },

                { 
                    name: '\u200b', 
                    value: `\u200b`, 
                    inline: false 
                },

                { 
                    name: 'Bảng Giá', 
                    value: `\u200b`, 
                    inline: false 
                },
                
                { 
                    name: 'Cần câu **RainBow** ( 3 lượt dùng )', 
                    value: `10000 <a:xu:1320563128848744548>`, 
                    inline: false 
                },

                { 
                    name: 'Cần câu **WhiteShark** ( 7 lượt dùng )', 
                    value: `30000 <a:xu:1320563128848744548>`, 
                    inline: false 
                },

                { 
                    name: 'Cần câu **DragonWrath** ( 18 lượt dùng )', 
                    value: `70000 <a:xu:1320563128848744548>`, 
                    inline: false 
                }
            )
            .setFooter({ text: 'Cảm ơn bạn đã sử dụng lệnh!' })
            .setTimestamp();

        msg.channel.send({ embeds: [embed] });
    },

    async execute(msg, args) {
        try {

            if (args[0] === 'help' || args.length === 0) {
                return this.help(msg); // Hiển thị hướng dẫn nếu có lệnh help
            }

            // Kiểm tra xem người dùng đã nhập đủ tham số
            if (args.length < 2) {
                return msg.channel.send('Bạn cần nhập tên cần câu và số lượng (ví dụ: `FishingRod rainbow 3`).');
            }

            const rodName = args[0].toLowerCase(); // Tên cần câu (chuyển về chữ thường để dễ so sánh)
            const quantity = parseInt(args[1]); // Số lượng mua

            // Kiểm tra số lượng hợp lệ
            if (isNaN(quantity) || quantity <= 0) {
                return msg.channel.send('Số lượng phải là một số lớn hơn 0.');
            }

            // Các loại cần câu và giá tương ứng
            const rodPrices = {
                RainBow: 5000,
                WhiteShark: 30000,
                DragonWrath: 70000
            };

            // Kiểm tra loại cần câu có hợp lệ không
            if (!rodPrices[rodName]) {
                return msg.channel.send('Loại cần câu không hợp lệ! Loại cần câu bạn có thể mua: **RainBow**, **WhiteShark**, **DragonWrath**.');
            }

            const pricePerRod = rodPrices[rodName]; // Giá của 1 cần câu
            const totalPrice = pricePerRod * quantity; // Tổng giá tiền

            // Lấy thông tin từ MongoDB EconomySystem
            const economyData = await EconomySystem.findOne({ Guild: msg.guild.id, User: msg.author.id });

            if (!economyData) {
                return msg.channel.send('Bạn chưa tham gia hệ thống kinh tế. Vui lòng tham gia trước khi mua.');
            }

            // Kiểm tra người dùng có đủ tiền không
            if (economyData.Wallet < totalPrice) {
                return msg.channel.send('Bạn không có đủ <a:xu:1320563128848744548> để mua số lượng này.');
            }

            // Lưu thông tin vào MongoDB FishingRodSchema
            const currentTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');  // Lấy thời gian hiện tại theo múi giờ VN

            const newFishingRod = new FishingRod({
                guildName: msg.guild.name,
                guildId: msg.guild.id,
                displayName: msg.member.displayName,
                userId: msg.author.id,
                rodName: rodName,
                quantity: quantity,
                purchaseTime: currentTime,
                totalPrice: totalPrice
            });

            await newFishingRod.save();  // Lưu vào cơ sở dữ liệu MongoDB

            // Trừ tiền vào Wallet của người dùng
            economyData.Wallet -= totalPrice;
            await economyData.save();

            // Gửi thông báo cho người dùng
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Mua Cần Câu Thành Công')
                .addFields(
                    { name: 'Người Mua', value: msg.member.displayName, inline: true },
                    { name: 'Tên Cần Câu', value: rodName, inline: true },
                    { name: 'Số Lượng', value: quantity.toString(), inline: true },
                    { name: 'Tổng Giá Tiền', value: `${totalPrice} <a:xu:1320563128848744548>`, inline: true },
                    { name: 'Thời Gian Mua', value: currentTime, inline: false }
                )
                .setFooter({ text: 'Cảm ơn bạn đã sử dụng dịch vụ!' });

            msg.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            msg.channel.send('Đã xảy ra lỗi trong quá trình thực hiện lệnh.');
        }
    }
};
