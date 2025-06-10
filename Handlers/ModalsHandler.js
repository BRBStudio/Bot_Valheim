// // Handlers/modalsHandler.js
// const fs = require('fs');
// const ascii = require('ascii-table');
// const path = require('path');

// // Sử dụng path.join để xây dựng đường dẫn đến thư mục Modals
// const modalsPath = path.join(__dirname, '../InteractionTypes/Modals');

// function loadModals(client) {
//     const table = new ascii().setHeading("Modals", "Status");
//     const modalData = [];

//     client.modals = new Map();
//     // Đọc các tệp modal từ thư mục được chỉ định
//     const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

//     for (const file of modalFiles) {
//         try {
//             const modal = require(path.join(modalsPath, file));
//             client.modals.set(modal.id, modal);
//             table.addRow(file, "loaded");
//             modalData.push({ name: file, status: 'loaded' });
//         } catch (error) {
//             table.addRow(file, "failed");
//             console.error(`Lỗi khi nạp modal ${file}:`, error);
//             modalData.push({ name: file, status: 'error' });
//         }
//     }

//     // console.log(table.toString(), "\nModals đã được tải");
//     return modalData;
// }

// module.exports = { loadModals };




const fs = require('fs');
const ascii = require('ascii-table');
const path = require('path');

// Sử dụng path.join để xây dựng đường dẫn đến thư mục Modals
const modalsPath = path.join(__dirname, '../InteractionTypes/Modals');

async function loadModals(client) {
    const table = new ascii().setHeading("Modals", "Status");
    const modalData = [];

    client.modals = new Map();
    // Đọc các tệp modal từ thư mục được chỉ định
    const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

    for (const file of modalFiles) {
        const filePath = path.join(modalsPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8').trim(); // Đọc nội dung tệp

        try {
            // Kiểm tra xem tệp có rỗng không
            if (!fileContent) {
                throw new Error("tệp tin rỗng");
            }

            const modal = require(filePath);

            // Kiểm tra nếu modal có thuộc tính 'id'
            if (modal && modal.id) {
                client.modals.set(modal.id, modal); // Đăng ký modal thông thường

                // Đăng ký thêm các customId khác nhau cho các loại vé khác nhau
                if (modal.id === 'ticketModal') {
                    client.modals.set('ticketModal-discordTicket', modal); // Đăng ký cho vé hỗ trợ discord
                    client.modals.set('ticketModal-gameTicket', modal);   // Đăng ký cho vé hỗ trợ game
                }

                table.addRow(file, "loaded");
                modalData.push({ name: file, status: 'BRB STUDIO' });
            } else {
                throw new Error("thiếu id");
            }
        } catch (error) {
            let status;
            if (error.message === "tệp tin rỗng") {
                status = "tệp tin rỗng";
            } else if (error.message === "thiếu id") {
                status = "thiếu id";
            } else {
                status = "lỗi cú pháp";
            }

            table.addRow(file, status);
            console.error(`Lỗi khi nạp modal ${file}:`, error);
            modalData.push({ name: file, status: status });
        }
    }

    // console.log(table.toString(), "\nModals đã được tải");
    return modalData;
}

module.exports = { loadModals };
