//DB variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Make schema for user
var UserSchema = new Schema(
    {
        facebookID:{type: String},
        facebookToken:{type: String},
        email: {type: String, index: { unique: true }},
        password: {type: String},
        userName:{type: String},
        name:{type: String},
        profileUrl:{type: String},
        photo:{type: String},
        gender:{type: String},
        birthday:{type: Date},
        location: {type: String}
    }, {collection:"User"});

module.exports = mongoose.model('User', UserSchema);