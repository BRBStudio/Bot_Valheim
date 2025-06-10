const { Ship } = require("canvafy"); // canvafy

module.exports = {
    name: 'pairing',
    description: '🔸 Tình cảm của 2 người',
    hd: '🔸 ?pairing <tag người dùng 1> <tag người dùng 2>',
    aliases: ['pair', 'ship', 'tv7'],
    async execute(msg) {

        // Tách lấy các đối tượng user từ tin nhắn sau tiền tố
        const args = msg.mentions.users;
        
        // Kiểm tra xem có nhắc đến đủ 2 người dùng hay không
        if (args.size < 2) {
            return msg.channel.send('Vui lòng tag 2 người dùng để ghép đôi.');
        }

        // Lấy user và member từ các mentions
        const [user, member] = args.values();

        // Lấy avatar của từng người dùng
        const userAvatar = user.displayAvatarURL({
            forceStatic: true,
            size: 1024,
            extension: "png",
        });
        
        const memberAvatar = member.displayAvatarURL({
            forceStatic: true,
            size: 1024,
            extension: "png",
        });

        // Tạo ảnh ghép đôi
        const ship = await new Ship()
            .setAvatars(userAvatar, memberAvatar)
            .setBorder("#33FFFF")
            .setBackground(
                "image",
                "https://cdn.pixabay.com/photo/2024/04/29/16/08/dreamy-love-8728321_640.png"
            )
            .setOverlayOpacity(0.5)
            .build();

        // Gửi ảnh kết quả ghép đôi
        await msg.channel.send({
            content: `**Xác suất tình cảm của ${user.username} & ${member.username}!**`,
            files: [
                {
                    attachment: ship,
                    name: `ship.png`,
                },
            ],
        });
    },
};
