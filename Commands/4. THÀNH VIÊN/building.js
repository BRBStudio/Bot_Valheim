const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require(`../../config`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
                .setName('building')
                .setDescription('🔹 Công trình xây dựng tham khảo và hướng dẫn.')
                .addStringOption(option => 
                    option.setName('valheim')
                        .setDescription('Chọn công trình bạn muốn tham khảo hoặc xem hướng dẫn.')
                        .addChoices(
                        { name: `• Nhà thời trung cổ`, value: `https://www.youtube.com/watch?v=k4Zaq1Lm1QI` },
                        { name: `• 3 ngôi nhà dễ xây dựng`, value: `https://www.youtube.com/watch?v=zGisnSqe53U` },
                        { name: `• Ngôi nhà thợ rèn`, value: `https://www.youtube.com/watch?v=f4HFFcrCL3w` },
                        { name: `• Biệt Thự Hiện Đại (Có Hồ Bơi)`, value: `https://www.youtube.com/watch?v=GDG_-A--jGU&t=2s` },
                        { name: `• 10 bản dựng yêu thích nhất mọi thời đại của tôi`, value: `https://www.youtube.com/watch?v=XECVzH7tG9s` },
                        { name: `• Căn cứ sông tuyệt đẹp ở Valheim`, value: `https://www.youtube.com/watch?v=CzVFETBc0lM` },
                        { name: `• Thiết kế thông minh và thực tế`, value: `https://www.youtube.com/watch?v=Dac1oWr_9dQ` },
                        { name: `• Xây dựng ngôi nhà khởi đầu trong 20 phút`, value: `https://www.youtube.com/watch?v=5uItb0K1iEs` },
                        { name: `• Cuộc thi xây nhà trên trời`, value: `https://www.youtube.com/watch?v=WOhzWUjAdlw` },
                        { name: `• Cuộc hành trình của Valheim Survival`, value: `https://www.youtube.com/watch?v=mJ25X8BKP4Y&t=9795s` },
                        { name: `• Xây dựng nhà Hobbit dưới lòng đất`, value: `https://www.youtube.com/watch?v=Qqsz7D2gfik` },
                        { name: `• Căn cứ khởi đầu Homestead`, value: `https://www.youtube.com/watch?v=5Z6HUmKnE7I` },
                        { name: `• Cách xây dựng căn cứ tiền đồn tối thượng`, value: `https://www.youtube.com/watch?v=5eeJbXSQnDE` },
                        { name: `• Nhà theo phong cách Tudor (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=-lCapQm2HtI&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0` },
                        { name: `• Chuồng ngựa Ashwood - Lox Pen (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=zRpMuxH9WSQ&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=6` },
                        { name: `• Cách xây dựng lâu đài - Pháo đài Meadows (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=zg_zthS3Qy8&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=16` },
                        { name: `• Cách xây dựng trang trại nuôi ong - Xây dựng trại nuôi ong - (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=iB9fBygaL7g&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=19` },
                        { name: `• Cách xây dựng bến tàu nhỏ - Cảng Seawall - (Hướng dẫn xây dựng)`, value: `https://www.youtube.com/watch?v=HqbiOl6QITU&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=31` },
                        { name: `• Xây dựng một căn cứ đồng bằng treo`, value: `https://www.youtube.com/watch?v=z3R4WZ0AG8Y` },
                        { name: `• Xây dựng1`, value: `https://www.youtube.com/watch?v=Mn0iuUWc5cQ` },
                        { name: `• Làng Valheim`, value: `https://www.youtube.com/watch?v=bPzFaaWOikA` },
                        { name: `• Tòa nhà bên hồ tuyệt đẹp`, value: `https://www.youtube.com/watch?v=3csU1HTCNEc`}
                        )
                        .setRequired(true)
                    ),

    async execute(interaction, client) {

                // Kiểm tra trạng thái của lệnh
                const commandStatus = await CommandStatus.findOne({ command: '/building' });

                // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
                if (commandStatus && commandStatus.status === 'off') {
                    return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
                }

                const audioURL = await interaction.options.getString('valheim');
                // const optionName = interaction.options.get('valheim').choices.find(choice => choice.value === audioURL).name;

                // Định nghĩa ánh xạ giữa giá trị và tên
                const choicesMap = {
                    'https://www.youtube.com/watch?v=k4Zaq1Lm1QI': 'Nhà thời trung cổ',
                    'https://www.youtube.com/watch?v=zGisnSqe53U': '3 ngôi nhà dễ xây dựng',
                    'https://www.youtube.com/watch?v=f4HFFcrCL3w': 'Ngôi nhà thợ rèn',
                    'https://www.youtube.com/watch?v=GDG_-A--jGU&t=2s': 'Biệt Thự Hiện Đại (Có Hồ Bơi)',
                    'https://www.youtube.com/watch?v=XECVzH7tG9s': '10 bản dựng yêu thích nhất mọi thời đại của tôi',
                    'https://www.youtube.com/watch?v=CzVFETBc0lM': 'Căn cứ sông tuyệt đẹp ở Valheim',
                    'https://www.youtube.com/watch?v=Dac1oWr_9dQ': 'Thiết kế thông minh và thực tế',
                    'https://www.youtube.com/watch?v=5uItb0K1iEs': 'Xây dựng ngôi nhà khởi đầu trong 20 phút',
                    'https://www.youtube.com/watch?v=WOhzWUjAdlw': 'Cuộc thi xây nhà trên trời',
                    'https://www.youtube.com/watch?v=mJ25X8BKP4Y&t=9795s': 'Cuộc hành trình của Valheim Survival',
                    'https://www.youtube.com/watch?v=Qqsz7D2gfik': 'Xây dựng nhà Hobbit dưới lòng đất',
                    'https://www.youtube.com/watch?v=5Z6HUmKnE7I': 'Căn cứ khởi đầu Homestead',
                    'https://www.youtube.com/watch?v=5eeJbXSQnDE': 'Cách xây dựng căn cứ tiền đồn tối thượng',
                    'https://www.youtube.com/watch?v=-lCapQm2HtI&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0': 'Nhà theo phong cách Tudor (Hướng dẫn xây dựng)',
                    'https://www.youtube.com/watch?v=zRpMuxH9WSQ&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=6': 'Chuồng ngựa Ashwood - Lox Pen (Hướng dẫn xây dựng)',
                    'https://www.youtube.com/watch?v=zg_zthS3Qy8&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=16': 'Cách xây dựng lâu đài - Pháo đài Meadows (Hướng dẫn xây dựng)',
                    'https://www.youtube.com/watch?v=iB9fBygaL7g&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=19': 'Cách xây dựng trang trại nuôi ong - Xây dựng trại nuôi ong - (Hướng dẫn xây dựng)',
                    'https://www.youtube.com/watch?v=HqbiOl6QITU&list=PLIJ2gWXV7b05syGXrWsRmwR9VialZNWs0&index=31': 'Cách xây dựng bến tàu nhỏ - Cảng Seawall - (Hướng dẫn xây dựng)',
                    'https://www.youtube.com/watch?v=z3R4WZ0AG8Y': 'Xây dựng một căn cứ đồng bằng treo',
                    'https://www.youtube.com/watch?v=Mn0iuUWc5cQ': 'Xây dựng1',
                    'https://www.youtube.com/watch?v=bPzFaaWOikA': 'Làng Valheim',
                    'https://www.youtube.com/watch?v=3csU1HTCNEc': 'Tòa nhà bên hồ tuyệt đẹp'
                };

                // Tra cứu tên từ giá trị được chọn
                const selectedName = choicesMap[audioURL];

                // Mảng các câu chúc
                const greetings = [
                    "Chúc bạn tìm được công trình mong muốn!",
                    "Hy vọng bạn thích công trình này!",
                    "Thưởng thức những công trình tuyệt vời!",
                    "Thỏa sức sáng tạo dự án của bạn nào!",
                    "Chúc bạn có một trải nghiệm với các công trình tuyệt vời!",
                    "Chúc bạn có được công trình của riêng mình!",
                    "Chúc bạn một ngày tràn đầy năng lượng!",
                    "Công trình của bạn sẽ làm cho cuộc sống thêm màu sắc!",
                    "Hãy để bộ não sáng tạo của bạn dẫn lối cho mọi người!",
                    "Thưởng thức và chia sẻ công trình của bạn đi nào!",
                    "Không ngừng trau dồi kinh nghiệm và thỏa sức sáng tạo tại máy chủ ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★!",
                    "Mỗi 1 công trình là tâm huyết cũng như bộ não vĩ đại mà chúng ta cần tôn vinh!",
                    "Mọi thứ thật tuyệt nếu bạn tìm được điều gì đó ở đây!",
                    "Mọi cố gắng của bạn sẽ đạt được kết quả hơn mong đợi!",
                ];
            
                // Mảng các emoji
                const emojis = [
                    "<a:WFrnwNjgoF:1248522989872615496>",
                    "<a:5hhiw1eAQ0:1248522931496157226>",
                    "<a:Veft_MyLsk:1248523040980205632>",
                    "<a:XpCTvfoAzX:1248522890026942464>",
                    "<a:9CsV6kHu65:1248522384579760128>"
                ];

                // Mảng các emoji1
                const emojis1 = [
                    "<a:6oSVQ9p5aJ:1248522733936181289>",
                    "<a:YAktQsxmKQ:1248522623017812082>",
                    "<a:ech7:1234014842004705360>",
                    "<a:7297girlshooting:1173366037627031682>",
                    "<a:hanyaCheer:1173363092353200158>",
                    "<a:troll_dance:1173362886920372285>"
                ];
            
                // Mảng các hình thu nhỏ
                const thumbnails = [
                    "https://media.tenor.com/aMRKq2mclCAAAAAM/valheim-cool.gif",
                    "https://i.redd.it/8afy5ye8lbi61.gif",
                    "https://i.redd.it/jx5xkb8b44671.gif",
                    "https://preview.redd.it/villa-in-the-woods-modded-v0-msqcqcvvgqn81.jpg?width=1080&crop=smart&auto=webp&s=bc23cd207fdc198b9ee0bb1181368f5283084349",
                    "https://ontonixqcm.blog/wp-content/uploads/2015/07/greece_2-1.gif"
                ];

                // Chọn ngẫu nhiên một câu chúc, emoji, và hình thu nhỏ
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                const randomEmoji1 = emojis1[Math.floor(Math.random() * emojis1.length)];
                const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

                const embed = new EmbedBuilder()
                    .setColor(config.embedCyan)
                    .setDescription(`${randomEmoji1} **\`Tên công trình:\`\n\`\`\`yml\n${selectedName}\`\`\`**\n\n<a:hanyaCheer:1173363092353200158> | [**Hãy click vào đây để xem công trình**](${audioURL})\n\n${randomEmoji} | **${randomGreeting}**`)
                    .setThumbnail(randomThumbnail)
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
    }
}