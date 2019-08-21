let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let ResultSchema = new Schema({
    date :Date,
    type :String,
    results :[Number]
});

let ResultModel = mongoose.model('Result', ResultSchema );

module.exports = ResultModel;