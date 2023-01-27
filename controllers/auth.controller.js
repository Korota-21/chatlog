const jwt = require("jwt-simple")
const config = require("../config")
const nodemailer = require('../nodemailer')
const User = require("../models/user.model")
const validationHandler = require("../validations/validationHandler")
exports.login = async (req, res, next) => {
    try {
        validationHandler(req);

        const email = req.body.email;
        const password = req.body.password;

        let user = await User.findOne({ email }).select("+password")
        if (!user) {
            const error = new Error("Email not found");
            error.statusCode = 401;
            throw error
        }
        const validPassword = await user.validPassword(password, user.password);

        if (!validPassword) {
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error
        }
        const token = jwt.encode({ id: user.id }, config.jwtSecret)
        user = await User.findOne({ email })

        return res.send({ user, token })
    } catch (err) {
        next(err)
    }
}
exports.register = async (req, res, next) => {
    try {
        validationHandler(req);
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            const error = new Error("Email already used");
            error.statusCode = 403;
            throw error;
        }

        let user = new User();
        user.email = req.body.email;
        user.password = await user.encryptPassword(req.body.password);
        user.name = req.body.name;
        user = await user.save();

        const token = jwt.encode({ id: user.id }, config.jwtSecret)
        user = await User.findOne({ email })

        return res.send({ user, token })
    } catch (err) {
        next(err)
    }
}

exports.forget = async (req, res, next) => {
    try {
        validationHandler(req);
        const existingUser = await User.findOne({ email: req.body.email })
        if (!existingUser)
            return res.status(400).send("No account with this email.")

        if (existingUser) {
            if (!req.body.code) {
                const code = generateCode()
                console.log('code: ', code);
                existingUser.code = code;
                existingUser.save()
                sendEmail(req.body.email, code)
                res.send({ message: 'Check your email' }) //1
                return
            }
            console.log(existingUser.code);
            if (existingUser.code == req.body.code) {
                if (req.body.password) {
                    existingUser.password = await existingUser.encryptPassword(req.body.password);
                    existingUser.save();
                    return res.status(200).send({ message: 'Password has been updated successfully.' });//3
                }
                return res.status(202).send(); //2
            }
            return res.status(400).send({ message: 'bad code' })
        }

    } catch (err) {
        next(err)
    }
}

//cashe it becouse it's called a lot
exports.me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user)
        return res.send(user)
    } catch (err) {
        next(err)
    }
}
exports.me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user)
        return res.send(user)
    } catch (err) {
        next(err)
    }
}

function sendEmail(clientEmail, code) {
    let mailOptions = {
        from: config.email,
        to: clientEmail,
        subject: 'Password reset for ' + config.projectTitle,
        text: 'Your password reset code is: ' + code // plain text body
    }
    nodemailer.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
    })
}

function generateCode() {
    let string = ""
    for (let i = 0; i < 4; i++) {
        string += Math.floor(Math.random() * 10)
    }
    return string
}