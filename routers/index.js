const express = require('express');
require('dotenv').config();
const rootRouter = express.Router();

const usersRouter = require('./users.router');
const productsRouter = require('./products.router');
const ordersRouter = require('./orders.router');
const orderDetailsRouter = require('./orderDetails.router');
const customersRouter = require('./customers.router');
const reportsRouter = require('./reports.router');

rootRouter.use('/users', usersRouter);
rootRouter.use('/products', productsRouter);
rootRouter.use('/orders', ordersRouter);
rootRouter.use('/orderDetails', orderDetailsRouter);
rootRouter.use('/customers', customersRouter);
rootRouter.use('/reports', reportsRouter);

const {pageChangePassword} = process.env
const {authenticationLinkLogin} = require('../middlewares/authentication/authentication');
rootRouter.post(`${pageChangePassword}`, authenticationLinkLogin, (req, res) => {
    res.status(200).json({message: 'success', email: req.user.Email});
});

module.exports = rootRouter;