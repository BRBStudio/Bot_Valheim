const colors = require(`../../lib/colorConverter`)
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',

    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!luật_server' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;

        if(msg.content === '!luật server') {    
            msg.channel.send({
              embeds: [
                  {
                      title: "<:biencuahangcopycopy:1085826584373628968>👻 QUY ĐỊNH TRONG SERVER👻<:biencuahangcopycopy:1085826584373628968>",
                      "description": "Trước khi vào server bạn nên đọc qua luật discord cũng như server nhé, tránh tình trạng bị **kick** mà không biết lý do.\n \nQuy định chung tại BRB STUDIO sẽ có hiệu lực từ lúc luật ban hành cho đến khi có luật mới thay thế hoặc bổ sung\n\nMục đích chính : mang đến chất lượng phục vụ tốt nhất và xây dựng một cộng đồng đúng với tiêu chí CHẤT LƯỢNG hơn SỐ LƯỢNG\n\nHost tạo sân chơi giải trí lành mạnh từ cấu hình tối thiểu cũng có thể chơi được\n\n**☞  Mọi thông tin thay đổi cập nhật xem tại:\n\n「📌」┇   [Thay Đổi Cập Nhật](https://discord.com/channels/1028540923249958912/1194354502480957532).\n\n☞ Bạn cũng có thể đóng góp ý kiến tại:\n\n「✍🏻」┇   [Ý Kiến Phản Hồi](https://discord.com/channels/1028540923249958912/1190293533136003122).\n\n☞ Sau khi đồng ý với luật server bạn có thể đến:\n\n「📂」┇   [Link Mod](https://discord.com/channels/1028540923249958912/1111674941557985400) .**\n\n```1️⃣Không toxic, lạm quyền, sân si..```\n```2️⃣Không gian lận, không cheat... nếu phát hiện ban thẳng tay```\n```3️⃣Không gây hấn trong game cũng như ngoài game... nhắc nhở lần 1, lần 2 ban thẳng```\n```4️⃣ADMIN sẽ không can dự tất cả những tranh chấp, hay hỗ trợ 1 cá nhân nào trong game, sẽ chỉ tham gia khi có lỗi, nếu ADMIN lạm quyền làm mất đi dự công bằng của người chơi cũng sẽ xử phạt như người chơi.```\n\n\n✓ chấp hành và tuân thủ đúng nội quy mà Host \" BRB STUDIO \" đề ra\n\nTạm thời Host \" BRB STUDIO \" chỉ có vài quy định nhỏ, sau sẽ bổ sung thêm ( hiện tại vẫn đang nghĩ ^^ )\n\nHãy đăng ký thành viên để có được trải nghiệm tốt nhất tại **[BRB STUDIO](https://discord.com/channels/1028540923249958912/1173537274542174218)**",
                      url: "https://discord.com/channels/1028540923249958912/1173537274542174218",
                      color: parseInt(colors.embedGreen.replace(/^#/, ''), 16),
                      fields: [
                          {
                              name: "Người Đăng:",
                              value: "♛ Valheim Survival ♛"
                          }
                      ],
                      author: {
                          name: "Luật Server",
                          icon_url: "https://cdn3.emoji.gg/emojis/3653-animegirl-dance.gif"
                      },
                      footer: {
                          text: `Chúc bạn có những trải nghiệm tuyệt vời tại 🏆 ${msg.guild.name} 🏆`,
                          icon_url: "https://s.wsj.net/public/resources/images/OG-DW646_202003_M_20200302171613.gif"
                      },
                      timestamp: "2024-02-21T02:23:30.000Z",
                      image: {
                          url: "https://i.ibb.co/Wf34yd3/standard.gif"
                      },
                      thumbnail: {
                          url: "https://i.ibb.co/S54HQLJ/standard-2.gif"
                      }
                  }
              ],
          });
        }
    }
};
