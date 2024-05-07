const mongoose = require("mongoose");

const connection = mongoose.connection;

async function connectToMongoDBAtlas() {
  try {
    await mongoose.connect(``);
    //
    console.log(`connected to mongodb atlas.....`);
  } catch (e) {
    console.log(`Error in connecting mongodb atlas ....${e.message}`);
  }
}

module.exports.connectToMongoDBAtlas = connectToMongoDBAtlas;
module.exports.connection = connection;
