const {Orders} = require('../models');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getOrderById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const order = await Orders.findOne({where: {id}});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createOrder = async (req, res) => {
    const {Name, ImportPrice, RetailPrice, Category} = req.body;
    const Barcode = `${Name}_${Category}_${Date.now()}`
    try {
        const order = await Orders.create({Barcode, Name, ImportPrice, RetailPrice, Category});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateOrder = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    const {Name, ImportPrice, RetailPrice, Category} = req.body;
    try {
        const order = await Orders.update({Name, ImportPrice, RetailPrice, Category}, {where: {id}});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const deleteOrder = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const order = await Orders.destroy({where: {id}});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
}