const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { Account } = require('../schemas/account');
const { Transaction } = require("../schemas/transaction");
const { Income } = require("../schemas/income");
const { IncomeType } = require("../schemas/incometype");
const { validateId } = require("../utility");

const auth = require('../middlewares/auth');
const { User } = require("../schemas/user");



const router = express.Router();

router.get('/', auth, async (req, res)=>{
        const userId = req.user._id;

        const isUserExist = await User.findById(userId);
        if(!isUserExist) return res.status(400).send('User does not exists.');

        const incomes = await Income.find({ userId });
        res.send(incomes);

});

router.post('/', auth, async (req, res)=>{
    try{

        const { error } = validateIncomeRequest(req.body);
        if(error) return res.status(400).send(`Invalid income details...${error}`);

        const { title , description, toAccountId, incomeTypeId, amount } = req.body;

        let toAccount = await Account.findById(toAccountId);
        if(!toAccount) return res.status(404).send(`toAccount with given id ${toAccountId} was not found.`);

        let incomeType = await IncomeType.findById(incomeTypeId);
        if(!incomeType) return res.status(404).send(`incomeType with given id ${incomeTypeId} was not found.`);

        let income = new Income({
            title,
            description,
            toAccount : toAccount.name,
            incomeType : incomeType.title,
            amount
        });

        toAccount.balance += amount;

        toAccount = await toAccount.save();
        income = await income.save();

        let toAccountTransaction = new Transaction({
            title: `income credit transaction`,
            description: `income recieved to ${toAccount.name}` ,
            type : 'credit',
            account: toAccount.name,
            transactionType : 'income',
            incomeId: income._id,
            amount
        });

        await toAccountTransaction.save();

        res.send(income);

    }catch (e) {
        res.status(500).send(`Exception in creating income...${e.message}`);
    }
});

router.delete('/:incomeId', async (req, res)=>{
    try{

        if(!validateId(req.params.incomeId))
            return res.status(400).send(`Not a valid incomeId....`);

        let income = await Income.findById(req.params.incomeId);
        if(!income) return res.status(404).send(`income with given id ${req.params.incomeId} was not found.`);

        const incomeTransaction = await Transaction.findOne({ incomeId : req.params.incomeId });
        await Transaction.findByIdAndDelete(incomeTransaction._id);

        const account = await Account.findOne({ name : income.toAccount });

        account.balance -= income.amount;

        await account.save();

        await Income.findByIdAndDelete(income._id);

        res.send(income);

    }catch (e) {
        res.status(500).send(`Exception in deleting income...${e.message}`);
    }
});

router.get('/:incomeId', async (req, res)=>{
    try{
        if(!validateId(req.params.incomeId))
            return res.status(400).send(`Not a valid incomeId....`);

        const income = await Income.findById(req.params.incomeId);
        if(!income) return res.status(404).send(`Income with given incomeId ${req.params.incomeId} was not found.`);

        res.send(income);
    }catch (e) {
        res.status(500).send(`Exception in getting income by incomeId...${e.message}`);
    }
});

function validateIncomeRequest(income){
    const schema = Joi.object({
        title : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(255),
        toAccountId : Joi.objectId().required(),
        incomeTypeId: Joi.objectId().required(),
        amount: Joi.number().min(0)
    });

    const { title , description, toAccountId, incomeTypeId, amount } = income;

    return schema.validate({ title , description, toAccountId, incomeTypeId, amount } );
}

module.exports = router;