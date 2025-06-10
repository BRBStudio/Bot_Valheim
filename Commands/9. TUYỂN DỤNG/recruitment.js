/*
có thời gian sẽ điều chỉnh lại 1 số vấn đề:
- setup kênh Đơn-Ứng-Tuyển và Thông-Báo-Đơn-Ứng-Tuyển
- nếu đơn bị từ chối thì sẽ xóa thông tin trong moogoDB luôn, chỉ giữ lại dữ liệu đơn đã được duyệt
- tạo vai trò mà người dùng đăng kí nộp đơn và cấp quyền tương ứng
*/
const { SlashCommandBuilder } = require('discord.js');
const recruitmentSchema = require('../../schemas/recruitmentSchema.js');
const { Valheim, Discord } = require('../../ButtonPlace/ActionRowBuilder.js');
const { createChannelNotFoundEmbed, createDiscordEmbed, createValheimEmbed } = require('../../Embeds/embedsCreate.js');
const CommandStatus = require('../../schemas/Command_Status.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('recruitment')
            .setDescription('🔹 Nộp đơn ứng tuyển vai trò Valheim hoặc Discord cho BQT!')
            .addUserOption(option => option.setName('name').setDescription('Tên Discord của bạn').setRequired(true))
            .addNumberOption(option => option.setName('age').setDescription('Tuổi của bạn, viết bằng số').setRequired(true))
            .addStringOption(option => option.setName('experience').setDescription('Hãy cho chúng tôi biết nếu bạn đã có bất kỳ trải nghiệm nào như thế này trước đây!').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('Lý do bạn muốn ứng tuyển?').setRequired(true))
            .addStringOption(option => option.setName('valheim').setDescription('Từ chối đơn ứng tuyển của người dùng trong Valheim').setRequired(false).addChoices(
                { name: 'ADMIN', value: 'ADMIN' },
                { name: 'Hỗ trợ người chơi', value: 'Hỗ trợ người chơi' },
                { name: 'Kiểm tra lỗi và tính năng ', value: 'Kiểm tra lỗi và tính năng' },
                { name: 'Người chơi thuần túy', value: 'Người chơi thuần túy' },
            ))
            .addStringOption(option => option.setName('discord').setDescription('Từ chối đơn ứng tuyển của người dùng trong Discord').setRequired(false).addChoices(
                { name: 'QTV', value: 'QTV' },
                { name: 'Người điều hành', value: 'Người điều hành' },
                { name: 'Quản lý kênh', value: 'Quản lý kênh' },
                { name: 'Nhà phát triển', value: 'Nhà phát triển' },
            )),
        
    async execute(interaction, client) {

            // Kiểm tra trạng thái của lệnh
            const commandStatus = await CommandStatus.findOne({ command: '/recruitment' });

            // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
            if (commandStatus && commandStatus.status === 'off') {
                return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
            }
        
            // Kiểm tra option 'name' chỉ có thể được chọn bởi người gửi lệnh
            if (interaction.options.getUser('name').id !== interaction.user.id) {
                return await interaction.reply({ content: "Bạn chỉ có thể nộp đơn ứng tuyển cho chính bản thân bạn.", ephemeral: true });
            }
        
            const guild = interaction.guild;
            const nameChannel = 'Đơn-Ứng-Tuyển';
            const channel = guild.channels.cache.find(ch => ch.name.toLowerCase() === nameChannel.toLowerCase());
            const user = interaction.options.getUser('name') || interaction.user;
            const reason = interaction.options.getString('reason') || `không có lý do nào được đưa ra`;
            const age = interaction.options.getNumber('age');
            const valheimPosition = interaction.options.getString('valheim');
            const discordPosition = interaction.options.getString('discord');
            const experience = interaction.options.getString('experience') || `không có kinh nghiệm nào trong lĩnh vực này`;
            const icon = user.displayAvatarURL();
            const tag = user.displayName;
            const member = await interaction.guild.members.fetch(user.id);
            const botUser = client.user; // Nhận người dùng bot
            const botIcon = botUser.displayAvatarURL(); 
            const botTag = botUser.username; // Lấy tên người dùng của bot
                    
            // kiểm tra nếu người dùng chọn valheim và discord cùng lúc
            if (valheimPosition && discordPosition) {
                return await interaction.reply({ content: "Mỗi 1 lần nộp đơn chỉ được chọn duy nhất 1 trong 2, bạn không thể chọn Valheim và Discord cùng lúc được.", ephemeral: true });
            }
        
            // kiểm tra nếu người dùng không chọn valheim hoặc discord
            if (!valheimPosition && !discordPosition) {
                return await interaction.reply({ content: "Bạn phải chọn một trong hai là Valheim hoặc Discord để ứng tuyển.", ephemeral: true });
            }
        
            if (!channel) {

                const embed = createChannelNotFoundEmbed(nameChannel);
                            
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // điều kiện độ tuổi để đăng kí
            if (age <= 11) return await interaction.reply({ content: "Bạn phải ít nhất 12 tuổi để đăng ký", ephemeral: true });
            if (age >= 50) return await interaction.reply({ content: "Bạn đã quá già để đăng ký, nếu bạn vẫn muốn đăng kí ở tuổi đó thì hãy liên hệ trực tiếp với **CHỦ SỞ HỮU** máy chủ này.  ", ephemeral: true });
        
            let position = valheimPosition ? `Valheim: ${valheimPosition}` : `Discord: ${discordPosition}`;
        
            // Tính chênh lệch múi giờ và định dạng nó bằng tiếng Việt
            const calculateTimeDifference = (date) => {
                const now = new Date();
                const diffTime = Math.abs(now - date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
                if (diffDays === 1) return '1 ngày trước';
                if (diffDays < 30) return `${diffDays} ngày trước`;
                const diffMonths = Math.floor(diffDays / 30);
                return `${diffMonths} tháng trước`;
            };
        
            const joinedAtFormatted = calculateTimeDifference(member.joinedAt);
        
            // tin nhắn nộp đơn đăng kí được gửi trong channel
            const embedDiscord = createDiscordEmbed(tag, icon, botIcon, reason, age, position, experience, user, guild, joinedAtFormatted);
        
            const embedValheim = createValheimEmbed(tag, icon, botIcon, reason, age, position, experience, user, guild, joinedAtFormatted);

            await interaction.deferReply({ ephemeral: true }); // deferReply gửi một xác nhận tạm thời rằng bot đã được nhận tương tác và đang xử lý nó
            
        try {  

            if (discordPosition) {
                sentMessage = await channel.send({ embeds: [embedDiscord], components: [Discord] });
                await user.send(`Xin chào ${user}, đơn đăng ký Discord của bạn đã được gửi thành công đến đội ngũ máy chủ ***${guild.name}***. Chúc may mắn!`);
            } else if (valheimPosition) {
                sentMessage = await channel.send({ embeds: [embedValheim], components: [Valheim] });
                await user.send(`Xin chào ${user}, đơn đăng ký Valheim của bạn đã được gửi thành công đến đội ngũ máy chủ ***${guild.name}***. Chúc may mắn!`);
            }
                    
            // Lưu thông tin vào MongoDB
            const recruitmentData = new recruitmentSchema({
                userId: user.id,
                username: user.username,
                tag: user.tag,
                icon: icon,
                reason: reason,
                age: age,
                valheimPosition: valheimPosition,
                discordPosition: discordPosition,
                experience: experience,
                guildId: guild.id,
                guildName: guild.name,
                joinedAt: member.joinedAt,
                messageId: sentMessage.id
            });

            await recruitmentData.save();

            await interaction.deleteReply();
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "Đã xảy ra lỗi khi gửi hoặc lưu trữ đơn đăng ký của bạn. Vui lòng thử lại sau.", ephemeral: true });
        }
    }
}