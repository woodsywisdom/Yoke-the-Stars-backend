const express = require('express');
const app = express();

const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log("Mongoose db up"))
    .catch( err => console.log(err));






app.get('/', (req, res) => res.send('Working'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up on port ${port}`));