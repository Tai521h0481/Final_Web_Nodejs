const express = require('express');
const customersRouter = express.Router();
require('dotenv').config();

const {createCustomer, getAllCustomers, getCustomerById, getCustomerByTel} = require('../controllers/customers.controller');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');
const {isExistId,
    isCreated,
    validateInput,
    isExistEmail,
    isActive} = require('../middlewares/validations/validation');
const {Customers} = require("../models");

customersRouter.post('/', authentication, authorization(['employee']), isActive, createCustomer);
// Lấy danh sách tất cả khách hàng.
customersRouter.get('/', authentication, authorization(['employee']), isActive, getAllCustomers);
// Lấy thông tin của một khách hàng cụ thể.
customersRouter.get(`/:id`, authentication, authorization(['employee']), isActive, isExistId(Customers), getCustomerById);
// Lấy thông tin của kh bằng telephone
customersRouter.get(`/:tel`, authentication, authorization(['employee']), isActive, getCustomerByTel);
// Cập nhật thông tin của một khách hàng cụ thể.
customersRouter.put(`/:id`, /* Your handler here */);

module.exports = customersRouter;