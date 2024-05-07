const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('expbackend root router is working');
});


module.exports = router;