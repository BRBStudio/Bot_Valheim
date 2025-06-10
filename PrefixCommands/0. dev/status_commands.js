const { EmbedBuilder } = require('discord.js');
const CommandStatus = require('../../schemas/Command_Status');
const EventStatus = require('../../schemas/Event_Status');
const config = require('../../config');

module.exports = {
    name: 'status_management',
    description: '\`🔸 LỆNH DÀNH CHO DEV\`', // - Quản lý bật/tắt lệnh và sự kiện
    hd: `\`🔸 Cách dùng: Không có thông tin\``,
    q: `\`🔸 Dành cho DEV\``,
    aliases: ['cm', 'ev', 'on', 'off', 'dev5'], 

/*
?on commands <tên_lệnh> <on|off>
?on events <tên_sự_kiện> <on|off>
*/    

    async execute(msg, args) {
        if (!config.specialUsers.includes(msg.author.id)) { 
            return msg.channel.send("Lệnh này dành cho DEV. Bạn không có quyền sử dụng lệnh này!"); 
        }

        const type = args[0]; // "commands" hoặc "events"
        const target = args[1]; // tên lệnh hoặc tên sự kiện, hoặc "all"
        const action = args[2]; // "on" hoặc "off"

        if (type === 'h') {
                
            const helpEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Hướng Dẫn Sử Dụng Lệnh Quản Lý Trạng Thái')
                .setDescription('Dưới đây là hướng dẫn sử dụng các lệnh quản lý trạng thái:')
                .addFields(
                    { name: 'Bật hoặc tắt một lệnh cụ thể.', value: '\`\`\`?status_management commands <tên_lệnh> <on|off>\`\`\`' },
                    { name: 'Bật tất cả các lệnh đang tắt.', value: '\`\`\`?cm commands all <on|off>\`\`\`' },
                    { name: 'Xem hướng dẫn & định dạng.', value: '\`\`\`?cm h\`\`\`' },
                    { name: 'Bật hoặc tắt một sự kiện cụ thể.', value: '\`\`\`?on events <tên_sự_kiện> <on|off>\`\`\`' },
                )
                .setFooter({ text: 'Lệnh này chỉ dành cho DEV.' });

            return msg.channel.send({ embeds: [helpEmbed] });

        }

        if (!type || !target || (action && action !== 'on' && action !== 'off')) {
            return msg.channel.send(
                'Vui lòng sử dụng định dạng: ?status_management <commands|events> <tên_lệnh|tên_sự_kiện|all> <on|off>'
            );
        }

        // Quản lý trạng thái lệnh
        if (type === 'commands') {
            // Nếu muốn bật lại tất cả các lệnh đang tắt
            if (target === 'all' && action === 'on') {
                const disabledCommands = await CommandStatus.find({ status: 'off' });
                
                if (disabledCommands.length === 0) {
                    return msg.channel.send("Không có lệnh nào đang tắt.");
                }

                for (const cmd of disabledCommands) {
                    cmd.status = 'on';
                    await cmd.save();
                }

                return msg.channel.send("Tất cả các lệnh đang tắt đã được bật lại.");
            }

            // Quản lý trạng thái lệnh theo tên lệnh cụ thể
            const existingCommandStatus = await CommandStatus.findOne({ command: target });

            if (action === 'on') {
                if (existingCommandStatus) {
                    existingCommandStatus.status = 'on';
                    await existingCommandStatus.save();
                    return msg.channel.send(`Lệnh ${target} đã được bật.`);
                } else {
                    await CommandStatus.create({ command: target, status: 'on' });
                    return msg.channel.send(`Lệnh ${target} đã được tạo và bật.`);
                }
            } else if (action === 'off') {
                if (existingCommandStatus) {
                    existingCommandStatus.status = 'off';
                    await existingCommandStatus.save();
                    return msg.channel.send(`Lệnh ${target} đã được tắt.`);
                } else {
                    await CommandStatus.create({ command: target, status: 'off' });
                    return msg.channel.send(`Lệnh ${target} đã được tạo và tắt.`);
                }
            }
        }

        // Quản lý trạng thái sự kiện
        if (type === 'events') {
            const existingEventStatus = await EventStatus.findOne({ event: target });

            if (action === 'on') {
                if (existingEventStatus) {
                    existingEventStatus.status = 'on';
                    await existingEventStatus.save();
                    return msg.channel.send(`Sự kiện ${target} đã được bật.`);
                } else {
                    await EventStatus.create({ event: target, status: 'on' });
                    return msg.channel.send(`Sự kiện ${target} đã được tạo và bật.`);
                }
            } else if (action === 'off') {
                if (existingEventStatus) {
                    existingEventStatus.status = 'off';
                    await existingEventStatus.save();
                    return msg.channel.send(`Sự kiện ${target} đã được tắt.`);
                } else {
                    await EventStatus.create({ event: target, status: 'off' });
                    return msg.channel.send(`Sự kiện ${target} đã được tạo và tắt.`);
                }
            }
        }
    },
};
