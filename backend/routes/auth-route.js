const authRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserModel = require('../models/user-model');
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const { createUserSchema, validateLoginSchema } = require('../middlewares/userValidator-middleware');



authRouter.post('/register', createUserSchema, authController.registerUser);
authRouter.get('/verify/:token', authController.verifyToken);
authRouter.post('/login', validateLoginSchema, authController.login);
authRouter.post('/forgotPassword', authController.forgotPassword);
authRouter.post('/resetPassword/:resetToken', authController.resetPassword);
authRouter.get('/refreshToken', authController.refreshToken);
authRouter.post('/logout', authMiddleware, authController.logout);


module.exports = authRouter;