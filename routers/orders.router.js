const express = require('express');
const ordersRouter = express.Router();
require('dotenv').config();


const {getAllOrders,
    getOrderById, getCustomerOrderHistory,
    createOrder, getEmployeeOrderHistory, getFiveOrders} = require('../controllers/orders.controller');
const {isExistId,
    isCreated,
    validateInput,
    isExistEmail,
    isActive} = require('../middlewares/validations/validation');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');

const authMiddleware  = [authentication, authorization(['employee']), isActive];

ordersRouter.post('/', ...authMiddleware, createOrder);
// Lấy danh sách tất cả đơn hàng.
ordersRouter.get('/' , ...authMiddleware, getAllOrders);
// Lấy thông tin của một đơn hàng cụ thể.
ordersRouter.get(`/:id`, ...authMiddleware, getOrderById);
// lấy order theo customer
ordersRouter.get('/employee/:id', authentication, authorization(['admin', 'employee']), getEmployeeOrderHistory);

ordersRouter.get('/customer/:id', authentication, authorization(['admin', 'employee']), getCustomerOrderHistory)

ordersRouter.get("/getOrder/getFiveOrder", authentication, authorization(['admin', 'employee']), getFiveOrders)

module.exports = ordersRouter;