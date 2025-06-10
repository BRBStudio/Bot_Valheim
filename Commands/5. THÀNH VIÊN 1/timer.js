// const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`)

// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName(`timer`)
//     .setDescription(`Hệ thống nhắc nhở/hẹn giờ để nhắc bạn thực hiện một nhiệm vụ nhất định.`)
//     .addStringOption(opt => opt.setName(`description`).setDescription(`Nhiệm vụ bạn muốn được nhắc tới.`).setRequired(true))
//     .addStringOption(opt => opt.setName(`time`).setDescription(`Thời gian tính bằng phút`)
//     .addChoices(
//         { name: '1 phút', value: '60'},
//         { name: '2 phút', value: '120'},
//         { name: '5 phút', value: '300'},
//         { name: '10 phút', value: '600'},
//         { name: '15 phút', value: '900'},
//         { name: '20 phút', value: '1200'},
//         { name: '30 phút', value: '1800'},
//         { name: '45 phút', value: '2700'},
//         { name: '1 giờ', value: '3600'},
//         { name: '2 giờ', value: '7200'},
//         { name: '3 giờ', value: '10800'},
//         { name: '4 giờ', value: '14400'},
//         { name: '5 giờ', value: '18000'},
//         { name: '6 giờ', value: '21600'},
//         { name: '7 giờ', value: '25200'},
//         { name: '8 giờ', value: '28800'},
//         { name: '9 giờ', value: '32400'},
//         { name: '10 giờ', value: '36000'},
//         { name: '15 giờ', value: '54000'},
//         { name: '20 giờ', value: '72000'},
//         { name: '22 giờ', value: '79200'},
//         { name: '24 giờ', value: '86400'}
//     ).setRequired(true)),

// async execute (interaction) {

//     try {
        
//         const desc = interaction.options.getString(`description`)
//         const time = interaction.options.getString(`time`)
//         // const channel = interaction.channel
//         const user = interaction.user;

//         const embed = new EmbedBuilder()
//         .setColor(`Red`)
//         .setTitle(`Lời nhắc nhở thân thiện`)
//         .setDescription(`Tôi đã thiết lập lời nhắc cho những điều sau:\n\`\`\`Thời gian: ${time} (Giây) | Công Việc: ${desc}\`\`\``)
//         .setFooter({ text: 'Hệ thống nhắc nhở Bot Valheim được tạo bởi Valheim Survival' })
//         .setTimestamp()

//         const remindEmbed = new EmbedBuilder()
//         .setColor(`Blue`)
//         .setTitle(`Lời nhắc nhở thân thiện+`)
//         .setDescription(`Thời gian: ${time} (Giây) của bạn đã hết.Công việc bạn đã đặt ra trước đó là: **${desc}**`)
//         .setFooter({ text: 'Hệ thống nhắc nhở Bot Valheim được tạo bởi Valheim Survival' })
//         .setTimestamp()

//         await interaction.deferReply();
//         await interaction.deleteReply();
//         await interaction.channel.send({ embeds: [embed]})

//         setTimeout(async () => {
//             // await channel.send({ content: `<@${interaction.user.id}>`, embeds: [remindEmbed]})
//             try {
//                 await user.send({ embeds: [remindEmbed] });
//             } catch (error) {
//                 console.error(`Không thể gửi tin nhắn: ${error}`);
//             }
//         }, time*1000) 

//         } catch (error) {
//             console.error(`Đã xảy ra lỗi: ${error}`);
//             await interaction.reply({ content: 'Đã xảy ra lỗi khi thiết lập nhắc nhở.', ephemeral: true });
//         }

//     }
// }



const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`timer`)
    .setDescription(
        `🔹 Hệ thống nhắc nhở/hẹn giờ để nhắc bạn thực hiện\n` +
        `       một nhiệm vụ nhất định.`
    )
    .addStringOption(opt => opt.setName(`description`).setDescription(`Nhiệm vụ bạn muốn được nhắc tới.`).setRequired(true))
    .addStringOption(opt => opt.setName(`time`).setDescription(`Thời gian tính bằng phút`)
    .addChoices(
        { name: '1 phút', value: '1' },
        { name: '2 phút', value: '2' },
        { name: '5 phút', value: '5' },
        { name: '10 phút', value: '10' },
        { name: '15 phút', value: '15' },
        { name: '20 phút', value: '20' },
        { name: '30 phút', value: '30' },
        { name: '45 phút', value: '45' },
        { name: '1 giờ', value: '60' },
        { name: '2 giờ', value: '120' },
        { name: '3 giờ', value: '180' },
        { name: '4 giờ', value: '240' },
        { name: '5 giờ', value: '300' },
        { name: '6 giờ', value: '360' },
        { name: '7 giờ', value: '420' },
        { name: '8 giờ', value: '480' },
        { name: '9 giờ', value: '540' },
        { name: '10 giờ', value: '600' },
        { name: '15 giờ', value: '900' },
        { name: '20 giờ', value: '1200' },
        { name: '22 giờ', value: '1320' },
        { name: '24 giờ', value: '1440' }
    ).setRequired(true)),

async execute (interaction, client) {

    try {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/timer' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }
        
        const desc = interaction.options.getString(`description`)
        const timeInMinutes = parseInt(interaction.options.getString('time')); // Lấy thời gian tính bằng phút
        const timeInSeconds = timeInMinutes * 60; // Chuyển đổi phút thành giây
        // const channel = interaction.channel
        const user = interaction.user;

        // Kiểm tra giá trị của client.user.username
        const botUsername = client.user ? client.user.username : 'Bot';

        const embed = new EmbedBuilder()
            .setColor(`Red`)
            .setTitle(`KÍCH HOẠT HỆ THỐNG NHẮC NHỞ`)
            .setDescription(`Hệ thống nhắc nhở của **${client.user.username}** được kích hoạt bởi **${interaction.user.displayName}**:\n\`\`\`\n📝 Công Việc: ${desc} \n\n⏳ Thời gian nhắc nhở: ${timeInMinutes} phút\`\`\``)
            .setFooter({ text: `Đã kích hoạt hệ thống nhắc nhở của **${botUsername}**` })
            .setTimestamp()

        const remindEmbed = new EmbedBuilder()
            .setColor(`Blue`)
            .setTitle(`LỜI NHẮC DÀNH CHO BẠN`)
            .setDescription(`⏳ Thời gian nhắc nhở **${timeInMinutes} phút** của bạn đã hết.\n\n📝 Công việc bạn đã đặt ra trước đó là: **${desc}**`)
            .setFooter({ text: `Hệ thống nhắc nhở của **${botUsername}**` })
            .setTimestamp()

        await interaction.deferReply();
        await interaction.deleteReply();
        await interaction.channel.send({ embeds: [embed]})

        setTimeout(async () => {
            try {
                await user.send({ embeds: [remindEmbed] });
            } catch (error) {
                console.error(`Không thể gửi tin nhắn: ${error}`);
            }
        }, timeInSeconds*1000) 

        } catch (error) {
            console.error(`Đã xảy ra lỗi: ${error}`);
            await interaction.reply({ content: 'Đã xảy ra lỗi khi thiết lập nhắc nhở.', ephemeral: true });
        }

    }
}