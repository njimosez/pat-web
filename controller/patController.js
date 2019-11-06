/**
 * Home Controller to route user request and system responses
 *
 */

const patProjectService = require('../services/patProject.service.js')
const path = require('path')
const { check, validationResult } = require('express-validator')
const _ = require('underscore')

// *******************************************************

module.exports = function (app) {

  /* Index page */
  app.get('/', function (req, res, next) {
    patProjectService.projectUser(req, res, next, req.body.giturl)
  })

  /* Project page */
  app.post('/project', [
    // validate entry against a string or modify to use an array or regex
    check('giturl').contains('sts')
  // TODO refer to https://express-validator.github.io/docs/
  ], function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next(new Error('Invalid URL: Not a Recognized PAT project repository'))
    } else {
      patProjectService.cloneProjectdir(req, res, next, req.body.giturl)
    }
  })

  /* Project page if project already in local repos*/
  app.get('/projectfiles', function (req, res, next) {
    patProjectService.projectfiles(req, res, next)
  })

  /* Summary Timeline page */
  app.get('/summary', function (req, res, next) {
    patProjectService.projectTimeline(req, res, next)
  })

  /* Delete project files */
  app.post('/removeProject', function (req, res, next) {
    patProjectService.deleteProjectFiles(req, res, next)
  })
}; // end module.
