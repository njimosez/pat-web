/**
 * Persistance layer of a Pat project model
 * model is an object made of a cloned PAT project procedures and task files 
 * paths, filename and description which is persisted per user session in
 * embedded document database for further CRUD operations
 *   
 * */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const Datastore = require('nedb');
const timelineModel = require('./timelineModel.js');
const projectdb = new Datastore({ filename: 'maestro-project.db', autoload: true });
// flash notification option
var option = { position:"t",  duration:"3000"};

/**
 * 
 * @param {*} userSessionDir "dir created per user session in local projects repo"
 * @param {*} myMaestroProjectDoc "Object derived from parsing a project  metadata "
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const createProject = function (userSessionDir, myMaestroProjectDoc, req, res, next) {
  projectdb.insert(myMaestroProjectDoc, function (err, newDoc) {
    if (err) {
      shell.rm('-Rf', userSessionDir);
      next(new Error(err));
    } else {
      res.flash((myMaestroProjectDoc.projectName).toUpperCase() + ' was sucessfully retrieved','success',option);
      res.render('project.html', { sessionDoc: newDoc });
    }
  });

}; // end module

/**
 * Get the a previously loaded project meta
 *  for the index navigation
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getProjectUser = function (req, res, next) {
  var projectUser = { 'userId': null, 'projectName': null, 'projectURL': null };
  projectdb.findOne({ userId: req.sessionID }, function (err, doc) {
    if (_.isEmpty(doc)) {
      res.render('index.html');
    } else {
      projectUser.projectName = doc.projectName;
      projectUser.projectURL = doc.projectURL;
      projectUser.userId = doc.userId;
      res.render('index.html', { sessionDoc: projectUser });
    }
  });
};

/**
 * Get the project  meta to populate 
 * the navigation menu in project file 
 * page 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getProjectfiles = function (req, res, next) {
  projectdb.findOne({ userId: req.sessionID }, function (err, doc) {
    if (_.isEmpty(doc)) {
      res.render('project.html');
    } else {
      res.render('project.html', { sessionDoc: doc });
    }
  });
}; // end module

/**
 * Get a the project files meta to populate 
 * the navigation menu in the timeline page  
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getProjectTimeline = function (req, res, next) {

  var projectUser = { 'userId': null, 'projectName': null, 'projectURL': null };
  projectdb.findOne({ userId: req.sessionID }, function (err, doc) {
    if (_.isEmpty(doc)) {
      res.render('summary-timeline.html');
    } else {
      projectUser.projectName = doc.projectName;
      projectUser.projectURL = doc.projectURL;
      projectUser.userId = doc.userId;
      res.render('summary-timeline.html', { sessionDoc: projectUser });
    }
  });
};
/**
 * Delete a project document and local session repository
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteProjectFiles = function (req, res, next) {
  var userSessionDir = './public/projects/' + req.sessionID;
  projectdb.remove({ userId: req.sessionID }, function (err, doc) {
    if (err) {
      next(new Error(err));
    } else {
    
      shell.rm('-Rf', userSessionDir);
      res.flash('Project was sucessfully removed','success',option);
      res.render('index.html');
    }
  });
};

/* Export methods */
module.exports = {
  createProject: createProject,
  getProjectfiles: getProjectfiles,
  getProjectUser: getProjectUser,
  getProjectTimeline: getProjectTimeline,
  deleteProjectFiles: deleteProjectFiles
};
