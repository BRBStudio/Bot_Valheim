const { model, Schema } = require("mongoose");

const roleSchema = new Schema({
    RoleID: String,
    RoleName: String,
    RoleDescription: String,
    ChannelType: String,
});

const pingStaffSchema = new Schema({
    Guild: String,
    Roles: [roleSchema] // Sử dụng mảng các đối tượng roleSchema
});

module.exports = model("PingStaff", pingStaffSchema);
