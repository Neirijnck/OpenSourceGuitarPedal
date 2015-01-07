//Strategy
var FacebookStrategy = require('passport-facebook').Strategy;

//Load up the user model
var User = require('../models/user');

//Load the auth variables
var configAuth = require('./auth');

module.exports = function(passport)
{
    //Used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //Used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({

            //Pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'name', 'profileUrl', 'picture.type(large)', 'emails', 'gender', 'location', 'birthday']
        },

        //Facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            //Asynchronous
            process.nextTick(function() {

                //Find the user in the database based on their facebook id
                User.findOne({ 'facebookID' : profile.id }, function(err, user) {

                    //If there is an error, stop everything and return that
                    //Ie an error connecting to the database
                    if (err)
                        return done(err);

                    //If the user is found, then log them in
                    if (user) {
                        return done(null, user); //User found, return that user
                    } else {
                        //If there is no user found with that facebook id, create them
                        var newUser = new User();

                        //Set all of the facebook information in our user model
                        newUser.facebookID = profile.id; //Set the users facebook id
                        newUser.facebookToken = token; //We will save the token that facebook provides to the user
                        newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.email = profile.emails[0].value; //Facebook can return multiple emails so we'll take the first
                        newUser.photo = profile.photos[0].value; //Facebook can return multiple photos so we'll take the first
                        newUser.profileUrl = profile.profileUrl;
                        newUser.gender = profile.gender;
                        newUser.birthday = profile.birthday;
                        newUser.userName = profile.name.givenName + Date.now();
                        if(profile._json.location!=undefined) {
                            newUser.location = profile._json.location.name;
                        }else{newUser.location = "unknown";}


                        //Save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            //If successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};