//Packages
var express = require('express');
var mongoose = require('mongoose');

//Configure express app
var app = express();
var port = process.env.PORT||8080;

//Configure routers
var router = express.Router();

//Configure database connection
var connectionString = 'mongodb://127.0.0.1:27017/' + 'guitarpedaldb';
mongoose.connect(connectionString);

//Connection callbacks
mongoose.connection.on('open', function()
                       {
                                console.log('Connection met mongoserver: ' + connectionString);
                                mongoose.connection.db.collectionNames(function(err, names)
                                                                       {
                                    console.log('Collection list:');
                                    console.log(names);
                                });
    
});
mongoose.connection.on('error', function(err)
                       {
                            console.log(err);
});

// require the routes
require('./routes/router')(app, router);

//Start server
app.listen(port);
console.log('Server started at http://127.0.0.1: ' + port);