const { body } = require('express-validator');
const prisma = require('../../prisma/client');


const validateRegister = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Email is Invalid')
        .custom(async (value) => {
            if (!value) {
                throw new Error('Email is required');
            }
            const user = await prisma.user.findUnique({ where: { email: value } });
            if (user) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password').isLength({ min:6 }).withMessage('Password must be at least 6 character long'),
];


const validateLogin = [
    body('email').notEmpty().withMessage('Email is Required'),
    body('password').isLength({ min:6 }).withMessage('Password must be at least 6 character long'),
];


module.exports = {validateRegister, validateLogin};