// ButtonPlace/StringSelectMenuBuilder.js

const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder(`Vui lòng bấm vào để chọn tùy chọn.`)
            .setDisabled(false) // bật(true) tắt(false) menu
            .addOptions( // tùy chọn tối đa cho chuỗi chọn menu 25 tùy chọn
                {
                    label: 'Thành viên',
                    description: `Cách trở thành thành viên BRB STUDIO`,
                    value: 'thành viên',
                    emoji: "<a:so1:1321471027280216126>"
                },
                {
                    label: 'Link mod',
                    description: `Hướng dẫn lấy link mod`,
                    value: 'link mod',
                    emoji: "<a:so2:1321471601295753318>"
                },
                {
                    label: 'Cài đặt mod',
                    description: `Hướng dẫn cài mod`,
                    value: 'cài mod',
                    emoji: "<a:so3:1321471621579669534>"
                },
            ),
    );

const menu = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('invite-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder('Chọn một nền tảng bạn muốn hỗ trợ...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Hỗ trợ qua FB')
                    .setValue('fb')
                    .setDescription('Nhận hỗ trợ qua Facebook'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Hỗ trợ qua Discord')
                    .setValue('dc')
                    .setDescription('Nhận hỗ trợ qua Discord')
            )
    );

module.exports = {
    row,                                         // lệnh help_valheim.js
    menu,                                        // lệnh sup.js
}

