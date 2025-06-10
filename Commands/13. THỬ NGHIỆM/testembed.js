const { SlashCommandBuilder } = require('discord.js');
const { EmbedBRB } = require('embed-brb'); // ../../thư viện embed/EmbedBRB embed-brb

/*
    Không dùng embed của discord
    Dùng thư viện EmbedBRB để viết embed
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testembed')
        .setDescription('Test EmbedBRB')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Tên')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('value')
                .setDescription('Nội dung bạn cần viết')
                .setRequired(true)
        ),
        
    guildSpecific: true,
    guildId: ['1319809040032989275'],

    async execute(int) {

        await int.deferReply({ ephemeral: true });

        const name = int.options.getString('name');
        const value = int.options.getString('value');

        const embed = new EmbedBRB(int)
            .Mau('xanh_đẹp')
            .Tieude('🎮 BRB Studio')
            .Noidung('Chào mừng bạn đến với Valheim!')
            .ThemLuaChon(name, value)
            .Truong(
                { name: 'Người chơi', value: 'Cơn Mưa Lạ', inline: true },
                { name: 'Trạng thái', value: 'Đang chiến đấu', inline: true }
            )
            .Tacgia(bot.displayName, bot.displayAvatarURL())
            .Avatar(nd.displayAvatarURL({ dynamic: true }))
            .Anh(mc.iconURL({ dynamic: true, size: 512 }))
            .Chantrang('BRB Studio • Valheim Server')
            .tg_guitn();

        await int.editReply({
            tnn: [embed],
        });
    }
};
