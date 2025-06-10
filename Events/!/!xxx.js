const {EmbedBuilder} = require(`discord.js`)
const config = require(`../../config`)
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!xxx' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;

        if(msg.content === '!xxx') {

            const allowedGuildIds = [`1028540923249958912`]; // máy chủ chính và máy chủ `thích chơi game` '1028540923249958912' '1033693770346147902',

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
            // Danh sách các endpoints API NSFW
            const apiEndpoints = [
            'https://nekobot.xyz/api/image?type=pgif',
            'https://nekobot.xyz/api/image?type=hentai',
            'https://nekobot.xyz/api/image?type=lewd'
        ];

            // Chọn ngẫu nhiên một endpoint
            const apiUrl = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];

        fetch(apiUrl)
            .then(res => res.json())
            .then(json => {
                // Kiểm tra các điều kiện trả về từ API `Unknown Image Type`
                if (!json.message || json.message === 'Loại hình ảnh không xác định' || !isValidUrl(json.message)) {
                    return msg.channel.send({ content: '**Không thể lấy ảnh này, điều này có thể do đường truyền mạng hoặc loại ảnh không xác định. Hãy thử lại sau.**', ephemeral: true });
                }

                const Embed = new EmbedBuilder()
                    .setColor(config.embedGreen)
                    .setTitle('NỘI DUNG <a:18:1264563792365224049>')
                    .setImage(json.message)
                    .setFooter({ text: 'Ảnh từ Bot Valheim' })
                    .setTimestamp();

                return msg.channel.send({ embeds: [Embed] });
            })
            .catch(error => {
                console.error('Lỗi khi lấy ảnh xxx:', error);
                return msg.channel.send('**Đã xảy ra lỗi khi lấy ảnh xxx, hãy thử lại sau**.');
            });
        }).catch(error => {
            console.error('Lỗi khi import node-fetch:', error);
            return msg.channel.send('**Đã xảy ra lỗi khi import node-fetch, hãy thử lại sau**.');
        });
    }

            // Hàm kiểm tra URL hợp lệ
                function isValidUrl(string) {
            try {
                new URL(string);
                    return true;
                } catch (_) {
                    return false;
                }
                    
        }
    }
};
