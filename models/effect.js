var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EffectSchema = new Schema(
    {
        name: {type: String},
        description:{type: String},
        date:{type: Date, default: Date.now},
        rating:{type: Number},
        type:{type: String},
        author:{type: String},
        file:{type: String}
    }, {collection:"Effect"});

module.exports = mongoose.model('Effect', EffectSchema);