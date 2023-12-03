const { Orders, Customers } = require('../models');
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
    const { user } = req;
    const { TotalAmount, AmountPaidByCustomer, Customer } = req.body;
    try {
        const order = await Orders.create({
            Customer, User: user.data._id,
            TotalAmount, AmountPaidByCustomer, ChangeReturnedToCustomer: AmountPaidByCustomer - TotalAmount
        });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEmployeeOrderHistory = async (req, res) => {
    const userId = req.params.id || req.body.id || req.query.id;

    try {
        const orders = await Orders.aggregate([
            { $match: { User: mongoose.Types.ObjectId(userId) } },
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