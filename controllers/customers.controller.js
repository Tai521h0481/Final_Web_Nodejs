const {Customers} = require('../models');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customers.find();
        // check customers if empty
        if(!customers){
            return res.status(404).json({message: "There is no customer"});
        }
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getCustomerById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const customer = await Customers.findById(id);
        res.status(200).json(customer);
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
    createCustomer,
    getCustomerByTel
}