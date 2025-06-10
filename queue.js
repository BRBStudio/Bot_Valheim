// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
// const googleTTS = require('google-tts-api');

// class VoiceQueue {
//     constructor() {
//         this.queue = []; // Hàng đợi để lưu trữ các yêu cầu
//         this.isProcessing = false; // Biến kiểm tra xem bot có đang xử lý sự kiện nào không
//         this.currentConnection = null; // Kết nối hiện tại
//     }

//     // Thêm yêu cầu vào hàng đợi
//     addToQueue(request) {
//         this.queue.push(request);
//         if (!this.isProcessing) {
//             this.processQueue(); // Nếu không đang xử lý, bắt đầu xử lý hàng đợi
//         }
//     }

//     // Hàm xử lý hàng đợi
//     async processQueue() {
//         if (this.queue.length === 0) {
//             this.isProcessing = false; // Không còn yêu cầu nào để xử lý
//             if (this.currentConnection) {
//                 this.currentConnection.destroy(); // Ngắt kết nối nếu không có yêu cầu nào
//                 this.currentConnection = null;
//             }
//             return;
//         }

//         this.isProcessing = true; // Đánh dấu bot đang xử lý
//         const { text, channel, type } = this.queue.shift(); // Lấy yêu cầu đầu tiên từ hàng đợi

//         // Kết nối tới kênh thoại
//         if (!this.currentConnection || this.currentConnection.joinConfig.channelId !== channel.id) {
//             if (this.currentConnection) {
//                 this.currentConnection.destroy(); // Ngắt kết nối kênh cũ nếu có
//             }

//             this.currentConnection = joinVoiceChannel({
//                 channelId: channel.id,
//                 guildId: channel.guild.id,
//                 adapterCreator: channel.guild.voiceAdapterCreator,
//             });
//         }

//         const audioURL = googleTTS.getAudioUrl(text, {
//             lang: 'vi',
//             slow: false,
//             host: 'https://translate.google.com',
//         });

//         const player = createAudioPlayer();
//         const resource = createAudioResource(audioURL);

//         // Khi audio kết thúc, ngắt kết nối và xử lý yêu cầu tiếp theo trong hàng đợi
//         player.on(AudioPlayerStatus.Idle, async () => {
//             player.stop(); // Dừng phát audio
//             if (this.queue.length === 0) {
//                 if (this.currentConnection) {
//                     this.currentConnection.destroy(); // Ngắt kết nối sau khi hoàn thành
//                     this.currentConnection = null;
//                 }
//                 this.isProcessing = false; // Đặt lại trạng thái xử lý
//             } else {
//                 // Tiếp tục xử lý yêu cầu tiếp theo
//                 this.processQueue();
//             }
//         });

//         player.play(resource);
//         this.currentConnection.subscribe(player);
//     }
// }

// module.exports = new VoiceQueue(); // Xuất một thể hiện của VoiceQueue



const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    entersState,
    VoiceConnectionStatus
} = require('@discordjs/voice');
const googleTTS = require('google-tts-api');

class VoiceQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.currentConnection = null;
        this.player = createAudioPlayer();

        // Khi trình phát ở trạng thái "rảnh" -> tiếp tục xử lý hàng đợi
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.isProcessing = false; // Cập nhật lại biến để tiếp tục hàng đợi
            this.processQueue();
        });

        // Xử lý lỗi để tránh bot bị crash
        this.player.on('error', error => {
            console.error('Lỗi trình phát âm thanh:', error);
            this.isProcessing = false; // Đặt lại biến để đảm bảo hàng đợi tiếp tục
            this.processQueue();
        });
    }

    // Thêm yêu cầu vào hàng đợi
    addToQueue(request) {
        this.queue.push(request);
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    // Kết nối bot vào kênh voice
    async connectToChannel(channel) {
        if (this.currentConnection && this.currentConnection.joinConfig.channelId === channel.id) {
            return;
        }

        if (this.currentConnection) {
            this.currentConnection.destroy();
            this.currentConnection = null;
        }

        this.currentConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        try {
            await entersState(this.currentConnection, VoiceConnectionStatus.Ready, 5000);
        } catch (error) {
            console.error('Lỗi kết nối voice:', error);
            this.currentConnection.destroy();
            this.currentConnection = null;
        }
    }

    // Xử lý hàng đợi
    async processQueue() {
        if (this.isProcessing) return; // Nếu đã đang xử lý, không làm gì cả
        if (this.queue.length === 0) {
            this.isProcessing = false;

            // Nếu bot vẫn đang kết nối voice -> Chờ 10 giây rồi rời kênh
            if (this.currentConnection) {
                setTimeout(() => {
                    if (!this.isProcessing) {
                        this.currentConnection.destroy();
                        this.currentConnection = null;
                    }
                }, 1_000);
            }
            return;
        }

        this.isProcessing = true; // Đánh dấu bot đang xử lý
        const { text, channel } = this.queue.shift(); // Lấy yêu cầu đầu tiên từ hàng đợi

        await this.connectToChannel(channel);

        const audioURL = googleTTS.getAudioUrl(text, {
            lang: 'vi',
            slow: false,
            host: 'https://translate.google.com'
        });

        const resource = createAudioResource(audioURL);

        this.player.play(resource);
        this.currentConnection.subscribe(this.player);
    }
}

module.exports = new VoiceQueue();
