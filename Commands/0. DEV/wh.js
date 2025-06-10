const { SlashCommandBuilder } = require('discord.js');
const ValheimWebhook = require('../../schemas/webhookschemas');
// const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
// const { BRB } = require(`../../Embeds/embedsDEV`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wh')
        .setDescription('Lưu webhook URL để nhận thông báo mod Valheim từ Thunderstore')
        .addStringOption(o => o
            .setName('url')
            .setDescription('Webhook URL')
            .setRequired(true))
        .addStringOption(o => o
            .setName(`id_guild`)
            .setDescription(`ID của máy chủ Discord`)
            .setRequired(true)),

        guildSpecific: true,
		guildId: `1319809040032989275`,

    async execute(interaction) {

        /*
            DÙNG VỚI DỮ LIỆU MONGODB WEDHOOK (webhookschemas.js)
            VÀ SỰ KIỆN mod_valheim1.js
        */

        const url = interaction.options.getString('url');
        const inputGuildId = interaction.options.getString('id_guild');

        if (!url.startsWith('https://discord.com/api/webhooks/')) {
            return interaction.reply({ content: '❌ Webhook URL không hợp lệ.', ephemeral: true });
        }

        try {

            // Gửi GET request đến webhook URL để lấy thông tin
            const res = await fetch(url);
            if (!res.ok) {
                return interaction.reply({ content: '❌ Không thể truy cập webhook URL. Có thể webhook đã bị xoá hoặc không hợp lệ.', ephemeral: true });
            }

            const data = await res.json();
            const actualGuildId = data.guild_id;

            if (actualGuildId !== inputGuildId) {
                return interaction.reply({ content: '❌ ID này không phải là của máy chủ chứa webhook.', ephemeral: true });
            }




            const existing = await ValheimWebhook.findOne({ guildId: inputGuildId }); // url
            // if (existing) {
            //     return interaction.reply({ content: '✅ Webhook đã tồn tại trong cơ sở dữ liệu.', ephemeral: true });
            // }

            if (existing) {
                // Cập nhật URL nếu userId đã tồn tại
                existing.url = url;
                await existing.save();
                interaction.reply({ content: '✅ Đã cập nhật Webhook URL cho userId này.', ephemeral: true });
                return
            }

            await ValheimWebhook.create({ url, guildId: inputGuildId });
            interaction.reply({ content: '✅ Webhook đã được lưu thành công!', ephemeral: true });
        } catch (err) {
            console.error(err);
            interaction.reply({ content: '❌ Đã xảy ra lỗi khi lưu webhook.', ephemeral: true });
        }
    }
};
