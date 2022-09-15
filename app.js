const todoRouter = require('./routes/todoRouter');
const userRouter = require('./routes/userRouter');
const cors = require('cors');
const connectDB = require('./db');
const express = require('express');
const config = require('config');
const auth = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/user', userRouter);
app.use('/todo', auth, todoRouter);

app.listen(config.get('serverPort'), 'localhost', () => {
  console.log('::: server started on port ' + config.get('serverPort'));
});
