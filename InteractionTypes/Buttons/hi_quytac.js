// /*
//     Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
//     lấy nút tại ActionRowBuilder.js dùng cho lệnh:
//     - hi
// */
// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
// const config = require(`../../config`)
// const interactionError = require('../../Events/WebhookError/interactionError');

// module.exports = {
//     id: 'button3',
//     description: 'Gửi quy tắc máy chủ cho người dùng mới sử dụng máy chủ Discord. nút ở lệnh /hi',
//     async execute(interaction, client) {
//     try {

//         const linkbutton = new ActionRowBuilder()
//                         .addComponents(
//                             new ButtonBuilder()
//                             .setLabel('Điều khoản dịch vụ của Discord')
//                             .setURL('https://discord.com/terms')
//                             .setEmoji(`<:discord:1249622570051964991>`)
//                             .setStyle(ButtonStyle.Link),
                    
//                             new ButtonBuilder()
//                             .setLabel('Nguyên tắc cộng đồng của Discord')
//                             .setEmoji(`<:_rules:1249496563898781838>`)
//                             .setURL('https://discord.com/guidelines')
//                             .setStyle(ButtonStyle.Link)
//                         )
                    
//                         const ruleembed = new EmbedBuilder()
//                             .setTitle('__✿ QUY TẮC MÁY CHỦ__')
//                             .setColor(config.embedGreen)
//                             .setDescription('\nXin chào tất cả mọi người! Trước khi trò chuyện và giải trí trên máy chủ, trước tiên hãy xem các quy tắc này!!\n» __**QUY TẮC TRÒ CHUYỆN**__\n> » Tôn trọng mọi người.\n> » Không quấy rối/bắt nạt/hành vi sai trái.\n> » Duy trì trò chuyện __***trong mọi lĩnh vực***__  không bao gồm nội dung khiêu dâm/ nội dung tình dục/bạo lực để mọi người có thể cảm thấy an toàn và thoải mái.\n> » Không van xin, không lừa đảo và **KHÔNG** chia sẻ thông tin cá nhân của người khác (và cố gắng không chia sẻ quá nhiều về thông tin cá nhân của riêng bạn, vì sự an toàn của bạn).\n> » Không có lời lẽ phân biệt chủng tộc/kỳ thị đồng tính/chứng sợ chuyển giới/lời nói xúc phạm. Tôn trọng LGBTQIA+.\n> » Trò chuyện thoại: Hãy lưu ý đến thực tế là một số người nhút nhát, hoặc không phải lúc nào cũng nghe rõ hoặc nói ngọng - ĐỪNG giễu cợt người khác và cố gắng không lấn át người khác/lừa đảo cuộc trò chuyện.\n **Các quy tắc này cũng áp dụng cho việc gửi tin nhắn trực tiếp cho các thành viên khác của máy chủ một cách riêng tư**.\n» __** QUY TẮC KÊNH**__ \n> » Chúng tôi có các kênh cụ thể cho các mục đích cụ thể nên hãy cố gắng trò chuyện/chơi trên các kênh phù hợp. Các quy tắc trò chuyện cũng được áp dụng tại đây.\n» __**QUY TẮC TRONG VALHEIM SURVIVAL**__\n> » Hãy đọc chúng tại 「📌」┇ [🦋rules🦋](https://discord.com/channels/1028540923249958912/1173537274542174218)\n\n ‼️ __**QUAN TRỌNG**__: **KHÔNG** ping Nhân viên/Chủ sở hữu để giải trí.\n 🚫 **PHÁ QUY TẮC DẪN ĐẾN BAN VĨNH VIỄN.**')
                        
//                             await interaction.reply({ embeds: [ruleembed], components: [linkbutton], ephemeral: true});
//         } catch (error) {
//             interactionError.execute(interaction, error, client);
//         }
//     },
// };




const { EmbedBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const interactionError = require('../../Events/WebhookError/interactionError');
const { button } = require('../../ButtonPlace/ActionRowBuilder');

module.exports = {
    id: 'hi_quytac',
    description: 'Chuyển đến kênh Quy Tắc hoặc Rules',
    async execute(interaction, client) {
        try {
            // Ưu tiên tìm kênh 'quy_tắc'
            let rulesChannel = interaction.guild.channels.cache.find(
                channel => (channel.type === ChannelType.GuildText) && channel.name === 'quy_tắc'
            );

            // Nếu không tìm thấy kênh 'quy_tắc', tìm kênh 'rules'
            if (!rulesChannel) {
                rulesChannel = interaction.guild.channels.cache.find(
                    channel => (channel.type === ChannelType.GuildText) && channel.name === 'rules'
                );
            }

            // Nếu không tìm thấy kênh nào, thông báo lỗi
            if (!rulesChannel) {
                return interaction.reply({ content: 'Không tìm thấy kênh Quy Tắc hoặc Rules!', ephemeral: true });
            }

            const linkbutton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setLabel('Điều khoản dịch vụ của Discord')
                            .setURL('https://discord.com/terms')
                            .setEmoji(`<:discord:1249622570051964991>`)
                            .setStyle(ButtonStyle.Link),
                    
                            new ButtonBuilder()
                            .setLabel('Nguyên tắc cộng đồng của Discord')
                            .setEmoji(`<:_rules:1249496563898781838>`)
                            .setURL('https://discord.com/guidelines')
                            .setStyle(ButtonStyle.Link)
                        )
                    
                        const ruleembed = new EmbedBuilder()
                            .setTitle('__✿ QUY TẮC MÁY CHỦ__')
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
                            .setColor(config.embedGreen)
                            .setDescription(
                                `\nXin chào tất cả mọi người! Trước khi trò chuyện và giải trí trên máy chủ, trước tiên hãy xem các quy tắc này!!\n` +
                                `» __**QUY TẮC TRÒ CHUYỆN**__\n> » Tôn trọng mọi người.\n> » Không quấy rối/bắt nạt/hành vi sai trái.` +
                                `\n> » Duy trì trò chuyện __***trong mọi lĩnh vực***__  ` +
                                `không bao gồm nội dung khiêu dâm/ nội dung tình dục/bạo lực để mọi người có thể cảm thấy an toàn và thoải mái.\n>`+
                                ` » Không van xin, không lừa đảo và **KHÔNG** chia sẻ thông tin cá nhân của người khác (và cố gắng không chia sẻ quá nhiều về thông ` +
                                `tin cá nhân của riêng bạn, vì sự an toàn của bạn).\n> » Không có lời lẽ phân biệt chủng tộc/kỳ thị đồng tính/chứng sợ chuyển ` +
                                `giới/lời nói xúc phạm. Tôn trọng LGBTQIA+.\n> » Trò chuyện thoại: Hãy lưu ý đến thực tế là một số người nhút nhát, ` +
                                `hoặc không phải lúc nào cũng nghe rõ hoặc nói ngọng - ĐỪNG giễu cợt người khác và cố gắng không lấn át người khác/lừa đảo cuộc trò chuyện.\n` +
                                ` **Các quy tắc này cũng áp dụng cho việc gửi tin nhắn trực tiếp cho các thành viên khác của máy chủ một cách ` +
                                `riêng tư**.\n» __** QUY TẮC KÊNH**__ \n> » Chúng tôi có các kênh cụ thể cho các mục đích cụ thể nên hãy cố gắng trò chuyện/chơi ` +
                                `trên các kênh phù hợp. Các quy tắc trò chuyện cũng được áp dụng tại đây.\n» __**CÁC QUY TẮC KHÁC: **__\n> » Hãy ` +
                                `đọc chúng tại <#${rulesChannel.id}>\n\n ‼️ __**QUAN TRỌNG**__: **KHÔNG** ping ` +
                                `Nhân viên/Chủ sở hữu để giải trí.\n 🚫 **PHÁ QUY TẮC DẪN ĐẾN BAN VĨNH VIỄN.**`)

            // Chuyển hướng người dùng đến kênh
            return interaction.reply({
                embeds: [ruleembed],
                components: [linkbutton],
                ephemeral: true // Chỉ người nhấn nút mới thấy thông báo này
            });
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
