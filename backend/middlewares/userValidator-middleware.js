const { body } = require('express-validator');


exports.createUserSchema = [
    body('name').trim().exists().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be atleast 3 characters long.'),
    body('email').trim().exists().withMessage('Email is required').isEmail().withMessage('Must be a valid email').normalizeEmail(),
    body('password').trim().exists().withMessage('Password is required').notEmpty().isLength({ min: 6 }).withMessage('Password must contain at least 6 characters')
];


exports.validateLoginSchema = [
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').trim().notEmpty().withMessage('Password is required'),
];