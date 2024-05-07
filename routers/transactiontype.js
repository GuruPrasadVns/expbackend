const express = require('express');
const Joi = require('joi');

const { TransactionType } = require('../schemas/transactiontype');
const { validateId } = require('../utility');
const {Transaction} = require("../schemas/transaction");
const router = express.Router();

router.get('/', async (req, res)=>{
    try{
        const transactionTypes = await TransactionType.find();
        res.send(transactionTypes);
    }catch (e) {
        res.status(500).send(`Exception in getting all transaction types...${e.message}`);
    }
});

router.post('/', async (req, res)=>{
    try{
        const { error } = validateTransactionTypeRequest(req.body);
        if(error) return res.status(400).send(`Invalid transactionType...${error}`);

        const { title , description } = req.body;

        const duplicateTransactionType = await TransactionType.findOne({ title });

        if(duplicateTransactionType) return res.status(400).send(`Transaction type with title ${title} is already created`);

        let transactionType = new TransactionType({
            title,
            description
        });

        transactionType = await transactionType.save();
        res.send(transactionType);

    }catch (e) {
        res.status(500).send(`Exception in creating transactionType...${e.message}`);
    }
});

router.get('/:transactionTypeId', async (req, res)=>{
    try{
        if(!validateId(req.params.transactionTypeId))
            return res.status(400).send(`Not a valid transactionTypeId....`);

        const transactionType = await TransactionType.findById(req.params.transactionTypeId);
        if(!transactionType) return res.status(404).send(`transactionType with given id ${req.params.transactionTypeId} was not found.`);

        res.send(transactionType);
    }catch (e) {
        res.status(500).send(`Exception in getting transactionType by transactionTypeId...${e.message}`);
    }
});

router.delete('/:transactionTypeId', async (req, res)=>{
    try{
        if(!validateId(req.params.transactionTypeId))
            return res.status(400).send(`Not a valid transactionTypeId....`);

        let transactionType = await TransactionType.findById(req.params.transactionTypeId);
        if(!transactionType) return res.status(404).send(`transactionType with given id ${req.params.transactionTypeId} was not found.`);

        const transactionTypeTransactions = await Transaction.find({ transactionType : transactionType.title });

        if(transactionTypeTransactions.length > 0) return res.status(401).send(`transactionType cannot be deleted because transactions associated with transactionType are present...`);

        transactionType = await TransactionType.findByIdAndDelete(req.params.transactionTypeId);
        res.send(transactionType);
    }catch (e) {
        res.status(500).send(`Exception in deleting transactionType by transactionTypeId...${e.message}`);
    }
});

router.put('/:transactionTypeId', async (req, res)=>{
    try{
        if(!validateId(req.params.transactionTypeId))
            return res.status(400).send(`Not a valid transactionTypeId....`);

        let transactionType = await TransactionType.findById(req.params.transactionTypeId);
        if(!transactionType) return res.status(404).send(`transactionType with given id ${req.params.transactionTypeId} was not found.`);

        const { error } = validateTransactionTypeRequest(req.body);
        if(error) return res.status(400).send(`Invalid transactionType...${error}`);

        const { title , description } = req.body;

        const duplicateTransactionType = await TransactionType.findOne({ title });

        if(duplicateTransactionType) return res.status(400).send(`Transaction type with title ${title} is already created`);

        transactionType.title = title;
        transactionType.description = description;

        transactionType = await transactionType.save();
        res.send(transactionType);

    }catch (e) {
        res.status(500).send(`Exception in updating transactionType by transactionTypeId...${e.message}`);
    }
});

function validateTransactionTypeRequest(transactionType){
    const schema = Joi.object({
        title : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(50)
    });

    const { title , description } = transactionType;

    return schema.validate({ title , description } );
}


module.exports = router;