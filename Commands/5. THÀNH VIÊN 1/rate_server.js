const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const revSchema = require('../../schemas/reviewSchema');
const config = require(`../../config`)
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rate_server')
    .setDescription('🔹 Lệnh đánh giá máy chủ')
    .addSubcommand(command => command.setName('setup').setDescription('🔹 Thiết lập hệ thống đánh giá').addChannelOption(option => option.setName('channel').setDescription('Kênh nơi các bài đánh giá sẽ được đăng').setRequired(true)))
    .addSubcommand(command => command.setName('disable').setDescription('🔹 Vô hiệu hóa hệ thống đánh giá'))
    .addSubcommand(command => command.setName('rating').setDescription('🔹 Để lại đánh giá cho máy chủ của chúng tôi').addStringOption(option => option.setName('stars').setDescription('Số sao bắt đầu bạn để lại cho chúng tôi').addChoices(
        { name: "⭐", value: "⭐" },
        { name: "⭐⭐", value: "⭐⭐" },
        { name: "⭐⭐⭐", value: "⭐⭐⭐" },
        { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
        { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
    ).setRequired(true)).addStringOption(option => option.setName('description').setDescription('Để lại lời nhận xét của bạn').setRequired(false))),

    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/rate_server' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }
        
        const sub = interaction.options.getSubcommand();
        const data = await revSchema.findOne({ Guild: interaction.guild.id});

        switch(sub) {
            case 'setup':

                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
                    return await interaction.reply ({ 
                            content: `⛔ | Bạn không có quyền thiết lập hệ thống đánh giá`, 
                            ephemeral: true 
                        })

                if(data) return await interaction.reply({ content: `❌ | Bạn đã thiết lập hệ thống!`, ephemeral: true })
                else {
                    const channel = interaction.options.getChannel('channel')

                    await revSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id
                    });

                    await interaction.reply({ content: `✅ | Hệ thống đánh giá đã được thiết lập`, ephemeral: true})
                }
            break;

            case 'disable':
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
                    return await interaction.reply ({ 
                            content: `⛔ | Bạn không có quyền thiết lập hệ thống đánh giá`, 
                            ephemeral: true 
                        })

                if(!data) return await interaction.reply({ content: `❌ | Bạn đã thiết lập hệ thống!`, ephemeral: true})

                else {
                    await revSchema.deleteOne({ Guild: interaction.guild.id });
                    await interaction.reply({ content: `✅ | Hệ thống đánh giá đã bị vô hiệu hóa.`, ephemeral: true });
                }
                
            break;

            case 'rating':
                
                if (!data) return await interaction.reply({ content: `❌ | Hệ thống đánh giá chưa được thiết lập! `, ephemeral: true });
                else if (data) {

                    const channelID = data.Channel;
                    const stars = interaction.options.getString("stars");
                    const description = interaction.options.getString("description")|| 'Không có lời nhận xét.';;
                    const channel = interaction.guild.channels.cache.get(channelID);
                    const member = interaction.guild.members.cache.get(interaction.user.id)?.displayName || interaction.user.username;


                    const embed1 = new EmbedBuilder()
                    .setColor(config.embedBlurple)
                    .setTitle(`ĐÁNH GIÁ TỪ ${member.toUpperCase()}`)
                    .addFields(
                        { name: "__Đánh giá của người dùng:__", value: `${stars}`, inline: true },
                        { name: "__Nhận xét của người dùng:__", value: `${description}\n` },
                        )
                    .setTimestamp()
                    .setImage(`https://i.imgur.com/4DN7BGe.gif`)
    
                    const embed2 = new EmbedBuilder()
                    .setColor(config.embedBlurple)
                    .setDescription(`Đánh giá của bạn đã được gửi thành công ${channel}`)
                    .setTimestamp()
                    .setImage(`https://i.imgur.com/4DN7BGe.gif`)
    
                    channel.send({ embeds: [embed1] });
                    
                    return interaction.reply({ embeds: [embed2], ephemeral: true });

                }
        }
    }
}

