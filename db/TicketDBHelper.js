
let mongooseConnection;
let Ticket = require('./models/userTicketModel');
module.exports = injectedMongooseConnection => {

    mongooseConnection = injectedMongooseConnection;

    return {
        saveResult: saveResult,
        getTickets: getTickets,
        getTicket: getTicket
    }
};

/**
 * Saves the accessToken against the user with the specified userID
 * It provides the results in a callback which takes 2 parameters:
 *
 * @param date
 * @param type
 * @param result - takes either an error or null if we successfully saved the accessToken
 */
function saveResult(date, type, result, user_id) {
    return Ticket.find({date: date, type: type, user_id},'_id result',{}).then(dbtickets=>{
        let doesTicketExist = dbtickets !== null ? dbtickets.length > 0 : null;
        if (doesTicketExist === false) {
            let ticketEntity= new Ticket;
            ticketEntity.date=date;
            ticketEntity.type=type;
            ticketEntity.user_id=user_id;
            console.log(result);
            ticketEntity.result=result;
            return ticketEntity.save()

        }else{
            dbtickets[0].result=result;
            console.log(result);
            return dbtickets[0].save;
        }
    })

}

function getTicket(date, type, user_id) {
    return Ticket.find({date: date, type: type, user_id},'_id user_id date result',{})

}

function getTickets(type, user_id) {
console.log(user_id);
    return Ticket.find({type: type, user_id},'_id user_id date result',{})
}