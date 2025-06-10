const { EmbedBuilder } = require('discord.js');

class EmbedBRB {
    constructor(interaction) {
        this.interaction = interaction;
        this.data = {
            color: null,
            title: null,
            description: null,
            fields: [],
            timestamp: false,
            author: null,
            footer: null,
            image: null,
            thumbnail: null,
            stringOptions: {},
        };

        // ✅ Khởi tạo biến ảo dùng trong cú pháp embed: bot, nd, mc
        global.bot = interaction.client.user;
        global.nd = interaction.user; 
        global.mc = interaction.guild;
        global.ndsv = interaction.member;
        
        // Fallback avatar URL: ưu tiên avatar server riêng, nếu không có thì avatar toàn cục
    this.avatarUrl = this.getAvatarUrl();
    // Patch tự động interaction ngay khi tạo instance
        EmbedBRB.patchInteraction(interaction);
    }

    // Lấy avatar ưu tiên avatar server riêng, fallback avatar toàn cục
    getAvatarUrl() {
        // Nếu ndsv (member) có avatar server riêng, trả về URL
        if (global.ndsv && global.ndsv.avatarURL()) {
        return global.ndsv.avatarURL({ dynamic: true, size: 512 });
        }
        // Nếu không có avatar server riêng hoặc null, dùng avatar toàn cục user
        if (global.nd && global.nd.avatarURL()) {
        return global.nd.avatarURL({ dynamic: true, size: 512 });
        }
        // Trường hợp không có avatar nào thì trả về null hoặc một avatar mặc định nếu cần
        return null;
    }

    Mau(color) {
        const colorsMap = {
            xanh: 0x00ff00, green: 0x00ff00,
            đỏ: 0xff0000, red: 0xff0000,
            vàng: 0xffff00, yellow: 0xffff00,
            xanh_dương: 0x0000ff, blue: 0x0000ff,
            tím: 0x800080, purple: 0x800080,
            cam: 0xffa500, orange: 0xffa500,
            hồng: 0xff69b4, pink: 0xff69b4,
            đen: 0x000000, black: 0x000000,
            trắng: 0xffffff, white: 0xffffff,
            xám: 0x808080, grey: 0x808080,
            xanh_đẹp: 0x00ffff, cyan: 0x00ffff,
        };

        if (typeof color === 'string') {
            color = color.toLowerCase().trim();
            if (color.startsWith('#')) {
                this.data.color = parseInt(color.slice(1), 16);
            } else if (color.startsWith('0x')) {
                this.data.color = parseInt(color, 16);
            } else if (colorsMap[color]) {
                this.data.color = colorsMap[color];
            } else {
                this.data.color = 0xffffff;
            }
        } else if (typeof color === 'number') {
            this.data.color = color;
        }

        return this;
    }

    Tieude(title) {
        this.data.title = title;
        return this;
    }

    Noidung(description) {
        this.data.description = description;
        return this;
    }

    Truong(...fields) {
        if (fields.length === 1 && Array.isArray(fields[0])) {
            this.data.fields = fields[0];
        } else {
            this.data.fields = fields;
        }
        return this;
    }

    tg_guitn() {
        this.data.timestamp = true;
        return this;
    }

    Tacgia(name, iconURL = null, url = null) {
        this.data.author = { name };

        if (iconURL) {
            this.data.author.iconURL = iconURL;
        }

        if (url) {
            this.data.author.url = url;
        } else {
            // Nếu không có url truyền vào, tự động tạo url theo user interaction
            if (this.interaction && this.interaction.user && this.interaction.user.id) {
                this.data.author.url = `https://discord.com/users/${this.interaction.user.id}`;
            }
        }

        return this;
    }

    Chantrang(text, iconURL = null) {
        this.data.footer = { text };
        if (iconURL) this.data.footer.iconURL = iconURL;
        return this;
    }

    Anh(url) {
        this.data.image = url;
        return this;
    }

    Avatar(url) {
        this.data.thumbnail = url;
        return this;
    }

    ThemLuaChon(key, value) {
        if (typeof key === 'string' && typeof value === 'string') {
            this.data.stringOptions[key] = value;
        }
        return this;
    }

    /**
     * Tự động lấy tất cả option user và convert về string mention + tag
     */
    AutoFromUsers() {
        if (!this.interaction?.options) return this;

        const users = this.interaction.options._hoistedOptions.filter(opt => opt.type === 6); // USER
        for (const userOpt of users) {
            const user = this.interaction.options.getUser(userOpt.name);
            const member = this.interaction.options.getMember ? this.interaction.options.getMember(userOpt.name) : null;

            if (user) {
                if (member && member.displayName) {
                    this.data.stringOptions[userOpt.name] = `<@${user.id}> (${member.displayName})`;
                } else {
                    this.data.stringOptions[userOpt.name] = `<@${user.id}> (${user.tag})`;
                }
            }
        }
        return this;
    }


    /**
     * Tự động lấy mọi loại option phổ biến, convert theo kiểu và thêm vào stringOptions
     */
    AutoAllOptions() {
        if (!this.interaction?.options) return this;

        const optionTypeMap = {
            3: 'getString',       // STRING
            4: 'getInteger',      // INTEGER
            5: 'getBoolean',      // BOOLEAN
            6: 'getUser',         // USER
            7: 'getChannel',      // CHANNEL
            8: 'getRole',         // ROLE
            9: 'getMentionable',  // MENTIONABLE
            10: 'getNumber'       // NUMBER
        };

        for (const opt of this.interaction.options.data) {
            const getter = optionTypeMap[opt.type];
            if (!getter) continue;

            let value = this.interaction.options[getter](opt.name);

            if (value?.id) {
                if (opt.type === 6) value = `<@${value.id}> (${value.tag})`;            // User
                else if (opt.type === 7) value = `<#${value.id}>`;                      // Channel
                else if (opt.type === 8) value = `<@&${value.id}>`;                     // Role
                else if (opt.type === 9) value = value.user ? `<@${value.id}>` : `<@&${value.id}>`; // Mentionable
            } else if (typeof value === 'boolean') {
                value = value ? '✅ Có' : '❌ Không';
            }

            this.data.stringOptions[opt.name] = value?.toString() ?? 'Không có';
        }

        return this;
    }

    _formatKeyName(key) {
        if (typeof key !== 'string') return key; // Nếu key không phải là chuỗi, trả về nguyên bản luôn (không thay đổi)
        
        const spaced = key.replace(/_/g, ' '); // Thay tất cả dấu gạch dưới (_) trong chuỗi thành dấu cách (space)
        // viết hoa chữ cái đầu
        return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase(); // Viết hoa chữ cái đầu của chuỗi, rồi nối phần còn lại viết thường
    }



    toDiscordEmbed() {
        const embed = new EmbedBuilder();
        if (this.data.color !== null) embed.setColor(this.data.color);
        if (this.data.title) embed.setTitle(this.data.title);
        if (this.data.description) embed.setDescription(this.data.description);
        // if (this.data.fields.length > 0) embed.addFields(this.data.fields);

        // Nếu có fields thủ công đã set
        const fields = [...this.data.fields];

        // 👉 Thêm fields từ stringOptions nếu có
        // for (const [key, value] of Object.entries(this.data.stringOptions)) {
        //     fields.push({ name: key, value: value || '\u200B', inline: false });
        // }

        for (const [key, value] of Object.entries(this.data.stringOptions)) {
    const formattedKey = this._formatKeyName(key);
    fields.push({ name: formattedKey, value: value || '\u200B', inline: false });
}



        if (fields.length > 0) embed.addFields(fields);

        if (this.data.timestamp) embed.setTimestamp();
        if (this.data.author) embed.setAuthor(this.data.author);
        if (this.data.footer) embed.setFooter(this.data.footer);
        if (this.data.image) embed.setImage(this.data.image);
        if (this.data.thumbnail) embed.setThumbnail(this.data.thumbnail);
        return embed;
    }

    /**
     * Patch interaction.reply, editReply, followUp để hỗ trợ .tnn (EmbedBRB)
     */
    static patchInteraction(interaction) {
        const patch = (method) => {
            const original = interaction[method].bind(interaction);
            interaction[method] = async (options) => {
                if (options?.tnn) {
                    const mappedEmbeds = options.tnn
                        .map(e => e?.toDiscordEmbed?.())
                        .filter(e => !!e);
                    if (mappedEmbeds.length > 0) {
                        options.embeds = mappedEmbeds;
                    }
                    delete options.tnn;
                }

                if ('emphemeral' in options) {
                    options.ephemeral = options.emphemeral;
                    delete options.emphemeral;
                }

                if ((!options.content || options.content.trim() === '') &&
                    (!options.embeds || options.embeds.length === 0)) {
                    options.content = '\u200B';
                }

                return await original(options);
            };
        };

        patch("reply");
        patch("editReply");
        patch("followUp");
    }
}

// Tạo biến global để dùng thẳng
global.reply = function(interaction) {
    EmbedBRB.patchInteraction(interaction);
};

module.exports = {
    EmbedBRB,
};


/*
     Dùng npm deprecate để cảnh báo khi cài đặt các phiên bản cũ
        Khi bạn phát hành phiên bản mới, bạn chạy lệnh:

        npm deprecate embed-brb@"<1.0.10" "Gói này đã lỗi thời và không còn được duy trì nữa. Vui lòng sử dụng npm i embed-brb để cập nhật phiên bản mới thay thế"
        Khi người dùng cài phiên bản thấp hơn 1.0.10, npm sẽ báo ngay cảnh báo deprecate trên terminal.

        Đây là cách chuẩn của npm để cảnh báo package lỗi thời.
        */