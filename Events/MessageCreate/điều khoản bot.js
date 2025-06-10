const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const UserAgreement = require('../../schemas/userAgreementSchema');
const Provision = require('../../schemas/provisionSchema');
const EventStatus = require('../../schemas/Event_Status');
const config = require('../../config');

module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        // // Kiểm tra trạng thái của sự kiện này
        // const eventStatus = await EventStatus.findOne({ event: 'điều_khoản_bot' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu không phải là tin nhắn từ server hoặc kênh không hợp lệ
        if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) {
            return;
        }

        if (message.channel?.partial) await message.channel.fetch().catch(() => { });
        if (message.member?.partial) await message.member.fetch().catch(() => { });

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (message.author.bot || !message.guild) return;

        // Kiểm tra nếu người dùng đã có trong cơ sở dữ liệu `Provision`
        const provisionEntry = await Provision.findOne({ userId: message.author.id, guildId: message.guild.id }).exec();

        // Nếu người dùng đã có trong `Provision`, thoát khỏi hàm
        if (provisionEntry) {
            return; // Không gửi tin nhắn điều khoản nếu người dùng đã từ chối trước đó
        }

        // Tìm kiếm trong cơ sở dữ liệu xem người dùng đã đồng ý điều khoản chưa 
        const existingAgreement = await UserAgreement.findOne({ userId: message.author.id }).exec();

        // Nếu người dùng chưa đồng ý, gửi tin nhắn yêu cầu chấp nhận điều khoản
        if (!existingAgreement) {

            // Kiểm tra nếu người dùng đã nhận tin nhắn điều khoản trước đó
            const sentTermsMessage = await message.channel.messages.fetch({ limit: 30 });
            const termsMessageExists = sentTermsMessage.some(msg => {
                // Kiểm tra xem tin nhắn có phải là tin nhắn điều khoản dịch vụ
                return msg.author.id === client.user.id &&
                    msg.embeds.length > 0 &&
                    msg.embeds[0].title === 'Điều khoản Và Điều Kiện Dịch Vụ';  // Kiểm tra title của embed
            });
            
            // Nếu đã gửi trước đó thì không gửi lại
            if (termsMessageExists) return
            
                // Tạo embed cho điều khoản dịch vụ
                const termsEmbed = new EmbedBuilder()
                    .setColor('#ee88aa')
                    .setTitle('Điều khoản Và Điều Kiện Dịch Vụ')
                    .setDescription(
                        `**1. Đăng Ký Và Sử Dụng Lệnh**\n` +

                    `- Người dùng phải đăng ký một tài khoản hợp lệ để tham gia vào việc sử dụng lệnh của bot. Mỗi người dùng chỉ được phép tạo một tài khoản duy nhất.\n` +
                    `- Việc sử dụng hệ thống phải tuân thủ các quy định của chúng tôi và không được sử dụng tài khoản để thực hiện các hành vi gian lận,` +
                    ` lừa đảo hoặc gây thiệt hại cho người dùng khác.\n\n` +

                    `**2. Tuyển Dụng Và Khiếu Nại**\n` +

                    `- Hệ thống tuyển dụng có thể sẽ cập nhật hoặc hủy bỏ bất kỳ lúc nào trong tương lai mà không cần thông báo trước.quyết định của chúng tôi là quyết định cuối cùng.` +
                    `- Việc khiếu nại, tức là dùng lệnh \`/mailbox\` sec được chúng tôi xem xét kĩ lưỡng và gửi thông báo tới bạn. hãy chú ý tới nhắn của bạn.` +
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
                    .setFooter({ text : `BẠN CẦN ĐỒNG Ý VỚI ĐIỀU KHOẢN DỊCH VỤ ĐỂ SỬ DỤNG LỆNH CỦA BOT` })

                // Tạo nút chấp nhận điều khoản
                const acceptButton = new ButtonBuilder()
                    .setCustomId('accept_terms')
                    .setLabel('Chấp Nhận')
                    .setStyle(ButtonStyle.Success);

                const row = new ActionRowBuilder().addComponents(acceptButton);
                const termsMessage = await message.channel.send({
                    embeds: [termsEmbed],
                    components: [row]
                });

                // Bộ lọc để chỉ người dùng cụ thể có thể nhấn nút
                const filter = (i) => i.customId === "accept_terms" && i.user.id === message.author.id;

                const collector = termsMessage.createMessageComponentCollector({
                    filter,
                    time: 300000,
                });

                // Khi người dùng nhấn nút chấp nhận điều khoản
                collector.on('collect', async (interaction) => {
                    await termsMessage.delete();

                    // Kiểm tra nếu người dùng đã có trong blacklist với lý do "Không chấp nhận điều khoản dịch vụ"
                    const existingBlacklistEntry = await Provision.findOne({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                        reason: 'Không chấp nhận điều khoản dịch vụ'
                    }).exec();

                    if (existingBlacklistEntry) {
                        // Nếu người dùng đã có trong blacklist với lý do trên, xóa khỏi blacklist
                        await Provision.deleteOne({
                            userId: interaction.user.id,
                            guildId: interaction.guild.id,
                            reason: 'Không chấp nhận điều khoản dịch vụ'
                        });

                        // Nếu người dùng chưa có trong blacklist, thêm họ vào bảng UserAgreement
                        const newAgreement = new UserAgreement({
                            userId: interaction.user.id,
                            displayName: interaction.member.displayName,
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                        });

                        await newAgreement.save();

                        await interaction.reply({
                            content: `Bạn ${interaction.member.displayName} đã được xóa khỏi danh sách đen và đồng ý với điều khoản dịch vụ.`,
                            ephemeral: true
                        });
                    } else {
                        // Nếu người dùng chưa có trong blacklist, thêm họ vào bảng UserAgreement
                        const newAgreement = new UserAgreement({
                            userId: interaction.user.id,
                            displayName: interaction.member.displayName,
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                        });

                        await newAgreement.save();

                        await interaction.reply({
                            content: `Bạn đã đồng ý với điều khoản dịch vụ của chúng tôi, giờ bạn có thể dùng lệnh rồi`, // Bạn ${interaction.member.displayName} đã đồng ý với điều khoản dịch vụ.
                            ephemeral: true
                        });
                    }
                });

                // Khi hết thời gian mà người dùng chưa chấp nhận
                collector.on('end', async (collected) => {
                                     
                    if (collected.size === 0) {
                        await termsMessage.edit({
                            embeds: [termsEmbed],
                            components: [],
                        });
                        // await termsMessage.delete();

                        // Kiểm tra nếu người dùng đã có trong blacklist
                        const existingBlacklistEntry = await Provision.findOne({ userId: message.author.id, guildId: message.guild.id }).exec();
                    
                    if (!existingBlacklistEntry) {
                        // Lấy thông tin từ message
                        // const userId = message.user.id;
                        const userId = message.author.id;
                        const userName = message.author.displayName; // Tên người dùng
                        const guildId = message.guild.id; // ID của server
                        const guildName = message.guild.name; // Tên server

                        // Thêm người dùng vào blacklist nếu không chấp nhận điều khoản
                        const newBlacklistEntry = new Provision({
                            userId: userId,
                            userName: userName, // Thêm tên người dùng
                            guildId: guildId, // Thêm ID server
                            guildName: guildName, // Thêm tên server
                            reason: 'Không chấp nhận điều khoản dịch vụ'
                        });
                        await newBlacklistEntry.save();

                        const e = new EmbedBuilder()
                            .setColor(config.embedCyan)
                            .setTitle(`Điều khoản Và Điều Kiện Dịch Vụ`)
                            .setDescription(
                                `Bạn đã không chấp nhận điều khoản trong thời gian quy định\n` +
                                `Nếu bạn bỏ lỡ thì có thể yêu cầu chủ sở hữu máy chủ gọi lại bằng lệnh bên dưới để khởi lại điều khoản dịch vụ \`\`\`yml\n/proviso\`\`\`` +
                                `Hoặc liên hệ trực tiếp với chúng tôi bằng lệnh \`\`\`/mailbox\`\`\``
                            )

                        await message.channel.send({ embeds: [e] });
                    } else {

                        const e1 = new EmbedBuilder()
                            .setColor(config.embedCyan)
                            .setTitle(`Điều khoản Và Điều Kiện Dịch Vụ`)
                            .setDescription(
                                `Bạn đã bị đưa vào danh sách không chấp nhận điều khoản dịch vụ trước đó.\n` +
                                `Nếu bạn bỏ lỡ thì có thể yêu cầu chủ sở hữu máy chủ gọi lại bằng lệnh bên dưới để khởi lại điều khoản dịch vụ \`\`\`yml\n/proviso\`\`\`` +
                                `Hoặc liên hệ trực tiếp với chúng tôi bằng lệnh \`\`\`/mailbox\`\`\``
                            )

                        await message.channel.send({ embeds: [e1] });
                    }
                } 
            });
            

            return; // Kết thúc hàm để không thực hiện thêm mã nào khác
        }
    }
};












// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const UserAgreement = require('../../schemas/userAgreementSchema');
// const Blacklist = require('../../schemas/blacklistSchema');
// const EventStatus = require('../../schemas/Event_Status');

// module.exports = {
//     name: "messageCreate",

//     async execute(message, client) {

//         // Kiểm tra trạng thái của sự kiện này
//         const eventStatus = await EventStatus.findOne({ event: 'điều_khoản_bot' });

//         // Nếu sự kiện không được bật, thoát khỏi hàm
//         if (!eventStatus || eventStatus.status === 'off') {
//             return; // Không làm gì cả nếu sự kiện bị tắt
//         }

//         // Kiểm tra nếu không phải là tin nhắn từ server hoặc kênh không hợp lệ
//         if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) {
//             return;
//         }

//         if (message.channel?.partial) await message.channel.fetch().catch(() => { });
//         if (message.member?.partial) await message.member.fetch().catch(() => { });

//         // Kiểm tra nếu tin nhắn từ bot thì bỏ qua
//         if (message.author.bot) {
//             return;
//         }

//         // Tìm kiếm trong cơ sở dữ liệu xem người dùng đã đồng ý điều khoản chưa 
//         const existingAgreement = await UserAgreement.findOne({ userId: message.author.id }).exec();

//         // Nếu người dùng chưa đồng ý, gửi tin nhắn yêu cầu chấp nhận điều khoản
//         if (!existingAgreement) {

//             // // Kiểm tra nếu người dùng đã nhận tin nhắn điều khoản trước đó
//             // const sentTermsMessage = await message.channel.messages.fetch({ limit: 30 });
//             // const termsMessageExists = sentTermsMessage.some(msg => {
//             //     // Kiểm tra xem tin nhắn có phải là tin nhắn điều khoản dịch vụ
//             //     return msg.author.id === client.user.id &&
//             //         msg.embeds.length > 0 &&
//             //         msg.embeds[0].title === 'Điều khoản và điều kiện';  // Kiểm tra title của embed
//             // });
            
//             // // Nếu đã gửi trước đó thì không gửi lại
//             // if (termsMessageExists) return
            
//                 // Tạo embed cho điều khoản dịch vụ
//                 const termsEmbed = new EmbedBuilder()
//                     .setColor('#ee88aa')
//                     .setTitle('Điều khoản và điều kiện')
//                     .setDescription(
//                         `**1. Đăng Ký Và Sử Dụng Lệnh**\n` +

//                     `- Người dùng phải đăng ký một tài khoản hợp lệ để tham gia vào việc sử dụng lệnh của bot. Mỗi người dùng chỉ được phép tạo một tài khoản duy nhất.\n` +
//                     `- Việc sử dụng hệ thống phải tuân thủ các quy định của chúng tôi và không được sử dụng tài khoản để thực hiện các hành vi gian lận,` +
//                     ` lừa đảo hoặc gây thiệt hại cho người dùng khác.\n\n` +

//                     `**2. Tuyển Dụng Và Khiếu Nại**\n` +

//                     `- Hệ thống tuyển dụng có thể sẽ cập nhật hoặc hủy bỏ bất kỳ lúc nào trong tương lai mà không cần thông báo trước.quyết định của chúng tôi là quyết định cuối cùng.` +
//                     `- Việc khiếu nại, tức là dùng lệnh \`/mailbox\` sec được chúng tôi xem xét kĩ lưỡng và gửi thông báo tới bạn. hãy chú ý tới nhắn của bạn.` +
//                     ` Lưu ý: khiếu nại cá nhân chúng tôi sẽ không giải quyết, chúng tôi chỉ hỗ trợ phản hồi về bot.` +
//                     `- Đừng đánh lừa các nhóm hỗ trợ của Discord. Không gửi báo cáo sai lệch hoặc độc hại cho bộ phận Phản hồi pháp lý của chúng tôi hoặc các nhóm hỗ trợ` +
//                     ` khách hàng khác, gửi nhiều báo cáo về cùng một vấn đề hoặc yêu cầu một nhóm người dùng báo cáo cùng một nội dung hoặc vấn đề. Việc vi phạm nguyên` +
//                     ` tắc này nhiều lần có thể dẫn đến cảnh báo tài khoản hoặc các hình phạt khác.\n\n` +

//                     `**3. Chính Sách Dùng Lệnh**\n` +

//                     `- Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh của bot.\n` +
//                     `- Mọi lệnh đã được phân chia rõ ràng từng mục để bạn hiểu rõ.\n\n` +
//                     `- Không cho phép Ứng Dụng của bạn bỏ qua hoặc phá vỡ các tính năng riêng tư, an toàn và/hoặc bảo mật của Discord` +
//                     `- Không thu thập, gạ gẫm hoặc lừa dối người dùng cung cấp mật khẩu hoặc các thông tin đăng nhập khác. Trong mọi trường hợp, bạn dùng Bot của` +
//                     ` chúng tôi yêu cầu hoặc cố gắng lấy thông tin đăng nhập từ người dùng Discord. Những thông tin này bao gồm những thông tin nhậy cảm như mật khẩu` +
//                     ` hoặc quyền truy cập tài khoản hoặc mã thông báo đăng nhập thì sẽ chúng tôi sẽ xử lý mà không thông báo.\n\n` +

//                     `**4. Chính Sách Bảo Mật**\n` +

//                     `- Thông tin cá nhân của người dùng sẽ được bảo mật và chỉ sử dụng cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.\n` +
//                     `- Chúng tôi cam kết bảo vệ thông tin của bạn khỏi các hành vi xâm phạm, nhưng không chịu trách nhiệm đối với các sự cố không lường trước do lỗi` +
//                     ` hệ thống hoặc tấn công mạng.\n\n` +

//                     `**5. Quyền và Nghĩa Vụ**\n` +

//                     `- Chúng tôi có quyền thay đổi, cập nhật hoặc hủy bỏ bất kỳ tính năng nào của hệ thống mà không cần thông báo trước.\n` +
//                     `- Người dùng có trách nhiệm tuân thủ các điều khoản và điều kiện này. Bất kỳ hành vi vi phạm nào cũng có thể dẫn đến việc tạm ngưng` +
//                     ` hoặc khóa tài khoản vĩnh viễn.\n\n` +

//                     `**6. Giải Quyết Tranh Chấp**\n` +

//                     `Mọi tranh chấp phát sinh liên quan đến việc sử dụng hệ thống sẽ được giải quyết theo pháp luật hiện hành và` +
//                     ` quyết định của chúng tôi là quyết định cuối cùng.`
//                 )
//                     .setFooter({ text : `Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh của bot` })

//                 // Tạo nút chấp nhận điều khoản
//                 const acceptButton = new ButtonBuilder()
//                     .setCustomId('accept_terms')
//                     .setLabel('Chấp Nhận')
//                     .setStyle(ButtonStyle.Success);

//                 const row = new ActionRowBuilder().addComponents(acceptButton);
//                 const termsMessage = await message.channel.send({
//                     embeds: [termsEmbed],
//                     components: [row]
//                 });

//                 // Bộ lọc để chỉ người dùng cụ thể có thể nhấn nút
//                 const filter = (i) => i.customId === "accept_terms" && i.user.id === message.author.id;

//                 const collector = termsMessage.createMessageComponentCollector({
//                     filter,
//                     time: 600000, // Thời gian thu thập phản hồi là 1 tiếng
//                 });

//                 // // Khi người dùng nhấn nút chấp nhận điều khoản
//                 // collector.on('collect', async (message) => {
//                 //     await termsMessage.delete();

//                 //     // Lấy thông tin về biệt danh, ID máy chủ và tên máy chủ
//                 //     const userId = message.user.id;
//                 //     const displayName = message.member.displayName;
//                 //     const guildId = message.guild.id;
//                 //     const guildName = message.guild.name;

//                 //     const newAgreement = new UserAgreement({ 
//                 //                                 userId: userId,
//                 //                                 displayName: displayName,
//                 //                                 guildId: guildId,
//                 //                                 guildName: guildName,
//                 //                             });
                                            
//                 //     await newAgreement.save();

//                 //     await message.channel.send(`Bạn ${displayName} đã đồng ý với điều khoản dịch vụ.`);
//                 //     collector.stop()
//                 // });

//                 // Khi người dùng nhấn nút chấp nhận điều khoản
//     // collector.on('collect', async (interaction) => {
//     //     await termsMessage.delete();

//     //     // Lấy thông tin về biệt danh, ID máy chủ và tên máy chủ
//     //     const userId = interaction.user.id;
//     //     const displayName = interaction.member.displayName;
//     //     const guildId = interaction.guild.id;
//     //     const guildName = interaction.guild.name;

//     //     const newAgreement = new UserAgreement({ 
//     //         userId: userId,
//     //         displayName: displayName,
//     //         guildId: guildId,
//     //         guildName: guildName,
//     //     });
        
//     //     await newAgreement.save();

//     //     await interaction.reply({ content: `Bạn ${displayName} đã đồng ý với điều khoản dịch vụ.`, ephemeral: true });

//     // });

//                 // Khi người dùng nhấn nút chấp nhận điều khoản
//                 collector.on('collect', async (interaction) => {
//                     await termsMessage.delete();

//                     // Kiểm tra nếu người dùng đã có trong blacklist với lý do "Không chấp nhận điều khoản dịch vụ"
//                     const existingBlacklistEntry = await Blacklist.findOne({
//                         userId: interaction.user.id,
//                         guildId: interaction.guild.id,
//                         reason: 'Không chấp nhận điều khoản dịch vụ'
//                     }).exec();

//                     if (existingBlacklistEntry) {
//                         // Nếu người dùng đã có trong blacklist với lý do trên, xóa khỏi blacklist
//                         await Blacklist.deleteOne({
//                             userId: interaction.user.id,
//                             guildId: interaction.guild.id,
//                             reason: 'Không chấp nhận điều khoản dịch vụ'
//                         });

//                         // Nếu người dùng chưa có trong blacklist, thêm họ vào bảng UserAgreement
//                         const newAgreement = new UserAgreement({
//                             userId: interaction.user.id,
//                             displayName: interaction.member.displayName,
//                             guildId: interaction.guild.id,
//                             guildName: interaction.guild.name,
//                         });

//                         await newAgreement.save();

//                         await interaction.reply({
//                             content: `Bạn ${interaction.member.displayName} đã được xóa khỏi danh sách đen và đồng ý với điều khoản dịch vụ.`,
//                             ephemeral: true
//                         });
//                     } else {
//                         // Nếu người dùng chưa có trong blacklist, thêm họ vào bảng UserAgreement
//                         const newAgreement = new UserAgreement({
//                             userId: interaction.user.id,
//                             displayName: interaction.member.displayName,
//                             guildId: interaction.guild.id,
//                             guildName: interaction.guild.name,
//                         });

//                         await newAgreement.save();

//                         await interaction.reply({
//                             content: `Bạn ${interaction.member.displayName} đã đồng ý với điều khoản dịch vụ.`,
//                             ephemeral: true
//                         });
//                     }
//                 });

//                 // Khi hết thời gian mà người dùng chưa chấp nhận
//                 collector.on('end', async (collected) => {
                                     
//                     if (collected.size === 0) {
//                         await termsMessage.edit({
//                             embeds: [termsEmbed],
//                             components: [],
//                         });

//                         // Kiểm tra nếu người dùng đã có trong blacklist
//                         const existingBlacklistEntry = await Blacklist.findOne({ userId: message.author.id, guildId: message.guild.id }).exec();
                    
//                     if (!existingBlacklistEntry) {
//                         // Lấy thông tin từ message
//                         // const userId = message.user.id;
//                         const userId = message.author.id;
//                         const userName = message.author.displayName; // Tên người dùng
//                         const guildId = message.guild.id; // ID của server
//                         const guildName = message.guild.name; // Tên server

//                         // Thêm người dùng vào blacklist nếu không chấp nhận điều khoản
//                         const newBlacklistEntry = new Blacklist({
//                             userId: userId,
//                             userName: userName, // Thêm tên người dùng
//                             guildId: guildId, // Thêm ID server
//                             guildName: guildName, // Thêm tên server
//                             reason: 'Không chấp nhận điều khoản dịch vụ'
//                         });
//                         await newBlacklistEntry.save();

//                         await message.channel.send("Bạn đã không chấp nhận điều khoản trong thời gian quy định.");
//                     } else {
//                         await message.channel.send("Bạn đã bị đưa vào danh sách đen trước đó vì không chấp nhận điều khoản.");
//                     }
//                 } 
//             });
            

//             return; // Kết thúc hàm để không thực hiện thêm mã nào khác
//         }
//     }
// };