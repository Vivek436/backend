const {body} = require('express-validator');
const validateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isStrongPassword().withMessage("Password must be strong").isLength({min:6}).withMessage('Password must be at least 6 characters long')
];

module.exports = validateUser;