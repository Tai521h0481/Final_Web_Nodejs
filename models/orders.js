const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  User: { type: Schema.Types.ObjectId, ref: 'User' },
  Customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  TotalAmount: { type: Number, required: true },
  AmountPaidByCustomer: { type: Number, required: true },
  ChangeReturnedToCustomer: { type: Number, required: true },
  OrderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail', required: true }]
});

const Orders = mongoose.model('Order', OrderSchema);

module.exports = Orders;