const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
  Order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  Product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  Quantity: { type: Number, required: true }
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

const OrderDetails = mongoose.model('OrderDetail', OrderDetailSchema);

module.exports = OrderDetails;