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
    router.get('/', function(req, res)
    {
        //res.json({"message":"homepage"});
        res.render('index.ejs');
    });

    //Profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });



    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================

    //Facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    //Handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    //Route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

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