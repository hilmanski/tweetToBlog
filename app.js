require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//set up static
app.set('view engine', 'ejs');
app.use(express.static('public'))

const DBName = process.env.DB_NAME ||'blogtweet'

//connect DB
try {
    mongoose.connect(`mongodb://localhost:27017/${DBName}`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log("connected")
        });
} catch (error) {
    console.log("could not connect");
}

//=== routing
require('./route')(app);

app.listen(process.env.PORT || 3000);