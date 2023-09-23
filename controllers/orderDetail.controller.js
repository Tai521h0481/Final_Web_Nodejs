const {orderDetails} = require('../models');

const getOrderDetailByOrderId = async (req, res) => {
    const orderId = req.params || req.body || req.query;
    try {
        const orderDetail = await orderDetails.find({ Order: orderId }).populate('Product');
        res.status(200).json(orderDetail);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getOrderDetailToday = async (req, res) => {
    try {
        const orderDetail = await orderDetails.find({ Order: orderId }).populate('Product');
        res.status(200).json(orderDetail);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
} 

module.exports = {
    getOrderDetailByOrderId
}