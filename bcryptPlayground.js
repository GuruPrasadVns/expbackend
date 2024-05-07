const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User } = require('./schemas/user');

async function run(){
    await mongoose.connect(`mongodb://localhost:27017/expensebackend`);
    console.log(`connected to mongodb atlas.....`);

    const salt = await bcrypt.genSalt(10);
    let password = 'Guru@123';
    const email = "guru.bhumca@gmail.com";
    const name = "Guru Prasad";
    password = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password
    });

    await user.save();
    console.log(`saved user to mongodb atlas.....`);

    const dbUser = await User.findOne({email : "guru.bhumca@gmail.com"});

    console.log('hashedPassword', password);
    console.log('dbUser Password', dbUser.password);

    const isValidPassword = await bcrypt.compare("Guru@123", password);

    console.log('isValidPassword', isValidPassword);
}

run();