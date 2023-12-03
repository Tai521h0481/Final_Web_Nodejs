const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  Username: { type: String, required: true, unique: true },  
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Fullname: { type: String, required: true },
  Role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  Profile_Picture: { type: String, default: `https://res.cloudinary.com/dfxqz0959/image/upload/v1701536638/cloudImageWebNodejs/piture_product/pdu6r9dtlfnshwrvsbqm.jpg`},
  IsOnline: { type: Boolean, default: false },
  IsLocked: { type: Boolean, default: false },
  IsActive: { type: Boolean, default: false },
  FirstLogin: { type: Boolean, default: false },
  Orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }]
}, {
    toJSON: {
        virtuals: true, 
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true },
    versionKey: false 
});

const Users = mongoose.model('User', UserSchema);

module.exports = Users;