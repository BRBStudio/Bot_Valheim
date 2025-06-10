const { SlashCommandBuilder } = require('@discordjs/builders');
const figlet = require('figlet');

// Hàm để tạo các biến thể chữ Ornate Parentheses
function createUniqueFont(text) {
    const fontVariants = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const variant = char.split('').map(c => {
            switch (c) {
                case 'a':
                    return '﴾ä̤﴿';
                case 'â':
                    return '﴾â̤̈﴿';
                case 'ă':
                    return '﴾ă̤̈﴿';
                case 'á':
                    return '﴾á̤̈﴿';
                case 'ã':
                    return '﴾ã̤̈﴿';
                case 'ả':
                    return '﴾ả̤̈﴿';
                case 'ạ':
                    return '﴾ạ̤̈﴿';
                case 'à':
                    return '﴾à̤̈﴿';
                case 'b':
                    return '﴾b̤̈﴿';
                case 'c':
                    return '﴾c̤̈﴿';
                case 'd':
                    return '﴾d̤̈﴿';
                case 'đ':
                    return '﴾đ̤̈﴿';
                case 'e':
                    return '﴾ë̤﴿';
                case 'ê':
                    return '﴾ê̤̈﴿';
                case 'ế':
                    return '﴾ế̤̈﴿';
                case 'ề':
                    return '﴾ề̤̈﴿';
                case 'ệ':
                    return '﴾ệ̤̈﴿';
                case 'ể':
                    return '﴾ể̤̈﴿';
                case 'f':
                    return '﴾f̤̈﴿'; // Ví dụ
                case 'g':
                    return '﴾g̤̈﴿';
                case 'h':
                    return '﴾ḧ̤﴿';
                case 'i':
                    return '﴾ï̤﴿';
                case 'í':
                    return '﴾í̤̈﴿';
                case 'ì':
                    return '﴾ì̤̈﴿';
                case 'ĩ':
                    return '﴾ĩ̤̈﴿';
                case 'ỉ':
                    return '﴾ỉ̤̈﴿';
                case 'ị':
                    return '﴾ị̤̈﴿';
                case 'j':
                    return '﴾j̤̈﴿';
                case 'k':
                    return '﴾k̤̈﴿';
                case 'l':
                    return '﴾l̤̈﴿';
                case 'm':
                    return '﴾m̤̈﴿';
                case 'n':
                    return '﴾n̤̈﴿';
                case 'o':
                    return '﴾ö̤﴿';
                case 'ô':
                    return '﴾ô̤̈﴿';
                case 'ố':
                    return '﴾ố̤̈﴿';
                case 'ồ':
                    return '﴾ồ̤̈﴿';
                case 'ổ':
                    return '﴾ổ̤̈﴿';
                case 'ỗ':
                    return '﴾ỗ̤̈﴿';
                case 'ộ':
                    return '﴾ộ̤̈﴿';
                case 'ơ':
                    return '﴾ơ̤̈﴿';
                case 'ớ':
                    return '﴾ớ̤̈﴿';
                case 'ờ':
                    return '﴾ờ̤̈﴿';
                case 'ỡ':
                    return '﴾ỡ̤̈﴿';
                case 'ợ':
                    return '﴾ợ̤̈﴿';
                case 'ở':
                    return '﴾ở̤̈﴿';
                case 'p':
                    return '﴾p̤̈﴿';
                case 'q':
                    return '﴾q̤̈﴿';
                case 'r':
                    return '﴾r̤̈﴿';
                case 's':
                    return '﴾s̤̈﴿';
                case 't':
                    return '﴾ẗ̤﴿';
                case 'u':
                    return '﴾ṳ﴿';
                case 'v':
                    return '﴾v̤̈﴿';
                case 'w':
                    return '﴾ẅ̤﴿';
                case 'x':
                    return '﴾ẍ̤﴿';
                case 'y':
                    return '﴾ÿ̤﴿';
                case 'z':
                    return '﴾z̤̈﴿';
                case '_':
                    return '﴾_̤̈﴿';
                case '`':
                    return '﴾`̤̈﴿';
                case '.':
                    return '﴾.̤̈﴿';
                case '?':
                    return '﴾?̤̈﴿';
                case '<':
                    return '﴾<̤̈﴿';
                case '>':
                    return '﴾>̤̈﴿';
                case '/':
                    return '﴾/̤̈﴿';
                case '\\':
                    return '﴾\\̤̈﴿';
                case '(':
                    return '﴾(̤̈﴿';
                case ')':
                    return '﴾)̤̈﴿';
                case '*':
                    return '﴾*̤̈﴿';
                case '&':
                    return '﴾&̤̈﴿';
                case '^':
                    return '﴾^̤̈﴿';
                case '%':
                    return '﴾%̤̈﴿';
                case '$':
                    return '﴾$̤̈﴿';
                case '#':
                    return '﴾#̤ ̈﴿';
                case '@':
                    return '﴾@̤̈﴿';
                case '!':
                    return '﴾!̤̈﴿';
                case '~':
                    return '﴾~̤̈﴿';
                case '+':
                    return '﴾+̤̈﴿';
                case '-':
                    return '﴾-̤̈﴿';
                case '.':
                    return '﴾.̤̈﴿';
                case ';':
                    return '﴾;̤̈﴿';
                case '{':
                    return '﴾{̤̈﴿';
                case '}':
                    return '﴾}̤̈﴿';
                case ':':
                    return '﴾:̤̈﴿';
                case '"':
                    return '﴾"̤̈﴿';
                case `'`:
                    return `﴾'̤̈﴿`;
                case ',':
                    return '﴾,̤̈﴿';
                case '=':
                    return '﴾=̤̈﴿';
                case '|':
                    return '﴾|̤̈﴿';
                case '0':
                    return '﴾0̤̈﴿';
                case '1':
                    return '﴾1̤̈﴿';
                case '2':
                    return '﴾2̤̈﴿';
                case '3':
                    return '﴾3̤̈﴿';
                case '4':
                    return '﴾4̤̈﴿';
                case '5':
                    return '﴾5̤̈﴿';
                case '6':
                    return '﴾6̤̈﴿';
                case '7':
                    return '﴾7̤̈﴿';
                case '8':
                    return '﴾8̤̈﴿';
                case '9':
                    return '﴾9̤̈﴿';
                case ' ':
                    return '﴾ ̤̈﴿'; // Ví dụ
                // Thêm các biến thể chữ khác ở đây
                default:
                    return c;
            }
        }).join('');
        fontVariants.push(variant);
    }
    return fontVariants.join('');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('font')
        .setDescription('⌨️ | Chuyển đổi văn bản sang các phông chữ đặc biệt.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ascii')
                .setDescription('🔠 | Chuyển đổi văn bản sang nghệ thuật ASCII.')
                .addStringOption(option =>
                    option.setName('text')
                        .setDescription('Văn bản cần chuyển đổi sang nghệ thuật ASCII (Nhớ viết không có dấu). Ví dụ: di choi di')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ornate-parentheses')
                .setDescription('🔠 | Chuyển đổi văn bản sang nghệ thuật Ornate Parentheses.')
                .addStringOption(option =>
                    option.setName('text')
                        .setDescription('Văn bản cần chuyển đổi sang nghệ thuật Ornate Parentheses (có thể viết có dấu). Ví dụ: đi chơi đi')
                        .setRequired(true))
        ),

        guildSpecific: true,
        guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`],

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();
            const text = interaction.options.getString('text');

            if (subcommand === 'ascii') {
                figlet(text, (err, data) => {
                    if (err) {
                        console.error(err);
                        interaction.reply('Không thể chuyển đổi văn bản thành nghệ thuật ASCII.');
                    } else {
                        interaction.reply('```yml\n\n' + data + '\n```');
                    }
                });
            } else if (subcommand === 'ornate-parentheses') {
                const asciiText = createUniqueFont(text);
                interaction.reply('```yml\n\n' + asciiText + '\n```');
            } else {
                interaction.reply('Lựa chọn không hợp lệ.');
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Đã xảy ra lỗi khi xử lý yêu cầu.');
        }
    },
};
