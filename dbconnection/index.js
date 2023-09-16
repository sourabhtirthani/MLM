require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB(){
    // Database connection
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('Database connected')
    }).on('error', function (err) {
        console.log(err);
    });
}

module.exports = connectDB;