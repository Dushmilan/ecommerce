const express = require('express');
const UserRouter = express.Router();
const UserController = require('../Controller/UserController');


UserRouter.post('/usersignup', UserController.UserSignupController);
UserRouter.post('/sellersignup', UserController.SellerSignupController);
UserRouter.post('/login', UserController.LoginController);

module.exports = UserRouter;

