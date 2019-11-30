/**
 * Commit Changes to EVA procedure back to a GitLab Respository 
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
const proceduredb = new Datastore({filename: "maestro-procedure.db"});



const commitProject = function (req, res, next) {
 var evaProcedure = [];
 var userSessionDir = patProjectdir + req.sessionID;
    proceduredb.loadDatabase(function (err) { 
                  
     proceduredb.findOne({ userId: req.sessionID }, function (err, doc) {
        
       // remove all values needed for the display
        EvaProcedure = _.without(doc,doc.userId,doc.projectName,doc.columnHeaderText,doc.projectURL,doc.ProcedureFile,doc._id);
        //console.log(EvaProcedure);
      
        var projectFilePath = userSessionDir + '/' + path.basename(doc.projectURL) + '/' + procedureFolderName + '/' + doc.ProcedureFile;
         var yamldoc =   serviceUtils.YAMLData(EvaProcedure,projectFilePath, next, req);

     
           // change current directory to repo directory in local
        var projectFolderPath = userSessionDir + '/' + path.basename(doc.projectURL) + '/' + procedureFolderName;
        shell.cd(projectFolderPath );
        console.log(projectFolderPath);
                
        var repo = req.body.projectName;  //Repo name
        console.log(repo);
        // User name and password of your GitHub
        var userName = req.body.username;
        console.log(userName);
       var password = req.body.password;
       console.log(password );

       // Set up GitHub url like this so no manual entry of user pass needed
       const gitLabUrl = `https://${userName}:${password}@gitlab.com/${userName}/${repo}`;
       simpleGit
       .add('./*')
       .commit("first commit!");
      

       // Add remore repo url as origin to repo
      /*  simpleGitPromise.init();
        simpleGitPromise.addRemote('origin',gitLabUrl);
        // Add all files for commit
  simpleGitPromise.add('.')
  .then(
     (addSuccess) => {
        console.log(addSuccess);
     }, (failedAdd) => {
        console.log('adding files failed');
  });
// Commit files as Initial Commit
simpleGitPromise.commit('Intial commit by simplegit')
 .then(
    (successCommit) => {
      console.log(successCommit);
   }, (failed) => {
      console.log('failed commmit');
});

// Finally push to online repository
simpleGitPromise.push('origin','master')
.then((success) => {
   console.log('repo successfully pushed');
},(failed)=> {
   console.log('repo push failed');
}); */
        res.send(yamldoc);
         
       
         // res.render('project.html', { sessionDoc: doc });
        
      });

  
     
});

};


/* Export method */
module.exports = {
    commitProject: commitProject,
  };