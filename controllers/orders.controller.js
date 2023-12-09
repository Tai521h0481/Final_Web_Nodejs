const {
  Orders,
  Customers,
  OrderDetails,
  Users,
  Products,
} = require("../models");
const mongoose = require("mongoose");
const { startOfMonth, endOfMonth, format } = require('date-fns');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  const id = req.params.id || req.body.id || req.query.id;
  try {
    const order = await Orders.findById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  let { user } = req;
  const { Customer, ListProduct } = req.body;
  const { TotalAmount, AmountPaidByCustomer } = Customer;
  try {
    const employee = await Users.findById(user.data.id);
    let customer = await Customers.findOne({
      PhoneNumber: Customer.PhoneNumber,
    });
    if (!customer) {
      const { Fullname, PhoneNumber, Address } = Customer;
      customer = await Customers.create({ Fullname, PhoneNumber, Address });
    }
    let order = await Orders.create({
      Customer: customer._id,
      User: user.data.id,
      TotalAmount,
      AmountPaidByCustomer,
      ChangeReturnedToCustomer: AmountPaidByCustomer - TotalAmount,
    });
    employee.Orders.push(order.id);
    customer.Orders.push(order.id);
    await customer.save();
    await employee.save();
    for (const item of ListProduct) {
      const orderDetail = await OrderDetails.create({
        Order: order._id,
        Product: item._id,
        Quantity: item.Flag,
      });
      order.OrderDetails.push(orderDetail._id);
      await order.save();
      await Products.findById(item._id).updateOne({ $inc: { Quantity: -item.Flag } })
    }
    const orderWithDetails = await Orders.findById(order._id).populate({
      path: "OrderDetails",
      populate: { path: "Product" },
    });

    res.status(200).json({ customer, orderWithDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeOrderHistory = async (req, res) => {
  const userId = req.params.id || req.body.id || req.query.id;

  try {
    const orders = await Orders.find({ User: userId }).populate(
      "Customer OrderDetails User"
    );
    // populate Product for each OrderDetail
    for (const order of orders) {
      for (const orderDetail of order.OrderDetails) {
        orderDetail.Product = await Products.findById(orderDetail.Product);
      }
    }
    // Calculate and add the size of the OrderDetails array for each order
    const ordersWithSize = orders.map((order) => ({
      ...order._doc,
      OrderDetailSize: order.OrderDetails.length,
      CustomerName: order.Customer.Fullname,
      CustomerPhoneNumber: order.Customer.PhoneNumber,
      EmployeeName: order.User.Fullname
    }));

    res.status(200).json({ orders: ordersWithSize });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerOrderHistory = async (req, res) => {
  const CustomerId = req.params.id || req.body.id || req.query.id;
  try {
    const orders = await Orders.find({ Customer: CustomerId }).populate('Customer OrderDetails User');
    // populate Product for each OrderDetail
    for (const order of orders) {
      for (const orderDetail of order.OrderDetails) {
        orderDetail.Product = await Products.findById(orderDetail.Product);
      }
    }
    // Calculate and add the size of the OrderDetails array for each order
    const ordersWithSize = orders.map(order => ({
      ...order._doc,
      OrderDetailSize: order.OrderDetails.length,
      CustomerName: order.Customer.Fullname,
      CustomerPhoneNumber: order.Customer.PhoneNumber,
      EmployeeName: order.User.Fullname
    }));

    res.status(200).json({ orders: ordersWithSize });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getFiveOrders = async (req, res) => {
  const { user } = req;
  try {
    let orders;
    if (user.data.Role === 'admin') {
      orders = await Orders.find().populate('User').sort({ createdAt: -1 }).limit(5);
    } else {
      orders = await Orders.find({ User: user.data.id }).populate('User').sort({ createdAt: -1 }).limit(5);
    }
    let returnOrders = [];
    for (let order of orders) {
      let returnOrder = {};
      returnOrder.TotalAmount = order.TotalAmount;
      returnOrder.EmployeeName = order.User.Fullname;
      returnOrder.Avatar = order.User.Profile_Picture;
      returnOrder.Email = order.User.Email;
      returnOrders.push(returnOrder);
    }
    let totalOrderInMonth = 0;
    if (user.data.Role === 'employee') {
      const currentDate = new Date();
      const startOfMonthDate = startOfMonth(currentDate);
      const endOfMonthDate = endOfMonth(currentDate);

      const ordersInMonth = await Orders.find({
        User: user.data.id,
        createdAt: { $gte: startOfMonthDate, $lte: endOfMonthDate }
      });

      totalOrderInMonth = ordersInMonth.length;
    }
    returnOrders = { totalOrderInMonth, orders: returnOrders };
    res.status(200).json({ data: returnOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  getEmployeeOrderHistory,
  getCustomerOrderHistory,
  getFiveOrders
}