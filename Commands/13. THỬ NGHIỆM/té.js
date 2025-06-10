const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { VietQR } = require('vietqr');
const axios = require('axios');
const config = require('../../config')

const bankChoices = [
    { name: 'BIDV', value: '970418' },
    { name: 'Maritime Bank', value: '970426' },
    { name: 'Timo by BVBank', value: '970454' },
    { name: 'MBBank', value: '970422' },
    { name: 'Vietcombank', value: '970436' },
    { name: 'Techcombank', value: '970407' },
    { name: 'VietinBank', value: '970415' },
    { name: 'Agribank', value: '970405' },
    { name: 'Sacombank', value: '970403' },
    { name: 'ACB', value: '970416' },
    { name: 'VPBank', value: '970432' },
    { name: 'TPBank', value: '970423' },
    { name: 'SHB', value: '970443' },
    { name: 'VIB', value: '970441' },
    { name: 'HDBank', value: '970437' },
    { name: 'LienVietPostBank', value: '970449' },
    { name: 'SeABank', value: '970440' },
    { name: 'OCB', value: '970448' },
    { name: 'SCB', value: '970429' }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pr')
        .setDescription('Tạo mã QR cho ngân hàng sử dụng VietQR')
        .addStringOption(option =>
            option.setName('bank')
                .setDescription('Chọn ngân hàng')
                .setRequired(true)
                .addChoices(...bankChoices)
        )
        .addStringOption(option =>
            option.setName('bank_account')
                .setDescription('Số tài khoản ngân hàng của bạn')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Số tiền (VND)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('memo')
                .setDescription('Ghi chú cho giao dịch')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('template')
                .setDescription('Mã QR mẫu')
                .setRequired(false)
                .addChoices(
                    { name: 'Compact', value: 'compact' },
                    { name: 'QR Only', value: 'qr_only' },
                    { name: 'Print', value: 'print' }
                )
        )
        .addStringOption(option =>
            option.setName('media')
                .setDescription('Loại media (.jpg, .png)')
                .setRequired(false)
                .addChoices(
                    { name: 'JPG', value: '.jpg' },
                    { name: 'PNG', value: '.png' }
                )
        ),

    guildSpecific: true,
    guildId: ['1319809040032989275'],

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const amount = interaction.options.getInteger('amount');
        const memo = interaction.options.getString('memo');
        const bank = interaction.options.getString('bank');
        const accountNumber = interaction.options.getString('bank_account');
        const template = interaction.options.getString('template') || 'p11adQ5';
        const media = interaction.options.getString('media') || '.jpg';

        try {
            const vietQR = new VietQR({
                clientID: 'eb3b729f-7291-4a46-933f-e57bc29c206b',
                apiKey: '64a00172-5921-4545-b0b3-902bdc57b9c3',
            });

            const qrUrl = vietQR.genQuickLink({
                bank,
                accountName: 'Người dùng',
                accountNumber,
                amount,
                memo,
                template,
                media,
            });

            const response = await axios.get(qrUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const attachment = new AttachmentBuilder(buffer, { name: `qr${media}` });

            const embed = new EmbedBuilder()
                .setColor(config.embedCyan)
                .setTitle('📌 Mã QR Code cho Giao Dịch')
                .setDescription('Quét mã QR bên dưới để thực hiện giao dịch.')
                .addFields(
                    { name: '<a:brb:1319969574845677568> Ngân hàng', value: `\`\`\`yaml\n${bankChoices.find(b => b.value === bank).name}\`\`\``, inline: true },
                    { name: '<a:09_numbers:1352418802637340742> Số tài khoản', value: `\`\`\`css\n[${accountNumber}]\`\`\``, inline: true },
                    { name: '<a:tui:1320577075123589130> Số tiền', value: `\`\`\`diff\n+ ${amount.toLocaleString()} VND\`\`\``, inline: false },
                    { name: '<a:noted:1352419384651419732> Ghi chú', value: `\`\`\`fix\n${memo}\`\`\``, inline: false }
                )
                .setImage(`attachment://qr${media}`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed], files: [attachment] });

        } catch (err) {
            console.error(err);
            await interaction.editReply({ content: '⚠️ Đã xảy ra lỗi khi tạo mã QR.' });
        }
    }
};
































// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const { VietQR } = require('vietqr');
// // const logger = require('silly-logger'); // log lỗi

// module.exports = {
//     name: 'pr',
//     description: 'Tạo mã QR cho ngân hàng sử dụng VietQR',
//     options: [
//         {
//             name: 'amount',
//             description: 'Số tiền (VND)',
//             type: 'Integer',
//             required: true
//         },
//         {
//             name: 'memo',
//             description: 'Ghi chú cho giao dịch',
//             type: 'String',
//             required: true
//         },
//         {
//             name: 'template',
//             description: 'Template QR code (e.g., compact, standard)',
//             type: 'String',
//             required: false,
//             choices: [
//                 { name: 'Compact', value: 'compact' },
//                 { name: 'Qr Only', value: 'qr_only' },
//                 { name: 'Print', value: 'print' }
//             ]
//         },
//         {
//             name: 'media',
//             description: 'Loại media (e.g., .jpg, .png)',
//             type: 'String',
//             required: false,
//             choices: [
//                 { name: 'JPG', value: '.jpg' },
//                 { name: 'PNG', value: '.png' }
//             ]
//         }
//     ],

//     async execute(interaction, client) {
//         if (interaction.deferred || interaction.replied) return;

//         await interaction.deferReply({ ephemeral: true });

//         const amount = interaction.options.getInteger('amount');
//         const memo = interaction.options.getString('memo');
//         const template = interaction.options.getString('template') || 'compact';
//         const media = interaction.options.getString('media') || 'jpg';

//         const fixedBank = '970422';
//         const fixedAccountNumber = '0377214945';
//         const accountName = 'RS Store';

//         try {
//             const vietQR = new VietQR({
//                 clientID: '1b0d2d70-c111-406e-9dec-94477f83e333',
//                 apiKey: 'db1c6efe-ce89-456b-9f7e-935fb5403918',
//             });

//             const link = vietQR.genQuickLink({
//                 bank: fixedBank,
//                 accountName,
//                 accountNumber: fixedAccountNumber,
//                 amount,
//                 memo,
//                 template,
//                 media,
//             });

//             const embed = new EmbedBuilder()
//                 .setColor('#ffffff')
//                 .setTitle('Mã QR Code cho Giao Dịch')
//                 .addFields(
//                     { name: 'Ngân hàng', value: '```md\n> MBBank```', inline: true },
//                     // { name: 'Số tài khoản', value: fixedAccountNumber, inline: true },
//                     { name: 'Số tiền', value: `\`\`\`md\n> ${amount.toLocaleString()} VND\`\`\``, inline: true },
//                     { name: 'Ghi chú', value: `\`\`\`md\n# ${memo}\`\`\``, inline: false }
//                 )
//                 .setImage(link)
//                 .setTimestamp();

//             await interaction.channel.send({ embeds: [embed] });

//             await interaction.editReply({ content: 'Đã tạo QR thành công', ephemeral: true });

//         } catch (err) {
//             console.error(err);
//             await interaction.editReply('Có lỗi xảy ra khi tạo mã QR.');
//         }
//     }
// };