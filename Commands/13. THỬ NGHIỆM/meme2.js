// const { SlashCommandBuilder } = require('discord.js');
// const translate = require('@iamtraction/google-translate');

// const languageNames = {
//   'en': 'English',  
//   'de': 'German',
//   'fr': 'French',
//   'it': 'Italian',  
//   'es': 'Spanish',  
//   'ja': 'Japanese',
//   'zh-CN': 'Chinese (Simplified)',  
//   'ko': 'Korean', 
//   'hu': 'Hungarian',
//   'ru': 'Russian',  
//   // 'pt': 'Portugese - 🇵🇹',  
//   'hi': 'Hindi',    
//   'nl': 'Dutch',  
//   'sv': 'Swedish', 
//   'tr': 'Turkish', 
//   'pl': 'Polish', 
//   'el': 'Greek', 
//   'cs': 'Czech', 
//   // 'da': 'Danish - 🇩🇰', 
//   // 'et': 'Estonian - 🇪🇪', 
//   'fi': 'Finnish', 
//   // 'ga': 'Irish - 🇮🇪', 
//   // 'lt': 'Lithuanian - 🇱🇹', 
//   // 'no': 'Norwegian - 🇳🇴', 
//   'ro': 'Romanian', 
//   'sk': 'Slovak', 
//   'uk': 'Ukrainian', 
//   'hr': 'Croatian', 
//   // 'af': 'Afrikaans - 🇦🇫', 
//   // 'am': 'Amharic - 🇦🇲', 
//   // 'ar': 'Arabic', 
//   // 'az': 'Azerbaijani - 🇦🇿', 
//   // 'be': 'Belarusian - 🇧🇾', 
//   // 'bg': 'Bulgarian - 🇧🇬', 
//   // 'ka': 'Georgian - 🇬🇪', 
//   'iw': 'Hebrew', 
//   // 'is': 'Icelandic - 🇮🇸', 
//   // 'id': 'Indonesian - 🇮🇩',   
//   // 'lv': 'Latvian - 🇱🇻', 
//   // 'mk': 'Macedonian - 🇲🇰', 
//   // 'ms': 'Malay - 🇲🇾', 
//   // 'sr': 'Serbian - 🇷🇸', 
//   'sl': 'Slovenian', 
//   //'th': 'Thai', 
//   'vi': 'Vietnamese - 🇻🇳', 
// };

// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName('translate-to')
//     .setDescription('Dịch tin nhắn sang ngôn ngữ đã chọn')
//     .addStringOption(option => option.setName('message').setDescription('Tin nhắn bạn muốn dịch').setRequired(true))
    
//     .addStringOption(option => {
// 		option.setName('language')
// 		.setDescription('Ngôn ngữ bạn muốn dịch sang')
// 		.setRequired(true);
      
//       let choices = Object.entries(languageNames).map(([key, value]) => {
//         return {
//             name: value,
//             value: key
//         };
//       });
      
//       for (let i = 0; i < choices.length; i++) {        
//         option.addChoices(choices[i]);
//       }
//       return option;
//     }),

//     guildSpecific: true,
//     guildId: ['1319809040032989275', '1312185401347407902', `1319947820991774753`],
    
//     async execute (interaction) {
//         const message = interaction.options.getString('message');
//         const language = interaction.options.getString('language');

//         const translated = await translate(message, { to: language });
//         let originalLanguage = languageNames[translated.from.language.iso] || translated.from.language.iso;
//         const member = interaction.user;
//         const header = "<a:vip:1320072970340925470> BRB STUDIO được sử dụng để gửi tin nhắn bằng tiếng Việt " + languageNames[language] + "\n\n";
//         interaction.channel
// 			.createWebhook({
// 				name: member.username,
// 				avatar: member.displayAvatarURL({ dynamic: true }),
// 			})
// 			.then((webhook) => {
// 				webhook.send({ content: header + translated.text });
// 				setTimeout(() => {
// 				webhook.delete();
// 				}, 3000);
// 			});
//         interaction.reply({
// 			content: "Tin nhắn đã được dịch sang " + languageNames[language] + " và gửi thành công\n\nTin nhắn gốc được viết bằng " + originalLanguage +"\n\n" + message,
// 			ephemeral: true,
//         });
//     }
// }
