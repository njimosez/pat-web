/**
 * PAT WEB USE CASE 2 and 4
 * Service to establish a link with a GitLab repository URL, 
 * retrieve a PAT project and pass the data to the browser to 
 * render the project files with a link view a proccedure summary 
 * timeline
 * 
 * */

const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
const dirTree = require('directory-tree')
const serviceUtils = require('../services/serviceUtils.js')
const _ = require('underscore')

const procedureFolderName = 'procedures'
const tasksFolderName = 'tasks'
const procedureImage = 'images/'
const patProjectdir = './public/projects/'
const Datastore = require('nedb')
const db = new Datastore({ filename: 'pat-web.db', autoload: true })

/* Clone Project */
const cloneProjectdir = function (req, res, next, giturl) {
  var userSessionDir = patProjectdir + req.sessionID
  let patsession = { uniqueId: req.sessionID, projectUrl: giturl, projectName: path.basename(giturl) }
  shell.mkdir('-p', patProjectdir, userSessionDir)

  const simpleGit = require('simple-git')(userSessionDir)

  // TODO refactor to use promise
  simpleGit.clone(giturl, function (err, data) {
    if (err) {
      shell.rm('-Rf', userSessionDir)
      next(new Error(err)) // Pass errors to Express.
    }else {
      var myPATProjectDoc = {
        'projectName': path.basename(giturl),
        'projectURL': giturl,
        'userId': req.sessionID,
        'procedures': [
          { }

        ],
        'tasks': [
          { }
        ],
        'images': [
          { }
        ]

      }

      myPATProjectDoc.procedures = serviceUtils.patProjectData(userSessionDir, giturl, procedureFolderName, next, req)
      myPATProjectDoc.tasks = serviceUtils.patProjectData(userSessionDir, giturl, tasksFolderName, next, req)
      myPATProjectDoc.images = serviceUtils.patProjectData(userSessionDir, giturl, procedureImage, next, req),

      db.insert(myPATProjectDoc , function (err, newDoc) {
        if (err) {
          shell.rm('-Rf', userSessionDir)
          next(new Error(err))
        }else {
          res.render('project.html', { sessionDoc: newDoc})
        }
      })
    }
  })
} // end module

const getProjectUser = function (req, res, next) {
  var userSessionDir = patProjectdir + req.sessionID
  var projectUser = {'userId': null,'projectName': null,'projectURL': null}
  db.findOne({ userId: req.sessionID }, function (err, doc) {
    if (_.isEmpty(doc)) {
      res.render('index.html')
    }else {
      projectUser.projectName = doc.projectName
      projectUser.projectURL = doc.projectURL
      projectUser.userId = doc.userId
      res.render('index.html', { sessionDoc: projectUser })
    }
  })
} // end module

const getProjectfiles = function (req, res, next) {
  var userSessionDir = patProjectdir + req.sessionID
  db.findOne({ userId: req.sessionID }, function (err, doc) {
    if (_.isEmpty(doc)) {
      res.render('project.html')
    }else {
      res.render('project.html', { sessionDoc: doc})
    }
  })
} // end module
const getProjectTimeline = function (req, res, next) {
  var userSessionDir = patProjectdir + req.sessionID
  var projectUser = {'userId': null,'projectName': null,'projectURL': null}
  db.findOne({ userId: req.sessionID }, function (err, doc) {
    if (_.isEmpty(doc)) {
      res.render('summary-timeline.html')
    }else {
      projectUser.projectName = doc.projectName
      projectUser.projectURL = doc.projectURL
      projectUser.userId = doc.userId
      res.render('summary-timeline.html', { sessionDoc: projectUser })
    }
  })
}

const deleteProjectFiles = function (req, res, next) {
  var userSessionDir = patProjectdir + req.sessionID
  var projectUser = {'userId': null,'projectName': null,'projectURL': null}
  db.remove({ userId: req.sessionID }, function (err, doc) {
    if (err) {
      next(new Error(err))
    }else {
      shell.rm('-Rf', userSessionDir)
      res.render('index.html')
    }
  })
}

/* Export method */
module.exports = {
  cloneProjectdir: cloneProjectdir,
  projectfiles: getProjectfiles,
  projectUser: getProjectUser,
  projectTimeline: getProjectTimeline,
  deleteProjectFiles: deleteProjectFiles
}
