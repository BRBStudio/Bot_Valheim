const { EmbedBuilder } = require('discord.js');
const events = require('events');


module.exports = class BRB_Fishventure extends events {
    /**
    * Đại diện cho một trò chơi Fishy.
    * @constructor
    * @param {Object} options - Các tùy chọn cho trò chơi Fishy.
    * @param {boolean} [options.isSlashGame=false] - Trò chơi có sử dụng lệnh slash hay không.
    * @param {Object} options.message - Đối tượng tin nhắn liên quan đến trò chơi.
    * @param {Object} [options.embed={}] - Các tùy chọn embed cho trò chơi.
    * @param {string} [options.embed.title='HÒM CÁ'] - Tiêu đề của embed.
    * @param {string} [options.embed.color='#551476'] - Màu sắc của embed.
    * @param {Object} [options.player={}] - Các tùy chọn người chơi trong trò chơi.
    * @param {string} [options.player.id] - ID của người chơi.
    * @param {number} [options.player.balance=50] - Số dư của người chơi.
    * @param {Object} [options.player.fishes={}] - Các loại cá mà người chơi sở hữu.
    * @param {Object} [options.fishes={}] - Các loại cá có sẵn trong trò chơi.
    * @param {Object} [options.fishes.rac] - Các tùy chọn cho loại cá rác.
    * @param {string} [options.fishes.rac.emoji='🔧'] - Biểu tượng emoji đại diện cho loại cá rác.
    * @param {number} [options.fishes.rac.price=5] - Giá của loại cá rác.
    * @param {Object} [options.fishes.cute] - Các tùy chọn cho loại cá thông thường.
    * @param {string} [options.fishes.cute.emoji='🐟'] - Biểu tượng emoji đại diện cho loại cá thông thường.
    * @param {number} [options.fishes.cute.price=10] - Giá của loại cá thông thường.
    * @param {Object} [options.fishes.condo] - Các tùy chọn cho loại cá không phổ biến.
    * @param {string} [options.fishes.condo.emoji='🐠'] - Biểu tượng emoji đại diện cho loại cá không phổ biến.
    * @param {number} [options.fishes.condo.price=20] - Giá của loại cá không phổ biến.
    * @param {Object} [options.fishes.vip] - Các tùy chọn cho loại cá hiếm.
    * @param {string} [options.fishes.vip.emoji='🐡'] - Biểu tượng emoji đại diện cho loại cá hiếm.
    * @param {number} [options.fishes.vip.price=50] - Giá của loại cá hiếm.
    * @param {number} [options.fishyRodPrice=20] - Giá thuê cần câu cá.
    * @param {string} [options.catchMessage='Bạn đã câu được một {fish}. Bạn đã trả {amount} cho cần câu.'] - Tin nhắn hiển thị khi bắt được cá.
    * @param {string} [options.sellMessage='Bạn đã bán được {amount} x {fish} {type} mặt hàng với tổng giá trị là {price}.'] - Tin nhắn hiển thị khi bán cá.
    * @param {string} [options.noBalanceMessage='Bạn không đủ tiền để thuê cần câu.'] - Tin nhắn hiển thị khi người chơi không đủ số dư để thuê cần câu cá.
    * @param {string} [options.invalidTypeMessage='Loại cá chỉ có thể là rác, thông thường, hiếm hoặc hiếm.'] - Tin nhắn hiển thị khi loại cá không hợp lệ được cung cấp.
    * @param {string} [options.invalidAmountMessage='Số lượng phải nằm trong khoảng từ 2 đến số lượng cá tối đa.'] - Tin nhắn hiển thị khi số lượng không hợp lệ được cung cấp.
    * @param {string} [options.noItemMessage='Túi của bạn không có bất kỳ mặt hàng nào trong số này.'] - Tin nhắn hiển thị khi người chơi không có vật phẩm yêu cầu trong kho đồ.
    */
	constructor(options = {}) {

		if (!options.isSlashGame) options.isSlashGame = false;
		if (!options.message) throw new TypeError('NO_MESSAGE: Không có tùy chọn tin nhắn nào được cung cấp.');
		if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: tùy chọn tin nhắn phải là một đối tượng.');
		if (typeof options.isSlashGame !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: Tùy chọn isSlashGame phải là boolean.');


		if (!options.embed) options.embed = {};
		if (!options.embed.title) options.embed.title = 'TÚI CÁ';
		if (!options.embed.color) options.embed.color = '#551476';

		if (!options.player) options.player = {};
		if (!options.player.id) options.player.id = options.message[options.isSlashGame ? 'user' : 'author'].id;
		if (!options.player.balance && options.player.balance !== 0) options.player.balance = 50;
		if (!options.player.fishes) options.player.fishes = {};

		if (!options.fishes) options.fishes = {};
		if (!options.fishes.rac) options.fishes.rac = { emoji: '<:Ca_Rac:1320587649031082025>', price: 1000 };
		if (!options.fishes.cute) options.fishes.cute = { emoji: '<a:Ca_Cute:1320587839158747228>', price: 2500 };
		if (!options.fishes.condo) options.fishes.condo = { emoji: '<a:Ca_Codon:1320588046302711920>', price: 4000 };
		if (!options.fishes.vip) options.fishes.vip = { emoji: '<a:Ca_Vip:1320587932666695762>', price: 8000 };

		// Thêm 10 loại cá mới chưa xử lý
		if (!options.fishes.newFish1) options.fishes.newFish1 = { emoji: '<:fish5:1307739319208775745>', price: 1500 };
		if (!options.fishes.newFish2) options.fishes.newFish2 = { emoji: '<:fish6:1307739319208775746>', price: 2000 };
		if (!options.fishes.newFish3) options.fishes.newFish3 = { emoji: '<:fish7:1307739319208775747>', price: 2500 };
		if (!options.fishes.newFish4) options.fishes.newFish4 = { emoji: '<:fish8:1307739319208775748>', price: 3000 };
		if (!options.fishes.newFish5) options.fishes.newFish5 = { emoji: '<:fish9:1307739319208775749>', price: 3500 };
		if (!options.fishes.newFish6) options.fishes.newFish6 = { emoji: '<:fish10:1307739319208775750>', price: 4000 };
		if (!options.fishes.newFish7) options.fishes.newFish7 = { emoji: '<:fish11:1307739319208775751>', price: 4500 };
		if (!options.fishes.newFish8) options.fishes.newFish8 = { emoji: '<:fish12:1307739319208775752>', price: 5000 };
		if (!options.fishes.newFish9) options.fishes.newFish9 = { emoji: '<:fish13:1307739319208775753>', price: 5500 };
		if (!options.fishes.newFish10) options.fishes.newFish10 = { emoji: '<:fish14:1307739319208775754>', price: 6000 };

		if (!options.fishyRodPrice) options.fishyRodPrice = 10000;
		if (!options.catchMessage) options.catchMessage = 'Bạn đã câu được một {fish}. Bạn đã trả {amount} vnd cho cần câu.';
		if (!options.sellMessage) options.sellMessage = 'Bạn đã bán được {amount} x {fish} với tổng giá trị là {price}.'; // {type} {type}
		if (!options.noBalanceMessage) options.noBalanceMessage = 'Bạn không đủ tiền để thuê cần câu.';
		if (!options.invalidTypeMessage) options.invalidTypeMessage = 'Loại cá chỉ có thể là rác, thông thường, hiếm hoặc hiếm.';
		if (!options.invalidAmountMessage) options.invalidAmountMessage = 'Số lượng phải nằm trong khoảng từ 2 đến số lượng cá tối đa.';
		if (!options.noItemMessage) options.noItemMessage = 'Túi cá của bạn không có bất kỳ mặt hàng nào trong số này.';


		if (typeof options.embed !== 'object') throw new TypeError('INVALID_EMBED: Tùy chọn nhúng phải là một đối tượng.');
		if (typeof options.embed.title !== 'string') throw new TypeError('INVALID_EMBED: Tiêu đề nhúng phải là một chuỗi.');
		if (typeof options.player !== 'object') throw new TypeError('INVALID_PLAYER: Tùy chọn người chơi phải là một đối tượng.');
		if (typeof options.player.id !== 'string') throw new TypeError('INVALID_PLAYER: Id người chơi phải là một chuỗi.');
		if (typeof options.player.fishes !== 'object') throw new TypeError('INVALID_PLAYER: Cá của người chơi phải là một vật thể.');
		if (typeof options.player.balance !== 'number') throw new TypeError('INVALID_PLAYER: Tiền của người chơi phải là một con số.');
		if (typeof options.fishyRodPrice !== 'number') throw new TypeError('INVALID_PRICE: Giá cần câu phải là một con số.');
		if (typeof options.catchMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Tùy chọn tin nhắn bắt phải là một chuỗi.');
		if (typeof options.sellMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Tùy chọn tin nhắn bán phải là một chuỗi.');
		if (typeof options.noBalanceMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Không có tùy chọn tin nhắn số dư phải là một chuỗi.');
		if (typeof options.invalidTypeMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Tùy chọn tin nhắn InvalidType phải là một chuỗi.');
		if (typeof options.invalidAmountMessage !== 'string') throw new TypeError('INVALID_MESSAGE: Tùy chọn tin nhắn InvalidAmount phải là một chuỗi.');
		if (typeof options.noItemMessage !== 'string') throw new TypeError('INVALID_MESSAGE: tùy chọn tin nhắn noItem phải là một chuỗi.');
		if (!options.message.deferred && options.isSlashGame) options.message.deferReply().catch(e => {});

		super();
		this.options = options;
		this.message = options.message;
		this.player = options.player;
		this.fishes = options.fishes;
	}


	async sendMessage(content) {  
		if (this.options.isSlashGame) {
			if (!this.message.deferred) return await this.message.reply(content);
			else return await this.message.editReply(content);
		}
		else return await this.message.channel.send(content);
	}


	async Begin() {
		let fishType = 'vip'; // rare
		const fishId = Math.floor(Math.random() * 10) + 1;

		if (fishId < 5) fishType = 'rac'; // junk
		else if (fishId < 8) fishType = 'cute'; // common
		else if (fishId < 10) fishType = 'condo'; // uncommon

		const fish = this.fishes[fishType];
		if (this.player.balance < this.options.fishyRodPrice) return this.sendMessage({ content: this.options.noBalanceMessage });
		const content = this.options.catchMessage.replace('{fish}', fish.emoji).replace('{amount}', this.options.fishyRodPrice);


		this.player.balance -= this.options.fishyRodPrice;
		this.player.fishes[fishType] = (this.player.fishes[fishType] || 0) + 1;

		this.fishType = fishType;
		this.emit('Begin', { player: this.player, fishType: fishType, fish: fish });
		return await this.sendMessage({ content: content });
	}


	// async sellFish(type, amount) {
	// 	if (!this.fishes[type]) return this.sendMessage({ content: this.options.invalidTypeMessage });
	// 	if (!this.player.fishes[type]) return this.sendMessage({ content: this.options.noItemMessage });
	// 	if (parseInt(amount) < 0 || parseInt(amount) > this.player.fishes[type]) return this.sendMessage({ content: this.options.invalidAmountMessage });


	// 	const fish = this.fishes[type];
	// 	const content = this.options.sellMessage.replace('{amount}', amount).replace('{type}', type).replace('{fish}', fish.emoji).replace('{price}', (fish.price * amount));

	// 	this.player.fishes[type] -= amount;
	// 	this.player.balance += (fish.price * amount);

	// 	this.emit('sellFish', { player: this.player, fishType: type, fish: fish });
	// 	return await this.sendMessage({ content: content });
	// }

	async sellFish(type, amount) {

		if (!this.fishes[type]) {
			return this.sendMessage({ content: this.options.invalidTypeMessage });
			}

		if (!this.player.fishes[type] || this.player.fishes[type] < amount) {
			// Kiểm tra số lượng cá có trong túi
			return this.sendMessage({ content: this.options.invalidAmountMessage });
			}

		if (parseInt(amount) <= 0) {
			// Kiểm tra số lượng nhập có hợp lệ không
			return this.sendMessage({ content: this.options.invalidAmountMessage });
			}
	
		const fish = this.fishes[type];
		const content = this.options.sellMessage
			.replace('{amount}', amount)
			.replace('{type}', type)
			.replace('{fish}', fish.emoji)
			.replace('{price}', fish.price * amount);
	
		// Cập nhật túi cá và số dư
		this.player.fishes[type] -= amount;
		this.player.balance += fish.price * amount;
	
		this.emit('sellFish', { player: this.player, fishType: type, fish: fish });
		return await this.sendMessage({ content: content });
	}

	// fishyInventory
	async Fishbag() {
		const fishes = (['vip', 'condo', 'cute'].map(e => `**\u2000${this.fishes[e.toLowerCase()].emoji} Cá ${e}** — ${this.player.fishes[e.toLowerCase()] || 0}`).join('\n\n'));

		const embed = new EmbedBuilder()
			.setColor(this.options.embed.color)
			.setTitle(this.options.embed.title)
			.setAuthor({ name: this.message.author.tag, iconURL: this.message.author.displayAvatarURL({ dynamic: true }) })
			.setDescription(fishes + `\n\n\u2000**${this.fishes.rac.emoji} Rác** — ${this.player.fishes.rac || 0}`)
			.setTimestamp()

		return await this.sendMessage({ embeds: [embed] });
	}
}