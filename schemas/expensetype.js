const mongoose = require('mongoose');

const expenseTypeSchema =  new mongoose.Schema({
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
    userId:{
        type: mongoose.Types.ObjectId
    }
});

const ExpenseType = mongoose.model('ExpenseType', expenseTypeSchema);

module.exports.ExpenseType = ExpenseType;
module.exports.expenseTypeSchema = expenseTypeSchema;