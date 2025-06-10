const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const MessageCount = require('../../schemas/numbermess');
const VoiceTime = require('../../schemas/numbervoice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('🔹 Xem thống kê hàng đầu của máy chủ.'),
    // guildSpecific: true,
    // guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`], // '1319809040032989275', '1312185401347407902'

async execute(interaction, client) {

    // await interaction.deferReply();

    const guildName = interaction.guild.name;
    const guildId = interaction.guild.id;

    // // Hàm chuyển đổi số lượng tin nhắn
    // function formatNumberMessages(number) {
    //     if (number < 1000) return `${number}`;
    //     if (number >= 1000 && number < 1000000) {
    //         const thousands = Math.floor(number / 1000);
    //         const remainder = number % 1000;
    //         return remainder === 0 ? `${thousands}K` : `${thousands}K${remainder}`;
    //     }
    //     if (number >= 1000000) {
    //         // const millions = Math.floor(number / 1000000);
    //         // const remainder = number % 1000000;
    //         // const thousands = Math.floor(remainder / 1000);
    //         // return thousands === 0 ? `${millions}B` : `${millions}B${thousands * 1000}`;

    //         const millions = Math.floor(number / 1000000);
    //         const remainder = number % 1000000;
    //         const thousands = Math.floor(remainder); 
    //         return thousands === 0 ? `${millions}B` : `${millions}B${thousands}`;
    //     }
    // }

    function formatNumberMessages(number) {
        if (number < 1000) return `${number}`;
    
        if (number >= 1000 && number < 1000000) {
            let thousands = Math.floor(number / 1000);
            let remainder = number % 1000;
            let hundreds = Math.floor(remainder / 100);
            
            return hundreds > 0 ? `${thousands}K${hundreds}` : `${thousands}K`;
        }
    
        if (number >= 1000000) {
            let millions = Math.floor(number / 1000000);
            let remainder = number % 1000000;
            let thousands = Math.floor(remainder / 1000);
    
            return thousands > 0 ? `${millions * 1000 + thousands}K` : `${millions}B`;
        }
    }
    

    // Lấy dữ liệu tin nhắn từ MongoDB
    const messagesData = await MessageCount.find({ guildId }).sort({ numberMessages: -1 }).limit(6);
    const messagesStats = Array.from({ length: 6 }, (v, i) => {
      const entry = messagesData[i];
      return entry
        ? { name: entry.displayName || `User ${i + 1}`, count: `${formatNumberMessages(entry.numberMessages)}` } // ${entry.numberMessages}
        : { name: 'N/A', count: '0' };
    });

    // Lấy dữ liệu thời gian voice từ MongoDB
    const voiceData = await VoiceTime.find({ guildId }).sort({ time: -1 }).limit(6);
    const voiceStats = Array.from({ length: 6 }, (v, i) => {
        const entry = voiceData[i];
        return entry
            ? { name: entry.displayName || `User ${i + 1}`, time: `${(entry.TimeVoice).toFixed(2)} H` }
            : { name: 'N/A', time: '0 H' };
    });

    // Khởi tạo canvas
    const canvas = createCanvas(1100, 700);
    const ctx = canvas.getContext('2d');

    // Hàm vẽ chữ nhật bo góc
    function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, textColor = null, text = null) {
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        if (text && textColor) {
            ctx.fillStyle = textColor;
            ctx.font = '25px Roboto';
            const textWidth = ctx.measureText(text).width;
            const textX = x + (width - textWidth) / 2;
            const textY = y + (height + 20) / 2;
            ctx.fillText(text, textX, textY);
        }
    }

    // Hàm tính toán độ rộng khung dựa trên văn bản
    function calculateBoxWidth(ctx, text, buffer = 15) {
        ctx.font = '25px Roboto';
        const textWidth = ctx.measureText(text).width;
        return textWidth + buffer * 2;
    }

    // Vẽ nền canvas
    drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 40, 'rgb(39, 39, 39)'); // #1e1e1e #33393E rgb(51, 57, 62)

    // Vẽ tiêu đề máy chủ
    ctx.fillStyle = 'rgb(255, 255, 255)'; // màu xanh đẹp
    ctx.font = '40px Roboto'; //rgb(28, 43, 54)
    ctx.fillText(`${guildName}`, 10, 50);

    // Vẽ tên dưới máy chủ
    ctx.fillStyle = 'rgb(255, 255, 255)'; // màu cam
    ctx.font = '25px Roboto';
    ctx.fillText('🔰 Thống kê hàng đầu', 10, 85);

    // Vẽ các tiêu đề phần
    ctx.font = '30px Arial';
    ctx.fillStyle = 'rgb(0, 247, 255)'; 
    ctx.fillText('💬 Top Tin Nhắn:', 10, 135);
    ctx.fillText('🔊 Top Giọng Nói:', 10, 415);

    // Vẽ chân trang bên trái
    ctx.font = '25px Arial';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText('Tổng quan máy chủ', 10, 675);

    // Vẽ chân trang bên phải
    ctx.font = '25px Arial';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText(`${client.user.username}`, 920, 675); // 920

    // Hàm vẽ danh sách theo cột
    function drawStats(stats, startY) {
        let columnX = 10;
        let currentY = startY;
        stats.forEach((user, index) => {
            if (index === 3) {
                columnX = canvas.width / 2 + 30;
                currentY = startY;
            }

            const valueBoxWidth = calculateBoxWidth(ctx, user.count || user.time);

            // Vẽ khung chính
            drawRoundedRect(ctx, columnX, currentY, 500, 63, 15, 'rgb(14, 20, 20)'); // khung chính

            // Tính toán độ rộng khung dựa trên số thứ tự //rgb(172, 185, 255)
            const numberText = user.name !== 'N/A' ? `${index + 1}` : '';
            const numberBoxWidth = calculateBoxWidth(ctx, numberText, 10); // buffer = 10

            // Vẽ khung số thứ tự với độ rộng động
            drawRoundedRect(ctx, columnX, currentY, numberBoxWidth, 65, 15, 'rgb(66, 122, 145)'); // khung số thứ tự

            // Vẽ số thứ tự bên trong khung
            ctx.font = '25px Roboto';
            ctx.fillStyle = 'rgb(255, 255, 255)';
            const numberX = columnX + (numberBoxWidth - ctx.measureText(numberText).width) / 2; // Căn giữa
            const numberY = currentY + 40;
            ctx.fillText(numberText, numberX, numberY);

            // Vẽ khung giá trị
            drawRoundedRect(
                ctx,
                columnX + 491 - valueBoxWidth, // chỉnh khung giá trị sang trái hoặc phải
                currentY + 8,
                valueBoxWidth,
                50,
                10,
                'rgb(66, 122, 145)', // khung giá trị
                'rgb(255, 255, 255)', // rgb(255, 255, 255)
                user.count || user.time
            );
            //rgb(51, 51, 51)

            // Vẽ tên người dùng
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.font = '25px Arial';
            ctx.fillText(user.name, columnX + 60, currentY + 40);

            currentY += 72;
        });
    }

    // Vẽ danh sách tin nhắn và voice
    drawStats(messagesStats, 150);
    drawStats(voiceStats, 430);

    // Vẽ avatar bot dưới dạng hình tròn
    const botAvatar = await loadImage(client.user.displayAvatarURL({ extension: 'png', size: 128 }));
    const avatarX = 875; // Vị trí X (trái)
    const avatarY = 650; // Vị trí Y (trên)
    const avatarRadius = 17.5; // Bán kính của hình tròn
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2, true); // Tạo vòng tròn ở vị trí (avatarX, avatarY)
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(botAvatar, avatarX, avatarY, 35, 35); // Vẽ ảnh vào canvas (avatarX, avatarY) và kích thước 35x35
    ctx.restore();

    // Chuyển canvas thành tệp hình ảnh để gửi
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'server-stats.png' });

    // Tạo menu chọn loại thống kê
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('top-select-menu')
        .setPlaceholder('Chọn loại thống kê bạn muốn xem')
        .addOptions([
            {
                label: '👁‍🗨 Tổng quan',
                description: 'Xem tổng quan thống kê hàng đầu',
                value: 'Overview',
            },
            {
                label: '💬 Người dùng tin nhắn hàng đầu ',
                description: 'Xem thống kê tin nhắn hàng đầu',
                value: 'message',
            },
            {
                label: '🔊 Người dùng giọng nói hàng đầu',
                description: 'Xem thống kê hoạt động voice hàng đầu',
                value: 'voice',
            },
        ]);

    const button1 = new ButtonBuilder()
        .setCustomId(`top-remove`) // delete
        .setStyle(ButtonStyle.Primary)
        .setLabel('xóa');

    // Hàng thứ hai chỉ chứa nút remove
    const row = new ActionRowBuilder().addComponents(button1);
        
    const row1 = new ActionRowBuilder().addComponents(selectMenu);
    
    try {
    // Gửi tin nhắn ban đầu với menu và hình ảnh
    const message = await interaction.reply({
            files: [attachment],
            components: [row, row1],
        });

    } catch (error) {
        // console.error('Lỗi khi deferUpdate:', error);
        return;
    }

    // // Collector lắng nghe tương tác select menu
    // const filter = (i) => i.customId === 'top-select-menu' && i.user.id === interaction.user.id;

    // Lưu lại ID người dùng thực hiện lệnh /top
    let userId = interaction.user.id;

    // Collector lắng nghe tương tác select menu
    // const filter = (i) => i.customId === 'top-select-menu' && i.user.id === userId;
    const filter = (i) => {
        if (i.customId === 'top-select-menu' && i.user.id !== userId) {
            i.reply({ content: `Chỉ người dùng lệnh **/top** mới thực hiện được điều này.`, ephemeral: true });
            return false;
        }
        return i.customId === 'top-select-menu';
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter, }); //  time: 60000

    collector.on('collect', async (i) => {
        await i.deferUpdate();

        const guildName = i.guild.name;
            const guildId = i.guild.id;

            // Lấy lựa chọn người dùng
            const selectedValue = i.values[0];
            let currentPage = 1;
            
            // Hàm tạo hình ảnh thống kê
            async function createStatsImage(page, selectedValue) {
                const canvas = createCanvas(1100, 700);
                const ctx = canvas.getContext('2d');

                function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, textColor = null, text = null) {
                    ctx.fillStyle = bgColor;
                    ctx.beginPath();
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + width - radius, y);
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                    ctx.lineTo(x + width, y + height - radius);
                    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                    ctx.lineTo(x + radius, y + height);
                    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                    ctx.lineTo(x, y + radius);
                    ctx.quadraticCurveTo(x, y, x + radius, y);
                    ctx.closePath();
                    ctx.fill();

                    if (text && textColor) {
                        ctx.fillStyle = textColor;
                        ctx.font = '25px Roboto';
                        const textWidth = ctx.measureText(text).width;
                        const textX = x + (width - textWidth) / 2;
                        const textY = y + (height + 20) / 2;
                        ctx.fillText(text, textX, textY);
                    }
                }

                function calculateBoxWidth(ctx, text, buffer = 15) {
                    ctx.font = '25px Roboto';
                    const textWidth = ctx.measureText(text).width;
                    return textWidth + buffer * 2;
                }

                drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 40, 'rgb(39, 39, 39)'); // khung nền canvas

                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.font = '40px Roboto';
                ctx.fillText(`${guildName}`, 10, 50);
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.font = '25px Roboto';
                ctx.fillText('🔰 Thống kê hàng đầu', 10, 85);
                ctx.font = '30px Arial';
                ctx.fillStyle = '#00FFFF';

                if (selectedValue === 'message') {
                    ctx.fillText('💬 Top Tin Nhắn:', 10, 135);
                } else if (selectedValue === 'voice') {
                    ctx.fillText('🔊 Top Giọng Nói:', 10, 135);
                } else if (selectedValue === 'Overview') {
                    ctx.fillText('💬 Top Tin Nhắn:', 10, 135);
                    ctx.fillText('🔊 Top Giọng Nói:', 10, 415);
                }

                ctx.font = '25px Arial';
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillText('Tổng quan máy chủ', 10, 675);
                ctx.fillText(`${client.user.username}`, 920, 675);

                const botAvatar = await loadImage(client.user.displayAvatarURL({ extension: 'png', size: 128 }));
                const avatarX = 875;
                const avatarY = 650;
                const avatarRadius = 17.5;
                ctx.save();
                ctx.beginPath();
                ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(botAvatar, avatarX, avatarY, 35, 35);
                ctx.restore();

                let stats = [];
                const limit = 14;
                const skip = (page - 1) * limit;

                if (selectedValue === 'message') {
                    const messagesData = await MessageCount.find({ guildId }).sort({ numberMessages: -1 }).skip(skip).limit(limit);
                    stats = Array.from({ length: limit }, (v, i) => {
                        const entry = messagesData[i];
                        return entry
                            ? { name: entry.displayName || `User ${skip + i + 1}`, count: `${formatNumberMessages(entry.numberMessages)}` } // ${entry.numberMessages}
                            : { name: 'N/A', count: '0' };
                    });
                } else if (selectedValue === 'voice') {
                    const voiceData = await VoiceTime.find({ guildId }).sort({ time: -1 }).skip(skip).limit(limit);
                    stats = Array.from({ length: limit }, (v, i) => {
                        const entry = voiceData[i];
                        return entry
                            ? { name: entry.displayName || `User ${skip + i + 1}`, time: `${(entry.TimeVoice).toFixed(2)} H` }
                            : { name: 'N/A', time: '0 H' };
                    });
                } else if (selectedValue === 'Overview') {
                    // Lấy dữ liệu tin nhắn và voice, giới hạn 6 mục
                    const messagesData = await MessageCount.find({ guildId }).sort({ numberMessages: -1 }).limit(6);
                    const voiceData = await VoiceTime.find({ guildId }).sort({ time: -1 }).limit(6);

                    const messagesStats = Array.from({ length: 6 }, (v, i) => {
                        const entry = messagesData[i];
                        return entry
                            ? { name: entry.displayName || `User ${i + 1}`, count: `${formatNumberMessages(entry.numberMessages)}` }
                            : { name: 'N/A', count: '0' };
                    });

                    const voiceStats = Array.from({ length: 6 }, (v, i) => {
                        const entry = voiceData[i];
                        return entry
                            ? { name: entry.displayName || `User ${i + 1}`, time: `${(entry.TimeVoice).toFixed(2)} H` }
                            : { name: 'N/A', time: '0 H' };
                    });

                    function drawStats(stats, startY) {
                        let columnX = 10;
                        let currentY = startY;
                        stats.forEach((user, index) => {
                            if (index === 3) {
                                columnX = canvas.width / 2 + 30; // Chuyển sang cột thứ hai
                                currentY = startY;
                            }

                            const valueBoxWidth = calculateBoxWidth(ctx, user.count || user.time);

                            drawRoundedRect(ctx, columnX, currentY, 500, 63, 15, 'rgb(14, 20, 20)'); // khung chính

                            const numberText = user.name !== 'N/A' ? `${index + 1}` : '';
                            const numberBoxWidth = calculateBoxWidth(ctx, numberText, 10);
                            drawRoundedRect(ctx, columnX, currentY, numberBoxWidth, 65, 15, 'rgb(66, 122, 145)'); // khung số thứ tự

                            ctx.font = '25px Roboto';
                            ctx.fillStyle = 'rgb(255, 255, 255)';
                            const numberX = columnX + (numberBoxWidth - ctx.measureText(numberText).width) / 2;
                            const numberY = currentY + 40;
                            ctx.fillText(numberText, numberX, numberY);

                            drawRoundedRect(
                                ctx,
                                columnX + 491 - valueBoxWidth,
                                currentY + 8,
                                valueBoxWidth,
                                50,
                                10,
                                'rgb(66, 122, 145)', // khung giá trị
                                'rgb(255, 255, 255)', // rgb(255, 255, 255)
                                user.count || user.time
                            );

                            ctx.fillStyle = 'rgb(255, 255, 255)';
                            ctx.font = '25px Arial';
                            ctx.fillText(user.name, columnX + 60, currentY + 40);

                            currentY += 72;
                        });
                    }

                    drawStats(messagesStats, 150); // Vẽ danh sách tin nhắn
                    drawStats(voiceStats, 430);    // Vẽ danh sách voice
                }

                function drawStats(stats, startY) {
                    let columnX = 10;
                    let currentY = startY;
                    stats.forEach((user, index) => {
                        if (index === 7) {
                            columnX = canvas.width / 2 + 30;
                            currentY = startY;
                        }

                        const valueBoxWidth = calculateBoxWidth(ctx, user.count || user.time);

                        drawRoundedRect(ctx, columnX, currentY, 500, 63, 15, 'rgb(14, 20, 20)'); // khung chính

                        const numberText = user.name !== 'N/A' ? `${skip + index + 1}` : '';
                        const numberBoxWidth = calculateBoxWidth(ctx, numberText, 10);

                        drawRoundedRect(ctx, columnX, currentY, numberBoxWidth, 65, 15, 'rgb(66, 122, 145)'); // khung số thứ tự 

                        ctx.font = '25px Roboto';
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        const numberX = columnX + (numberBoxWidth - ctx.measureText(numberText).width) / 2;
                        const numberY = currentY + 40;
                        ctx.fillText(numberText, numberX, numberY);

                        drawRoundedRect(
                            ctx,
                            columnX + 491 - valueBoxWidth,
                            currentY + 8,
                            valueBoxWidth,
                            50,
                            10,
                            'rgb(66, 122, 145)', // khung giá trị
                            'rgb(255, 255, 255)', // rgb(255, 255, 255)
                            user.count || user.time
                        );

                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.font = '25px Arial';
                        ctx.fillText(user.name, columnX + 60, currentY + 40);

                        currentY += 72;
                    });
                }

                drawStats(stats, 150);
                return new AttachmentBuilder(canvas.toBuffer(), { name: 'server-stats.png' });
            }

            // let currentPage = 1;
            const attachment = await createStatsImage(currentPage, selectedValue);

            const button1 = new ButtonBuilder()
                .setCustomId(`${selectedValue}-first`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('Trang đầu');
            const button2 = new ButtonBuilder()
                .setCustomId(`${selectedValue}-prev`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('Trang trước');
            const button3 = new ButtonBuilder()
                .setCustomId(`${selectedValue}-page`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Trang: ${currentPage}`)
                .setDisabled(true);
            const button4 = new ButtonBuilder()
                .setCustomId(`${selectedValue}-next`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('Trang sau');
            const button5 = new ButtonBuilder()
                .setCustomId(`${selectedValue}-last`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('Trang cuối');

            const button6 = new ButtonBuilder()
                .setCustomId(`${selectedValue}-remove`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('xóa');
            
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('top-select-menu')
                .setPlaceholder('Chọn loại thống kê bạn muốn xem')
                .addOptions([
                    {
                        label: '👁‍🗨 Tổng quan',
                        description: 'Xem tổng quan thống kê hàng đầu',
                        value: 'Overview',
                    },
                    {
                        label: '💬 Tin nhắn',
                        description: 'Xem thống kê tin nhắn hàng đầu',
                        value: 'message',
                    },
                    {
                        label: '🔊 Voice',
                        description: 'Xem thống kê hoạt động voice hàng đầu',
                        value: 'voice',
                    },
                ]);

            // const row = new ActionRowBuilder().addComponents(button1, button2, button3, button4, button5); // Nếu giá trị được chọn là "Tổng quan", có thêm hàng nút

            // Nếu giá trị được chọn là "Tổng quan", không thêm hàng nút
            const row = selectedValue === 'Overview' 
            ? undefined 
            : new ActionRowBuilder().addComponents(button1, button2, button3, button4, button5);

            const row0 = new ActionRowBuilder().addComponents(button6);

            const row1 = new ActionRowBuilder().addComponents(selectMenu);

            // const mas = await i.editReply({ files: [attachment], components: [row, row1], fetchReply: true, });
            const mas = await i.editReply({ files: [attachment], components: [row, row0, row1].filter(Boolean), fetchReply: true });

            // Collector lắng nghe tương tác với nút của lựa chọn `💬 Tin nhắn` hoặc lựa chọn `🔊 Voice`
    // const filter = (i) => i.customId === `${selectedValue}-next` || i.customId === `${selectedValue}-prev` || i.customId === `${selectedValue}-first` || i.customId === `${selectedValue}-last` && i.user.id === interaction.user.id;
    const filter = (i) => {
        const isValidButton = 
            i.customId === `${selectedValue}-next` || 
            i.customId === `${selectedValue}-prev` || 
            i.customId === `${selectedValue}-first` || 
            i.customId === `${selectedValue}-last` || 
            i.customId === `${selectedValue}-remove`;
    
        if (isValidButton && i.user.id !== interaction.user.id) {
            i.reply({ content: `Chỉ người dùng lệnh **/top** mới thực hiện được điều này.`, ephemeral: true });
            return false;
        }
    
        return isValidButton && i.user.id === interaction.user.id;
    };
    

    // time: 60000,
    const buttonCollector = mas.createMessageComponentCollector({
        filter,    
    });

    buttonCollector.on('collect', async (i) => {

        try {
            await i.deferUpdate(); // Không gọi nếu đã acknowledged
        } catch (error) {
            // console.error('Lỗi khi deferUpdate:', error);
            return;
        }



                    if (i.customId === `${selectedValue}-remove`) {
                        try {
                            await i.message.delete(); // Xóa tin nhắn khi người dùng nhấn nút remove
                            return;
                        } catch (error) {
                            console.error('Lỗi khi xóa tin nhắn:', error);
                            return;
                        }
                    } else if (i.customId === `${selectedValue}-next`) {
                        currentPage++;
                    } else if (i.customId === `${selectedValue}-prev`) {
                        currentPage = Math.max(1, currentPage - 1);
                    } else if (i.customId === `${selectedValue}-first`) {
                        currentPage = 1;
    
                    } else if (i.customId === `${selectedValue}-last`) { 
                        let totalEntries = 0;
    
        // Xử lý từng trường hợp của selectedValue
        if (selectedValue === 'message') {
            totalEntries = await MessageCount.countDocuments({ guildId });
        } else if (selectedValue === 'voice') {
            totalEntries = await VoiceTime.countDocuments({ guildId });
        } else {
            // Xử lý trường hợp selectedValue không hợp lệ
            return i.editReply({ content: 'Lựa chọn không hợp lệ!', ephemeral: true });
        }
    
        // Tính số trang cuối cùng
        currentPage = Math.ceil(totalEntries / 14);
                    }
    
                    const newAttachment = await createStatsImage(currentPage, selectedValue);
                    const newRow = new ActionRowBuilder()
                        .addComponents(
                            button1,
                            button2,
                            new ButtonBuilder().setCustomId(`${selectedValue}-page`).setStyle(ButtonStyle.Secondary).setLabel(`Trang: ${currentPage}`).setDisabled(true),
                            button4,
                            button5,
                        );

                    const newRow0 = new ActionRowBuilder().addComponents(button6);
    
                try {
                    await i.editReply({ files: [newAttachment], components: [newRow, newRow0, row1], });
                    } catch (error) {
                        // console.error('Lỗi khi deferUpdate:', error);
                        return;
                    }
            });
        });

    },
};

































































/////////// phần trên đã xong
// const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const { createCanvas, loadImage } = require('canvas');
// const MessageCount = require('../../schemas/numbermess');
// const VoiceTime = require('../../schemas/numbervoice');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('top')
//         .setDescription('Xem thống kê hàng đầu của máy chủ với hình ảnh và lựa chọn menu.'),
//     guildSpecific: true,
//     guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`],

// async execute(interaction, client) {
//     const guildName = interaction.guild.name;
//     const guildId = interaction.guild.id;

//     // Lấy dữ liệu tin nhắn từ MongoDB
//     const messagesData = await MessageCount.find({ guildId }).sort({ numberMessages: -1 }).limit(6);
//     const messagesStats = Array.from({ length: 6 }, (v, i) => {
//       const entry = messagesData[i];
//       return entry
//         ? { name: entry.displayName || `User ${i + 1}`, count: `${entry.numberMessages} M` }
//         : { name: 'N/A', count: '0 M' };
//     });

//     // Lấy dữ liệu thời gian voice từ MongoDB
//     const voiceData = await VoiceTime.find({ guildId }).sort({ time: -1 }).limit(6);
//     const voiceStats = Array.from({ length: 6 }, (v, i) => {
//         const entry = voiceData[i];
//         return entry
//             ? { name: entry.displayName || `User ${i + 1}`, time: `${entry.TimeVoice} H` }
//             : { name: 'N/A', time: '0 H' };
//     });

//     // Khởi tạo canvas
//     const canvas = createCanvas(1100, 700);
//     const ctx = canvas.getContext('2d');

//     // Hàm vẽ chữ nhật bo góc
//     function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, textColor = null, text = null) {
//         ctx.fillStyle = bgColor;
//         ctx.beginPath();
//         ctx.moveTo(x + radius, y);
//         ctx.lineTo(x + width - radius, y);
//         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//         ctx.lineTo(x + width, y + height - radius);
//         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//         ctx.lineTo(x + radius, y + height);
//         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//         ctx.lineTo(x, y + radius);
//         ctx.quadraticCurveTo(x, y, x + radius, y);
//         ctx.closePath();
//         ctx.fill();

//         if (text && textColor) {
//             ctx.fillStyle = textColor;
//             ctx.font = '25px Roboto';
//             const textWidth = ctx.measureText(text).width;
//             const textX = x + (width - textWidth) / 2;
//             const textY = y + (height + 20) / 2;
//             ctx.fillText(text, textX, textY);
//         }
//     }

//     // Hàm tính toán độ rộng khung dựa trên văn bản
//     function calculateBoxWidth(ctx, text, buffer = 15) {
//         ctx.font = '25px Roboto';
//         const textWidth = ctx.measureText(text).width;
//         return textWidth + buffer * 2;
//     }

//     // Vẽ nền canvas
//     drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 40, '#1e1e1e');

//     // Vẽ tiêu đề máy chủ
//     ctx.fillStyle = 'rgb(255, 255, 255)'; // màu xanh đẹp
//     ctx.font = '40px Roboto';
//     ctx.fillText(`${guildName}`, 10, 50);

//     // Vẽ tên dưới máy chủ
//     ctx.fillStyle = 'rgb(255, 255, 255)'; // màu cam
//     ctx.font = '25px Roboto';
//     ctx.fillText('🔰 Thống kê hàng đầu', 10, 85);

//     // Vẽ các tiêu đề phần
//     ctx.font = '30px Arial';
//     ctx.fillStyle = '#00FFFF'; 
//     ctx.fillText('💬 Top Tin Nhắn:', 10, 135);
//     ctx.fillText('🔊 Top Giọng Nói:', 10, 415);

//     // Vẽ chân trang bên trái
//     ctx.font = '25px Arial';
//     ctx.fillStyle = 'rgb(255, 255, 255)';
//     ctx.fillText('Tổng quan máy chủ', 10, 675);

//     // Vẽ chân trang bên phải
//     ctx.font = '25px Arial';
//     ctx.fillStyle = 'rgb(255, 255, 255)';
//     ctx.fillText(`${client.user.username}`, 920, 675); // 920

//     // Hàm vẽ danh sách theo cột
//     function drawStats(stats, startY) {
//         let columnX = 10;
//         let currentY = startY;
//         stats.forEach((user, index) => {
//             if (index === 3) {
//                 columnX = canvas.width / 2 + 30;
//                 currentY = startY;
//             }

//             const valueBoxWidth = calculateBoxWidth(ctx, user.count || user.time);

//             // Vẽ khung chính
//             drawRoundedRect(ctx, columnX, currentY, 500, 63, 15, '#2c2f33');

//             // Tính toán độ rộng khung dựa trên số thứ tự
//             const numberText = user.name !== 'N/A' ? `${index + 1}` : '';
//             const numberBoxWidth = calculateBoxWidth(ctx, numberText, 10); // buffer = 10

//             // Vẽ khung số thứ tự với độ rộng động
//             drawRoundedRect(ctx, columnX, currentY, numberBoxWidth, 65, 15, '#000000');

//             // Vẽ số thứ tự bên trong khung
//             ctx.font = '25px Roboto';
//             ctx.fillStyle = 'rgb(255, 255, 255)';
//             const numberX = columnX + (numberBoxWidth - ctx.measureText(numberText).width) / 2; // Căn giữa
//             const numberY = currentY + 40;
//             ctx.fillText(numberText, numberX, numberY);

//             // Vẽ khung giá trị
//             drawRoundedRect(
//                 ctx,
//                 columnX + 491 - valueBoxWidth, // chỉnh khung giá trị sang trái hoặc phải
//                 currentY + 8,
//                 valueBoxWidth,
//                 50,
//                 10,
//                 '#2196f3',
//                 'rgb(255, 255, 255)',
//                 user.count || user.time
//             );

//             // Vẽ tên người dùng
//             ctx.fillStyle = 'rgb(255, 255, 255)';
//             ctx.font = '25px Arial';
//             ctx.fillText(user.name, columnX + 60, currentY + 40);

//             currentY += 72;
//         });
//     }

//     // Vẽ danh sách tin nhắn và voice
//     drawStats(messagesStats, 150);
//     drawStats(voiceStats, 430);

//     // Vẽ avatar bot dưới dạng hình tròn
//     const botAvatar = await loadImage(client.user.displayAvatarURL({ extension: 'png', size: 128 }));
//     const avatarX = 875; // Vị trí X (trái)
//     const avatarY = 650; // Vị trí Y (trên)
//     const avatarRadius = 17.5; // Bán kính của hình tròn
//     ctx.save();
//     ctx.beginPath();
//     ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2, true); // Tạo vòng tròn ở vị trí (avatarX, avatarY)
//     ctx.closePath();
//     ctx.clip();
//     ctx.drawImage(botAvatar, avatarX, avatarY, 35, 35); // Vẽ ảnh vào canvas (avatarX, avatarY) và kích thước 35x35
//     ctx.restore();

//     // Chuyển canvas thành tệp hình ảnh để gửi
//     const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'server-stats.png' });

//     // Tạo menu chọn loại thống kê
//     const selectMenu = new StringSelectMenuBuilder()
//         .setCustomId('top-select-menu')
//         .setPlaceholder('Chọn loại thống kê bạn muốn xem')
//         .addOptions([
//             {
//                 label: '💬 tin nhắn trong kênh ',
//                 description: 'Xem thống kê tin nhắn hàng đầu',
//                 value: 'message',
//             },
//             {
//                 label: '🔊 Voice',
//                 description: 'Xem thống kê hoạt động voice hàng đầu',
//                 value: 'voice',
//             },
//         ]);
        
//     const row = new ActionRowBuilder().addComponents(selectMenu);
    
//     // Gửi tin nhắn ban đầu với menu và hình ảnh
//     const message = await interaction.reply({
//             files: [attachment],
//             components: [row],
            
//         });
//     },
// };