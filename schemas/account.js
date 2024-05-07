const mongoose = require('mongoose');

const accountSchema =  new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique: true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    description : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    address : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    balance :{
        type: Number,
        default : 0
    },
    userId:{
        type : mongoose.Types.ObjectId
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports.Account = Account;
module.exports.accountSchema = accountSchema;