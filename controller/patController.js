/**
 * Home Controller to route user request and system responses
 *
 */

const cloneProjectService = require('../services/cloneProject.service.js');
const path = require('path');
const { check, validationResult } = require('express-validator');
const _ = require('underscore');
const db = require('../models');
//******************************************************* 

module.exports = function (app) {
  /* Index page */
  app.get('/', function (req, res) {
    return db.User.findOne({
      where: { uniqueId: req.sessionID }
    }).then((User) => res.render('index.html', { project: User }))
      .catch((err) => {
        console.log('There was an error querying users', JSON.stringify(err))
        return next(err)
      });

    // TODO Enable user to delete the project folder and start over 

  });

  /* Project page */
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

    else {

      cloneProjectService.cloneProjectdir(req, res, next, req.body.giturl);

    }
    // TODO : removed session project dirafter session expiry  
  });

  /* Project page if project already in local repos*/
  app.get('/projectfiles', function (req, res, next) {
    cloneProjectService.tempProjectdir(req, res, req.query.projectUrl);

  });

  /* Summary Timeline page */
  app.get('/summary', function (req, res, next) {
    res.render('summary-timeline.html')

  });


  // res.send("POST")


  //******************************************************* 

}; // end module.

