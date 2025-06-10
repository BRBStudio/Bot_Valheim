const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("shows_role_members") 
    .setDescription("🔹 Kiểm tra thành viên trực tuyến với vai trò được chỉ định.") 
    .addRoleOption(options => options
        .setName('role')
        .setDescription(`Vai trò cần kiểm tra`)
        .setRequired(true)
    ), 

    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/shows_role_members' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const { options } = interaction;
        
        const role = options.getRole("role");
        const members = role.members.map((u) => u.user);

        await interaction.deferReply({ ephemeral: true })

        const online = []

        for (let i = 0; i < members.length; i++) {
            const user = members[i];
            const member = await interaction.guild.members.fetch(user.id);
            if (member.presence?.status === "online") {
                online.push(`${user.displayName}`)
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`VAI TRÒ THÀNH VIÊN TRỰC TUYẾN `)
            .setDescription(`${online.map(u => u).join("\n") || "Không có thành viên nào trực tuyến"}\n\n- Tổng số người dùng: ${online.length ? online.length : `Không có thành viên nào trong vai trò ${role} trực tuyến `}`)
            .setTimestamp()
            .setColor(online.length === 0 ? 'Red' : "Green")

        await interaction.editReply({ embeds:[embed] })
    }
}