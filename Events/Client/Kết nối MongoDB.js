// const figlet = require('figlet'); // Hãy cài thư viện figlet bằng cách npm i figlet
// const mongoose = require('mongoose');
// require('dotenv').config();
// const autoresponderHandler = require('../../Handlers/autoresponderHandler');
// const interactionError = require('../WebhookError/interactionError');

// // Mã màu ANSI
// const color = {
//     red: '\x1b[31m',
//     orange: '\x1b[38;5;202m',
//     yellow: '\x1b[33m',
//     green: '\x1b[32m',
//     blue: '\x1b[34m',
//     pink: '\x1b[38;5;213m',
//     torquise: '\x1b[38;5;45m', // Xanh ngọc
//     reset: '\x1b[0m',          // màu mặc định

//     white: '\x1b[38;5;15m',

//     lightRed: '\x1b[38;5;197m',     // Đỏ sáng
//     lightGreen: '\x1b[38;5;82m',    // Xanh lá cây sáng
//     lightYellow: '\x1b[38;5;227m',  // Vàng sáng
//     lightBlue: '\x1b[38;5;75m',     // Xanh dương sáng
//     lightPink: '\x1b[38;5;213m',    // Hồng sáng

//     darkRed: '\x1b[38;5;124m',      // Đỏ tối
//     darkGreen: '\x1b[38;5;22m',     // Xanh lá cây tối
//     darkYellow: '\x1b[38;5;130m',   // Vàng tối
//     darkBlue: '\x1b[38;5;17m',      // Xanh dương tối
//     darkPink: '\x1b[38;5;199m',     // Hồng tối

//     bgcyan: '\x1b[38;5;80m',        // xanh đẹp
//     cyan: '\x1b[36m',               // Xanh lam nhạt
//     magenta: '\x1b[35m',            // Tím
//     gray: '\x1b[90m',               // Xám
//     lightGray: '\x1b[37m',          // Xám sáng
//     darkGray: '\x1b[90m',           // Xám đen

//     lightCyan: '\x1b[96m',          // Xanh lam sáng
//     lightMagenta: '\x1b[95m',       // Tím sáng
//     darkCyan: '\x1b[36m',           // Xanh lam tối
//     darkMagenta: '\x1b[35m',        // Tím tối
//     brown: '\x1b[33m',              // Nâu

//     purple: '\x1b[35m',             // Tím
//     lightPurple: '\x1b[38;5;171m',  // Tím sáng
//     deepBlue: '\x1b[38;5;17m',      // Xanh dương sâu
//     olive: '\x1b[38;5;64m',         // Xanh ô liu
//     teal: '\x1b[38;5;37m',          // Xanh lam xanh

//     salmon: '\x1b[38;5;209m',       // Đỏ hồng
//     peach: '\x1b[38;5;216m',        // Đào
//     lavender: '\x1b[38;5;207m',     // Hoa oải hương
//     mint: '\x1b[38;5;119m',         // Xanh bạc hà
//     coral: '\x1b[38;5;202m'         // San hô
// }

// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {
//         // Lấy chuỗi kết nối MongoDB từ biến môi trường
//         const mongodb = process.env.MONGODB_URI;

//         if (!mongodb) {
//             console.error(`${color.red}Không có chuỗi kết nối MongoDB được cung cấp trong .env${color.reset}`);
//             return;
//         }

//         try {

//             /*
//             Kết nối MongoDB với các tùy chọn:
//                         await mongoose.connect(mongodb, {
//                             keepAlive: true,              // Giữ kết nối sống
//                             useNewUrlParser: true,        // Sử dụng trình phân tích URL mới
//                             useUnifiedTopology: true,     // Sử dụng trình điều phối kết nối mới
//                             serverSelectionTimeoutMS: 10000 // (Tùy chọn) Thời gian chờ để chọn máy chủ
//                         });
//             */

//             // Kết nối MongoDB
//             await mongoose.connect(mongodb);

//             // Thêm độ trễ 2 giây trước khi hiển thị khung MongoDB
//             setTimeout(async () => {

//             const asciiArt = await new Promise((resolve, reject) => {               
//                 figlet('B        R        B                  S        T        U        D        I        O', (err, data) => {
//                 // figlet('B R B                                                                   S T U D I O', (err, data) => {
//                     if (err) return reject(err);
//                     resolve(data);
//                 });
//             });

//             // // dùng để thay đổi font chữ
//             // const asciiArt = await new Promise((resolve, reject) => {
//             //     figlet.text(
//             //         'B        R        B                  S        T        U        D        I        O',
//             //         {
//             //             font: '1row', // Thay thế 'Ghost' bằng font bạn muốn 
//             //             horizontalLayout: 'default',
//             //             verticalLayout: 'default',
//             //             width: 80,
//             //             whitespaceBreak: true
//             //         },
//             //         (err, data) => {
//             //             if (err) return reject(err);
//             //             resolve(data);
//             //         }
//             //     );
//             // });
//             // dùng để thay đổi font chữ
            

//             // Tạo đường viền và hiển thị với màu
//             const border = '*'.repeat(asciiArt.split('\n')[0].length + 4);
//             console.log(`${color.white}${border}${color.reset}`);
//             asciiArt.split('\n').forEach(line => {
//                 console.log(`${color.white}*${color.reset} ${color.bgcyan}${line.padEnd(border.length - 4)}${color.reset} ${color.white}*${color.reset}`);
//             });
//             console.log(`${color.white}${border}${color.reset}`);

//             // Gọi hàm xử lý autoresponder
//             await autoresponderHandler(client);
//         }, 2000);  // Đợi 2 giây trước khi hiển thị khung MongoDB


//         } catch (err) {
//             console.error(`${color.red}Lỗi kết nối MongoDB: ${err.message}${color.reset}`);
//             await interactionError.execute(client.user, err, client);
//         }

//         // Xử lý sự kiện mất kết nối MongoDB
//         mongoose.connection.on('disconnected', async () => {
//             // console.log(`${color.red}Dữ liệu MongoDB đang bị mất kết nối, vui lòng kết nối lại đường truyền.${color.reset}`);
//             try {
//                 const asciiError = await new Promise((resolve, reject) => {
//                     figlet('V A L H E I M           S U R V I V A L', (err, data) => {
//                         if (err) return reject(err);
//                         resolve(data);
//                     });
//                 });
        
//                 // Tạo đường viền và hiển thị với màu
//                 const border = '*'.repeat(asciiError.split('\n')[0].length + 4);
//                 console.log(`${color.white}${border}${color.reset}`);
//                 asciiError.split('\n').forEach(line => {
//                     console.log(`${color.white}*${color.reset} ${color.red}${line.padEnd(border.length - 4)}${color.reset} ${color.white}*${color.reset}`);
//                 });
//                 console.log(`${color.white}${border}${color.reset}`);
        
//                 console.log(`${color.red}Dữ liệu MongoDB đang bị mất kết nối, vui lòng kết nối lại đường truyền.${color.reset}`);
//             } catch (error) {
//                 console.error(`${color.red}Lỗi khi tạo ASCII Art cho chữ Error: ${error.message}${color.reset}`);
//             }
//         });
//     },
// };


const figlet = require('figlet');
const mongoose = require('mongoose');
require('dotenv').config();
const autoresponderHandler = require('../../Handlers/autoresponderHandler');
const interactionError = require('../WebhookError/interactionError');

const color = {
    red: '\x1b[31m',
    white: '\x1b[38;5;15m',
    bgcyan: '\x1b[38;5;80m',
    reset: '\x1b[0m'
};

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const mongodb = process.env.MONGODB_URI;
        if (!mongodb) {
            console.error(`${color.red}Không có chuỗi kết nối MongoDB được cung cấp trong .env${color.reset}`);
            return;
        }

        const retryConnection = () => {
            console.log(`${color.red}Thử kết nối lại MongoDB sau 1 phút...${color.reset}`);
            setTimeout(connectToMongoDB, 300000);
        };

        const connectToMongoDB = async () => {
            try {
                await mongoose.connect(mongodb);
                setTimeout(async () => {
                    const asciiArt = await new Promise((resolve, reject) => {
                        figlet('B        R        B                  S        T        U        D        I        O', (err, data) => {
                            if (err) return reject(err);
                            resolve(data);
                        });
                    });
                    const border = '*'.repeat(asciiArt.split('\n')[0].length + 4);
                    console.log(`${color.white}${border}${color.reset}`);
                    asciiArt.split('\n').forEach(line => {
                        console.log(`${color.white}*${color.reset} ${color.bgcyan}${line.padEnd(border.length - 4)}${color.reset} ${color.white}*${color.reset}`);
                    });
                    console.log(`${color.white}${border}${color.reset}`);
                    await autoresponderHandler(client);
                }, 2000);
            } catch (err) {
                console.error(`${color.red}Lỗi kết nối MongoDB: ${err.message}${color.reset}`);
                await interactionError.execute(client.user, err, client);
                retryConnection();
            }
        };

        mongoose.connection.on('disconnected', async () => {
            try {
                const asciiError = await new Promise((resolve, reject) => {
                    figlet('V A L H E I M           S U R V I V A L', (err, data) => {
                        if (err) return reject(err);
                        resolve(data);
                    });
                });
                const border = '*'.repeat(asciiError.split('\n')[0].length + 4);
                console.log(`${color.white}${border}${color.reset}`);
                asciiError.split('\n').forEach(line => {
                    console.log(`${color.white}*${color.reset} ${color.red}${line.padEnd(border.length - 4)}${color.reset} ${color.white}*${color.reset}`);
                });
                console.log(`${color.white}${border}${color.reset}`);
                console.log(`${color.red}Dữ liệu MongoDB đang bị mất kết nối, vui lòng kết nối lại đường truyền.${color.reset}`);
                retryConnection();
            } catch (error) {
                console.error(`${color.red}Lỗi khi tạo ASCII Art cho chữ Error: ${error.message}${color.reset}`);
            }
        });

        connectToMongoDB();
    },
};



/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/






// const figlet = require('figlet');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const autoresponderHandler = require('../../Handlers/autoresponderHandler');
// const interactionError = require('../WebhookError/interactionError');

// const color = {
//     red: '\x1b[31m',
//     white: '\x1b[38;5;15m',
//     bgcyan: '\x1b[38;5;80m',
//     reset: '\x1b[0m'
// };

// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {

//         const mongodb = process.env.MONGODB_URI;
//         if (!mongodb) {
//             console.error(`${color.red}Không có chuỗi kết nối MongoDB được cung cấp trong .env${color.reset}`);
//             return;
//         }

//         const waitForBotReady = async () => {
//             while (!global.botReady) {
//                 // console.log(`${color.red}Chờ bot sẵn sàng trước khi kết nối MongoDB...${color.reset}`);
//                 await new Promise(resolve => setTimeout(resolve, 500));
//             }
//         };

//         await waitForBotReady(); // Đợi bot sẵn sàng trước khi kết nối MongoDB

//         const retryConnection = () => {
//             console.log(`${color.red}Thử kết nối lại MongoDB sau 1 phút...${color.reset}`);
//             setTimeout(connectToMongoDB, 300000);
//         };

//         const connectToMongoDB = async () => {
//             try {
//                 await mongoose.connect(mongodb);
//                 setTimeout(async () => {
//                     const asciiArt = await new Promise((resolve, reject) => {
//                         figlet('B        R        B                  S        T        U        D        I        O', (err, data) => {
//                             if (err) return reject(err);
//                             resolve(data);
//                         });
//                     });
//                     const border = '*'.repeat(asciiArt.split('\n')[0].length + 4);
//                     console.log(`${color.white}${border}${color.reset}`);
//                     asciiArt.split('\n').forEach(line => {
//                         console.log(`${color.white}*${color.reset} ${color.bgcyan}${line.padEnd(border.length - 4)}${color.reset} ${color.white}*${color.reset}`);
//                     });
//                     console.log(`${color.white}${border}${color.reset}`);
//                     await autoresponderHandler(client);
//                 }, 2000);
//             } catch (err) {
//                 console.error(`${color.red}Lỗi kết nối MongoDB: ${err.message}${color.reset}`);
//                 await interactionError.execute(client.user, err, client);
//                 retryConnection();
//             }
//         };

//         mongoose.connection.on('disconnected', async () => {
//             try {
//                 const asciiError = await new Promise((resolve, reject) => {
//                     figlet('V A L H E I M           S U R V I V A L', (err, data) => {
//                         if (err) return reject(err);
//                         resolve(data);
//                     });
//                 });
//                 const border = '*'.repeat(asciiError.split('\n')[0].length + 4);
//                 console.log(`${color.white}${border}${color.reset}`);
//                 asciiError.split('\n').forEach(line => {
//                     console.log(`${color.white}*${color.reset} ${color.red}${line.padEnd(border.length - 4)}${color.reset} ${color.white}*${color.reset}`);
//                 });
//                 console.log(`${color.white}${border}${color.reset}`);
//                 console.log(`${color.red}Dữ liệu MongoDB đang bị mất kết nối, vui lòng kết nối lại đường truyền.${color.reset}`);
//                 retryConnection();
//             } catch (error) {
//                 console.error(`${color.red}Lỗi khi tạo ASCII Art cho chữ Error: ${error.message}${color.reset}`);
//             }
//         });

//         connectToMongoDB();
//     },
// };