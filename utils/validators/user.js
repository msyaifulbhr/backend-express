const { body } = require('express-validator');
const prisma = require('../../prisma/client');


const validateUser = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Email is Invalid')
        .custom(async (value, {req}) => {
            if (!value) {
                throw new Error('Email is required');
            }
            const user = await prisma.user.findUnique({ where: { email: value } });
            if (user && user.id !== Number(req.params.id)) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password').isLength({ min:6 }).withMessage('Password must be at least 6 character long'),
];

module.exports = { validateUser };