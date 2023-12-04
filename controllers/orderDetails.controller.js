const { OrderDetails, Products} = require('../models');
const mongoose = require('mongoose');

const getOrderDetailById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const orderdetail = await OrderDetails.aggregate([
            {
                $match: { Order: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'Product',
                    foreignField: '_id',
                    as: 'Product'
                }
            },
            {
                $unwind: '$Product'
            },
            {
                $sort: { createdAt: -1}
            }
        ]);
        res.status(200).json(orderdetail);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getOrderDetailById
}