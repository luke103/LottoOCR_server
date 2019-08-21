/**
 *
 * @return {accessRestrictedArea: accessRestrictedArea}
 */
let lottoResultDBHelper;
module.exports = injectedResultDBHelper => {

    //assign the injectedUserDBHelper to the file's userDBHelper
    lottoResultDBHelper = injectedResultDBHelper;

return{
    getResults: getResults,
}
};

/**
 *
 * This method handles requests to the /enter endpoint of the api.
 * If this method is called it means that the user was successfully authenticated
 * and we can there grant them access to the resricted area that the /enter endpoint
 * protects.
 *
 * It sends a response to the client telling them that they've been granted access
 * to the restricted area.
 *
 * @param req - request from api client
 * @param res - response to respond to client
 */
function getResults(req, res) {

    lottoResultDBHelper.getResults('Lotto').lean().exec(function (err, result) {
        return res.end(JSON.stringify(result));
    })
}
