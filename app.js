const PropertiesReader = require('properties-reader');
const todoRouter = require('./routes/todoRouter');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');

var settings = new PropertiesReader('./application.properties');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/todo', todoRouter);

mongoose.connect(settings.get('db.url'), () => {
    console.log('+ connected to DB');
});

app.listen(settings.get('server.port'), 'localhost', () => {
    console.log('+ server started on port ' + settings.get('server.port'));
});

