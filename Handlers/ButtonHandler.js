// /*
//  Chức năng: Tải và quản lý các nút bấm từ thư mục Buttons
// */
// const fs = require('fs');
// const ascii = require('ascii-table');

// function loadButtons(client) {
//     const table = new ascii().setHeading("Buttons", "Status");
//     const buttonData = [];

//     client.buttons = new Map();
//     const buttonFiles = fs.readdirSync('./InteractionTypes/Buttons').filter(file => file.endsWith('.js')); // đã sửa buttons thành Buttons

//     for (const file of buttonFiles) {
//         try {
//             const button = require(`../InteractionTypes/Buttons/${file}`);
//             client.buttons.set(button.id, button);
//             table.addRow(file, "loaded");
//             buttonData.push({ name: file, status: 'loaded' });
//         } catch (error) {
//             table.addRow(file, "failed");
//             console.error(`Lỗi khi nạp button ${file}:`, error);
//             buttonData.push({ name: file, status: 'error' });
//         }
//     }

//     // console.log(table.toString(), "\nNút đã được tải");
//     return buttonData;
// }

// module.exports = { loadButtons };



/*
 Chức năng: Tải và quản lý các nút bấm từ thư mục Buttons
*/
const fs = require('fs');
const ascii = require('ascii-table');
const path = require('path'); // Import thêm path để xử lý đường dẫn tệp

async function loadButtons(client) {
    const table = new ascii().setHeading("Buttons", "Status");
    const buttonData = [];

    client.buttons = new Map();
    const buttonFiles = fs.readdirSync('./InteractionTypes/Buttons').filter(file => file.endsWith('.js')); // đã sửa buttons thành Buttons

    for (const file of buttonFiles) {
        const filePath = path.join(__dirname, '../InteractionTypes/Buttons', file); // Đường dẫn đến file Button
        const fileContent = fs.readFileSync(filePath, 'utf8').trim(); // Đọc nội dung tệp

        try {
            // Kiểm tra xem tệp có rỗng không
            if (!fileContent) {
                throw new Error("tệp tin rỗng");
            }

            const button = require(filePath);

            // Kiểm tra nếu button có thuộc tính 'id'
            if (button && button.id) {
                client.buttons.set(button.id, button);
                table.addRow(file, "loaded");
                buttonData.push({ name: file, status: 'BRB STUDIO' });
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
            console.error(`Lỗi khi nạp button ${file}:`, error);
            buttonData.push({ name: file, status });
        }
    }

    // console.log(table.toString(), "\nNút đã được tải");
    return buttonData;
}

module.exports = { loadButtons };
