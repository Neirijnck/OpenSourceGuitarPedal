var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypeSchema = new Schema(
    {
        name:  String,
        description: String
    }, {collection:"Type"});

module.exports = mongoose.model('Type', TypeSchema);