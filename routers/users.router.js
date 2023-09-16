const express = require('express');
const usersRouter = express.Router();
require('dotenv').config();

const {createUser, deleteUser, getAllUsers, getUserById, updateUser} = require('../controllers/users.controller');

//Đăng nhập vào hệ thống.
usersRouter.post('/login', );
//Đăng xuất khỏi hệ thống.
usersRouter.post('/logout',);
// Xem thông tin hồ sơ của người dùng hiện tại.
usersRouter.get('/profile/:id',);
//Cập nhật password của người dùng hiện tại.
usersRouter.put('/profile/changePassword/:id',);
//Cập nhật avatar của người dùng hiện tại.
usersRouter.put('/profile/avatar/:id',);
// Tạo một tài khoản mới (chỉ dành cho quản trị viên).
usersRouter.post('/', createUser);
// Lấy danh sách tất cả người dùng (chỉ dành cho quản trị viên).
usersRouter.get('',);
// Lấy người dùng theo id (chỉ dành cho quản trị viên).
usersRouter.get('/id',);
//Cập nhật thông tin của một người dùng cụ thể (chỉ dành cho quản trị viên).
usersRouter.put(`/:id`,);

module.exports = usersRouter;