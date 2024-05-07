const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { Transaction } = require('../schemas/transaction');
const { validateId } = require('../utility');
const router = express.Router();

router.get('/', async (req, res)=>{
    try{
        const transactions = await Transaction.find();
        res.send(transactions);
    }catch (e) {
        res.status(500).send(`Exception in getting all transactions...${e.message}`);
    }
});

// router.post('/', async (req, res)=>{
//     try{
//         const { error } = validateTransactionRequest(req.body);
//         if(error) return res.status(400).send(`Invalid transaction...${error}`);
//
//         const { title , description, type, accountId, transactionTypeId, expenseTypeId, amount } = req.body;
//
//         const account = await Account.findById(accountId);
//         if(!account) return res.status(404).send(`account with given id ${accountId} was not found.`);
//
//         let transactionType = await TransactionType.findById(transactionTypeId);
//         if(!transactionType) return res.status(404).send(`transactionType with given id ${transactionTypeId} was not found.`);
//
//         let expenseType = undefined;
//
//         if(expenseTypeId){
//             expenseType = await ExpenseType.findById(expenseTypeId);
//             if(!expenseType) return res.status(404).send(`expenseType with given id ${expenseTypeId} was not found.`);
//         }
//             let expenseTypeTitle = "";
//
//         if(expenseType){
//             expenseTypeTitle = expenseType.title;
//         }
//
//
//         let transaction = new Transaction({
//             title,
//             description,
//             type,
//             account: account.name,
//             transactionType : transactionType.title,
//             expenseType : expenseTypeTitle,
//             amount
//         });
//
//         transaction = await transaction.save();
//
//         if(type === 'credit'){
//             account.balance += amount;
//         }else{
//             account.balance -= amount;
//         }
//
//         await account.save();
//
//         res.send(transaction);
//
//     }catch (e) {
//         res.status(500).send(`Exception in creating transaction...${e.message}`);
//     }
// });

router.get('/:transactionId', async (req, res)=>{
    try{
        if(!validateId(req.params.transactionId))
            return res.status(400).send(`Not a valid transactionId....`);

        const transaction = await Transaction.findById(req.params.transactionId);
        if(!transaction) return res.status(404).send(`transaction with given id ${req.params.transactionId} was not found.`);

        res.send(transaction);
    }catch (e) {
        res.status(500).send(`Exception in getting transaction by transactionId...${e.message}`);
    }
});

// router.delete('/:transactionTypeId', async (req, res)=>{
//     try{
//         if(!validateId(req.params.transactionTypeId))
//             return res.status(400).send(`Not a valid transactionTypeId....`);
//
//         const transactionType = await TransactionType.findByIdAndDelete(req.params.transactionTypeId);
//         if(!transactionType) return res.status(404).send(`transactionType with given id ${req.params.transactionTypeId} was not found.`);
//
//         res.send(transactionType);
//     }catch (e) {
//         res.status(500).send(`Exception in deleting transactionType by transactionTypeId...${e.message}`);
//     }
// });
//
// router.put('/:transactionTypeId', async (req, res)=>{
//     try{
//         if(!validateId(req.params.transactionTypeId))
//             return res.status(400).send(`Not a valid transactionTypeId....`);
//
//         let transactionType = await TransactionType.findById(req.params.transactionTypeId);
//         if(!transactionType) return res.status(404).send(`transactionType with given id ${req.params.transactionTypeId} was not found.`);
//
//         const { error } = validateTransactionRequest(req.body);
//         if(error) return res.status(400).send(`Invalid transactionType...${error}`);
//
//         const { title , description } = req.body;
//
//         transactionType.title = title;
//         transactionType.description = description;
//
//         transactionType = await transactionType.save();
//         res.send(transactionType);
//
//     }catch (e) {
//         res.status(500).send(`Exception in updating transactionType by transactionTypeId...${e.message}`);
//     }
// });


function validateTransactionRequest(transaction){
    const schema = Joi.object({
        title : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(50),
        type : Joi.string().required(),
        accountId : Joi.objectId().required(),
        transactionTypeId: Joi.objectId().required(),
        expenseTypeId: Joi.objectId(),
        amount: Joi.number().required().min(0).max(10000000)
    });

    const { title , description, type, accountId, transactionTypeId, expenseTypeId, amount } = transaction;

    return schema.validate({ title , description, type, accountId, transactionTypeId, expenseTypeId, amount } );
}


module.exports = router;