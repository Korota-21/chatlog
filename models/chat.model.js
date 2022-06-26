const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    createdAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('chat', ChatSchema);