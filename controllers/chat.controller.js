const Chat = require('../models/chat.model')
const Message = require('../models/message.model');
const validationHandler = require("../validations/validationHandler")
const User = require('../models/user.model')

exports.index = async(req, res, next) => {
    try {
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const chats = await Chat.find({ users: req.user.id }).skip((page - 1) * pagination).limit(pagination).populate("users").sort({ createdAt: -1 });

        res.send(chats);
    } catch (err) {
        next(err);
    }

}
exports.show = async(req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, users: req.user.id }).populate("users");
        res.send(chat);
    } catch (err) {
        next(err);
    }

}

exports.store = async(req, res, next) => {
    try {
        validationHandler(req);
        let chat = new Chat();
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            const error = new Error("User not found")
            error.statusCode = 400;
            throw error;
        }
        if (req.user.email === user.email) {
            const error = new Error("You cannot add yourself")
            error.statusCode = 400;
            throw error;
        }
        chat.users.push(user._id);
        chat.users.push(req.user._id)

        chat = await chat.save()
        res.send(chat);
    } catch (err) {
        next(err);
    }
};


exports.delete = async(req, res, next) => {
    try {
        let chat = await Chat.findById(req.params.id);
        // check if auth user is auther
        if (!chat || !chat.users.includes(req.user.id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }

        await Message.deleteMany({ chat: chat });
        await chat.delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};