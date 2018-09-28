const express = require('express');
const mongoose = require('mongoose');
const devicesRouter = require('./devices');
const groupsRouter = require('./groups');

const app = express();
const port = 4000;

mongoose.connect('mongodb://localhost/smartHome');

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
app.use('/devices', devicesRouter);
app.use('/groups', groupsRouter);

app.get('/', (req, res) => {
    res.send('It still works! Boooo')
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});

