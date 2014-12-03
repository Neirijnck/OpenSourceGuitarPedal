var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypeSchema = new Schema(
    {
        name:  String,
        description: String
    });

module.exports = mongoose.model('Type', TypeSchema);