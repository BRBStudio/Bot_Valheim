// anti-swear.js
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const AntiwordConfig = require('../../schemas/antiwordSchema');
const colors = require('../../lib/colorConverter');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti_swear')
        .setDescription('🔹 Cấu hình hệ thống chống chửi thề')
        .addSubcommand(command => command.setName("addword").setDescription('🔹 Thêm một từ vào danh sách từ xấu').addStringOption(option => option.setName('badword').setDescription('Từ bạn muốn thêm').setRequired(true)))
        .addSubcommand(command => command.setName('channel').setDescription('🔹 Thiết lập Kênh kiểm duyệt người dùng đã dùng từ xấu').addChannelOption(option => option.setName('channels').setDescription('kênh mà bạn muốn kiểm duyệt người dùng đã dùng từ xấu').setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('🔹 Xóa một từ khỏi danh sách từ xấu').addStringOption(option => option.setName('word').setDescription('Từ cần xóa').setRequired(true)))
        .addSubcommand(command => command.setName('list').setDescription('🔹 Xem danh sách từ xấu'))
        .addSubcommand(command => command.setName('removeall').setDescription('🔹 Xóa tất cả từ xấu'))
        .addSubcommand(command => command.setName('removechannel').setDescription('🔹 Xóa thiết lập Kênh kiểm duyệt người dùng đã dùng từ xấu'))
        .addSubcommand(command => command.setName('on').setDescription('🔹 Bật hệ thống kiểm duyệt từ xấu')) // Thêm lệnh phụ on
        .addSubcommand(command => command.setName('off').setDescription('🔹 Tắt hệ thống kiểm duyệt từ xấu')), // Thêm lệnh phụ off,

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/anti_swear' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const sub = interaction.options.getSubcommand();

        // Kiểm tra quyền quản trị viên
        const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

        // Các lệnh chỉ dành cho admin
        const adminCommands = ['addword', 'channel', 'remove', 'removeall', 'removechannel', 'on', 'off'];

        if (adminCommands.includes(sub) && !isAdmin) {
            return interaction.reply(`\`\`\`diff\n+ Bạn cần có quyền ADM để sử dụng lệnh này.\`\`\``);
        }

        switch (sub) {
            
            case "addword":
                const guildId = interaction.guild.id;
                const badword = interaction.options.getString('badword').toLowerCase();
                let guildConfig = await AntiwordConfig.findOne({ guildId });

                if (!guildConfig) {
                    guildConfig = new AntiwordConfig({
                    guildId: guildId,
                    badWords: [badword]
                    });
                } else {
                        if (!guildConfig.badWords) {
                        guildConfig.badWords = [badword];
                    } else {
                            // Kiểm tra xem từ đó đã tồn tại trong mảng badWords chưa
                            if (!guildConfig.badWords.includes(badword)) {
                            guildConfig.badWords.push(badword);
                        } else {
                            // Nếu từ đã tồn tại, hãy gửi tin nhắn cho biết rằng
                            interaction.reply(`Từ **${badword}** đã tồn tại trong danh sách từ xấu.`);
                            return;
                        }
                    }
                }

                await guildConfig.save();

                const embedAdd = new EmbedBuilder()
                    .setColor(colors.embedBlack) 
                    .setDescription(` Thành công!\n Đã thêm **${badword}** vào danh sách từ xấu`)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`);

                interaction.reply({ embeds: [embedAdd] });
            break;

            case "remove":
                const word = interaction.options.getString('word').toLowerCase();
                const guildIdToRemove = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdToRemove },
                    { $pull: { badWords: word } }
                );

                const embedRemove = new EmbedBuilder()
                    .setColor(colors.embedGreen) 
                    .setDescription(`⛔ Thành công!\n🛑 Đã xóa **${word}** khỏi danh sách từ xấu`)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
                    .setTimestamp();

                await interaction.reply({ embeds: [embedRemove] });
            break;

            case "list":
                const guildIdToList = interaction.guild.id;
                const guildConfigToList = await AntiwordConfig.findOne({ guildId: guildIdToList });

                if (!guildConfigToList || !guildConfigToList.badWords || guildConfigToList.badWords.length === 0) {
                const nowords = new EmbedBuilder()
                    .setColor(colors.embedCyan) 
                    .setDescription(`\`❗ Không có từ nào trong danh sách từ xấu!\``)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
                    .setTimestamp();

                    return interaction.reply({ embeds: [nowords] });
                } else {
                const listembed = new EmbedBuilder()
                    .setAuthor({ name: `Đây là danh sách những từ xấu`, iconURL: interaction.guild.iconURL() })
                    .setDescription(`*${guildConfigToList.badWords.join('\n')}*`)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
                    .setColor(colors.embedBlack); 
                    await interaction.reply({ embeds: [listembed] });
                }
            break;

            case "channel":
                const selectedChannel = interaction.options.getChannel('channels');
                const guildIdForChannel = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdForChannel },
                    { selectedChannelId: selectedChannel.id }
                );

                interaction.reply(`Tin nhắn đã được gửi vào kênh ${selectedChannel} để bạn kiểm duyệt.`);
            break;

            case "removeall":
                const guildIdToRemoveAll = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdToRemoveAll },
                    { badWords: [] } // Xóa tất cả các từ xấu
                );

                interaction.reply(`Đã xóa tất cả từ xấu khỏi danh sách.`);
            break;

            case "removechannel":
                const guildIdToRemoveChannel = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdToRemoveChannel },
                    { $unset: { selectedChannelId: "" } } // Xóa thuộc tính selectedChannelId
                );

                interaction.reply(`Đã xóa thiết lập kênh kiểm duyệt người dùng đã dùng từ xấu.`);
            break;

            case "on":
                const guildIdOn = interaction.guild.id;
                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdOn },
                    { isActive: true } // Bật hệ thống kiểm duyệt
                );

                interaction.reply("Hệ thống kiểm duyệt từ xấu đã được bật.");
                break;

            case "off":
                const guildIdOff = interaction.guild.id;
                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdOff },
                    { isActive: false } // Tắt hệ thống kiểm duyệt
                );

                interaction.reply("Hệ thống kiểm duyệt từ xấu đã được tắt.");
                break;

            default:
                throw new Error('Lệnh không được hỗ trợ.');
            }
    }
};