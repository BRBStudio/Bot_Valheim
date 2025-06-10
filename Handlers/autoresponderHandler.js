// const { TextChannel, ThreadChannel } = require('discord.js');
// const Autoresponder = require('../schemas/autoresponderSchema');

// /*
//     Tự động thiết lập các bộ thu thập tin nhắn (bộ thu thập tin nhắn) cho các kênh 
//     trên máy dựa trên câu trả lời tự động cấu hình (trả lời tự động) đã được lưu trong cơ sở dữ liệu
// */

// module.exports = async (client) => {
//     const guilds = client.guilds.cache.map(guild => guild.id);
// //   console.log('Danh sách các guild:', guilds);
  
//     for (const guildId of guilds) {
//         const guild = await client.guilds.fetch(guildId);
//         // console.log(`Đang xử lý guild: ${guildId}`);
//         const channels = await guild.channels.fetch();
//         const autoresponders = await Autoresponder.find({ guildId });

//         // console.log(`Số lượng autoresponder tìm thấy: ${autoresponders.length}`);
        
//         for (const autoresponder of autoresponders) {
//             // console.log(`Xử lý autoresponder: ${JSON.stringify(autoresponder)}`);
//         for (const [channelId, channel] of channels) {
//             if (channel instanceof TextChannel || channel instanceof ThreadChannel) {
//                 // console.log(`Tạo collector cho kênh: ${channelId}`);
//             const filter = message => {
//                 if (!message.content) return false;
//                 const content = message.content.toLowerCase();
//                 return autoresponder.questions.some(question => content.includes(question));
//             };

//                 const collector = channel.createMessageCollector({ filter, dispose: true });
//                 collector.on('collect', async message => {
//                     // console.log(`Tin nhắn thu thập được: ${message.content}`);
//                 await message.channel.send(autoresponder.answer[0]); // Gửi câu trả lời đầu tiên
//                 });

            
//             }
//         }
//         }
//     }
// };



/////////////////////////////////////////////////////////////////////
// const { TextChannel, ThreadChannel } = require('discord.js');
// const Autoresponder = require('../schemas/autoresponderSchema');

// const collectors = new Map(); // Lưu collectors để có thể hủy khi cần

// async function updateCollectors(client, guildId) {
//     if (collectors.has(guildId)) {
//         const oldCollectors = collectors.get(guildId);
//         oldCollectors.forEach(collector => collector.stop());
//     }

//     const newCollectors = [];
//     const guild = await client.guilds.fetch(guildId);
//     const channels = await guild.channels.fetch();
//     const autoresponders = await Autoresponder.find({ guildId });

//     for (const [channelId, channel] of channels) {
//         if (channel instanceof TextChannel || channel instanceof ThreadChannel) {
//             const filter = message => {
//                 if (!message.content || message.author.bot) return false;
//                 const content = message.content.toLowerCase();
//                 return autoresponders.some(ar => ar.questions.some(q => content.includes(q)));
//             };

//             const collector = channel.createMessageCollector({ filter, dispose: true });

//             collector.on('collect', async message => {
//                 const responder = autoresponders.find(ar => 
//                     ar.questions.some(q => message.content.toLowerCase().includes(q))
//                 );

//                 if (responder) {
//                     await message.channel.send(responder.answer[0]);
//                 }
//             });

//             newCollectors.push(collector);
//         }
//     }

//     collectors.set(guildId, newCollectors);
// }

// module.exports = async (client) => {
//     for (const guild of client.guilds.cache.values()) {
//         await updateCollectors(client, guild.id);
//     }
// };

// module.exports.updateCollectors = updateCollectors;




const { TextChannel, ThreadChannel } = require('discord.js');
const Autoresponder = require('../schemas/autoresponderSchema');

const collectors = new Map(); // Lưu collectors để có thể hủy khi cần

async function updateCollectors(client, guildId) {
  if (collectors.has(guildId)) {
    collectors.get(guildId).forEach(collector => collector.stop());
  }

  const newCollectors = [];
  const guild = await client.guilds.fetch(guildId);
  const channels = await guild.channels.fetch();
  const responder = await Autoresponder.findOne({ guildId });

  if (!responder || responder.questions.length === 0) {
    collectors.set(guildId, []);
    return;
  }

  for (const [channelId, channel] of channels) {
    if (channel instanceof TextChannel || channel instanceof ThreadChannel) {
      const filter = message => {
        if (!message.content || message.author.bot) return false;
        const content = message.content.toLowerCase();
        return responder.questions.some(q => content.includes(q));
      };

      const collector = channel.createMessageCollector({ filter });

      collector.on('collect', async message => {
        const content = message.content.toLowerCase();
        for (let i = 0; i < responder.questions.length; i++) {
          if (content.includes(responder.questions[i])) {
            return message.channel.send(responder.answer[i]);
          }
        }
      });

      newCollectors.push(collector);
    }
  }

  collectors.set(guildId, newCollectors);
}

module.exports = async (client) => {
  for (const guild of client.guilds.cache.values()) {
    await updateCollectors(client, guild.id);
  }
};

module.exports.updateCollectors = updateCollectors;


/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/