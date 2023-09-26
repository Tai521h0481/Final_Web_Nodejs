const { OrderDetails, Products} = require('../models');

const createOrderDetail = async (req, res) => {
    const {Quantity, UnitPrice, Order, Product} = req.body;
    try {
        const orderDetail = await OrderDetails.create({Order, Product, Quantity});
        const product = await Products.findById(Product);
        product.Quantity -= Quantity;
        await product.save();
        res.status(200).json(orderDetail);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createOrderDetail
}