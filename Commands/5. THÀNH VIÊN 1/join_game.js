const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const joingameModel = require('../../schemas/joingameSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join_game')
        .setDescription('🔹 Quản lý danh sách tham gia cho các trò chơi.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('send')
                .setDescription('🔹 Tạo danh sách tham gia cho trò chơi.')
                .addStringOption(option =>
                    option.setName('game')
                        .setDescription('Chọn trò chơi bạn muốn tạo danh sách tham gia.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Liên minh huyền thoại', value: 'Liên minh huyền thoại' },
                            { name: 'Valheim', value: 'Valheim' },
                            { name: 'Pubg', value: 'Pubg' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('recall')
                .setDescription('🔹 Gọi lại danh sách tham gia của bạn.')
                .addStringOption(option =>
                    option.setName('game')
                        .setDescription('Chọn trò chơi bạn muốn gọi lại.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Liên minh huyền thoại', value: 'Liên minh huyền thoại' },
                            { name: 'Valheim', value: 'Valheim' },
                            { name: 'Pubg', value: 'Pubg' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('🔹 Xóa người dùng khỏi danh sách tham gia trò chơi.')
                .addStringOption(option =>
                    option.setName('game')
                        .setDescription('Chọn trò chơi.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Liên minh huyền thoại', value: 'Liên minh huyền thoại' },
                            { name: 'Valheim', value: 'Valheim' },
                            { name: 'Pubg', value: 'Pubg' }
                        )
                )
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID người dùng cần xóa.')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const gameChoice = interaction.options.getString('game');

        if (subCommand === 'send') {
            const guildId = interaction.guild.id;
            const guildName = interaction.guild.name;
            const userId = interaction.user.id;
            const displayName = interaction.member.displayName;

            // Kiểm tra nếu người dùng đã tạo danh sách cho trò chơi này
            const existingGame = await joingameModel.findOne({ guildId, userId, title: gameChoice });

            if (existingGame) {
                return interaction.reply({ content: `Bạn đã tạo danh sách cho trò chơi **${gameChoice}** rồi!`, ephemeral: true });
            }

            const currentTime = new Date();
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Ho_Chi_Minh'
            };
            const formattedTime = currentTime.toLocaleString('vi-VN', options);

            const newGame = new joingameModel({
                guildId,
                guildName,
                userId,
                displayName,
                title: gameChoice,
                Listjoin: [],
                time: formattedTime,
                totalUsers: 0,
                maxUsers: 20
            });

            await newGame.save();

            // Lấy số lượng người tham gia từ MongoDB
            const gameData = await joingameModel.findOne({ guildId, userId, title: gameChoice });

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Tạo danh sách đội ${gameChoice}`)
                .setDescription(`Nhấp vào nút bên dưới để tham gia đội của ${displayName}.\n<a:warning:1322596681329410162> **Danh sách này sẽ được lưu trong 1 năm**`)
                .addFields(
                    {
                        name: 'Số người đã đăng kí',
                        value: `${gameData.totalUsers}/${gameData.maxUsers}`,
                        inline: true
                    }
                )
                .setFooter({ text: `Tạo bởi ${displayName}` });

            // Chỉnh sửa ID của nút để bao gồm tên trò chơi
            const joinButton = new ButtonBuilder()
                .setCustomId(`join_game_${gameChoice}_${userId}`) // Gắn tên trò chơi vào ID
                .setLabel('Tham Gia')
                .setStyle(ButtonStyle.Primary);
            
            const listButton = new ButtonBuilder()
                .setCustomId(`list_${gameChoice}_${userId}`) // Gắn tên trò chơi vào ID
                .setLabel('Danh sách người tham gia')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(joinButton, listButton);

            const h = await interaction.reply({ embeds: [embed], components: [row] });

            // // Sau 1 phút, xóa danh sách Listjoin
            // setTimeout(async () => {
            //     await joingameModel.updateOne(
            //         { guildId, userId, title: gameChoice },
            //         { $set: { Listjoin: [], totalUsers: 0 } }
            //     );
            // }, 60000); // 60000ms = 1 phút
        } 
        
        else if (subCommand === 'recall') {

            const guildId = interaction.guild.id;
            const userId = interaction.user.id;
            const displayName = interaction.member.displayName;

            // Tìm danh sách tham gia của người dùng cho trò chơi được chọn
            const gameData = await joingameModel.findOne({ guildId, userId, title: gameChoice });

            if (!gameData) {
                return interaction.reply({ content: `Bạn chưa tạo danh sách tham gia cho trò chơi **${gameChoice}**!`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Tạo danh sách đội ${gameChoice}`)
                .setDescription(`Nhấp vào nút bên dưới để tham gia đội của ${displayName}.`)
                .addFields(
                    {
                        name: 'Số người đã đăng kí',
                        value: `${gameData.totalUsers}/${gameData.maxUsers}`,
                        inline: true
                    }
                )
                .setFooter({ text: `Tạo bởi ${gameData.displayName}` });

            const joinButton = new ButtonBuilder()
                .setCustomId(`join_game_${gameChoice}_${userId}`)
                .setLabel('Tham Gia')
                .setStyle(ButtonStyle.Primary);

            const listButton = new ButtonBuilder()
                .setCustomId(`list_${gameChoice}_${userId}`)
                .setLabel('Danh sách người tham gia')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(joinButton, listButton);

            await interaction.reply({ embeds: [embed], components: [row] });
        } 
        
        else if (subCommand === 'delete') {
            const guildId = interaction.guild.id;
            const userId = interaction.user.id;
            const targetUserId = interaction.options.getString('id');

            const gameData = await joingameModel.findOne({ guildId, userId, title: gameChoice });

            if (!gameData) {
                return interaction.reply({ content: `Không tìm thấy danh sách trò chơi **${gameChoice}** trong máy chủ này.`, ephemeral: true });
            }

            const userIndex = gameData.Listjoin.findIndex(user => user.userId === targetUserId);

            if (userIndex === -1) {
                return interaction.reply({ content: `Người dùng có ID **${targetUserId}** không có trong danh sách tham gia trò chơi **${gameChoice}**.`, ephemeral: true });
            }

            gameData.Listjoin.splice(userIndex, 1);
            gameData.totalUsers -= 1;
            await gameData.save();

            // Tạo Embed mới với số lượng cập nhật
            const updatedEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Tạo danh sách đội ${gameChoice}`)
                .setDescription(`Nhấp vào nút bên dưới để tham gia đội của ${gameData.displayName}.`)
                .addFields(
                    {
                        name: 'Số người đã đăng kí',
                        value: `${gameData.totalUsers}/${gameData.maxUsers}`,
                        inline: true
                    }
                )
                .setFooter({ text: `Tạo bởi ${gameData.displayName}` });

            const joinButton = new ButtonBuilder()
                .setCustomId(`join_game_${gameChoice}_${userId}`)
                .setLabel('Tham Gia')
                .setStyle(ButtonStyle.Primary);

            const listButton = new ButtonBuilder()
                .setCustomId(`list_${gameChoice}_${userId}`)
                .setLabel('Danh sách người tham gia')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(joinButton, listButton);

            return interaction.reply({ 
                content: `Đã xóa người dùng có ID **${targetUserId}** khỏi danh sách tham gia trò chơi **${gameChoice}**.`, 
                embeds: [updatedEmbed], 
                components: [row] 
            }); // ephemeral: true
        }

    }
};
