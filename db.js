const mongoose = require('mongoose');

const connection = mongoose.connection;

async function connectToMongoDBAtlas(){
    try{
       //await mongoose.connect(`mongodb+srv://prasag1admin:prasag1admin@cluster0.ny9e5y6.mongodb.net/exptrackerbackend`);
        await mongoose.connect(`mongodb://localhost:27017/expensebackend`);
        //
        console.log(`connected to mongodb atlas.....`);
    }catch (e) {
        console.log(`Error in connecting mongodb atlas ....${e.message}`)
    }
}

module.exports.connectToMongoDBAtlas = connectToMongoDBAtlas;
module.exports.connection = connection;