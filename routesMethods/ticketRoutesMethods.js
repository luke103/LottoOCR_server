/**
 *
 * @return {accessRestrictedArea: accessRestrictedArea}
 */
let ticketDBHelper;
module.exports = injectedTicketDBHelper => {

    //assign the injectedUserDBHelper to the file's userDBHelper
    ticketDBHelper = injectedTicketDBHelper;

return{
    getTickets: getTickets,
    saveTicket: saveTicket
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
function getTickets(req, res) {

    ticketDBHelper.getTickets('Lotto',req.user.id).lean().exec(function (err, tickets) {
        return res.end(JSON.stringify(tickets));
    })
}

function saveTicket(req, res) {


        res.status(200);
        return res.send(JSON.stringify(ticketDBHelper.saveResult(new Date(),
            req.body.type, req.body.result, req.user.id)));
}