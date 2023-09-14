const express = require('express');
const ordersRouter = express.Router();
require('dotenv').config();

ordersRouter.post('', /* Your handler here */);
// Lấy danh sách tất cả đơn hàng.
ordersRouter.get('' /* Your handler here */);
// Lấy thông tin của một đơn hàng cụ thể.
ordersRouter.get(`/:id`, /* Your handler here */);
// Cập nhật thông tin của một đơn hàng cụ thể.
ordersRouter.put(`/:id`, /* Your handler here */);

module.exports = ordersRouter;