// const { ShardingManager } = require('discord.js');
// require('dotenv').config();
// const colors = require('colors');

// // Số lượng shard bạn muốn
// const totalShards = 2;

// const manager = new ShardingManager('./bot.js', {
//     totalShards: totalShards, // Chia thành 2 shard
//     token: process.env.token, // Dùng token từ .env
// });

// // Khi một shard được tạo
// manager.on('shardCreate', shard => {
//     console.log(colors.green(`🚀 Đã khởi động shard ${shard.id}`));
// });

// // Khởi chạy tất cả các shard
// manager.spawn();
