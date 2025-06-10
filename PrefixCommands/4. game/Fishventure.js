const { EmbedBuilder } = require('discord.js');
const BRB_Fishventure = require('../../utils/BRB_Fishventure');
const FishyGameModel = require('../../schemas/FishyGameSchema');
const EconomySystem = require('../../schemas/economySystem');

module.exports = {
    name: 'Fishventure',
    description: 
        `🔸 Cuộc Săn Cá Mạo Hiểm. Chưa hoàn thành, mọi người cứ chơi\n` +
        `       vui vẻ thôi ^^`,
    aliases: ['cc', 'g3'],

    async execute(msg, args) {
        try {
            const guildId = msg.guild.id; // ID máy chủ
            const userId = msg.author.id; // ID người chơi

            // Lấy dữ liệu kinh tế từ MongoDB
            let economyData = await EconomySystem.findOne({ Guild: guildId, User: userId });
            if (!economyData) {
                return msg.channel.send('Bạn chưa có tài khoản kinh tế. Hãy tạo tài khoản trước khi chơi game này <a:muitenxuong:1320596244225327246> \`\`\`/economy\`\`\`');
            }

            // Tìm hoặc tạo dữ liệu FishyGame
            let playerData = await FishyGameModel.findOne({ guildId, userId });
            if (!playerData) {
                playerData = await FishyGameModel.create({
                    guildId,
                    userId,
                    fishes: { rac: 0, vip: 0, condo: 0, cute: 0 }
                });
            }

            // Tạo đối tượng FishyGame
            const game = new BRB_Fishventure({
                message: msg,
                player: {
                    id: userId,
                    balance: economyData.Wallet,
                    fishes: playerData.fishes
                },
                isSlashGame: false,
                embed: {
                    title: '<a:tui:1320577075123589130> TÚI CÁ CỦA BẠN', // 
                    color: '#00FF00'
                }
            });
            // console.log('Giá thuê cần câu:', game.options.fishyRodPrice);

            // Lấy lệnh con từ người dùng
            const subcommand = args[0];
            if (!subcommand) {
                return msg.channel.send(
                    `<a:cauca:1320579011281289306> CẦN 10.000 <a:xu:1320563128848744548> ĐỂ CÂU CÁ\n` +
                    `- Câu cá sử dụng lệnh: \`\`\`fishventure bg\`\`\`\n` +
                    `- Bán cá sử dụng lệnh:\`\`\`fishventure sell <loại bạn muốn bán> <số lượng bạn muốn bán>, ví dụ: fishventure sell vip 2\`\`\`\n` +
                    `- Kiểm tra túi cá sử dụng lệnh:\`\`\`fishventure bag\`\`\``
                );
            }

            if (subcommand.toLowerCase() === 'bg') {
                // Kiểm tra số dư trong Wallet
                if (economyData.Wallet < game.options.fishyRodPrice) {
                    return msg.channel.send
                    (
                        `Bạn không đủ 10.000 <a:xu:1320563128848744548> trong ví để thuê cần câu.\n` +
                        `Dùng lệnh phía dưới để kiểm tra ví của bạn <a:muitenxuong:1320596244225327246>: \`\`\`/economy\`\`\``
                    );
                }

                // Thực hiện hành động câu cá
                await game.Begin();

                // Cập nhật số tiền trong Wallet và số lần lệnh đã chạy
                economyData.Wallet -= game.options.fishyRodPrice;
                economyData.CommandsRan += 1;

                // Lưu cập nhật vào MongoDB
                await economyData.save();
                await FishyGameModel.updateOne(
                    { guildId, userId },
                    { $inc: { [`fishes.${game.fishType}`]: 1 } } // Tăng số cá tương ứng
                );
            } else if (subcommand.toLowerCase() === 'sell') {
                const type = args[1];
                const amount = parseInt(args[2], 10);

                if (!type || isNaN(amount)) {
                    return msg.channel.send('Vui lòng nhập loại cá (rac, cute, condo, vip) và số lượng cần bán, ví dụ: `fishventure sell vip 2`.');
                }

                // Kiểm tra số lượng cá trong kho
                if (!playerData.fishes[type] || playerData.fishes[type] < amount) {
                    return msg.channel.send(`Bạn không có đủ cá loại **${type}** để bán.`);
                }

                // Thực hiện hành động bán cá
                await game.sellFish(type, amount);

                // Cập nhật tiền trong Bank và số lần lệnh đã chạy
                const fishPrice = game.fishes[type].price * amount;
                economyData.Bank += fishPrice;
                economyData.CommandsRan += 1;

                // Cập nhật dữ liệu FishyGame và MongoDB
                await economyData.save();
                await FishyGameModel.updateOne(
                    { guildId, userId },
                    { $inc: { [`fishes.${type}`]: -amount } } // Giảm số lượng cá
                );
            } else if (subcommand.toLowerCase() === 'bag') {
                // Kiểm tra kho cá
                await game.Fishbag();

                // Cập nhật số lần lệnh đã chạy
                economyData.CommandsRan += 1;
                await economyData.save();
            } else {
                return msg.channel.send('Lệnh không hợp lệ. Vui lòng sử dụng: `bg`, `sell`, hoặc `bag`.');
            }
        } catch (error) {
            console.error(error);
            msg.channel.send('Đã xảy ra lỗi trong quá trình thực hiện lệnh.');
        }
    }
};