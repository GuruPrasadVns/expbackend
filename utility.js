const mongoose = require('mongoose');
const { User } = require("./schemas/user");

function validateId(id){
    return mongoose.Types.ObjectId.isValid(id);
}

const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1
};

async function isUserExists(userId){
    const isUserExist = await User.findById(userId);
    if(!isUserExist) return false;
    return true;
}


module.exports.validateId = validateId;
module.exports.complexityOptions = complexityOptions;
module.exports.isUserExists = isUserExists;