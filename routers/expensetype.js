const express = require('express');
const Joi = require('joi');

const { ExpenseType } = require('../schemas/expensetype');
const { validateId, isUserExists } = require('../utility');
const { Expense } = require("../schemas/expense");
const { User } = require('../schemas/user');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, async (req, res)=>{
        const userId = req.user._id;

        if(!await isUserExists(userId)) return res.status(400).send('User does not exists.');

        const expenseTypes = await ExpenseType.find({userId});

        res.send(expenseTypes);
});

router.post('/', auth, async (req, res)=>{
        const { error } = validateExpenseTypeRequest(req.body);
        if(error) return res.status(400).send(`Invalid expenseType...${error}`);

        const userId = req.user._id;

        if(!await isUserExists(userId)) return res.status(400).send('User does not exists.');

        const { title , description } = req.body;

        const duplicateExpenseType = await ExpenseType.findOne({ title , userId });

        if(duplicateExpenseType) return res.status(400).send(`Expense type with title ${title} is already created for current user.`);

        let expenseType = new ExpenseType({
            title,
            description,
            userId
        });

        expenseType = await expenseType.save();
        res.send(expenseType);
});

router.get('/:expenseTypeId', auth, async (req, res)=>{

        if(!validateId(req.params.expenseTypeId))
            return res.status(400).send(`Not a valid expenseTypeId....`);

        const userId = req.user._id;

        if(!await isUserExists(userId)) return res.status(400).send('User does not exists.');

        const expenseType = await ExpenseType.findOne({_id: req.params.expenseTypeId, userId });
        if(!expenseType) return res.status(404).send(`expenseType with given id ${req.params.expenseTypeId} was not found for current user.`);

        res.send(expenseType);
});

router.delete('/:expenseTypeId', auth, async (req, res)=>{
        if(!validateId(req.params.expenseTypeId))
            return res.status(400).send(`Not a valid expenseTypeId....`);

        const userId = req.user._id;

        if(!await isUserExists(userId)) return res.status(400).send('User does not exists.');

        let expenseType = await ExpenseType.findOne({_id: req.params.expenseTypeId, userId });
        if(!expenseType) return res.status(404).send(`expenseType with given id ${req.params.expenseTypeId} was not found for current user.`);

        const expenseTypeExpense = await Expense.find({ expenseType : expenseType.title, userId });

        if(expenseTypeExpense.length > 0) return res.status(401).send(`expenseType cannot be deleted because expenses associated with expenseType are present for current user...`);

        expenseType = await ExpenseType.findByIdAndDelete(req.params.expenseTypeId);
        res.send(expenseType);
});

router.put('/:expenseTypeId', auth, async (req, res)=>{
        if(!validateId(req.params.expenseTypeId))
            return res.status(400).send(`Not a valid expenseTypeId....`);

        const userId = req.user._id;

        if(!await isUserExists(userId)) return res.status(400).send('User does not exists.');

        let expenseType = await ExpenseType.findOne({_id: req.params.expenseTypeId, userId });
        if(!expenseType) return res.status(404).send(`expenseType with given id ${req.params.expenseTypeId} was not found for current user.`);

        const { error } = validateExpenseTypeRequest(req.body);
        if(error) return res.status(400).send(`Invalid expenseType...${error}`);

        const { title , description } = req.body;

        const duplicateExpenseType = await ExpenseType.findOne({ title , userId });

        if(duplicateExpenseType) return res.status(400).send(`Expense type with title ${title} is already created for current user.`);

        expenseType.title = title;
        expenseType.description = description;

        expenseType = await expenseType.save();
        res.send(expenseType);
});

function validateExpenseTypeRequest(expenseType){
    const schema = Joi.object({
        title : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(255)
    });

    const { title , description } = expenseType;

    return schema.validate({ title , description } );
}


module.exports = router;