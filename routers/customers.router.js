const express = require('express');
const customersRouter = express.Router();
require('dotenv').config();

customersRouter.post('/', /* Your handler here */);
// Lấy danh sách tất cả khách hàng.
customersRouter.get('/', /* Your handler here */);
// Lấy thông tin của một khách hàng cụ thể.
customersRouter.get(`/:id`, /* Your handler here */);
// Cập nhật thông tin của một khách hàng cụ thể.
customersRouter.put(`/:id`, /* Your handler here */);

module.exports = customersRouter;