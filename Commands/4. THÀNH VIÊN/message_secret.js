const { SlashCommandBuilder } = require('discord.js');
const { createSecretMessageEmbed, createSnoopingWarningEmbed } = require('../../Embeds/embedsCreate')
const { view } = require(`../../ButtonPlace/ActionRowBuilder`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message_secret')
        .setDescription('🔹 gửi tin nhắn bí mật cho ai đó')
        .addUserOption(option => option.setName('user').setDescription('Chọn người bạn muốn gửi tin nhắn bí mật').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Nhập nội dung tin nhắn').setRequired(true)),

async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/message_secret' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const { options } = interaction;

        const member = options.getUser('user');
        const message = options.getString('message');

        // Xác nhận tương tác mà không gửi tin nhắn
        await interaction.deferReply({ ephemeral: true });

        const msg = await interaction.channel.send({ content: `***${member} Bạn đã nhận được một tin nhắn bí mật từ ${interaction.user}***`, components: [view] })

        // Xóa phản hồi đã hoãn lại
        await interaction.deleteReply();

    const collector = msg.createMessageComponentCollector();

    collector.on('collect', async i => {

        const messageembed = createSnoopingWarningEmbed(member)
        const snooping = createSecretMessageEmbed(message)

            if (i.customId === 'view') {
                if (i.member.id !== member.id) {
                    await i.deferUpdate();
                    await i.channel.send({ embeds: [messageembed], ephemeral: true });
                } else {
                    await i.reply({ embeds: [snooping], ephemeral: true });
                }
            }
        })
    }
};