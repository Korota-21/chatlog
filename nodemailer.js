const nodemailer = require('nodemailer');
const config = require('./config');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email, // Your email address
        pass: config.password // Your email account password
    }
    
});

module.exports = transporter