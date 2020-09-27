var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Bonjour !');
});

app.listen(4000, function () {
  console.log("Application d'exemple écoutant sur le port 4000 !");
});