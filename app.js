/**
 * PAT Application entry point
 */

const express = require('express')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const uuid = require('uuid/v4')
const session = require('express-session')
const app = express();
const patController = require('./controller/patController');

//******************************************************* 

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

// Session Middleware 
app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  secret: 'pat web',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // one week cookie
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

//view/template engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

//Call/fire controllers/routes
patController(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function (error, req, res, next) {
  res.render('error.html', {
    message: error.message
  });
});

//listening to port
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});
