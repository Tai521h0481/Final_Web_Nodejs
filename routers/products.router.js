const express = require('express');
const productsRouter = express.Router();
require('dotenv').config();

const {createProduct, deleteProduct, getAllProducts, getProductById, updateProduct} = require('../controllers/products.controller');
const {Products} = require('../models');


// chỉ admin thêm
productsRouter.post('/', createProduct);
// Lấy danh sách tất cả sản phẩm.
productsRouter.get('/', getAllProducts);
// Lấy thông tin của một sản phẩm cụ thể.
productsRouter.get(`/:id`, getProductById);
// Cập nhật thông tin của một sản phẩm cụ thể (chỉ dành cho quản trị viên).
productsRouter.put(`/:id`, updateProduct);
// Xóa một sản phẩm cụ thể nếu chưa được mua (chỉ dành cho quản trị viên).
productsRouter.delete(`/:id`, deleteProduct);

module.exports = productsRouter;