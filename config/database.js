require('dotenv').config();

module.exports = {
  url: process.env.MONGO_URL,
  dbName: process.env.DB_NAME
};

