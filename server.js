const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./db')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000 

//Import Router files
const userRoute = require('./routes/userRoutes');
const candidateRoute = require('./routes/candidateRoute')

app.use('/user', userRoute)
app.use('/candidate',candidateRoute)

app.listen(PORT, ()=>{
    console.log("app is running on port 3000")
})