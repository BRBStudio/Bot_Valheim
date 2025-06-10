const { SlashCommandBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');
const Mailbox = require('../../schemas/mailboxSchema');
const { mailboxButtons, mailboxAdminButtons } = require('../../ButtonPlace/ActionRowBuilder');
const { mailboxUserEmbed, mailboxAdminEmbed } = require('../../Embeds/embedsCreate');

const options = {
    bug: {
        name: 'Báo cáo lỗi',
        replyMessage: 'Cảm ơn bạn đã gửi báo cáo lỗi! Chúng tôi sẽ xem xét và xử lý ngay.',
        previewMessage: 'Dưới đây là xem trước phản hồi của bạn cho Báo cáo lỗi:',
    },
    suggestion: {
        name: 'Báo cáo đề xuất',
        replyMessage: 'Cảm ơn bạn đã gửi đề xuất! Chúng tôi sẽ xem xét và xử lý nhanh chóng.',
        previewMessage: 'Dưới đây là xem trước phản hồi của bạn cho Báo cáo đề xuất:',
    },
    review: {
        name: 'Đánh giá phản hồi',
        replyMessage: 'Cảm ơn bạn đã gửi đánh giá! Chúng tôi tôn trọng quyết định của bạn.',
        previewMessage: 'Dưới đây là xem trước phản hồi của bạn cho Đánh giá:',
    },
    other: {
        name: 'Báo cáo khác',
        replyMessage: 'Cảm ơn bạn đã gửi báo cáo! Chúng tôi sẽ cân nhắc về điều đó.',
        previewMessage: 'Dưới đây là xem trước phản hồi của bạn cho Báo cáo khác:',
    },
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mailbox')
        .setDescription('🔹 Hòm thư của DEV')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Chọn danh mục phản hồi')
                .setRequired(true)
                .addChoices(
                    { name: options.bug.name, value: 'bug' },
                    { name: options.suggestion.name, value: 'suggestion' },
                    { name: options.review.name, value: 'review' },
                    { name: options.other.name, value: 'other' },
                ),
        )
        .addStringOption(option =>
            option.setName('feedback')
                .setDescription('Thông tin phản hồi của bạn')
                .setRequired(true),
        )
        .addStringOption(option =>
            option.setName('vote')
                .setDescription('Đánh giá Bot của chúng tôi theo số sao')
                .setRequired(false)
                .addChoices(
                    { name: '⭐', value: '⭐' },
                    { name: '⭐⭐', value: '⭐⭐' },
                    { name: '⭐⭐⭐', value: '⭐⭐⭐' },
                    { name: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐' },
                    { name: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' },
                ),
        ),

    async execute(interaction, client) {
        const commandStatus = await CommandStatus.findOne({ command: '/mailbox' });

        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        const user = interaction.user;
        const option = interaction.options.get('option').value;
        const feedback = interaction.options.get('feedback').value;
        const vote = option === 'review' ? interaction.options.get('vote')?.value : null;

        const feedbackEmbed = mailboxUserEmbed(feedback, options[option].name, vote);
        const previewMessage = await interaction.reply({
            content: options[option].previewMessage,
            embeds: [feedbackEmbed],
            components: [mailboxButtons],
            ephemeral: true,
        });

        const filter = i => i.customId === 'sendButton' || i.customId === 'cancelButton';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        let sendButtonClicked = false;
        let cancelButtonClicked = false;

        collector.on('collect', async i => {
            if (i.customId === 'sendButton' && !sendButtonClicked) {
                const newMailboxEntry = new Mailbox({
                    userId: user.id,
                    userName: user.username,
                    guildId: interaction.guild.id,
                    option: options[option].name,
                    feedback,
                });

                await newMailboxEntry.save();

                const guild = client.guilds.cache.get('1028540923249958912');
                const channel = guild.channels.cache.get('1148874551514632192');
                const adminEmbed = mailboxAdminEmbed(feedback, options[option].name, user.username, interaction.guild.name, vote);

                channel.send({ embeds: [adminEmbed], components: [mailboxAdminButtons] });
                interaction.followUp({ content: options[option].replyMessage, ephemeral: true });
                await previewMessage.delete();
                collector.stop();
            } else if (i.customId === 'cancelButton' && !cancelButtonClicked) {
                interaction.followUp({ content: 'Bạn đã huỷ việc gửi phản hồi.', ephemeral: true });
                await previewMessage.delete();
                collector.stop();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                // Nếu không có sự kiện nào được thu thập, thông báo về việc hết thời gian
                interaction.followUp({ content: `Bạn đã không thực hiện hành động nào tong 2 phút, vì vậy sẽ không tương tác được với nút nữa.`, ephemeral: true });
            }
        });
    },
};
