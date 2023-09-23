const {Orders} = require('../models');

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
    
}

const updateOrder = async (req, res) => {
    
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder
}