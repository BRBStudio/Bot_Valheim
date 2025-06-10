const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const tinycolor = require("tinycolor2");
const moment = require("moment-timezone");
const randomColor = require("randomcolor");
const { getPreferredLanguage } = require('../../languageUtils');
const translate = require('@iamtraction/google-translate');
const CommandStatus = require('../../schemas/Command_Status');

const WEBHOOK_URL = `https://discord.com/api/webhooks/1374143699801608232/eTsbAfM3mXihptJjiYC-iWw-dHsIbBO1nee18Qv8dAwckf7rxY5DDhjM9NsdGjCSkrGC`; // "https://discord.com/api/webhooks/1374132172180557864/5O3nrsNfQbK4Mg2YtS9ufN4eecD0k48wiJrhULK9eiOfyfuBpl8yo2kVbEc8V3OEUqgx"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("announce_dev")
		.setDescription("🔹 Gửi thông báo nâng cao")
		.setDescriptionLocalization("en-US", "🔹 Send advanced notifications")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
		.addStringOption((o) => o
			.setName("message")
			.setDescription("Tin nhắn thông báo, Mẹo: dùng \\n để xuống dòng, {s1}xanh{/s1}, {s2}đỏ{/s2}")
			.setRequired(true)
		)
		.addStringOption((o) => o
			.setName("title").setDescription("Tiêu đề của thông báo")
		)
		.addStringOption((o) => o
			.setName("color")
			.setDescription("Chọn màu (cho embed)")
			.addChoices(
				{ name: "Ngẫu nhiên", value: "Random" },
				{ name: "Đỏ", value: "Red" },
				{ name: "Xanh", value: "Blue" },
				{ name: "Xanh lá", value: "Green" },
				{ name: "Tím", value: "Purple" },
				{ name: "Cam", value: "Orange" },
				{ name: "Vàng", value: "Yellow" },
				{ name: "Đen", value: "Black" },
				{ name: "Cyan", value: "Cyan" },
				{ name: "Hồng", value: "Pink" }
			)
		)
		.addStringOption((o) => o
			.setName("timestamp")
			.setDescription("Thời gian hẹn gửi (HH:mm DD/MM/YYYY)")
		),

	guildSpecific: true,
	guildId: `1319809040032989275`,

	async execute(interaction) {
		try {
			const commandStatus = await CommandStatus.findOne({ command: '/announce' });
			if (commandStatus && commandStatus.status === 'off') {
				return interaction.reply('Lệnh này đã bị tắt.');
			}

			const messageText = interaction.options.getString("message");
			const title = interaction.options.getString("title") || "Thông báo";
			const color = interaction.options.getString("color") || "turquoise";
			const timestamp = interaction.options.getString("timestamp");
			const preferredLanguage = await getPreferredLanguage(interaction.guild.id, interaction.user.id);

			const translateIfNeeded = async (text) => {
				if (preferredLanguage === 'en') {
					const result = await translate(text, { to: 'en' });
					return result.text;
				}
				return text;
			};

			const translatedTitle = await translateIfNeeded(title);
			const translatedMessage = await translateIfNeeded(messageText);

			const messages = {
				invalidColor: preferredLanguage === 'en' ? "Invalid color." : "Màu không hợp lệ.",
				scheduleError: preferredLanguage === 'en' ? "Scheduled time must be in the future." : "Thời gian phải ở tương lai.",
			};

			if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
				return interaction.reply({
					content: preferredLanguage === 'en' ? "You lack permission." : "Bạn không có quyền.",
					ephemeral: true
				});
			}

			let colorCode;
			if (color === "Random") {
				colorCode = randomColor();
			} else {
				colorCode = tinycolor(color);
				if (!colorCode.isValid()) {
					return await interaction.reply({ content: messages.invalidColor, ephemeral: true });
				}
			}

			const processMessage = (text) =>
				text.replace(/{s1}/g, '```diff\n+ ')
				.replace(/{\/s1}/g, '\n```')
				.replace(/{s2}/g, '```diff\n- ')
				.replace(/{\/s2}/g, '\n```')
				.replace(/\\n/g, '\n');

			const embed = new EmbedBuilder()
				.setTitle(translatedTitle)
				.setDescription(processMessage(translatedMessage))
				.setColor(color === "Random" ? colorCode : colorCode.toHexString());

			const sendWebhook = async () => {
				await fetch(WEBHOOK_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						content: "@everyone",
						allowed_mentions: { parse: ["everyone"] },
						embeds: [embed.toJSON()]
					})
				});
			};

			if (timestamp) {
				const regex = /^(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/;
				const match = timestamp.match(regex);
				if (!match) {
					return interaction.reply({
						content: preferredLanguage === 'en'
						? "Invalid timestamp format. Use HH:mm DD/MM/YYYY."
						: "Định dạng thời gian sai. Dùng HH:mm DD/MM/YYYY.",
						ephemeral: true,
					});
				}

				const [_, hour, minute, day, month, year] = match;
				const scheduledTime = moment.tz(`${year}-${month}-${day} ${hour}:${minute}`, "YYYY-MM-DD HH:mm", "Asia/Ho_Chi_Minh");
				const delay = scheduledTime.valueOf() - Date.now();
				if (delay <= 0) {
					return interaction.reply({ content: messages.scheduleError, ephemeral: true });
				}

				await interaction.reply({
					content: preferredLanguage === 'en'
						? `Scheduled to send at ${scheduledTime.format("HH:mm on DD/MM/YYYY")}`
						: `Sẽ gửi vào lúc ${scheduledTime.format("HH:mm [ngày] DD/MM/YYYY")}`,
					ephemeral: true
				});

				setTimeout(() => sendWebhook(), delay);

			} else {
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("confirm_send")
						.setEmoji("✅")
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId("cancel_send")
						.setEmoji("❌")
						.setStyle(ButtonStyle.Secondary)
				);

				await interaction.deferReply({ ephemeral: true });
				await interaction.editReply({
					content: preferredLanguage === 'en' ? "Preview announcement:" : "Xem trước thông báo:",
					embeds: [embed],
					components: [row],
				});

				const filter = i => i.user.id === interaction.user.id;
				const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

				collector.on("collect", async (i) => {
					await i.deferUpdate();
					if (i.customId === "confirm_send") {
						await sendWebhook();
						await interaction.followUp({
							content: preferredLanguage === 'en' ? "Sent!" : "Đã gửi!",
							ephemeral: true,
						});
						collector.stop();
					} else {
						await interaction.followUp({
							content: preferredLanguage === 'en' ? "Canceled." : "Đã hủy.",
							ephemeral: true,
						});
						collector.stop();
					}
				});

				collector.on("end", () => {
					interaction.editReply({ components: [] });
				});
			}
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "Đã xảy ra lỗi.",
				ephemeral: true
			});
		}
	}
};
