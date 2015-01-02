/*-- unit testing op basis van assert en should module ----*/
var http = require('http');
var assert = require("assert");
var should = require('should');
var mongoose = require('mongoose');
var User = require('../models/user');
var Effect = require('../models/effect');
var io = require('socket.io');

var socketURL = 'http://127.0.0.1:8080';

describe('Database', function(){

    before(function(done) {
        // In our tests we use the test db
        mongoose.connect('mongodb://127.0.0.1:27017/' + 'guitarpedaldb');
        done();
    });

    describe('User', function()
    {
        it('should save without error', function(done){
            var user = new User();
            user.name="Test Name";
            user.userName="Test";
            user.email="testemail@hotmail.com";
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
            effect.author="Preben Neirijnck";
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

});
