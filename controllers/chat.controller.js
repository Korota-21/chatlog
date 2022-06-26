const Chat = require('../models/chat.model')

const validationHandler = require("../validations/validationHandler")


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
        req.body.users.forEach(userID => {
            chat.users.push(userID)
        });
        chat.users.push(req.user._id)
        chat.users = chat.users.filter((c, index) => chat.users.indexOf(c) === index);

        chat = await chat.save()
        res.send(chat);
    } catch (err) {
        next(err);
    }
};

exports.update = async(req, res, next) => {
    try {
        validationHandler(req);
        let chat = await Chat.findById(req.params.id);
        // check if auth user is auther
        if (!chat || !chat.users.includes(req.user.id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        if (req.body.method === "add") {
            chat.users.push(req.body.user);
            chat.users = chat.users.filter((c, index) => chat.users.indexOf(c) === index);

        } else if (req.body.method === "delete") {
            chat.users = chat.users.filter((user) =>
                user != req.body.user
            );
        }
        if (chat.users.length == 0) {
            //destroy chat
            res.send({ message: "this is the last user in this chat if you wanna delete it use delete method" })
        } else {
            chat = await chat.save()
            res.send(chat);
        }
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
        await chat.delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};