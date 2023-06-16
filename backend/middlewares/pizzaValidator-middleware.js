const { body } = require('express-validator');


exports.pizzaValidationSchema = [
    body('base').notEmpty().withMessage('Pizza base is required'),
    body('sauce').notEmpty().withMessage('Pizza sauce is required'),
    body('cheese').notEmpty().withMessage('Cheese is required'),
];