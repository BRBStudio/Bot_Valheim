const { ContextMenuCommandBuilder, SlashCommandBuilder, ApplicationCommandType, SlashCommandSubcommandBuilder } = require('discord.js');
const ascii = require('ascii-table');
const fs = require('fs');

async function loadCommands(client) {
    const table = new ascii().setHeading("Commands", "Status");
    const commandData = [];
    const globalCommands = []; // Lệnh toàn cục
    const guildCommands = {}; // Lệnh dành riêng cho từng guild (key là guildId)

    const commandsFolder = fs.readdirSync('./Commands'); // Đọc danh sách thư mục trong thư mục Commands

    for (const folder of commandsFolder) { // Lặp qua từng thư mục con
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js')); // Lọc các tệp JavaScript trong thư mục

        const folderPath = `./Commands/${folder}`;
        const subFolders = fs.readdirSync(folderPath).filter(name => fs.statSync(`${folderPath}/${name}`).isDirectory()); // Lọc các thư mục con

        if (commandFiles.length === 0) { // Kiểm tra nếu thư mục không chứa tệp lệnh nào
            console.error(`Không có tệp lệnh hợp lệ trong thư mục '${folder}'.`);
            continue;
        }

        // xử lý lệnh chính slash
        for (const file of commandFiles) { // Lặp qua từng tệp lệnh
            try {
                // Đọc nội dung tệp để kiểm tra nếu mã bị chú thích hoàn toàn
                const fileContent = fs.readFileSync(`./Commands/${folder}/${file}`, 'utf-8');

                const isAllCommented = fileContent.split('\n').every(line => line.trim().startsWith('//') || line.trim().length === 0);

                if (isAllCommented) {
                    table.addRow(file, "bị bôi đen");
                    commandData.push({ name: file, status: "bị bôi đen" });
                    continue; // Không xử lý tệp này nữa
                }

                const commandFile = require(`../Commands/${folder}/${file}`); // Import tệp lệnh
                let status;

                // Kiểm tra tính hợp lệ của lệnh
                if (commandFile.data instanceof SlashCommandBuilder) {
                    // Kiểm tra lệnh Slash
                    if (!commandFile.data.name || typeof commandFile.data.name !== 'string') {
                        status = 'thiếu tên';
                    } else if (!commandFile.data.description || typeof commandFile.data.description !== 'string') {
                        status = 'thiếu description';
                    } else {
                        status = 'BRB STUDIO';
                    }
                } else if (commandFile.data instanceof ContextMenuCommandBuilder) {
                    // Kiểm tra lệnh Cảnh ngữ (Context Menu)
                    if (!commandFile.data.name || typeof commandFile.data.name !== 'string') {
                        status = 'thiếu tên';
                    } else if (!commandFile.data.type || ![ApplicationCommandType.Message, ApplicationCommandType.User].includes(commandFile.data.type)) {
                        status = 'thiếu type hoặc type không hợp lệ';
                    } else if (!commandFile.description || typeof commandFile.description !== 'string') {
                        status = 'thiếu description';
                    } else {
                        status = 'BRB STUDIO';
                    }
                } else {
                    status = 'Không phải lệnh hợp lệ';
                }

                table.addRow(file, status);
                commandData.push({ name: file, status: status });

                // Chỉ thêm lệnh hợp lệ vào danh sách
                if (status === 'BRB STUDIO') {
                    // Đặt DMPermission thành false để ngăn sử dụng trong DM
                    if (commandFile.data.setDMPermission) {
                        commandFile.data.setDMPermission(false);
                    }

                    if (commandFile.guildSpecific) {
                        // Xử lý lệnh dành riêng cho từng guild
                        const guildIds = Array.isArray(commandFile.guildId) ? commandFile.guildId : [commandFile.guildId]; // Đảm bảo luôn là mảng
                        for (const guildId of guildIds) {
                            if (!guildCommands[guildId]) guildCommands[guildId] = [];
                            guildCommands[guildId].push(commandFile.data);                           
                        }
                    } else {
                        // Xử lý lệnh toàn cục
                        globalCommands.push(commandFile.data);
                    } 
                    client.commands.set(commandFile.data.name, commandFile);
                }
            } catch (error) {
                console.error(`Không thể tải lệnh ${file}:`, error);
                table.addRow(file, 'Error');
            }
        }

        // ============================
        // XỬ LÝ NHÓM SUBCOMMAND
        // ============================

                // Xử lý nhóm lệnh trong thư mục con
for (const subFolder of subFolders) {
    const subFolderPath = `${folderPath}/${subFolder}`;
    const subCommandFiles = fs.readdirSync(subFolderPath).filter(file => file.endsWith('.js'));

    if (subCommandFiles.length > 0) {
        // Tạo nhóm lệnh từ tên thư mục con
        const subCommandGroup = new SlashCommandBuilder()
            .setName(subFolder.toLowerCase())
            .setDescription(`Nhóm lệnh ${subFolder}`)
            .setDMPermission(false);

        const subCommandMap = new Map(); // Lưu danh sách subcommand
        const guildSpecificCommands = {}; // Lưu lệnh riêng cho từng guild

        for (const file of subCommandFiles) {
            try {
                const subCommandFile = require(`../Commands/${folder}/${subFolder}/${file}`);
                let status;

                if (subCommandFile.data instanceof SlashCommandSubcommandBuilder) {
                    const subCommandName = subCommandFile.data.name;

                    // Kiểm tra tính hợp lệ của lệnh con
                    if (!subCommandFile.data.name || typeof subCommandFile.data.name !== 'string') {
                        status = 'thiếu tên';
                    } else if (!subCommandFile.data.description || typeof subCommandFile.data.description !== 'string') {
                        status = 'thiếu description';
                    } else {
                        // Kiểm tra nếu lệnh con có `gs: true`, thì đánh dấu là lệnh của guild
                        if (subCommandFile.gs === true) {
                            status = 'lệnh của guild';
                        } else {
                            status = 'SCSubcommandBuilder';
                        }
                    }

                    // Thêm vào bảng và danh sách
                    table.addRow(file, status); // Thêm vào bảng ASCII
                    commandData.push({ name: file, status: status }); // Lưu vào dữ liệu lệnh

                    // Nếu lệnh có `guildSpecific`, chỉ thêm vào guild cụ thể
                    if (subCommandFile.gs && Array.isArray(subCommandFile.g)) {
                        for (const guildId of subCommandFile.g) {
                            if (!guildSpecificCommands[guildId]) guildSpecificCommands[guildId] = new SlashCommandBuilder()
                                .setName(subFolder.toLowerCase())
                                .setDescription(`Nhóm lệnh ${subFolder}`)
                                .setDMPermission(false);

                            guildSpecificCommands[guildId].addSubcommand(subCommand => Object.assign(subCommand, subCommandFile.data));
                        }
                    } else {
                        subCommandGroup.addSubcommand(subCommand => Object.assign(subCommand, subCommandFile.data));
                    }

                    subCommandMap.set(subCommandName, subCommandFile);
                }

            } catch (error) {
                console.error(`Không thể tải lệnh con ${file} trong nhóm ${subFolder}:`, error);
            }
        }

        // Thêm nhóm lệnh vào danh sách đăng ký toàn cục nếu không có giới hạn guild
        if (subCommandGroup.options.length > 0) {
            globalCommands.push(subCommandGroup);
        }

        // Đăng ký lệnh con riêng cho từng guild
        for (const guildId in guildSpecificCommands) {
            if (!guildCommands[guildId]) guildCommands[guildId] = [];
            guildCommands[guildId].push(guildSpecificCommands[guildId]);
        }

        client.commands.set(subFolder.toLowerCase(), { data: subCommandGroup, subcommands: subCommandMap });
    }
}

        
    }

    // Đăng ký lệnh toàn cục
    try {

        globalCommands.forEach(command => command.setDMPermission(false)); // Đặt DMPermission cho tất cả lệnh toàn cục
        client.application.commands.set(globalCommands);
    } catch (error) {
        console.error('Không thể đăng ký lệnh toàn cục:', error);
    }
    
    // Đăng ký lệnh dành riêng cho từng guild
    for (const guildId in guildCommands) {
        try {
            const guild = client.guilds.cache.get(guildId);
            if (guild) {

                guildCommands[guildId].forEach(command => command.setDMPermission(false)); // Đặt DMPermission cho tất cả lệnh trong guild
                await guild.commands.set(guildCommands[guildId]);
            } else {
                console.error(`Guild ID không hợp lệ hoặc bot không có quyền: ${guildId}`);
            }
        } catch (error) {
            console.error(`Không thể đăng ký lệnh cho guild ${guildId}:`, error);
        }
    }

    const totalGlobal = globalCommands.length;
    const totalGuild = Object.values(guildCommands).reduce((acc, cmds) => acc + cmds.length, 0);

    return { commandData, totalGlobal, totalGuild };
}

module.exports = { loadCommands };


















// // đoạn này đang dùng hiện tại
// const { ContextMenuCommandBuilder, SlashCommandBuilder, ApplicationCommandType } = require('discord.js');
// const ascii = require('ascii-table');
// const fs = require('fs');

// async function loadCommands(client) {
//     const table = new ascii().setHeading("Commands", "Status");
//     const commandData = [];
//     const globalCommands = []; // Lệnh toàn cục
//     const guildCommands = {}; // Lệnh dành riêng cho từng guild (key là guildId)

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
//                     continue; // Không xử lý tệp này nữa
//                 }

//                 const commandFile = require(`../Commands/${folder}/${file}`);
//                 let status;

//                 // Kiểm tra tính hợp lệ của lệnh
//                 if (commandFile.data instanceof SlashCommandBuilder) {
//                     // Kiểm tra lệnh Slash
//                     if (!commandFile.data.name || typeof commandFile.data.name !== 'string') {
//                         status = 'thiếu tên';
//                     } else if (!commandFile.data.description || typeof commandFile.data.description !== 'string') {
//                         status = 'thiếu description';
//                     } else {
//                         status = 'BRB STUDIO';
//                     }
//                 } else if (commandFile.data instanceof ContextMenuCommandBuilder) {
//                     // Kiểm tra lệnh Cảnh ngữ (Context Menu)
//                     if (!commandFile.data.name || typeof commandFile.data.name !== 'string') {
//                         status = 'thiếu tên';
//                     } else if (!commandFile.data.type || ![ApplicationCommandType.Message, ApplicationCommandType.User].includes(commandFile.data.type)) {
//                         status = 'thiếu type hoặc type không hợp lệ';
//                     } else if (!commandFile.description || typeof commandFile.description !== 'string') {
//                         status = 'thiếu description';
//                     } else {
//                         status = 'BRB STUDIO';
//                     }
//                 } else {
//                     status = 'Không phải lệnh hợp lệ';
//                 }

//                 table.addRow(file, status);
//                 commandData.push({ name: file, status: status });

//                 // Chỉ thêm lệnh hợp lệ vào danh sách
//                 if (status === 'BRB STUDIO') {
//                     // Đặt DMPermission thành false để ngăn sử dụng trong DM
//                     if (commandFile.data.setDMPermission) {
//                         commandFile.data.setDMPermission(false);
//                     }

//                     if (commandFile.guildSpecific) {
//                         // Xử lý lệnh dành riêng cho từng guild
//                         const guildIds = Array.isArray(commandFile.guildId) ? commandFile.guildId : [commandFile.guildId]; // Đảm bảo luôn là mảng
//                         for (const guildId of guildIds) {
//                             if (!guildCommands[guildId]) guildCommands[guildId] = [];
//                             guildCommands[guildId].push(commandFile.data);                           
//                         }
//                     } else {
//                         // Xử lý lệnh toàn cục
//                         globalCommands.push(commandFile.data);
//                     }
                    
                      
                      
//                     client.commands.set(commandFile.data.name, commandFile);
//                 }
//             } catch (error) {
//                 console.error(`Không thể tải lệnh ${file}:`, error);
//                 table.addRow(file, 'Error');
//             }
//         }
//     }

//     // Đăng ký lệnh toàn cục
//     try {

//         // const currentGlobalCommands = await client.application.commands.fetch();

//         // // Lấy danh sách các lệnh đã quét từ thư mục
//         // const commandNamesFromFolder = globalCommands.map(cmd => cmd.name);

//         // for (const command of currentGlobalCommands.values()) {
//         //     if (!commandNamesFromFolder.includes(command.name)) {
//         //         console.log(`Xóa lệnh toàn cục: ${command.name}`);
//         //         try {
//         //             await command.delete();
//         //         } catch (error) {
//         //             if (error.code !== 10063) console.error(`Lỗi xóa lệnh ${command.name}:`, error);
//         //         }
//         //     }
//         // }

//         globalCommands.forEach(command => command.setDMPermission(false)); // Đặt DMPermission cho tất cả lệnh toàn cục
//         client.application.commands.set(globalCommands);
        
//         // console.log("Đăng ký và xóa lệnh toàn cục hoàn tất.");

//         // if (globalCommands.length > 0) {
//         //     console.log("Cập nhật lệnh toàn cục...");
//         //     await client.application.commands.set(globalCommands);
//         //     console.log("Lệnh toàn cục đã được cập nhật.");
//         // } else {
//         //     console.log("Không có lệnh toàn cục nào để cập nhật.");
//         // }
//     } catch (error) {
//         console.error('Không thể đăng ký lệnh toàn cục:', error);
//     }
    
//     // Đăng ký lệnh dành riêng cho từng guild
//     for (const guildId in guildCommands) {
//         try {
//             const guild = client.guilds.cache.get(guildId);
//             if (guild) {

//                 // const currentGuildCommands = await guild.commands.fetch();

//                 // // So sánh lệnh trong guild với lệnh trong thư mục
//                 // for (const command of currentGuildCommands.values()) {
//                 //     if (!commandNamesFromFolder.includes(command.name)) {
//                 //         console.log(`Xóa lệnh trong guild ${guildId} không còn trong thư mục: ${command.name}`);
//                 //         await guild.commands.delete(command.id);
//                 //     }
//                 // }

//                 guildCommands[guildId].forEach(command => command.setDMPermission(false)); // Đặt DMPermission cho tất cả lệnh trong guild
//                 await guild.commands.set(guildCommands[guildId]);
//             } else {
//                 console.error(`Guild ID không hợp lệ hoặc bot không có quyền: ${guildId}`);
//             }
//         } catch (error) {
//             console.error(`Không thể đăng ký lệnh cho guild ${guildId}:`, error);
//         }
//     }

//     const totalGlobal = globalCommands.length;
//     const totalGuild = Object.values(guildCommands).reduce((acc, cmds) => acc + cmds.length, 0);

//     return { commandData, totalGlobal, totalGuild };
//     // return commandData;
// }

// module.exports = { loadCommands };
// // đoạn này đang dùng