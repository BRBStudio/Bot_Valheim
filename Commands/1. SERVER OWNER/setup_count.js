const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const countSchema = require('../../schemas/countSchema');
const CommandStatus = require('../../schemas/Command_Status');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup_count")
        .setDescription("🔹 Thiết lập các kênh đếm trong máy chủ")
        .addSubcommand(subcommand =>
            subcommand
                .setName("channel")
                .setDescription("🔹 Tạo danh mục COUNTER và các kênh đếm trong máy chủ"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("🔹 Xóa tất cả dữ liệu COUNT trong cơ sở dữ liệu")),
    
    async execute(interaction) {

        // Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/setup_count' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }

        // Trì hoãn phản hồi để xử lý các hành động dài hơi
        await interaction.deferReply();

        // // Kiểm tra xem người dùng có phải là chủ sở hữu máy chủ hay không
        // if (interaction.user.id !== interaction.guild.ownerId) {
        //     await interaction.editReply({ content: "Chỉ có chủ sở hữu máy chủ mới có thể sử dụng lệnh này.", ephemeral: true });
        //     return;
        // }

        // // Kiểm tra xem bot có quyền quản lý kênh không
        // if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        //     await interaction.reply({ content: "Tôi cần quyền quản lý kênh để thực hiện lệnh này.", ephemeral: true });
        //     return;
        // }

        // // Kiểm tra xem người dùng có phải là chủ sở hữu máy chủ không
        // if (interaction.guild.ownerId !== interaction.user.id) {
        //     return await interaction.reply({ content: "Lệnh này chỉ dành cho chủ sở hữu máy chủ.", ephemeral: true });
        // }

        const setup = interaction.options.getSubcommand();

        if (setup === "channel") {
            // Kiểm tra các kênh thoại hoặc danh mục COUNTER có tồn tại hay không
            const existingChannels = ["👥 Thành Viên", "🚫 Ban", "🤖 Bot", "💎 Tăng Cường"];
            const foundChannel = interaction.guild.channels.cache.find(ch => existingChannels.includes(ch.name) && ch.type === ChannelType.GuildVoice);
            const foundCategory = interaction.guild.channels.cache.find(ch => ch.name === "COUNTER" && ch.type === ChannelType.GuildCategory);

            // Nếu tìm thấy kênh thoại hoặc danh mục COUNTER, thông báo cho người dùng xóa trước
            if (foundChannel || foundCategory) {
                return await interaction.editReply({ content: "Bạn cần sử dụng lệnh `/setup-count delete` để xóa các kênh hiện có trước khi thiết lập mới.", ephemeral: true });
            }

            // Tạo danh mục COUNTER
            const counterCategory = await interaction.guild.channels.create({
                name: "COUNTER",
                type: ChannelType.GuildCategory,
            });

            // Đặt vị trí danh mục lên trên cùng
            await counterCategory.setPosition(0);

            // Tạo các kênh thoại trong danh mục COUNTER
            const voiceChannels = ["👥 Thành Viên", "🚫 Ban", "🤖 Bot", "💎 Tăng Cường"];
            const createdChannels = [];
            for (const channelName of voiceChannels) {
                const channel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: counterCategory.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.Connect] // Từ chối quyền kết nối
                        }
                    ]
                });
                createdChannels.push({ name: channelName, id: channel.id });
            }

            // Lưu thông tin vào MongoDB
            await countSchema.create({
                Guild: interaction.guild.id,
                CategoryId: counterCategory.id,
                Channels: createdChannels,
            });

            await interaction.editReply({ content: "Danh mục COUNTER và các kênh thoại đã được thiết lập thành công!", ephemeral: true });

        } else if (setup === "delete") {
            // Kiểm tra xem có dữ liệu nào trong MongoDB cho máy chủ này không
            const countData = await countSchema.findOne({ Guild: interaction.guild.id });

            if (!countData) {
                // Nếu không có dữ liệu, thông báo cho người dùng
                return await interaction.editReply({ content: "Máy chủ của bạn không có dữ liệu COUNT nào để xóa.", ephemeral: true });
            }

            // Xóa dữ liệu COUNT từ MongoDB
            await countSchema.deleteMany({ Guild: interaction.guild.id });

            const channelsToDelete = ["👥 Thành Viên", "🚫 Ban", "🤖 Bot", "💎 Tăng Cường"];
            let foundAnyChannel = false; // Biến cờ để kiểm tra xem có kênh nào được tìm thấy hay không

            for (const channelName of channelsToDelete) {
                const channel = interaction.guild.channels.cache.find(ch => ch.name === channelName && ch.type === ChannelType.GuildVoice);
                if (channel) {
                    await channel.delete().catch(() => null);
                    foundAnyChannel = true;
                }
            }

            const categoriesToDelete = interaction.guild.channels.cache.filter(ch => ch.name === "COUNTER" && ch.type === ChannelType.GuildCategory);
            for (const category of categoriesToDelete.values()) {
                const channelsInCategory = interaction.guild.channels.cache.filter(ch => ch.parentId === category.id);
                for (const channel of channelsInCategory.values()) {
                    await channel.delete().catch(() => null);
                }
                await category.delete().catch(() => null);
                foundAnyChannel = true;
            }

            // Nếu không tìm thấy kênh hoặc danh mục nào để xóa, thông báo cho người dùng
            if (!foundAnyChannel) {
                return await interaction.editReply({ content: "Máy chủ của bạn không có kênh hoặc danh mục 'COUNTER' nào để xóa.", ephemeral: true });
            }

            await interaction.editReply({ content: "Dữ liệu COUNT và các kênh đã được xóa thành công khỏi cơ sở dữ liệu.", ephemeral: true });
        }
    },
};




// const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
// const countSchema = require('../../schemas/countSchema'); // Đảm bảo đường dẫn chính xác đến tệp countSchema.js

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("setup-count")
//         .setDescription("Thiết lập các kênh đếm trong máy chủ")
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName("channel")
//                 .setDescription("Tạo danh mục COUNTER và các kênh đếm trong máy chủ"))
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName("delete")
//                 .setDescription("Xóa tất cả dữ liệu COUNT trong cơ sở dữ liệu")),
    
//     async execute(interaction) {

//         // Trì hoãn phản hồi để xử lý các hành động dài hơi
//         await interaction.deferReply();

//         // Kiểm tra xem bot có quyền quản lý kênh không
//         if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
//             await interaction.reply({ content: "Tôi cần quyền quản lý kênh để thực hiện lệnh này.", ephemeral: true });
//             return;
//         }

//         // Kiểm tra xem người dùng có phải là chủ sở hữu máy chủ không
//         if (interaction.guild.ownerId !== interaction.user.id) {
//             return await interaction.reply({ content: "Lệnh này chỉ dành cho chủ sở hữu máy chủ.", ephemeral: true });
//         }

//         const setup = interaction.options.getSubcommand();

//         if (setup === "channel") {
//             // Kiểm tra các kênh thoại hoặc danh mục COUNTER có tồn tại hay không
//             const existingChannels = ["👥 Thành Viên", "🚫 Ban", "🤖 Bot", "💎 Tăng Cường"];
//             const foundChannel = interaction.guild.channels.cache.find(ch => existingChannels.includes(ch.name) && ch.type === ChannelType.GuildVoice);
//             const foundCategory = interaction.guild.channels.cache.find(ch => ch.name === "COUNTER" && ch.type === ChannelType.GuildCategory);

//             // Nếu tìm thấy kênh thoại hoặc danh mục COUNTER, thông báo cho người dùng xóa trước
//             if (foundChannel || foundCategory) {
//                 return await interaction.editReply({ content: "Bạn cần sử dụng lệnh `/setup-count delete` để xóa các kênh hiện có trước khi thiết lập mới.", ephemeral: true });
//             }

//             // Tạo danh mục COUNTER
//             const counterCategory = await interaction.guild.channels.create({
//                 name: "COUNTER",
//                 type: ChannelType.GuildCategory,
//             });

//             // Đặt vị trí danh mục lên trên cùng
//             await counterCategory.setPosition(0);

//             // Tạo các kênh thoại trong danh mục COUNTER
//             const voiceChannels = ["👥 Thành Viên", "🚫 Ban", "🤖 Bot", "💎 Tăng Cường"];
//             const createdChannels = [];
//             for (const channelName of voiceChannels) {
//                 const channel = await interaction.guild.channels.create({
//                     name: channelName,
//                     type: ChannelType.GuildVoice,
//                     parent: counterCategory.id,
//                     permissionOverwrites: [
//                         {
//                             id: interaction.guild.id,
//                             deny: [PermissionsBitField.Flags.Connect] // Từ chối quyền kết nối
//                         }
//                     ]
//                 });
//                 createdChannels.push({ name: channelName, id: channel.id });
//             }

//             // Lưu thông tin vào MongoDB
//             await countSchema.create({
//                 Guild: interaction.guild.id,
//                 CategoryId: counterCategory.id,
//                 Channels: createdChannels,
//             });

//             await interaction.editReply({ content: "Danh mục COUNTER và các kênh thoại đã được thiết lập thành công!", ephemeral: true });

//         } else if (setup === "delete") {
//             // Xóa dữ liệu COUNT từ MongoDB và các kênh, danh mục hiện có
//             await countSchema.deleteMany({ Guild: interaction.guild.id });

//             const channelsToDelete = ["👥 Thành Viên", "🚫 Ban", "🤖 Bot", "💎 Tăng Cường"];
//             for (const channelName of channelsToDelete) {
//                 const channel = interaction.guild.channels.cache.find(ch => ch.name === channelName && ch.type === ChannelType.GuildVoice);
//                 if (channel) {
//                     await channel.delete().catch(() => null);
//                 }
//             }

//             const categoriesToDelete = interaction.guild.channels.cache.filter(ch => ch.name === "COUNTER" && ch.type === ChannelType.GuildCategory);
//             for (const category of categoriesToDelete.values()) {
//                 const channelsInCategory = interaction.guild.channels.cache.filter(ch => ch.parentId === category.id);
//                 for (const channel of channelsInCategory.values()) {
//                     await channel.delete().catch(() => null);
//                 }
//                 await category.delete().catch(() => null);
//             }

//             await interaction.editReply({ content: "Dữ liệu COUNT và các kênh đã được xóa thành công khỏi cơ sở dữ liệu.", ephemeral: true });
//         }
//     },
// };


