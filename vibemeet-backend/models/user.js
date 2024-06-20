const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    mail: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    friends: [{ type: Schema.Types.Object , ref:'User'}],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
