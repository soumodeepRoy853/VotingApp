const mongoose = require('mongoose')
require('dotenv').config();

//Define mongodb connection URL:
const mongodb = process.env.MONGO_URL

//Setup mongodb connection:
mongoose.connect(mongodb,{
    //useNewUrlParser: true,
    //useUnifiedTopology: true
})

//Get default connection
const db = mongoose.connection; 
 
//Define event listners for database connection

db.on('connected', ()=>{
    console.log("Mongodb connected successfully!")
});
//Export database
module.exports = db;