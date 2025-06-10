/*
dùng để lưu cập nhât phiên bản bot mới
!version v1.0.0
*/
const Version = require(`../../schemas/versionSchema`);
const EventStatus = require('../../schemas/Event_Status');

module.exports = {
    name: 'messageCreate',
    
    async execute(msg) {

        // // Kiểm tra trạng thái của sự kiện 'channelUpdate'
        // const eventStatus = await EventStatus.findOne({ event: '!version' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu tin nhắn đến từ DM thì bỏ qua
        if (!msg.guild) return;

        // Kiểm tra xem tin nhắn có bắt đầu với '!version-update' hay không
        if (msg.content.startsWith('!version')) {

            // Kiểm tra ID của người dùng có được phép sử dụng lệnh hay không
            const allowedUsers = ['1215380543815024700', '940104526285910046'];
            if (!allowedUsers.includes(msg.author.id)) {
                return msg.reply('Bạn không có quyền sử dụng lệnh này.');
            }

            // Lấy phiên bản từ tin nhắn (bỏ qua tiền tố '!version-update')
            const newVersion = msg.content.split(' ')[1];

            // Kiểm tra xem người dùng có nhập phiên bản không
            if (!newVersion) {
                return msg.reply('Vui lòng cung cấp phiên bản mới sau lệnh !version.');
            }

            try {
                // Cập nhật phiên bản trong MongoDB
                const updatedVersion = await Version.findOneAndUpdate(
                    {}, // Không có điều kiện tìm kiếm, lấy đối tượng đầu tiên
                    { botVersion: newVersion }, // Dữ liệu cập nhật
                    { upsert: true, new: true } // Tạo mới nếu không tồn tại
                );

                // Xác nhận phiên bản đã được lưu thành công
                msg.author.send(`Phiên bản mới ${newVersion} đã được lưu thành công!`);
            } catch (error) {
                console.error('Lỗi khi cập nhật phiên bản:', error);
                msg.reply('Có lỗi xảy ra khi lưu phiên bản mới.');
            }
        }
    }
};
