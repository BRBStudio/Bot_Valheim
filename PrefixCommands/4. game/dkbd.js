const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');
const ms = require('ms');
const economySystem = require('../../schemas/economySystem');

module.exports = {
    name: 'dkbd',
    description: 
        `🔸 Để chơi Dạ Khúc Bóng Đêm, bạn phải có các ô màu đen\n` +
        `       khắp bảng.\n\n` +
        `🔸 Để xem hướng dẫn dùng \`\`\`?dkbd h\`\`\``,
    aliases: ['dk', 'g1'],

    async execute(msg, args) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '?dkbd' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Kiểm tra nếu người dùng yêu cầu trợ giúp .toLowerCase() args[0] && args[0].toLowerCase()
        if (args[0] && args[0].toLowerCase() === 'h') {
            const helpEmbed = new EmbedBuilder()
                .setTitle('Hướng dẫn chơi Dạ Khúc Bóng Đêm')
                .setDescription(
                    `Chào mừng bạn đến với trò chơi Dạ Khúc Bóng Đêm! Dưới đây là hướng dẫn chi tiết: ⤵\n` +
                        `\n> NGUYÊN TẮC LẬT Ô 🔄:` +
                        `\n- Khi bạn lật một ô (bằng cách nhấn vào nút "🔄"), ô bạn đang đứng và các ô bên trên, dưới, trái, phải của ô đó cũng sẽ bị lật.` +
                        `\n- Nếu ô nào là trắng, sau khi lật nó sẽ trở thành đen, và ngược lại (đen sẽ trở thành trắng).` +
                        `\n↪ VD: bạn đang ở giữa bảng với ô màu trắng. Sau khi bạn nhấn lật thì ô hiện tại của bạn sẽ bị lật, tức là nếu ô màu trắng ` +
                        `nó sẽ thành màu đen, Các ô xung quanh sẽ thay đổi trạng thái (trắng thành đen, đen thành trắng).\n` +

                    `\n> TÍNH TOÁN CÁCH DI CHUYỂN ĐỂ CHIẾN THẮNG:` +
                        `\n- Để giành chiến thắng, bạn cần lật các ô một cách cẩn thận sao cho tất cả các ô trên bảng đều chuyển thành màu đen.` +
                        `\n- Do mỗi lần lật ô sẽ ảnh hưởng đến các ô xung quanh, bạn cần tính toán để sử dụng ít lượt nhất có thể.` +
                        `\n- Đôi khi bạn cần di chuyển đến vị trí khác trên bảng để có thể lật các ô xung quanh một cách hợp lý, ` +
                        `vì lật đi lật lại sẽ đưa các ô về lại trạng thái ban đầu.\n` +

                    `\n> CHIẾN LƯỢC CƠ BẢN:\n- Cố gắng lật các ô theo nhóm để nhanh chóng biến đổi nhiều ô thành màu đen hơn.` +
                        `\n- Bắt đầu từ các góc hoặc các cạnh của bảng, vì các ô ở vị trí này ít bị ảnh hưởng hơn so với các ô ở giữa bảng` +
                        `\n- Dùng thử từng nút lật ở các vị trí khác nhau để thấy ảnh hưởng của các lượt lật. Khi quen dần, bạn sẽ thấy mẫu thay đổi của các ô.` +
                        `\n- Ghi nhớ số lượt di chuyển và lật, và thử một cách logic để tất cả các ô thành màu đen.\n` +

                    `\n> CÁCH CHƠI ⬅️⬆️⬇️➡️:\n- Sử dụng các nút để di chuyển lên, xuống, trái, phải, và lật ô tại vị trí của bạn.` +
                        `\n- Mỗi khi bạn di chuyển, ô người chơi sẽ đổi màu (dựa theo trạng thái của ô bạn đang đứng)`
                )
                .setColor('Blue')
                .setTimestamp();

            return msg.channel.send({ embeds: [helpEmbed] });
        }

        const white = true;
        const black = false;
        const base = [white, black];
        const board = [];
        let Moves = 0;
        let Flips = 0;

        // Tạo bảng 5x5 với các giá trị true/false ngẫu nhiên
        for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                const rn = Math.floor(Math.random() * base.length);
                row.push(base[rn]);
            }
            board.push(row);
        }

        // Khởi tạo vị trí của người chơi ở giữa bảng
        let playerPos = { x: 2, y: 2 };

        // Hàm để hiển thị bảng với người chơi
        function displayBoard() {
            return board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (rowIndex === playerPos.x && colIndex === playerPos.y) {
                        return cell ? '🇹' : '🇩'; // Vòng tròn màu trắng hoặc đen dành cho người chơi '<a:trang:1301972985405767721>' : '<a:den:1301972980611551334>'
                    }
                    return cell ? '⬜' : '⬛';
                }).join('')
            ).join('\n');
        }

        let description = `\`\`\`Để chơi Dạ Khúc Bóng Đêm, bạn phải đạt được\ncác ô màu đen khắp bảng\`\`\``;

        // Hàm lật các ô
        function flipCells(x, y) {
            const positions = [
                { x, y }, // ô hiện tại
                { x: x - 1, y }, // ô trên
                { x: x + 1, y }, // ô dưới
                { x, y: y - 1 }, // ô bên trái
                { x, y: y + 1 } // ô bên phải
            ];

            positions.forEach(pos => {
                if (pos.x >= 0 && pos.x < 5 && pos.y >= 0 && pos.y < 5) {
                    board[pos.x][pos.y] = !board[pos.x][pos.y];
                }
            });
        }

        // Hàm kiểm tra xem một hàng có phải là tất cả black/false không
        function checkRow(row) {
            const set = new Set(row);
            return set.size === 1 && set.has(false);
        }

        // Hàm kiểm tra xem một cột có phải là tất cả black/false không
        function checkColumn(columnIndex) {
            return board.map(row => row[columnIndex]).every(cell => !cell);
        }

        // Tạo embed cho trò chơi
        const embed = new EmbedBuilder()
            .setTitle('Dạ Khúc Bóng Đêm!')
            .setAuthor({ iconURL: msg.author.displayAvatarURL(), name: msg.author.username })
            .setColor('Red')
            .setDescription(description)
            .setTimestamp();

        // Tạo các nút cho giao diện
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('dkbdUp').setEmoji('⬆️').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('dkbdFlip').setEmoji('🔄').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('dkbdDown').setEmoji('⬇️').setStyle(ButtonStyle.Primary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('dkbdLeft').setEmoji('⬅️').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('dkbdEnd').setEmoji('✖️').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('dkbdRight').setEmoji('➡️').setStyle(ButtonStyle.Primary)
        );

        const message = await msg.channel.send({ embeds: [embed.setDescription(`${description} ${displayBoard()}\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)], components: [row1, row2] });

        // Collector cho các nút
        const filter = i => {
            i.deferUpdate();
            return i.user.id === msg.author.id;
        };
        
        const collector = message.createMessageComponentCollector({ filter, time: ms('1m') });

        collector.on('collect', async (i) => {

            // Di chuyển người chơi
            if (i.customId === 'dkbdUp' && playerPos.x > 0) {
                playerPos = { x: playerPos.x - 1, y: playerPos.y };
            }
            if (i.customId === 'dkbdDown' && playerPos.x < 4) {
                playerPos = { x: playerPos.x + 1, y: playerPos.y };
            }
            if (i.customId === 'dkbdLeft' && playerPos.y > 0) {
                playerPos = { x: playerPos.x, y: playerPos.y - 1 };
            }
            if (i.customId === 'dkbdRight' && playerPos.y < 4) {
                playerPos = { x: playerPos.x, y: playerPos.y + 1 };
            }

            Moves += 1;

            // Cập nhật hiển thị bảng
            await message.edit({ embeds: [embed.setDescription(`${description} ${displayBoard()}\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)] });

            // Lật ô
            if (i.customId === 'dkbdFlip') {
                flipCells(playerPos.x, playerPos.y);
                Flips += 1;

                if (checkRow(board[playerPos.x]) && checkColumn(playerPos.y)) {
                    await message.edit({ embeds: [embed.setDescription(`${description} ${displayBoard()}\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**\n\nTrò chơi kết thúc! Bạn đã thắng!`)] });
                    collector.stop('Chiến thắng');
                }
            }

            // Nút thoát
            if (i.customId === 'dkbdEnd') {
                await message.edit({ embeds: [embed.setDescription(`${description} ${displayBoard()}\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)] });
                collector.stop('Khó quá');
            }

            collector.resetTimer();
        });

        collector.on('end', async (collected) => {
            try {
                // Thử truy cập tin nhắn để kiểm tra xem nó còn tồn tại không
                const fetchedMessage = await message.channel.messages.fetch(message.id);
                const reason = `Hết thời gian` 

                // Nếu tin nhắn tồn tại, thực hiện chỉnh sửa
                await fetchedMessage.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Dạ Khúc Bóng Đêm')
                            .setDescription(`Trò chơi đã kết thúc.\nLý do: \`${reason}\`\nĐiểm số cuối cùng: ⤵\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)
                    ],
                    components: []
                });
            } catch (error) {
                // Nếu tin nhắn không tồn tại (bị xóa), bỏ qua lỗi
                if (error.code === 10008) {
                    // console.log('Tin nhắn đã bị xóa, bỏ qua việc chỉnh sửa.');
                } else {
                    console.error('Lỗi không mong muốn:', error);
                }
            }
        });
        
    }
};
















///////////////////// mức dễ

// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const ms = require('ms');

// module.exports = {
//     name: 'danceofdarkness',
//     description: 'Để chơi Dạ Khúc Bóng Đêm, bạn phải có các ô màu đen khắp bảng',
//     aliases: ['dod', 'ds'],
//     async execute(msg, args) {
//         const white = true;
//         const black = false;
//         const base = [white, black];
//         const board = [];
//         let Moves = 0;
//         let Flips = 0;

//         // Tạo bảng 5x5 với các giá trị true/false ngẫu nhiên
//         for (let i = 0; i < 5; i++) {
//             const row = [];
//             for (let j = 0; j < 5; j++) {
//                 const rn = Math.floor(Math.random() * base.length);
//                 row.push(base[rn]);
//             }
//             board.push(row);
//         }

//         // Khởi tạo vị trí của người chơi ở giữa bảng
//         let playerPos = { x: 2, y: 2 };

//         // Hàm để hiển thị bảng với người chơi
//         function displayBoard() {
//             return board.map((row, rowIndex) =>
//                 row.map((cell, colIndex) => {
//                     if (rowIndex === playerPos.x && colIndex === playerPos.y) {
//                         return cell ? '<a:trang:1301972985405767721>' : '<a:den:1301972980611551334>'; // Vòng tròn màu trắng hoặc đen dành cho người chơi
//                     }
//                     return cell ? '⬜' : '⬛';
//                 }).join('')
//             ).join('\n');
//         }

//         let description = `\`\`\`Để chơi Dạ Khúc Bóng Đêm, bạn phải đạt được\ncác ô màu đen khắp bảng\`\`\``;

//         // Hàm lật các ô
//         function flipCells(x, y) {
//             const positions = [
//                 { x, y }, // ô hiện tại
//                 { x: x - 1, y }, // ô trên
//                 { x: x + 1, y }, // ô dưới
//                 { x, y: y - 1 }, // ô bên trái
//                 { x, y: y + 1 } // ô bên phải
//             ];

//             positions.forEach(pos => {
//                 if (pos.x >= 0 && pos.x < 5 && pos.y >= 0 && pos.y < 5) {
//                     board[pos.x][pos.y] = !board[pos.x][pos.y]; // Lật ô
//                 }
//             });
//         }

//         // Tạo embed cho trò chơi
//         const embed = new EmbedBuilder()
//             .setTitle('Dạ Khúc Bóng Đêm!')
//             .setAuthor({ iconURL: msg.author.displayAvatarURL(), name: msg.author.username })
//             .setColor('Red')
//             .setDescription(description)
//             .setTimestamp();

//         // Tạo các nút cho giao diện
//         const row1 = new ActionRowBuilder().addComponents(
//             new ButtonBuilder().setCustomId('dkbdUp').setEmoji('⬆️').setStyle(ButtonStyle.Primary),
//             new ButtonBuilder().setCustomId('dkbdFlip').setEmoji('🔄').setStyle(ButtonStyle.Success),
//             new ButtonBuilder().setCustomId('dkbdDown').setEmoji('⬇️').setStyle(ButtonStyle.Primary)
//         );

//         const row2 = new ActionRowBuilder().addComponents(
//             new ButtonBuilder().setCustomId('dkbdLeft').setEmoji('⬅️').setStyle(ButtonStyle.Primary),
//             new ButtonBuilder().setCustomId('dkbdEnd').setEmoji('✖️').setStyle(ButtonStyle.Danger),
//             new ButtonBuilder().setCustomId('dkbdRight').setEmoji('➡️').setStyle(ButtonStyle.Primary)
//         );

//         const message = await msg.channel.send({ embeds: [embed.setDescription(`${description} ${displayBoard()}\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)], components: [row1, row2] });

//         // Collector cho các nút
//         const filter = i => {
//             i.deferUpdate();
//             return i.user.id === msg.author.id;
//         };
        
//         const collector = message.createMessageComponentCollector({ filter, time: ms('5m') });

//         collector.on('collect', async (i) => {
//             // Di chuyển người chơi
//             if (i.customId === 'dkbdUp' && playerPos.x > 0) {
//                 playerPos = { x: playerPos.x - 1, y: playerPos.y };
//             }
//             if (i.customId === 'dkbdDown' && playerPos.x < 4) {
//                 playerPos = { x: playerPos.x + 1, y: playerPos.y };
//             }
//             if (i.customId === 'dkbdLeft' && playerPos.y > 0) {
//                 playerPos = { x: playerPos.x, y: playerPos.y - 1 };
//             }
//             if (i.customId === 'dkbdRight' && playerPos.y < 4) {
//                 playerPos = { x: playerPos.x, y: playerPos.y + 1 };
//             }

//             Moves += 1;

//             // Cập nhật hiển thị bảng
//             await message.edit({ embeds: [embed.setDescription(`${description} ${displayBoard()}\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)] });

//             // Lật ô
//             if (i.customId === 'dkbdFlip') {
//                 flipCells(playerPos.x, playerPos.y);
//                 Flips += 1;

//                 // Không cần kiểm tra điều kiện thắng ở đây
//             }

//             // Nút thoát
//             if (i.customId === 'dkbdEnd') {
//                 await message.edit({ embeds: [embed.setDescription(`${description} ${displayBoard()}\nSố lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)] });
//                 collector.stop('Quit');
//             }

//             collector.resetTimer();
//         });

//         // Khi collector kết thúc
//         collector.on('end', async (collected, reason) => {
//             await message.edit({
//                 embeds: [
//                     new EmbedBuilder()
//                         .setTitle('Dạ Khúc Bóng Đêm')
//                         .setDescription(`Trò chơi đã kết thúc.\nLý do: \`${reason}\`\nĐiểm số cuối cùng: Số lần di chuyển: **${Moves}** Số lần lật: **${Flips}**`)
//                 ],
//                 components: []
//             });
//         });
//     }
// };

