const { Orders, Customers, OrderDetails, Users, Products } = require('../models');
const mongoose = require('mongoose');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const order = await Orders.findById(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createOrder = async (req, res) => {
    let { user } = req;
    const { Customer, ListProduct } = req.body;
    const { TotalAmount, AmountPaidByCustomer } = Customer;
    try {
        let customer = await Customers.findOne({ PhoneNumber: Customer.PhoneNumber });
        if (!customer) {
            const {FullName, PhoneNumber, Address} = Customer;
            customer = await Customers.create({FullName, PhoneNumber, Address});
        }
        let order = await Orders.create({
            Customer : customer.id,
            User: user.data.id,
            TotalAmount,
            AmountPaidByCustomer,
            ChangeReturnedToCustomer: AmountPaidByCustomer - TotalAmount
        });
        customer.Orders.push(order.id);
        await customer.save();

        for (const item of ListProduct) {
            const orderDetail = await OrderDetails.create({
                Order: order.id,
                Product: item.ProductId,
                Quantity: item.Quantity,
            });
            order.OrderDetails.push(orderDetail.id);
            await order.save();
        }
        const orderWithDetails = await Orders.findById(order.id)
            .populate({
                path: 'OrderDetails',
                populate: { path: 'Product' }
            });

        res.status(200).json({ customer, orderWithDetails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEmployeeOrderHistory = async (req, res) => {
    const userId = req.params.id || req.body.id || req.query.id;
    const { user } = req;
    if(user.data.Role !== 'admin' && user.data.id !== userId){
        return res.status(401).json({ message: 'You do not have permission' });
    }
    try {
        const orders = await Orders.aggregate([
            { $match: { User: new mongoose.Types.ObjectId(userId) } }, // Corrected line
            {
                $lookup: {
                    from: "orderdetails",
                    localField: "_id",
                    foreignField: "Order",
                    as: "OrderDetails"
                }
            }
        ]);

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    getEmployeeOrderHistory
}