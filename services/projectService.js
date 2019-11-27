/**
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
const projectModel = require('../model/projectModel.js');
const timelineModel = require('../model/timelineModel.js');
const procedureFolderName = 'procedures';
const tasksFolderName = 'tasks';
const procedureImage = 'images/';
const patProjectdir = './public/projects/';

/**
 * Clone a Maestro project and create object models 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
  */
const cloneProjectdir = function (req, res, next) {
  var userSessionDir = patProjectdir + req.sessionID;
  var giturl =req.body.giturl;
  shell.mkdir('-p', patProjectdir, userSessionDir);
  const simpleGit = require('simple-git')(userSessionDir);
 
  simpleGit.clone(giturl, function (err, data) {
    if (err) {
      shell.rm('-Rf', userSessionDir);
      next(new Error(err)); // Pass errors to Express.
    } else {

      var myMaestroProjectDoc = {
        'projectName': path.basename(giturl),
        'projectURL': giturl,
        'userId': req.sessionID,
        'procedureMeta': [],
        'tasksMeta': [],
        'images': []
      };

      var procedureTimeline = {
        'projectName': path.basename(giturl),
        'projectURL': giturl,
        'userId': req.sessionID,
        'timeline': []
      };

      var EvaProcedure = {
        'userId': req.sessionID,
        'columnHeaderText': [],
        'procedureDetails': []
      };
      var EvaTasks = {
        'userId': req.sessionID,
        'tasksDetails': []
      };
     
      // retrieve object from the procedure folder
      var procedureMetaDoc = serviceUtils.patProjectData(userSessionDir, giturl, procedureFolderName, next, req);

      for (var x in procedureMetaDoc) {
        let filename = procedureMetaDoc[x].name;
        let procedureDoc = serviceUtils.JSONData(userSessionDir, giturl, procedureFolderName, filename, next, req);

        myMaestroProjectDoc.procedureMeta.push({
          filename: procedureMetaDoc[x].name,
          path: procedureMetaDoc[x].path,
          procedure_name: procedureDoc.procedure_name
        });

        EvaProcedure.columnHeaderText = serviceUtils.getColumnHeaderTextByActor(procedureDoc.columns);
        EvaProcedure.procedureDetails = procedureDoc;
      }

      // retrieve object from the task folder
      var tasksMetaDoc = serviceUtils.patProjectData(userSessionDir, giturl, tasksFolderName, next, req);

      for (x in tasksMetaDoc) {
        var taskfilename = tasksMetaDoc[x].name;
        var taskDoc = serviceUtils.JSONData(userSessionDir, giturl, tasksFolderName, taskfilename, next, req);

        myMaestroProjectDoc.tasksMeta.push({
          filename: taskfilename,
          title: taskDoc.title,
          path: tasksMetaDoc[x].path
        });

        var tasks = taskDoc.roles;
        for (var t in tasks) {
          var duration = serviceUtils.timeConvert(tasks[t].duration.hours, tasks[t].duration.minutes);

          var obj = _.object(['file', 'title', 'crew', 'hours', 'minutes', 'cellHeight'], [taskfilename, taskDoc.title,
            tasks[t].name, duration.hours, duration.minutes, duration.cellHeight
          ]);
          EvaTasks.tasksDetails.push(obj);
        }

      }
      // retrieve object from the image folder
      var imagedoc = serviceUtils.patProjectData(userSessionDir, giturl, procedureImage, next, req);
      for (x in imagedoc) {
        myMaestroProjectDoc.images.push({
          name: imagedoc[x].name,
          path: imagedoc[x].path
        });
      }

      timelineModel.createObjects(EvaProcedure, EvaTasks, req, next);
      
      projectModel.createProject(userSessionDir, myMaestroProjectDoc, req, res, next);
    }

  });
}; // end module

/* Export method */
module.exports = {
  cloneProjectdir: cloneProjectdir,
};