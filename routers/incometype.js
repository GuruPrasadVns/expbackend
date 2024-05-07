const express = require('express');
const Joi = require('joi');

const { IncomeType } = require('../schemas/incometype');
const { validateId } = require('../utility');
const { Income } = require("../schemas/income");
const { User } = require('../schemas/user');
const auth = require('../middlewares/auth');


const router = express.Router();

router.get('/', auth, async (req, res)=>{
    const userId = req.user._id;

    const isUserExist = await User.findById(userId);
    if(!isUserExist) return res.status(400).send('User does not exists.');

    const incomeTypes = await IncomeType.find({userId});
    res.send(incomeTypes);
});

router.post('/', auth, async (req, res)=>{
    const { error } = validateIncomeTypeRequest(req.body);
    if(error) return res.status(400).send(`Invalid incomeType...${error}`);

    const userId = req.user._id;

    const isUserExist = await User.findById(userId);
    if(!isUserExist) return res.status(400).send('User does not exists.');

    const { title , description } = req.body;

    const duplicateIncomeType = await IncomeType.findOne({ title , userId });

    if(duplicateIncomeType) return res.status(400).send(`Income type with title ${title} is already created for current user.`);

    let incomeType = new IncomeType({
        title,
        description,
        userId
    });

    incomeType = await incomeType.save();
    res.send(incomeType);
});

router.get('/:incomeTypeId', auth, async (req, res)=>{
    if(!validateId(req.params.incomeTypeId))
        return res.status(400).send(`Not a valid incomeTypeId....`);

    const userId = req.user._id;

    const isUserExist = await User.findById(userId);
    if(!isUserExist) return res.status(400).send('User does not exists.');

    const incomeType = await IncomeType.findOne({_id: req.params.incomeTypeId, userId });
    if(!incomeType) return res.status(404).send(`incomeType with given id ${req.params.incomeTypeId} was not found for current user.`);

    res.send(incomeType);
});

router.delete('/:incomeTypeId', auth, async (req, res)=>{
    if(!validateId(req.params.incomeTypeId))
        return res.status(400).send(`Not a valid incomeTypeId....`);

    const userId = req.user._id;

    const isUserExist = await User.findById(userId);
    if(!isUserExist) return res.status(400).send('User does not exists.');

    let incomeType = await IncomeType.findOne({_id: req.params.incomeTypeId, userId });
    if(!incomeType) return res.status(404).send(`incomeType with given id ${req.params.incomeTypeId} was not found for current user.`);

    const incomeTypeIncome = await Income.find({ incomeType : incomeType.title, userId });

    if(incomeTypeIncome.length > 0) return res.status(401).send(`incomeType cannot be deleted because income associated with incomeType are present for current user...`);

    incomeType = await IncomeType.findByIdAndDelete(req.params.incomeTypeId);
    res.send(incomeType);
});

router.put('/:incomeTypeId', auth, async (req, res)=>{
    if(!validateId(req.params.incomeTypeId))
        return res.status(400).send(`Not a valid incomeTypeId....`);

    const userId = req.user._id;

    const isUserExist = await User.findById(userId);
    if(!isUserExist) return res.status(400).send('User does not exists.');

    let incomeType = await IncomeType.findOne({_id: req.params.incomeTypeId, userId });
    if(!incomeType) return res.status(404).send(`incomeType with given id ${req.params.incomeTypeId} was not found for current user.`);

    const { error } = validateIncomeTypeRequest(req.body);
    if(error) return res.status(400).send(`Invalid incomeType...${error}`);

    const { title , description } = req.body;

    const duplicateIncomeType = await IncomeType.findOne({ title , userId });

    if(duplicateIncomeType) return res.status(400).send(`Income type with title ${title} is already created for current user.`);

    incomeType.title = title;
    incomeType.description = description;

    incomeType = await incomeType.save();
    res.send(incomeType);
});

function validateIncomeTypeRequest(incomeType){
    const schema = Joi.object({
        title : Joi.string().required().min(5).max(50),
        description : Joi.string().required().min(5).max(255)
    });

    const { title , description } = incomeType;

    return schema.validate({ title , description } );
}


module.exports = router;