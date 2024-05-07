const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { Account } = require('../schemas/account');
const { Transaction } = require("../schemas/transaction");
const { Expense } = require("../schemas/expense");
const {ExpenseType} = require("../schemas/expensetype");
const {validateId} = require("../utility");

const router = express.Router();

router.get('/', async (req, res)=>{
    try{
        const expenses = await Expense.find();
        res.send(expenses);
    }catch (e) {
        res.status(500).send(`Exception in getting all expenses...${e.message}`);
    }
});

router.post('/', async (req, res)=>{
    try{

        const { error } = validateExpenseRequest(req.body);
        if(error) return res.status(400).send(`Invalid expense details...${error}`);

        const { title , description, fromAccountId, expenseTypeId, amount } = req.body;

        let fromAccount = await Account.findById(fromAccountId);
        if(!fromAccount) return res.status(404).send(`fromAccount with given id ${fromAccountId} was not found.`);

        let expenseType = await ExpenseType.findById(expenseTypeId);
        if(!expenseType) return res.status(404).send(`expenseType with given id ${expenseTypeId} was not found.`);

        if(amount > fromAccount.balance) return res.status(400).send(`Expense amount is greater than account current balance`);

        let expense = new Expense({
            title,
            description,
            fromAccount : fromAccount.name,
            expenseType: expenseType.title,
            amount
        });

        fromAccount.balance -= amount;

        fromAccount = await fromAccount.save();
        expense = await expense.save();

        let fromAccountTransaction = new Transaction({
            title: `expense debit transaction`,
            description: `expense from ${fromAccount.name}` ,
            type : 'debit',
            account: fromAccount.name,
            transactionType : 'expense',
            expenseId: expense._id,
            amount
        });

        await fromAccountTransaction.save();

        res.send(expense);

    }catch (e) {
        res.status(500).send(`Exception in creating expense...${e.message}`);
    }
});

router.delete('/:expenseId', async (req, res)=>{
    try{

        if(!validateId(req.params.expenseId))
            return res.status(400).send(`Not a valid expenseId....`);

        let expense = await Expense.findById(req.params.expenseId);
        if(!expense) return res.status(404).send(`expense with given id ${req.params.expenseId} was not found.`);

        const expenseTransaction = await Transaction.findOne({ expenseId : req.params.expenseId });
        await Transaction.findByIdAndDelete(expenseTransaction._id);

        const account = await Account.findOne({ name : expense.fromAccount });

        account.balance += expense.amount;

        await account.save();

        await Expense.findByIdAndDelete(expense._id);

        res.send(expense);

    }catch (e) {
        res.status(500).send(`Exception in deleting expense...${e.message}`);
    }
});

function validateExpenseRequest(income){
    const schema = Joi.object({
        title : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(255),
        fromAccountId : Joi.objectId().required(),
        expenseTypeId: Joi.objectId().required(),
        amount: Joi.number().min(0)
    });

    const { title , description, fromAccountId, expenseTypeId, amount } = income;

    return schema.validate({ title , description, fromAccountId, expenseTypeId, amount } );
}

module.exports = router;