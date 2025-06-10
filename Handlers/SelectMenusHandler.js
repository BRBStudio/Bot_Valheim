// // // Handlers/selectmenusHandler.js
// // const fs = require('fs');
// // const ascii = require('ascii-table');
// // const path = require('path');

// // // Sử dụng path.join để xây dựng đường dẫn đến thư mục SelectMenus
// // const selectMenusPath = path.join(__dirname, '../InteractionTypes/SelectMenus');

// // function loadSelectMenus(client) {
// //     const table = new ascii().setHeading("SelectMenus", "Status");
// //     const selectMenuData = [];

// //     client.selectMenus = new Map();
// //     // Đọc các tệp select menu từ thư mục được chỉ định
// //     const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

// //     for (const file of selectMenuFiles) {
// //         try {
// //             const selectMenu = require(path.join(selectMenusPath, file));
// //             client.selectMenus.set(selectMenu.id, selectMenu);
// //             table.addRow(file, "loaded");
// //             selectMenuData.push({ name: file, status: 'loaded' });
// //         } catch (error) {
// //             table.addRow(file, "failed");
// //             console.error(`Lỗi khi nạp select menu ${file}:`, error);
// //             selectMenuData.push({ name: file, status: 'error' });
// //         }
// //     }

// //     // console.log(table.toString(), "\nSelect Menus đã được tải");
// //     return selectMenuData;
// // }

// // module.exports = { loadSelectMenus };


// const fs = require('fs');
// const ascii = require('ascii-table');
// const path = require('path');

// // Sử dụng path.join để xây dựng đường dẫn đến thư mục SelectMenus
// const selectMenusPath = path.join(__dirname, '../InteractionTypes/SelectMenus');

// function loadSelectMenus(client) {
//     const table = new ascii().setHeading("SelectMenus", "Status");
//     const selectMenuData = [];

//     client.selectMenus = new Map();
//     // Đọc các tệp select menu từ thư mục được chỉ định
//     const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

//     if (selectMenuFiles.length === 0) {
//         console.error(`Không có tệp lệnh hợp lệ trong thư mục 'SelectMenus'.`);
//     }

//     for (const file of selectMenuFiles) {
//         try {
//             const filePath = path.join(selectMenusPath, file);
//             // Đọc nội dung của tệp
//             const fileContent = fs.readFileSync(filePath, 'utf-8');

//             if (!fileContent.trim()) {
//                 throw new Error("File is empty");
//             }

//             const selectMenu = require(filePath);

//             // Kiểm tra nếu selectMenu có thuộc tính id
//             if (!selectMenu.id) {
//                 throw new Error("Invalid select menu format: missing id");
//             }

//             client.selectMenus.set(selectMenu.id, selectMenu);
//             table.addRow(file, "loaded");
//             selectMenuData.push({ name: file, status: 'loaded' });
//         } catch (error) {
//             const status = error.message === "empty file" ? "tệp tin rỗng" : "thiếu id hoặc lỗi cú pháp";
//             table.addRow(file, "failed");
//             selectMenuData.push({ name: file, status: status });
//         }
//     }

//     // console.log(table.toString(), "\nSelect Menus đã được tải");
//     return selectMenuData;
// }

// module.exports = { loadSelectMenus };












const fs = require('fs');
const ascii = require('ascii-table');
const path = require('path');

// Sử dụng path.join để xây dựng đường dẫn đến thư mục SelectMenus
const selectMenusPath = path.join(__dirname, '../InteractionTypes/SelectMenus');

async function loadSelectMenus(client) {
    const table = new ascii().setHeading("SelectMenus", "Status");
    const selectMenuData = [];

    client.selectMenus = new Map();
    // Đọc các tệp select menu từ thư mục được chỉ định
    const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

    if (selectMenuFiles.length === 0) {
        console.error(`Không có tệp lệnh hợp lệ trong thư mục 'SelectMenus'.`);
    }

    for (const file of selectMenuFiles) {
        try {

            const filePath = path.join(selectMenusPath, file);
            // Đọc nội dung của tệp
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            if (!fileContent.trim()) {
                throw new Error("tệp tin rỗng");
            }

            const selectMenu = require(filePath);

            // Kiểm tra nếu selectMenu có thuộc tính id
            if (!selectMenu.id) {
                throw new Error("thiếu id");
            }

            client.selectMenus.set(selectMenu.id, selectMenu);
            table.addRow(file, "loaded");
            selectMenuData.push({ name: file, status: 'BRB STUDIO' });
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
            selectMenuData.push({ name: file, status: status });
        }
    }

    // console.log(table.toString(), "\nSelect Menus đã được tải");
    return selectMenuData;
}

module.exports = { loadSelectMenus };

