const mongoose = require('mongoose');

const incomeSchema =  new mongoose.Schema({
    title : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    description : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 255,
        trim: true,
        lowercase: true
    },
    toAccount:{
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    incomeType:{
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    amount :{
        type: Number,
        default : 0
    }
});

const Income = mongoose.model('Income', incomeSchema);

module.exports.Income = Income;
module.exports.incomeSchema = incomeSchema;