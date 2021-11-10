const mongoose = require('mongoose');

async function dbConnect(connectionString) {
    return await mongoose.connect(connectionString);
}


module.exports = dbConnect;

