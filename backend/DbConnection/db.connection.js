
const mongoose = require("mongoose");
const  logger  = require('../pino_logger');
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const connectDatabase = () => {
  return mongoose.connect(process.env.MONGO)
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((error) => {
      logger.error(error, 'Error connecting to database');
      throw error; 
    });
};

module.exports = connectDatabase;



