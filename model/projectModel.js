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

const createProject = function (userSessionDir, myMaestroProjectDoc, req, res, next) {
  projectdb.insert(myMaestroProjectDoc, function (err, newDoc) {
    if (err) {
      shell.rm('-Rf', userSessionDir);
      next(new Error(err));
    } else {
      res.render('project.html', { sessionDoc: newDoc });
    }
  });

}; // end module

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

const getProjectfiles = function (req, res, next) {
  projectdb.findOne({ userId: req.sessionID }, function (err, doc) {
    if (_.isEmpty(doc)) {
      res.render('project.html');
    } else {
      res.render('project.html', { sessionDoc: doc });
    }
  });
}; // end module

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

const deleteProjectFiles = function (req, res, next) {
  var userSessionDir = './public/projects/' + req.sessionID;
  projectdb.remove({ userId: req.sessionID }, function (err, doc) {
    if (err) {
      next(new Error(err));
    } else {
    //  procedureModel.deleteProcedureDoc(req, res, next);
     // taskModel.deleteTaskDoc(req, res, next);
      shell.rm('-Rf', userSessionDir);

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
