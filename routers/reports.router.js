const express = require("express");
const reportsRouter = express.Router();
require("dotenv").config();

const {
  getReportToday,
  getMonthlyOrderCounts,
  getDashboardMetrics,
  getReportYesterday,
  getReportThisWeek,
  getReportThisMonth,
  getReportFromTo,
} = require("../controllers/reports.controller");
const {
  isExistId,
  isCreated,
  validateInput,
  isExistEmail,
  isActive,
} = require("../middlewares/validations/validation");
const {
  authentication,
} = require("../middlewares/authentication/authentication");
const { authorization } = require("../middlewares/authorization/authorization");

const authMiddleware = [
  authentication,
  authorization(["employee", "admin"]),
  isActive,
];

// Lấy báo cáo bán hàng.
reportsRouter.get("/" /* Your handler here */);
// lấy Lấy báo cáo bán hàng trong ngày
reportsRouter.get("/today", ...authMiddleware, getReportToday);
// lấy Lấy báo cáo bán hàng hôm qua
reportsRouter.get("/yesterday", ...authMiddleware, getReportYesterday);
// lấy Lấy báo cáo bán hàng trong tuần
reportsRouter.get("/this-week", ...authMiddleware, getReportThisWeek);
// lấy Lấy báo cáo bán hàng trong tháng
reportsRouter.get("/this-month", ...authMiddleware, getReportThisMonth);
// lấy Lấy báo cáo bán hàng from - to
reportsRouter.post('/from-to', ...authMiddleware, getReportFromTo);
// lấy Lấy báo cáo bán hàng theo tháng
reportsRouter.get(
  "/monthly-order-counts",
  ...authMiddleware,
  getMonthlyOrderCounts
);
// lấy báo cáo hiện lên dashboard
reportsRouter.get("/dashboard-metrics", ...authMiddleware, getDashboardMetrics);

module.exports = reportsRouter;
