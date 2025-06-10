// const ascii = require('ascii-table');
// const fs = require('fs');

// function loadPrefix(client) {
//     const table = new ascii().setHeading('Prefix Commands', 'Status');
//     const prefixData = [];

//     if (!client.prefixDescriptions) {
//         client.prefixDescriptions = {};
//     }

//     const PrefixFolders = fs.readdirSync('./PrefixCommands');
//     for (const folder of PrefixFolders) {
//         const PrefixFiles = fs.readdirSync(`./PrefixCommands/${folder}`).filter((file) => file.endsWith('.js'));

//         if (PrefixFiles.length === 0) {
//             console.error(`Không có tệp lệnh hợp lệ trong thư mục '${folder}'.`);
//             continue;
//         }

//         for (const file of PrefixFiles) {
//             try {
//                 const PrefixFile = require(`../PrefixCommands/${folder}/${file}`);

//                 if (!('name' in PrefixFile) || !PrefixFile.name) {
//                     console.error(`Tệp lệnh '${file}' thiếu thông tin cần thiết (name).`);
//                     table.addRow(file, "Lỗi (thiếu name)");
//                     prefixData.push({ name: file, status: 'error' });
//                     continue;
//                 }

//                 client.prefixCommands.set(PrefixFile.name, PrefixFile);
//                 client.prefixDescriptions[PrefixFile.name] = PrefixFile.description || 'No description';
//                 table.addRow(file, "loaded");
//                 prefixData.push({ name: file, status: 'loaded' });
//             } catch (error) {
//                 console.error(`Không thể tải lệnh prefix ${file}:`, error);
//                 table.addRow(file, "error");
//                 prefixData.push({ name: file, status: 'error' });
//             }
//         }
//     }

//     // console.log(table.toString(), "\nCác lệnh prefix đã tải");
//     return prefixData;
// }

// module.exports = { loadPrefix };


/*
Đăng ký lệnh prefix
*/

const ascii = require('ascii-table');
const fs = require('fs');
const path = require('path'); // Thêm thư viện path

async function loadPrefix(client) {
    const table = new ascii().setHeading('Prefix Commands', 'Status');
    const prefixData = [];

    if (!client.prefixDescriptions) {
        client.prefixDescriptions = {};
    }

    const PrefixFolders = fs.readdirSync('./PrefixCommands');
    for (const folder of PrefixFolders) {
        const PrefixFiles = fs.readdirSync(`./PrefixCommands/${folder}`).filter((file) => file.endsWith('.js'));

        if (PrefixFiles.length === 0) {
            console.error(`Không có tệp lệnh hợp lệ trong thư mục '${folder}'.`);
            continue;
        }

        for (const file of PrefixFiles) {
            const filePath = path.join(__dirname, '../PrefixCommands', folder, file);
            const fileContent = fs.readFileSync(filePath, 'utf8').trim(); // Đọc nội dung tệp

            try {

                // Kiểm tra nếu toàn bộ mã bị chú thích
                if (fileContent.startsWith('//')) {
                    throw new Error("bị bôi đen");
                }

                // Kiểm tra xem tệp có rỗng không
                if (!fileContent) {
                    throw new Error("tệp tin rỗng");
                }

                const PrefixFile = require(filePath);

                // Kiểm tra nếu PrefixFile có thuộc tính 'name'
                if (!('name' in PrefixFile) || !PrefixFile.name) {
                    throw new Error("thiếu name");
                }
                // Kiểm tra nếu PrefixFile có thuộc tính 'description'
                if (!('description' in PrefixFile)) {
                    throw new Error("thiếu description");
                }

                client.prefixCommands.set(PrefixFile.name.toLowerCase(), PrefixFile);
                client.prefixDescriptions[PrefixFile.name.toLowerCase()] = PrefixFile.description || 'Không có mô tả';
                table.addRow(file, "loaded");
                prefixData.push({ name: file, status: 'BRB STUDIO' });

            } catch (error) {
                let status;
                if (error.message === "tệp tin rỗng") {
                    status = `tệp tin rỗng`;
                } else if (error.message === "thiếu name") {
                    status = `thiếu tên`;
                } else if (error.message === "thiếu description") {
                    status = "thiếu description";
                } else if (error.message === "bị bôi đen") {
                    status = "bị bôi đen";
                } else {
                    status = "lỗi cú pháp";
                }
                // console.error(`Không thể tải lệnh prefix ${file}:`, error);
                table.addRow(file, status);
                prefixData.push({ name: file, status: status });
            }
        }
    }

    // console.log(table.toString(), "\nCác lệnh prefix đã tải");
    return prefixData;
}

module.exports = { loadPrefix };
