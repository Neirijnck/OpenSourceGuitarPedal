//DB variables
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Make schema for type
var TypeSchema = new Schema(
    {
        name:  String,
        description: String
    }, {collection:"Type"});

module.exports = mongoose.model('Type', TypeSchema);