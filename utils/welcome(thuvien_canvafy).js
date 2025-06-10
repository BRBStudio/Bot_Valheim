"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');


/**
 * @typedef {object} WelcomeLeave
 * @see {WelcomeLeave}
 * @example const welcomeCard = await new canvafy.WelcomeLeave()
 * @example const leaveCard = await new canvafy.WelcomeLeave()
 * @type {Class}
 */
module.exports = class WelcomeLeave {
    constructor(options) {
        this.font = { name: options?.font?.name ?? "Poppins", path: options?.font?.path };
        this.avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
        this.background = {
            type: "color",
            background: "#23272a"
        };
        this.title = {
            data: "Welcome",
            color: "#fff",
            size: 36
        };
        this.description = {
            data: "Welcome to this server, go read the rules please!",
            color: "#a7b9c5",
            size: 26
        };
        this.overlay_opacity = 0;
        this.border;
        this.avatar_border = "#2a2e35";

        // Thêm fields ban đầu
        this.fields = [];
    }


        /**
         * .setAvatar
         * @param {string} image Set User Avatar URL
         * @returns {WelcomeLeave}
         * @example setAvatar("https://someone-image.png")
         */
    setAvatar(image) {
        this.avatar = image;
        return this;
    }

    /**
         * .setAvatarBorder
         * @param {string} color Set Avatar Avatar Border Color
         * @returns {WelcomeLeave}
         * @example setAvatarBorder("#fff")
         */
    setAvatarBorder(color) {
        if (color) {
        if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
            this.avatar_border = color;
            return this;
        } else {
            throw new Error("Màu đối số trong phương thức setBorder không hợp lệ. Bạn phải cung cấp màu thập lục phân.")
        }
        } else {
        throw new Error("Bạn phải cung cấp màu thập lục phân làm đối số của phương thức setBorder.");
        }
    }


    /**
         * .setBackground
         * @param {string} type "image" or "color"
         * @param {string|Buffer|Image} value "url" or "hexcolor"
         * @returns {WelcomeLeave}
         * @example setBackground("image","https://someone-image.png")
         * @example setBackground("color","#000")
         */
    setBackground(type, value) {
        if (type === 'color') {
        if (value) {
            if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value)) {
            this.background.type = "color";
            this.background.background = value;
            return this;
            } else {
            throw new Error("Màu không hợp lệ cho đối số thứ hai trong phương thức setForeground. Bạn phải cung cấp màu thập lục phân.");
            }
        } else {
            throw new Error("Bạn phải cung cấp màu thập lục phân làm đối số thứ hai của phương thức setBackground.");
        }
        } else if (type === 'image') {
        if (value) {
            this.background.type = "image";
            this.background.background = value;
            return this;
        } else {
            throw new Error("Bạn phải cung cấp URL nền làm đối số thứ hai.");
        }
        } else {
        throw new Error("Đối số đầu tiên của setBackground phải là 'color' hoặc 'image'.");
        }
    }


    /**
         * .setBorder
         * @param {string} color "hexcolor"
         * @returns {WelcomeLeave}
         * @example setBorder("#fff")
         */
    setBorder(color) {
        if (color) {
        if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
            this.border = color;
            return this;
        } else {
            throw new Error("Màu đối số trong phương thức setBorder không hợp lệ. Bạn phải cung cấp màu thập lục phân.")
        }
        } else {
        throw new Error("Bạn phải cung cấp màu thập lục phân làm đối số của phương thức setBorder.");
        }
    }

    /**
         * .setDescription
         * @param {string} text Description
         * @param {string} color "hexcolor"
         * @returns {WelcomeLeave}
         * @example setDescription("Welcome to Server.")
         */
    setDescription(text, color = "#00FFFF") {
        if (text) {
        // Tách chuỗi thành các dòng bằng ký tự xuống dòng
        const lines = text.split("\n");
        if (lines.some(line => line.length > 80)) {
            throw new Error("Mỗi dòng trong mô tả không được vượt quá 80 ký tự.");
        }
        this.description.data = lines; // Lưu các dòng vào mảng
        if (color) {
            if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
            this.description.color = color;
            }
        }
        } else {
        throw new Error("Bạn phải đưa ra một văn bản làm đối số đầu tiên của phương thức setDescription.");
        }

        return this;
    }

                                            
        /**
         * .setOverlayOpacity
         * @param {number} opacity must be between 0 and 1
         * @returns {WelcomeLeave}
         * @example setOverlayOpacity(0.6)
         */
    setOverlayOpacity(opacity = 0) {
        if (opacity) {
        if (opacity >= 0 && opacity <= 1) {
            this.overlay_opacity = opacity;
            return this;
        } else {
            throw new Error("Giá trị độ mờ của phương thức setOverlayOpacity phải nằm trong khoảng từ 0 đến 1 (bao gồm 0 và 1).");
        }
        }
    }

    /**
         * .setTitle
         * @param {string} text Title
         * @param {string} color "hexcolor"
         * @returns {WelcomeLeave}
         * @example setTitle("fivesobes")
         */
    setTitle(text, color = "#fff") {
        if (text) {
        if (text.length > 20) throw new Error("Kích thước tối đa của tiêu đề là 20 ký tự.");
        this.title.data = text;
        if (color) {
            if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
            this.title.color = color;
            }
        }
        } else {
        throw new Error("Bạn phải đưa ra một văn bản làm đối số đầu tiên của phương thức setDescription.");
        }

        return this;
    }

    addFields(fields) {
        if (!Array.isArray(fields)) {
            throw new Error("Đối số của addFields phải là một mảng các đối tượng.");
        }
        fields.forEach(field => {
            if (!field.title || !field.content) {
                throw new Error("Mỗi field phải có thuộc tính 'title' và 'content'.");
            }
            this.fields.push({
                title: field.title,
                content: field.content,
                color: field.color ?? "#fff",
                size: field.size ?? 22
            });
        });
        return this;
    }

    async build() {
        if (this.font.path) GlobalFonts.registerFromPath(this.font.path,this.font.name);

        const canvas = createCanvas(700, 350);
        const ctx = canvas.getContext("2d");

        // Vẽ border nếu có
        if(this.border){
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.strokeStyle = this.border;
        ctx.moveTo(55, 15);
        ctx.lineTo(canvas.width - 55, 15);
        ctx.quadraticCurveTo(canvas.width - 20, 20, canvas.width - 15, 55);
        ctx.lineTo(canvas.width - 15, canvas.height - 55);
        ctx.quadraticCurveTo(canvas.width - 20, canvas.height - 20, canvas.width - 55, canvas.height - 15);
        ctx.lineTo(55, canvas.height - 15);
        ctx.quadraticCurveTo(20, canvas.height - 20, 15, canvas.height - 55);
        ctx.lineTo(15, 55);
        ctx.quadraticCurveTo(20, 20, 55, 15);
        ctx.lineTo(56, 15);
        ctx.stroke();
        ctx.closePath();
        }
        
        // Vẽ nền
        ctx.beginPath();
        ctx.moveTo(65, 25);
        ctx.lineTo(canvas.width - 65, 25);
        ctx.quadraticCurveTo(canvas.width - 25, 25, canvas.width - 25, 65);
        ctx.lineTo(canvas.width - 25, canvas.height - 65);
        ctx.quadraticCurveTo(canvas.width - 25, canvas.height - 25, canvas.width - 65, canvas.height - 25);
        ctx.lineTo(65, canvas.height - 25);
        ctx.quadraticCurveTo(25, canvas.height - 25, 25, canvas.height - 65);
        ctx.lineTo(25, 65);
        ctx.quadraticCurveTo(25, 25, 65, 25);
        ctx.lineTo(66, 25);
        ctx.closePath();
        ctx.clip();

        ctx.globalAlpha = 1;

        if (this.background.type === "color") {
        ctx.beginPath();
        ctx.fillStyle = this.background.background;
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20)
        } else if (this.background.type === "image") {
            try {
                ctx.drawImage(await loadImage(this.background.background), 10, 10, canvas.width - 20, canvas.height - 20);
            } catch {
                throw new Error("Hình ảnh được cung cấp trong tham số thứ hai của phương thức setBackground không hợp lệ hoặc bạn chưa kết nối với Internet.");
            }
        }

        // Vẽ overlay nếu có
        ctx.beginPath();
        ctx.globalAlpha = this.overlay_opacity;
        ctx.fillStyle = "#000";
        ctx.moveTo(75, 45);
        ctx.lineTo(canvas.width - 75, 45);
        ctx.quadraticCurveTo(canvas.width - 45, 45, canvas.width - 45, 75);
        ctx.lineTo(canvas.width - 45, canvas.height - 75);
        ctx.quadraticCurveTo(canvas.width - 45, canvas.height - 45, canvas.width - 75, canvas.height - 45);
        ctx.lineTo(75, canvas.height - 45);
        ctx.quadraticCurveTo(45, canvas.height - 45, 45, canvas.height - 75);
        ctx.lineTo(45, 75);
        ctx.quadraticCurveTo(45, 45, 75, 45);
        ctx.fill();
        ctx.closePath();

        // Vẽ Title
        ctx.font = `bold ${this.title.size}px ${this.font.name}`;
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.title.color;
        ctx.textAlign = "center";
        ctx.fillText(this.title.data, canvas.width / 2, 225);

        // Vẽ Description
        ctx.font = `regular ${this.description.size}px ${this.font.name}`;
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.description.color;
        ctx.textAlign = "center";

        const lineHeight = this.description.size + 10; // Khoảng cách giữa các dòng
    const startY = 280 - (lineHeight * (this.description.data.length - 1)) / 2; // Tính vị trí dòng đầu tiên

    // Vẽ từng dòng
    this.description.data.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

        if (this.description.data.length > 35) {
        const texts = (function (string) {
            const array = [string, []];
            const substrings = string.split(" ");
            let i = substrings.length;

            do {
            i--;
            array[1].unshift(substrings[i]);
            substrings.pop();
            } while (substrings.join(" ").length > 35);

            array[0] = substrings.join(" ");
            array[1] = array[1].join(" ");
            return array;
        })(this.description.data);
        ctx.fillText(texts[0], canvas.width / 2, 260);
        ctx.fillText(texts[1], canvas.width / 2, 295);
        } else {
        ctx.fillText(this.description.data, canvas.width / 2, 260);
        }

        // Vẽ hình tròn avatar
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.avatar_border;
        ctx.arc(canvas.width / 2, 125, 66, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(canvas.width / 2, 125, 60, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        try {
            ctx.drawImage(await loadImage(this.avatar), canvas.width / 2 - 60, 65, 120, 120);
        } catch {
            throw new Error("Hình ảnh được đưa ra trong đối số của phương thức setAvatar không hợp lệ hoặc bạn chưa kết nối với internet.");
        }


        // Vẽ fields
        if (this.fields.length > 0) {
            let startY = 350; // Bắt đầu vẽ từ bên dưới mô tả
            this.fields.forEach(field => {
                // Vẽ tiêu đề
                ctx.font = `bold ${field.size}px ${this.font.name}`;
                ctx.fillStyle = field.color;
                ctx.textAlign = "left";
                ctx.fillText(field.title, 50, startY);

                // Vẽ nội dung
                ctx.font = `regular ${field.size}px ${this.font.name}`;
                ctx.fillText(field.content, 250, startY);

                startY += field.size + 20; // Tăng vị trí Y để vẽ field tiếp theo
            });
        }

        return canvas.toBuffer('image/png');
    }
};