/**
 * Controller to route user requests and system responses
 *  request params are passed to the patProjectService  
 * for processing based on the business logic  
 */

const patProjectService = require('../services/patProjectservice.js');
const patSummaryService = require('../services/patSummaryservice.js');
const path = require('path');
const { check, validationResult } = require('express-validator');
const _ = require('underscore');
const Datastore = require('nedb');
var urldb = new Datastore({ filename: 'pat-url.db', autoload: true });

module.exports = function (app) {
  /* Index page */
  app.get('/', function (req, res, next) {
    patProjectService.projectUser(req, res, next, req.body.giturl);

  });

  /* Project page */
  app.post('/project', [
    // TODO validate entry against a string or modify to use an array or regex
    // refer to https://express-validator.github.io/docs/ 
    check('giturl').contains('sts')
  ], function (req, res, next) {
    urldb.find({}, function(err, docs) {
      const errors = validationResult(req);
      var errorcount2 = 0;
      docs.forEach(function(d) {
        if(req.body.giturl.localeCompare(d.url) == 0){
            errorcount2++;
            console.log('Match Found!')
        }
      });
      if (errorcount2!=1 || !errors.isEmpty()) {
        next(new Error('Invalid URL: Not a Recognized PAT project repository'));
      } else {
        patProjectService.cloneProjectdir(req, res, next, req.body.giturl);
      }
    });
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
