const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const config = require('../../config');
const UserAgreement = require('../../schemas/userAgreementSchema')

module.exports = {
    name: 'filter_members',
    description: '🔸 Thanh lọc thành viên. Lệnh dành cho \`chủ sở hữu\`', // LỆNH lọc thành viên không hoạt động hoặc không có avatar
    q: `🔸 Dành cho Chủ sở hữu`,
    aliases: ['fm', 'o2'],
    
    async execute(msg, args) {

        if (msg.author.id !== msg.guild.ownerId && !config.specialUsers.includes(msg.author.id)) { 
            return msg.channel.send("Bạn không có quyền sử dụng lệnh này! Chỉ chủ sở hữu máy chủ mới có quyền."); 
        }

        if (!msg.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return msg.channel.send("Bot không có quyền kick thành viên. Vui lòng cấp quyền 'Kick Members' cho bot.");
        }

        // Lấy danh sách các thành viên
        const members = await msg.guild.members.fetch();

        const noAvatarMembers = members.filter(member => !member.user.avatar); // Thành viên không có avatar

        const noRoleMembers = members.filter(member => member.roles.cache.size <= 1); // Thành viên không có vai trò

        const inactiveMembers = members.filter(member => {
            const lastMessageTime = member.lastMessage?.createdAt;
            return lastMessageTime ? (Date.now() - lastMessageTime.getTime() > 30 * 24 * 60 * 60 * 1000) : true;
        }); // Thành viên không hoạt động trong 30 ngày

        // ** Lọc thành viên không có trong MongoDB **
        const membersNotInDB = [];
        for (const member of members.values()) {
            const userExists = await UserAgreement.findOne({ userId: member.user.id, guildId: msg.guild.id });
            if (!userExists) {
                membersNotInDB.push(member); // Thêm thành viên không tồn tại trong DB vào danh sách xóa
            }
        }

        // Tạo Embed hiển thị kết quả
        const embed = new EmbedBuilder()
            .setTitle("Kết quả thanh lọc thành viên")
            .setColor("#e60ad4")
            .addFields(
                { name: "Thành viên không có avatar", value: noAvatarMembers.size.toString(), inline: true },
                { name: "Thành viên không có vai trò", value: noRoleMembers.size.toString(), inline: true },
                { name: "Thành viên không hoạt động (30 ngày)", value: inactiveMembers.size.toString(), inline: true },
                { name: "Thành viên không chấp nhận điều khoản bot", value: membersNotInDB.length.toString(), inline: true }
            )
            .setTimestamp();

        // Tạo các nút xóa cho từng loại thành viên
        const deleteNoAvatarButton = new ButtonBuilder()
            .setCustomId("delete_no_avatar")
            .setLabel("Xóa thành viên không có avatar")
            .setStyle(ButtonStyle.Danger);

        const deleteNoRoleButton = new ButtonBuilder()
            .setCustomId("delete_no_role")
            .setLabel("Xóa thành viên không có vai trò")
            .setStyle(ButtonStyle.Danger);

        const deleteInactiveButton = new ButtonBuilder()
            .setCustomId("delete_inactive")
            .setLabel("Xóa thành viên không hoạt động")
            .setStyle(ButtonStyle.Danger);

         const deleteNotInDbButton = new ButtonBuilder()
            .setCustomId("delete_not_in_db")
            .setLabel("Xóa thành viên không chấp nhận điều khoản bot")
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder()
            .addComponents(deleteNoAvatarButton, deleteNoRoleButton, deleteInactiveButton, deleteNotInDbButton);

        const message = await msg.channel.send({
            embeds: [embed],
            components: [actionRow]
        });

        // Xử lý khi bấm nút xóa
        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async interaction => {
            await interaction.deferReply();
            const deletedMembers = [];

            switch (interaction.customId) {

                case 'delete_no_avatar':
                    for (const member of noAvatarMembers.values()) {

                        if (member.id === msg.guild.ownerId) {
                            continue;
                        }

                        if (member.roles.highest.position >= msg.guild.members.me.roles.highest.position) {
                            console.error(`Không thể xóa ${member.displayName} vì có quyền cao hơn hoặc ngang với bot.`);
                            continue; // Bỏ qua nếu thành viên có quyền cao hơn
                        }

                        try {
                            await member.kick("Đã xóa thành viên không có avatar.");
                            deletedMembers.push(member.displayName);
                        } catch (error) {
                            console.error(`Không thể xóa 1 ${member.displayName}:`, error);
                        }
                    }
                    break;

                case 'delete_no_role':
                    for (const member of noRoleMembers.values()) {

                        if (member.id === msg.guild.ownerId) {
                            continue;
                        }

                        if (member.roles.highest.position >= msg.guild.members.me.roles.highest.position) {
                            console.error(`Không thể xóa ${member.displayName} vì có quyền cao hơn hoặc ngang với bot.`);
                            continue; // Bỏ qua nếu thành viên có quyền cao hơn
                        }

                        try {
                            await member.kick("Đã xóa thành viên không có vai trò.");
                            deletedMembers.push(member.displayName);
                        } catch (error) {
                            console.error(`Không thể xóa 2 ${member.displayName}:`, error);
                        }
                    }
                    break;

                case 'delete_inactive':
                    for (const member of inactiveMembers.values()) {

                        if (member.id === msg.guild.ownerId) {
                            continue;
                        }

                        if (member.roles.highest.position >= msg.guild.members.me.roles.highest.position) {
                            console.error(`Không thể xóa ${member.displayName} vì có quyền cao hơn hoặc ngang với bot.`);
                            continue;
                        }

                        try {
                            await member.kick("Đã xóa thành viên không hoạt động trong 30 ngày.");
                            deletedMembers.push(member.displayName);
                        } catch (error) {
                            console.error(`Không thể xóa 3 ${member.displayName}:`, error);
                        }
                    }
                    break;

                case 'delete_not_in_db':
                    for (const member of membersNotInDB) {

                        if (member.id === msg.guild.ownerId) {
                            continue; // Bỏ qua nếu thành viên là chủ sở hữu máy chủ
                        }

                        try {
                            await member.kick("Đã xóa thành viên không chấp nhận điều khoản bot.");
                            deletedMembers.push(member.displayName);
                        } catch (error) {
                            console.error(`Không thể xóa 4 ${member.displayName}:`, error);
                        }
                    }
                    break;
            }

            // Kiểm tra xem có thành viên nào đã bị xóa hay không
            const resultEmbed = new EmbedBuilder()
                .setTitle("Kết quả xóa thành viên")
                .setDescription(deletedMembers.length > 0 
                    ? `Đã xóa ${deletedMembers.length} thành viên: ${deletedMembers.join(', ')}.`
                    : "Không có thành viên nào bị xóa.")
                .setColor("#e60ad4")
                .setTimestamp();

            // Chỉ chỉnh sửa tin nhắn nếu tin nhắn vẫn tồn tại
            if (message) {
                await interaction.editReply({ embeds: [resultEmbed] });
            } else {
                await interaction.followUp({ content: "Không thể chỉnh sửa phản hồi vì tin nhắn đã bị xóa.", ephemeral: true });
            }
        });

        collector.on('end', () => {
            // Hết thời gian thì xóa các nút
            // if (message) {
            //     message.edit({ components: [] });
            // }
            message.delete()
            return;
        });
    },
};
