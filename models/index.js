// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Tạo lược đồ
// const CustomerSchema = new Schema({
//   FullName: String,
//   PhoneNumber: String,
//   Address: String,
//   Orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }]
// });
// const OrderDetailSchema = new Schema({
//   Order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
//   Product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//   Quantity: { type: Number, required: true },
//   UnitPrice: { type: Number, required: true }
// });
// const OrderSchema = new Schema({
//   User: { type: Schema.Types.ObjectId, ref: 'User' },
//   Customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
//   TotalAmount: { type: Number, required: true },
//   AmountPaidByCustomer: { type: Number, required: true },
//   ChangeReturnedToCustomer: { type: Number, required: true },
//   OrderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail', required: true }]
// });
// const ProductSchema = new Schema({
//   Barcode: String,
//   Name: { type: String, required: true },
//   ImportPrice: { type: Number, required: true },
//   RetailPrice: { type: Number, required: true },
//   Category: { type: String, required: true },
//   OrderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail', required: true }]
// },
//   {
//     timestamps: true
//   }
// );
// const UserSchema = new Schema({
//   Email: { type: String, required: true, unique: true },
//   Password: { type: String, required: true },
//   Fullname: { type: String, required: true },
//   Role: { type: String, default: 'employee' },
//   Profile_Picture: String,
//   IsOnline: { type: Boolean, default: false },
//   IsLocked: { type: Boolean, default: false },
//   IsActive: { type: Boolean, default: false },
//   Orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }]
// });

// // Tạo mô hình từ lược đồ
// const Customers = mongoose.model('Customer', CustomerSchema);
// const OrderDetails = mongoose.model('OrderDetail', OrderDetailSchema);
// const Orders = mongoose.model('Order', OrderSchema);
// const Products = mongoose.model('Product', ProductSchema);
// const Users = mongoose.model('User', UserSchema);

const Customers = require('./Customers');
const OrderDetails = require('./Orderdetails');
const Orders = require('./Orders');
const Products = require('./Products');
const Users = require('./Users');
const Images = require('./Image');

module.exports = { Customers, OrderDetails, Orders, Products, Users, Images };