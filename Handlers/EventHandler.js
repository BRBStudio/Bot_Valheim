// const ascii = require('ascii-table');
// const fs = require('fs');

// function loadEvents(client) {

//     // Tăng số lượng listener tối đa cho client
//     client.setMaxListeners(30);

//     const table = new ascii().setHeading('Events', 'Status');
//     const eventData = [];

//     const folders = fs.readdirSync('./Events');
//     for (const folder of folders) {
//         const folderPath = `./Events/${folder}`;
        
//         // Kiểm tra nếu là thư mục
//         if (fs.statSync(folderPath).isDirectory()) {
//             // Lấy file .js trong thư mục đầu tiên
//             const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
            
//             for (const file of files) {
//                 loadEvent(file, folder, client, table, eventData);
//             }

//             // Kiểm tra thư mục con bên trong
//             const subfolders = fs.readdirSync(folderPath);
//             for (const subfolder of subfolders) {
//                 const subfolderPath = `${folderPath}/${subfolder}`;
//                 // Kiểm tra nếu là thư mục con
//                 if (fs.statSync(subfolderPath).isDirectory()) {
//                     const subFiles = fs.readdirSync(subfolderPath).filter(file => file.endsWith('.js'));
//                     for (const file of subFiles) {
//                         loadEvent(file, `${folder}/${subfolder}`, client, table, eventData);
//                     }
//                 }
//             }
//         }
//     }

//     // console.log(table.toString(), '\nSự kiện đã tải');
//     return eventData;
// }

// // Hàm riêng để tải sự kiện và xử lý lỗi
// function loadEvent(file, folder, client, table, eventData) {
//     try {
//         const event = require(`../Events/${folder}/${file}`);

//         if (event.rest) {
//             if (event.once) {
//                 client.rest.once(event.name, (...args) => event.execute(...args, client));
//             } else {
//                 client.rest.on(event.name, (...args) => event.execute(...args, client));
//             }
//         } else {
//             if (event.once) {
//                 client.once(event.name, (...args) => event.execute(...args, client));
//             } else {
//                 client.on(event.name, (...args) => event.execute(...args, client));
//             }
//         }
//         table.addRow(file, 'loaded');
//         eventData.push({ name: file, status: 'loaded' });
//     } catch (error) {
//         console.error(`Không thể tải sự kiện ${file}:`, error);
//         table.addRow(file, 'error');
//         eventData.push({ name: file, status: 'error' });
//     }
// }

// module.exports = { loadEvents };














const ascii = require('ascii-table');
const fs = require('fs');

async function loadEvents(client) {
    
    // Tăng số lượng listener tối đa cho client
    client.setMaxListeners(50); // hoặc đặt thành 50

    const table = new ascii().setHeading('Events', 'Status');
    const eventData = [];

    const folders = fs.readdirSync('./Events');
    for (const folder of folders) {
        const files = fs.readdirSync(`./Events/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            try {
                const event = require(`../Events/${folder}/${file}`);

                if (event.rest) {
                    if (event.once) {
                        client.rest.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.rest.on(event.name, (...args) => event.execute(...args, client));
                    }
                } else {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                }
                table.addRow(file, 'loaded');
                eventData.push({ name: file, status: 'BRB STUDIO' });
            } catch (error) {
                console.error(`Không thể tải sự kiện ${file}:`, error);
                table.addRow(file, 'error');
                eventData.push({ name: file, status: 'error' });
            }
        }
    }

    // console.log(table.toString(), '\nSự kiện đã tải');
    return eventData;
}

module.exports = { loadEvents };
