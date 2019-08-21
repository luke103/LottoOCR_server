
let mongooseConnection;
let Result = require('./models/lottoResultModel');
module.exports = injectedMongooseConnection => {

    mongooseConnection = injectedMongooseConnection;

    return {
        saveResult: saveResult,
        getResults: getResults
    }
};

/**
 * Saves the accessToken against the user with the specified userID
 * It provides the results in a callback which takes 2 parameters:
 *
 * @param date
 * @param type
 * @param results - takes either an error or null if we successfully saved the accessToken
 */
function saveResult(date, type, results) {
    return Result.find({date: date, type: type},'_id results',{}).then(dbresults=>{
        let doesResultExist = dbresults !== null ? dbresults.length > 0 : null;
        if (doesResultExist === false) {
            let resultEntity= new Result;
            resultEntity.date=date;
            resultEntity.type=type;
            console.log(results);
            resultEntity.results=results;
            return resultEntity.save()

        }else{
            dbresults[0].results=results;
            console.log(results);
            return dbresults[0].save;
        }
    })

}

function getResults(type) {
    return Result.find({type: type}).sort({date : 'asc'});

}
