const mongoose = require('mongoose');

const expenseSchema =  new mongoose.Schema({
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
    fromAccount:{
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    expenseType:{
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

const Expense = mongoose.model('Expense', expenseSchema);

module.exports.Expense = Expense;
module.exports.expenseSchema = expenseSchema;