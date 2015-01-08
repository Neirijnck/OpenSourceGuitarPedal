//Call models
var User = require('../models/user');
var Effect = require('../models/effect');
var Type = require('../models/type');

//Modules
var fs = require('fs');
var path = require('path');

//Routes
module.exports = function(app, router, passport)
{

    // =====================================
    // PAGES =====================
    // =====================================

    //Homepage
    router.route('/').get(function(req, res)
    {
        req.session.lastPage='/';

        var loggedIn = Boolean(req.isAuthenticated());

        //When logged in, pass user to view
        if(loggedIn){
            User.findOne(req.user, function(err, user)
            {
                if (err) {
                    console.log(err);
                } else {
                    res.render('pages/index.ejs', {user: user, isLoggedIn: loggedIn, title: 'Home | Arduino Guitar Pedal'});
                }
            });
        }
        else{res.render('pages/index.ejs', {isLoggedIn: loggedIn, title: 'Home | Arduino Guitar Pedal'});}
    });

    //Profile page
    router.route('/profile')

        .get(isLoggedIn, function(req, res) {
            req.session.lastPage='/profile';

            console.log(req.user);
            var loggedIn = Boolean(req.isAuthenticated());

            User.findOne(req.user, function(err, user) {
                console.log(user.email);

                if(err)
                {
                    console.log(err);
                } else
                {
                    //Find the effects for the logged in user
                    Effect.find({author:user.name}).exec(function(err, myEffects)
                    {
                        //Get all the types from database
                        Type.find(function(err, types) {
                            if (err) {
                                console.log(err);
                            }
                            res.render('pages/profile.ejs', {
                                user: user,
                                isLoggedIn: loggedIn,
                                title: 'My Profile | Arduino Guitar Pedal',
                                myEffects: myEffects,
                                types: types
                            });
                        });
                    });
                }
            });
        })

        //Delete own effect
        .post(function(req, res)
        {
            var effectID = req.body.effect.id;
            Effect.find({_id: effectID}).exec(function(err, effect)
            {
                var path = './uploads/' + effect[0].file;
                fs.unlink(path, function(err)
                {
                    if(err){console.log(err);}
                    //Remove it from database
                    Effect.remove({_id: effectID}).exec(function(err)
                    {
                        if(err){console.log(err);}
                        res.redirect('/profile');
                    });
                });
            });
        });


    //Effectspage
    router.route('/effects')

        //Get all effects
        .get(function(req,res)
        {
            req.session.lastPage='/effects';
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
                        //Get all the effects from database
                        Effect.find(function(err, effects)
                        {
                            if(err){console.log(err);}

                            //Get all the types from database
                            Type.find(function(err, types)
                            {
                                if(err){console.log(err);}
                                res.render('pages/effects.ejs', {effects : effects, types : types, isLoggedIn : loggedIn, user: user, title: 'Effects | Arduino Guitar Pedal'})
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
                        res.render('pages/effects.ejs', {effects : effects, types : types, isLoggedIn : loggedIn, title: 'Effects | Arduino Guitar Pedal'})
                    });
                });
            }
        })

        //Download selected effect
        .post(function(req, res)
        {
            var effectID = req.body.effect.id;
            console.log(effectID);

            //Find the desired effect in database
            Effect.find({_id: effectID}).exec(function(err, effect)
            {
                if(err)
                {
                    res.render('pages/error.ejs');
                }
                else
                {
                    //Find path via effect property
                    var file = './uploads/' + effect[0].file;
                    //console.log(file);
                    //
                    //var filename = path.basename(file);
                    //res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                    //
                    ////Download desired effect
                    //var filestream = fs.createReadStream(file);
                    //filestream.pipe(res);

                    res.download(file);
                }
            });
        })

        //Update effect rating
        .put(function(req,res)
        {
            var effectID = req.body.id;
            var rating = req.body.rating;

            //Find the desired effect in database
            Effect.find({_id: effectID}).exec(function(err, effect)
            {
                if (err) {
                    res.render('pages/error.ejs');
                }
                else
                {
                    //console.log(effect[0]);
                    effect[0].rating = rating;
                    effect[0].timesRated = effect[0].timesRated+1;

                    //Save updated effect in database
                    effect[0].save(function(err)
                    {
                        if (err)
                            console.log(err);
                    });
                }
            });

        });


    //New effect page
    router.route('/neweffect')

        .get(isLoggedIn, function(req,res)
        {
            req.session.lastPage='/neweffect';
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
                        res.render('pages/neweffect.ejs', {types: types, isLoggedIn: loggedIn, user: user, title: 'New Effect | Arduino Guitar Pedal'});
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
                    //Add new effect with properties from form
                    var effect = new Effect();
                    effect.name = req.body.effect.name;
                    effect.description = req.body.effect.description;
                    effect.rating = 0; //Default not rated yet
                    effect.timesRated = 0; //Default not rated yet
                    effect.type = req.body.effect.type; //This should be id of the type
                    effect.author = user.name;
                    effect.file = req.files.fileEffect.name;

                    //Save effect in database
                    effect.save(function(err)
                    {
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
    router.route('/auth/facebook').get(function(req,res){
        passport.authenticate('facebook', { session: true, scope: [ 'email', 'user_birthday', 'user_location' ] }), function(err, user, info)
        {
            if (err) { console.log(err); }
            if (!user) { return res.redirect(req.session.lastPage); }
            req.logIn(user);
        }}
    );

    //Handle the callback after facebook has authenticated the user
    router.route('/auth/facebook/callback').get(function(req,res){
        passport.authenticate('facebook', {
            session: true,
            successRedirect:req.session.lastPage,
            failureRedirect:req.session.lastPage
        })});

    //Route for logging out
    router.route('/logout').get(function(req, res) {
        req.logout();
        res.redirect(req.session.lastPage);
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



    // =====================================
    // ERROR HANDLING =====================
    // =====================================

    //Catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    //Error handler
    app.use(function (err, req, res, next)
    {
        var loggedIn = Boolean(req.isAuthenticated());

        res.status(err.status || 500);

        User.findOne(req.user, function(error, user) {
            if (error) {
                console.log(error);
            }
            else
            {
                res.render('pages/error', {
                    message: err.message,
                    error: {},
                    title: 'Error | Arduino Guitar Pedal',
                    isLoggedIn: loggedIn,
                    user: user
                });
            }
        });
    });
};