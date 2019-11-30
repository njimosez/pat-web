/**
 * PAT Application entry point. 
 * the app uses session based authentication. the lightweight
 * embedded document database use for storage 
 * uses the session ID to track user documents/records
 * The app is therefore designed not to map documents to specific
 * users across sessions. If long term persistence is desired,
 * future development should explore implementing a full fledge db 
 * with more robust user authentication 
 * 
 */
const flash = require('flash-express');
const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const uuid = require('uuid/v4');
const session = require('express-session');
const app = express();
const controller = require('../controller/mainController');
const shell = require('shelljs');

//******************************************************* 
//remove all residual documents from a previous session
cleanup();

app.set('view engine', 'njk');

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

//static file setup
app.use(express.static('./public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json());

// Session Middleware 
app.use(session({
  genid: (req) => {
    return uuid(); // use UUIDs for session IDs
  },
  secret: 'pat web',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
    
}));
app.use(flash());
//view/template engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

//Call/fire controllers/routes
controller(app);

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
/** Remove local repository and db files  */
function cleanup() {
  const patProjectdir = './public/projects/';
  shell.rm('-Rf', patProjectdir);
  shell.rm('-Rf', '*.db');
}
//*/
const request = require('supertest');

const expect = require('chai').expect;
const authenticator = request.agent(app, {});

describe('Creating default projects for Testing. ', () => {
  // We are not returning here anything.
  it('Should create a project', (done) => {
    authenticator
    .post("/project")
    .send({"giturl": 'https://gitlab.com/xOPERATIONS/sts-134'})
    .end(function(err, response){
      expect(response.status).to.be.equal(200);
      done();
    });
  });
// It is not sending any status nor message. It is just rendering a page. 
  it('Should not create a project because of invalid url', (done) => {
    authenticator
    .post("/project")
    .send({"giturl": 'https://gitlab.com/xOPERATIONS/sts-14'})
    .end(function(err, response){
        expect(response.text).to.have.string("Invalid URL: Not a Recognized Maestro project repository");
        done();
    });
  });
  it('Remove project, should Pass. Project just created', (done) => {
    authenticator
    .post("/removeProject")
    .send()
    .end(function(error, response){
        expect(response.status).to.be.equal(200);
        done();
    });
  });/*
  it('Should get project files , but will fail as the Project just deleted', (done) => {
    authenticator
    .get("/projectfiles")
    .send()
    .end(function(err, response){
      expect(response.text).to.have.string("Project Files not found for the user");
      done();
    });
  });//*/
  it('Creating the project again for testing projectFiles. It shouldd pass.', (done) => {
    authenticator
    .post("/project")
    .send({"giturl": 'https://gitlab.com/xOPERATIONS/sts-134'})
    .end(function(err, response){
      expect(response.status).to.be.equal(200);
      done();
    });
  });
  it('Should get project files, Should pass because a new project is created above', (done) => {
    authenticator
    .get("/projectfiles")
    .send()
    .end(function(err, response){
      expect(response.status).to.be.equal(200);
      done();
    });
  });/*
  it('Should get project user, This tets case run whenever the project doesnt exist', (done) => {
    authenticator
    .get("/")
    .send()
    .end(function(err, response){
      expect(response.text).to.have.string("Project user profile does not exist");
      done();
    });
  });*/
  it('Should get project user, This tets case run whenever the project exist', (done) => {
    authenticator
    .get("/")
    .send()
    .end(function(err, response){
      expect(response.status).to.be.equal(200);
      done();
    });
  });
});
