const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    Name: { type: String, required: true },
    Barcode: { type: String, required: true },
    ImportPrice: { type: Number, required: true },
    RetailPrice: { type: Number, required: true },
    Category: { type: String, required: true },
    Quantity: { type: Number, required: true },
    Image: [{ type: Schema.Types.ObjectId, ref: "Image"}],
    Flag: { type: Number, default: 0 },
    OrderDetails: [
      { type: Schema.Types.ObjectId, ref: "OrderDetail", required: true },
    ],
  },
  {
    timestamps: true,
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;
