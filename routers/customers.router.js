const express = require("express");
const customersRouter = express.Router();
require("dotenv").config();

const {
  createCustomer,
  getAllCustomers,
  getCustomerByTel,
  getCustomerOrderHistory,
} = require("../controllers/customers.controller");
const {
  authentication,
} = require("../middlewares/authentication/authentication");
const { authorization } = require("../middlewares/authorization/authorization");
const {
  isExistId,
  isCreated,
  validateInput,
  isExistEmail,
  isActive,
} = require("../middlewares/validations/validation");

customersRouter.post(
  "/",
  authentication,
  authorization(["employee", "admin"]),
  isActive,
  validateInput(["FullName", "PhoneNumber", "Address"]),
  createCustomer
);
// Lấy danh sách tất cả khách hàng.
customersRouter.get(
  "/",
  authentication,
  authorization(["employee", "admin"]),
  isActive,
  getAllCustomers
);
// Lấy thông tin của kh bằng telephone
customersRouter.get(
  `/:tel`,
  authentication,
  authorization(["employee, admin"]),
  isActive,
  getCustomerByTel
);
// Lấy thông tin khách hàng kèm lịch sử đặt hàng
customersRouter.get(
  "/history/:tel",
  authentication,
  authorization(["employee, admin"]),
  isActive,
  getCustomerOrderHistory
);

module.exports = customersRouter;
