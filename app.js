//Packages
var express = require('express');
var mongoose = require('mongoose');

//Configure express app
var app = express();
var port = process.env.PORT||8080;

//Configure routers
var router = express.Router();




//Start server
app.listen(port);
console.log('Server started at http://127.0.0.1: ' + port);