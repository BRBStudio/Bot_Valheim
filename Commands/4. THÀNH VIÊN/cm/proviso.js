const { SlashCommandSubcommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const UserAgreement = require('../../../schemas/userAgreementSchema');
// const Blacklist = require('../../schemas/blacklistSchema');
const Blacklist_dev = require('../../../schemas/blacklist_devSchema');
const interactionError = require('../../../Events/WebhookError/interactionError');
const config = require(`../../../config`)
const CommandStatus = require('../../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("proviso")
        .setDescription("🔹 Khởi động lại điều khoản dịch vụ"),

    async execute(interaction) {

        try {    

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/proviso_bot' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            const userId = interaction.user.id;
            const displayName = interaction.member.displayName; // Lấy biệt danh người dùng
            const guildId = interaction.guild.id; // Lấy ID máy chủ
            const guildName = interaction.guild.name; // Lấy tên máy chủ

            const termsEmbed = new EmbedBuilder()
                .setColor(config.embedCyan)
                .setTitle('Điều khoản và điều kiện')
                .setDescription(
                        `**1. Đăng Ký Và Sử Dụng Lệnh**\n` +

                        `- Người dùng bắt buộc phải đăng ký một tài khoản hợp lệ để có thể sử dụng các lệnh của bot. Mỗi người chỉ được phép sở hữu một tài khoản duy nhất.\n` +
                        `- Việc sử dụng bot phải tuân thủ đúng các quy định được đặt ra. Nghiêm cấm các hành vi gian lận, lừa đảo hoặc gây thiệt hại cho người dùng khác.\n\n` +

                        `**2. Tuyển Dụng Và Khiếu Nại**\n` +

                        `- Hệ thống tuyển dụng có thể sẽ cập nhật hoặc hủy bỏ bất kỳ lúc nào trong tương lai mà không cần thông báo trước.quyết định của chúng tôi là quyết định cuối cùng.` +
                        `- Việc khiếu nại, tức là dùng lệnh \`/feedback\` sec được chúng tôi xem xét kĩ lưỡng và gửi thông báo tới bạn. hãy chú ý tới nhắn của bạn.` +
                        ` Lưu ý: khiếu nại cá nhân chúng tôi sẽ không giải quyết, chúng tôi chỉ hỗ trợ phản hồi về bot.` +
                        `- Đừng đánh lừa các nhóm hỗ trợ của Discord. Không gửi báo cáo sai lệch hoặc độc hại cho bộ phận Phản hồi pháp lý của chúng tôi hoặc các nhóm hỗ trợ` +
                        ` khách hàng khác, gửi nhiều báo cáo về cùng một vấn đề hoặc yêu cầu một nhóm người dùng báo cáo cùng một nội dung hoặc vấn đề. Việc vi phạm nguyên` +
                        ` tắc này nhiều lần có thể dẫn đến cảnh báo tài khoản hoặc các hình phạt khác.\n\n` +

                        `**3. Chính Sách Dùng Lệnh**\n` +

                        `- Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh của bot.\n` +
                        `- Mọi lệnh đã được phân chia rõ ràng từng mục để bạn hiểu rõ.\n\n` +
                        `- Không cho phép Ứng Dụng của bạn bỏ qua hoặc phá vỡ các tính năng riêng tư, an toàn và/hoặc bảo mật của Discord` +
                        `- Không thu thập, gạ gẫm hoặc lừa dối người dùng cung cấp mật khẩu hoặc các thông tin đăng nhập khác. Trong mọi trường hợp, bạn dùng Bot của` +
                        ` chúng tôi yêu cầu hoặc cố gắng lấy thông tin đăng nhập từ người dùng Discord. Những thông tin này bao gồm những thông tin nhậy cảm như mật khẩu` +
                        ` hoặc quyền truy cập tài khoản hoặc mã thông báo đăng nhập thì sẽ chúng tôi sẽ xử lý mà không thông báo.\n\n` +

                        `**4. Chính Sách Bảo Mật**\n` +

                        `- Thông tin cá nhân của người dùng sẽ được bảo mật và chỉ sử dụng cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.\n` +
                        `- Chúng tôi cam kết bảo vệ thông tin của bạn khỏi các hành vi xâm phạm, nhưng không chịu trách nhiệm đối với các sự cố không lường trước do lỗi` +
                        ` hệ thống hoặc tấn công mạng.\n\n` +

                        `**5. Quyền và Nghĩa Vụ**\n` +

                        `- Chúng tôi có quyền thay đổi, cập nhật hoặc hủy bỏ bất kỳ tính năng nào của hệ thống mà không cần thông báo trước.\n` +
                        `- Người dùng có trách nhiệm tuân thủ các điều khoản và điều kiện này. Bất kỳ hành vi vi phạm nào cũng có thể dẫn đến việc tạm ngưng` +
                        ` hoặc khóa tài khoản vĩnh viễn.\n\n` +

                        `**6. Giải Quyết Tranh Chấp**\n` +

                        `Mọi tranh chấp phát sinh liên quan đến việc sử dụng hệ thống sẽ được giải quyết theo pháp luật hiện hành và` +
                        ` quyết định của chúng tôi là quyết định cuối cùng.`
                    )
                .setFooter({ 
                    text:
                        `‎                                                                                                                                                     \n` + 
                        `‎                                                                                                                                 © BẢN QUYỀN THUỘC VỀ\n` +
                        `‎                                                                                                                                       ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`
                    })

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_terms')
                .setLabel('Chấp Nhận')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(acceptButton);

            // Gửi lại tin nhắn điều khoản dịch vụ
            const termsMessage = await interaction.channel.send({
                embeds: [termsEmbed],
                components: [row]
            });

            // Bộ lọc chỉ kiểm tra việc nhấn nút
            const filter = (i) => i.customId === "accept_terms";

            const collector = termsMessage.createMessageComponentCollector({
                filter,
                time: 3600000 // 1 tiếng
            });

            // Khi bất kỳ ai nhấn nút chấp nhận điều khoản
            collector.on('collect', async (i) => {
                await i.deferUpdate();
                const userId = i.user.id; // Lấy ID của người nhấn nút
                const displayName = i.member.displayName; // Cập nhật biệt danh của người nhấn
                const guildId = i.guild.id; // Cập nhật ID máy chủ
                const guildName = i.guild.name; // Cập nhật tên máy chủ

                // Kiểm tra xem người dùng đã tồn tại trong UserAgreement hay chưa
                const existingAgreement = await UserAgreement.findOne({ userId });
                if (!existingAgreement) {
                    const newAgreement = new UserAgreement({ 
                                                userId,
                                                displayName,
                                                guildId,
                                                guildName,
                                            });

                    await newAgreement.save();
                    await i.followUp({ content: `${i.user.displayName} đã đồng ý với điều khoản dịch vụ.`, ephemeral: true });
                } else {
                    await i.followUp({ content: `Bạn đã đồng ý với điều khoản trước đó.`, ephemeral: true });
                }
            });

            // Khi hết thời gian mà người dùng chưa chấp nhận
            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    // await termsMessage.edit({
                    //     embeds: [termsEmbed],
                    //     components: []
                    // });

                    // await termsMessage.delete().catch(console.error);

                    try {
                        await termsMessage.delete();
                    } catch (err) {
                        if (err.code !== 10008) console.error(err); // 10008 = Message already deleted
                    }

                    // Thêm người dùng đã sử dụng lệnh vào blacklist nếu không chấp nhận điều khoản
                    // userName: displayName,
                    //         guildId,
                    //         guildName,
                    const newBlacklistEntry = new Blacklist_dev({
                        userId,
                        userName: displayName,
                        guildId,
                        guildName,
                        reason: 'Không chấp nhận điều khoản dịch vụ'
                    });
                    await newBlacklistEntry.save();

                    await interaction.channel.send(`${interaction.user.displayName} đã không chấp nhận điều khoản trong thời gian quy định.`);
                }

                // Xóa hoàn toàn tin nhắn điều khoản sau khi collector hết thời gian
                // await termsMessage.delete().catch(console.error);
                // Xoá tin nhắn nếu chưa xoá ở trên
                try {
                    await termsMessage.delete();
                } catch (err) {
                    if (err.code !== 10008) console.error(err);
                }
            });

            await interaction.deferReply();
            await interaction.deleteReply();
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    }
};
