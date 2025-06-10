const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { checkAdministrator } = require(`../../permissionCheck`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("promote_role")
        .setDescription("Thăng chức người dùng!")
        .addUserOption((o) => o
            .setName("user")
            .setDescription("Người dùng cần thăng chức")
            .setRequired(true)
        )
        .addRoleOption((o) => o
            .setName("previousrole")
            .setDescription("Vai trò trước đây của người dùng")
            .setRequired(true)
        )
        .addRoleOption((o) => o
            .setName("newrole")
            .setDescription("Vai trò mới của người dùng")
            .setRequired(true)
        )
        .addStringOption((o) => o
            .setName("reason")
            .setDescription("Lý do thăng chức")
            .setRequired(true)
        )
        .addStringOption((o) => o
            .setName("notes")
            .setDescription("Lưu ý khi thăng chức")
            .setRequired(true)
        )
        .addChannelOption((o) => o
            .setName("channel")
            .setDescription("Kênh tin nhắn sẽ gửi đến")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),

    async execute(interaction) {

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const guild = interaction.guild;
        const staff = interaction.user;
        const user = interaction.options.getMember("user");
        const previousrole = interaction.options.getRole("previousrole");
        const newrole = interaction.options.getRole("newrole");
        const reason = interaction.options.getString("reason");
        const notes = interaction.options.getString("notes");
        const channel = interaction.options.getChannel(`channel`);

        // Kiểm tra quyền
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({
                content: "❌ Bạn không có quyền quảng lý vai trò.",
                ephemeral: true,
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({
                content: "❌ Tôi không có quyền quản lý vai trò.",
                ephemeral: true,
            });
        }

        // Kiểm tra xem vai trò có nằm dưới vai trò cao nhất của bot không
        const botMember = await interaction.guild.members.fetchMe();
        const botHighestRole = botMember.roles.highest;
        if (
            previousrole.position >= botMember.roles.highest.position ||
            newrole.position >= botMember.roles.highest.position
        ) {
            return interaction.reply({
                content: `❌ Tôi không thể thăng chức vai trò cho ${user} vì vai trò ${newrole} bạn yêu cầu cao hơn hoặc ngang bằng với vai trò của bot (${botHighestRole}).`,
                ephemeral: true,
            });
        }

        // Đảm bảo người dùng chưa có vai trò mới
        if (user.roles.cache.has(newrole.id)) {
            return interaction.reply({
                content: `⚠️ ${user} đã có vai trò ${newrole}.`,
                ephemeral: true,
            });
        }

        // Kiểm tra người dùng có vai trò cũ hay không
        if (!user.roles.cache.has(previousrole.id)) {
            return interaction.reply({
                content: `⚠️ Vai trò cũ của ${user} không có vai trò nào là ${previousrole}, không thể thăng chức. Hãy kiểm tra lại vai trò của người dùng này`,
                ephemeral: true,
            });
        }

        // Cập nhật vai trò (Xóa vai trò cũ, Thêm vai trò mới)
        try {
            await user.roles.remove(previousrole);
            await user.roles.add(newrole);
        } catch (error) {
            console.error("Lỗi cập nhật vai trò:", error);
            return interaction.reply({
                content: "❌ Tôi không thể cập nhật vai trò. Hãy kiểm tra quyền của tôi!",
                ephemeral: true,
            });
        }

        // Tạo nhúng thăng chức
        const embed = new EmbedBuilder()
            .setColor("#FFB400")
            .setAuthor({
                    name: `${staff.displayName} đã ký.`,
                    iconURL: staff.displayAvatarURL(),
            })
            .setTitle("Thông tin thăng chức")
            .setDescription(
                `* **Người dùng:** ${user}\n` +
                `* **Cấp bậc cũ:** ${previousrole}\n` +
                `* **Cấp bậc mới:** ${newrole}\n` +
                `* **Lý do:** ${reason}\n` +
                `* **Lưu ý:** ${notes}\n` +
                `* **Người thực hiện:** ${staff}`
            )
            .setThumbnail(guild.iconURL())
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        // const promotionChannel = interaction.channel; // interaction.guild.channels.cache.get(promotionChannelID);

        if (!channel) {
            return interaction.reply({ content: "Không tìm thấy kênh này.", ephemeral: true });
        }

        if (!channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.SendMessages)) {
            return interaction.reply({
                content: "❌ Tôi không có quyền gửi tin nhắn trong kênh này.",
                ephemeral: true,
            });
        }

        await channel.send({ content: `<@${user.id}>`, embeds: [embed] });
        await interaction.reply({
            content: `✅ ${user} đã được thăng chức thành công lên ${newrole}!`,
            ephemeral: true,
        });
    },
};
