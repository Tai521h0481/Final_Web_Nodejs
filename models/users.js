const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Fullname: { type: String, required: true },
  Role: { type: String, default: 'employee' },
  Profile_Picture: String,
  IsOnline: { type: Boolean, default: false },
  IsLocked: { type: Boolean, default: false },
  IsActive: { type: Boolean, default: false },
  Orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }]
});

const Users = mongoose.model('User', UserSchema);

module.exports = Users;