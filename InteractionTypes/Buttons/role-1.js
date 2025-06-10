/*
Sử dụng cho lệnh pickrole-add-role.js
*/
const { EmbedBuilder } = require(`discord.js`)
const roleSchema = require("../../schemas/roleSchema");
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'role-1',
    description: `Nút này cho phép người dùng nhận hoặc gỡ bỏ vai trò dựa trên mongoDB lệnh pickrole-add-role.`,
    async execute(interaction, client) {
      try{
          const { guild, channel, member, message } = interaction;

          const data = await roleSchema.findOne({
              Guild: guild.id,
              MessageID: message.id
            });

          if (!data) return interaction.reply(`Lỗi mongo data`);
          
          const role = guild.roles.cache.get(data.RoleID1);
          
          if (role && member.roles.cache.has(data.RoleID1)) {
            member.roles.remove(role);
      
            const embed1 = new EmbedBuilder().setColor(config.embedRed).setDescription(`Đã gỡ vai trò ${role}`); // .setColor('#2C2D31')
            interaction.reply({ embeds: [embed1], ephemeral: true });
          } else if (role) {
            member.roles.add(role);
      
            const embed1 = new EmbedBuilder().setColor(config.embedGreen).setDescription(`Bạn đã chọn vai trò ${role}`);
            interaction.reply({ embeds: [embed1], ephemeral: true });
          } else {
            interaction.reply(`Vai trò không tồn tại.`);
          }
      } catch (error) {
        interactionError.execute(interaction, error, client);
      }
    },
};