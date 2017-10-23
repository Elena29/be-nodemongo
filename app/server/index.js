const express = require('express')
const app = express()
const client = require('mongodb').MongoClient;

app.set('port', 3000)

app.get('/status', (req, res) => {
    console.log(client)
    res.send("Hello World2");
})

app.get('/', function (req, res) {
    res.send("Hello World");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});