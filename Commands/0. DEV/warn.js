// const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
// const warningSchema = require("../../schemas/warningSchema");
// const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
// const config = require('../../config');

// function generateRandomCode(length) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Tất cả các ký tự có thể có
//     let code = '';
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length); // Chọn một chỉ số ngẫu nhiên
//         code += characters[randomIndex]; // Thêm ký tự ngẫu nhiên vào mã
//     }
//     return code; // Trả về mã ngẫu nhiên
// }
 
// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("warn")
//     .setDescription("Lệnh cảnh báo")
//     .addSubcommand(c => c
//         .setName("create")
//         .setDescription("Tạo cảnh báo")
//         .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn cảnh báo").setRequired(true))
//         .addStringOption(o => o.setName("reason").setDescription("lý do cảnh báo").setRequired(true))
//     )
//     .addSubcommand(c => c
//         .setName("list")
//         .setDescription("Nhận danh sách cảnh báo người dùng")
//         .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn nhận cảnh báo").setRequired(false))
//     )
//     .addSubcommand(c => c
//         .setName("info")
//         .setDescription("Nhận thông tin về cảnh báo")
//         .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn nhận thông tin cảnh báo").setRequired(true))
//         .addStringOption(o => o.setName("warn-id").setDescription("id cảnh báo").setRequired(true))
//     )
//     .addSubcommand(c => c
//         .setName("edit")
//         .setDescription("Chỉnh sửa cảnh báo")
//         .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn nhận thông tin cảnh báo").setRequired(true))
//         .addStringOption(o => o.setName("warn-id").setDescription("id cảnh báo").setRequired(true))
//         .addStringOption(o => o.setName("reason").setDescription("lý do cảnh báo").setRequired(true))
//     )
//     .addSubcommand(c => c
//         .setName("clear")
//         .setDescription("Xóa tất cả cảnh báo của người dùng")
//         .addUserOption(o => o.setName("user").setDescription("the user you want to get the warn info").setRequired(true))
//     )
//     .addSubcommand(c => c
//         .setName("remove")
//         .setDescription("Xóa cảnh báo người dùng")
//         .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn nhận thông tin cảnh báo").setRequired(true))
//         .addStringOption(o => o.setName("warn-id").setDescription("id cảnh báo").setRequired(true))
//     ),
 
//     async execute (interaction, client) {
//         const { guild, member, user, options } = interaction;
 
//         // if (!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
//         //      return await interaction.reply({
//         //         content: "Bạn không có quyền làm điều này!",
//         //         ephemeral: true
//         //     });
//         // }

//         const permissionEmbed = new EmbedBuilder()
//             .setDescription("`❌` Bạn không có quyền sử dụng lệnh này!")
//             .setColor(config.embedGreen)
//             .setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });

//         if (!checkPermissions(interaction)) {
//             return interaction.reply({ embeds: [permissionEmbed] });
//         }
 
//         const subcommand = options.getSubcommand();
 
//         switch (subcommand) {
//             case "create":
//                 const t = options.getUser("user").id;
//                 const r = options.getString("reason");
//                 await addWarn(interaction, t, r);
//             break;
                
//             case "list":
//                 const e = options.getUser("user") || user;
//                 const eid = e.id;
//                 await listWarns(interaction, eid);
//             break;

//             case "info":
//                 const w = options.getUser("user").id;
//                 const wid = options.getString("warn-id");
//                 await getWarnInfo(interaction, w, wid);
//             break;

//             case "edit":
//                 const u = options.getUser("user").id;
//                 const wuid = options.getString("warn-id");
//                 const newReas = options.getString("reason");
//                 await editWarn(interaction, u, wuid, newReas);
//             break;

//             case "clear":
//                 const tar = options.getUser("user").id;
//                 await clearWarns(interaction, tar);
//             break;

//             case "remove":
//                 const c = options.getUser("user").id;
//                 const wcid = options.getString("warn-id");
//                 await removeWarn(interaction, c, wcid);
//             break;

//             default:
//                 await interaction.reply({ content: "Lệnh phụ không hợp lệ!", ephemeral: true });
//         }
//     }
// }
 
// async function addWarn(interaction, targetUserId, reason) {

//     // Lấy thông tin của người dùng bị cảnh báo từ guild
//     const target = await interaction.guild.members.fetch(targetUserId);
//     const displayName = target.displayName;
//     const guildName = interaction.guild.name;

//     const warningData = await warningSchema.findOneAndUpdate(
//         { GuildName: guildName, GuildID: interaction.guild.id, DisplayName: displayName, UserID: targetUserId,  },
//         {
//             $push: { 
//                 Content: {
//                     ExecuterId: interaction.user.id,
//                     ExecuterTag: interaction.user.tag,
//                     Reason: reason,
//                     WarnID: generateRandomCode(10),
//                     Timestamp: Date.now()
//                 }
//             }
//         },
//         { new: true, upsert: true }
//     );
 
//     const warnEmbed = new EmbedBuilder()
//         .setColor('#FFA500') 
//         .setTitle(`Cảnh báo được đưa ra cho ${displayName} (${targetUserId})`)
//         .setDescription(`Lý do: ${reason}`)
//         .setTimestamp();
 
//     await interaction.reply({ embeds: [warnEmbed] });

//     // Gửi tin nhắn riêng cho người bị cảnh báo
//     const targetUser = await interaction.guild.members.fetch(targetUserId);
//     targetUser.send({
//         embeds: [warnEmbed]
//     });
// }
 
// async function editWarn(interaction, targetUserId, warnId, newReason) {
//     const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
//     const editEmbed = new EmbedBuilder().setColor('#FFA500'); 
 
//     if (!warningData) {
//         editEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng có ID ${targetUserId} không có cảnh báo.`);
//     } else {
//         const warning = warningData.Content.find(w => w.WarnID === warnId);
//         if (!warning) {
//             editEmbed.setTitle(`Không tìm thấy cảnh báo`).setDescription(`Không tìm thấy ID cảnh báo ${warnId}.`);
//         } else {
//             const oldReason = warning.Reason;
//             warning.Reason = newReason;
//             warning.Edits = warning.Edits || [];
//             warning.Edits.push({
//                 EditedByExecuterId: interaction.user.id,
//                 EditedByExecuterTag: interaction.user.tag,
//                 NewReason: newReason,
//                 OldReason: oldReason,
//                 EditTimestamp: Date.now()
//             });
 
//             await warningData.save();
 
//             editEmbed.setTitle(`Đã cập nhật cảnh báo cho ID người dùng ${targetUserId}`)
//                 .setDescription(`**ID cảnh báo:** ${warnId}\n**Lý do cũ:** ${oldReason}\n**Lý do mới:** ${newReason}`);
//         }
//     }
 
//     await interaction.reply({ embeds: [editEmbed] });
// }
 
// async function clearWarns(interaction, targetUserId) {
//     await warningSchema.findOneAndDelete({ GuildID: interaction.guild.id, UserID: targetUserId });
//     const clearEmbed = new EmbedBuilder()
//         .setColor('#00FF00') 
//         .setTitle(`Đã xóa cảnh báo cho ID người dùng ${targetUserId}`)
//         .setDescription(`Tất cả các cảnh báo đã bị xóa.`);
 
//     await interaction.reply({ embeds: [clearEmbed] });
// }
 
// async function removeWarn(interaction, targetUserId, warnId) {
//     const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
//     const removeEmbed = new EmbedBuilder().setColor('#00FF00');
 
//     if (!warningData) {
//         removeEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng có ID ${targetUserId} không có cảnh báo.`);
//     } else {
//         const index = warningData.Content.findIndex(w => w.WarnID === warnId);
//         if (index === -1) {
//             removeEmbed.setTitle(`Không tìm thấy cảnh báo`).setDescription(`Không tìm thấy ID cảnh báo ${warnId}.`);
//         } else {
//             warningData.Content.splice(index, 1);
//             await warningData.save();
//             removeEmbed.setTitle(`Cảnh báo đã bị xóa đối với ID người dùng ${targetUserId}`).setDescription(`ID cảnh báo ${warnId} đã bị xóa.`);
//         }
//     }
 
//     await interaction.reply({ embeds: [removeEmbed] });
// }
 
// async function listWarns(interaction, targetUserId) {
//     // Use 'getUser' instead of 'getString' for user options
//     const targetUser = interaction.options.getUser('user');
//     const targetUserd = targetUser ? targetUser.id : interaction.user.id; // Default to the command user if no user is provided

//     // console.log('ID người dùng cần liệt kê cảnh báo:', targetUserd);
 
//     const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserd });
//     const listEmbed = new EmbedBuilder().setColor('#0099ff');
 
//     if (!warningData || !warningData.Content.length) {
//         listEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng có ID ${targetUserd} không có cảnh báo.`);
//     } else {
//         const warnIDs = warningData.Content.map(w => w.WarnID).join(', ');
//         listEmbed.setTitle(`Cảnh báo cho ID người dùng ${targetUserd}`).setDescription(`ID cảnh báo: ${warnIDs}`);
//     }
 
//     await interaction.reply({ embeds: [listEmbed] });
// }
 
// async function getWarnInfo(interaction, targetUserId, warnId) {
//     try {
//         // Log the received User ID and Warn ID for debugging
//         // console.log("ID người dùng đã nhận:", targetUserId, "ID cảnh báo:", warnId);
 
//         const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
 
//         // Log the retrieved warning data
//         // console.log("Dữ liệu cảnh báo được truy xuất:", warningData);
 
//         const infoEmbed = new EmbedBuilder().setColor('#0099ff');
 
//         if (!warningData) {
//             infoEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng có ID ${targetUserId} không có cảnh báo.`);
//         } else {
//             const warning = warningData.Content.find(w => w.WarnID === warnId);
 
//             // Log the specific warning found
//             // console.log("Đã tìm thấy cảnh báo cụ thể:", warning);
 
//             if (!warning) {
//                 infoEmbed.setTitle(`Cảnh báo không tìm thấy`).setDescription(`ID cảnh báo ${warnId} không tìm thấy.`);
//             } else {
//                 infoEmbed.setTitle(`Thông tin cảnh báo cho ID người dùng ${targetUserId}`)
//                     .setDescription(`**ID cảnh báo:** ${warnId}\n**Người phát hành:** ${warning.ExecuterTag}\n**Lý do:** ${warning.Reason}\n**Ngày phát hành:** <t:${Math.floor(warning.Timestamp / 1000)}:f>`);
//             }
//         }
 
//         await interaction.reply({ embeds: [infoEmbed] });
//     } catch (error) {
//         // Log any errors that occur
//         console.error("Lỗi getWarnInfo:", error);
//         await interaction.reply({ content: "Đã xảy ra lỗi khi truy xuất thông tin cảnh báo.", ephemeral: true });
//     }
// }




const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
const warningSchema = require("../../schemas/warningSchema");
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const config = require('../../config');

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Tất cả các ký tự có thể có
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); // Chọn một chỉ số ngẫu nhiên
        code += characters[randomIndex]; // Thêm ký tự ngẫu nhiên vào mã
    }
    return code; // Trả về mã ngẫu nhiên
}
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("🔹 Lệnh cảnh báo")
    .addSubcommand(c => c
        .setName("create")
        .setDescription("🔹 Tạo cảnh báo")
        .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn cảnh báo").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("lý do cảnh báo").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("id")
        .setDescription("🔹 Nhận ID cảnh báo của người dùng")
        .addUserOption(o => o.setName("user").setDescription("ID cảnh cáo người dùng bạn muốn nhận").setRequired(false))
    )
    .addSubcommand(c => c
        .setName("info")
        .setDescription("🔹 Nhận thông tin về cảnh báo của người dùng")
        .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn nhận thông tin cảnh báo").setRequired(true))
        .addStringOption(o => o.setName("warn-id").setDescription("id cảnh báo").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("edit")
        .setDescription("🔹 Chỉnh sửa cảnh báo")
        .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn sửa thông tin cảnh báo").setRequired(true))
        .addStringOption(o => o.setName("warn-id").setDescription("id cảnh báo bạn muốn sửa").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("lý do cảnh báo").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("clear")
        .setDescription("🔹 Xóa tất cả cảnh báo của người dùng")
        .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn xóa tất cả thông tin cảnh báo").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("remove")
        .setDescription("🔹 Xóa cảnh báo người dùng")
        .addUserOption(o => o.setName("user").setDescription("người dùng bạn muốn xóa thông tin cảnh báo").setRequired(true))
        .addStringOption(o => o.setName("warn-id").setDescription("id cảnh báo bạn muốn xóa").setRequired(true))
    ),

    guildSpecific: true,
    guildId: `1319809040032989275`, // Máy chủ Emoji Command Bot
 
    async execute (interaction, client) {
        const { guild, member, user, options } = interaction;
 
        // if (!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        //      return await interaction.reply({
        //         content: "Bạn không có quyền làm điều này!",
        //         ephemeral: true
        //     });
        // }

        const permissionEmbed = new EmbedBuilder()
            .setDescription("`❌` Bạn không có quyền sử dụng lệnh này!")
            .setColor(config.embedGreen)
            .setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });

        if (!checkPermissions(interaction)) {
            return interaction.reply({ embeds: [permissionEmbed] });
        }
 
        const subcommand = options.getSubcommand();
 
        switch (subcommand) {
            case "create":
                const t = options.getUser("user").id;
                const r = options.getString("reason");
                await addWarn(interaction, t, r);
            break;
                
            case "id":
                const e = options.getUser("user") || user;
                const eid = e.id;
                await IDWarns(interaction, eid);
            break;

            case "info":
                const w = options.getUser("user").id;
                const wid = options.getString("warn-id");
                await getWarnInfo(interaction, w, wid);
            break;

            case "edit":
                const u = options.getUser("user").id;
                const wuid = options.getString("warn-id");
                const newReas = options.getString("reason");
                await editWarn(interaction, u, wuid, newReas);
            break;

            case "clear":
                const tar = options.getUser("user").id;
                await clearWarns(interaction, tar);
            break;

            case "remove":
                const c = options.getUser("user").id;
                const wcid = options.getString("warn-id");
                await removeWarn(interaction, c, wcid);
            break;

            default:
                await interaction.reply({ content: "Lệnh phụ không hợp lệ!", ephemeral: true });
        }
    }
}
 
async function addWarn(interaction, targetUserId, reason) {

    // Lấy thông tin của người dùng bị cảnh báo từ guild
    const target = await interaction.guild.members.fetch(targetUserId);
    const displayName = target.displayName;
    const guildName = interaction.guild.name;

    const warningData = await warningSchema.findOneAndUpdate(
        { GuildName: guildName, GuildID: interaction.guild.id, DisplayName: displayName, UserID: targetUserId,  },
        {
            $push: { 
                nộidung: {
                    ExecuterId: interaction.user.id,
                    ExecuterTag: interaction.user.tag,
                    Reason: reason,
                    WarnID: generateRandomCode(10),
                    Timestamp: Date.now()
                }
            }
        },
        { new: true, upsert: true }
    );
 
    const warnEmbed = new EmbedBuilder()
        .setColor('#FFA500') 
        .setTitle(`Cảnh báo được đưa ra cho ${displayName} (${targetUserId})`)
        .setDescription(`Lý do: ${reason}`)
        .setTimestamp();
 
    await interaction.reply({ embeds: [warnEmbed] });

    // Gửi tin nhắn riêng cho người bị cảnh báo
    const targetUser = await interaction.guild.members.fetch(targetUserId);
    targetUser.send({
        embeds: [warnEmbed]
    });
}
 
async function editWarn(interaction, targetUserId, warnId, newReason) {
    const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
    const editEmbed = new EmbedBuilder().setColor('#FFA500'); 
 
    if (!warningData) {
        editEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng có ID ${targetUserId} không có cảnh báo.`);
    } else {
        const warning = warningData.nộidung.find(w => w.WarnID === warnId);
        if (!warning) {
            editEmbed.setTitle(`Không tìm thấy cảnh báo`).setDescription(`Không tìm thấy ID cảnh báo ${warnId}.`);
        } else {
            const oldReason = warning.Reason;
            warning.Reason = newReason;
            warning.Edits = warning.Edits || [];
            warning.Edits.push({
                EditedByExecuterId: interaction.user.id,
                EditedByExecuterTag: interaction.user.tag,
                NewReason: newReason,
                OldReason: oldReason,
                EditTimestamp: Date.now()
            });
 
            await warningData.save();
 
            editEmbed.setTitle(`Đã cập nhật cảnh báo cho ID người dùng ${targetUserId}`)
                .setDescription(`**ID cảnh báo:** ${warnId}\n**Lý do cũ:** ${oldReason}\n**Lý do mới:** ${newReason}`);
        }
    }
 
    await interaction.reply({ embeds: [editEmbed] });
}
 
async function clearWarns(interaction, targetUserId) {
    await warningSchema.findOneAndDelete({ GuildID: interaction.guild.id, UserID: targetUserId });
    const clearEmbed = new EmbedBuilder()
        .setColor('#00FF00') 
        .setTitle(`Đã xóa cảnh báo cho ID người dùng ${targetUserId}`)
        .setDescription(`Tất cả các cảnh báo đã bị xóa.`);
 
    await interaction.reply({ embeds: [clearEmbed] });
}
 
async function removeWarn(interaction, targetUserId, warnId) {
    const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
    const removeEmbed = new EmbedBuilder().setColor('#00FF00');
 
    if (!warningData) {
        removeEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng có ID ${targetUserId} không có cảnh báo.`);
    } else {
        const index = warningData.nộidung.findIndex(w => w.WarnID === warnId);
        if (index === -1) {
            removeEmbed.setTitle(`Không tìm thấy cảnh báo`).setDescription(`Không tìm thấy ID cảnh báo ${warnId}.`);
        } else {
            warningData.nộidung.splice(index, 1);
            await warningData.save();
            removeEmbed.setTitle(`Cảnh báo đã bị xóa đối với ID người dùng ${targetUserId}`).setDescription(`ID cảnh báo ${warnId} đã bị xóa.`);
        }
    }
 
    await interaction.reply({ embeds: [removeEmbed] });
}

async function IDWarns(interaction, targetUserId) {
    // Lấy thành viên từ guild bằng ID
    const target = await interaction.guild.members.fetch(targetUserId).catch(() => null);

    // Kiểm tra nếu không tìm thấy người dùng
    if (!target) {
        return await interaction.reply({ content: `Không tìm thấy người dùng có ID ${targetUserId}.`, ephemeral: true });
    }

    // Lấy dữ liệu cảnh báo từ database
    const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
    const listEmbed = new EmbedBuilder().setColor('#0099ff');

    if (!warningData || !warningData.nộidung.length) {
        listEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng **${target.displayName}** (${targetUserId}) không có cảnh báo.`);
    } else {
        const warnIDs = warningData.nộidung.map(w => w.WarnID).join('\n');
        listEmbed.setTitle(`Cảnh báo cho ${target.displayName} (${targetUserId})`).setDescription(`__ID cảnh báo:__\n${warnIDs}`);
    }

    await interaction.reply({ embeds: [listEmbed] });
}

 
async function getWarnInfo(interaction, targetUserId, warnId) {
    try {
        // Log the received User ID and Warn ID for debugging
        // console.log("ID người dùng đã nhận:", targetUserId, "ID cảnh báo:", warnId);
 
        const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
 
        // Log the retrieved warning data
        // console.log("Dữ liệu cảnh báo được truy xuất:", warningData);
 
        const infoEmbed = new EmbedBuilder().setColor('#0099ff');
 
        if (!warningData) {
            infoEmbed.setTitle(`Không có cảnh báo`).setDescription(`Người dùng có ID ${targetUserId} không có cảnh báo.`);
        } else {
            const warning = warningData.nộidung.find(w => w.WarnID === warnId);
 
            // Log the specific warning found
            // console.log("Đã tìm thấy cảnh báo cụ thể:", warning);
 
            if (!warning) {
                infoEmbed.setTitle(`Cảnh báo không tìm thấy`).setDescription(`ID cảnh báo ${warnId} không tìm thấy.`);
            } else {
                infoEmbed.setTitle(`Thông tin cảnh báo cho ID người dùng ${targetUserId}`)
                    .setDescription(`**ID cảnh báo:** ${warnId}\n**Người phát hành:** ${warning.ExecuterTag}\n**Lý do:** ${warning.Reason}\n**Ngày phát hành:** <t:${Math.floor(warning.Timestamp / 1000)}:f>`);
            }
        }
 
        await interaction.reply({ embeds: [infoEmbed] });
    } catch (error) {
        // Log any errors that occur
        console.error("Lỗi getWarnInfo:", error);
        await interaction.reply({ content: "Đã xảy ra lỗi khi truy xuất thông tin cảnh báo.", ephemeral: true });
    }
}