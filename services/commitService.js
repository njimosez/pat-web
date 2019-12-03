/**
 * Commit Changes to EVA procedure back to a GitLab Respository 
 *  Save back to Gitlab repository has not been fully implemented yet
 */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');
const octokit = require('@octokit/rest')();
const serviceUtils = require('./serviceUtils.js');
const simpleGitPromise = require('simple-git/promise')();
const simpleGit = require('simple-git')();
const _ = require('underscore');
const projectModel = require('../model/projectModel.js');
const timelineModel = require('../model/timelineModel.js');
const procedureFolderName = 'procedures';
const patProjectdir = './public/projects/';
const Datastore = require('nedb');
const proceduredb = new Datastore({ filename: "maestro-procedure.db" });



const commitProject = function (req, res, next) {
   var evaProcedure = [];
   var userSessionDir = patProjectdir + req.sessionID;
   proceduredb.loadDatabase(function (err) {

      proceduredb.findOne({ userId: req.sessionID }, function (err, doc) {

         // remove all values needed for the display
         EvaProcedure = _.without(doc, doc.userId, doc.projectName, doc.columnHeaderText, doc.projectURL, doc.ProcedureFile, doc._id);

         // save the procedure changes to the local repository
         var projectFilePath = userSessionDir + '/' + path.basename(doc.projectURL) + '/' + procedureFolderName + '/' + doc.ProcedureFile;
         var yamldoc = serviceUtils.YAMLData(EvaProcedure, projectFilePath, next, req);


         // change current directory to repo directory in local
         var projectFolderPath = userSessionDir + '/' + path.basename(doc.projectURL) + '/' + procedureFolderName;
         shell.cd(projectFolderPath);
         console.log(projectFolderPath);

         var repo = 'test';


         // User name and password of your GitLaq
         var userName = req.body.username;
         console.log(userName);
         var password = req.body.password;
         console.log(password);

         // Save the project to a new branch and reset the app : Not implemented 

         res.send("Not Implemented");



      });



   });

};


/* Export method */
module.exports = {
   commitProject: commitProject,
};