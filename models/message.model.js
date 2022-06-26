const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    message: { type: String, required: true },
    chat: { type: Schema.Types.ObjectId, ref: "chat", required: true },
    createdAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('message', MessageSchema);