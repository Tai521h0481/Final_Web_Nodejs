const express = require('express');
const usersRouter = express.Router();
require('dotenv').config();

//Đăng nhập vào hệ thống.
usersRouter.post('/login',);
//Đăng xuất khỏi hệ thống.
usersRouter.post('/logout',);
// Xem thông tin hồ sơ của người dùng hiện tại.
usersRouter.get('/profile',);
//Cập nhật thông tin hồ sơ của người dùng hiện tại.
usersRouter.put('/profile',);
// Tạo một tài khoản mới (chỉ dành cho quản trị viên).
usersRouter.post('/',);
// Lấy danh sách tất cả người dùng (chỉ dành cho quản trị viên).
usersRouter.get('',);
//Cập nhật thông tin của một người dùng cụ thể (chỉ dành cho quản trị viên).
usersRouter.put(`/:id`,);

module.exports = usersRouter;