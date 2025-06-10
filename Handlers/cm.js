// const fs = require('fs');
// const path = require('path');
// const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('discord.js');
// const table = require('ascii-table'); // nếu mày có bảng ASCII
// const commandData = [];
// const globalCommands = [];
// const guildCommands = {};
// const subFolderGroups = new Map(); // GOM NHÓM SUBFOLDER CÓ CÙNG TÊN

// async function loadCommands(client) {
//     const commandsFolder = fs.readdirSync('./Commands');

//     for (const folder of commandsFolder) {
//         const folderPath = `./Commands/${folder}`;

//         // Load các file JS trong thư mục cha
//         const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
//         for (const file of commandFiles) {
//             // Xử lý lệnh chính nếu cần (mày đã xử lý riêng nên tao không can thiệp ở đây)
//         }

//         // Lấy danh sách các thư mục con
//         const subFolders = fs.readdirSync(folderPath).filter(name => fs.statSync(`${folderPath}/${name}`).isDirectory());

//         // GOM các subFolder thành nhóm theo tên
//         for (const subFolder of subFolders) {
//             const subFolderPath = path.join(folderPath, subFolder);
//             const subCommandFiles = fs.readdirSync(subFolderPath).filter(file => file.endsWith('.js'));

//             if (!subFolderGroups.has(subFolder)) {
//                 subFolderGroups.set(subFolder, []);
//             }

//             subFolderGroups.get(subFolder).push({
//                 path: subFolderPath,
//                 files: subCommandFiles
//             });
//         }
//     }

//     // BÂY GIỜ GOM NHÓM SUBFOLDER CÙNG TÊN
//     for (const [subFolderName, folderEntries] of subFolderGroups.entries()) {
//         const subCommandGroup = new SlashCommandBuilder()
//             .setName(subFolderName.toLowerCase())
//             .setDescription(`Nhóm lệnh ${subFolderName}`)
//             .setDMPermission(false);

//         const subCommandMap = new Map();
//         const guildSpecificCommands = {};

//         for (const entry of folderEntries) {
//             const { path: subFolderPath, files: subCommandFiles } = entry;

//             for (const file of subCommandFiles) {
//                 try {
//                     const filePath = `${subFolderPath}/${file}`;
//                     const subCommandFile = require(filePath);
//                     let status;

//                     if (subCommandFile.data instanceof SlashCommandSubcommandBuilder) {
//                         const subCommandName = subCommandFile.data.name;

//                         // Kiểm tra tính hợp lệ
//                         if (!subCommandFile.data.name || typeof subCommandFile.data.name !== 'string') {
//                             status = 'thiếu tên';
//                         } else if (!subCommandFile.data.description || typeof subCommandFile.data.description !== 'string') {
//                             status = 'thiếu description';
//                         } else {
//                             status = subCommandFile.gs === true ? 'lệnh của guild' : 'SCSubcommandBuilder';
//                         }

//                         table.addRow(file, status);
//                         commandData.push({ name: file, status });

//                         // Nếu là lệnh cho guild cụ thể
//                         if (subCommandFile.gs && Array.isArray(subCommandFile.g)) {
//                             for (const guildId of subCommandFile.g) {
//                                 if (!guildSpecificCommands[guildId]) {
//                                     guildSpecificCommands[guildId] = new SlashCommandBuilder()
//                                         .setName(subFolderName.toLowerCase())
//                                         .setDescription(`Nhóm lệnh ${subFolderName}`)
//                                         .setDMPermission(false);
//                                 }

//                                 guildSpecificCommands[guildId].addSubcommand(subCommand =>
//                                     Object.assign(subCommand, subCommandFile.data)
//                                 );
//                             }
//                         } else {
//                             subCommandGroup.addSubcommand(subCommand =>
//                                 Object.assign(subCommand, subCommandFile.data)
//                             );
//                         }

//                         subCommandMap.set(subCommandName, subCommandFile);
//                     }
//                 } catch (error) {
//                     console.error(`Lỗi khi tải lệnh con ${file} trong nhóm ${subFolderName}:`, error);
//                 }
//             }
//         }

//         // Nếu có subcommand thì thêm vào global
//         if (subCommandGroup.options.length > 0) {
//             globalCommands.push(subCommandGroup);
//         }

//         // Thêm riêng cho từng guild
//         for (const guildId in guildSpecificCommands) {
//             if (!guildCommands[guildId]) guildCommands[guildId] = [];
//             guildCommands[guildId].push(guildSpecificCommands[guildId]);
//         }

//         // Lưu vào client
//         client.commands.set(subFolderName.toLowerCase(), {
//             data: subCommandGroup,
//             subcommands: subCommandMap
//         });
//     }

//     // Export nếu mày cần
//     return { globalCommands, guildCommands, commandData };
// }

// module.exports = { loadCommands };
