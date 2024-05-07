const mongoose = require('mongoose');

const transactionSchema =  new mongoose.Schema({
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
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    type:{
        type : String,
        required : true,
        trim: true,
        lowercase: true,
        enum:['debit', 'credit']
    },
    account:{
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    transactionType:{
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100,
        trim: true,
        lowercase: true
    },
    fundTransferId:{
        type : mongoose.Types.ObjectId
    },
    incomeId:{
        type : mongoose.Types.ObjectId
    },
    expenseId:{
        type : mongoose.Types.ObjectId
    },
    amount:{
        type : Number,
        required : true,
        min: 0,
        max: 1000000
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports.Transaction = Transaction;
module.exports.transactionSchema = transactionSchema;