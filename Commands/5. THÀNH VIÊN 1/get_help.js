const { SlashCommandBuilder } = require("discord.js");
const gethelpSchema = require(`../../schemas/gethelpSchema`);
const { checkAdministrator } = require(`../../permissionCheck`);
const { createGetHelpListEmbed, createGetHelpDMEmbed, createGetHelpTagEmbed } = require(`../../Embeds/embedsCreate`);
const { threadembed } = require(`../../Embeds/embedsDEV`);
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_help")
        .setDescription("🔹 Gọi người giúp đỡ (chỉ dùng trong diễn đàn).")
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('🔹 Thiết lập người dùng trợ giúp')
                .addUserOption(option => option.setName('user1').setDescription('Chọn người dùng').setRequired(false))
                .addUserOption(option => option.setName('user2').setDescription('Chọn người dùng').setRequired(false))
                .addUserOption(option => option.setName('user3').setDescription('Chọn người dùng').setRequired(false))
                .addUserOption(option => option.setName('user4').setDescription('Chọn người dùng').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tag')
                .setDescription('🔹 Gửi yêu cầu trợ giúp')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('🔹 Xóa người dùng trợ giúp')
                .addUserOption(option => option.setName('user').setDescription('Chọn người dùng').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('🔹 Xem danh sách người dùng trợ giúp')
        ),

    async execute(interaction, client) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/get_help' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const subcommand = interaction.options.getSubcommand();
        const serverId = interaction.guild.id;

        if (subcommand === 'setup') {

            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;

            const users = [
                interaction.options.getUser('user1'),
                interaction.options.getUser('user2'),
                interaction.options.getUser('user3'),
                interaction.options.getUser('user4')
            ].filter(user => user !== null && !user.bot);


            const data = await gethelpSchema.findOne({ serverId }); // let

            if (!data) {
                data = new gethelpSchema({ serverId, userIds: [] });
            }

            // Kiểm tra nếu danh sách đã đạt giới hạn 50 người
            if (data.userIds.length >= 50) {
                return interaction.reply({ content: 'Bạn đã đạt giới hạn 50 người dùng hỗ trợ.', ephemeral: true });
            }

            let replyMessage = '';
            let isChanged = false; // Biến cờ để kiểm tra xem có thay đổi nào không

            users.forEach(user => {
                if (!data.userIds.includes(user.id)) {
                    data.userIds.push(user.id);
                    replyMessage += `Đã thêm người dùng ${user.displayName}.\n`;
                    isChanged = true; // Đánh dấu đã có thay đổi
                } else {
                    replyMessage += `Người dùng ${user.displayName} đã được thêm trước đó.\n`;
                }
            });

            if (isChanged) {
                await data.save();
            } else {
                replyMessage = 'Không có thay đổi nào được thực hiện.';
            }
            await interaction.reply({ content: `${replyMessage}`, ephemeral: true });

        } else if (subcommand === 'tag') {

            if (!interaction.channel || !interaction.channel.isThread()) {

                await interaction.reply({ embeds: [threadembed], ephemeral: true });
                return;
            }

            // Kiểm tra xem người thực hiện lệnh có phải là người tạo thread không
            const threadAuthorId = interaction.channel.ownerId;  // Lấy ID của người tạo thread
            const userId = interaction.user.id;  // ID của người đang thực hiện lệnh

            if (threadAuthorId !== userId) {
                // Nếu người thực hiện không phải là người tạo thread, trả về thông báo
                return interaction.reply({
                    content: "Bạn chỉ có thể sử dụng lệnh này trong bài viết mà bạn đã tạo.",
                    ephemeral: true,
                });
            }

            const data = await gethelpSchema.findOne({ serverId }); // let

            if (!data || !data.userIds.length) {
                return interaction.reply('Chưa có người dùng nào được thiết lập để nhận yêu cầu trợ giúp.');
            }
            
            const embed = await createGetHelpTagEmbed (interaction)

            // Kiểm tra xem có người dùng nào trong danh sách không, nếu không thì chỉ trả lời với thông báo thích hợp
            if (!embed) {
                await interaction.reply('Chưa có người dùng nào được thiết lập để nhận yêu cầu trợ giúp.');
            } else {
            await interaction.reply({ embeds: [embed], ephemeral: false });
            }

            // Tạo tin nhắn DM embed
            const dmEmbed = await createGetHelpDMEmbed (interaction)

            // Gửi tin nhắn DM tới tất cả người dùng đã thiết lập
            for (const userId of data.userIds) {
                const user = await client.users.fetch(userId);
                try {
                    await user.send({ embeds: [dmEmbed] });
                } catch (error) {
                    console.error(`Không thể gửi DM cho ${user.displayName}:`, error);
                }
            }
        } else if (subcommand === 'remove') {

            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;

            const user = interaction.options.getUser('user');
            const data = await gethelpSchema.findOne({ serverId }); // let

            if (!data || !data.userIds.includes(user.id)) {
                await interaction.reply({ content: `Người dùng ${user.displayName} không có trong danh sách trợ giúp.`, ephemeral: true });
                return;
            }

            // Xóa người dùng khỏi danh sách
            data.userIds = data.userIds.filter(id => id !== user.id);
            await data.save();
            await interaction.reply({ content: `Người dùng ${user.displayName} đã được xóa khỏi danh sách trợ giúp.`, ephemeral: true });
        } else if (subcommand === 'list') {

            // const hasPermission = await checkAdministrator(interaction);
            // if (!hasPermission) return;

            const embed = await createGetHelpListEmbed (interaction)

            // Kiểm tra xem có người dùng nào trong danh sách không, nếu không thì chỉ trả lời với thông báo thích hợp
            if (!embed) {
                await interaction.reply('Chưa có người dùng nào được thiết lập để nhận yêu cầu trợ giúp.');
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
};

