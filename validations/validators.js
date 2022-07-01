const { body } = require('express-validator');

exports.isEmail = body("email").isEmail()
    .withMessage("Email field must contain a correct email.");

exports.hasPassword = body("password").exists()
    .withMessage("Password cannot be empty.");

exports.hasName = body("name").isLength({ min: 5 })
    .withMessage("name is required. Min length 5 characters.");


exports.hasMessage = body("message").notEmpty()
    .withMessage("message is required.");