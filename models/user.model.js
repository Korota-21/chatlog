const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
})
UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
UserSchema.methods.validPassword = async(condidatePassword, userPass) => {
    const result = await bcrypt.compare(condidatePassword, userPass);
    return result;
}

module.exports = mongoose.model('user', UserSchema);