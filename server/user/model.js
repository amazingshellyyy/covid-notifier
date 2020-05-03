const mongoose = require('mongoose');




const UserSchema = mongoose.Schema({
    cellNum: {
        type: String,
        required: [true, 'Cellphone Number is required'],
    },
    verifyCode: {
        type: Number
    },
    zipCode: {
        type: Number
    },
    County: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
