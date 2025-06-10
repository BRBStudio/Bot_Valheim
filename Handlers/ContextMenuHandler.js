// app AI chuột phải
const fs = require('fs');
const path = require('path');

async function loadContextMenus(client) {
    const contextMenuPath = path.join(__dirname, '../InteractionTypes/ContextMenus');
    if (!fs.existsSync(contextMenuPath)) {
        console.error(`Đường dẫn ${contextMenuPath} không tồn tại.`);
        return [];
    }

    const contextMenuFiles = fs.readdirSync(contextMenuPath).filter(file => file.endsWith('.js'));

    let contextMenuData = [];

    for (const file of contextMenuFiles) {
        const filePath = path.join(contextMenuPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8').trim(); // Đọc nội dung tệp
        
        try {

            // // Kiểm tra nếu toàn bộ mã bị chú thích
            // if (fileContent.startsWith('//')) {
            //     throw new Error("bị bôi đen");
            // }

            // Kiểm tra xem tệp có rỗng không
            if (!fileContent) {
                throw new Error("tệp tin rỗng");
            }

            const contextMenu = require(filePath);

            // Kiểm tra nếu contextMenu có thuộc tính 'data'
            if (contextMenu && contextMenu.data) {
                if (!contextMenu.data.name ) {
                    throw new Error("thiếu name");
                } 
                if (!contextMenu.data.type) {
                    throw new Error("thiếu type");
                }
                
                // Nếu có cả 'name' và 'type', thêm vào client
                client.contextMenus.set(contextMenu.data.name, contextMenu);
                contextMenuData.push({ name: contextMenu.data.name, status: 'BRB STUDIO' });
            } else {
                throw new Error("thiếu data");
            }
        } catch (error) {
            let status;
            if (error.message === "tệp tin rỗng") {
                status = "tệp tin rỗng";
            } else if (error.message === "thiếu name") {
                status = "thiếu tên";
            } else if (error.message === "thiếu type") {
                status = "thiếu type";
            } else if (error.message === "bị bôi đen") {
                status = "bị bôi đen";  // Nếu lỗi là do không tìm thấy tệp module (bôi đen)
            } else {
                status = "lỗi cú pháp";
            }

            // Thêm thông tin lỗi vào contextMenuData
            contextMenuData.push({ name: file, status });
        }
    }
// Thêm dòng này để xem các lệnh ngữ cảnh đã nạp
    // console.log(client.contextMenus.keys());
    return contextMenuData;
}

module.exports = { loadContextMenus };
