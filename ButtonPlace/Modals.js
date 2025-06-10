const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const sayModal = (channelId) => {
    return new ModalBuilder()
        .setCustomId(`say:${channelId}`) // Truyền ID kênh qua customId
        .setTitle('Nói điều gì đó thông qua bot')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('say')
                    .setLabel('Nói gì đó đi')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('Nhập một cái gì đó ...')
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('embed')
                    .setLabel('Ok/no để bật tắt chế độ nhúng?')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('ok/no')
                    .setRequired(false)
            )
        );
};

module.exports = {
    sayModal,
};









// const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

// const sayModal = (channel) => {
//     return new ModalBuilder()
//         .setCustomId('say')
//         .setTitle('Nói điều gì đó thông qua bot')
//         .addComponents(
//             new ActionRowBuilder().addComponents(
//                 new TextInputBuilder()
//                     .setCustomId('say')
//                     .setLabel('Nói gì đó đi')
//                     .setStyle(TextInputStyle.Paragraph)
//                     .setPlaceholder('Nhập một cái gì đó ...')
//                     .setRequired(true)
//             ),

//             new ActionRowBuilder().addComponents(
//                 new TextInputBuilder()
//                     .setCustomId('embed')
//                     .setLabel('Ok/no để bật tắt chế độ nhúng?')
//                     .setStyle(TextInputStyle.Short)
//                     .setPlaceholder('ok/no')
//                     .setRequired(false)
//             ),

//             new ActionRowBuilder().addComponents(
//                 new TextInputBuilder()
//                     .setCustomId('channel')
//                     .setLabel('Kênh bạn muốn gửi tin nhắn đến')
//                     .setStyle(TextInputStyle.Short)
//                     .setValue(channel.id)
//                     .setRequired(true)
//             )
//         );
// };

// module.exports = {
//     sayModal,
// };