let mongooseConnection;
let bcrypt = require('bcrypt');
let User;

module.exports = injectedMongooseConnection => {

    mongooseConnection = injectedMongooseConnection;
    User = require('./models/userModel')(mongooseConnection).user;
    return {

        registerUserInDB: registerUserInDB,
        getUserFromCrentials: getUserFromCrentials,
        doesUserExist: doesUserExist
    }
};

/**
 * attempts to register a user in the DB with the specified details.
 * it provides the results in the specified callback which takes a
 * DataResponseObject as its only parameter
 *
 * @param username
 * @param password
 * @param registrationCallback - takes a DataResponseObject
 */
function registerUserInDB(username, password){
        let newUser = new User({username: username, password: password});
         return newUser.save();
}

/**
 * Gets the user with the specified username and password.
 * It provides the results in a callback which takes an:
 * an error object which will be set to null if there is no error.
 * and a user object which will be null if there is no user
 *
 * @param username
 * @param password
 * @param callback - takes an error and a user object
 */
function getUserFromCrentials(username, password) {

    return User.find({'username': username}, 'username password', {}).then(users => {
        return new Promise((resolve, reject) => {
            if (users.length>0){
            bcrypt.compare(password, users[0].password, function (err, res) {
                if (res===true)
                return resolve(users[0]);
                else
                    reject();
            })
            }else reject();
        });
    })
}

/**
 * Determines whether or not user with the specified userName exists.
 * It provides the results in a callback which takes 2 parameters:
 * an error object which will be set to null if there is no error, and
 * secondly a boolean value which says whether or the user exists.
 * The boolean value is set to true if the user exists else it's set
 * to false or it will be null if the results object is null.
 *
 * @param username
 * @param callback - takes an error and a boolean value indicating
 *                   whether a user exists
 */
function doesUserExist(username) {

    return User.find({'username': username}, 'username password',{})
        // function (err, users) {
        //     let doesUserExist = users !== null ? users.length > 0 : null;
        //     if (err)
        //         console.log(err+" error");
        //         return reject(err);
        //     console.log(doesUserExist+" exists");
        //     resolve (doesUserExist)
        // });
}

function createDataResponseObject(error, results) {

    return {
        error: error,
        results: results === undefined ? null : results === null ? null : results
    }
}