//Call models
var User = require('../models/user');
var Effect = require('../models/effect');
var Type = require('../models/type');

//Routes
module.exports = function(app, router)
{
    //Homepage
    router.get('/', function(req, res)
               {
                        res.json({"message":"homepage"});
    });
    
    //Alle upgeloade effecten
    router.route('/alleffects')
        .get(function(req, res)
                                {
                                        Effect.find(function(err, effects)
                                                    {
                                                        res.json(effects);
                                        });
    });
    
    //All types effecten
    router.route('/alltypes').get(function(req, res)
                                  {
                                        Type.find(function(err, types){
                                                   res.json(types);
                                        });
    });
    
    app.use('/', router);    
}