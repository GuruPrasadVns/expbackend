const express = require('express');

const { Account } = require('../schemas/account');
const router = express.Router();

router.get("/", async(req, res)=>{
    try{
        const accounts = await Account.find();
        let totalBalance = 0;
        for(let account of accounts){
            totalBalance += account.balance;
        }
        totalBalance = totalBalance.toFixed(2);
        const accountsBalance = { totalBalance };
        res.send(accountsBalance);
    }catch (e) {
        res.status(500).send(`Exception in getting all accounts balance...${e.message}`);
    }
});

module.exports = router;