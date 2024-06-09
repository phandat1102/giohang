import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String },
    address: { type: String },
    sex: { type: String },
    phone: { type: String },
    group: { type: String }
});

module.exports = mongoose.model('User', userSchema);
