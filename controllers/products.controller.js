const {Products} = require('../models');

const getAllProducts = async (req, res) => {
    try {
        let products;
        if (req.user.data.Role === 'employee') {
            products = await Products.find().select('-ImportPrice');
        }
        else {
            products = await Products.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProductById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const product = await Products.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProductByName = async (req, res) => {
    const Name = req.params.Name || req.body.Name || req.query.Name;
    try {
        const product = await Products.findOne({Name});
        if(!product){
            return res.status(404).json({message: `Product with Name: ${Name} not found`});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProductByBarcode = async (req, res) => {
    const Barcode = req.params.Barcode || req.body.Barcode || req.query.Barcode;
    try {
        const product = await Products.findOne({Barcode});
        if(!product){
            return res.status(404).json({message: `Product with Barcode: ${Barcode} not found`});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createProduct = async (req, res) => {
    const {Name, ImportPrice, RetailPrice, Category, Quantity} = req.body;
    try {
        let product = await Products.findOne({Name, ImportPrice, RetailPrice, Category});
        if(product){
            product.Quantity += Quantity;
            await product.save();
            return res.status(200).json(product);
        }
        const Barcode = `${Name}_${Category}_${Date.now()}`
        product = await Products.create({Barcode, Name, ImportPrice, RetailPrice, Category, Quantity});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateProduct = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    const {Name, ImportPrice, RetailPrice, Category} = req.body;
    try {
        const product = await Products.findOneAndUpdate(id, {Name, ImportPrice, RetailPrice, Category}, {new: true});
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
    deleteProduct,
    getProductByName,
    getProductByBarcode
}
