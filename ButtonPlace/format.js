// format.js
const Bvoice = `Bvoice (tên kênh thoại bạn muốn tạo) - (tên danh mục bạn chọn để kênh thoại vào).\nví dụ Bvoice a-b (trong đó a là tên kênh thoại, b là tên danh mục chọn)`;

const helpValheim = `@BRB Studio (mặc định là tag bot BRB studio) - (tên lệnh).\nví dụ: @Mới help valheim`;

// setup kênh thread
const bsetupforum = `Bạn cần cung cấp đủ các thông tin theo định dạng yêu cầu. Ví dụ cách viết đúng: \n` +
                `\`bsetupforum-rồng vàng-COUNTER-Nhấp vào nút để đăng bài\\nmỗi bài có 25 kí tự-thẻ 1 + thẻ 2 + thẻ kim cương-chơi game-game valheim không mọi người?-🎉\`\n\n` +
                `Trong đó: \n` +
                `- \`rồng vàng\`: Tên diễn đàn.\n` +
                `- \`COUNTER\`: Tên danh mục.\n` +
                `- \`Nhấp vào nút để đăng bài\\nmỗi bài có 25 kí tự\`: Hướng dẫn bài viết. Ký tự \\n sẽ được thay thế bằng xuống dòng thực tế.\n` +
                `- \`thẻ 1 + thẻ 2 + thẻ kim cương\`: Các thẻ của diễn đàn (ngăn cách bằng dấu cộng '+').\n` +
                `- \`chơi game\`: Tiêu đề bài viết.\n` +
                `- \`game valheim không mọi người?\`: Nội dung bài viết.\n` +
                `- \`🎉\`: chọn Emoji mặc định là 🎉.\n\n` +
                `<a:nu_1dF8UBv:1249331268332552213> \`ĐIỀU NÀY CÓ THỂ BẠN SẼ QUAN TÂM\`: Nếu bạn viết tên danh mục không tồn tại trong máy chủ của bạn ` +
                `thì kênh diễn đàn vẫn sẽ được tạo, nhưng không nằm trong danh mục nào hết.`;

const BảngGiá = `@TênBot Bảng Giá <gói giá trị 1>, <gói giá trị 2>, <gói giá trị 3>, <gói giá trị 4>, [Tiêu đề tùy chọn (không bắt buộc)].\n\n` +
                `Ví dụ: @BRB Studio bảng Giá 5.000 vnd = 5000 vàng valheim, ` +
                `20.000 vnd = 2.000 vàng valheim, 50.000 vnd = 5000 vàng valheim + 1000 vàng valheim (thưởng thêm), 100.000 vnd = 10.000 vàng valheim + 3.000 (thưởng thêm)\n\n` + 
                `Trong đó: \n` +
                `- \`5.000 vnd = 5000vàng valheim\`: sẽ được chuyển vào <gói giá trị 1> (bắt buộc phải có).\n` +

                `- \`20.000 vnd = 2.000 vàng valheim\`: sẽ được chuyển vào <gói giá trị 2> (bắt buộc phải có).\n` +

                `- \`50.000 vnd = 5000 vàng valheim + 1000 vàng valheim (thưởng thêm)\`: sẽ được chuyển vào <gói giá trị 3> (bắt buộc phải có).\n` +

                `- \`100.000 vnd = 10.000 vàng valheim + 3.000 (thưởng thêm)\`: sẽ được chuyển vào <gói giá trị 4> (bắt buộc phải có).\n` +

                `- [Tiêu đề tùy chọn (không bắt buộc)] sẽ được viết ở cuối cùng, bạn có thể thay đổi tiêu đề sao cho phù hợp với mục đích của bạn, ` +
                `nếu không có thì sẽ là tiêu đề mặc định\n\n` +

                `<a:warning:1298736999594721300><a:warning:1298736999594721300><a:warning:1298736999594721300> \`LƯU Ý LỆNH TẠO BẢNG GIÁ\`: MỖI DỮ LIỆU ĐƯỢC CÁCH NHAU BỞI DẤU ` +
                `"," ĐỂ TRUYỀN ĐÚNG DỮ LIỆU THEO ĐÚNG THỨ TỰ.\n\n` +

                `Tóm lại với lệnh tạo bảng giá bạn CÓ THỂ TÙY Ý ĐƯA RA GIÁ  phù hợp với máy chủ và tiêu chí của bạn, đồng thời CÓ THỂ THAY ĐỔI TIÊU ĐỀ THEO 3 cách dưới đây\n\n` +

                `- CÁCH 1: @BRB Studio bảng Giá 5.000 vnd = 500 vàng valheim, 20.000 vnd = 2.000 vàng valheim, 50.000 vnd = 5000 vàng valheim ` +
                `+ 1000 vàng valheim (thưởng thêm), 100.000 vnd = 10.000 vàng valheim + 3.000 (thưởng thêm) [ MẶC ĐỊNH TIÊU ĐỀ LÀ BẢNG GIÁ QUY ĐỔI VÀNG VALHEIM HÔM NAY ]\n\n` +

                `- CÁCH 2: @BRB Studio bảng Giá 5.000 vnd = 500 vàng valheim,  20.000 vnd = 2.000 vàng valheim, 50.000 vnd = 5000 vàng valheim` +
                `+ 1000 vàng valheim (thưởng thêm), 100.000 vnd = 10.000 vàng valheim + 3.000 (thưởng thêm), [ TIÊU ĐỀ SẼ CHỈ CÒN BẢNG GIÁ QUY ĐỔI HÔM NAY VÌ BẠN ĐÃ THÊM "," ` +
                `CUỐI CÙNG ]\n\n` +

                `- CÁCH 3: @BRB Studio bảng Giá 5.000 vnd = 500 vàng valheim,  20.000 vnd = 2.000 vàng valheim, 50.000 vnd = 5000 vàng valheim` +
                `+ 1000 vàng valheim (thưởng thêm), 100.000 vnd = 10.000 vàng valheim + 3.000 (thưởng thêm), test [ TIÊU ĐỀ SẼ ĐƯỢC ĐỔI THEO YÊU CẦU CỦA BẠN LÀ test, ` +
                `BẠN CŨNG CÓ THỂ THAY ĐỔI test THÀNH BẤT KÌ ĐIỀU GÌ MÀ BẠN MUỐN ]`

const BCreatThread = `Bthread (Tiêu đề của chủ đề) - (chủ đề bạn muốn thảo luận).\nVí dụ: Bthread họp nhóm-trò chơi steam ( trong đó **họp nhóm** là tên chủ đề, `+
                    `**trò chơi steam** là chủ đề mọi người sẽ thảo luận)`

module.exports = { 
    Bvoice,
    helpValheim,
    bsetupforum,
    BảngGiá,
    BCreatThread
};
