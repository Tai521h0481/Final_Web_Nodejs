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

const getCustomerOrderHistory = async (req, res) => {
    const tel = req.params.tel || req.body.tel || req.query.tel;
    try {
        const customers = await Customers.aggregate([
            {
                $match: { PhoneNumber: tel }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'Customer',
                    as: 'Orders'
                }
            },
            {
                $unwind: '$Orders'
            },
            {
                $sort: { 'Orders.createdAt': -1 }
            }
        ]);
        
        if (customers.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
        }
        
        res.status(200).json({ customer: customers[0] });        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    getCustomerOrderHistory
}