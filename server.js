var express = require('express');
var app = express();

app.use(express.static(__dirname + '/storage'));

app.listen(3000);