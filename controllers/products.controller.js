const {Products, OrderDetails, Images} = require('../models');

const getAllProducts = async (req, res) => {
    try {
        let products;
        if (req.user.data.Role === 'employee') {
            products = await Products.find().select('-ImportPrice').populate('Image');
        }
        else {
            products = await Products.find().populate('Image');
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const getProductById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const product = await Products.findById(id).populate('Image');
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const getProductByName = async (req, res) => {
    const Name = req.params.Name || req.body.Name || req.query.Name;
    try {
        let product;
        if (req.user.data.Role === 'employee') {
            product = await Products.findOne({Name}).select('-ImportPrice').populate('Image');
        }
        else {
            product = await Products.findOne({Name}).populate('Image');
        }
        if (!product) {
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
        let product;
        if (req.user.data.Role === 'employee') {
            product = await Products.findOne({ Barcode }).select('-ImportPrice').populate('Image');
        } else {
            product = await Products.findOne({ Barcode }).populate('Image');
        }
        if (!product) {
            return res.status(404).json({ message: `Product with Barcode: ${Barcode} not found` });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createProduct = async (req, res) => {
    let { Name, ImportPrice, RetailPrice, Category, Quantity, Image } = req.body;
    try {
        let product = await Products.findOne({ Name });
        if (product) {
            await Products.findByIdAndUpdate(product.id, { Quantity: product.Quantity + Quantity }, { new: true });
            return res.status(200).json(product);
        }

        const Barcode = `${Name.replace(' ', '_')}_${Category}_${Date.now()}`;
        product = new Products({ Barcode, Name, ImportPrice, RetailPrice, Category, Quantity });

        // Xử lý thêm ảnh
        for (const img of Image) {
            let image = new Images({ url: img.url, Product: product.id });
            await image.save();
            product.Image.push(image._id);
        }

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { Name, ImportPrice, RetailPrice, Category, Quantity, Image } = req.body;

    try {
        const product = await Products.findById(id);

        // Xóa ảnh cũ nếu có ảnh mới
        if (Image && Image.length > 0) {
            await Images.deleteMany({ Product: id });
            product.Image = [];

            for (const img of Image) {
                let image = new Images({ url: img.url, Product: id });
                await image.save();
                product.Image.push(image.id);
            }
        }

        // Cập nhật thông tin sản phẩm
        product.Name = Name || product.Name;
        product.ImportPrice = ImportPrice || product.ImportPrice;
        product.RetailPrice = RetailPrice || product.RetailPrice;
        product.Category = Category || product.Category;
        product.Quantity = Quantity || product.Quantity;

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteProduct = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;

    try {
        const orderDetail = await OrderDetails.findOne({Product: id});
        if (orderDetail) {
            return res.status(400).json({message: "Cannot delete product that has been ordered"});
        }

        // Xóa các ảnh liên quan trước khi xóa sản phẩm
        await Images.deleteMany({ Product: id });

        const product = await Products.findByIdAndDelete(id);
        if(product){
            return res.status(200).json({ message: "Deleted product successfully", product});
        }
        res.status(404).json({message: `Product with id: ${id} not found`});
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
