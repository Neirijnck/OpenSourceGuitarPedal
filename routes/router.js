//Call models
var User = require('../models/user');
var Effect = require('../models/effect');
var Type = require('../models/type');

//Modules
var fs = require('fs');

//Routes
module.exports = function(app, router, passport)
{


    // =====================================
    // PAGES =====================
    // =====================================

    //Homepage
    router.route('/').get(function(req, res)
    {
        var loggedIn = Boolean(req.isAuthenticated());

        //When logged in, pass user to view
        if(loggedIn){
            User.findOne(req.user, function(err, user)
            {
                if (err) {
                    console.log(err);
                } else {
                    res.render('pages/index.ejs', {user: user, isLoggedIn: loggedIn, title: 'Home'});
                }
            });
        }
        else{res.render('pages/index.ejs', {isLoggedIn: loggedIn, title: 'Home'});}
    });

    //Profile page
    router.route('/profile').get(isLoggedIn, function(req, res) {

        console.log(req.user);
        var loggedIn = Boolean(req.isAuthenticated());

        User.findOne(req.user, function(err, user) {
            console.log(user.email);

            if(err) {
                console.log(err);
            } else {
                res.render('pages/profile.ejs', { user: user, isLoggedIn : loggedIn, title: 'My Profile'});
            }
        });
    });

    //Effectspage
    router.route('/effects')

        //Get all effects
        .get(function(req,res)
        {
            var loggedIn = Boolean(req.isAuthenticated());

            //When logged in, pass user to view
            if(loggedIn){
                User.findOne(req.user, function(err, user)
                {
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                        Effect.find(function(err, effects)
                        {
                            if(err){console.log(err);}

                            Type.find(function(err, types)
                            {
                                if(err){console.log(err);}
                                res.render('pages/effects.ejs', {effects : effects, types : types, isLoggedIn : loggedIn, user: user, title: 'Effects'})
                            });
                        });
                    }})}
            else
            {
                Effect.find(function(err, effects)
                {
                    if(err){console.log(err);}

                    Type.find(function(err, types)
                    {
                        if(err){console.log(err);}
                        res.render('pages/effects.ejs', {effects : effects, types : types, isLoggedIn : loggedIn, title: 'Effects'})
                    });
                });
            }
        });



    //New effect page
    router.route('/neweffect')

        .get(isLoggedIn, function(req,res)
        {
            Type.find(function(err, types)
            {

                var loggedIn = Boolean(req.isAuthenticated());

                User.findOne(req.user, function(err, user)
                {
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                        if (err) {
                            console.log(err);
                        }
                        res.render('pages/neweffect.ejs', {types: types, isLoggedIn: loggedIn, user: user, title: 'New Effect'});
                    }})
            })
        })

        .post(isLoggedIn, function(req, res)
        {
            User.findOne(req.user, function(err, user) {
                if (err) {
                    console.log(err);
                }
                else
                {
                    var effect = new Effect();
                    effect.name = req.body.effect.name;
                    effect.description = req.body.effect.description;
                    effect.rating = -1; //Default not rated yet
                    effect.type = req.body.effect.type; //This should be id of the type
                    effect.author = user.name;

                    fs.readFile(req.body.effect.file, function (err, data) {
                        // ...
                        console.log(data);
                        var newPath = __dirname + "/uploads/uploadedFileName";
                        fs.writeFile(newPath, data, function (err)
                        {
                            //res.redirect("back");
                        });
                    });

                    effect.save(function(err) {
                        if (err)
                            return res.send(err);

                        res.redirect('/effects');
                    });
                }
            });
        });


    // =====================================
    // FACEBOOK ROUTES ============
    // =====================================

    //Facebook authentication and login
    router.route('/auth/facebook').get(
        passport.authenticate('facebook', { scope: [ 'email' ] }), function(err, user, info)
        {
            if (err) { console.log(err); }
            if (!user) { return res.redirect('/'); }
            req.logIn(user);
        }
    );

    //Handle the callback after facebook has authenticated the user
    router.route('/auth/facebook/callback').get(
        passport.authenticate('facebook', {
            successRedirect:'/',
            failureRedirect : '/'
        }));

    //Route for logging out
    router.route('/logout').get(function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()){
            console.log('isLoggedIn=true');
            return next();}
        console.log("isAuthenticated is false");

        // if they aren't redirect them to the home page
        res.redirect('/');
    }



    // =====================================
    // API =====================
    // =====================================

    //All uploaded effects
    router.route('/alleffects')
        .get(function(req, res)
        {

            Effect.find(function(err, effects)
            {
                res.json(effects);
            });
        });

    //All types of effects
    router.route('/alltypes').get(function(req, res)
    {
        Type.find({}).exec(function(err, types)
        {
            res.json(types);
        });
    });

    app.use('/', router);
};