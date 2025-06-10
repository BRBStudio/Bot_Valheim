const { SlashCommandBuilder, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { menu } = require(`../../ButtonPlace/StringSelectMenuBuilder`);
const CommandStatus = require('../../schemas/Command_Status');
const a = `¹⁹⁸⁸Valheim Survival¹⁹⁸⁸`

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sup')
        .setDescription('🔹 FB và máy chủ hỗ trợ từ NPT.'),
    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/sup' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        await interaction.deferReply();
        await interaction.deleteReply();

        // Gửi menu lên
        const initialMessage = await interaction.channel.send({ components: [menu] });

        const filter = (i) => {
            if (i.user.id !== interaction.user.id) {
                i.reply({ content: `Chỉ ${interaction.user.displayName} mới có thể tương tác với menu này! Nếu bạn muốn dùng hãy dùng lệnh **/sup**`, ephemeral: true });
                return false;
            }
            return true;
        };

        const collector = await initialMessage.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
            time: 30_000,
            dispose: true,
        });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === `invite-menu`) {
                const value = interaction.values[0];

                await interaction.deferUpdate(); // Dùng deferUpdate trước khi cập nhật thông tin

                let embed;
                switch (value) {
                    case 'fb':
                        embed = new EmbedBuilder()
                            .setColor('#00FFFF')
                            .setTitle('FB CÁ NHÂN')
                            .setDescription(`### \🔗 **Nhấp vào link bên dưới**\n↪ [Đến FB để được hỗ trợ!](https://www.facebook.com/profile.php?id=100092393403399)`)
                            .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
                            .setFooter({text: `Thông tin này được cung cấp bởi ${a}`})
                            .setTimestamp();
                        break;
                    case 'dc':
                        embed = new EmbedBuilder()
                            .setColor('#00FFFF')
                            .setTitle('MÁY CHỦ DISCORD HỖ TRỢ')
                            .setDescription('### \🔗 **Nhấp vào link bên dưới**\n↪ [Tham Gia Máy Chủ Discord](https://discord.gg/s2ec8Y2uPa)')
                            .setFooter({text: `Thông tin này được cung cấp bởi ${a}`})
                            .setImage(`https://i.imgur.com/3Ls2l6I.gif`)
                            .setTimestamp();
                        break;
                }
                // Cập nhật tin nhắn với embed mới
                await interaction.editReply({ embeds: [embed] });
            }
        });

    },
};



// const { SlashCommandBuilder, ComponentType } = require('discord.js');
// const { menu } = require(`../../ButtonPlace/StringSelectMenuBuilder`)
// const CommandStatus = require('../../schemas/Command_Status');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('sup')
//         .setDescription('🔹 FB và máy chủ hỗ trợ từ NPT.'),
//     async execute(interaction, client) {

//         // Kiểm tra trạng thái của lệnh
//         const commandStatus = await CommandStatus.findOne({ command: '/sup' });

//         // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
//         if (commandStatus && commandStatus.status === 'off') {
//             return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
//         }

//         // await interaction.reply({ content: 'Chọn một tùy chọn từ menu bên dưới!', ephemeral: true });
//         await interaction.deferReply(); // Xác nhận sự tương tác và gửi tin nhắn kết hợp với 
//         await interaction.deleteReply();

//         const initialMessage = await interaction.channel.send({ components: [menu] });

//         // const filter = (i) => i.user.id === interaction.user.id;

//         const filter = (i) => {
//             if (i.user.id !== interaction.user.id) {
//                 i.reply({ content: `Chỉ ${interaction.user.tag} mới có thể tương tác với menu này!`, ephemeral: true });
//                 return false;
//             }
//             return true;
//         };

//         const collector = await initialMessage.createMessageComponentCollector(

//             {
//                 filter,
//                 componentType: ComponentType.StringSelect,
//                 time: 30_000,
//                 dispose: true,
//             }
//         );

//         collector.on('collect', (interaction) => {

//             if (interaction.values[0] === "yt") {
//                 interaction.update({ content: `### \🔗 **Facebook**\n↪ [Đến FB để được hỗ trợ!](https://www.facebook.com/profile.php?id=100092393403399)`, components: [] }).catch((e) => { });
//             } else if (interaction.values[0] === "dc") {
//                 interaction.update({ content: `### \🔗 **Discord**\n↪ [Tham Gia Máy Chủ Discord](https://discord.gg/s2ec8Y2uPa)`, components: [] }).catch((e) => { });
//             };
//             // [Mời ngay!](https://discord.com/oauth2/authorize?client_id=1159874172290334730&permissions=8&scope=bot) mời bot
//         });

//         collector.on('end', (collected, reason) => {
//             if (reason == "time") {
//                 initialMessage.edit({ content: `### ⏰ **| Đã hết giờ lựa chọn!**`, components: [] }).then((msg) => {

//                     setTimeout(() => {
//                         msg.delete();
//                     }, 120_000);

//                 });
//             };
//         });
//     },
// };