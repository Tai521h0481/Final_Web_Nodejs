const express = require('express');
const usersRouter = express.Router();
require('dotenv').config();

const {Users} = require('../models');
const {createUser, getAllUsers, getUserById, login, logout_removeCookie,
     upLoadAvatar, changePasswordByEmail, changePasswordById, resendEmail
    , toggleLock} = require('../controllers/users.controller');
const {uploadAvatar} = require('../middlewares/upload/uploadImage');
const {isCreated, isExistId, validateInput, isExistEmail, isActive, checkIsNewEmployee} = require('../middlewares/validations/validation');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');

// Đăng nhập vào hệ thống. (đã test)
usersRouter.post('/login', checkIsNewEmployee, login);
// Đổi mật khẩu cho employee mới không cần password cũ (đã test)
usersRouter.patch('/employees/:Email', authentication, validateInput(['Password']), isExistEmail(Users), changePasswordByEmail);
//Đăng xuất khỏi hệ thống. (đã test)
usersRouter.post('/logout', authentication, logout_removeCookie);
// Xem thông tin hồ sơ của người dùng hiện tại. (đã test)
usersRouter.get('/profiles/:id', authentication, isExistId(Users), isActive, getUserById);
//Cập nhật password của người dùng hiện tại. (đã test)
usersRouter.patch('/profiles/changePassword',authentication, isExistId(Users), isActive, validateInput(['Password', 'newPassword']), changePasswordById);
//Cập nhật avatar của người dùng hiện tại (nhận từ body dạng formData) (đã test)
usersRouter.patch('/profiles/avatars/:id', authentication, isExistId(Users), isActive, upLoadAvatar);
// Tạo một tài khoản mới (chỉ dành cho quản trị viên). (đã test)
usersRouter.post('/register', authentication, authorization(["admin"]), validateInput(['Fullname', 'Email']) , isCreated(Users), createUser);
// Lấy danh sách tất cả người dùng (chỉ dành cho quản trị viên). (đã test)
usersRouter.get('/',authentication, authorization(["admin"]), getAllUsers);
// Lấy người dùng theo id (chỉ dành cho quản trị viên). (đã test)
usersRouter.get('/:id', authentication, authorization(["admin"]), isExistId(Users), getUserById);
// send lại link login cho employee (salesperson) cần truyền Email vào body (đã test)
usersRouter.post('/resendEmail', authentication, authorization(["admin"]), validateInput(['Email']), isExistEmail(Users), resendEmail);
// Mở hoặc khóa tài khoản của người dùng (chỉ dành cho quản trị viên). (đã test)
usersRouter.patch('/lock/:id', authentication, authorization(["admin"]), isExistId(Users), toggleLock);

module.exports = usersRouter;