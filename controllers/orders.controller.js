const { Orders, Customers, OrderDetails, Users } = require('../models');
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
    const { TotalAmount, AmountPaidByCustomer, Customer, ListProduct } = req.body;
    try {
        // Tạo đơn hàng mới
        const order = await Orders.create({
            Customer,
            User: user.data.id,
            TotalAmount,
            AmountPaidByCustomer,
            ChangeReturnedToCustomer: AmountPaidByCustomer - TotalAmount
        });

        // Thêm đơn hàng vào danh sách đơn hàng của khách hàng
        const customer = await Customers.findById(Customer);
        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }
        customer.Orders.push(order.id);
        await customer.save();
        // Tạo OrderDetails cho mỗi sản phẩm trong ListProduct
        for (const item of ListProduct) {
            await OrderDetails.create({
                Order: order.id,
                Product: item.ProductId,
                Quantity: item.Quantity
            });
        }

        // Trả về thông tin đơn hàng
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEmployeeOrderHistory = async (req, res) => {
    const userId = req.params.id || req.body.id || req.query.id;

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