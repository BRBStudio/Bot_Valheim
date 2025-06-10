const { EmbedBuilder } = require(`discord.js`)
const config = require(`../../config`)
const EventStatus = require('../../schemas/Event_Status');
const Mkvalheim = require('../../schemas/Mk_Valheimschema');

module.exports = {
    name: 'messageCreate',

    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!mk' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;

        const guildID = msg.guild.id

        // valheimsurvival
        if(msg.content === '!mk') {
            const data = await Mkvalheim.findOne({ Guild: guildID });
            const password = data ? data.password : 'áhdhahsgd ( Bạn có thể dùng lệnh /mk để thay đổi ).';
            // const password = data?.password || 'áhdhahsgd ( Bạn có thể dùng lệnh /mk để thay đổi ).';

            embed = new EmbedBuilder()
                .setColor(config.embedCyan)
                .setDescription(`\`\`\`yml\n${password}\`\`\``)

            msg.channel.send({ embeds: [embed], ephemeral: true })
                
        }
    }
};

// const { EmbedBuilder } = require(`discord.js`)
// const config = require(`../../config`)
// const EventStatus = require('../../schemas/Event_Status');

// module.exports = {
//     name: 'messageCreate',

//     async execute(msg) {

//         // Kiểm tra trạng thái của sự kiện 'channelUpdate'
//         const eventStatus = await EventStatus.findOne({ event: '!mk' });

//         // Nếu sự kiện không được bật, thoát khỏi hàm
//         if (!eventStatus || eventStatus.status === 'off') {
//             return; // Không làm gì cả nếu sự kiện bị tắt
//         }

//         embed = new EmbedBuilder()
//                 .setColor(config.embedCyan)
//                 .setDescription(`\`\`\`yml\nvalheimsurvival\`\`\``)

//         if(msg.content === '!mk') {
//             msg.reply({content: `Xin chào! đây là mật khẩu vào game valheim của bạn:`, embeds: [embed], ephemeral: true})
//         }
//     }
// };
