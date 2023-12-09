const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  Fullname: String,
  PhoneNumber: String,
  Address: String,
  Orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }]
},{
  timestamps: true
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

const Customers = mongoose.model('Customer', CustomerSchema);

module.exports = Customers;