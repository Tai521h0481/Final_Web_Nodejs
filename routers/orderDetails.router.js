const express = require('express');
const orderDetailRouter = express.Router();
require('dotenv').config();

// Lấy danh sách tất cả chi tiết đơn hàng.
orderDetailRouter.get('/', /* Your handler here */);

module.exports = orderDetailRouter;