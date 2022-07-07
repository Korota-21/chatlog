const Message = require('../models/message.model')
const Chat = require('../models/chat.model')

const validationHandler = require("../validations/validationHandler")


exports.index = async(req, res, next) => {
    try {
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 100;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        let chat = await Chat.findById(req.params.chat);
        if (!chat || !chat.users.includes(req.user.id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }

        const messages = await Message.find({ chat: req.params.chat }).skip((page - 1) * pagination).limit(pagination).populate("user").sort('createdAt');

        res.send(messages);
    } catch (err) {
        next(err);
    }

}
exports.show = async(req, res, next) => {
    try {
        const message = await Message.findOne({ _id: req.params.id }).populate("user");
        if (!message) {
            const error = new Error("message not found")
            error.statusCode = 400;
            throw error;
        }
        let chat = await Chat.findById(message.chat);
        if (!chat || !chat.users.includes(req.user.id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        res.send(message);
    } catch (err) {
        next(err);
    }

}

exports.store = async(req, res, next) => {
    try {
        validationHandler(req);

        let chat = await Chat.findById(req.body.chat);
        if (!chat || !chat.users.includes(req.user.id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }

        let message = new Message();

        message.user = req.user;
        message.message = req.body.message;
        message.chat = req.body.chat;


        message = await message.save()
        res.send(message);
    } catch (err) {
        next(err);
    }
};

exports.update = async(req, res, next) => {
    try {
        validationHandler(req);
        let message = await Message.findOne({ _id: req.params.id, user: req.user });
        if (!message) {
            const error = new Error("message not found")
            error.statusCode = 400;
            throw error;
        }

        message.message = req.body.message;
        message.updatedAt = Date.now();
        message = await message.save()
        res.send(message);

    } catch (err) {
        next(err);
    }
};
exports.delete = async(req, res, next) => {
    try {
        let message = await Message.findById(req.params.id);
        // check if auth user is auther
        if (!message || message.user != req.user.id) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        await message.delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};