const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.get('dbUri'));
    console.log('::: Connected to DB');
  } catch (err) {
    console.log('::: Unable to connect to the DB. ' + err.message);
  }
};

module.exports = connectDB;
