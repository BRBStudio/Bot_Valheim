const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');
const economySystem = require('../../schemas/economySystem');

const emojiTextList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const emojiTextList1 = ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
const emojiTextList2 = ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1'];
const emojiTextList3 = ['BRB', '3', '4', '5', '6', '7', '8', '9', '0'];
const emojiTextList4 = ['brb', 'lol', 'idk', 'omg', 'ttyl', 'btw', 'fyi', 'lmao', 'tmi'];
const emojiTextList5 = ['smh', 'bff', 'fomo', 'lit', 'vibe', 'flex', 'cap', 'slay', 'nope'];

module.exports = {
    name: 'MysSearch', // MysticSearch
    description: 
        `🔸 Săn Kí Tự Thần Bí!\n\n` +
        `🔸 Để nhận thêm thông tin về cách chơi, bạn có thể sử dụng\n` +
        `       lệnh dưới trong trò chơi để hiển thị hướng dẫn chi tiết: \`\`\`?MysSearch h\`\`\` `,
    aliases: ['skttb', 'g8'],

    async execute(msg, args) {
        const commandStatus = await CommandStatus.findOne({ command: '?findemoji' });

        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        try {
            // .toLowerCase()
            if (args[0] && args[0].toLowerCase() === 'h') {
                const helpEmbed = new EmbedBuilder()
                    .setTitle('Hướng dẫn chơi game Săn Ký Tự Thần Bí')
                    .setDescription('Dưới đây là cách chơi game Săn Ký Tự Thần Bí:\n')
                    .addFields(
                        { 
                            name: '📌 Bước 1: Chuẩn bị', 
                            value: 'Khi bạn bắt đầu trò chơi, bạn sẽ thấy một loạt các ký tự hiện lên trên màn hình trong vòng 5 giây.' 
                        },

                        { 
                            name: '📌 Bước 1: Chuẩn bị', 
                            value: 'Khi bạn bắt đầu trò chơi, bạn sẽ thấy một loạt các ký tự hiện lên trên màn hình trong vòng 5 giây.' 
                        },

                        { 
                            name: '⏳ Bước 2: Tìm kiếm ký tự', 
                            value: 'Sau 5 giây, các ký tự sẽ biến mất và bạn sẽ được yêu cầu tìm một ký tự cụ thể. Hãy chuẩn bị sẵn sàng!' 
                        },

                        { 
                            name: '💡 Bước 3: Chọn ký tự', 
                            value: 'Trong số các ký tự đã ẩn, hãy nhấn vào ký tự mà bạn nghĩ là đúng. Hãy nhớ rằng bạn chỉ có một cơ hội để chọn đúng!' 
                        },

                        { 
                            name: '🎉 Bước 4: Nhận kết quả', 
                            value: 'Nếu bạn chọn đúng ký tự, bạn sẽ nhận được một thông báo chúc mừng! Nếu bạn chọn sai, bạn sẽ thấy thông báo cho biết ký tự bạn đã chọn và ký tự đúng.' 
                        },

                        { 
                            name: '🕒 Lưu ý', 
                            value: 'Thời gian để chọn ký tự là 10 giây. Nếu bạn không chọn trong thời gian này, trò chơi sẽ tự động kết thúc và thông báo kết quả.' 
                        },

                        { 
                            name: '🚀 BRB STUDIO!', 
                            value: 'Chúc bạn có những trải nghiệm thú vị với game này.' 
                        }
                    )
                    .setColor('Blue')
                    .setTimestamp();

                return msg.channel.send({ embeds: [helpEmbed] });
            }

            const allTextLists = [emojiTextList, emojiTextList1, emojiTextList2, emojiTextList3, emojiTextList4, emojiTextList5];
            let texts = ['brb studio', 'brb studio', 'brb studio', 'brb studio', 'brb studio', 'brb studio'];

            while (texts.length < 25) { // Đảm bảo lấy đủ 25 chữ
                const randomList = allTextLists[Math.floor(Math.random() * allTextLists.length)];
                const text = randomList[Math.floor(Math.random() * randomList.length)];

                if (!texts.includes(text)) { // Kiểm tra trùng lặp
                    texts.push(text);
                }
            }

            // Tiếp tục phần mã xử lý và tạo các nút như trong mã gốc...
            // Đặt "brb studio" vào vị trí ngẫu nhiên trong mảng texts
            texts = shuffleArray(texts);
            
            // Tạo hàng cho các nút chữ (5 hàng, mỗi hàng 5 nút)
            const rows = [];
            for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
                const rowTexts = texts.slice(rowIndex * 5, rowIndex * 5 + 5); // Lấy 5 chữ cho mỗi hàng
                const row = new ActionRowBuilder().addComponents(
                    rowTexts.map((text, i) => (
                        new ButtonBuilder()
                            .setCustomId((rowIndex * 5 + i).toString()) // ID cho nút
                            .setLabel(text) // Thay đổi từ setEmoji sang setLabel
                            .setStyle(ButtonStyle.Primary)
                    ))
                );
                rows.push(row); // Thêm hàng vào mảng hàng
            }

            const gameMessage = await msg.channel.send({
                content: 'Hãy đợi 5 giây để hoàn thành việc xáo trộn',
                components: rows
            });

            await new Promise(resolve => {
                const checkInteraction = (interaction) => {
                    if (interaction.user.id === msg.author.id) {
                        interaction.reply({ content: 'Đang trong quá trình chuẩn bị, hãy đợi hết 5s đi nào', ephemeral: true });
                    }
                };
                const filter = i => i.user.id === msg.author.id;
                const collector = gameMessage.createMessageComponentCollector({ filter, time: 5000 });

                collector.on('collect', checkInteraction);
                collector.on('end', () => resolve());
            });

            texts = shuffleArray(texts);
            const targetIndex = texts.indexOf('brb studio'); // Lấy vị trí của 'brb studio'
            const targetText = texts[targetIndex]; // Xác định chữ cần tìm là 'brb studio'

            const hiddenTexts = texts.map(() => "BRB");
            const hiddenRows = [];
            for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
                const rowHiddenTexts = hiddenTexts.slice(rowIndex * 5, rowIndex * 5 + 5); // Lấy 5 chữ ẩn cho mỗi hàng
                const row = new ActionRowBuilder().addComponents(
                    rowHiddenTexts.map((text, i) => (
                        new ButtonBuilder()
                            .setCustomId((rowIndex * 5 + i).toString()) // ID cho nút
                            .setLabel(text) // Thay đổi từ setEmoji sang setLabel
                            .setStyle(ButtonStyle.Primary)
                    ))
                );
                hiddenRows.push(row); // Thêm hàng ẩn vào mảng hàng
            }

            await gameMessage.edit({
                content: `Hãy tìm chữ thần bí: ${targetText}`,
                components: hiddenRows
            });

            const filter = interaction => interaction.isButton() && interaction.user.id === msg.author.id;
            let revealRows = []; 

            const collector = gameMessage.createMessageComponentCollector({ filter, time: 10000 });

            collector.on('collect', async interaction => {
                try {
                    revealRows = []; 
                    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
                        const rowRevealTexts = texts.slice(rowIndex * 5, rowIndex * 5 + 5); // Lấy 5 chữ cho mỗi hàng
                        const row = new ActionRowBuilder().addComponents(
                            rowRevealTexts.map((text, i) => (
                                new ButtonBuilder()
                                    .setCustomId((rowIndex * 5 + i).toString()) // ID cho nút
                                    .setLabel(text) // Thay đổi từ setEmoji sang setLabel
                                    .setStyle(ButtonStyle.Primary)
                            ))
                        );
                        revealRows.push(row); // Thêm hàng hiện ra vào mảng hàng
                    }

                    if (texts[interaction.customId] === targetText) {
                        await interaction.reply({  // followUp
                            content: `Chúc mừng! Bạn đã tìm đúng chữ thần bí ${texts[interaction.customId]}!`,
                            components: revealRows,
                            ephemeral: true 
                        });
                    } else {
                        await interaction.reply({ // update
                            content: `Rất tiếc bạn đã chọn sai rồi\n` +
                                     `Chữ thần bí cần tìm là: ${targetText}\n` +
                                     `Bạn đã chọn chữ: ${texts[interaction.customId]}`, // ${interaction.customId} - 
                            components: revealRows
                        });
                    }

                    collector.stop();
                } catch (error) {
                    console.error(error);
                }
            });

            collector.on('end', async collected => {
                if (collected.size === 0) {
                    await gameMessage.edit({
                        content: `Thời gian đã hết! Chữ thần bí cần tìm là: ${targetText}`,
                        components: revealRows
                    });
                }
            });
            
        } catch (error) {
            console.error(error);
            msg.channel.send('Đã xảy ra lỗi trong quá trình thực hiện lệnh.');
        }
    }
};

// Hàm xáo trộn mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}