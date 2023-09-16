const express = require('express');
const rootRouter = express.Router();

const usersRouter = require('./users.router');
const productsRouter = require('./products.router');
const ordersRouter = require('./orders.router');
const orderDetailRouter = require('./orderDetails.router');
const customersRouter = require('./customers.router');
const reportsRouter = require('./reports.router');

rootRouter.use('/users', usersRouter);
rootRouter.use('/products', productsRouter);
rootRouter.use('/orders', ordersRouter);
rootRouter.use('/orderDetails', orderDetailRouter);
rootRouter.use('/customers', customersRouter);
rootRouter.use('/reports', reportsRouter);

module.exports = rootRouter;