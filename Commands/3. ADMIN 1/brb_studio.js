const { SlashCommandBuilder } = require('discord.js');
const { checkAdministrator } = require(`../../permissionCheck`)
const GuildUpdateStatus = require('../../schemas/brb_studio');
const AFKStatus = require('../../schemas/AfkSchemas');
const BannedUser = require('../../schemas/Raid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('brb_studio')
        .setDescription('🔹 Quản lý trạng thái các trạng thái của bot.')
        .addStringOption(option =>
            option
                .setName('select')
                .setDescription('Chọn trạng thái cần bật/tắt')
                .setRequired(true)
                .addChoices(
                    { name: 'Bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại (VSU)', value: 'voiceStateUpdate_bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại' },
                    { name: 'Tự động chuyển những người dùng không hoạt động trong voice sang kênh afk (RDY)', value: 'Ready_Tự động kiểm tra người dùng AFK trong kênh thoại' },
                    { name: 'Hệ thống chống raid tự động (AR)', value: 'guildMemberAdd_Phát hiện và ngăn chặn người dùng phá server' }
                )
        ),

    async execute(interaction) {

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const guildId = interaction.guild.id;
        const selectedEvent = interaction.options.getString('select');
        const [eventName, Ghi_chú] = selectedEvent.split('_');

        try {
            let eventStatus;
            if (Ghi_chú && Ghi_chú === 'bot đọc tên người dùng khi người dùng tham gia hoặc rời khỏi kênh thoại') {
                // Lấy dữ liệu từ brb_studio.js
                eventStatus = await GuildUpdateStatus.findOneAndUpdate(
                    { guildId, event: eventName, Ghi_chú },
                    { $setOnInsert: { isEnabled: true } }, // Nếu chưa có, tạo mặc định là bật
                    { upsert: true, new: true }
                );
            } else if (Ghi_chú && Ghi_chú === 'Tự động kiểm tra người dùng AFK trong kênh thoại') {
                // Lấy dữ liệu từ AFKSchemas.js
                eventStatus = await AFKStatus.findOneAndUpdate(
                    { guildId, event: eventName, Ghi_chú },
                    { $setOnInsert: { isEnabled: true } }, // Nếu chưa có, tạo mặc định là bật
                    { upsert: true, new: true }
                );
            } else if (Ghi_chú === 'Phát hiện và ngăn chặn người dùng phá server') {
                const config = await BannedUser.findOneAndUpdate(
                    { guildId },
                    [{ $set: { enabled: { $not: "$enabled" } } }],
                    { upsert: true, new: true }
                  );
          
                  return await interaction.reply(
                    `Đã ${config.enabled ? '**bật**' : '**tắt**'} hệ thống: **Phát hiện và ngăn chặn người dùng phá server.**`
                  );
                } else {
                  throw new Error('Chọn sự kiện không hợp lệ.');
                }

            // Đảo trạng thái bật/tắt
            const newStatus = !eventStatus.isEnabled;
            const updatedStatus = await eventStatus.constructor.findOneAndUpdate(
                { guildId, event: eventName, Ghi_chú },
                { isEnabled: newStatus },
                { new: true } // Lấy trạng thái mới nhất
            );

            if (!updatedStatus) throw new Error('Không thể cập nhật trạng thái sự kiện.');

            await interaction.reply(
                `Đã ${newStatus ? '**bật**' : '**tắt**'} hệ thống: **${Ghi_chú}**.`
            );

        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái sự kiện:', error);
            await interaction.reply('Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.');
        }
    },
};

