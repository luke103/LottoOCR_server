let mongoose = require('mongoose');

module.exports = {

    connection: mongoose
}


/**
 * Create the connection to the db
 */

    //set the global connection object
    var mongoDB = 'mongodb://server:serverpassword@ds121309.mlab.com:21309/lotto';
    mongoose.connect(mongoDB);
    mongoose.Promise = Promise;
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));




/**
 * creates and returns a DataResponseObject made out of the specified parameters.
 * A DataResponseObject has two variables. An error which is a boolean and the results of the query.
 *
 * @param error
 * @param results
 * @return {DataResponseObject<{error, results}>}
 */
