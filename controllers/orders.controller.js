const {
  Orders,
  Customers,
  OrderDetails,
  Users,
  Products,
} = require("../models");
const mongoose = require("mongoose");

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
  const { user } = req;

  try {
    // if (user.data.Role !== 'admin' && user.data.id !== userId) {
    //     return res.status(401).json({ message: 'You do not have permission' });
    // }

    const orders = await Orders.find({ User: userId }).populate(
      "Customer OrderDetails"
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
    }));

    res.status(200).json({ orders: ordersWithSize });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    getEmployeeOrderHistory
}