const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll_prime")
        .setDescription("🔹 Tạo một cuộc thăm dò cấp cao.")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("Đặt câu hỏi của bạn. VD: bạn muốn có mấy ny? :))")
                .setRequired(true)
        )
        .addRoleOption(option=>
            option.setName("role")
                  .setDescription("Chọn vai trò bạn muốn tag khi mở bỏ phiếu")
                  .setRequired(true)         
        )
        .addStringOption(option =>
            option.setName("choice_a")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_b")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_c")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_d")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_e")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_f")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_g")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_h")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_i")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_j")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_k")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_l")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_m")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_n")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_o")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_p")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_r")
                .setDescription("ĐĐặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_s")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_t")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_x")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_y")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("choice_z")
                .setDescription("Đặt lựa chọn này cho câu hỏi của bạn.Nếu đặt emoji ở phía trước sẽ có thay đổi đấy.ví dụ: 😍brb :))")
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("author")
                .setDescription("Bật tắt để hiện thị bạn là tác giả ✅")
        ),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/poll_prime' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;

            const { options } = interaction;
            const author = options.getBoolean("author");
    
            if (options.getString("question")) {
                const description = options.getString("question");
                const user = interaction.user;
                const vaitro1 = options.getRole('role');
                const guild = interaction.guild.name
    
                const choices = ['choice_a', 'choice_b', 'choice_c', 'choice_d', 'choice_e', 'choice_f', 'choice_g', 'choice_h', 'choice_i', 'choice_j', 'choice_k', 'choice_l', 'choice_m', 'choice_n', 'choice_o', 'choice_p', 'choice_r', 'choice_s', 'choice_t', 'choice_x', 'choice_y', 'choice_z'];
                const hasChoices = choices.some(choice => options.getString(choice));
    
                if (!hasChoices) {
                    // Gửi tin nhắn và lưu giữ giá trị của nó
                    const m = await interaction.reply({ content: "Bạn muốn giúp Poll-2 tiếp tục hoạt động? Hãy thêm lựa chọn cho câu hỏi của bạn.", fetchReply: true });
                        await m.react("👍"); // Thêm emoji 👍
                        await m.react("👎"); // Thêm emoji 👎
                        return;
                }
                    
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(description)
                    .setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' })
                    .setThumbnail(`${user.displayAvatarURL()}`)
                    .setFooter({ text: `${user.displayName}`, iconURL: `${user.displayAvatarURL()}` })
                    .setTimestamp();

                    if (author) {
                        embed.setAuthor({
                          name: interaction.member.user.username,
                          iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
                        });
                    }

                // // // Lấy danh sách các thành viên trong vai trò
                // const membersInRole = vaitro1.members.map(member => member.user);
                // const memberMentions = membersInRole.map(member => `<@${member.id}>`).join(" "); // Tạo chuỗi mention cho các thành viên trong vai trò

                const emojiId = '11:1212611787028172870' // Dán ID emoji vào đây ( cách lấy ID emoji: @tên bot\emoji muốn lấy)
                const sentMessage = await interaction.channel.send(`<:${emojiId}> Cuộc thăm dò mới đã bắt đầu....${vaitro1}!`);
                    // await interaction.reply({ 
                    // content: `<:${emojiId}> Cuộc thăm dò đang bắt đầu...@everyone`, 
                    // fetchReply: true}); // ${memberMentions} ${vaitro1}
    
                for (let i = 0; i < choices.length; i++) {
                    const choice = choices[i];
                    const choiceContent = options.getString(choice);
    
                    if (choiceContent) {
                        // Kiểm tra xem người dùng đã nhập biểu tượng cảm xúc trước khi lựa chọn chưa
                        const emojiMatch = choiceContent.match(/^<a?:[a-zA-Z0-9_]+:\d+>|[\uD800-\uDBFF][\uDC00-\uDFFF]/);
                        const emojiToReact = emojiMatch ? emojiMatch[0] : String.fromCodePoint(127462 + i);

                        // Thêm biểu tượng cảm xúc phản ứng vào tin nhắn đã gửi
                        await sentMessage.react(emojiToReact);

                        // Lấy phần không chứa emoji từ choiceContent
                        const xoa_emoji_trong_noi_dung = choiceContent.replace(/^<a?:[a-zA-Z0-9_]+:\d+>|[\uD800-\uDBFF][\uDC00-\uDFFF]/, '').trim();

                        // Thêm trường vào phần nhúng với nội dung lựa chọn không chứa emoji
                        embed.addFields({ name: '\u200B', value: `${emojiToReact} ${xoa_emoji_trong_noi_dung}`, inline: false });
                        // // Thêm trường vào phần nhúng với nội dung lựa chọn có chưa emoji
                        // embed.addFields({ name: '\u200B', value: `${emojiToReact} ${choiceContent}`, inline: false });
                    }
                }
                // Thêm trường "★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ mở cuộc bỏ phiếu:" vào embed
                embed.addFields({ name: `${guild} mở cuộc bỏ phiếu:`, value: `> ${vaitro1}`, inline: true });    
                await sentMessage.edit({ embeds: [embed] });
            } else {
                interaction.reply("Vui lòng đặt câu hỏi cho cuộc thăm dò ý kiến.");
            }
        }
    };