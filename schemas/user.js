const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema =  new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    email : {
        type : String,
        required : true,
        unique: true,
        minLength : 5,
        maxLength : 255
    },
    password : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 1024
    },
    isAdmin:{
        type : Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id : this._id, isAdmin : this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;