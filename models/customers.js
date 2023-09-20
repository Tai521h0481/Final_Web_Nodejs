const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  FullName: String,
  PhoneNumber: String,
  Address: String,
  Orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }]
});

const Customers = mongoose.model('Customer', CustomerSchema);

module.exports = Customers;