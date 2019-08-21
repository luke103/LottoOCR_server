/**
 *
 * @param router - we assign routes and endpoint functions for each route
 *                  to this object.
 *
 * @param expressApp - we use the expressApp to apply the auth
 * protection using its oauth.authorise() method.
 *
 * @param restrictedAreaRoutesMethods - an object
 * we're going to create in a minute that will
 * provide the endpoint function for the route
 *
 * @return {router} The method returns a router with populated with the '/enter' route
 */
module.exports =  (router, expressApp, ticketRoutesMethods) => {

    //Here we declare the route for the protected area and we apply the auth protecion
    //by passing expressApp.oauth.authorise() in the second parameter
    router.get('/tickets',
        expressApp.oauth.authorise(),
        ticketRoutesMethods.getTickets)
    router.post('/tickets',
        expressApp.oauth.authorise(),
        ticketRoutesMethods.saveTicket)
    return router
}