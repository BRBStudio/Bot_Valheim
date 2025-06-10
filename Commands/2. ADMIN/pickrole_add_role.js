const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField} = require("discord.js");
const roleSchema = require("../../schemas/roleSchema");
const config = require(`../../config`)
const { checkAdministrator } = require(`../../permissionCheck`)
const CommandStatus = require('../../schemas/Command_Status');

/*
sử lý tương tác role-1 đến role-10 tại InteractionTypes/Buttons
*/
module.exports = {
    data: new SlashCommandBuilder()
		.setName('pickrole_add_role')
		.setDescription('🔹 Thêm button vào một tin nhắn pick role.')
		.addStringOption(option =>
			option.setName("messageid")
				.setDescription("ID của tin nhắn.")
				.setRequired(true))

		.addStringOption(option =>
			option.setName("button")
				.setDescription("Tên nút.")
				.setRequired(true))
		
		.addRoleOption(option => 
			option.setName('role')
			.setDescription('Nút vai trò.')
			.setRequired(true))
		
		.addStringOption(option =>
			option.setName("icon")
				.setDescription("ID emoji có trong máy chủ.")
				.setRequired(false)),
	
	async execute(interaction , client) {

		// Kiểm tra trạng thái của lệnh
        const commandStatus = await CommandStatus.findOne({ command: '/pickrole_add_role' });

        // Nếu lệnh đang tắt, gửi thông báo và không thực hiện lệnh
        if (commandStatus && commandStatus.status === 'off') {
            return interaction.reply('Lệnh này đã bị tắt, vui lòng thử lại sau.');
        }
		
		const {options} = interaction;

		const hasPermission = await checkAdministrator(interaction);
		if (!hasPermission) return;

		const messageID = options.getString("messageid");
		const button = options.getString("button");
		const role = options.getRole("role");
		const icon = options.getString("icon");

		const BotRole = interaction.guild.members.me.roles.highest.position;

		// In ra để kiểm tra vị trí vai trò của bot và vai trò được chọn
		// console.log(`Vị trí vai trò Bot: ${BotRole}`);
		// console.log(`Vị trí vai trò đã chọn: ${role.position}`);

		if (BotRole <= role.position) return interaction.reply({embeds: [
			new EmbedBuilder()
				.setColor(config.embedCyan)
				.setDescription(`**Role được cung cấp cao hơn hoặc bằng role cao nhất của Bot.**\n**Vui lòng thêm role thấp hơn role của Bot để Bot có thể hoạt động.**`)
		] , ephemeral:true})
		
		const data = await roleSchema.findOne({
		Guild: interaction.guild.id,
		MessageID: messageID
		});

		// In ra dữ liệu tìm thấy từ MongoDB
		//  console.log('Dữ liệu từ MongoDB:', data);

		if (!data) return interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`**Không có tin nhắn nào tương ứng với ID đã cung cấp. Vui lòng sử dụng lệnh /pickrole-message-create trước để lấy ID**`)
		] , ephemeral:true})


		const pick1 = new ActionRowBuilder();
		const pick2 = new ActionRowBuilder();
		const pick3 = new ActionRowBuilder();
		
		if (icon) {
		if (!icon.match(/<a?:([^:]+):(\d+)>/)) return interaction.reply({embeds: [
			new EmbedBuilder()
				.setColor(config.embedCyan)
				.setDescription(`**Emoji không hợp lệ. Vui lòng nhập ID emoji!**\nVí dụ: <a:cun1:1343938871892775003>`)
		], ephemeral:true});}

		if (data.RoleID1) {
		
		if (data.RoleID2) {

			if (data.RoleID3) {

				if (data.RoleID4) {

				if (data.RoleID5) {

					if (data.RoleID6) {

					if (data.RoleID7) {

						if (data.RoleID8) {

						if (data.RoleID9) {

							if (data.Button10) return; // Xử lý role-10 ở đây

				// Xử lý role-9 ở đây
				pick1.addComponents(
			but1 = new ButtonBuilder()
				.setLabel(data.Button1)
				.setCustomId('role-1')
				.setStyle(ButtonStyle.Secondary));   
			
				pick1.addComponents(
			but2 = new ButtonBuilder()
				.setLabel(data.Button2)
				.setCustomId('role-2')  
				.setStyle(ButtonStyle.Secondary));        
		
				pick1.addComponents(
			but3 = new ButtonBuilder()
				.setLabel(data.Button3)
				.setCustomId('role-3')  
				.setStyle(ButtonStyle.Secondary));

				pick1.addComponents(
			but4 = new ButtonBuilder()
				.setLabel(data.Button4)
				.setCustomId('role-4')  
				.setStyle(ButtonStyle.Secondary));

				pick1.addComponents(
			but5 = new ButtonBuilder()
				.setLabel(data.Button5)
				.setCustomId('role-5')  
				.setStyle(ButtonStyle.Secondary));


						
				pick2.addComponents(
			but6 = new ButtonBuilder()
				.setLabel(data.Button6)
				.setCustomId('role-6')
				.setStyle(ButtonStyle.Secondary));

				pick2.addComponents(
			but7 = new ButtonBuilder()
				.setLabel(data.Button7)
				.setCustomId('role-7')
				.setStyle(ButtonStyle.Secondary));

				pick2.addComponents(
			but8 = new ButtonBuilder()
				.setLabel(data.Button8)
				.setCustomId('role-8')
				.setStyle(ButtonStyle.Secondary));

				pick2.addComponents(
			but9 = new ButtonBuilder()
				.setLabel(data.Button9)
				.setCustomId('role-9')
				.setStyle(ButtonStyle.Secondary));

				pick2.addComponents(
			but10 = new ButtonBuilder()
				.setLabel(button)
				.setCustomId('role-10')
				.setStyle(ButtonStyle.Secondary));

		
		const embed = new EmbedBuilder()
		.setTitle(data.Title)
		.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
			embed.setImage(data.Image)
		}

		if (data.Thumbnail) {
			embed.setThumbnail(data.Thumbnail)
		}
						
		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}

		if (data.Emoji3) {
		but3.setEmoji(data.Emoji3)
		}

		if (data.Emoji4) {
		but4.setEmoji(data.Emoji4)
		}

		if (data.Emoji5) {
		but5.setEmoji(data.Emoji5)
		}

		if (data.Emoji6) {
		but6.setEmoji(data.Emoji6)
		}

		if (data.Emoji7) {
		but7.setEmoji(data.Emoji7)
		}

		if (data.Emoji8) {
		but8.setEmoji(data.Emoji8)
		}

		if (data.Emoji9) {
		but9.setEmoji(data.Emoji9)
		}
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); // (/<:([^:]+):(\d+)>/);
		
		but10.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed], components: [pick1 , pick2]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID10: role.id,
			Button10: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji10: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 10 <@&${dataa.RoleID10}>`)
		], ephemeral:true})
		return;             
						}

				// Xử lý role-8 ở đây
				pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
			.setStyle(ButtonStyle.Secondary));   
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(data.Button2)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));        
		
			pick1.addComponents(
		but3 = new ButtonBuilder()
			.setLabel(data.Button3)
			.setCustomId('role-3')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but4 = new ButtonBuilder()
			.setLabel(data.Button4)
			.setCustomId('role-4')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but5 = new ButtonBuilder()
			.setLabel(data.Button5)
			.setCustomId('role-5')  
			.setStyle(ButtonStyle.Secondary));


					
			pick2.addComponents(
			but6 = new ButtonBuilder()
			.setLabel(data.Button6)
			.setCustomId('role-6')
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but7 = new ButtonBuilder()
			.setLabel(data.Button7)
			.setCustomId('role-7')
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but8 = new ButtonBuilder()
			.setLabel(data.Button8)
			.setCustomId('role-8')
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but9 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-9')
			.setStyle(ButtonStyle.Secondary));

		
		const embed = new EmbedBuilder()
		.setTitle(data.Title)
		.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed.setThumbnail(data.Thumbnail)
		}

		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}

		if (data.Emoji3) {
		but3.setEmoji(data.Emoji3)
		}

		if (data.Emoji4) {
		but4.setEmoji(data.Emoji4)
		}

		if (data.Emoji5) {
		but5.setEmoji(data.Emoji5)
		}

		if (data.Emoji6) {
		but6.setEmoji(data.Emoji6)
		}

		if (data.Emoji7) {
		but7.setEmoji(data.Emoji7)
		}

		if (data.Emoji8) {
		but8.setEmoji(data.Emoji8)
		}
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but9.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed], components: [pick1 , pick2]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID9: role.id,
			Button9: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji9: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 9 <@&${dataa.RoleID9}>`)
		], ephemeral:true})
		return;                            
					}

					// Xử lý role-7 ở đây
			pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
			.setStyle(ButtonStyle.Secondary));   
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(data.Button2)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));        
		
			pick1.addComponents(
		but3 = new ButtonBuilder()
			.setLabel(data.Button3)
			.setCustomId('role-3')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but4 = new ButtonBuilder()
			.setLabel(data.Button4)
			.setCustomId('role-4')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but5 = new ButtonBuilder()
			.setLabel(data.Button5)
			.setCustomId('role-5')  
			.setStyle(ButtonStyle.Secondary));


					
			pick2.addComponents(
			but6 = new ButtonBuilder()
			.setLabel(data.Button6)
			.setCustomId('role-6')
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but7 = new ButtonBuilder()
			.setLabel(data.Button7)
			.setCustomId('role-7')
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but8 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-8')
			.setStyle(ButtonStyle.Secondary));

		
		const embed = new EmbedBuilder()
		.setTitle(data.Title)
		.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed.setThumbnail(data.Thumbnail)
		}

		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}

		if (data.Emoji3) {
		but3.setEmoji(data.Emoji3)
		}

		if (data.Emoji4) {
		but4.setEmoji(data.Emoji4)
		}

		if (data.Emoji5) {
		but5.setEmoji(data.Emoji5)
		}

		if (data.Emoji6) {
		but6.setEmoji(data.Emoji6)
		}

		if (data.Emoji7) {
		but7.setEmoji(data.Emoji7)
		}
					
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but8.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed], components: [pick1 , pick2]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID8: role.id,
			Button8: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji8: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 8 <@&${dataa.RoleID8}>`)
		], ephemeral:true})
		return;                   
					}

			// Xử lý role-6 ở đây
			pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
			.setStyle(ButtonStyle.Secondary));   
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(data.Button2)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));        
		
			pick1.addComponents(
		but3 = new ButtonBuilder()
			.setLabel(data.Button3)
			.setCustomId('role-3')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but4 = new ButtonBuilder()
			.setLabel(data.Button4)
			.setCustomId('role-4')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but5 = new ButtonBuilder()
			.setLabel(data.Button5)
			.setCustomId('role-5')  
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but6 = new ButtonBuilder()
			.setLabel(data.Button6)
			.setCustomId('role-6')
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but7 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-7')
			.setStyle(ButtonStyle.Secondary));

		
		const embed = new EmbedBuilder()
		.setTitle(data.Title)
		.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed.setThumbnail(data.Thumbnail)
		}

		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}

		if (data.Emoji3) {
		but3.setEmoji(data.Emoji3)
		}

		if (data.Emoji4) {
		but4.setEmoji(data.Emoji4)
		}

		if (data.Emoji5) {
		but5.setEmoji(data.Emoji5)
		}

		if (data.Emoji6) {
		but6.setEmoji(data.Emoji6)
		}
		
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but7.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed], components: [pick1 , pick2]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID7: role.id,
			Button7: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji7: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 7 <@&${dataa.RoleID7}>`)
		], ephemeral:true})
		return;                   
				}

			// Xử lý role-5 ở đây
			pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
			.setStyle(ButtonStyle.Secondary));   
		
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(data.Button2)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));        
		
			pick1.addComponents(
		but3 = new ButtonBuilder()
			.setLabel(data.Button3)
			.setCustomId('role-3')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but4 = new ButtonBuilder()
			.setLabel(data.Button4)
			.setCustomId('role-4')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but5 = new ButtonBuilder()
			.setLabel(data.Button5)
			.setCustomId('role-5')  
			.setStyle(ButtonStyle.Secondary));

			pick2.addComponents(
			but6 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-6')
			.setStyle(ButtonStyle.Secondary));

		
		const embed = new EmbedBuilder()
		.setTitle(data.Title)
		.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed.setThumbnail(data.Thumbnail)
		}

		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}

		if (data.Emoji3) {
		but3.setEmoji(data.Emoji3)
		}

		if (data.Emoji4) {
		but4.setEmoji(data.Emoji4)
		}

		if (data.Emoji5) {
		but5.setEmoji(data.Emoji5)
		}
		
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but6.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed], components: [pick1 , pick2]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID6: role.id,
			Button6: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji6: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 6 <@&${dataa.RoleID6}>`)
		], ephemeral:true})
		return;
				}

			// Xử lý role-4 ở đây	
			pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
					.setStyle(ButtonStyle.Secondary));   
		
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(data.Button2)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));        
		
			pick1.addComponents(
		but3 = new ButtonBuilder()
			.setLabel(data.Button3)
			.setCustomId('role-3')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but4 = new ButtonBuilder()
			.setLabel(data.Button4)
			.setCustomId('role-4')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but5 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-5')  
			.setStyle(ButtonStyle.Secondary));

		
		const embed1 = new EmbedBuilder()
		.setTitle(data.Title)
		.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed1.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed1.setThumbnail(data.Thumbnail)
		}

		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}

		if (data.Emoji3) {
		but3.setEmoji(data.Emoji3)
		}

		if (data.Emoji4) {
		but4.setEmoji(data.Emoji4)
		}
		
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but5.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed1], components: [pick1]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID5: role.id,
			Button5: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji5: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 5 <@&${dataa.RoleID5}>`)
		], ephemeral:true})
		return; 
				
			}
			
			// Xử lý role-3 ở đây
			pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
					.setStyle(ButtonStyle.Secondary));   
		
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(data.Button2)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));        
		
			pick1.addComponents(
		but3 = new ButtonBuilder()
			.setLabel(data.Button3)
			.setCustomId('role-3')  
			.setStyle(ButtonStyle.Secondary));

			pick1.addComponents(
		but4 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-4')  
			.setStyle(ButtonStyle.Secondary));

		
		const embed1 = new EmbedBuilder()
		.setTitle(data.Title)
	.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed1.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed1.setThumbnail(data.Thumbnail)
		}
			
		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}

		if (data.Emoji3) {
		but3.setEmoji(data.Emoji3)
		}
		
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but4.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed1], components: [pick1]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID4: role.id,
			Button4: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji4: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 4 <@&${dataa.RoleID4}>`)
		], ephemeral:true})
		return; 
			}

			// Xử lý role-2 ở đây
					pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
					.setStyle(ButtonStyle.Secondary));   
		
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(data.Button2)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));        
		
			pick1.addComponents(
		but3 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-3')  
			.setStyle(ButtonStyle.Secondary));

		
		const embed1 = new EmbedBuilder()
		.setTitle(data.Title)
	.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed1.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed1.setThumbnail(data.Thumbnail)
		}

		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}

		if (data.Emoji2) {
		but2.setEmoji(data.Emoji2)
		}
		
		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but3.setEmoji(emojiMatch[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed1], components: [pick1]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID3: role.id,
			Button3: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji3: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 3 <@&${dataa.RoleID3}>`)
		], ephemeral:true})
		return; 
		
		}

		// Xử lý role-1 ở đây
			pick1.addComponents(
			but1 = new ButtonBuilder()
			.setLabel(data.Button1)
			.setCustomId('role-1')
					.setStyle(ButtonStyle.Secondary));   
		
			pick1.addComponents(
		but2 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-2')  
			.setStyle(ButtonStyle.Secondary));

		
		const embed1 = new EmbedBuilder()
		.setTitle(data.Title)
	.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed1.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed1.setThumbnail(data.Thumbnail)
		}
		
		if (data.Emoji1) {
		but1.setEmoji(data.Emoji1)
		}
		
		if (icon) {
		const emoji2Match = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		
		but2.setEmoji(emoji2Match[2])
		}


		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed1], components: [pick1]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID2: role.id,
			Button2: button,
		}, {new: true});

		if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji2: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 2 <@&${dataa.RoleID2}>`)
		], ephemeral:true})
		return;
	} 
		pick1.addComponents(
		but1 = new ButtonBuilder()
			.setLabel(button)
			.setCustomId('role-1')  
			.setStyle(ButtonStyle.Secondary));

		
		const embed1 = new EmbedBuilder()
		.setTitle(data.Title)
	.setDescription(`${data.Description}`)
		.setColor(config.embedCyan)
		.setFooter({ text: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() })
		.setTimestamp()

		if (data.Image) {
		embed1.setImage(data.Image)
		}

		if (data.Thumbnail) {
		embed1.setThumbnail(data.Thumbnail)
		}
	
		if (icon) {
		const emoji1Match = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)
		but1.setEmoji(emoji1Match[2])
		}

		const channel = await client.channels.fetch(data.ChannelID);
	
		const message = await channel.messages.fetch(messageID);
	
		message.edit({embeds: [embed1], components: [pick1]});

		const dataa = await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			RoleID1: role.id,
			Button1: button,
		}, {new: true});

	if (icon) {
		const emojiMatch = icon.match(/<a?:([^:]+):(\d+)>/); //  (/<:([^:]+):(\d+)>/)

		await roleSchema.findOneAndUpdate(
		{Guild: interaction.guild.id,
		MessageID: data.MessageID}, {
			Emoji1: emojiMatch[2]
		}, {new: true}); 
		}
	
		await interaction.reply({embeds: [
		new EmbedBuilder()
		.setColor(config.embedCyan)
		.setDescription(`Đã thêm nút với vai trò tương ứng 1!\nID vai trò: ${dataa.RoleID1}`)
		], ephemeral:true})
	},
};