const { validationResult } = require('express-validator')

module.exports = req => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation Failed')
        error.statusCode = 422;
        error.validation = validationErrors.array()
        console.log("req");
        throw error;
    }
}