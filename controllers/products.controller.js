const {Products} = require('../models');

const getAllProducts = async (req, res) => {
    try {
        const products = await Products.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProductById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const product = await Products.findOne({where: {id}});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createProduct = async (req, res) => {
    const {Name, ImportPrice, RetailPrice, Category} = req.body;
    const Barcode = `${Name}_${Category}_${Date.now()}`
    try {
        const product = await Products.create({Barcode, Name, ImportPrice, RetailPrice, Category});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateProduct = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    const {Name, ImportPrice, RetailPrice, Category} = req.body;
    try {
        const product = await Products.update({Name, ImportPrice, RetailPrice, Category}, {where: {id}});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteProduct = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const product = await Products.destroy({where: {id}});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
