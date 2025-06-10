const { EmbedBuilder } = require('discord.js');
const economySystem = require('../../schemas/economySystem');

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        // Kiểm tra nếu message không phải từ bot
        if (message.author.bot) return;

        // Lấy tất cả người dùng có nợ
        const usersWithDebt = await economySystem.find({ Debt: { $gt: 0 } });

        // Duyệt qua từng người dùng có nợ
        for (let userData of usersWithDebt) {
            let remainingDebt = userData.Debt; // Số nợ còn lại
            let initialDebt = remainingDebt; // Số nợ ban đầu

            // Nếu người dùng có tiền trong Bank, trừ từ đó trước
            if (userData.Bank > 0 && remainingDebt > 0) {
                if (userData.Bank >= remainingDebt) {
                    userData.Bank -= remainingDebt;
                    remainingDebt = 0;
                } else {
                    remainingDebt -= userData.Bank;
                    userData.Bank = 0;
                }
            }

            // Nếu vẫn còn nợ, trừ từ Wallet
            if (remainingDebt > 0 && userData.Wallet > 0) {
                if (userData.Wallet >= remainingDebt) {
                    userData.Wallet -= remainingDebt;
                    remainingDebt = 0;
                } else {
                    remainingDebt -= userData.Wallet;
                    userData.Wallet = 0;
                }
            }

            // Nếu còn nợ, cập nhật lại Debt
            if (remainingDebt > 0) {
                userData.Debt = remainingDebt;
            } else {
                userData.Debt = 0; // Nếu không còn nợ, gán Debt về 0
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            await userData.save();

            // Tạo thông báo DM cho người dùng
            const user = await client.users.fetch(userData.User); // Lấy đối tượng người dùng từ User ID
            if (user) {
                const embed = new EmbedBuilder()
                    .setColor(remainingDebt > 0 ? '#FF0000' : '#00FF00')
                    .setTitle('📉 Trừ nợ tự động')
                    .setDescription(
                        `Tài khoản của bạn đã bị trừ nợ tự động.\n\n` +
                        `**Số nợ ban đầu:** ${initialDebt.toLocaleString('vi-VN')} <a:xu:1320563128848744548>\n` +
                        `**Số nợ còn lại:** ${remainingDebt > 0 ? remainingDebt.toLocaleString('vi-VN') : '0'} <a:xu:1320563128848744548>`
                    )
                    .setFooter({ text: `Thông báo từ bot` })
                    .setTimestamp();

                // Gửi thông báo DM
                await user.send({ embeds: [embed] });
            }
        }
    }
};
