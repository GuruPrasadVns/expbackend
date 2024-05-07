const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { Account } = require('../schemas/account');
const { Transaction } = require("../schemas/transaction");
const { FundTransfer } = require("../schemas/fundtransfer");



const router = express.Router();

router.get('/', async (req, res)=>{
    try{
        const fundTransfers = await FundTransfer.find();
        res.send(fundTransfers);
    }catch (e) {
        res.status(500).send(`Exception in getting all fundtransfers...${e.message}`);
    }
});

router.post('/', async (req, res)=>{
    try{

        const { error } = validateFundTransferRequest(req.body);
        if(error) return res.status(400).send(`Invalid fund transfer details...${error}`);

        const { title , description, toAccountId, fromAccountId, amount } = req.body;

        let fromAccount = await Account.findById(fromAccountId);
        if(!fromAccount) return res.status(404).send(`fromAccount with given id ${fromAccountId} was not found.`);

        let toAccount = await Account.findById(toAccountId);
        if(!toAccount) return res.status(404).send(`toAccount with given id ${toAccountId} was not found.`);

        if(amount > fromAccount.balance) return res.status(400).send(`Propsed transfer amount is greater than fromAccount current balance`);

        let fundTransfer = new FundTransfer({
            title,
            description,
            fromAccount : fromAccount.name,
            toAccount : toAccount.name,
            amount
        });

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        fromAccount = await fromAccount.save();
        toAccount = await toAccount.save();
        fundTransfer = await fundTransfer.save();

        let fromAccountTransaction = new Transaction({
            title: `fund transfer debit transaction`,
            description: `fund transfered from ${fromAccount.name} to ${toAccount.name}` ,
            type : 'debit',
            account: fromAccount.name,
            transactionType : 'transfer',
            fundTransferId: fundTransfer._id,
            amount
        });

        let toAccountTransaction = new Transaction({
            title: `fund transfer credit transaction`,
            description: `fund recieved from ${fromAccount.name} to ${toAccount.name}` ,
            type : 'credit',
            account: toAccount.name,
            transactionType : 'transfer',
            fundTransferId: fundTransfer._id,
            amount
        });

        await fromAccountTransaction.save();
        await toAccountTransaction.save();

        res.send(fundTransfer);

    }catch (e) {
        res.status(500).send(`Exception in creating fundTransfer...${e.message}`);
    }
});

function validateFundTransferRequest(fundTransfer){
    const schema = Joi.object({
        title : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(255),
        toAccountId : Joi.objectId().required(),
        fromAccountId : Joi.objectId().required(),
        amount: Joi.number().min(0)
    });

    const { title , description, toAccountId, fromAccountId, amount } = fundTransfer;

    return schema.validate({ title , description, toAccountId, fromAccountId, amount } );
}

module.exports = router;