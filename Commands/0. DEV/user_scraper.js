const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user_scraper")
        .setDescription("🔹 Quét tất cả thông tin về người dùng")
        .addUserOption(option => option.setName("target").setDescription("Người bạn muốn cạo tất cả thông tin").setRequired(true)),

    guildSpecific: true,
    guildId: `1319809040032989275`, // Máy chủ Emoji Command Bot
    
    async execute(interaction) {
        const permissionEmbed = new EmbedBuilder().setDescription("`❌` Bạn không có quyền sử dụng lệnh này!").setColor(config.embedGreen).setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });
        
        // Kiểm tra quyền đặc biệt
        if (!checkPermissions(interaction)) {
            return interaction.reply({ embeds: [permissionEmbed] });
        }

        if (!interaction.deferred) {
            await interaction.deferReply({ ephemeral: false });
        }
        
        const targetUser = interaction.options.getUser("target");
        const member = await interaction.guild.members.fetch(targetUser.id).catch(console.error);
    
        if (!member) {
            await interaction.followUp({ content: "Không thể lấy thông tin chi tiết thành viên. Họ có thể không phải là thành viên của bang hội này.", ephemeral: true });
            return;
        }

        const userDataResponse = await fetch(`https://discord.com/api/v9/users/${targetUser.id}`, {
            headers: { "Authorization": `Bot ${process.env.TOKEN}` }
        });
        if (!userDataResponse.ok) {
            await interaction.followUp("Không thể tìm nạp dữ liệu người dùng.");
            return;
        }
        const userData = await userDataResponse.json();

        const userInfoFields = [
            { name: "tên tài khoản", value: `${member.user.tag}`, inline: true },
            { name: "Sử dụng ID", value: `${member.id}`, inline: true },
            { name: "Ngày tham gia Discord", value: `${member.user.createdAt.toUTCString()}`, inline: false },
            { name: "Trạng thái nitro", value: `${userData.premium_type === 1 ? "Nitro Classic" : userData.premium_type === 2 ? "Nitro" : "None"}`, inline: false}
        ];

        const memberInfoFields = [
            { name: "Ngày tham gia bang hội", value: `${member.joinedAt.toUTCString()}`, inline: true },
            { name: "Tên nick", value: `${member.nickname || "Không có"}`, inline: true },
            { name: "Tăng cường kể từ", value: `${member.premiumSince ? member.premiumSince.toUTCString() : "Not Boosting"}`, inline: false },
        ];

        const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => role.toString());
        if (roles.length > 0) {
            memberInfoFields.push({ name: "Roles", value: roles.join(", "), inline: false });
        }

        const permissions = member.permissions.toArray().join(", ");
        memberInfoFields.push({ name: "Quyền", value: permissions, inline: false });

        const userEmbed = new EmbedBuilder()
            .setTitle(`Chi tiết cho ${member.user.username}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(userInfoFields)
            .setColor("#0099FF");

        const memberEmbed = new EmbedBuilder()
            .setTitle(`Chi tiết bang hội cho ${member.user.username}`)
            .addFields(memberInfoFields)
            .setColor("#00FF00");

        const button = new ButtonBuilder()
            .setLabel("Xem dữ liệu bang hội")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("view_raw");
        
        const button2 = new ButtonBuilder()
            .setLabel("Xem JSON của người dùng")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("view_user_json")

        const row = new ActionRowBuilder().addComponents(button, button2);

        await interaction.followUp({ embeds: [userEmbed, memberEmbed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === "view_raw") {
                const rawUserData = JSON.stringify(member, null, 4).substring(0, 4000); 
                await i.reply({ content: `\`\`\`json\n${rawUserData}\n\`\`\``, ephemeral: true });
            } else if (i.customId === "view_user_json") {
                const jsonUserData = JSON.stringify(userData, null, 4).substring(0, 4000);
                await i.reply({ content: `\`\`\`json\n${jsonUserData}\n\`\`\``, ephemeral: true })
            }
        });
    }
};
