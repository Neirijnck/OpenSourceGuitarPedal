//Packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer = require('multer');

//Configure express app
var app = express();
var port = process.env.PORT||8080;

//Set the view engine to ejs
app.set('view engine', 'ejs');

// configure bodyParser to Express
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

require('./config/passport')(passport); //Pass passport for configuration

//All environments
app.use(cookieParser());
app.use(session({ secret: 'guitarpedal', key: 'user', cookie: { maxAge: 60000, secure: false }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon('./public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest:'./uploads/', rename: function (fieldname, filename) {
    return filename + Date.now()
}}));

//Require the routes
require('./routes/router')(app, router, passport);

//Start server
var server = app.listen(port);
var io = require('socket.io').listen(server);


//IO
io.on('connection', function(socket)
{
    console.log('user connected');

    //Sending message
    socket.on('chat message', function(msg)
    {
        io.emit('chat message', msg);
    });

    //Disconnecting
    socket.on('disconnect', function()
    {
        console.log('user disconnected');
    });
});

console.log('Server started at http://127.0.0.1: ' + port);