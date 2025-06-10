const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js');
const ticket = require('../../schemas/ticketSchema');
const CommandStatus = require('../../schemas/Command_Status');
const config = require(`../../config`);
const { checkAdministrator } = require(`../../permissionCheck`)
 
    module.exports = {
        data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('🔹 Quản lý hệ thống vé')
        .addSubcommand(command => command.setName('send').setDescription('🔹 Gửi tin nhắn vé').addStringOption(option => option.setName('name').setDescription('Tên cho nội dung menu chọn mở').setRequired(false)).addStringOption(option => option.setName('message').setDescription('Một thông báo tùy chỉnh để thêm vào phần nhúng').setRequired(false)))
        .addSubcommand(command => command.setName('setup').setDescription('🔹 Thiết lập danh mục vé').addChannelOption(option => option.setName('category').setDescription('Chọn 1 danh mục').addChannelTypes(ChannelType.GuildCategory).setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('🔹 Vô hiệu hóa hệ thống vé')),

    async execute (interaction) {

        try {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/ticket' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }

            // Kiểm tra nếu user là người đặc biệt (trong danh sách specialUsers)
            const QDB = config.specialUsers.includes(interaction.user.id);

            if (!QDB) {
                // Nếu KHÔNG phải người đặc biệt thì kiểm tra quyền admin
                const hasPermission = await checkAdministrator(interaction);
                if (!hasPermission) return; // Nếu không có quyền thì dừng
            }


            const { options } = interaction;
            const sub = options.getSubcommand();
            const data = await ticket.findOne({ Guild: interaction.guild.id});
    
            switch (sub) {
                case 'send':
                    if (!data) return await interaction.reply({ content: `⚠️ Bạn phải thực hiện /ticket setup trước khi có thể gửi tin nhắn ticket...`, ephemeral: true });
    
                    const name = options.getString('name') || `CHỌN 1 VÉ BẠN MUỐN`;
                    var message = options.getString('message') || 'Tạo một vé để nói chuyện với nhân viên máy chủ! Sau khi bạn chọn bên dưới, hãy sử dụng thông tin đầu vào để mô tả lý do bạn tạo phiếu này';
    
                    const select = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('ticketCreateSelect')
                        .setPlaceholder(`💳 ${name}`)
                        .setMinValues(1)
                        .addOptions(
                            {
                                label: '💳 Tạo vé hỗ trợ discord',
                                description: 'Nhấp để bắt đầu quá trình tạo vé',
                                value: 'discordTicket'
                            },
                            {
                                label: '💳 Tạo vé hỗ trợ game',
                                description: 'Nhấp để bắt đầu quá trình tạo vé',
                                value: 'gameTicket'
                            }
                        )
                    );

                    const button = new ButtonBuilder()
                                .setCustomId('Ticket_Nut_Cancel') // cancel-Ticket
                                .setLabel('Bỏ tạo vé')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji(`<a:tickred51:1240060253240819843>`)

                    const RemoveDiscordChannelTicket = new ButtonBuilder()
                                .setCustomId('Ticket_Nut_RemoveDC') // removeDC-Ticket
                                .setLabel('Xóa tất cả các kênh vé discord')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji(`<a:_ew_no_:1253443732083179521>`)
                        
                    const RemoveGameChannelTicket = new ButtonBuilder()
                                .setCustomId('Ticket_Nut_RemoveG') // removeG-Ticket
                                .setLabel('Xóa tất cả các kênh vé game')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji(`<a:_ew_no_:1253443732083179521>`)

                    const RefeshDiscordTicket = new ButtonBuilder()
                                .setCustomId('Ticket_Nut_RefeshDC') // refeshDC-Ticket
                                .setLabel('Làm mới stt kênh vé discord')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(`<a:UK8zaNG86f:1250122827596697620>`)
                    
                    const RefeshGameTicket = new ButtonBuilder()
                                .setCustomId('Ticket_Nut_RefeshG') // refeshG-Ticket
                                .setLabel('Làm mới stt kênh vé game')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(`<a:UK8zaNG86f:1250122827596697620>`)

                    
                    const row = new ActionRowBuilder().addComponents(RemoveDiscordChannelTicket, RemoveGameChannelTicket);
                    const row1 = new ActionRowBuilder().addComponents(RefeshDiscordTicket, RefeshGameTicket, button);
    
                    const embed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle(`<a:brb1:1299603167180361800> Tạo một vé!`)
                        .setDescription(message + ' <a:TicketVang:1311389830344740895>')
                        .setFooter({ text: `MÁY CHỦ: ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });
    
                    await interaction.reply({ content: `🏷️ Tôi đã gửi tin nhắn vé của bạn dưới đây.`, ephemeral: true });                    
                    await interaction.channel.send({ embeds: [embed], components: [select, row, row1] });
                                   
                break;

                case 'remove':
                    if (!data) return await interaction.reply({ content: `⚠️ Có vẻ như bạn chưa cài đặt hệ thống vé`, ephemeral: true });
                    else {
                        await ticket.deleteOne({ Guild: interaction.guild.id});
                        await interaction.reply({ content: `📂 Tôi đã xóa danh mục vé của bạn.`, ephemeral: true });
                    }
    
                break;

                case 'setup':
                    if (data) return await interaction.reply({ content: `⚠️ Có vẻ như bạn đã đặt danh mục vé là <#${data.Category}> rồi.`, ephemeral: true });
                    else {
                        const category = options.getChannel('category');
                        await ticket.create({ 
                            Guild: interaction.guild.id,    
                            Category: category.id
                        });
    
                        await interaction.reply({ 
                            content: `📂 Tôi đã cài đặt danh mục **${category}**! theo yêu cầu của bạn. Sử dụng /ticket send để gửi vé tạo tin nhắn`, 
                            ephemeral: true 
                        });
                    }
            }
        } catch (error) {
            console.error(error);
            interaction.client.emit('interactionError', interaction.client, interaction, error);
            await interaction.reply({ content: `❌ Đã xảy ra lỗi trong khi thực thi lệnh. Vui lòng thử lại sau.`, ephemeral: true });
        }
    
    }
}