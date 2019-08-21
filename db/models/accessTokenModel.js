var mongoose = require('mongoose');

let Schema = mongoose.Schema;
let AccessTokenSchema = new Schema({
    user_id: String,
    access_token: String
});
let AccessToken = mongoose.model('AccessToken',AccessTokenSchema);

module.exports = AccessToken;