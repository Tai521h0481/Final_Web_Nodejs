const express = require('express');
const productsRouter = express.Router();
require('dotenv').config();

productsRouter.post('/', /* Your handler here */);
// Lấy danh sách tất cả sản phẩm.
productsRouter.get('/', /* Your handler here */);
// Lấy thông tin của một sản phẩm cụ thể.
productsRouter.get(`/:id`, /* Your handler here */);
// Cập nhật thông tin của một sản phẩm cụ thể (chỉ dành cho quản trị viên).
productsRouter.put(`/:id`, /* Your handler here */);
// Xóa một sản phẩm cụ thể (chỉ dành cho quản trị viên).
productsRouter.delete(`/:id`, /* Your handler here */);

module.exports = productsRouter;