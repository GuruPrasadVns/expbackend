const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { complexityOptions } = require('../utility');
const passwordComplexity = require("joi-password-complexity");

const { User } = require('../schemas/user');

const router = express.Router();

router.post('/', async (req, res )=>{
        const { error } = validateLoginRequest(req.body);
        if(error) res.status(400).send(`Invalid User Login Request...${error}`);

        const { email, password } = req.body;

        const passwordError  = passwordComplexity(complexityOptions).validate(password);

        if(passwordError.error) return res.status(400).send(`Password is not as per password policy...${passwordError.error}`);

        const isUserExist = await User.findOne({ email });

        if(!isUserExist) return res.status(400).send(`Invalid email or password....`);

        const isValidPassword = await bcrypt.compare(password, isUserExist.password);

        if(!isValidPassword) return res.status(400).send(`Invalid email or password....`);

        const token = isUserExist.generateAuthToken();

        res.send(token);
});


function validateLoginRequest(user){
    const schema = Joi.object({
        email : Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password : Joi.string().required().min(5).max(255)
    });

    const { email, password } = user;

    return schema.validate({ email, password });
}

module.exports = router;