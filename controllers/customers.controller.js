const {Customers, Orders} = require('../models');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customers.find();
        if(!customers){
            return res.status(404).json({message: "There is no customer"});
        }
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getCustomerByTel = async (req, res) => {
    const tel = req.params.tel || req.body.tel || req.query.tel;
    try {
        const customer = await Customers.findOne({PhoneNumber: tel});
        if(!customer){
            return res.status(404).json({message: "Customer not found"});
        }
        res.status(200).json(customer);
    } catch (error) {
        
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

const createCustomer = async (req, res) => {
    const {FullName, PhoneNumber, Address} = req.body;
    try {
        const customer = await Customers.create({FullName, PhoneNumber, Address});
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllCustomers,
    createCustomer,
    getCustomerByTel,
    getCustomerOrderHistory
}