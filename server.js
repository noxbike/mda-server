var express = require('express');
var apiRouter = require('./apiRouter').router;
var cookieParser = require('cookie-parser');
var fs = require('fs');
var cors = require('cors');
var app = express();
require('dotenv').config()
var localhost = require('./url.json')

app.use(cors({origin: `http://${localhost.localhost}`, credentials: true}))
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', `http://${localhost.localhost}`);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-xsrf-token,Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
  res.send('Bonjour !');
});

app.use(express.static('data'));

app.use('/api/', apiRouter);

app.listen(4000, function () {
  console.log("Application d'exemple écoutant sur le port 4000 !");
});