const express = require('express');
const reportsRouter  = express.Router();
require('dotenv').config();

// Lấy báo cáo bán hàng.
reportsRouter.get('/', /* Your handler here */);

module.exports = reportsRouter;