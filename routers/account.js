const express = require('express');
const Joi = require('joi');

const { Account } = require('../schemas/account');
const { validateId } = require('../utility');
const { Transaction } = require("../schemas/transaction");
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');


const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        const accounts = await Account.find();
        res.send(accounts);
    }catch (e) {
        //res.status(500).send(`Exception in getting all accounts...${e.message}`);
        next(e);
    }
});


router.post('/', auth, async (req, res, next)=>{
    try{
        const { error } = validateAccountRequest(req.body);
        if(error) return res.status(400).send(`Invalid account...${error}`);

        const { name , description, address } = req.body;

        //throw new Error('Testing the account route..');

        const existingAccount = await Account.findOne({ name });
        if(existingAccount) return res.status(400).send(`Account with the name ${name} already exists.`);

        let account = new Account({
            name,
            description,
            address,
            userId: req.user._id
        });

        account = await account.save();
        res.send(account);

    }catch (e) {
        next(e);
    }
});

router.get('/:accountId', async (req, res)=>{
    try{
        if(!validateId(req.params.accountId))
            return res.status(400).send(`Not a valid accountId....`);

        const account = await Account.findById(req.params.accountId);
        if(!account) return res.status(404).send(`account with given id ${req.params.accountId} was not found.`);

        res.send(account);
    }catch (e) {
        res.status(500).send(`Exception in getting account by accountId...${e.message}`);
    }
});

router.delete('/:accountId',[auth, admin], async (req, res)=>{
    try{
        if(!validateId(req.params.accountId))
            return res.status(400).send(`Not a valid accountId....`);

        let account = await Account.findById(req.params.accountId);
        if(!account) return res.status(404).send(`account with given id ${req.params.accountId} was not found.`);

        const accountTransactions = await Transaction.find({ account : account.name });

        if(accountTransactions.length > 0) return res.status(401).send(`account cannot be deleted because transactions associated with account are present...`);

        account = await Account.findByIdAndDelete(req.params.accountId);

        res.send(account);
    }catch (e) {
        res.status(500).send(`Exception in deleting account by accountId...${e.message}`);
    }
});

router.put('/:accountId', async (req, res)=>{
    try{
        if(!validateId(req.params.accountId))
            return res.status(400).send(`Not a valid accountId....`);

        let account = await Account.findById(req.params.accountId);
        if(!account) return res.status(404).send(`account with given id ${req.params.accountId} was not found.`);

        const { error } = validateAccountRequest(req.body);
        if(error) return res.status(400).send(`Invalid account...${error}`);

        const { name , description, address } = req.body;

        account.name = name;
        account.description = description;
        account.address = address;

        account = await account.save();
        res.send(account);

    }catch (e) {
        res.status(500).send(`Exception in updating account by accountId...${e.message}`);
    }
});

function validateAccountRequest(account){
    const schema = Joi.object({
        name : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(50),
        address : Joi.string().required().min(5).max(50),
        balance: Joi.number().min(0)
    });

    const { name , description, address, balance } = account;

    return schema.validate({ name , description, address, balance } );
}


module.exports = router;