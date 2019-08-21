
let mongooseConnection;
let AccessToken = require('./models/accessTokenModel');
module.exports = injectedMongooseConnection => {

    mongooseConnection = injectedMongooseConnection;

    return {
        saveAccessToken: saveAccessToken,
        getUserIDFromBearerToken: getUserIDFromBearerToken
    }
};

/**
 * Saves the accessToken against the user with the specified userID
 * It provides the results in a callback which takes 2 parameters:
 *
 * @param accessToken
 * @param userID
 * @param callback - takes either an error or null if we successfully saved the accessToken
 */
function saveAccessToken(accessToken, userID, callback) {
    return AccessToken.findOne({user_id: userID},'user_id access_token',{}).then(user=>{
            let doesUserExist = user !== null;
            if (doesUserExist === false) {
                console.log(accessToken)
                let newAccessToken=new AccessToken({access_token: accessToken, user_id: userID});
                return newAccessToken.save()
            }else{
                user.access_token=accessToken;

               return user.save();
            }

    })

}

/**
 * Retrieves the userID from the row which has the spcecified bearerToken. It passes the userID
 * to the callback if it has been retrieved else it passes null
 *
 * @param bearerToken
 * @param callback - takes the user id we if we got the userID or null to represent an error
 */
function getUserIDFromBearerToken(bearerToken){
    return AccessToken.findOne({access_token: bearerToken},'user_id', {});
}