const { Client, WebhookClient, EmbedBuilder, GatewayIntentBits, Partials, ActivityType, Collection } = require('discord.js');
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const ascii = require('ascii-table');
const colors = require('colors'); // dùng để đổi màu chữ cho terminal

// https://discord.com/api/webhooks/1263441356236525633/PpSigokbBjqJBxbf9yV-c4iy2TDxFXfP8ontBx54L05MsI3ip9yJA4uXaEFp0BDZjnCk
// const webhookURL = 'https://discord.com/api/webhooks/1343502953356722309/SA8jzNELSvad3-QPrq-GPUniIjXGrnBj9djnyiJhW2Dk3n6qaihS2ZbDruTc8AtJ8yMF';
const webhookURL = process.env.WEBHOOK_URL;
const webhookClient = new WebhookClient({ url: webhookURL });

const { User, Message, GuildMember } = Partials

const { loadEvents } = require('./Handlers/EventHandler');
const { loadCommands } = require('./Handlers/CommandsHandler');
const { loadButtons } = require('./Handlers/ButtonHandler');
const { loadPrefix } = require('./Handlers/PrefixHandler')
const { loadModals } = require ('./Handlers/ModalsHandler')
const { loadContextMenus } = require('./Handlers/ContextMenuHandler');
const { loadSelectMenus } = require('./Handlers/SelectMenusHandler');

const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers, // theo dõi các thành viên
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildPresences, // theo dõi trạng thái
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution
        ],
    partials: [User, Message, GuildMember],
});

const config = require('./config');
client.config = config;

// // Gửi log về shard manager
// const logToManager = (message) => {
//     if (process.send) process.send(message);
// };

// // Khi shard kết nối thành công
// client.once('ready', () => {
//     const shardId = client.shard && client.shard.ids.length > 0 ? client.shard.ids[0] : 0;
//     console.log(colors.green(`✅ Shard ${shardId} đã kết nối thành công với Discord!`));
//     logToManager(`✅ Shard ${shardId} đã kết nối thành công với Discord!`);
// });

// // Kiểm tra nếu bot bị giới hạn tốc độ (rate limit)
// client.on('rateLimit', (info) => {
//     console.warn(`⚠️ Bot bị giới hạn tốc độ!`, info);
// });

// // // Lắng nghe sự kiện debug, dùng để hiển thị thông tin gỡ lỗi chi tiết
// // client.on('debug', (info) => {
// //     console.log(`🔍 Thông tin gỡ lỗi:`, info);
// // });

// // Sự kiện xảy ra khi một shard bị mất kết nối với Discord
// client.on('shardDisconnect', (event, id) => { 
//     console.warn(`⚠️ Shard ${id} bị mất kết nối! Lý do:`, event);
// });

// // Khi shard bắt đầu quá trình kết nối lại sau khi mất kết nối
// client.on('shardReconnecting', (id) => {
//     console.log(`🔄 Shard ${id} đang kết nối lại...`);
// });

// // Khi shard kết nối lại thành công, có thể kèm theo số sự kiện đã phát lại
// client.on('shardResume', (id, replayedEvents) => {
//     console.log(`✅ Shard ${id} đã kết nối lại! Đã phát lại ${replayedEvents} sự kiện.`);
// });

// Kiểm soát phiên bản //
const currentVersion = `${config.botVersion}`;
const { checkVersion, getLatestVersion } = require('./lib/version');

client.commands = new Collection();
client.prefixCommands = new Collection(); // Thêm dòng này
client.prefixCommandsDescriptions = {}; // Thêm dòng này
client.buttons = new Collection(); // Thêm dòng này
client.contextMenus = new Collection(); // Thêm dòng này
client.modals = new Collection(); // Thêm dòng này
client.selectMenus = new Collection(); // Thêm dòng này
client.roleSelectMenus = new Collection();

/////////////////////////////////// tạm thời tắt
// Nạp các lệnh button
const buttonPath = path.join(__dirname, 'InteractionTypes/buttons');
const buttonFiles = fs.readdirSync(buttonPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const button = require(path.join(buttonPath, file));
    // client.buttons.set(button.customId, button);
    client.buttons.set(button.id, button); // Đặt ID nút để xử lý sau này
}

// gộp Events, Commands... vào 1 hàng trong terminal
client.login(process.env.token).then( async () => {


    const eventData = await loadEvents(client);
    const { commandData, totalGlobal, totalGuild } = await loadCommands(client);
    const buttonData = await loadButtons(client);
    const prefixData = await loadPrefix(client);
    const contextMenuData = await loadContextMenus(client); // Thêm dòng này
    const modalData = await loadModals(client); // Thêm dòng này
    const selectMenuData = await loadSelectMenus(client); // Thêm dòng này

    // Đếm số lượng
    const eventCount = eventData.length; // Số lượng events
    const commandCount = commandData.length; // Số lượng lệnh slash
    const totalCommands = totalGlobal + totalGuild; // tổng lệnh s'láh
    const buttonCount = buttonData.length; // Số lượng nút
    const prefixCount = prefixData.length; // Số lượng lệnh prefix
    const contextMenuCount = contextMenuData.length; // Số lượng contextMenu
    const modalCount = modalData.length; // Số lượng modal
    const selectMenuCount = selectMenuData.length; // Số lượng lựa chọn menu

    // Tạo bảng ASCII không màu để định dạng dữ liệu
    const combinedTable = new ascii().setHeading(
        `Events (${eventCount})`.padEnd(25), // Cập nhật tiêu đề cột Events  'Events'.padEnd(3),
        'Events Status'.padEnd(3),
        // `Commands (${commandCount})`.padEnd(25), // 'Commands'.padEnd(3),
        `Commands (${totalCommands}) - ${totalGlobal}/${totalGuild}`.padEnd(25),
        'Commands Status'.padEnd(3),
        `Buttons (${buttonCount})`.padEnd(25), // 'Buttons'.padEnd(3),
        'Buttons Status'.padEnd(3),
        `Prefix Commands (${prefixCount})`.padEnd(25), // 'Prefix Commands'.padEnd(3),
        'Prefix Commands Status'.padEnd(3)// mới sửa
    );

    const combinedTable1 = new ascii().setHeading(
        `contextMenu (${contextMenuCount})`.padEnd(25), // 'contextMenu'.padEnd(3),
        'contextMenu Status'.padEnd(3),
        `modal (${modalCount})`.padEnd(25), // 'modal'.padEnd(3),
        'modal Status'.padEnd(3),
        `selectMenu (${selectMenuCount})`.padEnd(25), // 'selectMenu'.padEnd(3),
        'selectMenu Status'.padEnd(3),
    );

    // Tìm số lượng bản ghi lớn nhất
    const maxLength = Math.max(
        eventData.length,
        commandData.length,
        buttonData.length,
        prefixData.length,
        contextMenuData.length, // Thêm dòng này
        modalData.length, // Thêm dòng này
        selectMenuData.length, // Thêm dòng này
    );

    // Điền dữ liệu vào bảng tổng hợp
    for (let i = 0; i < maxLength; i++) {
        const event = eventData[i] || { name: '', status: '' };
        const command = commandData[i] || { name: '', status: '' };
        const button = buttonData[i] || { name: '', status: '' };
        const prefix = prefixData[i] || { name: '', status: '' };
        const contextMenu = contextMenuData[i] || { name: '', status: '' }; // Thêm dòng này
        const modal = modalData[i] || { name: '', status: '' }; // Thêm dòng này
        const selectMenu = selectMenuData[i] || { name: '', status: '' }; // Thêm dòng này

        combinedTable.addRow(
            event.name.padEnd(3),
            event.status.padEnd(3),
            command.name.padEnd(3),
            command.status.padEnd(3),
            button.name.padEnd(3),
            button.status.padEnd(3),
            prefix.name.padEnd(3),
            prefix.status.padEnd(3)
        );

        combinedTable1.addRow(
            contextMenu.name.padEnd(3),
            contextMenu.status.padEnd(3),
            modal.name.padEnd(3),
            modal.status.padEnd(3),
            selectMenu.name.padEnd(3),
            selectMenu.status.padEnd(3),
        );

    }

    // // Thay đổi màu cho các giá trị trong bảng
    const applyColor = (line) => {

        // Kiểm tra status cụ thể trong từng dòng và áp dụng màu tương ứng
        if (line.includes('tệp tin rỗng')) {
            return line.replace('tệp tin rỗng', colors.bgRed('tệp tin rỗng'));
        } else if (line.includes('thiếu tên')) {
            return line.replace('thiếu tên', colors.bgRed('thiếu tên'));
        } else if (line.includes('thiếu description')) {
            return line.replace('thiếu description', colors.bgRed('thiếu description'));
        } else if (line.includes('lỗi cú pháp')) {
            return line.replace('lỗi cú pháp', colors.bgRed('lỗi cú pháp'));
        } else if (line.includes('thiếu id')) {
            return line.replace('thiếu id', colors.bgRed('thiếu id'));
        } else if (line.includes('thiếu type')) {
            return line.replace('thiếu type', colors.bgRed('thiếu type'));
        } else if (line.includes('bị bôi đen')) {
            return line.replace('bị bôi đen', colors.bgRed('bị bôi đen'));
        } else if (line.includes('Lỗi')) {
            return line.replace('Lỗi', colors.red('Lỗi'));
        }


// Màu xanh cho 'Events'
line = line.replace(/Events \(\d+\)/g, match => colors.green(match));
// Màu xanh cho 'Events Status'
line = line.replace(/Events Status/g, match => colors.green(match));

// Màu cyan cho 'Commands' - Chỉ thay phần "Commands" không ảnh hưởng đến "Prefix Commands"
line = line.replace(/(?<!Prefix )Commands \(\d+\) - \d+\/\d+/g, match => colors.green(match));  // Sử dụng lookbehind để tránh thay thế trong "Prefix Commands" // \(\d+\)/g

// Màu cyan cho 'Commands Status'
// line = line.replace(/Commands Status/g, match => colors.green(match));
line = line.replace(/(?<!Prefix )Commands Status(?! Status)/g, match => colors.green(match));

// Màu tím cho 'Buttons'
line = line.replace(/Buttons \(\d+\)/g, match => colors.green(match));
// Màu tím cho 'Buttons Status'
line = line.replace(/Buttons Status/g, match => colors.green(match));

// Màu vàng cho 'Prefix Commands' (cả cụm "Prefix Commands")
line = line.replace(/Prefix Commands \(\d+\)/g, match => colors.green(match));
// Màu vàng cho 'Prefix Commands Status' (cả cụm "Prefix Commands Status")
line = line.replace(/Prefix Commands Status/g, match => colors.green(match));

// Màu xanh cho 'contextMenu'
line = line.replace(/(?<!Status )contextMenu \(\d+\)/g, match => colors.green(match));  // Sử dụng lookbehind để tránh thay thế trong "Prefix Commands"
// Màu xanh cho 'contextMenu Status'
line = line.replace(/contextMenu Status/g, match => colors.green(match));

// Màu xanh cho 'modal'
line = line.replace(/(?<!Status )modal \(\d+\)/g, match => colors.green(match));  // Sử dụng lookbehind để tránh thay thế trong "Prefix Commands"
// Màu xanh cho 'modal Status'
line = line.replace(/modal Status/g, match => colors.green(match));

// Màu tím cho 'selectMenu'
line = line.replace(/selectMenu \(\d+\)/g, match => colors.green(match));
// Màu tím cho 'selectMenu Status'
line = line.replace(/selectMenu Status/g, match => colors.green(match));


// Các dòng còn lại giữ nguyên màu trắng
return colors.white(line);
    };

    // Áp dụng màu cho các tiêu đề trong bảng
const colorTable = combinedTable.toString().split('\n').map(line => {
    // Áp dụng màu cho các dòng có chứa '|' (khung bảng)
    return line.includes('|') ? applyColor(line) : colors.white(line);
}).join('\n');

const colorTable1 = combinedTable1.toString().split('\n').map(line => {
    // Áp dụng màu cho các dòng có chứa '|' (khung bảng)
    return line.includes('|') ? applyColor(line) : colors.white(line);
}).join('\n');

    console.log(colorTable);    
    console.log(colorTable1);
    await checkVersion(currentVersion,client);

    // hoặc dùng Thêm độ trễ 2 giây trước khi hiển thị Kiểm tra phiên bản mới nhất
    setTimeout(async () => {
        // Kiểm tra phiên bản mới nhất trước khi in thông báo khởi động
        const latestVersion = await getLatestVersion();
        console.log(` ـﮩ٨ـ Phiên bản mới nhất Github là: ${latestVersion}`);

    }, 2000);  // Đợi 2 giây trước khi hiển thị Kiểm tra phiên bản mới nhất

});

// Xử lý lỗi chưa được xử lý (không có try-catch).
process.on('uncaughtException', async (error) => {
    // console.error('Lỗi chưa được xử lý:', error);

    // Xử lý lỗi cụ thể
    let color = "Red";
    let title = "Lỗi chưa được xử lý";
    let description = `**Lỗi Code:** \`${error.name || 'Không xác định'}\`\n**Lỗi tin nhắn:** \`${error.message || 'Không xác định'}\`\n**Hiển thị lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;

    // Xử lý các lỗi cụ thể
    if (error.code === 10062) {
        color = "Purple";
        title = "Lỗi tương tác không xác định (Unknown Interaction)";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code === 50013) {
        color = "Blue";
        title = "Lỗi thiếu quyền (Missing Permissions)";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code !== 10008) {
        color = "Green";
        title = "Lỗi Không Xác Định";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code === 10008) {
        color = "Orange";
        title = "Lỗi tin nhắn không xác định (Unknown Message)";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code === 50007) {
        color = "Pink"; // gửi một tin nhắn hoặc thực hiện một hành động nào đó liên quan đến tin nhắn
        title = "Lỗi sử dụng emoji trong các nút, hoặc fields không hợp lệ (Invalid Form Body)";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code === 50035) {
        color = "Red"; // gửi dữ liệu không hợp lệ trong các trường cụ thể, các thành phần tương tác như nút , menu, hoặc các thành phần khác.
        title = "Lỗi sử dụng emoji trong các nút, hoặc fields không hợp lệ (Invalid Form Body)";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    }

    try {
        await webhookClient.send({
            embeds: [
                new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: `Bộ nhớ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%` })
                .setTimestamp()
            ]
        });
    } catch (webhookError) {
        console.error('Lỗi khi gửi thông báo lỗi đến webhook:', webhookError);
    }
});

// Được kích hoạt khi một Promise bị từ chối mà không có xử lý lỗi
process.on('unhandledRejection', async (reason, promise) => {
    // console.error('Lỗi từ promise chưa được xử lý:', reason);

    // Kiểm tra nếu lỗi đến từ file "top.js" trong thư mục "Commands/4. THÀNH VIÊN/"
    if (reason.stack && reason.stack.includes('Commands\\4. THÀNH VIÊN\\top.js')) {
        return;
    }

    // Xử lý lỗi cụ thể
    let color = "Orange";
    let title = "Lỗi từ promise chưa được xử lý";
    let description = `**Lỗi:** \`${reason.message || 'Không xác định'}\`\n**Promise:** \`${promise}\`\n**Hiển thị lỗi:** \`\`\`yml\n${reason.stack || 'Không có thông tin lỗi'}\`\`\`\n${reason}`;

    // Gửi lỗi tới webhook
    try {
        await webhookClient.send({
            embeds: [
                new EmbedBuilder()
                .setColor(color) 
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: `Bộ nhớ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%` })
                .setTimestamp()
            ]
        });
    } catch (webhookError) {
        console.error('Lỗi khi gửi thông báo lỗi đến webhook:', webhookError);
    }
});

// Được kích hoạt khi một Promise bị từ chối và sau đó được xử lý
process.on('rejectionHandled', (promise) => {
    console.log('Promise bị từ chối sau đó được xử lý:', promise);
    // Xử lý thêm nếu cần
});

// mã màu ansi dùng cho cảnh báo process.on('warning', (warning)
const colorAnsi = {
    red: '\x1b[31m',
    orange: '\x1b[38;5;202m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    pink: '\x1b[38;5;213m',
    torquise: '\x1b[38;5;45m', // Xanh ngọc
    reset: '\x1b[0m',          // màu mặc định

    lightRed: '\x1b[38;5;197m',     // Đỏ sáng
    lightGreen: '\x1b[38;5;82m',    // Xanh lá cây sáng
    lightYellow: '\x1b[38;5;227m',  // Vàng sáng
    lightBlue: '\x1b[38;5;75m',     // Xanh dương sáng
    lightPink: '\x1b[38;5;213m',    // Hồng sáng

    darkRed: '\x1b[38;5;124m',      // Đỏ tối
    darkGreen: '\x1b[38;5;22m',     // Xanh lá cây tối
    darkYellow: '\x1b[38;5;130m',   // Vàng tối
    darkBlue: '\x1b[38;5;17m',      // Xanh dương tối
    darkPink: '\x1b[38;5;199m',     // Hồng tối

    cyan: '\x1b[36m',               // Xanh lam nhạt
    magenta: '\x1b[35m',            // Tím
    gray: '\x1b[90m',               // Xám
    lightGray: '\x1b[37m',          // Xám sáng
    darkGray: '\x1b[90m',           // Xám đen

    lightCyan: '\x1b[96m',          // Xanh lam sáng
    lightMagenta: '\x1b[95m',       // Tím sáng
    darkCyan: '\x1b[36m',           // Xanh lam tối
    darkMagenta: '\x1b[35m',        // Tím tối
    brown: '\x1b[33m',              // Nâu

    purple: '\x1b[35m',             // Tím
    lightPurple: '\x1b[38;5;171m',  // Tím sáng
    deepBlue: '\x1b[38;5;17m',      // Xanh dương sâu
    olive: '\x1b[38;5;64m',         // Xanh ô liu
    teal: '\x1b[38;5;37m',          // Xanh lam xanh

    salmon: '\x1b[38;5;209m',       // Đỏ hồng
    peach: '\x1b[38;5;216m',        // Đào
    lavender: '\x1b[38;5;207m',     // Hoa oải hương
    mint: '\x1b[38;5;119m',         // Xanh bạc hà
    coral: '\x1b[38;5;202m'         // San hô
}


// cảnh báo lỗi thời
process.on('warning', (warning) => {
    console.warn(`${colorAnsi.red}[ TÊN CẢNH BÁO ]:`, warning.name); // Tên cảnh báo
    console.warn(`${colorAnsi.red}[ NỘI DUNG CẢNH BÁO ]:`, warning.message); // Nội dung cảnh báo
    console.warn(`${colorAnsi.red}[ CHI TIẾT CẢNH BÁO ]:`, warning.stack); // Chi tiết cảnh báo (stack trace)
});
module.exports = client;


/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/
