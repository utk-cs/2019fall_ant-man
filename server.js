//npm install express
//npm install sql

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!'); // This will serve your request to '/'.
});

app.listen(3306, function () {
  console.log('Example app listening on port 3306!');
 });