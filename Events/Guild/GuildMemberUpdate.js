const EventStatus = require('../../schemas/Event_Status');
/*
Sự kiện GuildMemberUpdate thông báo vai trò nào đã được thêm/xóa bởi ai
*/
module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember) {

        // // Kiểm tra trạng thái của sự kiện này
        // const eventStatus = await EventStatus.findOne({ event: 'GuildMemberUpdate' });

        // // Nếu sự kiện không được bật, thoát khỏi hàm
        // if (!eventStatus || eventStatus.status === 'off') {
        //     return; // Không làm gì cả nếu sự kiện bị tắt
        // }

        // Kiểm tra nếu người dùng là bot thì thoát ra
        if (newMember.user.bot) return;

        // Nếu (các) vai trò hiện diện trên đối tượng thành viên cũ nhưng không còn trên đối tượng mới (tức là (các) vai trò đã bị xóa)
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size > 0) {
            const guildName = oldMember.guild.name; // Tên của máy chủ

            // thêm hàm join(', ') để nối các tên vai trò thành chuỗi, ngăn lỗi tiềm tàng khi gửi mảng.
            newMember.send(`Bạn đã bị xóa khỏi vai trò ***${removedRoles.map(r => r.name).join(', ')}*** trong máy chủ ***${guildName}***.`);
        }

        // Nếu (các) vai trò hiện diện trên đối tượng thành viên mới nhưng không có trên đối tượng cũ (tức là (các) vai trò đã được thêm vào)
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (addedRoles.size > 0) {
            const guildName = newMember.guild.name; // Tên của máy chủ

            // thêm hàm join(', ') để nối các tên vai trò thành chuỗi, ngăn lỗi tiềm tàng khi gửi mảng.
            newMember.send(`Vai trò ***${addedRoles.map(r => r.name).join(', ')}*** đã được thêm cho bạn trong máy chủ ***${guildName}***.`);
        }
    }
}
