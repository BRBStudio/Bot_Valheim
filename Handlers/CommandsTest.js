// const { ContextMenuCommandBuilder } = require('discord.js');
// const ascii = require('ascii-table');
// const fs = require('fs');

// // Đăng ký lệnh toàn cục
// async function loadCommands(client) {
//     const table = new ascii().setHeading("Commands", "Status");
//     const commandData = [];
//     const cooldowns = new Map(); // Bản đồ lưu hồi chiêu cho lệnh

//     let commandsArray = [];
//     const commandsFolder = fs.readdirSync('./Commands');

//     for (const folder of commandsFolder) {
//         const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'));

//         if (commandFiles.length === 0) {
//             console.error(`Không có tệp lệnh hợp lệ trong thư mục '${folder}'.`);
//             continue;
//         }

//         for (const file of commandFiles) {
//             try {
//                 // Đọc nội dung tệp để kiểm tra nếu mã bị chú thích hoàn toàn
//                 const fileContent = fs.readFileSync(`./Commands/${folder}/${file}`, 'utf-8');

//                 const isAllCommented = fileContent.split('\n').every(line => line.trim().startsWith('//') || line.trim().length === 0);

//                 if (isAllCommented) {
//                     table.addRow(file, "bị bôi đen");
//                     commandData.push({ name: file, status: "bị bôi đen" });
//                     continue;
//                 }

//                 delete require.cache[require.resolve(`../Commands/${folder}/${file}`)];
//                 const commandFile = require(`../Commands/${folder}/${file}`);

//                 let status;

//                 // Xử lý lệnh Context Menu
//                 if (commandFile.data instanceof ContextMenuCommandBuilder) {
//                     commandFile.data.setDMPermission(false);

//                     // Kiểm tra các thông số cần thiết cho lệnh Context Menu
//                     if (!commandFile.data.name || typeof commandFile.data.name !== 'string') {
//                         status = 'thiếu tên';
//                     } else if (!commandFile.data.type) {
//                         status = 'thiếu type';
//                     } else if (!commandFile.description || typeof commandFile.description !== 'string') {
//                         status = 'thiếu description';
//                     } else {
//                         status = 'BRB STUDIO';
//                     }

//                     // Kiểm tra nếu lệnh hợp lệ trước khi thêm vào mảng
//                     if (status === 'BRB STUDIO') {
//                         client.commands.set(commandFile.data.name, commandFile);
//                         commandsArray.push(commandFile.data);
//                         setupCooldown(commandFile, cooldowns);
//                     }

//                     table.addRow(file, status);
//                     commandData.push({ name: file, status: status });
//                     continue;
//                 }

//                 // Xử lý lệnh Slash thông thường
//                 if (!('data' in commandFile) || !commandFile.data || !commandFile.data.name || typeof commandFile.data.name !== 'string') {
//                     status = 'thiếu tên';
//                 } else if (!commandFile.data.description || typeof commandFile.data.description !== 'string') {
//                     status = 'thiếu description';
//                 } else {
//                     commandFile.data.setDMPermission(false);
//                     client.commands.set(commandFile.data.name, commandFile);
//                     commandsArray.push(commandFile.data);
//                     setupCooldown(commandFile, cooldowns);
//                     status = 'BRB STUDIO';
//                 }

//                 table.addRow(file, status);
//                 commandData.push({ name: file, status: status });

//             } catch (error) {
//                 console.error(`Không thể tải lệnh ${file} của thư mục ${folder}:`, error);

//                 let status = "lỗi cú pháp"; // Mặc định là lỗi cú pháp nếu không có lỗi cụ thể hơn
//                 table.addRow(file, status);
//                 commandData.push({ name: file, status: status });
//             }
//         }
//     }

//     // Cập nhật lệnh toàn cục với Discord
//     try {
//         console.log("Bắt đầu đăng ký lệnh toàn cục...");
//         await client.application.commands.set(commandsArray); // Đăng ký toàn cục
//         console.log("Đăng ký lệnh toàn cục thành công!");
//     } catch (error) {
//         console.error('Không thể đăng ký lệnh toàn cục với Discord:', error);
//     }

//     client.cooldowns = cooldowns; // Gắn bản đồ hồi chiêu vào client để sử dụng sau
//     return commandData;
// }

// // Hàm thiết lập hồi chiêu cho lệnh
// function setupCooldown(commandFile, cooldowns) {
//     if (commandFile.cooldown && typeof commandFile.cooldown === 'number') {
//         cooldowns.set(commandFile.data.name, commandFile.cooldown);
//     }
// }

// module.exports = { loadCommands };
