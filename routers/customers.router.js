const express = require('express');
const customersRouter = express.Router();
require('dotenv').config();

const {createCustomer, getAllCustomers, getCustomerByTel, } = require('../controllers/customers.controller');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');
const {isExistId,
    isCreated,
    validateInput,
    isExistEmail,
    isActive} = require('../middlewares/validations/validation');
const {Customers} = require("../models");

customersRouter.post('/', authentication, authorization(['employee']), isActive, validateInput(['FullName', 'PhoneNumber', 'Address']),createCustomer);
// Lấy danh sách tất cả khách hàng.
customersRouter.get('/', authentication, authorization(['employee']), isActive, getAllCustomers);
// Lấy thông tin của kh bằng telephone
customersRouter.get(`/:tel`, authentication, authorization(['employee']), isActive, getCustomerByTel);

module.exports = customersRouter;