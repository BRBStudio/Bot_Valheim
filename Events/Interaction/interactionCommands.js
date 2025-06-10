const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js'); // CommandInteraction
const { COOLDOWN } = require('../../config');
const config = require('../../config');
const fs = require('fs');
const path = require('path');
const interactionError = require('../WebhookError/interactionError'); // Import interactionError để xử lý lỗi
const Blacklist = require('../../schemas/blacklistSchema');
const Blacklist_dev = require('../../schemas/blacklist_devSchema');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial'); // người dùng đặc biệt
const UserAgreement = require('../../schemas/userAgreementSchema');

async function isGameCommand(commandName) {
    try {
        const gameCommandsDir = path.join('E:/16-10 BRB BOT DISCORD/7.Moi/Commands/8. GAMES');
        const gameCommands = fs.readdirSync(gameCommandsDir).map(file => path.parse(file).name);
        
        // console.log(`Danh sách lệnh game:`, gameCommands); // Debug xem có lệnh nào không
        return gameCommands.includes(commandName);
    } catch (error) {
        console.error('Lỗi khi kiểm tra thư mục command:', error);
        return false;
    }
}
/*
tương tác lệnh slash
*/

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) { // Thay đổi hàm thành bất đồng bộ
        // Kiểm tra xem tương tác có phải là một lệnh slash không
        if (!interaction.isChatInputCommand()) return;

        // Kiểm tra xem lệnh được gửi từ một máy chủ hoặc không
        if (!interaction.guild) {
            return interaction.reply(`${config.GuildOnlyCommand}`);
        }

        // Kiểm tra người dùng có trong danh sách blacklist Dev không
        const blacklist_of_dev = await Blacklist_dev.findOne({ userId: interaction.user.id });

        // Nếu người dùng bị blacklist và không phải là người dùng đặc biệt thì chặn lệnh
        if (blacklist_of_dev && !checkPermissions(interaction.member) && interaction.commandName !== 'mailbox' && interaction.commandName !== 'blacklist') {
            return interaction.reply({ content: "Bạn đã bị cấm sử dụng bot vì vi phạm điều luật của bot. Vui lòng liên hệ với Dev để được xóa khỏi danh sách đen", ephemeral: true });
        }

        // Kiểm tra người dùng có trong danh sách Blacklist của máy chủ không
        const blacklistedUser = await Blacklist.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

        // Nếu người dùng bị blacklist và không phải là người dùng đặc biệt thì chặn lệnh
        if (blacklistedUser && !checkPermissions(interaction.member) && interaction.commandName !== 'mailbox' && interaction.commandName !== 'blacklist') {
            return interaction.reply({ content: "Bạn đã bị cấm sử dụng bot vì vi phạm điều luật máy chủ. Vui lòng liên hệ với chủ sở hữu để được xóa khỏi danh sách đen", ephemeral: true });
        }
 
        // Kiểm tra xem người dùng đã đồng ý với điều khoản dịch vụ chưa
        const userAgreement = await UserAgreement.findOne({ userId: interaction.user.id });

        const e = new EmbedBuilder()
            .setColor(config.embedCyan)
            .setTitle(`Điều khoản Và Điều Kiện Dịch Vụ`)
            .setDescription(
                `Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh của bot\n` +
                `Nếu bạn bỏ lỡ thì có thể yêu cầu chủ sở hữu máy chủ gọi lại bằng lệnh bên dưới để khởi lại điều khoản dịch vụ \`\`\`yml\n/proviso_bot\`\`\`` +
                `Hoặc liên hệ trực tiếp với chúng tôi bằng lệnh \`\`\`/mailbox\`\`\``
            )
 
        // Nếu người dùng chưa đồng ý, không cho phép sử dụng lệnh
        if (!userAgreement && !checkPermissions(interaction.member) && interaction.commandName !== 'mailbox') {
            return interaction.reply({ embeds: [e] , ephemeral: true });
        }
 

        // // Lấy lệnh từ bộ sưu tập lệnh của client dựa trên tên lệnh
        const command = client.commands.get(interaction.commandName);
        // const subCommandName = interaction.options.getSubcommand();


        // Kiểm tra xem lệnh có tồn tại không
        if (!command) {
            return interaction.reply({ content: "Lệnh lỗi thời, bạn có thể phản hồi điều này về bot với Dev để họ sửa đổi" });
        }

        // Kiểm tra xem lệnh có đang trong thời gian hồi chiêu không
        const now = Date.now();
        const cooldownAmount = (command.cooldown || COOLDOWN) * 1000; // đây là 1 giây

        // Tạo một mảng để lưu thời gian người dùng đã sử dụng lệnh
        const cooldowns = client.cooldowns || (client.cooldowns = new Map());

        // Tạo key duy nhất cho mỗi người dùng và máy chủ
        const key = `${interaction.guild.id}-${interaction.user.id}-${interaction.commandName}`;

        if (!cooldowns.has(key)) {
            cooldowns.set(key, now);
        } else {
            const expirationTime = cooldowns.get(key) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Vui lòng chờ ${timeLeft.toFixed(1)} giây nữa để sử dụng lệnh này.`, ephemeral: true });
            }
        }

        // Cập nhật thời gian lệnh được sử dụng
        cooldowns.set(key, now);
        setTimeout(() => cooldowns.delete(key), cooldownAmount);


        // Bắt đầu đo thời gian thực thi
        const startTime = process.hrtime();


        try {
            // // Thực thi lệnh
            // await command.execute(interaction, client);

            // Kiểm tra xem có subcommand không
            const subCommandName = interaction.options.getSubcommand(false); // không throw lỗi nếu không có subcommand

            if (subCommandName && command.subcommands && command.subcommands.has(subCommandName)) {
                // Có subcommand, thì xử lý subcommand
                const subCommand = command.subcommands.get(subCommandName);
                if (!subCommand || typeof subCommand.execute !== 'function') {
                    return interaction.reply({ content: `Lệnh phụ \`${subCommandName}\` không tồn tại hoặc không hợp lệ.`, ephemeral: true });
                }
                await subCommand.execute(interaction, client);
            } else {
                // Không có subcommand, xử lý lệnh chính
                if (typeof command.execute !== 'function') {
                    return interaction.reply({ content: `Lệnh \`${interaction.commandName}\` không có hàm execute!`, ephemeral: true });
                }
                await command.execute(interaction, client);
            }
            

        } catch (error) {
            // console.error("Đã xảy ra lỗi khi thực thi lệnh:", error); // Ghi lỗi ra console
            // await interaction.reply({ content: "Đã xảy ra lỗi khi thực thi lệnh." });
            
            // Gọi hàm xử lý lỗi từ interactionError.js
            interactionError.execute(interaction, error, client);
        }

        if (await isGameCommand(interaction.commandName)) {
            // console.log(`Lệnh ${interaction.commandName} là game, bắt đầu ghi log.`);

        // Tính thời gian thực thi
        const executionTime = process.hrtime(startTime);
        const executionTimeMs = (executionTime[0] * 1000 + executionTime[1] / 1e6).toFixed(2);


        //  Chức năng lấy link mời server
        const getServerInviteLink = async (guild) => {
            try {
                if (guild.vanityURLCode) {
                    return `https://discord.gg/${guild.vanityURLCode}`;
                }
                const channel = guild.channels.cache.find(ch =>
                    ch.type === ChannelType.GuildText && ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
                );
                if (channel) {
                    const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                    return invite.url;
                }
                return 'Không có liên kết mời có sẵn';
            } catch (error) {
                console.error('Lỗi khi lấy liên kết mời server:', error);
                return 'Không có liên kết mời có sẵn';
            }
        };

        // Nhận liên kết mời máy chủ 
        const serverInviteLink = await getServerInviteLink(interaction.guild);

        const emoji = ':question:';

        // Tạo embed cho nhật ký lệnh
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`${emoji} Nhật ký lệnh /`)
            .setDescription(`Tên lệnh: **/${interaction.commandName}**\nMáy chủ: **${interaction.guild.name}** (${interaction.guild.id})`)
            .addFields(
                { name: '👤 Người dùng', value: `${interaction.member.displayName}`, inline: true },
                { name: '📢 Kênh', value: `<#${interaction.channel.id}>`, inline: true },
                { name: '🆔 ID Lệnh', value: interaction.commandId, inline: true },
                { name: '📌 Arguments', value: interaction.options.data.length ? interaction.options.data.map(option => `${option.name}: ${option.user ? option.user.displayName : option.value}`).join('\n') : 'Không có', inline: false },
                { name: '⏱ Thời gian thực hiện', value: `${executionTimeMs} ms`, inline: false },
                { name: '🔗 Liên kết mời máy chủ', value: serverInviteLink, inline: false }
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `ID người dùng: ${interaction.user.id}` })
            .setTimestamp();

            // Gửi embed vào kênh nhật ký lệnh 1263108374208446617 kênh user-commands trong máy chủ BRB STUDIO
        const logChannel = client.channels.cache.get('1263108374208446617'); //  1339221059831988265 kênh log_commands trong máy chủ Emoji Command Bot  
        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        } else {
            console.error("Không tìm thấy kênh nhật ký lệnh.");
        }
        }
        
    },
};









// const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js'); // CommandInteraction
// const { COOLDOWN } = require('../../config');
// const config = require('../../config');
// const fs = require('fs');
// const path = require('path');
// const interactionError = require('../WebhookError/interactionError'); // Import interactionError để xử lý lỗi
// const Blacklist = require('../../schemas/blacklistSchema');
// const Blacklist_dev = require('../../schemas/blacklist_devSchema');
// const checkPermissions = require('../../Handlers/CheckPermissionSpecial'); // người dùng đặc biệt
// const UserAgreement = require('../../schemas/userAgreementSchema');

// async function isGameCommand(commandName) {
//     try {
//         const gameCommandsDir = path.join('E:/16-10 BRB BOT DISCORD/7.Moi/Commands/8. GAMES');
//         const gameCommands = fs.readdirSync(gameCommandsDir).map(file => path.parse(file).name);
        
//         // console.log(`Danh sách lệnh game:`, gameCommands); // Debug xem có lệnh nào không
//         return gameCommands.includes(commandName);
//     } catch (error) {
//         console.error('Lỗi khi kiểm tra thư mục command:', error);
//         return false;
//     }
// }



// /*
// tương tác lệnh slash
// */

// module.exports = {
//     name: "interactionCreate",

//     async execute(interaction, client) { // Thay đổi hàm thành bất đồng bộ
//         // Kiểm tra xem tương tác có phải là một lệnh slash không
//         if (!interaction.isChatInputCommand()) return;

//         // Kiểm tra xem lệnh được gửi từ một máy chủ hoặc không
//         if (!interaction.guild) {
//             return interaction.reply(`${config.GuildOnlyCommand}`);
//         }

//         // Kiểm tra người dùng có trong danh sách blacklist Dev không
//         const blacklist_of_dev = await Blacklist_dev.findOne({ userId: interaction.user.id });

//         // Nếu người dùng bị blacklist và không phải là người dùng đặc biệt thì chặn lệnh
//         if (blacklist_of_dev && !checkPermissions(interaction.member) && interaction.commandName !== 'mailbox') {
//             return interaction.reply({ content: "Bạn đã bị cấm sử dụng bot vì vi phạm điều luật của bot. Vui lòng liên hệ với Dev để được xóa khỏi danh sách đen", ephemeral: true });
//         }

//         // Kiểm tra người dùng có trong danh sách Blacklist của máy chủ không
//         const blacklistedUser = await Blacklist.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

//         // Nếu người dùng bị blacklist và không phải là người dùng đặc biệt thì chặn lệnh
//         if (blacklistedUser && !checkPermissions(interaction.member) && interaction.commandName !== 'mailbox') {
//             return interaction.reply({ content: "Bạn đã bị cấm sử dụng bot vì vi phạm điều luật máy chủ. Vui lòng liên hệ với chủ sở hữu để được xóa khỏi danh sách đen", ephemeral: true });
//         }
 
//         // Kiểm tra xem người dùng đã đồng ý với điều khoản dịch vụ chưa
//         const userAgreement = await UserAgreement.findOne({ userId: interaction.user.id });

//         const e = new EmbedBuilder()
//             .setColor(config.embedCyan)
//             .setTitle(`Điều khoản Và Điều Kiện Dịch Vụ`)
//             .setDescription(
//                 `Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh của bot\n` +
//                 `Nếu bạn bỏ lỡ thì có thể yêu cầu chủ sở hữu máy chủ gọi lại bằng lệnh bên dưới để khởi lại điều khoản dịch vụ \`\`\`yml\n/proviso_bot\`\`\`` +
//                 `Hoặc liên hệ trực tiếp với chúng tôi bằng lệnh \`\`\`/mailbox\`\`\``
//             )
 
//         // Nếu người dùng chưa đồng ý, không cho phép sử dụng lệnh
//         if (!userAgreement && !checkPermissions(interaction.member) && interaction.commandName !== 'mailbox') {
//             return interaction.reply({ embeds: [e] , ephemeral: true });
//         }
 

//         // Lấy lệnh từ bộ sưu tập lệnh của client dựa trên tên lệnh
//         const command = client.commands.get(interaction.commandName);

//         // Kiểm tra xem lệnh có tồn tại không
//         if (!command) {
//             return interaction.reply({ content: "Lệnh lỗi thời, bạn có thể phản hồi điều này về bot với Dev để họ sửa đổi" });
//         }

//         // Kiểm tra xem lệnh có đang trong thời gian hồi chiêu không
//         const now = Date.now();
//         const cooldownAmount = (command.cooldown || COOLDOWN) * 1000; // đây là 1 giây

//         // Tạo một mảng để lưu thời gian người dùng đã sử dụng lệnh
//         const cooldowns = client.cooldowns || (client.cooldowns = new Map());

//         // Tạo key duy nhất cho mỗi người dùng và máy chủ
//         const key = `${interaction.guild.id}-${interaction.user.id}-${interaction.commandName}`;

//         if (!cooldowns.has(key)) {
//             cooldowns.set(key, now);
//         } else {
//             const expirationTime = cooldowns.get(key) + cooldownAmount;
//             if (now < expirationTime) {
//                 const timeLeft = (expirationTime - now) / 1000;
//                 return interaction.reply({ content: `Vui lòng chờ ${timeLeft.toFixed(1)} giây nữa để sử dụng lệnh này.`, ephemeral: true });
//             }
//         }

//         // Cập nhật thời gian lệnh được sử dụng
//         cooldowns.set(key, now);
//         setTimeout(() => cooldowns.delete(key), cooldownAmount);


//         // Bắt đầu đo thời gian thực thi
//         const startTime = process.hrtime();


//         try {
//             // Thực thi lệnh
//             await command.execute(interaction, client);
//         } catch (error) {
//             // console.error("Đã xảy ra lỗi khi thực thi lệnh:", error); // Ghi lỗi ra console
//             // await interaction.reply({ content: "Đã xảy ra lỗi khi thực thi lệnh." });
            
//             // Gọi hàm xử lý lỗi từ interactionError.js
//             interactionError.execute(interaction, error, client);
//         }

//         if (await isGameCommand(interaction.commandName)) {
//             // console.log(`Lệnh ${interaction.commandName} là game, bắt đầu ghi log.`);

//         // Tính thời gian thực thi
//         const executionTime = process.hrtime(startTime);
//         const executionTimeMs = (executionTime[0] * 1000 + executionTime[1] / 1e6).toFixed(2);


//         //  Chức năng lấy link mời server
//         const getServerInviteLink = async (guild) => {
//             try {
//                 if (guild.vanityURLCode) {
//                     return `https://discord.gg/${guild.vanityURLCode}`;
//                 }
//                 const channel = guild.channels.cache.find(ch =>
//                     ch.type === ChannelType.GuildText && ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
//                 );
//                 if (channel) {
//                     const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
//                     return invite.url;
//                 }
//                 return 'Không có liên kết mời có sẵn';
//             } catch (error) {
//                 console.error('Lỗi khi lấy liên kết mời server:', error);
//                 return 'Không có liên kết mời có sẵn';
//             }
//         };

//         // Nhận liên kết mời máy chủ 
//         const serverInviteLink = await getServerInviteLink(interaction.guild);

//         const emoji = ':question:';

//         // Tạo embed cho nhật ký lệnh
//         const embed = new EmbedBuilder()
//             .setColor('#5865F2')
//             .setTitle(`${emoji} Nhật ký lệnh /`)
//             .setDescription(`Tên lệnh: **/${interaction.commandName}**\nMáy chủ: **${interaction.guild.name}** (${interaction.guild.id})`)
//             .addFields(
//                 { name: '👤 Người dùng', value: `${interaction.member.displayName}`, inline: true },
//                 { name: '📢 Kênh', value: `<#${interaction.channel.id}>`, inline: true },
//                 { name: '🆔 ID Lệnh', value: interaction.commandId, inline: true },
//                 { name: '📌 Arguments', value: interaction.options.data.length ? interaction.options.data.map(option => `${option.name}: ${option.user ? option.user.displayName : option.value}`).join('\n') : 'Không có', inline: false },
//                 { name: '⏱ Thời gian thực hiện', value: `${executionTimeMs} ms`, inline: false },
//                 { name: '🔗 Liên kết mời máy chủ', value: serverInviteLink, inline: false }
//             )
//             .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
//             .setFooter({ text: `ID người dùng: ${interaction.user.id}` })
//             .setTimestamp();

//             // Gửi embed vào kênh nhật ký lệnh 1263108374208446617 kênh user-commands trong máy chủ BRB STUDIO
//         const logChannel = client.channels.cache.get('1263108374208446617'); //  1339221059831988265 kênh log_commands trong máy chủ Emoji Command Bot  
//         if (logChannel) {
//             logChannel.send({ embeds: [embed] });
//         } else {
//             console.error("Không tìm thấy kênh nhật ký lệnh.");
//         }
//         }
        
//     },
// };