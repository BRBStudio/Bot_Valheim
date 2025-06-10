const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');
const economySystem = require('../../schemas/economySystem');

module.exports = {
    name: 'minesweeper',
    description: '🔸 Chơi trò Dò Mìn!',
    aliases: ['dm', 'g7'],

    async execute(msg, args) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?minesweeper' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        try {
            const gridSize = 5; // Kích thước bảng 5x5
            const mineCount = Math.floor(Math.random() * 7) + 3; // Số mìn ngẫu nhiên

            // console.log(`Khởi tạo trò chơi với kích thước: ${gridSize}x${gridSize} và số mìn: ${mineCount}`);

            const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0)); // Tạo lưới với tất cả ô là 0
            let placedMines = 0; // Số mìn đã đặt

            // Đặt mìn và cập nhật số mìn xung quanh
            while (placedMines < mineCount) {
                const x = Math.floor(Math.random() * gridSize); // Tọa độ x ngẫu nhiên
                const y = Math.floor(Math.random() * gridSize); // Tọa độ y ngẫu nhiên
                if (grid[x][y] === -1) continue; // Nếu ô đã có mìn, bỏ qua

                grid[x][y] = -1; // Đặt mìn
                placedMines++;

                // Tăng số đếm ở các ô lân cận
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && grid[nx][ny] !== -1) {
                            grid[nx][ny]++; // Tăng số mìn xung quanh
                        }
                    }
                }
            }

            // console.log('Vị trí các ô chứa mìn:');

            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (grid[i][j] === -1) {
                        // console.log(`Mìn tại ô (${i}, ${j})`);
                    }
                }
            }

            // Tạo bảng nút ban đầu
            function createBoard() {
                const buttons = [];
                for (let i = 0; i < gridSize; i++) {
                    const row = new ActionRowBuilder();
                    for (let j = 0; j < gridSize; j++) {
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`${i}-${j}`) // Tạo customId cho từng ô
                                .setLabel('❓') // Nhãn mặc định
                                .setStyle(ButtonStyle.Secondary) // Phong cách của nút
                        );
                    }
                    buttons.push(row);
                }
                return buttons;
            }

            let boardComponents = createBoard();
            const gameMessage = await msg.channel.send({
                content: `Chơi Dò Mìn!`,
                components: boardComponents
            });

            const filter = interaction => interaction.isButton() && interaction.user.id === msg.author.id;
            const collector = gameMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async interaction => {
                await interaction.deferUpdate();

                // Lấy tọa độ từ customId mà không dùng split
                const coordinates = interaction.customId;
                const x = Number(coordinates.charAt(0)); // Lấy tọa độ x
                const y = Number(coordinates.charAt(2)); // Lấy tọa độ y

                if (grid[x][y] === -1) { // Nếu là ô chứa mìn
                    // Cập nhật bảng để hiển thị tất cả các ô mìn và ô an toàn với số mìn xung quanh
                    const updatedBoardComponents = boardComponents.map((row, i) =>
                        new ActionRowBuilder().addComponents(
                            row.components.map((button, j) => {
                                const newButton = ButtonBuilder.from(button); // Tạo bản sao của button
                                if (grid[i][j] === -1) {
                                    newButton.setLabel('💣').setStyle(ButtonStyle.Danger); // Hiện mìn
                                } else {
                                    newButton.setLabel(grid[i][j] > 0 ? grid[i][j].toString() : '✔️').setStyle(ButtonStyle.Primary);
                                }
                                // Đánh dấu ô đã chọn
                                if (i === x && j === y) {
                                    newButton.setStyle(ButtonStyle.Danger).setLabel('💣'); // Nút đã chọn
                                } else if (button.data.label === '❓') {
                                    newButton.setStyle(ButtonStyle.Secondary); // Nút chưa chọn
                                } else {
                                    newButton.setStyle(ButtonStyle.Primary); // Nút an toàn đã mở
                                }
                                return newButton;
                            })
                        )
                    );

                    await gameMessage.edit({
                        content: '💣 Bạn đã dẫm phải mìn! Rất tiếc bạn đã thua! Hãy tiếp tục dùng ?g5 để chơi lại.',
                        components: updatedBoardComponents
                    });
                    collector.stop(); // Dừng trò chơi
                } else { // Nếu là ô an toàn
                    const label = grid[x][y] > 0 ? grid[x][y].toString() : '✔️';
                    boardComponents[x].components[y].setLabel(label).setStyle(ButtonStyle.Primary);

                    const openedCells = boardComponents.flatMap(row => row.components).filter(button => button.data.label !== '❓').length;
                    if (openedCells === (gridSize * gridSize) - mineCount) {
                        await gameMessage.edit({
                            content: '🎉 Chúc mừng! Bạn đã mở tất cả các ô an toàn!',
                            components: boardComponents
                        });
                        collector.stop(); // Dừng trò chơi
                    } else {
                        await gameMessage.edit({
                            content: `Chơi Dò Mìn!`,
                            components: boardComponents
                        });
                    }
                }
            });

            collector.on('end', async () => {
                await msg.channel.send('Thời gian chơi đã kết thúc!');
            });
        } catch (error) {
            // console.error('Lỗi trong quá trình chạy game:', error);
            await msg.channel.send('Đã xảy ra lỗi khi khởi động trò chơi.');
        }
    },
};





































//////////////13 hàng nút
// // Nhập các thành phần cần thiết từ thư viện discord.js
// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// // Xuất module với các thông tin về lệnh
// module.exports = {
//     name: 'minesweeper',
//     description: 'Chơi trò Dò Mìn!',
//     aliases: ['ms', 'g5'],
//     async execute(msg, args) {
//         try {
//             // Kiểm tra nếu người dùng yêu cầu trợ giúp
//             if (args[0] === 'help') {
//                 // Tạo một embed để hướng dẫn chơi
//                 const helpEmbed = new EmbedBuilder()
//                     .setTitle('Hướng dẫn chơi Dò Mìn')
//                     .setDescription('Dưới đây là cách chơi trò Dò Mìn:\n')
//                     .addFields(
//                         { name: 'Bước 1:', value: 'Bảng sẽ có kích thước 13x13 và chứa một số ô.' },
//                         { name: 'Bước 2:', value: 'Có một số ô chứa mìn. Nhiệm vụ của bạn là tìm ô an toàn mà không chạm vào mìn.' },
//                         { name: 'Bước 3:', value: 'Nhấn vào ô mà bạn muốn mở. Nếu bạn chọn ô chứa mìn, bạn sẽ thua.' },
//                         { name: 'Bước 4:', value: 'Nếu bạn mở tất cả các ô an toàn mà không chạm vào mìn, bạn sẽ thắng!' }
//                     )
//                     .setColor('Green')
//                     .setTimestamp();

//                 return msg.channel.send({ embeds: [helpEmbed] }); // Gửi thông báo trợ giúp
//             }

//             // Khởi tạo kích thước bảng và số lượng mìn
//             const gridSize = 13; // Kích thước bảng 13x13
//             const mineCount = Math.floor(Math.random() * 5) + 5; // Số lượng mìn từ 5 đến 9

//             // Tạo bảng ô và đặt mìn
//             const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
//             for (let i = 0; i < mineCount; i++) {
//                 let minePosition;
//                 do {
//                     minePosition = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
//                 } while (grid[minePosition[0]][minePosition[1]] === -1); // Kiểm tra xem vị trí đã có mìn chưa
//                 grid[minePosition[0]][minePosition[1]] = -1; // Đặt mìn

//                 // Tăng số lượng mìn xung quanh ô chứa mìn
//                 for (let x = -1; x <= 1; x++) {
//                     for (let y = -1; y <= 1; y++) {
//                         const newX = minePosition[0] + x;
//                         const newY = minePosition[1] + y;
//                         // Kiểm tra các ô lân cận
//                         if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && grid[newX][newY] !== -1) {
//                             grid[newX][newY]++;
//                         }
//                     }
//                 }
//             }

//             // Tạo bảng thông tin ô
//             const buttons = [];
//             for (let i = 0; i < gridSize; i++) {
//                 for (let j = 0; j < gridSize; j++) {
//                     buttons.push(new ButtonBuilder()
//                         .setCustomId(`${i}-${j}`) // Đặt ID cho mỗi nút tương ứng với vị trí ô
//                         .setLabel('❓') // Gán nhãn cho các nút là dấu hỏi ban đầu
//                         .setStyle(ButtonStyle.Secondary));
//                 }
//             }

//             // Tạo các hàng với tối đa 5 nút mỗi hàng
//             const row1 = new ActionRowBuilder().addComponents(buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]);
//             const row2 = new ActionRowBuilder().addComponents(buttons[5], buttons[6], buttons[7], buttons[8], buttons[9]);
//             const row3 = new ActionRowBuilder().addComponents(buttons[10], buttons[11], buttons[12], buttons[13], buttons[14]);
//             const row4 = new ActionRowBuilder().addComponents(buttons[15], buttons[16], buttons[17], buttons[18], buttons[19]);
//             const row5 = new ActionRowBuilder().addComponents(buttons[20], buttons[21], buttons[22], buttons[23], buttons[24]);
//             const row6 = new ActionRowBuilder().addComponents(buttons[25], buttons[26], buttons[27], buttons[28], buttons[29]);
//             const row7 = new ActionRowBuilder().addComponents(buttons[30], buttons[31], buttons[32], buttons[33], buttons[34]);
//             const row8 = new ActionRowBuilder().addComponents(buttons[35], buttons[36], buttons[37], buttons[38], buttons[39]);
//             const row9 = new ActionRowBuilder().addComponents(buttons[40], buttons[41], buttons[42], buttons[43], buttons[44]);
//             const row10 = new ActionRowBuilder().addComponents(buttons[45], buttons[46], buttons[47], buttons[48], buttons[49]);
//             const row11 = new ActionRowBuilder().addComponents(buttons[50], buttons[51], buttons[52], buttons[53], buttons[54]);
//             const row12 = new ActionRowBuilder().addComponents(buttons[55], buttons[56], buttons[57], buttons[58], buttons[59]);
//             const row13 = new ActionRowBuilder().addComponents(buttons[60], buttons[61], buttons[62], buttons[63], buttons[64]);

//             // Gửi bảng 1
//             const gameMessage = await msg.channel.send({
//                 content: 'Chơi Dò Mìn! Nhấn vào các ô để mở.',
//                 components: [row1, row2, row3, row4, row5]
//             });

//             // Gửi bảng 2
//             const gameMessage1 = await msg.channel.send({
//                 content: 'Chơi Dò Mìn! Nhấn vào các ô để mở.',
//                 components: [row6, row7, row8, row9, row10]
//             });

//             // Gửi bảng 3
//             const gameMessage2 = await msg.channel.send({
//                 content: 'Chơi Dò Mìn! Nhấn vào các ô để mở.',
//                 components: [row11, row12, row13]
//             });

//             // Tạo bộ lọc chỉ cho phép người gửi tin nhắn tương tác
//             const filter = interaction => interaction.isButton() && interaction.user.id === msg.author.id;

//             // Chờ người chơi chọn trong vòng 10 giây
//             const collector = gameMessage.createMessageComponentCollector({ filter }); // Dùng gameMessage để bắt đầu collector

//             collector.on('collect', async interaction => {
//                 const [x, y] = interaction.customId.split('-').map(Number); // Lấy vị trí từ ID nút

//                 if (grid[x][y] === -1) { // Kiểm tra nếu chọn ô chứa mìn
//                     await interaction.reply('💣 Bạn đã chọn ô chứa mìn! Bạn thua!'); // Thông báo thua
//                     collector.stop(); // Kết thúc trò chơi
//                     return;
//                 } else {
//                     // Nếu chọn ô an toàn, hiển thị thông báo
//                     await interaction.reply(`✅ Bạn đã mở ô tại vị trí (${x + 1}, ${y + 1}). Số mìn xung quanh: ${grid[x][y]}`);
//                     buttons[x * gridSize + y].setLabel(grid[x][y] > 0 ? grid[x][y].toString() : '✔️'); // Cập nhật nút để hiển thị ô đã mở
//                 }

//                 // Kiểm tra xem người chơi đã thắng chưa
//                 const openedCells = buttons.filter(button => button.data.label !== '❓').length; // Đếm số ô đã mở
//                 if (openedCells === buttons.length - mineCount) {
//                     await interaction.followUp('🎉 Chúc mừng! Bạn đã mở tất cả các ô an toàn!');
//                     collector.stop(); // Kết thúc trò chơi
//                 }

//                 // Cập nhật bảng
//                 await gameMessage.edit({
//                     content: 'Chơi Dò Mìn! Nhấn vào các ô để mở.',
//                     components: [row1, row2, row3, row4, row5] // Cập nhật bảng với các nút
//                 });
//             });

//             collector.on('end', async collected => {
//                 if (collected.size === 0) {
//                     await msg.channel.send('Thời gian đã hết! Bạn không có lượt nào.');
//                 }
//             });
//         } catch (error) {
//             console.error('Lỗi trong quá trình chạy game:', error);
//             await msg.channel.send('Đã xảy ra lỗi khi khởi động trò chơi.');
//         }
//     },
// };