/**
 * Home Controller to route user request and system responses
 *
 */
//******************************************************* 
/**
 * @param  {} '../services/cloneProject.service.js'
 * @param  {} ;constpath=require('path'
 * @param  {} ;const{check
 * @param  {} validationResult}=require('express-validator'
 */
const cloneProjectService = require('../services/cloneProject.service.js');
const path = require('path');
const { check, validationResult } = require('express-validator');

//******************************************************* 

module.exports = function (app) {

  //********************Index page ******************************* 

  app.get('/', function (req, res) {
    res.render('index.html');
    // TODO hide the input form if a project exist in the session
    // TODO Enable user to delete the project folder and start over 

  });

  //**********************Project************************ 
  app.post('/project', [
    // validate entry against a string or modify to use an array or regex
    check('giturl').contains("xOPERATIONS")
    // TODO should use URL instead refer to https://express-validator.github.io/docs/ 
    // check('giturl').isURL('https://gitlab.com/xOPERATIONS')
  ], function (req, res, next) {

    // Finds the validation errors in this request and pass aen error message to the user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error("Invalid URL"));
    }

    // map temp project directory using the session ID /    
    var tmpProjectPath = './public/project/' + req.sessionID;

    // call the clone service if URL validation is succesfull and pass the project files to the user 
    cloneProjectService.cloneProjectdir(req, res, next, tmpProjectPath, req.body.giturl);

    // TODO : removed session project dirafter session expiry  
  });

  //******************************************************* 

}; // end module.