const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const crypto = require('crypto');
const User = require('../../schemas/premiumUserSchema');
const PremiumCode = require('../../schemas/premiumSchema');
const moment = require('moment');
const authorizedUsers = ['940104526285910046', '1215380543815024700', `933544716883079278`]; // '1215380543815024700'
const path = require('path');
const fs = require('fs');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hàm này được sử dụng để tạo mã cao cấp ngẫu nhiên. Nó sử dụng crypto.randomBytes để tạo một chuỗi hex ngẫu nhiên và chuyển đổi nó thành chữ hoa.
function generatePremiumCode(length = 16) {
    return crypto.randomBytes(length / 2).toString('hex').toUpperCase();
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription('🔹 Quản lý đăng ký trả phí')
        .addSubcommand(subcommand =>
            subcommand.setName('create')
                .setDescription('Tạo mã cao cấp')
                .addStringOption(option => 
                    option.setName('duration')
                        .setDescription('Thời hạn của mã cao cấp')
                        .setRequired(true)
                        .addChoices(
                            { name: '30 phút', value: 'minutely'},
                            { name: '1 tuần', value: 'weekly' },
                            { name: '1 tháng', value: 'monthly' },
                            { name: '1 năm', value: 'yearly' },
                            { name: 'vĩnh viễn', value: 'lifetime' }
                        ))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('renew')
                .setDescription('🔹 Gia hạn trạng thái cao cấp của người dùng dựa trên gói cuối cùng của họ')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Nhập mã gia hạn của bạn')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('view')
                .setDescription('🔹 Kiểm tra trạng thái cao cấp của bạn')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('redeem')
                .setDescription('🔹 Đổi mã cao cấp')
                .addStringOption(option => 
                    option.setName('code')
                        .setDescription('Mã cao cấp bạn muốn đổi')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('gift')
                .setDescription('🔹 Tặng gói đăng ký trả phí cho người dùng khác')
                .addUserOption(option => 
                    option.setName('recipient')
                        .setDescription('Người dùng nhận được quà tặng cao cấp')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('code')
                        .setDescription('Mã cao cấp để tặng quà')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('revoke')
                .setDescription('🔹 Thu hồi quyền Premium của người dùng')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Người dùng cần thu hồi quyền Premium')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('users')
                .setDescription('🔹 Liệt kê tất cả người dùng có trạng thái cao cấp')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('nt')
                .setDescription('🔹 Hướng dẫn nạp tiền đăng kí premium')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('bg')
                .setDescription('🔹 Bảng giá gói premium 2024')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'create':
                await handleCreate(interaction);
                break;
            case 'renew':
                await handleRenew(interaction);
                break;
            case 'gift':
                await handleGift(interaction);
                break;
            case 'view':
                await handleView(interaction);
                break;
            case 'redeem':
                await handleRedeem(interaction);
                break;
            case 'users':
                await handleUsers(interaction);
                break;
            case 'revoke':
                await handleRevoke(interaction);
                break;
            case 'nt':
                await NapTien(interaction);
                break;
            case 'bg':
                await BangGia(interaction);
                break;
        }
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Xử lý lệnh create: Hàm handleCreate được sử dụng để xử lý lệnh tạo mã cao cấp. Nó kiểm tra xem người dùng có được ủy quyền không và sau đó tạo mã cao cấp dựa trên thời hạn được chỉ định. Nó cũng xây dựng một embed để hiển thị thông tin mã mới và gửi nó dưới dạng tin nhắn ẩn.
async function handleCreate(interaction) {
    if (!authorizedUsers.includes(interaction.user.id)) {
        await interaction.reply({ content: 'Bạn không được phép tạo mã cao cấp. Hãy liên hệ với **Dev** để có mã premium.', ephemeral: true });
        return;
    }

    const duration = interaction.options.getString('duration');
    const premiumCodeValue = generatePremiumCode();

    let embedTitle, embedDescription, expirationTime;
    switch (duration) {
        case 'minutely':
            embedTitle = 'Mã tạm thời đã được tạo';
            expirationTime = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            break;
        case 'weekly':
            embedTitle = 'Mã một tuần đã được tạo';
            expirationTime = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
            break;
        case 'monthly':
            embedTitle = 'Mã hàng tháng đã được tạo';
            expirationTime = moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss');
            break;
        case 'yearly':
            embedTitle = 'Mã hàng năm đã được tạo';
            expirationTime = moment().add(1, 'years').format('YYYY-MM-DD HH:mm:ss');
            break;
        case 'lifetime':
            embedTitle = 'Mã vĩnh viễn đã được tạo';
            expirationTime = moment().format('YYYY-MM-DD HH:mm:ss');
            break;
        default:
            await interaction.reply({ content: 'Thời gian không hợp lệ.', ephemeral: true });
            return;
    }

    // Nếu không phải là mã vĩnh viễn, thêm mô tả về thời gian hết hiệu lực
    if (duration !== 'lifetime') {
        embedDescription = `**Mã:** \`\`\`${premiumCodeValue}\`\`\`\n**Thời gian có hiệu lực:** \n${getExpirationDescription(duration)}\n\n**Ngày giờ phát hành mã:** \n${moment().format('[vào lúc] HH:mm [ngày] DD/MM/YYYY')}\n\n**Ngày mã hết hạn:** \n${moment(expirationTime).format('[vào lúc] HH:mm [ngày] DD/MM/YYYY')}`;
    } else {
        embedDescription = `**Mã:** \`\`\`${premiumCodeValue}\`\`\`\n**Thời gian có hiệu lực:** \n${getExpirationDescription(duration)}\n\n**Ngày giờ phát hành mã:** \n${moment().format('[vào lúc] HH:mm [ngày] DD/MM/YYYY')}`;
    }

    try {
        const premiumCode = await PremiumCode.create({
            code: premiumCodeValue,
            isUsed: false,
            user: null,
            duration: duration,
            expirationTime: expirationTime // Lưu thông tin thời gian hết hiệu lực vào cơ sở dữ liệu
        });

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle(embedTitle)
            .setDescription(embedDescription)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        
        // Trả về thông tin mã và thời gian hết hiệu lực
        return {
            code: premiumCodeValue,
            expirationTime: expirationTime,
            duration: duration
        };
        
    } catch (error) {
        console.error('Lỗi tạo mã cao cấp:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi khi tạo mã cao cấp. Vui lòng thử lại sau.', ephemeral: true });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hàm getExpirationDescription: Hàm này được sử dụng để lấy mô tả về thời gian hết hiệu lực dựa trên loại mã cao cấp
function getExpirationDescription(duration) {
    switch (duration) {
        case 'minutely':
            return '30 phút';
        case 'weekly':
            return '7 ngày';
        case 'monthly':
            return '1 tháng';
        case 'yearly':
            return '1 năm';
        case 'lifetime':
            return 'vĩnh viễn';
        default:
            return '';
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Xử lý lệnh renew: Hàm handleRenew được sử dụng để gia hạn trạng thái cao cấp của một người dùng dựa trên gói cuối cùng của họ. Nó kiểm tra quyền của người dùng và sau đó cập nhật thông tin về thời gian hết hiệu lực trong cơ sở dữ liệu.
async function handleRenew(interaction) {
    // if (!authorizedUsers.includes(interaction.user.id)) {
    //     await interaction.reply({ content: 'Chỉ người dùng được ủy quyền mới có thể gia hạn gói cao cấp.', ephemeral: true });
    //     return;
    // }

    // const userToRenew = interaction.options.getUser('user', true);
    // try {
    //     const userDocument = await User.findOne({ discordId: userToRenew.id });

    //     if (!userDocument || !userDocument.isPremium) {
    //         await interaction.reply({ content: `${userToRenew.username} không có gói trả phí đang hoạt động để gia hạn.`, ephemeral: true });
    //         return;
    //     }

    //     const now = new Date();
    //     let newExpirationDate;

    //     switch (userDocument.planType) {
    //         case 'minutely':
    //             newExpirationDate = moment(now).add(1, 'minutes').toDate();
    //             break;
    //         case 'weekly':
    //             newExpirationDate = moment(now).add(1, 'weeks').toDate();
    //             break;
    //         case 'monthly':
    //             newExpirationDate = moment(now).add(1, 'months').toDate();
    //             break;
    //         case 'yearly':
    //             newExpirationDate = moment(now).add(1, 'years').toDate();
    //             break;
    //         case 'lifetime':
    //             await interaction.reply({ content: `${userToRenew.username} có kế hoạch trọn đời và không cần gia hạn.`, ephemeral: true });
    //             return;
    //         default:
    //             await interaction.reply({ content: 'Loại gói không xác định hoặc không được hỗ trợ để gia hạn.', ephemeral: true });
    //             return;
    //     }

    //     userDocument.premiumUntil = newExpirationDate;
    //     await userDocument.save();

    //     await interaction.reply({
    //         content: `${userToRenew.username}'s gói trả phí đã được gia hạn thành công cho đến khi ${moment(newExpirationDate).format('DD/MM/YY')}.`,
    //         ephemeral: true
    //     });
    // } catch (error) {
    //     console.error('Lỗi khi gia hạn gói trả phí:', error);
    //     await interaction.reply({ content: 'Đã xảy ra lỗi khi gia hạn gói cao cấp. Vui lòng thử lại sau.', ephemeral: true });
    // }
    const userToRenew = interaction.user; // Người dùng thực hiện lệnh
    const renewalCode = interaction.options.getString('code', true);

    try {
        const userDocument = await User.findOne({ discordId: userToRenew.id });

        // Kiểm tra xem người dùng có gói premium không
        if (!userDocument || !userDocument.isPremium) {
            await interaction.reply({ content: `${userToRenew.displayName} không có gói trả phí đang hoạt động để gia hạn.`, ephemeral: true });
            return;
        }

        // Kiểm tra xem mã gia hạn có tồn tại và chưa được sử dụng
        const premiumCodeDocument = await PremiumCode.findOne({ code: renewalCode, isUsed: false });

        if (!premiumCodeDocument) {
            await interaction.reply({ content: 'Mã gia hạn không xác định hoặc không được hỗ trợ.', ephemeral: true });
            return;
        }

        // Kiểm tra mã hiện tại của người dùng
        const currentExpirationDate = userDocument.premiumUntil || new Date();
        const now = new Date();
        let remainingTime = 0;

        if (currentExpirationDate > now) {
            remainingTime = moment(currentExpirationDate).diff(now);
        }

        // Kiểm tra thời gian gia hạn dựa trên loại mã
        let additionalTime;

        switch (premiumCodeDocument.duration) {
            case 'minutely':
                additionalTime = moment.duration(30, 'minutes').asMilliseconds();
                break;
            case 'weekly':
                additionalTime = moment.duration(7, 'days').asMilliseconds();
                break;
            case 'monthly':
                additionalTime = moment.duration(1, 'months').asMilliseconds();
                break;
            case 'yearly':
                additionalTime = moment.duration(1, 'years').asMilliseconds();
                break;
            case 'lifetime':
                // Đối với mã trọn đời, đặt ngày hết hạn rất xa trong tương lai
                additionalTime = moment.duration(100, 'years').asMilliseconds();
                break;
            default:
                await interaction.reply({ content: 'Mã gia hạn không xác định hoặc không được hỗ trợ.', ephemeral: true });
                return;
        }

        // Cộng dồn thời gian mã
        const newExpirationDate = moment(now).add(remainingTime + additionalTime, 'milliseconds').toDate();
        
        userDocument.premiumUntil = newExpirationDate;
        await userDocument.save();

        // Đánh dấu mã gia hạn là đã sử dụng
        premiumCodeDocument.isUsed = true;
        await premiumCodeDocument.save();

        await interaction.reply({
            content: `Gói trả phí của ${userToRenew.displayName} đã được gia hạn thành công cho đến ${moment(newExpirationDate).format('[lúc] HH:mm [ngày] DD/MM/YYYY')}.`,
            ephemeral: true
        }); // Ngày giờ phát hành mã:** \n${moment().format('[vào lúc] HH:mm [ngày] DD/MM/YYYY')}\n\n**Ngày mã hết hạn:** \n${moment(expirationTime).format('[vào lúc] HH:mm [ngày] DD/MM/YYYY')}
    } catch (error) {
        console.error('Lỗi khi gia hạn gói trả phí:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi khi gia hạn gói cao cấp. Vui lòng thử lại sau.', ephemeral: true });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Xử lý lệnh view: Hàm handleView được sử dụng để hiển thị thông tin về trạng thái cao cấp của người dùng, bao gồm thời gian bắt đầu và kết thúc của gói cao cấp.
async function handleView(interaction) {
    const discordId = interaction.user.id;
    try {
        const user = await User.findOne({ discordId: discordId });

        if (user && user.isPremium) {
            const now = new Date();
            if (user.premiumUntil && now > user.premiumUntil) {
                // Premium đã hết hạn
                user.isPremium = false;
                user.premiumSince = null;
                user.premiumUntil = null;
                await user.save();
                await interaction.reply({ content: 'Gói Premium của bạn đã hết hạn.', ephemeral: true });
            } else {
                // Still premium
                let premiumSince = 'Không có sẵn';
                let premiumUntil = 'vĩnh viễn';
                
                if (user.premiumSince) {
                    premiumSince = moment(user.premiumSince).format('[vào lúc] HH:mm [ngày] DD/MM/YY');
                }

                if (user.premiumUntil) {
                    premiumUntil = moment(user.premiumUntil).format('[vào lúc] HH:mm [ngày] DD/MM/YY');
                }

                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle(`${interaction.user.displayName} Trạng thái cao cấp`)
                    .setDescription('Chi tiết thành viên cao cấp của bạn như sau:')
                    .addFields(
                        { name: 'Thời gian premium kích hoạt ', value: premiumSince, inline: false },
                        { name: 'Thời gian premium hết hạn', value: premiumUntil, inline: false },
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: false });
            }
        } else {
            await interaction.reply({ content: 'Bạn hiện không có tư cách thành viên Premium đang hoạt động.', ephemeral: true });
        }
    } catch (error) {
        console.error('Lỗi khi tìm nạp trạng thái cao cấp:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi khi kiểm tra trạng thái cao cấp của bạn. Vui lòng thử lại sau.', ephemeral: true });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Xử lý lệnh redeem: Hàm handleRedeem được sử dụng để đổi mã cao cấp. Nó kiểm tra xem mã có tồn tại và chưa được sử dụng không, sau đó cập nhật thông tin người dùng và mã trong cơ sở dữ liệu.

async function handleRedeem(interaction) {
    const code = interaction.options.getString('code', true);

    try {
        const premiumCode = await PremiumCode.findOne({ code: code, isUsed: false });

        if (!premiumCode) {
            await interaction.reply({ content: 'Mã cao cấp không hợp lệ hoặc đã được sử dụng.', ephemeral: true });
            return;
        }

        const now = new Date();
        let newExpirationDate;

        if (premiumCode.duration === 'lifetime') {
            newExpirationDate = null; // Không có ngày hết hạn cho mã vĩnh viễn
        } else {
            switch (premiumCode.duration) {
                case 'minutely':
                    newExpirationDate = moment(now).add(30, 'minutes').toDate();
                    break;
                case 'weekly':
                    newExpirationDate = moment(now).add(7, 'days').toDate();
                    break;
                case 'monthly':
                    newExpirationDate = moment(now).add(1, 'months').toDate();
                    break;
                case 'yearly':
                    newExpirationDate = moment(now).add(1, 'years').toDate();
                    break;
                default:
                    await interaction.reply({ content: 'Đã xảy ra lỗi trong quá trình đổi mã cao cấp. Vui lòng thử lại sau.', ephemeral: true });
                    return;
            }
        }

        const userDocument = await User.findOneAndUpdate(
            { discordId: interaction.user.id },
            {
                isPremium: true,
                planType: premiumCode.duration,
                premiumSince: now,
                premiumUntil: newExpirationDate,
            },
            { upsert: true, new: true }
        );

        premiumCode.isUsed = true;
        premiumCode.user = interaction.user.id;
        await premiumCode.save();

        const embedDescription = premiumCode.duration === 'lifetime'
            ? `**Mã:** \`\`\`${code}\`\`\`\n**Thời gian có hiệu lực:**\nVĩnh viễn\n\n**Ngày giờ kích hoạt mã**:\nvào lúc ${moment(now).format('HH:mm:ss [ngày] DD/MM/YYYY')}`
            : `**Mã:** \`\`\`${code}\`\`\`\n**Thời gian có hiệu lực:**\n${getExpirationDescription(premiumCode.duration)}\n\n**Ngày giờ kích hoạt mã**:\nvào lúc ${moment(now).format('HH:mm:ss [ngày] DD/MM/YYYY')} \n\n**Ngày giờ hết hạn:**\nvào lúc ${moment(newExpirationDate).format('HH:mm:ss [ngày] DD/MM/YYYY')}`;

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Mã cao cấp đã được đổi thành công!')
            .setDescription(embedDescription)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (error) {
        console.error('Lỗi khi đổi mã cao cấp:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi trong quá trình đổi mã cao cấp. Vui lòng thử lại sau.', ephemeral: true });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// xử ký sự kiện handleGift: hàm handleGift được sử dụng khi người dùng muốn tặng một gói đăng ký trả phí cho người khác trong ứng dụng discord
async function handleGift(interaction) {
    const recipientUser = interaction.options.getUser('recipient', true);
    const premiumCodeValue = interaction.options.getString('code').toUpperCase();

    try {
        const premiumCode = await PremiumCode.findOne({ code: premiumCodeValue });

        if (!premiumCode) {
            await interaction.reply({ content: 'Mã cao cấp được cung cấp không tồn tại.', ephemeral: true });
            return;
        }

        if (premiumCode.isUsed) {
            await interaction.reply({ content: 'Mã cao cấp được cung cấp đã được sử dụng.', ephemeral: true });
            return;
        }

        const recipient = await interaction.client.users.fetch(recipientUser.id);
        const expirationTime = premiumCode.duration === 'lifetime' ? 'vĩnh viễn' : moment().add(1, premiumCode.duration).format('HH:mm [ngày] DD/MM/YYYY');
        const durationDescription = getExpirationDescription(premiumCode.duration);

        // Kiểm tra nếu là mã vĩnh viễn thì không hiển thị ngày hết hạn
        const fields = [];

        // Thêm trường "Ngày giờ phát hành mã"
        fields.push({ name: 'Ngày giờ phát hành mã', value: moment().format('[vào lúc] HH:mm [ngày] DD/MM/YYYY'), inline: false });

        // Nếu không phải là mã vĩnh viễn thì hiển thị ngày hết hạn
        if (premiumCode.duration !== 'lifetime') {
            const expirationDate = moment().add(1, premiumCode.duration);
            const expirationFormatted = expirationDate.format('HH:mm [ngày] DD/MM/YYYY');
            fields.push({ name: 'Ngày mã hết hạn', value: expirationFormatted, inline: false });
        }

        // Thêm trường Premium Level sau các trường khác
        fields.push({ name: 'Premium Level', value: durationDescription, inline: true });

        const giftEmbed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('🎁 Bạn đã nhận được mã đăng ký trả phí!')
            .setDescription(`Xin chúc mừng, bạn đã được tặng một gói đăng ký trả phí từ người dùng ${interaction.user.displayName} với mã sau: \`\`\`${premiumCodeValue}\`\`\``)
            .addFields(
                { name: 'Thời gian có hiệu lực', value: durationDescription, inline: true },
                { name: 'Ngày giờ phát hành mã', value: moment(premiumCode.createdAt).format('[vào lúc] HH:mm [ngày] DD/MM/YYYY'), inline: false },
                { name: 'Ngày mã hết hạn', value: expirationTime, inline: false }
            )
            .setTimestamp();


        await recipient.send({ embeds: [giftEmbed] }).catch(error => console.log(`Không thể gửi DM cho người dùng ${recipientUser.displayName}:`, error));

        await interaction.reply({
            content: `Bạn đã tặng thành công gói đăng ký trả phí cho ${recipientUser.displayName}. Họ đã được thông báo.`,
            ephemeral: true
        });

    } catch (error) {
        console.error('Lỗi khi xử lý quà tặng cao cấp:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi khi xử lý quà tặng cao cấp. Vui lòng thử lại sau.', ephemeral: true });
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Xử lý lệnh revoke: Hàm handleRevoke được sử dụng để thu hồi quyền Premium của một người dùng. Nó kiểm tra quyền của người dùng và sau đó cập nhật thông tin trong cơ sở dữ liệu.
async function handleRevoke(interaction) {
    if (!authorizedUsers.includes(interaction.user.id)) {
        await interaction.reply({ content: 'Chỉ người dùng được ủy quyền mới có thể thu hồi quyền Premium của người dùng.', ephemeral: true });
        return;
    }

    const userToRevoke = interaction.options.getUser('user', true);
    try {
        const userDocument = await User.findOne({ discordId: userToRevoke.id });

        if (!userDocument || !userDocument.isPremium) {
            await interaction.reply({ content: `${userToRevoke.displayName} không có gói trả phí đang hoạt động để thu hồi.`, ephemeral: true });
            return;
        }

        userDocument.isPremium = false;
        userDocument.premiumSince = null;
        userDocument.premiumUntil = null;
        await userDocument.save();

        await interaction.reply({
            content: `${userToRevoke.displayName} quyền Premium đã được thu hồi thành công.`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Lỗi khi thu hồi quyền Premium:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi khi thu hồi quyền Premium của người dùng. Vui lòng thử lại sau.', ephemeral: true });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Xử lý lệnh users: Hàm handleUsers được sử dụng để liệt kê tất cả người dùng có trạng thái cao cấp. Nó truy vấn cơ sở dữ liệu để lấy thông tin về những người dùng này và tạo một embed để hiển thị danh sách.
// async function handleUsers(interaction) {
//     try {
//         const premiumUsers = await User.find({ isPremium: true }).sort({ premiumSince: -1 });

//         if (premiumUsers.length === 0) {
//             await interaction.reply({ content: 'Hiện tại không có người dùng nào có đăng ký Premium đang hoạt động.', ephemeral: true });
//             return;
//         }

//         let usersList = premiumUsers.map((user, index) => {
//             const premiumSinceDate = user.premiumSince ? moment(user.premiumSince).format('[vào lúc] HH:mm [ngày] DD/MM/YY') : 'không xác định';
//             const premiumUntilDate = user.premiumUntil ? moment(user.premiumUntil).format('[vào lúc] HH:mm [ngày] DD/MM/YY') : 'vĩnh viễn';
//             return `${index + 1}. <@${user.discordId}>\n> ***Thời gian Premium kích hoạt:***\n⏰ | __${premiumSinceDate}__\n> ***Thời gian Premium hết hạn:***\n⏰ | __${premiumUntilDate}__`;
//         }).join('\n\n');

//         if (usersList.length > 2000) {
//             usersList = usersList.substring(0, 1997) + '...';
//         }

//         const embed = new EmbedBuilder()
//             .setColor('#00FFFF')
//             .setTitle('Danh sách người dùng cao cấp')
//             .setDescription(usersList)
//             .setTimestamp();

//         await interaction.reply({ embeds: [embed] });
//     } catch (error) {
//         console.error('Lỗi truy xuất người dùng cao cấp:', error);
//         await interaction.reply({ content: 'Đã xảy ra lỗi khi tìm nạp danh sách người dùng cao cấp. Vui lòng thử lại sau.', ephemeral: true });
//     }
// }
async function handleUsers(interaction) {
    try {
        const currentTimestamp = new Date(); // Thời điểm hiện tại

        // Lấy danh sách người dùng Premium đã sắp xếp theo thời gian Premium từ mới đến cũ
        const premiumUsers = await User.find({ isPremium: true }).sort({ premiumSince: -1 });

        if (premiumUsers.length === 0) {
            await interaction.reply({ content: 'Hiện tại không có người dùng nào có đăng ký Premium đang hoạt động.', ephemeral: true });
            return;
        }

        let usersList = '';
        premiumUsers.forEach((user, index) => {
            const premiumSinceDate = user.premiumSince ? moment(user.premiumSince).format('[vào lúc] HH:mm [ngày] DD/MM/YY') : 'không xác định';
            const premiumUntilDate = user.premiumUntil ? moment(user.premiumUntil).format('[vào lúc] HH:mm [ngày] DD/MM/YY') : 'vĩnh viễn';

            // Kiểm tra nếu ngày hết hạn Premium đã qua thì không thêm vào danh sách
            if (user.premiumUntil && user.premiumUntil < currentTimestamp) {
                return; // Bỏ qua người dùng này
            }

            // Thêm thông tin người dùng vào danh sách
            usersList += `${index + 1}. <@${user.discordId}>\n> ***Thời gian Premium kích hoạt:***\n⏰ | __${premiumSinceDate}__\n> ***Thời gian Premium hết hạn:***\n⏰ | __${premiumUntilDate}__\n\n`;
        });

        if (usersList === '') {
            await interaction.reply({ content: 'Hiện tại không có người dùng nào có đăng ký Premium đang hoạt động.', ephemeral: true });
            return;
        }

        // Kiểm tra chiều dài danh sách trước khi tạo embed
        if (usersList.length > 2000) {
            usersList = usersList.substring(0, 1997) + '...';
        }

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Danh sách người dùng cao cấp')
            .setDescription(usersList.trim()) // Xóa khoảng trắng thừa ở đầu và cuối
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Lỗi truy xuất người dùng cao cấp:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi khi tìm nạp danh sách người dùng cao cấp. Vui lòng thử lại sau.', ephemeral: true });
    }
}


async function NapTien(interaction) {
    try {

        // Đường dẫn đến hình ảnh nền trong thư mục 'anh'
        const backgroundPath = path.join(__dirname, '../../anh/BIDV_BRB.jpg');

        // Kiểm tra xem tệp có tồn tại không
        if (!fs.existsSync(backgroundPath)) {
            console.error('Thư mục ảnh không tồn tại:', backgroundPath);
            return await interaction.reply({ content: '👑 Đã xảy ra lỗi khi tạo bảng xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
        }

        // Tạo tệp đính kèm từ hình ảnh
        const attachment = new AttachmentBuilder(backgroundPath, { name: 'BIDV_BRB.jpg' });
        
        // Tạo tin nhắn dạng embed với hướng dẫn nạp tiền
        const embed = new EmbedBuilder()
            .setColor('#00FF00') // Màu sắc của embed
            .setTitle('Hướng Dẫn Nạp Tiền')
            .setDescription('Hãy nạp theo các bước sau')
            .addFields(
                    { 
                        name: 'Bước 1',
                        value: 'Quét mã QR' 
                    },

                    { 
                        name: 'Bước 2', 
                        value: 
                            'Trước khi chuyển tiền thì ghi nội dung chuyển tiền là: Premium (gói bạn muốn nạp)-id discord-máy chủ discord mà bạn sẽ có mặt.\n' +
                            'Ví dụ: bạn thường xuyên có mặt tại máy chủ **BRB** và id của bạn là 5658989456 (bạn cũng có thể dùng lệnh id) \`\`\`/id\`\`\` để lấy id của bạn ' +
                            'và bạn muốn mua gói Premium 1 tháng, vậy thì bạn có thể viết nội dung trong app chuyển tiền của bạn là:' +
                            '\`\`\`Premium(1 tháng)-5658989456-BRB\`\`\`Chúng tôi sẽ liên hệ với bạn ngay trong ngày nên bạn sẽ không cần lo về chuyện chúng tôi chuyển nhầm mã\n' +
                            '<a:warning:1304452819033526302> **LƯU Ý:** Để cho minh bach và rõ ràng thì bạn nên chụp lại màn hình khi bạn chuyển khoản thành công vì đôi khi ngân hàng ' +
                            'bị lỗi hoặc nghẽn mạng... dù bất kể là lý do gì thì việc chụp lại màn hình khi bạn chuyển khoản thành công là rất cần thiết. Bạn cũng có thể liên hệ trực ' +
                            'tiếp với tôi tại máy chủ của tôi \`\`\`https://discord.gg/s2ec8Y2uPa\`\`\` hoặc qua zalo 0818.25.04.88 (chỉ nhận tin nhắn, không nhận cuộc gọi)'
                    },

                    { 
                        name: 'Bước 3',
                        value: 'Kiểm tra và xem kĩ lại thông tin của bạn và mã QR bên dưới có đúng không' 
                    },
                )
            .setImage(`attachment://BIDV_BRB.jpg`)
            .setFooter({ text: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!' });

        // Gửi tin nhắn embed
        await interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true });

    } catch (error) {
        console.error('Lỗi khi xử lý lệnh nạp tiền:', error);
        await interaction.reply({ content: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.', ephemeral: true });
    }
}

async function BangGia(interaction) {
    try {

        // Đường dẫn đến hình ảnh nền trong thư mục 'anh'
        const backgroundPath1 = path.join(__dirname, '../../anh/brb_studio.jpg');

        // Kiểm tra xem tệp có tồn tại không
        if (!fs.existsSync(backgroundPath1)) {
            console.error('Thư mục ảnh không tồn tại:', backgroundPath1);
            return await interaction.reply({ content: '👑 Đã xảy ra lỗi khi tạo bảng xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
        }

        // Gọi deferReply() để chờ phản hồi
        await interaction.deferReply({ ephemeral: true });

        // Tạo tệp đính kèm từ hình ảnh
        const attachment1 = new AttachmentBuilder(backgroundPath1, { name: 'brb_studio.jpg' });
        
        // Tạo tin nhắn dạng embed với hướng dẫn nạp tiền
        const embed1 = new EmbedBuilder()
            .setColor('#00FFFF') // Màu sắc của embed
            .setTitle('BẢNG GIÁ PREMIUM 2024')
            .setImage(`attachment://brb_studio.jpg`)
            .setFooter({ text: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!' });

        // Gửi tin nhắn embed
        await interaction.editReply({ embeds: [embed1], files: [attachment1], ephemeral: true });

    } catch (error) {
        console.error('Lỗi khi xử lý lệnh nạp tiền:', error);
        await interaction.editReply({ content: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.', ephemeral: true });
    }
}