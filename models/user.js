var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        facebookID:{type: String},
        facebookToken:{type: String},
        email: {type: String, index: { unique: true }},
        password: {type: String},
        userName:{type: String, index: { unique: true }},
        name:{type: String}
    }, {collection:"User"});

module.exports = mongoose.model('User', UserSchema);