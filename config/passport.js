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
        profileFields: ['id', 'name', 'profileUrl', 'picture.type(large)', 'emails', 'gender']
    },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            //Asynchronous
            process.nextTick(function() {

                //Find the user in the database based on their facebook id
                User.findOne({ 'facebookID' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        // set all of the facebook information in our user model
                        newUser.facebookID = profile.id; // set the users facebook id
                        newUser.facebookToken = token; // we will save the token that facebook provides to the user
                        newUser.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.email = profile.emails[0].value;
                        newUser.photo = profile.photos[0].value; // facebook can return multiple photos so we'll take the first
                        newUser.profileUrl = profile.profileUrl;
                        newUser.gender = profile.gender;
                        //newUser.userName = profile.username;

                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};