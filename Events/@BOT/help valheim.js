const interactionError = require('../../Events/WebhookError/interactionError');
const { row } = require('../../ButtonPlace/StringSelectMenuBuilder');
const { ThanhVien, LinkMod, SetupMod } = require('../../Embeds/embedsDEV');
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: 'help_valheim' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Bỏ qua nếu tin nhắn là từ bot hoặc không thuộc kênh máy chủ
        if (msg.author.bot || !msg.guild) return;

        try {
            // Kiểm tra xem tin nhắn có tag bot và có chứa từ khóa "Mới" không
            if (msg.mentions.has(msg.client.user) && msg.content.toLowerCase().includes('help valheim')) {
                
                // Bot trả lời khi bị tag với từ khóa @Mới
                const message = await msg.reply({
                    content: 'Tôi ở đây để hỗ trợ bạn ❤!',
                    components: [row],
                    ephemeral: true
                });
                
                // Tạo collector để theo dõi các tương tác với menu chọn
                const collector = message.createMessageComponentCollector();
                
                collector.on('collect', async (i) => {
                    
                    // Kiểm tra customId của interaction
                    if (i.customId === 'select') {
                        const value = i.values[0];

                        // Đảm bảo chỉ người dùng ban đầu có thể tương tác với menu
                        if (i.user.id !== msg.author.id) {
                            
                            return await i.reply({
                                content: `Chỉ ${msg.author.tag} mới có thể tương tác với menu này! Nếu bạn muốn dùng hãy ấn */help*`,
                                ephemeral: true
                            });
                        }

                        // Xử lý các giá trị khác nhau của menu
                        if (value === 'thành viên') {
                            
                            await i.update({
                                content: 'Cách Để Trở Thành ***Thành Viên***',
                                embeds: [ThanhVien]
                            });
                        }

                        if (value === 'link mod') {
                            
                            await i.update({
                                content: 'Cách Lấy Link Mod',
                                embeds: [LinkMod]
                            });
                        }

                        if (value === 'cài mod') {
                            
                            await i.update({
                                content: 'Hướng Dẫn Cài Mod',
                                embeds: [SetupMod]
                            });
                        }
                    }
                });
            }
        } catch (error) {
            
            interactionError.execute(msg, error, msg.client);
        }
    }
};
