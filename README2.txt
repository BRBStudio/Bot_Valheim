const { SlashCommandBuilder, ContextMenuCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config');
const { row3 } = require('../../ButtonPlace/ActionRowBuilder');
const { createInviteEmbed, createReportEmbed, createEmptyCategoryEmbed, createEmbedEmbed } = require(`../../Embeds/embedsCreate`)
const CommandStatus = require('../../schemas/Command_Status');
const GuildPrefix = require('../../schemas/GuildPrefix');

// Biểu tượng cảm xúc danh mục lệnh slash
const SlashCommandEmojis = {
    '0. DEV': `👩🏻‍💻`,
    '1. SERVER OWNER': '👑',
    '2. ADMIN': '♛',
    '3. ADMIN 1': '♛',
    '4. THÀNH VIÊN': '👨‍👨‍👦‍👦',
    '5. THÀNH VIÊN 1': '👨‍👨‍👦‍👦',
    '6. RANK & XP': '🏆',
    '7. AI': '🤖',
    '8. GAMES': '🎮',
    '9. TUYỂN DỤNG': '💼',
    '10. ANTI SPAM': '⛔',
    '11. SEND MAIL TO DEV': '💌',
    '12. VOTE': '📊',
    'other': '⌛' // Danh mục Mặc định
};

// console.log(SlashCommandEmojis['10. ANTI SPAM']); // In ra emoji '⛔'

// Biểu tượng cảm xúc file lệnh slash, chỉ chứa tên file không có đuôi
const fileEmojis = {
    // 0. DEV (14)
    'abck': `<a:diamond1:1318123134787911720>`,
    'blacklist_dev': `<a:diamond1:1318123134787911720>`,
    'delete_command': `<a:diamond1:1318123134787911720>`,
    'delete_global_commands': `<a:diamond1:1318123134787911720>`,
    'discordjs_guide': '<a:diamond1:1318123134787911720>',
    'owen': '<a:diamond1:1318123134787911720>',
    'premium': '<a:diamond1:1318123134787911720>',
    'reload_Commands': '<a:diamond1:1318123134787911720>',
    'reload_Events': '<a:diamond1:1318123134787911720>',
    'send_gmail': '<a:diamond1:1318123134787911720>',
    'servers': '<a:diamond1:1318123134787911720>',
    'set_nsfw': '<a:diamond1:1318123134787911720>',
    'setlanguage': '<a:diamond1:1318123134787911720>',
    'user_scraper': '<a:diamond1:1318123134787911720>',
    'warn': '<a:diamond1:1318123134787911720>',

    // 1. SERVER OWNER (10)
    'autoresponder': `<a:vip:1320072970340925470>`,
    'blacklist': `<a:vip:1320072970340925470>`,
    'change_prefix': '<a:vip:1320072970340925470>',
    'clear_prime': `<a:vip:1320072970340925470>`,
    'info_bot': `<a:vip:1320072970340925470>`,
    'Mk_Valheim': `<a:vip:1320072970340925470>`,
    'setup_count': `<a:vip:1320072970340925470>`,
    'setup_server': `<a:vip:1320072970340925470>`,
    'setviewtime': `<a:vip:1320072970340925470>`,
    'welcome_custom': `<a:vip:1320072970340925470>`,
    'welcome_default': `<a:vip:1320072970340925470>`,

    // 2. ADMIN (17)
    'announce': '<a:Admin:1319981885002354781>',
    'anti_swear': '<a:Admin:1319981885002354781>',
    // 'ban': '<a:Admin:1319981885002354781>',
    'Create_Role': '<a:Admin:1319981885002354781>',
    'Edit_channel_name': '<a:Admin:1319981885002354781>',
    'give': '<a:Admin:1319981885002354781>',
    'hi': '<a:Admin:1319981885002354781>',
    // 'kick': '<a:Admin:1319981885002354781>',
    'modpanel-PhatCoThoiGian': '<a:Admin:1319981885002354781>',
    'pickrole_add_role': '<a:Admin:1319981885002354781>',
    'pickrole_message': '<a:Admin:1319981885002354781>',
    'refresh_channel': '<a:Admin:1319981885002354781>',
    'say_bot': '<a:Admin:1319981885002354781>',
    'server_statistics_premium': '<a:Admin:1319981885002354781>',
    'slow_mode': '<a:Admin:1319981885002354781>',
    'status_bot': '<a:Admin:1319981885002354781>',
    'steal_emoji': '<a:Admin:1319981885002354781>',

    // 3. ADMIN 1 (15)
    'brb_studio': '<a:Admin:1319981885002354781>',
    'giveaway': '<a:Admin:1319981885002354781>',
    'gmail': '<a:Admin:1319981885002354781>',
    'invites_code': '<a:Admin:1319981885002354781>',
    'leave_guild': '<a:Admin:1319981885002354781>',
    'random_question': '<a:Admin:1319981885002354781>',
    'setup_anti_channel': '<a:Admin:1319981885002354781>',
    'setup': '<a:Admin:1319981885002354781>',
    'thay đổi biệt danh nick': '<a:Admin:1319981885002354781>',
    'ticket': '<a:Admin:1319981885002354781>',
    // 'timeout': '<a:Admin:1319981885002354781>',
    // 'unban': '<a:Admin:1319981885002354781>',
    'untag': '<a:Admin:1319981885002354781>',
    'userinfo': '<a:Admin:1319981885002354781>',
    'verify_custom': '<a:Admin:1319981885002354781>',
    'verify_default': '<a:Admin:1319981885002354781>',

    // 4. THÀNH VIÊN (19)
    'brb': '<a:Pubg:1320080665957367838>',
    'building': '<a:Pubg:1320080665957367838>',
    'clear_user': '<a:Pubg:1320080665957367838>',
    'commands_bot': '<a:Pubg:1320080665957367838>',
    'commands_new': '<a:Pubg:1320080665957367838>',
    'embedcreator': '<a:Pubg:1320080665957367838>',
    'emoji': '<a:Pubg:1320080665957367838>',
    'event': '<a:Pubg:1320080665957367838>',
    'feedback': '<a:Pubg:1320080665957367838>',
    'generate_bot_invite': '<a:Pubg:1320080665957367838>',
    'lock_channel': '<a:Pubg:1320080665957367838>',
    'meeting_virtual': '<a:Pubg:1320080665957367838>',
    'message_secret': '<a:Pubg:1320080665957367838>',
    'ping_api': '<a:Pubg:1320080665957367838>',
    'qr': '<a:Pubg:1320080665957367838>',
    'report_user': '<a:Pubg:1320080665957367838>',
    'speak': `<a:Pubg:1320080665957367838>`,
    'version_bot': '<a:Pubg:1320080665957367838>',
    'top': '<a:Pubg:1320080665957367838>',

    // 5. THÀNH VIÊN 1 (21)
    'avatar': '<a:Pubg:1320080665957367838>',
    'bitcoin': '<a:Pubg:1320080665957367838>',
    'confess': '<a:Pubg:1320080665957367838>',
    'dev': '<a:Pubg:1320080665957367838>',
    'economy': '<a:Pubg:1320080665957367838>',
    'get_help': '<a:Pubg:1320080665957367838>',
    'help_valheim': '<a:Pubg:1320080665957367838>',
    'id': '<a:Pubg:1320080665957367838>',
    'info_server': '<a:Pubg:1320080665957367838>',
    'join_game': '<a:Pubg:1320080665957367838>',
    'Matrix': '<a:Pubg:1320080665957367838>',
    'profile': '<a:Pubg:1320080665957367838>',
    'proviso_bot': '<a:Pubg:1320080665957367838>',
    'rate_server': '<a:Pubg:1320080665957367838>',
    'role_members': '<a:Pubg:1320080665957367838>',
    'shows_role_members': '<a:Pubg:1320080665957367838>',
    'solve': '<a:Pubg:1320080665957367838>',
    'statute_server': '<a:Pubg:1320080665957367838>',
    'sup': '<a:Pubg:1320080665957367838>',
    'timer': '<a:Pubg:1320080665957367838>',
    'todo': '<a:Pubg:1320080665957367838>',
    'translate': '<a:Pubg:1320080665957367838>',
    // 'vote_image': '<a:Pubg:1320080665957367838>',

    // 6. RANK & XP (3)
    'rank': '<a:level:1249383009874874520>',
    'thanks': '<a:level:1249383009874874520>',
    'xp': '<a:level:1249383009874874520>',

    // 7. AI (6)
    'AI_LẤY_TRỘM_EMOJI': '<a:robot:1318107635802963999>',
    'AI_TIẾNG_ANH': '<a:robot:1318107635802963999>',
    'AI_TIẾNG_VIỆT': '<a:robot:1318107635802963999>',
    'CHÀO_THÀNH_VIÊN': '<a:robot:1318107635802963999>',
    'ĐÂY_LÀ_AI': '<a:robot:1318107635802963999>',
    'XP_CỦA_NGƯỜI_DÙNG': '<a:robot:1318107635802963999>',

    // 8. GAMES (2)
    'game_iq': `<a:gameboy:1318103353556729876>`,
    'find_team': `<a:gameboy:1318103353556729876>`,

    // 9.TUYỂN DỤNG (2)
    'ping_staff': `<a:tuyendung:1318173785039437824>`,
    'recruitment': `<a:tuyendung:1318173785039437824>`,

    // 10. ANTI SPAM MESS (2)
    'anti_spam': `<a:anti:1320081970063216730>`,
    'remove_anti_spam_mess': `<a:anti:1320081970063216730>`,

    // 11. SEND MAIL TO DEV (1)
    'mailbox_remake': `<a:mail:1320082270513664161>`,

    // 13. Vote (4)
    'poll_prime': '<a:vote_star:1343454905351802930>',
    'poll': '<a:vote_star:1343454905351802930>',
    'vote_image': '<a:vote_star:1343454905351802930>',
    'vote_valheim': '<a:vote_star:1343454905351802930>',
};

// Biểu tượng cảm xúc danh mục lệnh prefix
const PrefixCommandsEmojis = {
    '0. DEV': '👩🏻‍💻',
    '1. SERVER OWNER': '👑', // Chuyển đổi khóa thành chữ in hoa để đồng nhất
    '2. ADMIN': '♛',
    '3. THÀNH VIÊN': '👨‍👨‍👦‍👦',
    '4. GAME': '🎮',
    'AI': '🤖',
    'NUDE 18+': '🔞',
    'Rank & XP': '🏆',
    'TUYỂN_DỤNG': '💼',
    'Utils': '🛠️',
    'other': '⌛' // Danh mục Mặc định
};

// Biểu tượng cảm xúc file lệnh tiền tố, chỉ chứa tên file không có đuôi
const prefixEmojis = {

    // 0. dev (9)
    'broadcast': '<a:diamond1:1318123134787911720>',
    'button': '<a:diamond1:1318123134787911720>',
    'color': '<a:diamond1:1318123134787911720>',
    'join_game': '<a:diamond1:1318123134787911720>',
    'kcl1': '<a:diamond1:1318123134787911720>',
    'khảo sát': '<a:diamond1:1318123134787911720>',
    'recharge': '<a:diamond1:1318123134787911720>', 
    'status_commands': '<a:diamond1:1318123134787911720>',
    'top': '<a:diamond1:1318123134787911720>',
    'zzzzz': '<a:diamond1:1318123134787911720>',

    // 1. SERVER OWNER (2)
    'filter_members': '<a:vip:1320072970340925470>',

    // 2. ADMIN (2)
    'lock': '<a:Admin:1319981885002354781>',
    'unlock': '<a:Admin:1319981885002354781>',

    // 3. THÀNH VIÊN (11)
    'auto_reply': '<a:Pubg:1320080665957367838>',
    'check_acc': '<a:Pubg:1320080665957367838>',
    'hack': '<a:Pubg:1320080665957367838>',
    'intro': '<a:Pubg:1320080665957367838>',
    'owner': '<a:Pubg:1320080665957367838>',
    'pairing': '<a:Pubg:1320080665957367838>',
    'perm': '<a:Pubg:1320080665957367838>',
    'sup': '<a:Pubg:1320080665957367838>',
    'tmc': '<a:Pubg:1320080665957367838>',
    'ytb': '<a:Pubg:1320080665957367838>',

    // 4. game (8)
    'dkbd': '<a:gameboy:1318103353556729876>',
    'findemoji': '<a:gameboy:1318103353556729876>',
    'Fishventure': '<a:gameboy:1318103353556729876>',
    'flood': '<a:gameboy:1318103353556729876>',
    'Lottery': '<a:gameboy:1318103353556729876>',
    'minesweeper': '<a:gameboy:1318103353556729876>',
    'MysSearch': '<a:gameboy:1318103353556729876>',
    'online': '<a:gameboy:1318103353556729876>',

};

// Đọc các lệnh prefix từ thư mục PrefixCommands
const prefixCommands = {};
const prefixCategories = {};
const prefixFolders = fs.readdirSync('./PrefixCommands');
for (const folder of prefixFolders) {
    const commandFiles = fs.readdirSync(`./PrefixCommands/${folder}`).filter(file => file.endsWith('.js'));
    const folderName = folder.toUpperCase();
    prefixCategories[folderName] = []; // Khởi tạo danh mục
    
    for (const file of commandFiles) {
        const fileNameWithoutExt = file.split('.').shift();
        const commandFile = require(`../../PrefixCommands/${folder}/${file}`);

        // Nếu lệnh có `hidden: true`, bỏ qua
        if (commandFile.hidden) continue;

        prefixCommands[fileNameWithoutExt] = {
            name: fileNameWithoutExt,
            description: commandFile.description, // `Đây là lệnh prefix, hãy dùng ?${fileNameWithoutExt}`, nếu cần thì thêm || `Đây là lệnh prefix, hãy dùng ?${commandFile.name}
            hd: commandFile.hd, // Đọc usage từ file lệnh
            q: commandFile.q, // Đọc accessableby từ file lệnh
            emoji: prefixEmojis[fileNameWithoutExt] || '•'
        };
        prefixCategories[folderName].push(fileNameWithoutExt); // Thêm vào danh mục
    }
}


// for (const folder of prefixFolders) {
//     const commandFiles = fs.readdirSync(`./PrefixCommands/${folder}`).filter(file => file.endsWith('.js'));
//     const folderName = folder.toUpperCase();
//     prefixCategories[folderName] = []; // Khởi tạo danh mục

//     for (const file of commandFiles) {
//         const fileNameWithoutExt = file.split('.').shift(); // Lấy tên file (không có phần mở rộng)

        
//             // Import file lệnh, kiểm tra xem file có hợp lệ không
//             const commandFile = require(`../../PrefixCommands/${folder}/${file}`);
//             console.log('Nội dung file lệnh:', commandFile);
            
//             // Kiểm tra nếu lệnh có mô tả, nếu không thì dùng mô tả mặc định
//             const description = commandFile.description || `Mô tả mặc định cho lệnh ${fileNameWithoutExt}`;
            
//             // Thêm lệnh vào prefixCommands
//             prefixCommands[fileNameWithoutExt] = {
//                 name: fileNameWithoutExt,
//                 description: description, // Dùng mô tả từ nội dung file hoặc mặc định
//                 emoji: prefixEmojis[fileNameWithoutExt] || '•' // Dùng biểu tượng cảm xúc mặc định
//             };

//             // Thêm vào danh mục
//             prefixCategories[folderName].push(fileNameWithoutExt);
        
//     }
// }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands_bot')
        .setDescription('🔹 Liệt kê tất cả các lệnh hoặc thông tin về một lệnh cụ thể'),

    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/commands_bot' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Tìm tiền tố của máy chủ hiện tại từ cơ sở dữ liệu
        const guildData = await GuildPrefix.findOne({ guildId: interaction.guild.id });
        const currentPrefix = guildData ? guildData.prefix : process.env.PREFIX || '?';

        const commandFolders = fs.readdirSync('./Commands').filter(folder => !folder.startsWith('.'));
        const commandsByCategory = {};

        // Xử lý các lệnh trong thư mục Commands
        for (const folder of commandFolders) {
            const folderName = folder.toUpperCase();
            const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const fileNameWithoutExt = file.split('.').shift();
                const { default: commandFile } = await import(`./../${folder}/${file}`);
                if (commandFile && commandFile.data) {

                // mới thêm từ đây    // Kiểm tra nếu lệnh là Slash Command hoặc Context Menu 
                    const isSlashCommand = commandFile.data instanceof SlashCommandBuilder;
                    const isContextMenuCommand = commandFile.data instanceof ContextMenuCommandBuilder

                    let description = 'Không có mô tả';

                    if (isSlashCommand) {
                        description = commandFile.data.description || 'Không có mô tả';
                    } else if (isContextMenuCommand) {
                        description = commandFile.description || 'Không có mô tả';
                    }
                // đến đây
            
                    // Đặt mô tả từ file lệnh (thay vì dùng tên file)
                    commands.push({ 
                        name: commandFile.data.name,
                        description, // description: commandFile.data.description, 
                        emoji: fileEmojis[fileNameWithoutExt] || '•' 
                    });
                } else {
                    // console.error(`Không tìm thấy dữ liệu lệnh hoặc đã bị bôi đen trong tệp: ${file}`);
                }
            }

            commandsByCategory[folderName] = commands;
        }

        // Sắp xếp các khóa theo thứ tự số học
        const sortedSlashCategories = Object.keys(commandsByCategory).sort((a, b) => {
            const numA = parseInt(a.split('.')[0]);
            const numB = parseInt(b.split('.')[0]);
            return numA - numB;
        });

        // Tạo các tùy chọn cho menu thả xuống lệnh gạch chéo
        const slashCommandOptions = sortedSlashCategories.map(folder => ({
            label: `${SlashCommandEmojis[folder] || '⌛'} ${folder}`,
            value: `slash-${folder}` // Phân biệt lệnh Slash
        }));


        // // Tạo các tùy chọn cho menu thả xuống lệnh gạch chéo
        // const slashCommandOptions = Object.keys(commandsByCategory).map(folder => ({
        //     label: `${SlashCommandEmojis[folder] || '⌛'} ${folder}`,
        //     value: `slash-${folder}` // Phân biệt lệnh Slash
        // }));

        const sortedPrefixCategories = Object.keys(prefixCategories).sort((a, b) => {
            const numA = parseInt(a.split('.')[0]);
            const numB = parseInt(b.split('.')[0]);
            return numA - numB;
        });

        // Tạo các tùy chọn cho menu thả xuống lệnh tiền tố
        const prefixOptions = sortedPrefixCategories.map(category => ({
            label: `${PrefixCommandsEmojis[category] || '❓'} ${category}`,
            value: `prefix-${category}` // Phân biệt danh mục tiền tố
        }));

        // Tạo menu thả xuống lệnh gạch chéo
        const slashSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('slash-category-select')
            .setPlaceholder('🔹 Chi tiết về lệnh gạch chéo (/)')
            .addOptions(slashCommandOptions.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.label)
                .setValue(option.value)
            ));

        // Tạo menu thả xuống lệnh tiền tố
        const prefixSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('prefix-category-select')
            .setPlaceholder(`🔸 Chi tiết về lệnh tiền tố ${currentPrefix}`)
            .addOptions(prefixOptions.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.label)
                .setValue(option.value)));

        const embed = createEmbedEmbed(client)

        const row1 = new ActionRowBuilder()
            .addComponents(slashSelectMenu);

        const row2 = new ActionRowBuilder()
            .addComponents(prefixSelectMenu);

        const message = await interaction.reply({ embeds: [embed], components: [row1, row2, row3], ephemeral: false, fetchReply: true });

        // const filter = i => i.user.id === interaction.user.id;
        const filter = i => {
            if (i.user.id !== interaction.user.id) {
                i.reply({ content: `Chỉ ${interaction.user.tag} mới có thể tương tác với menu này!`, ephemeral: true });
                return false;
            }
            return true;
        };
        
        const collector = message.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if (i.isStringSelectMenu()) {
                await i.deferUpdate();

                const [type, value] = i.values[0].split('-');
                if (type === 'slash') {
                    const selectedCategory = value;
                    const categoryCommands = commandsByCategory[selectedCategory];

                    if (categoryCommands.length === 0) {
                        const emptyCategoryEmbed = createEmptyCategoryEmbed(client)
                        
                            await i.editReply({ embeds: [emptyCategoryEmbed], components: [row1, row2, row3] });
                        
                    }

                    const commandChunks = chunkArray(categoryCommands, 25);

                    for (const chunk of commandChunks) {

                        const categoryEmbed = new EmbedBuilder()
                            .setTitle(`${selectedCategory}`)
                            .setDescription(config.DescriptionSlash)
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields(chunk.map(command => {
                                const name = `${command.emoji || ''} ${command.name || `Tên không xác định`}`;
                                // const description = command.description || 'Không có mô tả';
                                // Tách phần mô tả thành các dòng
                                const description = command.description ? command.description.split('\n').map(line => `‎‎\u2003${line}`).join('\n') : 'Không có mô tả';
                                return { name, value: description };
                            }))
                            .setFooter({ 
                                text:
                                    `‎                                                                                                                                                     \n` + 
                                    `‎                                                                                                                                 © BẢN QUYỀN THUỘC VỀ\n` +
                                    `‎                                                                                                                                       ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`
                                });

                        try {
                            await i.editReply({ embeds: [categoryEmbed], components: [row1, row2, row3] });
                        } catch (error) {
                            console.error(`Lỗi cập nhật tương tác1: ${error.message}`);
                        }
                    }
                } else if (type === 'prefix') {
                    const selectedCategory = value;
                    const categoryCommands = prefixCategories[selectedCategory] || [];

                    if (categoryCommands.length === 0) {
                        const emptyCategoryEmbed = createEmptyCategoryEmbed(client)

                        try {
                            await i.editReply({ embeds: [emptyCategoryEmbed], components: [row1, row2, row3] });
                        } catch (error) {
                            console.error(`Lỗi cập nhật tương tác khi thư mục trống: ${error.message}`);
                        }
                        return;
                    }

                    const commandChunks = chunkArray(categoryCommands.map(cmd => ({
                        name: cmd,
                        description: prefixCommands[cmd]?.description || 'Không có mô tả', //client.prefixDescriptions[cmd] || 'Không có mô tả',
                        hd: prefixCommands[cmd]?.hd, // Đọc usage
                        q: prefixCommands[cmd]?.q,
                        emoji: prefixCommands[cmd].emoji
                    })), 25);

                    for (const chunk of commandChunks) {
                        const categoryEmbed = new EmbedBuilder()
                            .setTitle(`${selectedCategory}`)
                            .setDescription(config.DescriptionPrefix)
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields(chunk.map(command => {
                                const name = `${command.emoji || ''} ${command.name || `Tên không xác định`}`;
                                // const description = command.description || 'Không có mô tả';

                                // Tách phần mô tả thành các dòng
                                // const description = command.description ? command.description.split('\n').map(line => `‎‎\u2003${line}`).join('\n') : 'Không có mô tả';
                                const description = command.description 
                                    ? command.description.split('\n').map(line => `‎‎\u2003${line}`).join('\n') 
                                    : '🔸 Không có mô tả'.split('\n').map(line => `‎‎\u2003${line}`).join('\n');

                                // const usage = command.usage ? command.usage.split('\n').map(line => `‎‎\u2003${line}`).join('\n') : '**Cách dùng:** Không có thông tin';
                                const usage = command.hd 
                                    ? command.hd.split('\n').map(line => `‎‎\u2003${line}`).join('\n') 
                                    : '🔸 Cách dùng: Không có thông tin'.split('\n').map(line => `‎‎\u2003${line}`).join('\n');

                                // const accessableby = command.accessableby ? command.accessableby.split('\n').map(line => `‎‎\u2003${line}`).join('\n') : `🔸 Mọi người đều dùng được`;
                                const accessableby = command.q 
                                    ? command.q.split('\n').map(line => `‎‎\u2003${line}`).join('\n') 
                                    : '🔸 Dành cho: Mọi người'.split('\n').map(line => `‎‎\u2003${line}`).join('\n');

                                return { name, value: `${description}\n\n${usage}\n\n${accessableby}` };
                            }))
                            .setFooter({ 
                                text:
                                    `‎                                                                                                                                                     \n` + 
                                    `‎                                                                                                                                 © BẢN QUYỀN THUỘC VỀ\n` +
                                    `‎                                                                                                                                       ¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`
                                    // `‎                                                                                                                                                  BRB STUDIO`
                                });

                        try {
                            await i.editReply({ embeds: [categoryEmbed], components: [row1, row2, row3] });
                        } catch (error) {
                            console.error(`Lỗi cập nhật tương tác1: ${error.message}`);
                        }
                    }
                }
            }

            if (i.isButton()) {
                if (i.customId === 'deleteButton') {
                    try {
                        await i.update({ content: 'Đã xóa bỏ.', components: [], embeds: [] });
                        setTimeout(() => interaction.deleteReply().catch(() => {}), 0);
                    } catch (error) {
                        console.error(`Lỗi xóa phản hồi: ${error.message}`);
                    }
                }

                if (i.customId === 'inviteButton') {

                    const inviteEmbed = createInviteEmbed(client)
                    
                    try {
                        await i.update({ embeds: [inviteEmbed], components: [row3] }); // thay thế bằng components: [new ActionRowBuilder().addComponents(homeButton, reportButton, inviteButton, deleteButton)]
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác invite: ${error.message}`);
                    }
                }

                if (i.customId === 'reportButton') {
                    const reportEmbed = createReportEmbed(client)
                    
                    try {
                        await i.update({ embeds: [reportEmbed], components: [row3] }); // thay thế bằng components: [new ActionRowBuilder().addComponents(homeButton, reportButton, inviteButton, deleteButton)]
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác báo cáo: ${error.message}`);
                    }
                }

                if (i.customId === 'homeButton') {
                    try {
                        await i.update({ embeds: [embed], components: [row1, row2, row3] });
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác trang chủ: ${error.message}`);
                    }
                }
            }
        });
    },
};

// Hàm chia mảng thành các phần nhỏ hơn
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}