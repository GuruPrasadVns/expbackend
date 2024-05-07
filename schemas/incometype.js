const mongoose = require('mongoose');

const incomeTypeSchema =  new mongoose.Schema({
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
    userId : {
        type : mongoose.Types.ObjectId
    }
});

const IncomeType = mongoose.model('IncomeType', incomeTypeSchema);

module.exports.IncomeType = IncomeType;
module.exports.incomeTypeSchema = incomeTypeSchema;