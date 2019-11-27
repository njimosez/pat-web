/**
 * Controller to route user requests and system responses
 *  request params are passed to the patProjectService  
 * for processing based on the business logic  
 */

const projectService = require('../services/projectService.js');
const timelineModel = require('../model/timelineModel.js');
const projectModel = require('../model/projectModel.js');
const path = require('path');
const {
  check,
  validationResult,
  matchedData,
  body
} = require('express-validator');
const _ = require('underscore');
const urlarray = [
  'https://gitlab.com/xOPERATIONS/sts-134',
  'https://gitlab.com/xOPERATIONS/sts-135',
  'https://gitlab.com/njimosez/sts-134',
  'file:///C:/Users/mosez/Documents/UMUC/Capstone/destino/sts-1341'
];

module.exports = function (app) {
  /* Index page */
  app.get('/', function (req, res, next) {
    projectModel.getProjectUser(req, res, next, req.body.giturl);

  });

  /* Project page */
  app.post('/project',
    body('giturl').custom((value, {
      req
    }) => {
      if (urlarray.indexOf(value) < 0) {
        throw new Error('URL not found in verification array');
      }
      return true;
    }),
    function (req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(new Error('Invalid URL: Not a Recognized Maestro project repository'));
      } else {
        projectService.cloneProjectdir(req, res, next, req.body.giturl);
      }
    });

  /* Project page if project already in local repos*/
  app.get('/projectfiles', function (req, res, next) {
    projectModel.getProjectfiles(req, res, next);
  });

  /* Summary Timeline page */
  app.get('/summary', function (req, res, next) {
    timelineModel.getProjectTimeline(req, res, next);
  });

  app.post('/summary/ordering', function (req, res, next) {
    timelineModel.updateTimeline(req, res, next);
  });

  /* Delete project files */
  app.post('/removeProject', function (req, res, next) {
    timelineModel.removeSessionTimeline(req,next);
    projectModel.deleteProjectFiles(req, res, next);
  });

  app.get('/summary/delete', function (req, res, next) {
    //console.log(req.query.itemId);
    timelineModel.deleteProcedureTask(req, res, next);
  });

  // 
}; // end module.