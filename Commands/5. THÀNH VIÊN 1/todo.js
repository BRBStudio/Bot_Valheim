const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { loadembeds, embedr, loadembedsff, nodt } = require(`../../Embeds/embedsDEV`)
const todoSchema = require("../../schemas/todoSchema");
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("todo")
        .setDescription("🔹 Quản lý danh sách việc cần làm của bạn!")
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("🔹 Thêm nhiệm vụ vào danh sách việc cần làm của bạn")
                .addStringOption(option =>
                    option.setName("task")
                        .setDescription("Nhiệm vụ cần thêm")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("list")
                .setDescription("🔹 Kiểm tra danh sách việc cần làm của bạn")
        )
        .addSubcommand(subcommand =>
            subcommand.setName("complete")
                .setDescription("🔹 Xóa một nhiệm vụ từ danh sách việc cần làm của bạn")
                .addIntegerOption(option =>
                    option.setName("number")
                        .setDescription("Nhập theo số thứ tự của việc làm")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("clear")
                .setDescription("🔹 Xóa tất cả nhiệm vụ của bạn khỏi danh sách việc cần làm")
        ),

async execute(interaction) {

    // Kiểm tra trạng thái của lệnh
    const commandStatus = await CommandStatus.findOne({ command: '/todo' });

    // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
    if (commandStatus && commandStatus.status === 'off') {
        return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
    }

    const { options, guildId, user, member } = interaction;

    const sub = options.getSubcommand(["add", "list", "complete", "clear"]);
    const task = options.getString("task")
    const taskId = options.getInteger("number") - 1;
    const taskDate = new Date(interaction.createdTimestamp).toLocaleDateString();


    switch (sub) {
        case "add":

            try {
                let data = await todoSchema.findOne({ GuildID: guildId, UserID: interaction.member.id });
                if (!data) {
                    data = new todoSchema({
                        GuildID: guildId,
                        UserID: interaction.member.id,
                        Content: [
                            {
                                Task: task,
                                Date: taskDate
                            }
                        ],
                    });
                } else {
                    const taskContent = {
                        Task: task,
                        Date: taskDate
                    }
                    data.Content.push(taskContent);
                }
                await data.save();

                const loadembeds = new EmbedBuilder()
                    .setDescription(`⏳ Thêm **${task}** vào danh sách việc cần làm của bạn...`)
                    .setColor('DarkNavy')

                await interaction.reply({ embeds: [loadembeds] })

                const asdfembed = new EmbedBuilder()
                    .setColor(`DarkNavy`)
                    .setDescription(`✔ Thành công! **${task}** đã được thêm vào danh sách việc cần làm của bạn!`)
                    .setTimestamp()

                await interaction.editReply({ embeds: [asdfembed] });
            } catch (err) {
                console.log(err)
            }

            break;

        case "list":
            try {
                let data = await todoSchema.findOne({ GuildID: guildId, UserID: interaction.member.id });
                if (data) {
                    // const loadembeds = new EmbedBuilder()
                    //     .setDescription(`⏳ Đang tìm nạp danh sách việc cần làm của bạn...`)
                    //     .setColor('DarkNavy')

                    await interaction.reply({ embeds: [loadembeds] })

                    if (data.Content.length === 0) {
                        
                        // const embedr = new EmbedBuilder()
                        //     .setColor('DarkNavy')
                        //     .setDescription(`❗\`Bạn không có danh sách việc cần làm!\``)

                        await interaction.editReply({ embeds: [embedr] });

                    } else {
                        const nembed = new EmbedBuilder()
                            .setColor('DarkNavy')
                            .setTitle(`📝 Đây là danh sách việc cần làm của bạn!`)
                            .setDescription(`${data.Content.map(
                                (w, i) =>
                                `> Nhiệm vụ #${i + 1}:
                            **${w.Task}**
                            *Ngày thêm: ${w.Date}*\n\n
                            `
                            ).join(" ")}`)
                            .setTimestamp()
                            .setThumbnail(interaction.member.displayAvatarURL())

                        await interaction.editReply({ embeds: [nembed] })
                    }
                }
            } catch (err) {
                console.log(err)
            }

            break;

        case "complete":
            try {
                let data = await todoSchema.findOne({ GuildID: guildId, UserID: interaction.member.id });
                if (data) {
                    const loadembedsf = new EmbedBuilder()
                        .setDescription(`⏳ Kiểm tra nhiệm vụ #${taskId + 1} ra khỏi danh sách việc cần làm của bạn...`)
                        .setColor('DarkNavy')

                    await interaction.reply({ embeds: [loadembedsf] })

                    data.Content.splice(taskId, 1);
                    await data.save();

                    const asdf = new EmbedBuilder()
                        .setColor('DarkNavy')
                        .setThumbnail(interaction.member.displayAvatarURL())
                        .setDescription(`Tốt lắm, nhiệm vụ #${taskId + 1} đã được đánh dấu!\n\n> Chạy /todo list để xem danh sách việc cần làm được cập nhật của bạn!`)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [asdf] });

                } else if (data.Content === null) {

                    // const loadembedsff = new EmbedBuilder()
                    //     .setDescription(`⏳ Đang kiểm tra danh sách việc cần làm của bạn...`)
                    //     .setColor('DarkNavy')

                    await interaction.reply({ embeds: [loadembedsff] })

                    // const nodt = new EmbedBuilder()
                    //     .setColor('DarkNavy')
                    //     .setDescription(`❗\`Bạn không có nhiệm vụ nào cần xóa!\``)
                    //     .setTimestamp();

                    await interaction.editReply({ embeds: [nodt] });
                }
            } catch (err) {
                console.log(err)
            }
            break;

        case "clear":
            try {
                let data = await todoSchema.findOne({ GuildID: guildId, UserID: interaction.member.id });

                if (data) {

                    const loadembedsff = new EmbedBuilder()
                        .setDescription(`⏳ Đang xóa danh sách việc cần làm của bạn...`)
                        .setColor('DarkNavy')

                    await interaction.reply({ embeds: [loadembedsff] })


                    await todoSchema.findOneAndDelete({ GuildID: guildId, UserID: interaction.member.id });

                    const asdfasdf = new EmbedBuilder()
                        .setColor('DarkNavy')
                        .setDescription(`✔ Thành công!\n➥ Đã xóa danh sách việc cần làm của bạn!`)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [asdfasdf] });

                } else {
                    const loademdbedsff = new EmbedBuilder()
                        .setDescription(`⏳ Kiểm tra danh sách việc cần làm của bạn...`)
                        .setColor('DarkNavy')

                    await interaction.reply({ embeds: [loademdbedsff] })

                    const ssss = new EmbedBuilder()
                        .setDescription(`❗\`Bạn không có danh sách việc cần làm để xóa!\``)
                        .setColor('DarkNavy')
                        .setTimestamp();

                    await interaction.editReply({ embeds: [ssss] });
                }
            } catch (err) {
                console.log(err)
            }
            break;
        }
    }
}

/// cần sửa lại