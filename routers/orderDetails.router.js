const express = require('express');
const orderDetailsRouter = express.Router();
require('dotenv').config();

const {getOrderDetailById} = require('../controllers/orderDetails.controller');
const {isExistId,
    isCreated,
    validateInput,
    isExistEmail,
    isActive} = require('../middlewares/validations/validation');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');

const authMiddleware  = [authentication, authorization(['employee']), isActive];

// tạo chi tiết đơn hàng
// orderDetailsRouter.post('/', ...authMiddleware, validateInput(['Quantity', 'UnitPrice', 'Order', 'Product']), createOrderDetail);
// lấy chi tiết đơn hàng thông qua id Order
orderDetailsRouter.get('/:id', ...authMiddleware, getOrderDetailById);

module.exports = orderDetailsRouter;