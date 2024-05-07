const mongoose = require('mongoose');

const fundTransferSchema =  new mongoose.Schema({
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
    fromAccount:{
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

const FundTransfer = mongoose.model('FundTransfer', fundTransferSchema);

module.exports.FundTransfer = FundTransfer;
module.exports.fundTransferSchema = fundTransferSchema;