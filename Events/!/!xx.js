const {EmbedBuilder} = require(`discord.js`)
const config = require(`../../config`)
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',

    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!xx' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;

        if(msg.content === '!xx') {

            const allowedGuildIds = [`1297600290278608936`]; // máy chủ chính và máy chủ `thích chơi game` '1028540923249958912', '1033693770346147902',

            // Kiểm tra xem lệnh có được sử dụng trong máy chủ cụ thể không
            if (!allowedGuildIds.includes(msg.guild.id)) {
                return msg.channel.send({ content: 'Lệnh này chỉ có thể sử dụng trong máy chủ cụ thể. Hãy liên hệ DEV để được hỗ trợ!', ephemeral: true });
            }

            // const allowedGuildId = process.env.GUILD_ID; // Lấy GUILD_ID từ biến môi trường

            // // Kiểm tra xem lệnh có được sử dụng trong máy chủ cụ thể không
            // if (msg.guild.id !== allowedGuildId) {
            //     return msg.channel.send({ content: 'Lệnh này chỉ có thể sử dụng trong máy chủ cụ thể. Hãy liên hệ DEV để được hỗ trợ!', ephemeral: true });
            // }

            // Kiểm tra xem lệnh có được sử dụng trong kênh NSFW hay không
            if (!msg.channel.nsfw) {
                return msg.channel.send({ content: 'Lệnh này chỉ có thể sử dụng trong kênh NSFW!', ephemeral: true });
            }

            

            // Import động node-fetch
            import('node-fetch').then(({ default: fetch }) => {
                // Danh sách các endpoints API
                const apiEndpoints = [
                    'https://api.waifu.pics/nsfw/waifu',
                    'https://api.waifu.pics/nsfw/neko',
                    'https://api.waifu.pics/nsfw/blowjob',
                    'https://api.waifu.pics/nsfw/waifu',
                    'https://api.waifu.pics/nsfw/neko',
                    'https://api.waifu.pics/nsfw/blowjob'
                ];

                // Chọn ngẫu nhiên một endpoint
                const apiUrl = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];

                fetch(apiUrl)
                    .then(res => res.json())
                    .then(json => {
                        if (!json.url) {
                            return msg.channel.send('***Không thể lấy ảnh hentai, điều này có thể do đường truyền mạng. Hãy thử lại sau.***');
                        }

                        const Embed = new EmbedBuilder()
                            .setColor(config.embedBlue)
                            .setTitle('ẢNH ANIME')
                            .setImage(json.url)
                            .setFooter({ text: 'Ảnh từ Bot Valheim' })
                            .setTimestamp();

                        return msg.channel.send({ embeds: [Embed] });
                    })
                    .catch(error => {
                        console.error(error);
                        return msg.channel.send('Đã xảy ra lỗi khi lấy ảnh hentai, hãy thử lại sau.');
                    });
            }).catch(error => {
                console.error(error);
                return msg.channel.send('Đã xảy ra lỗi khi import node-fetch, hãy thử lại sau.');
            });
        }
    }
};
