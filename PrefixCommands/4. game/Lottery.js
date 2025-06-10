
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const economySystem = require('../../schemas/economySystem');
const Lottery = require('../../schemas/LotterySchema');
const moment = require('moment-timezone');

module.exports = {
    name: 'Lottery',
    description: '🔸 Vận Mệnh Kim Cương',
    hd: 
        `🔸 Trải nghiệm lộc trời \`\`\`?Lottery lg1 <số tiền> <số bạn dự đoán>\`\`\`` +
        `     🔸 Thử vận kim cương \`\`\`?Lottery lg2 <số tiền> <số bạn dự đoán>\`\`\`` +
        `     🔸 Săn song số phú quý \`\`\`?Lottery tt <số tiền> <số bạn dự đoán>\`\`\``, // 
    aliases: ['vmkc', 'g6'],

    // .toLowerCase()
    async execute(msg, args) {
        if (!args[0] || args[0].toLowerCase() === 'h') {
            const embedHelp = new EmbedBuilder()
                .setTitle('Hướng Dẫn Chơi Vận Mệnh Kim Cương')
                .setDescription(
                    "**LỆNH:**\n" +
                    "- Hiển thị hướng dẫn\`\`\`?Lottery h\`\`\`\n" +
                    "- Trải nghiệm lộc trời 2 số (tối thiểu 1k <a:xu:1320563128848744548>):\`\`\`?Lottery lg1 <số tiền> <số bạn dự đoán> (2 chữ số)\`\`\`\n\n" +
                    "- Thử vận kim cương 3 số (tối thiểu 3k <a:xu:1320563128848744548>): \`\`\`?Lottery lg2 <số tiền> <số bạn dự đoán (3 chữ số)>\`\`\`\n\n" +
                    "- Săn song số phú quý (tối thiểu 24k <a:xu:1320563128848744548>): \`\`\`?Lottery lg3 <số tiền> <số bạn dự đoán> (2 chữ số)\`\`\`\n\n" +
                    "**LƯU Ý:**\n" +
                    "- Đối với Trải nghiệm lộc trời \`\`\`?Lottery lg1\`\`\` Số phải có 2 chữ số (VD: 00, 88).\n" +
                    "- Đối với Thử vận kim cương \`\`\`?Lottery lg2\`\`\` Số phải có 3 chữ số (VD: 000, 552).\n" +
                    "- Đối với Săn song số phú quý \`\`\`?Lottery lg3\`\`\` Số phải có 2 chữ số (VD: 00, 99).\n" +
                    "- Kiểm tra xem tài khoản của bạn đã sẵn sàng cho cuộc phiêu lưu này chưa."
                )
                .setColor('Blue');
            return msg.channel.send({ embeds: [embedHelp] });
        }

        // Lấy ngày hiện tại ở múi giờ Việt Nam
        const currentDate = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
        
        // Kiểm tra đặt cược 2 số
        if (args[0].toLowerCase() === 'lg1') {
            const betAmount = parseInt(args[1].replace(/\./g, ''));
            const chosenNumber = args[2];

            if (isNaN(betAmount) || betAmount < 1000) {
                return msg.channel.send("Hãy dâng lên 1000 <a:xu:1320563128848744548> để mở cửa vận may cho lệnh lg1.");
            }

            if (!/^\d{2}$/.test(chosenNumber)) {
                return msg.channel.send("Xin vui lòng cung cấp một số có đúng 2 chữ số, và chúng ta sẽ xem số phận của bạn ra sao (VD: 00, 81).");
            }

            // Kiểm tra đặt cược gần nhất
            const previousBet = await Lottery.findOne({ Guild: msg.guild.id, User: msg.author.id, chosenType: 'lg1' }).sort({ betTime: -1 });
            if (previousBet && moment(previousBet.betTime, 'HH:mm:ss [ngày] DD/MM/YYYY').format('DD/MM/YYYY') === currentDate) {
                    return msg.channel.send
                        (
                            "Hãy ghi nhớ, mỗi ngày chỉ cho phép một lần đặt cược với trải nghiệm lộc trời 2 số.\n" +
                            "Đừng quên trở lại vào ngày mai để khẳng định số phận của bạn!"
                        );
                }

            // Kiểm tra tài khoản ngân hàng
            const userData = await economySystem.findOne({ Guild: msg.guild.id, User: msg.author.id });
            if (!userData || userData.Bank < betAmount) {
                return msg.channel.send("Bạn cần phải tích lũy thêm <a:xu:1320563128848744548> để có thể tham gia cuộc chiến này. Hãy thu thập thêm trước khi quay lại");
            }

            userData.Bank -= betAmount;
            await userData.save();

            const lotteryEntry = new Lottery({
                Guild: msg.guild.id,
                User: msg.author.id,
                displayName: msg.member.displayName,
                betAmount: betAmount,
                chosenNumber: chosenNumber,
                chosenType: 'lg1',
                betTime: moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss [ngày] DD/MM/YYYY')
            });
            await lotteryEntry.save();

            msg.channel.send(`Chúc mừng! Bạn đã gửi gắm **${betAmount}** <a:xu:1320563128848744548> vào số **${chosenNumber}**, hãy chờ đợi sự kỳ diệu sắp đến!`);
        }

        // Kiểm tra đặt cược 3 số
        if (args[0].toLowerCase() === 'lg2') {
            const betAmount = parseInt(args[1].replace(/\./g, ''));
            const chosenNumber = args[2];

            if (isNaN(betAmount) || betAmount < 5000) {
                return msg.channel.send("Để bước vào cuộc phiêu lưu này, hãy đảm bảo rằng số <a:xu:1320563128848744548> bạn đầu tư không dưới 3k <a:xu:1320563128848744548> cho lệnh lg2.");
            }

            if (!/^\d{3}$/.test(chosenNumber)) {
                return msg.channel.send("Vui lòng đảm bảo rằng bạn đã chọn một con số hoàn hảo với 3 chữ số, (VD: 000, 552");
            }

            // Kiểm tra đặt cược gần nhất
            const previousBet = await Lottery.findOne({ Guild: msg.guild.id, User: msg.author.id, chosenType: 'lg2' }).sort({ betTime: -1 });
            if (previousBet && moment(previousBet.betTime, 'HH:mm:ss [ngày] DD/MM/YYYY').format('DD/MM/YYYY') === currentDate) {
                    return msg.channel.send
                    (
                        "Hãy ghi nhớ, mỗi ngày chỉ cho phép một lần đặt cược với thử vận kim cương 3 số.\n" +
                        "Đừng quên trở lại vào ngày mai để khẳng định số phận của bạn!"
                    );
                }

            // Kiểm tra tài khoản ngân hàng
            const userData = await economySystem.findOne({ Guild: msg.guild.id, User: msg.author.id });
            if (!userData || userData.Bank < betAmount) {
                return msg.channel.send("Bạn cần phải tích lũy thêm <a:xu:1320563128848744548> để có thể tham gia cuộc chiến này. Hãy thu thập thêm trước khi quay lại.");
            }

            userData.Bank -= betAmount;
            await userData.save();

            const lotteryEntry = new Lottery({
                Guild: msg.guild.id,
                User: msg.author.id,
                displayName: msg.member.displayName,
                betAmount: betAmount,
                chosenNumber: chosenNumber,
                chosenType: 'lg2',
                betTime: moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss [ngày] DD/MM/YYYY')
            });
            await lotteryEntry.save();

            msg.channel.send(`Chúc mừng! Bạn đã gửi gắm **${betAmount}** <a:xu:1320563128848744548> vào số **${chosenNumber}**, hãy chờ đợi sự kỳ diệu sắp đến!.`);
        }

        // Xử lý lệnh chơi song số phú quý 2 số
        if (args[0].toLowerCase() === 'lg3') {
            const betAmount = parseInt(args[1].replace(/\./g, ''));
            const chosenNumber = args[2];

            if (isNaN(betAmount) || betAmount < 24000) {
                return msg.channel.send("Bạn cần ít nhất 24k <a:xu:1320563128848744548> để tham gia song số phú quý.");
            }

            if (betAmount % 24000 !== 0) {
                return msg.channel.send("Số tiền đặt cược không hợp lệ! 24k <a:xu:1320563128848744548> = 1 điểm . Ví dụ: 24k, 48k, 72k...");
            }

            if (!/^\d{2}$/.test(chosenNumber)) {
                return msg.channel.send("Vui lòng chọn một số có đúng 2 chữ số (VD: 00, 81).");
            }

            // Kiểm tra đặt cược gần nhất
            const previousBet = await Lottery.findOne({ Guild: msg.guild.id, User: msg.author.id, chosenType: 'lg3' }).sort({ betTime: -1 });
            if (previousBet && moment(previousBet.betTime, 'HH:mm:ss [ngày] DD/MM/YYYY').format('DD/MM/YYYY') === currentDate) {
                    return msg.channel.send
                    (
                        "Hãy ghi nhớ, mỗi ngày chỉ cho phép một lần đặt cược với Săn song số phú quý 2 số.\n" +
                        "Đừng quên trở lại vào ngày mai để khẳng định số phận của bạn!"
                    );
                }

            const userData = await economySystem.findOne({ Guild: msg.guild.id, User: msg.author.id });
            if (!userData || userData.Bank < betAmount) {
                return msg.channel.send("Bạn không đủ tiền trong ngân hàng để tham gia song số phú quý.");
            }

            userData.Bank -= betAmount;
            await userData.save();

            const lotteryEntry = new Lottery({
                Guild: msg.guild.id,
                User: msg.author.id,
                displayName: msg.member.displayName,
                betAmount: betAmount,
                chosenNumber: chosenNumber,
                chosenType: 'lg3',
                betTime: moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss [ngày] DD/MM/YYYY'),
            });

            await lotteryEntry.save();

            msg.channel.send(`Bạn đã đặt cược **${betAmount}** <a:xu:1320563128848744548> vào số **${chosenNumber}** cho song số phú quý. Chúc may mắn!`);
        }
    },
};




