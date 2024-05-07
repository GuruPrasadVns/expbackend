const mongoose = require('mongoose');

const transactionTypeSchema =  new mongoose.Schema({
    title : {
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
    }
});

const TransactionType = mongoose.model('TransactionType', transactionTypeSchema);

module.exports.TransactionType = TransactionType;
module.exports.transactionTypeSchema = transactionTypeSchema;