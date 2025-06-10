const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hack',
    description: '🔸 Hack vào tài khoản của người dùng (đùa chút thôi)',
    hd: '🔸 ?hack <@tag_người_dùng>',
    aliases: ['hk', 'tv3'],
    async execute(msg) {
        // Lấy đối tượng người dùng từ tên người dùng được nhập vào
        const target = msg.mentions.users.first();

        if (!target) {
            return msg.channel.send('Vui lòng tag một người dùng để hack!');
        }

        // Lấy trạng thái chính xác của người dùng
        const targetPresence = msg.guild.members.cache.get(target.id)?.presence;

        const createProgressBar = (percentage) => {
            const progressBarLength = 20;
            const progress = Math.round(progressBarLength * (percentage / 100));
            const progressBar = `[${'🟦'.repeat(progress)}${'⬜'.repeat(progressBarLength - progress)}] ${percentage}%`;
            return progressBar;
        };

        const embed1 = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`💻 **Bắt đầu hack vào tài khoản của ${target.displayName}....**`)
            .setDescription('⏳ Vui lòng đợi, quá trình này có thể mất vài phút.')
            .setThumbnail('https://cdn.akamai.steamstatic.com/steam/apps/378110/ss_c6377cde7b73ec0ebb83c654b918c4432bccc7c3.1920x1080.jpg?t=1499888635')
            .setImage(`https://www.gifcen.com/wp-content/uploads/2023/07/hacker-gif-8.gif`)
            .addFields(
                { name: '👤 Tên tài khoản:', value: target.displayName, inline: true },
                { name: '🔖 Người phân biệt đối xử:', value: target.discriminator, inline: true },
                { name: '🆔 ID:', value: target.id, inline: true },
                { name: '🟢 Trạng thái:', value: targetPresence?.status || 'Offline' || 'Offline', inline: true }, // target.presence?.status
            )
            .setTimestamp()
            .setFooter({ text: '🃏 Đây chỉ là một trò đùa, xin đừng nghiêm túc.' });

            const initialMessage = await msg.channel.send({ embeds: [embed1] });

        // let progress = 0;

        // const updateProgress = () => {
        //     progress += 10;
        //     const progressBar = createProgressBar(progress);
        //     initialMessage.edit({ content: progressBar });
        // };

        // const interval = setInterval(() => {
        //     updateProgress();
        //     if (progress >= 100) {
        //         clearInterval(interval);
        //     }
        // }, 1000);

        // Hiển thị thanh tiến trình 20%
        await initialMessage.edit({ content: createProgressBar(20) });

        let progress = 20;

        // Mô phỏng quá trình thu thập dữ liệu
        await new Promise(resolve => setTimeout(resolve, 5000));

        setTimeout(async () => {
            const embed2 = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('🤔 **Thu thập thông tin...**')
                .setDescription('⏳ Vui lòng đợi, quá trình này có thể mất thêm vài phút nữa.')
                .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUtGdSqpfgSX15QrZW1dOkAs4thGF_9-mdSX67If44Rw&s')
                .setImage(`https://i.pinimg.com/originals/8b/e4/ef/8be4efc0a8e5bc4903aae00db82cb982.gif`)
                .addFields(
                    { name: '👤 Tên tài khoản:', value: target.displayName, inline: true },
                    { name: '🔖 Người phân biệt đối xử:', value: target.discriminator, inline: true },
                    { name: '🆔 ID:', value: target.id, inline: true },
                    { name: '🟢 Trạng thái:', value: targetPresence?.status || 'Offline', inline: true },
                    { name: '🔍 Địa chỉ IP:', value: '127.0.0.1', inline: true },
                    { name: '🔐 Cấp độ bảo mật:', value: 'Cao', inline: true },
                )
                .setTimestamp()
                .setFooter({ text: '🃏 Đây chỉ là một trò đùa, xin đừng nghiêm túc.' });

                // initialMessage.edit({ embeds: [embed2] });
                await initialMessage.edit({ embeds: [embed2], content: createProgressBar(40) });

                progress = 40;

           // Mô phỏng quá trình thu thập dữ liệu
            await new Promise(resolve => setTimeout(resolve, 10000));

            const generateRandomCreditCard = () => {
                // Tạo số thẻ tín dụng với 4 nhóm số ngẫu nhiên
                const firstNum = Math.floor(1000 + Math.random() * 9000);
                const secondNum = Math.floor(1000 + Math.random() * 9000);
                const thirdNum = Math.floor(1000 + Math.random() * 9000);
                const fourthNum = Math.floor(1000 + Math.random() * 9000);
                const cardNumber = `${firstNum} ${secondNum} ${thirdNum} ${fourthNum}`;
                
                // Tạo mã CVV ngẫu nhiên (3 số)
                const cvv = Math.floor(100 + Math.random() * 900);
                
                // Tạo ngày hết hạn ngẫu nhiên trong khoảng 1 đến 5 năm tới
                const expirationMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
                const expirationYear = new Date().getFullYear() + Math.floor(1 + Math.random() * 5);
            
                return {
                    cardNumber,
                    cvv,
                    expirationDate: `${expirationMonth}/${expirationYear}`
                };
            };

            // Sau đó, thay đổi đoạn embed nơi bạn gọi `generateRandomCreditCard` như sau:
            const creditCardInfo = generateRandomCreditCard();

            const generateRandomPassword = () => {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                const passwordLength = 12;
                let password = '';
                for (let i = 0; i < passwordLength; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    password += characters.charAt(randomIndex);
                }
                return password;
            };


            const generateMeaningfulWord = () => {
                const vowels = 'aeiou';
                const consonants = 'bcdfghjklmnpqrstvwxyz';
            
                let word = '';
                let length = Math.floor(Math.random() * 4) + 3; // Tạo từ có độ dài từ 3-6 ký tự
            
                for (let i = 0; i < length; i++) {
                    word += i % 2 === 0 
                        ? consonants[Math.floor(Math.random() * consonants.length)] 
                        : vowels[Math.floor(Math.random() * vowels.length)];
                }
            
                return word.charAt(0).toUpperCase() + word.slice(1); // Viết hoa chữ cái đầu
            };

            const generateRandomEmail = () => {
                const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
                const randomNumber = Math.floor(Math.random() * 9000);
                const randomDomain = domains[Math.floor(Math.random() * domains.length)];

                // // Hàm tạo chuỗi ngẫu nhiên gồm chữ cái (A-Z, a-z) với độ dài từ 6-12 ký tự
                // const generateRandomString = (length = 8) => {
                //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                //     return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
                // };

                // return `${generateRandomString(10)}${Math.floor(Math.random() * 9000)}@${randomDomain}`;

                const randomWord = generateMeaningfulWord(); // Hàm tạo chữ ngẫu nhiên có ý nghĩa

                return `${randomWord}${randomNumber}@${randomDomain}`;

                // return `Talahackkerday${Math.floor(Math.random() * 9000)}@${randomDomain}`;
                
            };



            const generateRandomPhone = () => {
                // Danh sách đầu số (4 số)
                const viettel = ['0966', '0978', '0983', '0865', '0391', '0382', '0376', '0364', '0357', '0348', '0339', '0325'];
                const vinaphone = ['0919', '0946', '0888', '0812', '0823', '0834', '0845', '0856'];
                const mobifone = ['0902', '0935', '0896', '0708', '0799', '0777', '0763', '0784'];

                // Gộp danh sách lại
                const allPrefixes = [...viettel, ...vinaphone, ...mobifone];

                // Chọn ngẫu nhiên một đầu số từ danh sách
                const areaCode = allPrefixes[Math.floor(Math.random() * allPrefixes.length)];

                // const areaCode = Math.floor(100 + Math.random() * 9000);
                const firstPart = Math.floor(100 + Math.random() * 900);
                const secondPart = Math.floor(100 + Math.random() * 900);
                return `${areaCode}.${firstPart}.${secondPart}`;
            };

            const generateRandomLocation = () => {
                const locations = ['Yên Bái', 'Hà Nội', 'Cần Thơ', 'Phú Quốc', 'Tây Ninh', 'Huế', 'Sài Gòn', 'DakLak', 'KonTum'];
                return locations[Math.floor(Math.random() * locations.length)];
            };

            const generateRandomDeviceType = () => {
                const deviceTypes = ['Desktop', 'Laptop', 'Smartphone', 'Tablet', 'Macbook', 'Windows', 'Trí tuệ nhân tạo', 'Linux', 'AppleWebKit', 'Macintosh', 'Intel Mac OS'];
                return deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
            };

            const generateRandomUserAgent = () => {
                const userAgents = [
                    'BRB Studio/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    'BRB Studio/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) CocCoc/65.0.3325.146 Safari/537.36',
                    'BRB Studio/5.0 (Linux; Android 25; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) CocCoc/74.0.3729.157 Mobile Safari/537.36',
                ];
                return userAgents[Math.floor(Math.random() * userAgents.length)];
            };

            const generateRandomIPAddress = () => {
                const octet = () => Math.floor(Math.random() * 256);
                return `${octet()}.${octet()}.${octet()}.${octet()}`;
            };

            const embed3 = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('🔍 **Bẻ khóa an ninh...**')
                .setDescription('🔓 Bẻ khóa các giao thức bảo mật...')
                .setThumbnail('https://ben.com.vn/tin-tuc/wp-content/uploads/2021/09/hack-mat-khau-wifi-may-tinh-1.jpg')
                .setImage(`https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2MzMzd3Y2s1aTl6NzYxcWc1OXc5cDUzd2pyMW4zYm1xYWpzd3lzYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ABfNx2KM7dB7O/giphy.gif`)
                .addFields(
                    { name: '👤 tên tài khoản:', value: target.displayName, inline: true },
                    { name: '🔖 Người phân biệt đối xử:', value: target.discriminator, inline: true },
                    { name: '🆔 ID:', value: target.id, inline: true },
                    { name: '🟢 Trạng thái:', value: targetPresence?.status || 'Offline', inline: true },
                    { name: '🔍 Địa chỉ IP:', value: generateRandomIPAddress(), inline: true },
                    { name: '🔐 Cấp độ bảo mật:', value: 'Cao', inline: true },
                    { name: '🔒 Mật khẩu:', value: generateRandomPassword(), inline: true },
                    { name: '📧 Địa chỉ email:', value: generateRandomEmail(), inline: true },
                    { name: '📞 Số điện thoại:', value: generateRandomPhone(), inline: true },
                    { name: '💳 Số thẻ tín dụng:', value: `Số thẻ: ${creditCardInfo.cardNumber}\nCvv: ${creditCardInfo.cvv}\nHạn sử dụng: ${creditCardInfo.expirationDate}`, inline: true },
                    { name: '🌍 Vị trí:', value: generateRandomLocation(), inline: true },
                    { name: '🖥️ Loại thiết bị:', value: generateRandomDeviceType(), inline: true },
                    { name: '🔎 Phần mềm hack:', value: generateRandomUserAgent(), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: '🃏 Đây chỉ là một trò đùa, xin đừng nghiêm túc.' });

                // initialMessage.edit({ embeds: [embed3] });
                await initialMessage.edit({ embeds: [embed3], content: createProgressBar(75) });

                progress = 75;

            // Mô phỏng quá trình bảo mật bẻ khóa
            await new Promise(resolve => setTimeout(resolve, 10000));

            const embed4 = new EmbedBuilder()
                .setColor('Red')
                .setTitle('✅ **Hack hoàn tất!**')
                .setDescription(`🔑 Đã hack thành công tài khoản ${target.displayName}.`)
                .setThumbnail('https://static.kaspersky.proguide.vn/image/2017/10/4/586_lam-gi-khi-nghi-ngo-tai-khoan-mang-bi-hack(1).jpg')
                .addFields(
                    { name: '🔒 Mật khẩu:', value: generateRandomPassword(), inline: true },
                    { name: '💳 Số thẻ tín dụng:', value: `Số thẻ: ${creditCardInfo.cardNumber}\nCvv: ${creditCardInfo.cvv}\nHạn sử dụng: ${creditCardInfo.expirationDate}`, inline: true },
                    { name: `\u200b`, value: `\u200b` },
                    { name: '📧 Địa chỉ email:', value: generateRandomEmail(), inline: true },
                    { name: '📞 Số điện thoại:', value: generateRandomPhone(), inline: true },
                    { name: `\u200b`, value: `\u200b` },
                    { name: '🌍 Vị trí:', value: generateRandomLocation(), inline: true },
                    { name: '🕒 Timestamp:', value: new Date().toLocaleString(), inline: true },
                    { name: `\u200b`, value: `\u200b` },
                    { name: '📱 Loại thiết bị:', value: generateRandomDeviceType(), inline: true },
                    { name: '🌐 Phần mềm hack:', value: generateRandomUserAgent(), inline: true },
                    { name: `\u200b`, value: `\u200b` },
                    { name: '🔍 Địa chỉ IP:', value: generateRandomIPAddress(), inline: true },
                )
                .setImage(`https://miro.medium.com/v2/resize:fit:720/format:webp/1*xZrSvUrS-6zQQBfevGed2w.gif`)
                .setTimestamp()
                .setFooter({ text: '🃏 Đây chỉ là một trò đùa, xin đừng nghiêm túc.' });

                // initialMessage.edit({ embeds: [embed4] });
                await initialMessage.edit({ embeds: [embed4], content: createProgressBar(100) });

                progress = 100;

        }, 20000);
    }
};
