//Variables
var http = require('http');
var assert = require('assert');
var should = require('should');
var mongoose = require('mongoose');
var User = require('../models/user');
var Effect = require('../models/effect');

//Socket io variables
var io = require('socket.io-client');
var socketLink = 'http://127.0.0.1:8080';
var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe('Database', function(){

    before(function(done) {
        //In our tests we use our db
        mongoose.connect('mongodb://127.0.0.1:27017/' + 'guitarpedaldb');
        done();
    });

    describe('User', function()
    {
        it('should save without error', function(done){
            var user = new User();
            user.name="Test Name";
            user.userName="Test"+Date.now();
            user.email="testemail" + Date.now() + "@hotmail.com";
            user.gender="male";

            user.save(function(err){
                if (err) throw err;
                done();
            });
        })
    });

    describe('Effect', function()
    {
        it('should save without error', function(done)
        {
            var effect = new Effect();
            effect.author="Test Author";
            effect.description="Test";
            effect.name="Test";

            effect.save(function(err)
            {
                if(err) throw err;
                done();
            });
        });
    });
});

describe('Chat', function()
{
    it('should give the number of online clients', function(data)
    {
        var client1 = io.connect(socketLink, options);
        client1.on('disconnect', function(data)
        {
            client1.on('nrClients', function(nrOfClients)
            {
                nrOfClients.should.equal(1);

                client1.disconnect();
            });
        });
    });

    it('should contain an anonymous user and a message', function(done)
    {
        var client1 = io.connect(socketLink, options);
        client1.on('connect', function(socket)
        {
            var client2 = io.connect(socketLink, options);

            client1.emit('chat message', 'test');

            client2.on('chat message', function(data)
            {
                var obj = JSON.parse(data);
                console.log(data);
                obj.should.have.property('msg', 'test');
                obj.user.should.have.property('name', 'anonymous');

                client1.disconnect();
                done();
            });
        });
    });
});
