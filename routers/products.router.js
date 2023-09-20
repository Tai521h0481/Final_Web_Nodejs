const express = require('express');
const productsRouter = express.Router();
require('dotenv').config();

const {createProduct, deleteProduct, getAllProducts, getProductById, updateProduct} = require('../controllers/products.controller');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');
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
// Lấy thông tin của một sản phẩm cụ thể.
productsRouter.get(`/:id`, authentication, authorization(['admin']), isExistId(Products), getProductById);
// Cập nhật thông tin của một sản phẩm cụ thể (chỉ dành cho quản trị viên).
productsRouter.put(`/:id`, authentication, authorization(['admin']), isExistId(Products), updateProduct);
// Xóa một sản phẩm cụ thể nếu chưa được mua (chỉ dành cho quản trị viên).
productsRouter.delete(`/:id`, authentication, authorization(['admin']), deleteProduct);

module.exports = productsRouter;