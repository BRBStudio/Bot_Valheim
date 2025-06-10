const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const { execSync } = require('child_process');
const Napi = require('@napi-rs/canvas');

// const colorList = ['red', 'yellow', 'green', 'blue', 'purple', 'rainbow'];
const PIXEL_SIZE = 16;
const FRAME_COUNT = 90; // 135
const WIDTH = 1280; // 1920 1280
const HEIGHT = 720; // 1080 720
const CHARACTERS = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ";

function randomCharacter() {
    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function getRandomColor() {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
}

// Hàm nội suy màu
function lerpColor(color1, color2, t) {
    const c1 = color1.match(/\d+/g).map(Number);
    const c2 = color2.match(/\d+/g).map(Number);
    const interpolated = c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
    return `rgba(${interpolated.join(',')})`;
}

// Lấy màu dựa theo vị trí Y
function getGradientColor(y) {
    let t;
    if (y < HEIGHT / 3) {
        t = y / (HEIGHT / 3);
        // return lerpColor('rgba(255, 0, 0, 1)', 'rgba(128, 0, 128, 1)', t);
        return lerpColor('rgba(0, 255, 255, 1)', 'rgba(0, 0, 255, 1)', t);
    } else if (y < (2 * HEIGHT) / 3) {
        t = (y - HEIGHT / 3) / (HEIGHT / 3);
        // return lerpColor('rgba(128, 0, 128, 1)', 'rgba(0, 0, 255, 1)', t);
        return lerpColor('rgba(0, 0, 255, 1)', 'rgba(128, 0, 128, 1)', t);
    } else {
        t = (y - (2 * HEIGHT) / 3) / (HEIGHT / 3);
        // return lerpColor('rgba(0, 0, 255, 1)', 'rgba(0, 255, 255, 1)', t);
        return lerpColor('rgba(128, 0, 128, 1)', 'rgba(255, 0, 0, 1)', t);
    }
}


function generateFrames(color, text) {
    fs.mkdirSync('./frames', { recursive: true });
    
    if (text.length > 12) {
        text = text.slice(0, 12) + '...';
    }

    const columns = Math.floor(WIDTH / PIXEL_SIZE);
    const rows = 5;
    
    // Fix lỗi undefined: Đảm bảo mỗi phần tử có `y` và `chars`
    let charMatrix = Array.from({ length: columns }, () => ({
        y: Math.random() * HEIGHT,
        chars: Array.from({ length: rows }, () => randomCharacter()),
    }));

    for (let i = 0; i < FRAME_COUNT; i++) {
        const canvas = Napi.createCanvas(WIDTH, HEIGHT);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.font = `${PIXEL_SIZE}px monospace`;
        ctx.fillStyle = color;

        if (color === 'red') {

            for (let x = 0; x < columns; x++) {
                let column = charMatrix[x];
        
                // Tạo chữ rõ nét
                ctx.fillStyle = 'rgba(0, 255, 255)';
                for (let j = 0; j < rows; j++) {
                    column.chars[j] = randomCharacter();
                    ctx.fillText(column.chars[j], x * PIXEL_SIZE, column.y + j * PIXEL_SIZE);
                }
        
                // Tạo chữ có độ trong suốt để làm hiệu ứng
                ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.5 + 0.2})`;
                for (let j = 0; j < rows; j++) {
                    column.chars[j] = randomCharacter();
                    ctx.fillText(column.chars[j], x * PIXEL_SIZE, column.y * 2 + j * PIXEL_SIZE);
                }
        
                // Cập nhật vị trí rơi với tốc độ khác nhau
                column.y += PIXEL_SIZE * 2;
                if (column.y > HEIGHT) {
                    column.y = 0;
                }
            }
            

        } else if (color === 'yellow') {
            for (let x = 0; x < WIDTH; x += PIXEL_SIZE * 2) {
                ctx.fillText(randomCharacter(), x, PIXEL_SIZE);
                ctx.fillText(randomCharacter(), x, HEIGHT - PIXEL_SIZE);
            }
            for (let y = PIXEL_SIZE; y < HEIGHT; y += PIXEL_SIZE * 2) {
                ctx.fillText(randomCharacter(), PIXEL_SIZE, y);
                ctx.fillText(randomCharacter(), WIDTH - PIXEL_SIZE, y);
            }
        } else if (color === 'green') {
            for (let j = 0; j < 300; j++) {
                ctx.fillText(randomCharacter(), Math.random() * WIDTH, (i * PIXEL_SIZE) % HEIGHT);
            }
        } else if (color === 'orange') {
            
            for (let x = 0; x < columns; x++) {
                let column = charMatrix[x];
    
                for (let j = 0; j < rows; j++) {
                    let charY = column.y + j * PIXEL_SIZE;
                    let colorGradient = getGradientColor(charY);
                    ctx.fillStyle = colorGradient;
                    ctx.globalAlpha = Math.random() * 0.5 + 0.5; // Hiệu ứng mờ sáng
                    column.chars[j] = randomCharacter();
                    ctx.fillText(column.chars[j], x * PIXEL_SIZE, charY);
                }
    
                column.y += PIXEL_SIZE * 1.5;
                if (column.y > HEIGHT) {
                    column.y = 0;
                }
            }
        } else if (color === 'purple') {
            for (let theta = 0; theta < Math.PI * 2; theta += 0.1) {
                let x = WIDTH / 2 + Math.cos(theta + i * 0.1) * 300;
                let y = HEIGHT / 2 + Math.sin(theta + i * 0.1) * 300;
                ctx.fillText(randomCharacter(), x, y);
            }
        } else if (color === 'rainbow') {
            for (let j = 0; j < 500; j++) {
                ctx.fillStyle = getRandomColor();
                ctx.fillText(randomCharacter(), Math.random() * WIDTH, Math.random() * HEIGHT);
            }
        } else if (color === 'cyan') {
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;
            const maxRadius = Math.min(WIDTH, HEIGHT) / 2;
            const numColors = 6; // Số màu sử dụng cho các vòng
        
            for (let x = 0; x < columns; x++) {
                let column = charMatrix[x];
                for (let j = 0; j < rows; j++) {
                    let angle = ((x + j) / columns) * Math.PI * 2 + (i * 0.05); // Góc xoáy theo thời gian
                    let radius = (j / rows) * maxRadius; // Bán kính tăng dần từ ngoài vào trong
                    let charX = centerX + Math.cos(angle) * radius;
                    let charY = centerY + Math.sin(angle) * radius;
        
                    // Xác định màu theo từng vòng tròn
                    let colorIndex = Math.floor((radius / maxRadius) * numColors);
                    let circleColors = ['#FF4500', '#FF8C00', '#FFD700', '#ADFF2F', '#00CED1', '#8A2BE2']; // Các màu khác nhau
                    ctx.fillStyle = circleColors[colorIndex % circleColors.length]; // Chọn màu theo vòng
        
                    column.chars[j] = randomCharacter();
                    ctx.fillText(column.chars[j], charX, charY);
                }
        
                column.y += PIXEL_SIZE * 1.5;
                if (column.y > HEIGHT) {
                    column.y = 0;
                }
            }
        } else if (color === 'gray') { 
            let columnColors = Array.from({ length: columns }, () => getRandomColor());
            let speeds = Array.from({ length: columns }, () => Math.random() * 2 + 1);

            for (let x = 0; x < columns; x++) {
                let column = charMatrix[x];

                for (let j = 0; j < rows; j++) {
                    let charY = column.y + j * PIXEL_SIZE;
                    ctx.fillStyle = columnColors[x];
                    ctx.globalAlpha = Math.random() * 0.5 + 0.5; // hiệu ứng mờ cho ký tự rơi
                    column.chars[j] = randomCharacter();
                    ctx.fillText(column.chars[j], x * PIXEL_SIZE, charY);
                }

                column.y += speeds[x] * PIXEL_SIZE;
                if (column.y > HEIGHT) {
                    column.y = 0;
                    columnColors[x] = getRandomColor(); // Đổi màu cột khi reset
                    speeds[x] = Math.random() * 2 + 1;  // Cập nhật tốc độ rơi mới
                }
            }
        }

        // Thêm chữ vào trung tâm
        // ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = `bold ${PIXEL_SIZE * 5}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(text, WIDTH / 2, HEIGHT / 2 + PIXEL_SIZE * 2);

        fs.writeFileSync(`./frames/${i}.png`, canvas.encodeSync('png'));
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('matrix')
        .setDescription('Tạo chữ kí ma trận màu')
        .addStringOption(option =>
            option.setName('effect')
                .setDescription('Chọn hiệu ứng')
                .setRequired(true)            
                .addChoices(
                    { name: 'Ma Trận', value: 'red' },
                    { name: 'Khung chữ nhật', value: 'yellow' },
                    { name: 'Quét mã', value: 'green' },
                    { name: 'Mưa', value: 'orange' },
                    { name: 'Vòng tròn', value: 'purple' },
                    { name: 'vòng xoáy', value: 'cyan' },
                    { name: 'Cầu vồng', value: 'rainbow' },
                    { name: 'Mưa Cầu vồng', value: 'gray' }
                )
            )                
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập chữ vào giữa')
                .setRequired(false)),

    // guildSpecific: true,
    // guildId: ['1319809040032989275'],

    async execute(interaction) {
        await interaction.deferReply();
        const selectedColor = interaction.options.getString('effect');
        const inputText = interaction.options.getString('text') || '';
        generateFrames(selectedColor, inputText);
        execSync('ffmpeg -y -framerate 10 -i ./frames/%d.png output.gif', { stdio: 'ignore' });
        const attachment = new AttachmentBuilder('./output.gif');
        await interaction.editReply({ files: [attachment] });
        process.platform === 'win32' ? execSync('del /f /q output.gif & rmdir /s /q frames') : execSync('rm -rf ./frames output.gif');
    }
};