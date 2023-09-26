const {Orders, Customers} = require('../models');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getOrderById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const order = await Orders.findById(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createOrder = async (req, res) => {
    const {user} = req;
    const {TotalAmount, AmountPaidByCustomer, Customer} = req.body;
    try {
        const order = await Orders.create({Customer, User: user.data._id, 
            TotalAmount, AmountPaidByCustomer, ChangeReturnedToCustomer: AmountPaidByCustomer - TotalAmount});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getCustomerOrderHistory = async (req, res) => {
    const tel = req.params.tel || req.body.tel || req.query.tel;
    try {
        const customer = await Customers.findOne({ PhoneNumber: tel });
        const orders = await Orders.find({ Customer: customer._id })
            .populate({
                path: 'OrderDetails',
                populate: {
                    path: 'Products'
                }
            })
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
        res.status(200).json(orders);
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