const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  Barcode: String,
  Name: { type: String, required: true },
  ImportPrice: { type: Number, required: true },
  RetailPrice: { type: Number, required: true },
  Category: { type: String, required: true },
  Quantity: { type: Number, required: true },
  OrderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail', required: true }]
},
  {
    timestamps: true
  }
);

const Products = mongoose.model('Product', ProductSchema);

module.exports = Products;