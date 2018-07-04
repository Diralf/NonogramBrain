const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser());

app.get('/', (req, res) => {
    console.log()
    res.json({
        chance: 5
    });
});

const users = [];

app.post('/users', (req, res) => {
    const {name: name, age: age} = req.body;
    //console.log(req.body);
    users.push({
        name,
        age
    });
    //console.log(users);
    res.send('successfully registered');
});


app.listen(port, (err) => {
    if (err) {
        return console.log('smth bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});

// const http = require('http');
// const port = 3000;

// const requestHandler = (req, res) => {
//     console.log(req.url);
//     res.end('Hello Node.js Server!');
// }

// const server = http.createServer(requestHandler);

// server.listen(port, (err) => {
//     if (err) {
//         return console.log('smth bad happen', err);
//     }

//     console.log(`server is listening on ${port}`);
// })