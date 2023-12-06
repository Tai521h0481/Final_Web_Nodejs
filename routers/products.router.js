const express = require('express');
const productsRouter = express.Router();
require('dotenv').config();

const {createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, getProductByBarcode, getProductByName} = require('../controllers/products.controller');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');
const {uploadProductImage} = require('../middlewares/upload/uploadImage');
const {isExistId,
    isCreated,
    validateInput,
    isExistEmail,
    isActive} = require('../middlewares/validations/validation');
const {Products} = require('../models');


// chỉ admin thêm (đã test)
productsRouter.post('/', authentication, authorization(['admin']), validateInput(["Name", "ImportPrice", "RetailPrice", "Category", "Quantity"]), createProduct);
// Lấy danh sách tất cả sản phẩm. (đã test)
productsRouter.get('/', authentication, authorization(['admin', 'employee']), isActive, getAllProducts);
// Lấy thông tin của một sản phẩm cụ thể theo id
productsRouter.get(`/:id`, authentication, authorization(['admin']), isExistId(Products), getProductById);
// Lấy thông tin của một sản phẩm cụ thể theo Barcode
productsRouter.get(`/barcode/:Barcode`, authentication, authorization(['admin', 'employee']), isActive, getProductByBarcode);
// Lấy thông tin của một sản phẩm cụ thể theo Name
productsRouter.get(`/name/:Name`, authentication, authorization(['admin', 'employee']), isActive ,getProductByName);
// Cập nhật thông tin của một sản phẩm cụ thể (chỉ dành cho quản trị viên).
productsRouter.patch(`/:id`, authentication, authorization(['admin']), isExistId(Products), updateProduct);
// Xóa một sản phẩm cụ thể nếu chưa được mua (chỉ dành cho quản trị viên).
productsRouter.delete(`/:id`, authentication, authorization(['admin']), deleteProduct);

module.exports = productsRouter;