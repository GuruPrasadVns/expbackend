const express = require('express');
const helmet = require('helmet');
const config = require('config');
require('express-async-errors');

if(!config.get('jwtPrivateKey')){
    console.error(`FATAL Error : jwtPrivateKey is not defined....`)
    process.exit(1);
}

// import db connection
const { connectToMongoDBAtlas } = require('./db');

connectToMongoDBAtlas();

//import routers
const home = require('./routers/home');
const expensetypes = require('./routers/expensetype');
const incometypes = require('./routers/incometype');
const transactiontypes = require('./routers/transactiontype');
const accounts = require('./routers/account');
const transactions = require('./routers/transaction');
const accountBalance = require('./routers/accountbalance');
const fundtransfers = require('./routers/fundtransfer');
const incomes = require('./routers/income');
const expenses = require('./routers/expense');
const users = require('./routers/user');
const auth = require('./routers/auth');
const error = require('./middlewares/error');


const app = express();

//in-built middlewares
app.use(express.json());

// custom middlewares
app.use(helmet());

//use routers

app.use('/', home);
app.use('/api/expensetypes', expensetypes);
app.use('/api/incometypes', incometypes);
// app.use('/api/transactiontypes', transactiontypes);
//app.use('/api/accounts', accounts);
// app.use('/api/transactions', transactions);
// app.use('/api/accountbalance', accountBalance);
// app.use('/api/fundtransfers', fundtransfers);
// app.use('/api/incomes', incomes);
// app.use('/api/expenses', expenses);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`expbackend is listening on port ${port}`));
