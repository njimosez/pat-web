const express = require('express')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const uuid = require('uuid/v4')
const session = require('express-session')
const app = express();
const homeController = require('./controller/homeController');

app.set('view engine', 'njk')

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//static file setup
app.use(express.static('./public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())


// add & configure middleware
app.use(session({
    genid: (req) => {
     // console.log(req.sessionID)
      return uuid() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // one week cookie
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }))
/* //use express-session
app.use(session({
 
    // using FileStore with express-session
    // as the sore method, replacing the default memory store
    store: new FileStore({

        path: './session-store'

    }),
    name: '_pat_web', // cookie will show up as foo site
    secret: "Procedure_authoring_thing",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // one week cookie
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
})); */
 

//view/template engine setup
nunjucks.configure('views',{
    autoescape: true,
     express: app
})


//Call/fire controllers/routes

homeController(app);


 


//listening to port
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
console.log('Express server listening on port ' + server.address().port);

});
