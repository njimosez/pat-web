/**
 * Home Controller to route user request and system responses
 *
 */

const patProjectService = require('../services/patProject.service.js');
const path = require('path');
const { check, validationResult } = require('express-validator');
const _ = require('underscore');

//******************************************************* 

module.exports = function (app) {
  /* Index page */
  app.get('/', function (req, res,next) {

    patProjectService.projectUser(req, res, next, req.body.giturl);

    // TODO Enable user to delete the project folder and start over 

  });

  /* Project page */
  app.post('/project', [
    // validate entry against a string or modify to use an array or regex
    check('giturl').contains("sts")
    // TODO should use URL instead refer to https://express-validator.github.io/docs/ 
    // check('giturl').isURL('https://gitlab.com/xOPERATIONS')
  ], function (req, res, next) {

    // Finds the validation errors in this request and pass aen error message to the user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error("Invalid URL: Not a Recognized PAT project repository"));
    }

    else {

      patProjectService.cloneProjectdir(req, res, next, req.body.giturl);

    }
    // TODO : removed session project dirafter session expiry  
  });

  /* Project page if project already in local repos*/
  app.get('/projectfiles', function (req, res, next) {

   // console.log(req.query.projectUrl);
  //  res.send(req.query.projectUrl)
    patProjectService.projectfiles(req, res, next);

  });

  /* Summary Timeline page */
  app.get('/summary', function (req, res, next) {
   // console.log(req.query.projectUrl);
   // res.send(req.query.projectUrl)
    patProjectService.projectTimeline(req, res, next)
   

  });


  // res.send("POST")


  //******************************************************* 

}; // end module.

