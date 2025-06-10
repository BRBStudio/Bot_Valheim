const { SlashCommandBuilder } = require('discord.js');
const Mkvalheim = require('../../schemas/Mk_Valheimschema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mk')
        .setDescription(`🔹 Cài đặt mật khẩu Valheim.`)
        .addSubcommand(o => o
            .setName(`valheim`)
            .setDescription(`🔹 Cài đặt mật khẩu Valheim.`)
            .addStringOption(o =>
                o.setName('mk')
                    .setDescription(`Đặt mật khẩu bạn muốn`)
                    .setRequired(true)
            )
        )
        .addSubcommand(o => o
            .setName(`off`)
            .setDescription(`🔹 Tắt mật khẩu Valheim.`)
        ),

    async execute(interaction, client) {

        const guildOwner = await interaction.guild.fetchOwner();

		if (interaction.user.id !== guildOwner.id) {
			return await interaction.reply({ content: `Lệnh này chỉ dành cho chủ sở hữu.`, ephemeral: true });
		}

        const guildID = interaction.guild.id

        if (interaction.options.getSubcommand() === 'valheim') {
            const newPassword = interaction.options.getString('mk'); 

            // await Mkvalheim.findOneAndUpdate(
            //     { Guild: guildID }, // Chỉ cập nhật cho Guild hiện tại
            //     { password: newPassword },
            //     { upsert: true, new: true }
            // );            

            // Kiểm tra xem đã có dữ liệu chưa
            let guildData = await Mkvalheim.findOne({ Guild: guildID });

            if (guildData) {
                // Cập nhật giá trị password thủ công
                guildData.password = newPassword;
                await guildData.save();
            } else {
                // Tạo mới nếu chưa có
                guildData = new Mkvalheim({
                    Guild: guildID,
                    password: newPassword
                });
                await guildData.save();
            }

            await interaction.reply({ content: `🔒 Mật khẩu mới đã được lưu: \`${newPassword}\`\nĐể lấy mật khẩu dùng \`\`\`!mk\`\`\` `, ephemeral: true });
        }

        if (interaction.options.getSubcommand() === 'off') {
            await Mkvalheim.deleteMany({});
            await interaction.reply({ content: `🚫 Mật khẩu Valheim đã bị tắt và xóa khỏi hệ thống.`, ephemeral: true });
        }
    }
};
