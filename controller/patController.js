/**
 * Controller to route user requests and system responses
 *  request params are passed to the patProjectService  
 * for processing based on the business logic  
 */

const patProjectService = require('../services/patProjectservice.js');
const patSummaryService = require('../services/patSummaryservice.js');
const path = require('path');
const { check, validationResult, matchedData, body } = require('express-validator');
const _ = require('underscore');
const urlarray = [
  'https://gitlab.com/xOPERATIONS/sts-134',
  'https://gitlab.com/xOPERATIONS/sts-135'
]

module.exports = function (app) {
  /* Index page */
  app.get('/', function (req, res, next) {
    patProjectService.projectUser(req, res, next, req.body.giturl);

  });

  /* Project page */
  app.post('/project', 
    body('giturl').custom((value, {req}) => {
      console.log('Success: body().custom() ran. ' + urlarray + " : " + value);
      if (urlarray.indexOf(value) < 0){
        console.log('Success: urlarray function crashed as intended.');
        throw new Error('URL not found in verification array');
      }
      console.log('Success: urlarray function ran as intended.');
      return true;
    })/*,
    [// TODO validate entry against a string or modify to use an array or regex
      // refer to https://express-validator.github.io/docs/ 
      check('giturl').contains('sts')]*/
    , function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error('Invalid URL: Not a Recognized PAT project repository'));
    } else {
      patProjectService.cloneProjectdir(req, res, next, req.body.giturl);
    }
  });

  /* Project page if project already in local repos*/
  app.get('/projectfiles', function (req, res, next) {
    patProjectService.projectfiles(req, res, next);
  });

  /* Summary Timeline page */
  app.get('/summary', function (req, res, next) {
    patSummaryService.projectTimeline(req, res, next);
  });

  /* Delete project files */
  app.post('/removeProject', function (req, res, next) {
    patProjectService.removeProject(req, res, next);
  });

}; // end module.
