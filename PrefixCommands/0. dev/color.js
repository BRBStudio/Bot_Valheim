const { EmbedBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');
const Color = require('color');
const config = require('../../config');
const translate = require('translate-google');

/*
tìm bảng màu để viết code
*/

module.exports = {
    name: 'color',
    description: '`🔸 LỆNH DÀNH CHO DEV`',
    hd: '`🔸 Cách dùng: Không có thông tin`',
    q: '`🔸 Dành cho DEV`',
    aliases: ['cl', 'dev3'],
    async execute(msg) {
        const commandStatus = await CommandStatus.findOne({ command: '?color' });
        if (commandStatus && commandStatus.status === 'off') {
            return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        if (!config.specialUsers.includes(msg.author.id)) {
            return msg.channel.send("Bạn không có quyền sử dụng lệnh này!");
        }

        const args = msg.content.split(' ').slice(1);
        if (args.length === 0) {
            return msg.channel.send('Vui lòng nhập tên màu hoặc mã hex.');
        }

        let input = args.join(' ').trim().toLowerCase();

        // Xử lý đặc biệt cho các từ "vàng" và "cam"
        if (input === 'vàng') input = 'yellow';
        if (input === 'cam') input = 'orange';
        if (input === 'xanh đẹp') input = 'cyan';

        const isHex = /^#?[0-9A-Fa-f]{6}$/.test(input);
        const isEnglishColor = (() => {
            try {
                Color(input);
                return true;
            } catch {
                return false;
            }
        })();

        if (!isHex && !isEnglishColor) {
            try {
                input = await translate(input, { from: 'vi', to: 'en' });
            } catch (error) {
                return msg.channel.send('Không thể dịch tên màu, vui lòng thử lại.');
            }
        }

        let color;
        try {
            color = Color(input);
        } catch (error) {
            return msg.channel.send('Đầu vào màu không hợp lệ. Vui lòng nhập đúng, ví dụ: đỏ, red, vàng, yellow hoặc mã HEX như #FF0000, #FFFF00.');
        }

        const hex = color.hex();
        const rgb = color.rgb().array();
        const rgbString = color.rgb().string();
        const hsl = color.hsl().string();
        const cmyk = color.cmyk().array();
        const cmykFormatted = `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
        const hsv = color.hsv().string();
        const lab = color.lab().array().join(', ');
        const xyz = color.xyz().array().join(', ');
        const lch = color.lch().array().join(', ');

        const getAnsi256 = (r, g, b) => {
            const ansi256 = Math.round((r / 255) * 5) * 36 + Math.round((g / 255) * 5) * 6 + Math.round((b / 255) * 5) + 16;
            return `\\x1b[38;5;${ansi256}m`;
        };

        const ansi = getAnsi256(rgb[0], rgb[1], rgb[2]);

        const embed = new EmbedBuilder()
            .setColor(parseInt(hex.replace('#', ''), 16))
            .setTitle('Thông tin màu')
            .addFields(
                { name: '**HEX**', value: `\`\`\`${hex}\`\`\``, inline: true },
                { name: '**RGB**', value: `\`\`\`${rgbString}\`\`\``, inline: true },
                { name: '**HSL**', value: `\`\`\`${hsl}\`\`\``, inline: true },
                { name: '**CMYK**', value: `\`\`\`${cmykFormatted}\`\`\``, inline: true },
                { name: '**HSV**', value: `\`\`\`${hsv}\`\`\``, inline: true },
                { name: '**LAB**', value: `\`\`\`${lab}\`\`\``, inline: true },
                { name: '**XYZ**', value: `\`\`\`${xyz}\`\`\``, inline: true },
                { name: '**LCH**', value: `\`\`\`${lch}\`\`\``, inline: true },
                { name: '**ANSI**', value: `\`\`\`${ansi}\`\`\``, inline: false },
            );

        await msg.channel.send({ embeds: [embed] });
    },
};



// const { EmbedBuilder } = require('discord.js');
// const CommandStatus = require('../../schemas/Command_Status');
// const Color = require('color');
// const config = require('../../config');
// const translate = require(`translate-google`); //@iamtraction/google-translate

// // Bảng ánh xạ tên màu tiếng Việt sang tiếng Anh
// const colorMap = {

//     'vàng': 'yellow',
//     'xanh': 'blue',
//     'xanh lá': 'green',
//     'cam': 'orange',
//     'tím': 'purple',
//     'hồng': 'pink',
//     'nâu': 'brown',
//     'xanh yêu thích': `cyan`
// };

// module.exports = {
//     name: 'color',
//     description: '`🔸 LỆNH DÀNH CHO DEV`',
//     hd: '`🔸 Cách dùng: Không có thông tin`',
//     q: '`🔸 Dành cho DEV`',
//     aliases: ['cl', 'dev3'],
//     async execute(msg) {
//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '?color' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return msg.channel.send('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         // Kiểm tra quyền người dùng
//         if (!config.specialUsers.includes(msg.author.id)) {
//             return msg.channel.send("Bạn không có quyền sử dụng lệnh này!");
//         }

//         // Lấy đầu vào từ tin nhắn sau lệnh tiền tố
//         const args = msg.content.split(' ').slice(1);
//         if (args.length === 0) {
//             return msg.channel.send('Vui lòng nhập tên màu hoặc mã hex.');
//         }

//         let input = args.join(' ').trim().toLowerCase();

//         // Kiểm tra xem đầu vào có phải tên màu tiếng Việt không
//         if (colorMap[input]) {
//             input = colorMap[input]; // Ánh xạ sang tên màu tiếng Anh
//         }

//         // Nếu đầu vào không phải mã HEX hoặc tên màu tiếng Anh, thử dịch
//         const isHex = /^#?[0-9A-Fa-f]{6}$/.test(input);
//         const isEnglishColor = (() => {
//             try {
//                 Color(input);
//                 return true;
//             } catch {
//                 return false;
//             }
//         })();

//         // Nếu đầu vào không phải là mã HEX và không phải tên màu tiếng Anh, thử dịch từ tiếng Việt sang tiếng Anh
//         if (!isHex && !isEnglishColor) {
//             try {
//                 // Dịch từ tiếng Việt sang tiếng Anh
//                 input = await translate(input, { from: 'vi', to: 'en' });
//             } catch (error) {
//                 return msg.channel.send('Không thể dịch tên màu, vui lòng thử lại.');
//             }
//         }

//         let color;
//         try {
//             color = Color(input); // Tạo đối tượng Color từ input
//         } catch (error) {
//             return msg.channel.send('Đầu vào màu không hợp lệ. Vui lòng nhập đúng, ví dụ: đỏ, red, vàng, yellow hoặc mã HEX như #FF0000, #FFFF00.');
//         }

//         // Các định dạng màu
//         const hex = color.hex();
//         const rgb = color.rgb().array();
//         const rgbString = color.rgb().string();
//         const hsl = color.hsl().string();
//         const cmyk = color.cmyk().array();
//         const cmykFormatted = `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
//         const hsv = color.hsv().string();
//         const lab = color.lab().array().join(', ');
//         const xyz = color.xyz().array().join(', ');
//         const lch = color.lch().array().join(', ');

//         // Hàm ánh xạ mã màu sang ANSI 256
//         const getAnsi256 = (r, g, b) => {
//             const ansi256 = Math.round(((r / 255) * 5)) * 36 + Math.round(((g / 255) * 5)) * 6 + Math.round(((b / 255) * 5)) + 16;
//             return `\\x1b[38;5;${ansi256}m`;
//         };

//         const ansi = getAnsi256(rgb[0], rgb[1], rgb[2]);

//         // Tạo embed để hiển thị các thông tin màu
//         const embed = new EmbedBuilder()
//             .setColor(parseInt(hex.replace('#', ''), 16)) // Đặt màu cho đường viền embed
//             .setTitle('Thông tin màu')
//             .addFields(
//                 { name: '**HEX**', value: `\`\`\`${hex}\`\`\``, inline: true },
//                 { name: '**RGB**', value: `\`\`\`${rgbString}\`\`\``, inline: true },
//                 { name: '**HSL**', value: `\`\`\`${hsl}\`\`\``, inline: true },
//                 { name: '**CMYK**', value: `\`\`\`${cmykFormatted}\`\`\``, inline: true },
//                 { name: '**HSV**', value: `\`\`\`${hsv}\`\`\``, inline: true },
//                 { name: '**LAB**', value: `\`\`\`${lab}\`\`\``, inline: true },
//                 { name: '**XYZ**', value: `\`\`\`${xyz}\`\`\``, inline: true },
//                 { name: '**LCH**', value: `\`\`\`${lch}\`\`\``, inline: true },
//                 { name: '**ANSI**', value: `\`\`\`${ansi}\`\`\``, inline: false },
//             );

//         // Gửi embed chứa các định dạng màu
//         await msg.channel.send({ embeds: [embed] });
//     },
// };