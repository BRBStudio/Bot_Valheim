const { EmbedBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, PermissionsBitField, ButtonBuilder } = require('discord.js');
const config = require('../../config');
const { verifyDefault } = require('../../ButtonPlace/ButtonBuilder');
const { VerifyUsers } = require('../../schemas/defaultCaptchaSchema');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify_default')
        .setDescription('🔹 Đặt kênh xác minh vai trò thành viên')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('🔹 Thiết lập kênh nhận nút xác minh vai trò')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Gửi xác minh tài khoản đến kênh này')
                        .setRequired(true)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('🔹 Xóa dữ liệu của người dùng')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Người dùng bạn muốn xóa dữ liệu')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('data')
                .setDescription('🔹 Xem danh sách những người đã xác thực')
                .addStringOption(option =>
                    option.setName(`id-server`)
                        .setDescription(`id máy chủ mà bạn muốn xem dữ liệu`)
                        .setRequired(true)
                )
        ),
    async execute(interaction) {

        try {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/verify_default' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            // Kiểm tra xem tương tác có tồn tại không
            if (!interaction) {
                return;
            }

            // Hoãn phản hồi ngay lập tức để tránh lỗi timeout
            await interaction.deferReply({ ephemeral: true });

            // Kiểm tra lệnh phụ
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'setup') {

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    await interaction.editReply({
                        content: `Bạn không có quyền ***QUẢN TRỊ VIÊN*** để thực hiện hành động này.`,
                        ephemeral: true
                    });
                    return;
                }

                const channel = interaction.options.getChannel('channel');
                const verifyEmbed = new EmbedBuilder()
                    .setTitle("Kích Hoạt Thành Viên")
                    .setDescription('Nhấp vào nút để xác minh tài khoản của bạn và đồng ý tuân thủ quy định server để có quyền truy cập vào các kênh.')
                    .setColor(config.embedGreen);

                await interaction.guild.roles.fetch();

                let sendChannel = await channel.send({
                    embeds: [verifyEmbed],
                    components: [
                        new ActionRowBuilder().setComponents(
                            verifyDefault,
                        ),
                    ],
                });

                if (!sendChannel) {
                    return interaction.followUp({ content: 'Đã có lỗi xảy ra, vui lòng thử lại sau.', ephemeral: true });
                }

                // Xoá phản hồi tạm thời sau khi xử lý thành công
                await interaction.editReply({ content: 'Đã thiết lập xác minh thành công.', ephemeral: true });
            } else if (subcommand === 'remove') {

                if (interaction.guild.ownerId !== interaction.user.id) {
                    return await interaction.editReply({ content: "Lệnh này chỉ dành cho chủ sở hữu máy chủ", ephemeral: true });
                }

                // Lấy thông tin người dùng và máy chủ hiện tại
                const user = interaction.options.getUser('user'); // Người dùng được chọn
                const guildId = interaction.guild.id; // ID máy chủ hiện tại

                // Tìm kiếm người dùng trong VerifyUsers bằng User ID và Guild ID
                const result = await VerifyUsers.findOneAndDelete({ User: user.id, Guild: guildId });

                if (result) {
                    // Nếu tìm thấy và xóa thành công
                    await interaction.editReply({ content: `Đã xóa dữ liệu của người dùng ${user.displayName}.`, ephemeral: true });
                } else {
                    // Nếu không tìm thấy dữ liệu
                    await interaction.editReply({ content: `Không tìm thấy dữ liệu của người dùng ${user.displayName}.`, ephemeral: true });
                }
            } else if (subcommand === 'data') {

                if (!checkPermissions(interaction)) {
                    return interaction.editReply('Dành cho Dev, bạn không thể sử dụng điều này.');
                  }

                // Lấy ID máy chủ từ tham số id-server
                const serverId = interaction.options.getString('id-server');

                try {

                    // Lấy thông tin máy chủ từ ID
                    const guild = await interaction.client.guilds.fetch(serverId);
                    const guildName = guild.name; // Lấy tên máy chủ

                    // Tìm kiếm danh sách người dùng đã xác thực trong máy chủ với ID đã nhập
                    const users = await VerifyUsers.find({ Guild: serverId });

                    if (users.length > 0) {
                        // Tạo danh sách người dùng đã xác thực
                        const userList = users.map(user => `<@${user.User}>`).join('\n');
                        
                        // Gửi danh sách tới người dùng
                        await interaction.editReply({
                            content: `Danh sách người đã xác thực trong máy chủ **${guildName}** (ID: **${serverId}**):\n${userList}`,
                            ephemeral: true
                        });
                    } else {
                        // Nếu không có người dùng nào đã xác thực
                        await interaction.editReply({
                            content: `Không tìm thấy dữ liệu người dùng đã xác thực trong máy chủ **${guildName}** (ID: **${serverId}**).`,
                            ephemeral: true
                        });
                    }
                } catch (error) {
                    // Xử lý lỗi nếu không tìm thấy máy chủ
                    await interaction.editReply({
                        content: `Không thể tìm thấy máy chủ với ID: **${serverId}**.`,
                        ephemeral: true
                    });
                    console.error(error);
                }
            }
        } catch (error) {
            console.error(error);
            return interaction.followUp({ content: 'Đã có lỗi xảy ra khi xử lý nút.', ephemeral: true });
        }
    },
};