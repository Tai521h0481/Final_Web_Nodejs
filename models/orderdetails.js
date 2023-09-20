const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
  Order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  Product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  Quantity: { type: Number, required: true },
  UnitPrice: { type: Number, required: true }
});

const OrderDetails = mongoose.model('OrderDetail', OrderDetailSchema);

module.exports = OrderDetails;