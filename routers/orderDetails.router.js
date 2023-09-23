const express = require('express');
const orderDetailRouter = express.Router();
require('dotenv').config();

// lấy chi tiết đơn hàng theo id đơn hàng
orderDetailRouter.get('/:orderId', /* Your handler here */);

module.exports = orderDetailRouter;