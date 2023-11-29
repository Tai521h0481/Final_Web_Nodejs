const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  Barcode: String,
  Name: { type: String, required: true },
  ImportPrice: { type: Number, required: true },
  RetailPrice: { type: Number, required: true },
  Category: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Image: { type: String, required: true },
  Flag: { type: Number, default: 1},
  OrderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail', required: true }]
},
  {
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

const Products = mongoose.model('Product', ProductSchema);

module.exports = Products;