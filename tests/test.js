/*-- unit testing op basis van assert en should module ----*/
var http = require('http');
var assert = require("assert");
var should = require('should');
var User = require('../models/user');

describe('User', function(){
    describe('#save()', function(){
        it('should save without error', function(done){
            var user = new User();
            user.name="Test Name";
            user.email="testemail@hotmail.com";
            user.gender="male";

            user.save(function(err){
                if (err) throw err;
                done();
            });
        })
    })
})
