const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_command')
        .setDescription('🔹 Xóa một lệnh trong máy chủ')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Tên lệnh cần xóa')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID máy chủ cần xóa lệnh')
                .setRequired(true)
        ),

    guildSpecific: true,
    guildId: ['1319809040032989275'], // máy chủ Emoji Command Bot

    async execute(interaction) {
        const commandName = interaction.options.getString('name');
        const guildId = interaction.options.getString('id');

        try {
            const guild = interaction.client.guilds.cache.get(guildId);
            if (!guild) {
                return interaction.reply({
                    content: `🚫 Bot không có trong máy chủ **${guildId}** hoặc không tìm thấy máy chủ đó.`,
                    ephemeral: true
                });
            }

            const guildCommands = await guild.commands.fetch();
            const commandToDelete = guildCommands.find(cmd => cmd.name === commandName);

            if (!commandToDelete) {
                return interaction.reply({
                    content: `⚠ Không tìm thấy lệnh **/${commandName}** trong máy chủ **${guild.name}**.`,
                    ephemeral: true
                });
            }

            await guild.commands.delete(commandToDelete.id);
            console.log(`✅ Đã xóa lệnh /${commandName} trong máy chủ ${guild.name} (${guildId})`);

            await interaction.reply({
                content: `✅ Đã xóa lệnh **/${commandName}** trong máy chủ **${guild.name}**!`,
                ephemeral: true
            });
        } catch (error) {
            console.error(`❌ Lỗi khi xóa lệnh trong máy chủ ${guildId}:`, error);
            await interaction.reply({
                content: `❌ Đã xảy ra lỗi khi xóa lệnh **/${commandName}** trong máy chủ **${guildId}**.`,
                ephemeral: true
            });
        }
    }
};




// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('delete_command')
//         .setDescription('Xóa một lệnh trong các guild được chỉ định')
//         .addStringOption(option =>
//             option.setName('command_name')
//                 .setDescription('Tên lệnh cần xóa')
//                 .setRequired(true)
//                 .addChoices(
//                     { name: 'rank_m', value: 'rank_m' },
//                     { name: 'mmpo', value: 'mmpo' },
//                     { name: 'test', value: 'test' }
//                 )
//         ),

//     guildSpecific: true,
//     guildId: ['1319809040032989275'], // máy chủ Emoji Command Bot

//     async execute(interaction) {
//         const commandName = interaction.options.getString('command_name');
        
//         const guildIds = [
//             '1319809040032989275',
//             '1312185401347407902',
//             '1319947820991774753',
//             '1262054487040720927',
//             '1028540923249958912'
//         ];

//         let deletedCount = 0;
//         let deletedGuilds = [];

//         for (const guildId of guildIds) {
//             try {
//                 const guild = interaction.client.guilds.cache.get(guildId);
//                 if (guild) {
//                     const guildCommands = await guild.commands.fetch();
//                     const commandToDelete = guildCommands.find(cmd => cmd.name === commandName);
//                     if (commandToDelete) {
//                         await guild.commands.delete(commandToDelete.id);
//                         console.log(`✅ Đã xóa lệnh /${commandName} trong máy chủ ${guild.name} (${guildId})`);
//                         deletedCount++;
//                         deletedGuilds.push(guild.name);
//                     } else {
//                         console.log(`⚠ Không tìm thấy lệnh /${commandName} trong máy chủ ${guild.name} (${guildId})`);
//                     }
//                 } else {
//                     console.log(`🚫 Bot không có trong máy chủ ${guildId}`);
//                 }
//             } catch (error) {
//                 console.error(`❌ Lỗi khi xóa lệnh trong máy chủ ${guildId}:`, error);
//             }
//         }

//         await interaction.reply({
//             content: deletedCount > 0 
//                 ? `✅ Đã xóa lệnh **/${commandName}** trong **${deletedCount}** máy chủ:\n${deletedGuilds.join(', ')}!` 
//                 : `⚠ Không tìm thấy lệnh **/${commandName}** trong bất kỳ máy chủ nào.`,
//             ephemeral: true
//         });
//     }
// };
