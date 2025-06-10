/*
Chức năng: Xử lý các sự kiện tương tác nút bấm.
*/
const { ButtonInteraction } = require('discord.js');
const interactionError = require('../WebhookError/interactionError');

// Xuất module để sử dụng trong tệp chính
module.exports = {
    name: "interactionCreate", // Tên sự kiện mà module này sẽ xử lý

    // Hàm sẽ được thực thi khi sự kiện xảy ra
    async execute(interaction, client) {
            // Kiểm tra xem tương tác có phải là tương tác nút không
            if (!interaction.isButton()) return;

        try {
            // Lấy customId của nút đã nhấn
            const customId = interaction.customId;

            

            // Nếu customId là "ping_command", thực hiện logic của lệnh ping
            if (customId === 'ping_command') {
                // Giả lập việc gọi lệnh /ping
                const pingCommand = client.commands.get('ping_api');
                if (!pingCommand) {
                    return interaction.reply({ content: 'Không tìm thấy lệnh ping.', ephemeral: true });
                }
                // Thực hiện logic của lệnh ping
                await pingCommand.execute(interaction);
                return;
            }

            // Nếu customId là "ping_command", thực hiện logic của lệnh ping
            if (customId === 'hi_command') {
                // Giả lập việc gọi lệnh /ping
                const pingCommand = client.commands.get('hi');
                if (!pingCommand) {
                    return interaction.reply({ content: 'Không tìm thấy lệnh ping.', ephemeral: true });
                }
                // Thực hiện logic của lệnh ping
                await pingCommand.execute(interaction);
                return;
            }

            // Nếu customId là "ping_command", thực hiện logic của lệnh ping
            if (customId === 'brb_command') {
                // Giả lập việc gọi lệnh /ping
                const pingCommand = client.commands.get('brb');
                if (!pingCommand) {
                    return interaction.reply({ content: 'Không tìm thấy lệnh ping.', ephemeral: true });
                }
                // Thực hiện logic của lệnh ping
                await pingCommand.execute(interaction);
                return;
            }
            
            // Kiểm tra xem customId có phải là nút tham gia trò chơi không
            if (customId.startsWith('join_game_')) {
                const [_, __, gameChoice, creatorId] = customId.split('_'); // Trích xuất thông tin từ customId

                const joinGameButton = client.buttons.get('join_game');
                if (!joinGameButton) {
                    const error = new Error(`Button không xác định: ${customId}`);
                    interactionError.execute(interaction, error, client);
                    return;
                }

                await joinGameButton.execute(interaction, client, gameChoice, creatorId);
                return;
            }

            // Kiểm tra xem customId có phải là nút xem danh sách trò chơi không
            if (customId.startsWith('list_')) {
                const [_, gameChoice, creatorId] = customId.split('_'); // Trích xuất thông tin từ customId

                const listButton = client.buttons.get('list');
                if (!listButton) {
                    const error = new Error(`Button không xác định: ${customId}`);
                    interactionError.execute(interaction, error, client);
                    return;
                }

                await listButton.execute(interaction, client, gameChoice, creatorId);
                return;
            }

            // Loại trừ các customId động từ event_accept.js
            if (customId.startsWith(`dy_`)) {
                return;
            }       

            // Danh sách các nút cần loại trừ của lệnh discordjs-guide.js
            const DiscordjsGuideButtons = ['previous_button', 'next_button', 'end_button', 'restart_button'];

            // Danh sách các nút cần loại trừ của lệnh setup-server.js
            const SetupServerButtons = [`setup-sv-no`, `setup-sv-ok`, `setup-sv-no1`, `setup-sv-ok1`, `setup-sv-no2`, `setup-sv-ok2`]

            // Danh sách các nút cần loại trừ của lệnh brb.js
            const brbButtons = ['previouss_button', 'nextt_button', 'restartt_button'];

            // Danh sách các nút cần loại trừ của lệnh bot-commands.js
            const BotCommandsButtons = ['homeButton', 'reportButton', 'inviteButton', 'deleteButton'];

            // Danh sách các nút cần loại trừ của lệnh mailbox.js
            const MailboxButtons = ['sendButton', 'cancelButton'];

            // Danh sách các nút cần loại trừ của lệnh Create-Role.js
            const CreateRoleButtons = ['yes', 'no'];

            // Danh sách các nút cần loại trừ của lệnh feedback.js
            const feedbackButtons = ['sendButton', 'cancelButton'];
            
            // Danh sách các nút cần loại trừ của lệnh emoji.js
            const EmojiButtons = ['a_page', 'b_page'];

            // Danh sách các nút cần loại trừ của lệnh slow-mode.js
            const SlowModeButtons = ['Pagetruoc', 'Pagetieptheo'];

            // // Danh sách các nút cần loại trừ của lệnh pickrole-add-role.js
            // const PickroleAddRoleButtons = ['role-1', 'role-2', 'role-3', 'role-4', 'role-4', 'role-6', 'role-7', 'role-8', 'role-9', 'role-10']

            // Danh sách các nút cần loại trừ khi bot được mời vào máy chủ
            const BotJoinServerButtons = ['deleteNew'];

            // Danh sách các nút cần loại trừ của lệnh setviewtime.js
            const SetviewTimeButtons = ['Page1'];

            // Danh sách các nút cần loại trừ của lệnh message-secret.js
            const MessageSecretButtons = ['view'];

            // Danh sách các nút cần loại trừ của lệnh modpanel-PhatCoThoiGian.js
            const ModPanelButtons = [`ban`, `untimeout`, `unban`, `kick`, `1`, `2`, `3`, `4`, `5`]

            // Danh sách các nút cần loại trừ của lệnh ban.js
            const BanButtons = ['confirm_ban', 'cancel_ban'];

            // Danh sách các nút cần loại trừ của lệnh ban.js
            const InfoServerButtons = ['serverinfo', 'servermemberinfo'];

            // Danh sách các nút cần loại trừ của lệnh announce.js
            const AnnounceButtons = ['confirm_send', 'cancel_send'];

            // Danh sách các nút cần loại trừ của lệnh user-scraper.js
            const CreateView_User_JsonButtons = ['view_raw', 'view_user_json'];

            // Danh sách các nút cần loại trừ của sự kiện bot.js
            const Accept_TermsButtons = ['accept_terms'];

            // Tạo danh sách các customId cần loại trừ cho game tìm emoji ( lệnh tiền tố )
            const Find_EmojiButtons = Array.from({ length: 9 }, (_, i) => i.toString()) // từ 0 đến 8
                .concat(Array.from({ length: 3 }, (_, i) => (i + 3).toString())) // từ 3 đến 5
                .concat(Array.from({ length: 3 }, (_, i) => (i + 6).toString())); // từ 6 đến 8

            // Danh sách các nút cần loại trừ của lệnh tiền tố button.js
            const buttonButtons = ['prev', 'next'];

            // Danh sách các nút cần loại trừ của lệnh tiền tố floot.js
            const foodButtons = ['flood_0', 'flood_1', 'flood_2', 'flood_3', 'flood_4', 'flood_5', 'flood_6', 'flood_7'];
            
            // Danh sách các customId của nút trong mã khảo sát.js
            const KhaoSat = [
                                `q1_a`, `q1_b`, `q1_c`, `q1_d`, `q1_e`,
                                `q2_a`, `q2_b`, `q2_c`, `q2_d`, `q2_e`,
                                `q3_a`, `q3_b`, `q3_c`, `q3_d`, `q3_e`,
                                `q4_a`, `q4_b`, `q4_c`, `q4_d`, `q4_e`,
                                `q5_a`, `q5_b`, `q5_c`, `q5_d`, `q5_e`,
                                `q6_a`, `q6_b`, `q6_c`, `q6_d`, `q6_e`,
                                `q7_a`, `q7_b`, `q7_c`, `q7_d`, `q7_e`,
                                `q8_a`, `q8_b`, `q8_c`, `q8_d`, `q8_e`,
                                `q9_a`, `q9_b`, `q9_c`, `q9_d`, `q9_e`,
                                `q10_a`, `q10_b`, `q10_c`, `q10_d`, `q10_e`,
                            ];
            
            // Danh sách các customId của nút trong mã khảo sát.js
            const nutKhaoSat = [`prevv`, `nextr`];

            // Danh sách các customId của nút trong mã dkbd.js
            const dkbdButton = [`dkbdUp`, `dkbdFlip`, `dkbdDown`, `dkbdLeft`, `dkbdEnd`, `dkbdRight`];

            // Danh sách các customId của nút trong mã minesweeper.js
            const minesweeperButtonIds = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => `${i}-${j}`)).flat();

            // Danh sách các nút cần loại trừ của lệnh discordjs-guide.js
            const findwordButton = [
                'previous_button', 'next_button', 'end_button', 'restart_button',
                ...Array.from({ length: 25 }, (_, i) => i.toString()) // Thêm các ID từ "0" đến "24" của các nút trong a.js
            ];

            // Danh sách các customId của nút trong mã filter_members.js
            const filter_membersButton = [`delete_no_avatar`, `delete_no_role`, `delete_inactive`, `delete_not_in_db`];

            // Danh sách các customId của nút trong mã ?nt.js
            const NaptienButton = [`prev`, `next`,];

            // Danh sách các nút cần loại trừ của lệnh invites_code.js
            const InvitesCodeButtons = ['prev_page', 'next_page'];

            // // Danh sách các nút cần loại trừ của lệnh /top
            // const IButtons = [
            //     'voice-next', 'voice-prev', 'voice-start', 'voice-end', 'message-next', 'message-prev', 'message-start', 'message-end',  // ví dụ, thay thế với các customId thực tế
            // ];

            // Danh sách các nút cần loại trừ của lệnh /top
            const IButtons = [
                'voice-first', 'voice-prev', 'voice-next', 'voice-last', `voice-remove`, 'message-first', 'message-prev', 'message-next', 'message-last', `message-remove`, `Overview-remove` // ví dụ, thay thế với các customId thực tế
            ];

            // // Danh sách các customId của nút trong mã /top.js
            // const TopCommandButtons = [
            //     'message-next', 'message-prev', 'message-start', 'message-end',  // ví dụ, thay thế với các customId thực tế
            // ];

            // // Thêm vào phần kiểm tra nút cần loại trừ
            // if (TopCommandButtons.includes(customId)) {
            //     return; // Không làm gì cả nếu customId là một trong các nút này
            // }

            // Danh sách các nút cần loại trừ của lệnh invites_code.js
            const Vote_Valheim_Buttons = ['prev_valheim', 'next_valheim'];

            // // Danh sách các nút cần loại trừ của lệnh invites_code.js
            // const dy_Buttons = [`dy_${interaction.user.id}`];
            // // Nếu customId là một trong các nút cần loại trừ, không xử lý
            // if (dy_Buttons.includes(customId)) {
            //     return; // Không làm gì cả
            // }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (Vote_Valheim_Buttons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (IButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (InvitesCodeButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (NaptienButton.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (filter_membersButton.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (findwordButton.includes(customId)) {
                return; // Không làm gì cả
            }
            
            // Nếu customId là một trong các nút Dò Mìn, không xử lý
            if (minesweeperButtonIds.includes(customId)) {
                return; // Không làm gì cả
            }

            // Kiểm tra nếu customId nằm trong danh sách loại trừ
            if (dkbdButton.includes(customId)) {
                return; // Không xử lý nếu là nút emoji
            }

            // Kiểm tra nếu customId nằm trong danh sách loại trừ
            if (nutKhaoSat.includes(customId)) {
                return; // Không xử lý nếu là nút emoji
            }

            // Kiểm tra nếu customId nằm trong danh sách loại trừ
            if (KhaoSat.includes(customId)) {
                return; // Không xử lý nếu là nút emoji
            }

            // Kiểm tra nếu customId nằm trong danh sách loại trừ
            if (foodButtons.includes(customId)) {
                return; // Không xử lý nếu là nút emoji
            }

            // Kiểm tra nếu customId nằm trong danh sách loại trừ
            if (buttonButtons.includes(customId)) {
                return; // Không xử lý nếu là nút emoji
            }

            // Kiểm tra nếu customId nằm trong danh sách loại trừ
            if (Find_EmojiButtons.includes(customId)) {
                return; // Không xử lý nếu là nút emoji
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (Accept_TermsButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (CreateView_User_JsonButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (InfoServerButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (MessageSecretButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (AnnounceButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (SetviewTimeButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (BanButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (ModPanelButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (SlowModeButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (CreateRoleButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (SetupServerButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (feedbackButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (MailboxButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (EmojiButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            // if (PickroleAddRoleButtons.includes(customId)) {
            //     return; // Không làm gì cả
            // }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (DiscordjsGuideButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            if (brbButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            if (BotCommandsButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (BotJoinServerButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Lấy lệnh từ client.buttons bằng customId
            const button = client.buttons.get(customId);

            // Nếu không tìm thấy lệnh, trả lời rằng button không xác định
            if (!button) {
                // interaction.reply({ content: "Button không xác định", ephemeral: true });
                // interactionError.execute(interaction, error, client);

                // interactionError.execute(interaction, new Error("Button không xác định"), client);
                // return;

                // Gửi thông báo lỗi chi tiết với customId của button không xác định
                const error = new Error(`Nút chưa được xử lý hoặc đã thay đổi: ${customId}`);

                interactionError.execute(interaction, error, client);
                return;
            }

            // Thực thi lệnh nút
            button.execute(interaction, client);
        } catch (error) {
            // // Log lỗi ra console để dễ dàng kiểm tra
            // console.error('Lỗi khi xử lý interaction:', error);

            // // Thông báo lỗi cho người dùng nếu cần thiết
            // interaction.reply({ content: "Đã xảy ra lỗi khi xử lý nút. Vui lòng thử lại sau.", ephemeral: true });
            interactionError.execute(interaction, error, client);
        }
    },
};


