const { ButtonBuilder, ButtonStyle } = require('discord.js');

/*
*
*
*
**  Nếu muốn lấy thông tin homeButton, inviteButton cho vào components:[] ( xuất hiện nút trên 1 dòng)
    thì sử dụng components: [new ActionRowBuilder().addComponents(homeButton, inviteButton)]

**  LƯU Ý: const { homeButton, deleteButton } = require('../../ButtonPlace/ButtonBuilder'); để chúng vào nơi muốn lấy ra
*
*
*
*/

// Nơi ButtonBuilder với nút riêng lẻ

// Nơi ButtonBuilder với nút riêng lẻ
const button6 = new ButtonBuilder()
            .setCustomId("button6")
            .setLabel("Trang chủ")
            .setStyle(ButtonStyle.Primary);

const button7 = new ButtonBuilder()
            .setCustomId("button7")
            .setLabel("Báo cáo")
            .setStyle(ButtonStyle.Primary);

const button8 = new ButtonBuilder()
            .setCustomId("button8")
            .setLabel("Mời bot")
            .setStyle(ButtonStyle.Primary);

const button9 = new ButtonBuilder()
            .setCustomId("button9")
            .setLabel("Xóa bỏ")
            .setStyle(ButtonStyle.Danger);

const button10 = new ButtonBuilder()
            .setCustomId("button10")
            .setLabel(`Trở về trang trước`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`<a:K5ZDT5iOVH:1250106818483720264>`)

const verifyDefault = new ButtonBuilder()
            .setCustomId('verify-default')
            .setLabel('Tôi đồng ý và chấp hành quy định luật')
            .setStyle(ButtonStyle.Success)
            .setEmoji("<:_verified_:1240060278863958056>")

const verifyButtonCustom = new ButtonBuilder()
            .setCustomId(`verify-cs`)
            .setLabel(`Đây là nút custom`)
            .setDisabled()
            .setStyle(ButtonStyle.Success)

const translate_tiengviet = new ButtonBuilder()
            .setCustomId('translate_tiengviet')
            .setLabel('Tiếng Việt')
            .setStyle('Primary');
        
const translate_tienganh = new ButtonBuilder()
            .setCustomId('translate_tienganh')
            .setLabel('Tiếng Anh')
            .setStyle('Primary');

const translate_cancel = new ButtonBuilder()
            .setCustomId('translate_cancel')
            .setLabel('Không Dịch Nữa')
            .setStyle('Primary');


// Xuất các nút và hành động
module.exports = {
    button6,
    button7,
    button8,
    button9,
    button10,
    verifyDefault,
    verifyButtonCustom,
    translate_tiengviet,
    translate_tienganh,
    translate_cancel,
};
