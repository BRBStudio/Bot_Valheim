const { RoleSelectMenuInteraction, EmbedBuilder } = require('discord.js');
const interactionError = require('../WebhookError/interactionError');

// Xuất module để sử dụng trong tệp chính
module.exports = {
    name: "interactionCreate", // Tên sự kiện mà module này sẽ xử lý

    // Hàm sẽ được thực thi khi sự kiện xảy ra
    async execute(interaction, client) {
        // Kiểm tra xem tương tác có phải là tương tác Role Select Menu không
        if (!interaction.isRoleSelectMenu()) return;

        try {
            // Lấy customId của Role Select Menu đã chọn
            const customId = interaction.customId;

            // Danh sách các Role Select Menu cần loại trừ
            const excludedRoleSelectMenus = [
                'role-select-menu-1', 
                'role-select-menu-2', 
                'role-select-menu-3'
            ];

            // Nếu customId là một trong các Role Select Menu cần loại trừ, không xử lý
            if (excludedRoleSelectMenus.includes(customId)) {
                return; // Không làm gì cả
            }

            // Kiểm tra customId và thực hiện các hành động tương ứng
            if (customId === "roles") {
                const roles = interaction.roles;

                if (roles.size === 1) {
                    // Xử lý trường hợp chỉ có một vai trò được chọn
                    const role = await interaction.guild.roles.fetch(interaction.roles.first().id);
                    const loadEmbed = new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`Đang tải ${role} các thành viên`)
                        .setImage(`https://i.makeagif.com/media/2-10-2022/Rqy9Le.gif`);
                    await interaction.update({ embeds: [loadEmbed] });

                    const members = await role.members;
                    let allMembers = "";

                    await members.forEach(async (member) => {
                        allMembers += `\n> <@${member.id}> (${member.user.tag})`;
                    });

                    if (allMembers === "") {
                        allMembers = "Không có thành viên";
                    }

                    const finalEmbed = new EmbedBuilder()
                        .setColor("Yellow")
                        .setTitle(`${role.name} Các thành viên(${role.members.size})`)
                        .setImage(`https://i.makeagif.com/media/2-10-2022/Rqy9Le.gif`);

                    if (allMembers.length > 4096) {
                        const lines = allMembers.split("\n");
                        let chars = 0;

                        const line = lines.findIndex((l) => {
                            chars += l.length;
                            if (chars > 4000) return l;
                        });

                        const str2 = lines.splice(line).join("\n");
                        const str1 = lines.join("\n");

                        finalEmbed.setDescription(str1);
                        const secondEmbed = new EmbedBuilder()
                            .setColor("Yellow")
                            .setTitle(`${role.name} Thành viên tiếp tục`)
                            .setImage(`https://i.makeagif.com/media/2-10-2022/Rqy9Le.gif`)
                            .setDescription(str2);

                        await interaction.editReply({ embeds: [finalEmbed, secondEmbed] });
                    } else {
                        finalEmbed.setDescription(allMembers);
                        await interaction.editReply({ embeds: [finalEmbed] });
                    }
                } else {
                    // Xử lý trường hợp có nhiều vai trò được chọn
                    const loadEmbed = new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`Đang tải thành viên`)
                        .setImage(`https://i.makeagif.com/media/2-10-2022/Rqy9Le.gif`);
                    await interaction.update({ embeds: [loadEmbed] });

                    let description = "";
                    await roles.forEach(async (roleID) => {
                        let allMembers = "";
                        await roleID.members.forEach(async (member) => {
                            allMembers += `\n> <@${member.id}> (${member.user.tag})`;
                        });
                        if (allMembers === "") {
                            allMembers = "\n> Không có thành viên";
                        }
                        description += `\n\n**${roleID.name} (${roleID.members.size})**${allMembers}`;
                    });

                    const finalEmbed = new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`Vai trò đã chọn`)
                        .setImage(`https://media.tenor.com/ubv5pyr9mykAAAAC/roles-add-roles.gif`);

                    if (description.length > 4096) {
                        const lines = description.split("\n");
                        let chars = 0;

                        const line = lines.findIndex((l) => {
                            chars += l.length;
                            if (chars > 4000) return l;
                        });

                        const str2 = lines.splice(line).join("\n");
                        const str1 = lines.join("\n");

                        finalEmbed.setDescription(str1);
                        const secondEmbed = new EmbedBuilder()
                            .setColor("Blue")
                            .setTitle(`Vai trò đã chọn Thành viên Tiếp tục`)
                            .setImage(`https://media.tenor.com/ubv5pyr9mykAAAAC/roles-add-roles.gif`)
                            .setDescription(str2);

                        await interaction.editReply({ embeds: [finalEmbed, secondEmbed] });
                    } else {
                        finalEmbed.setDescription(description);
                        await interaction.editReply({ embeds: [finalEmbed] });
                    }
                }
            }
        } catch (error) {
            // Xử lý lỗi
            interactionError.execute(interaction, error, client);
        }
    },
};
