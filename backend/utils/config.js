require("dotenv").config();

MONGODB = process.env.MONGODB_URI;

SECRET = process.env.SECRET;

module.exports = { MONGODB, SECRET };
