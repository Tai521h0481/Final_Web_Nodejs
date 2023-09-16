const {Customers} = require('../models');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customers.findAll();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getCustomerById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const customer = await Customers.findOne({where: {id}});
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createCustomer = async (req, res) => {
    const {Name, Email, Password} = req.body;
    try {
        const customer = await Customers.create({Name, Email, Password});
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer
}