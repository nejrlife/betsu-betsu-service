require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.set('view engine', 'ejs');
// app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.get('/', (req, res) => {
  // res.download('server.js');
  // res.status(500).json({ message: 'Error' });
  res.render('index', { text: 'World' });
});

// const userRouter = require('./routes/users');
// const customersRouter = require('./routes/customers');

// app.use('/customers', customersRouter);
// app.use('/users', userRouter);

const memberRouter = require('./routes/members');
const loginUsersRouter = require('./routes/loginUsers');
const accountsRouter = require('./routes/accounts');
const customersRouter = require('./routes/customers');

app.use('/customers', customersRouter);
app.use('/members', memberRouter);
app.use('/loginUsers', loginUsersRouter);
app.use('/accounts', accountsRouter);

function logger(req, res, next) {
  next();
}
app.listen(3000);