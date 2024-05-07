const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const passwordComplexity = require("joi-password-complexity");
const auth = require('../middlewares/auth');

const { User } = require('../schemas/user');
const { complexityOptions } = require('../utility');

const router = express.Router();

router.get('/me', auth, async (req, res)=>{
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
});


router.post('/', async (req, res)=>{
        const { error } = validateRegisterRequest(req.body);
        if(error) res.status(400).send(`Invalid User Register Request...${error}`);

        const { name, email, password , isAdmin } = req.body;

        const passwordError  = passwordComplexity(complexityOptions).validate(password);

        if(passwordError.error) return res.status(400).send(`Password is not as per password policy...${passwordError.error}`);

        const duplicateUser = await User.findOne({email });

        if(duplicateUser) return res.status(400).send(`User with email ${email} already exists...`);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = new User({
            name,
            email,
            password : hashedPassword,
            isAdmin
        });

        user = await user.save();

        const token = user.generateAuthToken();

        res.header('x-auth-token',token).send(_.pick(user, ['name', 'email', '_id', 'isAdmin']));

});


function validateRegisterRequest(user){
    const schema = Joi.object({
        name : Joi.string().required().min(5).max(100),
        email : Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password : Joi.string().required().min(5).max(255),
        isAdmin : Joi.boolean()
    });

    const { name, email, password, isAdmin } = user;

    return schema.validate({ name, email, password, isAdmin });
}

module.exports = router;