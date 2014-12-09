//Call models
var User = require('../models/user');
var Effect = require('../models/effect');
var Type = require('../models/type');

//Routes
module.exports = function(app, router, passport)
{


    // =====================================
    // PAGES =====================
    // =====================================

    //Homepage
    router.route('/').get(function(req, res)
    {
        res.render('index.ejs');
    });

    //Profile page
    router.route('/profile').get(isLoggedIn, function(req, res) {

        console.log(req.user);

        User.findOne(req.user, function(err, user) {
            console.log(user.email);

            if(err) {
                console.log(err);
            } else {
                res.render('profile.ejs', { user: user});
            };
        });

    });

    //Effectspage
    router.route('/effects').get(function(req,res)
    {
        Effect.find(function(err, effects)
        {
            if(err){console.log(err);}

            res.render('effects.ejs', {effects : effects})
        });
    });


    // =====================================
    // FACEBOOK ROUTES ============
    // =====================================

    //Facebook authentication and login
    router.route('/auth/facebook').get(
        passport.authenticate('facebook'), function(err, user, info)
        {
            if (err) { console.log(err); }
            if (!user) { return res.redirect('/'); }
            req.logIn(user);
        }
    );

    //Handle the callback after facebook has authenticated the user
    router.route('/auth/facebook/callback').get(
        passport.authenticate('facebook', {
            successRedirect:'/profile',
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
            console.log('isLoggedIn');
            return next();}

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
}