var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        email: {type: String, index: { unique: true }},
        password: {type: String},
        userName:{type: String, index: { unique: true }},
    });

module.exports = mongoose.model('User', UserSchema);