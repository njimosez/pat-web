/**
 * PAT WEB USE CASE 2 and 4
 * Service to establish a link with a GitLab repository URL, 
 * clone a PAT project, retrieve, process and map the data into objects
 *  The app uses a document database to manipluate and render the data
 *  based on a user request
 *  
 * */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');
const serviceUtils = require('./serviceUtils.js');
const _ = require('underscore');
const projectModel = require('../models/projectModel.js');
const procedureModel = require('../models/procedureModel.js');
const taskModel = require('../models/taskModel.js');
const procedureFolderName = 'procedures';
const tasksFolderName = 'tasks';
const procedureImage = 'images/';
const patProjectdir = './public/projects/';


/* Clone Project */
const cloneProjectdir = function (req, res, next, giturl) {
  var userSessionDir = patProjectdir + req.sessionID;
  shell.mkdir('-p', patProjectdir, userSessionDir);
  const simpleGit = require('simple-git')(userSessionDir);

  // TODO refactor to use promise
  simpleGit.clone(giturl, function (err, data) {
    if (err) {
      shell.rm('-Rf', userSessionDir);
      next(new Error(err)); // Pass errors to Express.
    }else {
// declare pat objects
var myPATProjectDoc = {
  'projectName': path.basename(giturl),
  'projectURL': giturl,
  'userId': req.sessionID,
  'procedureMeta': [ { 'procedure_name': null}],
  'tasksMeta': [{'title': null}],
  'images': [{ }]
};
var EvaProceduresDoc = {'userId': req.sessionID, 'procedure': [{}]};
var EvaTasksDoc = {'userId': req.sessionID, 'task': [{}]};

//retrieve procedure data and push to procedure object 
myPATProjectDoc.procedureMeta = serviceUtils.patProjectData(userSessionDir, giturl, procedureFolderName, next, req);
for (var x in myPATProjectDoc.procedureMeta) {
  var filename = myPATProjectDoc.procedureMeta[x].name;
  var procedureDoc = serviceUtils.JSONData(userSessionDir, giturl, procedureFolderName, filename, next, req);
  EvaProceduresDoc.procedure.push(procedureDoc);
  myPATProjectDoc.procedureMeta[x].procedure_name = procedureDoc.procedure_name
 
}
// retrieve taksdata and push to task object
myPATProjectDoc.tasksMeta = serviceUtils.patProjectData(userSessionDir, giturl, tasksFolderName, next, req);
for (x in myPATProjectDoc.tasksMeta) {
  var taskfilename = myPATProjectDoc.tasksMeta[x].name;
  var taskDoc = serviceUtils.JSONData(userSessionDir, giturl, tasksFolderName, taskfilename, next, req);
  myPATProjectDoc.tasksMeta[x].title = taskDoc.title;
    EvaTasksDoc.task.push({
      filename :taskfilename,
      taskDoc});
}

 // extracting image from retrieved img folder and add to pat object
myPATProjectDoc.images = serviceUtils.patProjectData(userSessionDir, giturl, procedureImage, next, req);

    // persist the objects untill session expiry and render response
    procedureModel.createProcedure(EvaProceduresDoc,req,next);
    taskModel.createTaskDoc(EvaTasksDoc,req, next);
    projectModel.createProject(userSessionDir,myPATProjectDoc,req, res, next);
    }
    });
};// end module

const projectUser = function (req, res, next) {
  projectModel.getProjectUser(req, res, next);
}; 

const projectfiles = function (req, res, next) {
  projectModel.getProjectfiles(req, res, next);
 }; 

const removeProject = function (req, res, next) {
   projectModel.deleteProjectFiles(req, res, next);
 };


/* Export method */
module.exports = {
  cloneProjectdir: cloneProjectdir,
  projectfiles: projectfiles,
  projectUser: projectUser,
  removeProject: removeProject
};
