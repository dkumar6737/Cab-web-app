const mongoose = require('mongoose');
require('dotenv').config();



function connectToDb() {
    // In production, support both DB_CONNECT_PROD (specific) or DB_CONNECT (generic fallback)
    const dbConnection = (process.env.NODE_ENV === 'production' && process.env.DB_CONNECT_PROD)
        ? process.env.DB_CONNECT_PROD
        : process.env.DB_CONNECT;

    console.log(`Connecting to DB in ${process.env.NODE_ENV || 'development'} mode...`);

    mongoose.connect(dbConnection
    ).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log(err));
}


module.exports = connectToDb;