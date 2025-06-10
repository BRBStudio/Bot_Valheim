const { ButtonBuilder, ActionRowBuilder, ChannelType, ButtonStyle } = require('discord.js');
const imageVotes = new Map();

// Nơi ActionRowBuilder với 1 nút trên 1 hàng dùng cho lệnh ping
// const button13 = new ActionRowBuilder()
//     .addComponents(
//         new ButtonBuilder()
//             .setCustomId('button13')
//             .setStyle(ButtonStyle.Primary)
//             .setEmoji('🔁')
//     );

// // dùng cho lệnh ping
// const button14 = new ActionRowBuilder()
//     .addComponents(
//         new ButtonBuilder()
//             .setCustomId('button14')
//             .setStyle(ButtonStyle.Danger)
//             .setDisabled(true)
//             .setEmoji('💨')
//     );

const Valheim = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('valheim_ok')
            .setLabel('Chấp nhận')
            .setStyle(ButtonStyle.Success),
            
        new ButtonBuilder()
            .setCustomId('valheim_no')
            .setLabel('Từ chối')
            .setStyle(ButtonStyle.Success)
    );

const Discord = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('discord_ok')
            .setLabel('Chấp nhận')
            .setStyle(ButtonStyle.Success),
            
        new ButtonBuilder()
            .setCustomId('discord_no')
            .setLabel('Từ chối')
            .setStyle(ButtonStyle.Success)
    );

// dùng cho lệnh message-secret
const view = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('view')
                .setLabel('Xem tin nhăn')
                .setEmoji('📩')
                .setStyle(ButtonStyle.Primary)
            )

// Hàm tạo rowHi với interaction dùng trong lệnh hi, và lệnh ngữ cảnh apps CHÀO THÀNH VIÊN
const rowHi = (interaction) => {
    const buttons = [];

    // Kiểm tra kênh có tên 'quy tắc' hoặc 'rules'
    const hasRulesChannel = interaction.guild.channels.cache.some(
        (channel) => channel.type === ChannelType.GuildText && (channel.name === 'quy_tắc' || channel.name === 'rules')
    );

    if (hasRulesChannel) {
        buttons.push(
            new ButtonBuilder()
                .setCustomId('hi_quytac')
                .setLabel(`Quy tắc ${interaction.guild.name}`)
                .setEmoji('<:9VayEYA0VU:1248778363892400148>') // <:hanyaCheer:1173363092353200158>
                .setStyle(ButtonStyle.Primary)
        );
    }

    // Kiểm tra kênh có tên 'đặc quyền' hoặc 'privileges'
    const hasPrivilegesChannel = interaction.guild.channels.cache.some(
        (channel) => channel.type === ChannelType.GuildText && (channel.name === 'đặc_quyền' || channel.name === 'privileges')
    );

    if (hasPrivilegesChannel) {
        buttons.push(
            new ButtonBuilder()
                .setCustomId('hi_dacquyen')
                .setLabel(`Đặc quyền ${interaction.guild.name}`)
                .setEmoji('<:arrowr1:1249618706066051096>')
                .setStyle(ButtonStyle.Primary)
        );
    }

    // Kiểm tra kênh có tên 'valheim' hoặc 'valheim-survival'
    const hasValheimChannel = interaction.guild.channels.cache.some(
        (channel) => channel.type === ChannelType.GuildText && (channel.name === 'valheim' || channel.name === 'valheim_survival')
    );

    if (hasValheimChannel) {
        buttons.push(
            new ButtonBuilder()
                .setCustomId('hi_quytacvh')
                .setLabel(`Quy tắc Valheim Survival`)
                .setEmoji('<:pinkstar:1249623499534893127>')
                .setStyle(ButtonStyle.Primary)
        );
    }

    // Nếu không có nút nào phù hợp, trả về null
    if (buttons.length === 0) {
        return null;
    }

    return new ActionRowBuilder().addComponents(buttons);
};


// Nơi ActionRowBuilder với nhiều nút trên 1 hàng, lệnh bot-commands
const row3 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('homeButton')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Trang chủ'),  // Thêm nhãn cho nút
        new ButtonBuilder()
            .setCustomId('reportButton')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Báo cáo'),
        new ButtonBuilder()
            .setCustomId('inviteButton')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Mời bot'),
        new ButtonBuilder()
            .setCustomId('deleteButton')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Xóa bỏ')
    );

// chỉ dùng cho việc bot được mời vào máy chủ
const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('deleteNew')
                            .setLabel(`🗑️`)
                            .setStyle(ButtonStyle.Danger)
                    );
            
const buttonDelete = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete')
                        .setLabel(`🗑️`)
                        .setStyle(ButtonStyle.Danger)
                );

// dùng cho lệnh brb
const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previouss_button")
        .setEmoji('<:K5ZDT5iOVH:1250106818483720264>')
        .setStyle("Primary"),
      new ButtonBuilder()
        .setCustomId("restartt_button")
        .setEmoji('<:VEMhiD3Uxw:1250105551015247933>')
        .setStyle("Primary"),
      new ButtonBuilder()
        .setCustomId("nextt_button")
        .setEmoji('<:kqWQGPzIsE:1250109668886315119>')
        .setStyle("Primary"),
    );

// Hàm tạo row1 với URL động trong rời máy chủ
const createRow1 = (inviteLink) => new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('Quay lại máy chủ')
            .setStyle(ButtonStyle.Link)
            .setURL(inviteLink)
    );


// Dùng cho lệnh vote-image
const voteButtons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('vote_very_bad')
            .setLabel(`⭐(${imageVotes.get('vote_very_bad') || 0} phiếu)`)
            .setEmoji('<:likebutton:1250095157076824128>')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('vote_bad')
            .setLabel(`⭐⭐(${imageVotes.get('vote_bad') || 0} phiếu)`)
            .setEmoji('<:likebutton:1250095157076824128>')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('vote_normal')
            .setLabel(`⭐⭐⭐(${imageVotes.get('vote_normal') || 0} phiếu)`)
            .setEmoji('<:likebutton:1250095157076824128>')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('vote_good')
            .setLabel(`⭐⭐⭐⭐(${imageVotes.get('vote_good') || 0} phiếu)`)
            .setEmoji('<:likebutton:1250095157076824128>')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('vote_very_good')
            .setLabel(`⭐⭐⭐⭐⭐(${imageVotes.get('vote_very_good') || 0} phiếu)`)
            .setEmoji('<:likebutton:1250095157076824128>')
            .setStyle(ButtonStyle.Primary),
    );



// nút vote ảnh
function handleVoteInteraction(interaction) {
    try {
        const userId = interaction.user.id;
        const voteType = interaction.customId;
        const imageAttachment = interaction.message.attachments.first();

        if (!imageAttachment) {
            console.error('Không tìm thấy hình ảnh đính kèm.');
            return;
        }

        const imageId = imageAttachment.url;

        // Kiểm tra nếu chưa có dữ liệu bình chọn cho ảnh này
        if (!imageVotes.has(imageId)) {
            imageVotes.set(imageId, new Map());

            // Tạo timeout để xóa dữ liệu sau 24 giờ
            setTimeout(() => {
                imageVotes.delete(imageId);
                console.log(`🗑️ Dữ liệu vote của ảnh ${imageId} đã bị xóa sau 24 giờ.`);
            }, 24 * 60 * 60 * 1000); // 24 giờ = 86.400.000 ms
        }

        // Kiểm tra nếu người dùng đã bình chọn cho ảnh này hay chưa
        if (imageVotes.get(imageId).has(userId)) {
            interaction.reply({ content: "Bạn đã bình chọn cho hình ảnh này.", ephemeral: true });
            return;
        }

        // Cập nhật số phiếu bầu cho nút này
        const voteCounts = imageVotes.get(imageId);
        const currentCount = voteCounts.get(voteType) || 0;
        voteCounts.set(voteType, currentCount + 1);

        // Update button labels with current vote counts
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vote_very_bad")
                .setLabel(`⭐(${voteCounts.get('vote_very_bad') || 0} phiếu)`)
                .setEmoji(`<:likebutton:1250095157076824128>`)
                .setStyle("Primary"),
            new ButtonBuilder()
                .setCustomId("vote_bad")
                .setLabel(`⭐⭐(${voteCounts.get('vote_bad') || 0} phiếu)`)
                .setEmoji(`<:likebutton:1250095157076824128>`)
                .setStyle("Primary"),
            new ButtonBuilder()
                .setCustomId("vote_normal")
                .setLabel(`⭐⭐⭐(${voteCounts.get('vote_normal') || 0} phiếu)`)
                .setEmoji(`<:likebutton:1250095157076824128>`)
                .setStyle("Primary"),
            new ButtonBuilder()
                .setCustomId("vote_good")
                .setLabel(`⭐⭐⭐⭐(${voteCounts.get('vote_good') || 0} phiếu)`)
                .setEmoji(`<:likebutton:1250095157076824128>`)
                .setStyle("Primary"),
            new ButtonBuilder()
                .setCustomId("vote_very_good")
                .setLabel(`⭐⭐⭐⭐⭐(${voteCounts.get('vote_very_good') || 0} phiếu)`)
                .setEmoji(`<:likebutton:1250095157076824128>`)
                .setStyle("Primary")
        );

        interaction.update({ components: [row] });

        // Update user's vote
        imageVotes.get(imageId).set(userId, voteType);

    } catch (error) {
        console.error('Lỗi xử lý tương tác bình chọn:', error);
    }
}

const RefreshPingButton = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('refreshping')
            .setLabel('Làm mới')
            .setStyle(ButtonStyle.Primary)
    );

// Hàm tạo row điều hướng trang cho invites_code
const rowInviteNavigation = (currentPage, totalPages) => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('prev_page')
            .setLabel('Trước')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
        new ButtonBuilder()
            .setCustomId('next_page')
            .setLabel('Tiếp theo')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1)
    );
};

// Nút sử dụng trong lệnh mailbox
const mailboxButtons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('sendButton')
            .setLabel('OK')
            .setEmoji('<:zzahhdinook:1249470387016695808>')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('cancelButton')
            .setLabel('Cancel')
            .setEmoji('<:2629notick:1249471458565165156>')
            .setStyle(ButtonStyle.Danger)
    );

const mailboxAdminButtons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('comple-mailbox')
            .setLabel('Đã xử lý xong')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('tc-mailbox')
            .setLabel('Từ chối đơn phản hồi')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('tks-mailbox')
            .setLabel('Tks đã vote Bot')
            .setStyle(ButtonStyle.Danger)
    );


// Xuất các nút và hành động
module.exports = {
    rowInviteNavigation,                    // dùng trong lệnh invites_code
    row3,                                   // lệnh bot-commands
    button,                                 // dùng cho server-join trong Events
    row,                                    // lệnh brb
    rowHi,                                  // dùng trong lệnh hi và biểu ngữ app chào thành viên
    createRow1,                             // dùng cho guildMemberRemove trong Events
    view,                                   // lệnh message-secret
    handleVoteInteraction,                  // lệnh vote-image hàm này dùng để xử lý các nút tại thư mục InteractionTypes
    voteButtons,                            // lệnh vote-image
    Valheim,                                // lệnh recruitment
    Discord,                                // lệnh recruitment
    RefreshPingButton,                      // lệnh ping-api.js
    buttonDelete,
    mailboxButtons,                         // lệnh mailbox.js
    mailboxAdminButtons                     // lệnh mailbox.js
};
