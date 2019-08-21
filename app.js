//var createError = require('http-errors');
var express = require('express');
//var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
let schedule = require('node-schedule');
//var session = require('express-session');
//var flash=require("connect-flash");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var http = require('http');
var https = require('https');
var mongoose = require('./db/mongooseWrapper');
var app = express();
/* This is a library used to help parse the body of the api requests. */


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret: "Shh, its a secret!"}));
//app.use(flash());
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

const bearerTokensDBHelper =
    require('./db/accessTokensDBHelper')
    (mongoose.connection);
const userDBHelper = require('./db/userDBHelper')
(mongoose.connection)
const lottoResultDBHelper = require('./db/lottoResultDBHelper')
(mongoose.connection)
const TicketDBHelper = require('./db/TicketDBHelper')
(mongoose.connection)

/* We require the node-oauth2-server library */
const oAuth2Server = require('node-oauth2-server')

/* Here we instantiate the model we just made and inject the dbHelpers we use in it */
const oAuthModel =
    require('./auth/oauthAccessTokenModel')
    (userDBHelper,
        bearerTokensDBHelper)

/* Now we instantiate the oAuth2Server and pass in an object which tells
the the password library that we're using the password  grant type and
give it the model we just required. */
app.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true
})

/* Here we require the authRoutesMethods object from the module
 that we just made */
const authRoutesMethods =
    require('./auth/authRoutesMethods')
    (userDBHelper)

/* Now we instantiate the authRouter module and inject all
of its dependencies. */
const authRouter =
    require('./auth/auth')
    (express.Router(),
        app,
        authRoutesMethods)
/* require the functions that that will handle requests to
the restrictedAreaRoutes */
const ticketRouterMethods =
    require('./routesMethods/ticketRoutesMethods')(TicketDBHelper);

/* require the constructor for the restrictedAreaRouter.
The router will handle all requestts with a base url of: 'restrictedArea' */
const ticketRouterConstructor = require('./routes/ticketRoutes');

/* instantiate the restrictedAreaRouter using the restrictedAreaRouterConstructor */
const ticketRouter =
    ticketRouterConstructor
    (express.Router(),
        app,
        ticketRouterMethods);

 const resultRouterMethods =
     require('./routesMethods/resultRoutesMethods')(lottoResultDBHelper);

 /* require the constructor for the restrictedAreaRouter.
 The router will handle all requestts with a base url of: 'restrictedArea' */
 const resultRouterConstructor = require('./routes/resultRoutes');

 /* instantiate the restrictedAreaRouter using the restrictedAreaRouterConstructor */
 const resultRouter =
     resultRouterConstructor
     (express.Router(),
         app,
         resultRouterMethods);

app.use('/result', resultRouter);

/* Here we asign the restrictedAreaRouter as middleware in the express app.
 By doing this all request sent to routes that start with /auth
 will be handled by this router*/
app.use('/tickets', ticketRouter);
/* Here we asign the authRouter as middleware in the express app.
 By doing this all request sent to routes that start with /auth
 will be handled by this router*/
app.use('/auth', authRouter);



/* Setup the oAuth error handling */
app.use(app.oauth.errorHandler());




function getResults() {
    var request = https.get("https://app.lotto.pl/wyniki/?type=dl", function (response) {


        var body = "";

        response.on("data", function (chunk) {
            body += chunk;
        });
        response.on("end", function() {
            if (response.statusCode === 200) {
                try {
                    let result = body.split('\n');
                    console.log(result);
                    let numerki=result.slice(1,7);
                    console.log(numerki);
                    lottoResultDBHelper.saveResult(result[0]+' 22:00:00','Lotto',numerki).then(console.log('saved'));
                }catch(error){
                    console.log(error);
                }
            }
        })
    })
}


//User = require('./db/models/userModel')(mongoose.connection);

//User.user.find({'username': 'dupa'}, 'username password', function (err, users) {
///    console.log("dupa")});
schedule.scheduleJob('0 * * * *', ()=>{getResults();});
//getResults();
module.exports = app;

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3001, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})